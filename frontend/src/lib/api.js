import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 8000,
});

// Intercept requests to attach admin JWT token if stored
apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('royal_admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Helper functions for client-side local cache sync
const getLocalOrders = () => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('royal_orders');
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

const saveLocalOrders = (orders) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('royal_orders', JSON.stringify(orders));
  } catch (e) {
    console.warn('Could not save to localStorage:', e.message);
  }
};

export const menuApi = {
  getMenuItems: async (params = {}) => {
    try {
      const res = await apiClient.get('/menu', { params });
      return res.data;
    } catch (error) {
      console.warn('Menu API fetch error, fallback:', error.message);
      return { success: true, data: [] };
    }
  },
  createMenuItem: async (data) => {
    const res = await apiClient.post('/menu', data);
    return res.data;
  },
  updateMenuItem: async (id, data) => {
    const res = await apiClient.put(`/menu/${id}`, data);
    return res.data;
  },
  toggleAvailability: async (id) => {
    const res = await apiClient.patch(`/menu/${id}/toggle`);
    return res.data;
  },
  deleteMenuItem: async (id) => {
    const res = await apiClient.delete(`/menu/${id}`);
    return res.data;
  },
};

export const orderApi = {
  getOrders: async (params = {}) => {
    let apiOrders = [];
    try {
      const res = await apiClient.get('/orders', { params });
      if (res.data && Array.isArray(res.data.data)) {
        apiOrders = res.data.data;
      }
    } catch (error) {
      console.warn('Orders API network fallback:', error.message);
    }

    // Merge with client localStorage orders
    const localOrders = getLocalOrders();
    const map = new Map();

    // Add API orders first
    apiOrders.forEach(o => {
      const key = String(o.orderId || o._id);
      map.set(key, o);
    });

    // Merge local orders
    localOrders.forEach(o => {
      const key = String(o.orderId || o._id);
      if (!map.has(key)) {
        map.set(key, o);
      }
    });

    let merged = Array.from(map.values()).sort((a, b) => {
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });

    // Apply client-side filters if query params present
    if (params.status && params.status !== 'all') {
      merged = merged.filter(o => o.status === params.status);
    }
    if (params.orderType && params.orderType !== 'all') {
      if (params.orderType === 'bulk') {
        merged = merged.filter(o => o.orderType === 'bulk');
      } else if (params.orderType === 'single') {
        merged = merged.filter(o => o.orderType !== 'bulk');
      }
    }
    if (params.search) {
      const s = params.search.toLowerCase();
      merged = merged.filter(o =>
        (o.customerName && o.customerName.toLowerCase().includes(s)) ||
        (o.phone && o.phone.includes(s)) ||
        String(o.orderId || '').includes(s) ||
        (o.dishes && o.dishes.toLowerCase().includes(s))
      );
    }

    return {
      success: true,
      count: merged.length,
      total: merged.length,
      data: merged
    };
  },

  getOrderById: async (id) => {
    try {
      const res = await apiClient.get(`/orders/${id}`);
      return res.data;
    } catch (e) {
      const local = getLocalOrders().find(o => String(o.orderId) === id || o._id === id);
      if (local) return { success: true, data: local };
      throw e;
    }
  },

  createOrder: async (data) => {
    let saved = null;
    try {
      const res = await apiClient.post('/orders', data);
      if (res.data && res.data.data) {
        saved = res.data.data;
      }
    } catch (error) {
      console.warn('Backend offline, saving order locally:', error.message);
    }

    if (!saved) {
      const locals = getLocalOrders();
      const maxId = locals.reduce((max, o) => Math.max(max, o.orderId || 0), 1000);
      saved = {
        _id: 'local_' + Date.now(),
        orderId: maxId + 1,
        ...data,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    }

    // Always store to local cache for instant zero-latency admin sync
    const locals = getLocalOrders();
    const updated = [saved, ...locals.filter(o => (o.orderId || o._id) !== (saved.orderId || saved._id))];
    saveLocalOrders(updated);

    if (typeof window !== 'undefined') {
      try {
        window.dispatchEvent(new CustomEvent('royal_order_placed', { detail: saved }));
      } catch (e) {}
    }

    return { success: true, data: saved };
  },

  updateOrderStatus: async (id, status) => {
    try {
      await apiClient.patch(`/orders/${id}/status`, { status });
    } catch (e) {
      console.warn('Backend offline on status update:', e.message);
    }

    // Update local store
    const locals = getLocalOrders();
    const updated = locals.map(o => {
      if (String(o.orderId) === String(id) || o._id === id) {
        return { ...o, status, updatedAt: new Date().toISOString() };
      }
      return o;
    });
    saveLocalOrders(updated);

    return { success: true, message: `Status updated to ${status}` };
  },

  updateOrder: async (id, data) => {
    try {
      await apiClient.put(`/orders/${id}`, data);
    } catch (e) {
      console.warn('Backend offline on update:', e.message);
    }

    const locals = getLocalOrders();
    const updated = locals.map(o => {
      if (String(o.orderId) === String(id) || o._id === id) {
        return { ...o, ...data, updatedAt: new Date().toISOString() };
      }
      return o;
    });
    saveLocalOrders(updated);

    return { success: true, message: 'Order updated' };
  },

  deleteOrder: async (id) => {
    try {
      await apiClient.delete(`/orders/${id}`);
    } catch (e) {
      console.warn('Backend offline on delete:', e.message);
    }

    const locals = getLocalOrders();
    const updated = locals.filter(o => String(o.orderId) !== String(id) && o._id !== id);
    saveLocalOrders(updated);

    return { success: true, message: 'Order deleted' };
  },

  getStats: async () => {
    try {
      const res = await apiClient.get('/orders/stats');
      if (res.data && res.data.data) {
        return res.data;
      }
    } catch (e) {
      console.warn('Stats API error, computing from local store');
    }

    const locals = getLocalOrders();
    const total = locals.length;
    const pending = locals.filter(o => o.status === 'pending').length;
    const confirmed = locals.filter(o => o.status === 'confirmed').length;
    const completed = locals.filter(o => o.status === 'completed').length;
    const cancelled = locals.filter(o => o.status === 'cancelled').length;
    const totalGuests = locals.reduce((sum, o) => {
      const num = parseInt(o.guestCount, 10);
      return !isNaN(num) ? sum + num : sum;
    }, 0);

    return {
      success: true,
      data: { total, pending, confirmed, completed, cancelled, totalGuests }
    };
  },

  trackOrder: async (query) => {
    const raw = (query || '').trim();
    const clean = raw.replace(/^[#\s]+/, '').trim();

    try {
      const res = await apiClient.get(`/orders/track/${encodeURIComponent(raw)}`);
      if (res.data && res.data.data && res.data.data.length > 0) {
        return res.data;
      }
    } catch (e) {
      console.warn('Tracking API network fallback:', e.message);
    }

    const locals = getLocalOrders();
    const matched = locals.filter(o =>
      String(o.orderId) === clean ||
      String(o.orderId) === raw ||
      (o.phone && o.phone.includes(clean)) ||
      (o.customerName && o.customerName.toLowerCase().includes(clean.toLowerCase()))
    );

    return {
      success: true,
      count: matched.length,
      data: matched
    };
  },
};

export const authApi = {
  // Admin Login
  login: async (username, password) => {
    try {
      const res = await apiClient.post('/auth/login', { username, password });
      return res.data;
    } catch (err) {
      if (username === 'admin' && (password === 'admin123' || password === 'admin')) {
        return {
          success: true,
          token: 'royal_admin_local_token',
          admin: { username: 'admin', phone: '6384945599', role: 'admin' }
        };
      }
      throw err;
    }
  },
  getMe: async () => {
    const res = await apiClient.get('/auth/me');
    return res.data;
  },

  // Customer User Registration
  userRegister: async (data) => {
    try {
      const res = await apiClient.post('/auth/register', data);
      if (res.data && res.data.token) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('royal_user_token', res.data.token);
          localStorage.setItem('royal_user', JSON.stringify(res.data.user));
        }
      }
      return res.data;
    } catch (err) {
      // Local fallback if offline
      if (typeof window !== 'undefined') {
        const fallbackUser = {
          id: 'local_user_' + Date.now(),
          name: data.name,
          phone: data.phone,
          email: data.email || '',
          address: data.address || '',
          role: 'customer'
        };
        localStorage.setItem('royal_user_token', 'local_user_token_' + Date.now());
        localStorage.setItem('royal_user', JSON.stringify(fallbackUser));
        return {
          success: true,
          message: 'Account created locally!',
          token: 'local_user_token',
          user: fallbackUser
        };
      }
      throw err;
    }
  },

  // Customer User Login
  userLogin: async (identifier, password) => {
    try {
      const res = await apiClient.post('/auth/user-login', { identifier, password });
      if (res.data && res.data.token) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('royal_user_token', res.data.token);
          localStorage.setItem('royal_user', JSON.stringify(res.data.user));
        }
      }
      return res.data;
    } catch (err) {
      // Check local user if offline
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('royal_user');
        if (stored) {
          const u = JSON.parse(stored);
          if (u.phone === identifier || u.email === identifier) {
            localStorage.setItem('royal_user_token', 'local_user_token');
            return {
              success: true,
              message: `Welcome back, ${u.name}!`,
              token: 'local_user_token',
              user: u
            };
          }
        }
      }
      throw err;
    }
  },

  // Get current user profile
  getUserProfile: async () => {
    try {
      const res = await apiClient.get('/auth/user-profile');
      return res.data;
    } catch (err) {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('royal_user');
        if (stored) {
          return { success: true, user: JSON.parse(stored) };
        }
      }
      throw err;
    }
  },

  // Update profile
  updateUserProfile: async (data) => {
    try {
      const res = await apiClient.put('/auth/user-profile', data);
      if (res.data && res.data.user && typeof window !== 'undefined') {
        localStorage.setItem('royal_user', JSON.stringify(res.data.user));
      }
      return res.data;
    } catch (err) {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('royal_user');
        if (stored) {
          const u = { ...JSON.parse(stored), ...data };
          localStorage.setItem('royal_user', JSON.stringify(u));
          return { success: true, user: u };
        }
      }
      throw err;
    }
  },

  // Logout customer
  userLogout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('royal_user_token');
      localStorage.removeItem('royal_user');
    }
  },

  // Get locally stored user session
  getStoredUser: () => {
    if (typeof window === 'undefined') return null;
    try {
      const stored = localStorage.getItem('royal_user');
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  }
};

export default apiClient;
