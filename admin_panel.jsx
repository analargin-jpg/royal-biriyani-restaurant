import React, { useState, useEffect } from 'react';

const AdminPanel = () => {
  const [orders, setOrders] = useState([
    {
      id: 1,
      name: 'Rajesh Kumar',
      phone: '9876543210',
      eventDate: '2024-09-15',
      eventTime: '18:00',
      guestCount: '100',
      dishes: 'Biriyani Special, Noodles, Starters',
      address: 'Chennai, Tamil Nadu',
      status: 'pending',
      timestamp: new Date().toLocaleString()
    }
  ]);

  const [newOrder, setNewOrder] = useState({
    name: '',
    phone: '',
    eventDate: '',
    eventTime: '',
    guestCount: '',
    dishes: '',
    address: ''
  });

  const [filter, setFilter] = useState('all');
  const [adminPhone] = useState('6384945599');

  const handleAddOrder = (e) => {
    e.preventDefault();
    const order = {
      id: orders.length + 1,
      ...newOrder,
      status: 'pending',
      timestamp: new Date().toLocaleString()
    };
    setOrders([order, ...orders]);
    setNewOrder({ name: '', phone: '', eventDate: '', eventTime: '', guestCount: '', dishes: '', address: '' });
  };

  const handleStatusChange = (id, status) => {
    setOrders(orders.map(order => order.id === id ? { ...order, status } : order));
  };

  const handleWhatsAppMessage = (order) => {
    const message = `🎉 Order Confirmation from Royal Biriyani\n\n✅ Order ID: #${order.id}\n👤 Name: ${order.name}\n📅 Event Date: ${order.eventDate}\n🕐 Time: ${order.eventTime}\n👥 Guests: ${order.guestCount}\n🍽️ Menu: ${order.dishes}\n📍 Location: ${order.address}\n\nWe will contact you shortly with pricing & confirmation.`;
    const encodedMsg = encodeURIComponent(message);
    window.open(`https://wa.me/${order.phone}?text=${encodedMsg}`, '_blank');
  };

  const handleAdminNotification = (order) => {
    const message = `📋 NEW BULK ORDER RECEIVED\n\n🆔 Order ID: #${order.id}\n👤 Customer: ${order.name}\n📱 Phone: ${order.phone}\n📅 Date: ${order.eventDate}\n🕐 Time: ${order.eventTime}\n👥 Guests: ${order.guestCount}\n🍽️ Menu: ${order.dishes}\n📍 Address: ${order.address}`;
    const encodedMsg = encodeURIComponent(message);
    window.open(`https://wa.me/${adminPhone}?text=${encodedMsg}`, '_blank');
  };

  const filteredOrders = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5', padding: '20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ backgroundColor: '#990000', color: 'white', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
          <h1 style={{ margin: '0 0 5px 0', fontSize: '28px', fontWeight: 'bold' }}>🍛 Royal Biriyani Admin Panel</h1>
          <p style={{ margin: '0', fontSize: '14px', color: '#FFD700' }}>Manage Bulk Orders & Customer Requests</p>
          <div style={{ marginTop: '10px', padding: '10px', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '6px', fontSize: '13px' }}>
            📱 Admin WhatsApp: <strong>{adminPhone}</strong>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginBottom: '30px' }}>
          {[
            { label: 'Total Orders', value: orders.length, color: '#D4AF37' },
            { label: 'Pending', value: orders.filter(o => o.status === 'pending').length, color: '#FFA500' },
            { label: 'Confirmed', value: orders.filter(o => o.status === 'confirmed').length, color: '#4CAF50' },
            { label: 'Completed', value: orders.filter(o => o.status === 'completed').length, color: '#2196F3' }
          ].map((stat, idx) => (
            <div key={idx} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', border: `3px solid ${stat.color}`, textAlign: 'center' }}>
              <p style={{ margin: '0', fontSize: '12px', color: '#666', textTransform: 'uppercase' }}>{stat.label}</p>
              <p style={{ margin: '10px 0 0 0', fontSize: '32px', fontWeight: 'bold', color: stat.color }}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Add New Order Form */}
        <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '8px', marginBottom: '30px', border: '2px solid #D4AF37' }}>
          <h2 style={{ margin: '0 0 20px 0', color: '#990000', fontSize: '20px', fontWeight: 'bold' }}>➕ Add New Order Manually</h2>
          <form onSubmit={handleAddOrder} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
            <input type="text" placeholder="Customer Name" value={newOrder.name} onChange={(e) => setNewOrder({...newOrder, name: e.target.value})} required style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px' }} />
            <input type="tel" placeholder="Phone Number" value={newOrder.phone} onChange={(e) => setNewOrder({...newOrder, phone: e.target.value})} required style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px' }} />
            <input type="date" value={newOrder.eventDate} onChange={(e) => setNewOrder({...newOrder, eventDate: e.target.value})} required style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px' }} />
            <input type="time" value={newOrder.eventTime} onChange={(e) => setNewOrder({...newOrder, eventTime: e.target.value})} required style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px' }} />
            <select value={newOrder.guestCount} onChange={(e) => setNewOrder({...newOrder, guestCount: e.target.value})} required style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px' }}>
              <option value="">Guest Count</option>
              <option>50</option>
              <option>100</option>
              <option>250</option>
              <option>500+</option>
            </select>
            <input type="text" placeholder="Dishes/Menu" value={newOrder.dishes} onChange={(e) => setNewOrder({...newOrder, dishes: e.target.value})} required style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px' }} />
            <input type="text" placeholder="Delivery Address" value={newOrder.address} onChange={(e) => setNewOrder({...newOrder, address: e.target.value})} required style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px' }} />
            <button type="submit" style={{ gridColumn: 'span 1', backgroundColor: '#990000', color: 'white', padding: '10px', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}>Add Order</button>
          </form>
        </div>

        {/* Filter Buttons */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
          {['all', 'pending', 'confirmed', 'completed'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              style={{
                padding: '10px 20px',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 'bold',
                cursor: 'pointer',
                backgroundColor: filter === status ? '#990000' : '#ddd',
                color: filter === status ? 'white' : '#333',
                fontSize: '14px'
              }}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)} ({filteredOrders.length})
            </button>
          ))}
        </div>

        {/* Orders List */}
        <div>
          {filteredOrders.length === 0 ? (
            <div style={{ backgroundColor: 'white', padding: '40px', textAlign: 'center', borderRadius: '8px' }}>
              <p style={{ color: '#999', fontSize: '16px' }}>No orders to display</p>
            </div>
          ) : (
            filteredOrders.map(order => (
              <div key={order.id} style={{ backgroundColor: 'white', padding: '20px', marginBottom: '15px', borderRadius: '8px', border: `3px solid ${order.status === 'completed' ? '#4CAF50' : order.status === 'confirmed' ? '#2196F3' : '#FFA500'}`, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '15px' }}>
                  <div>
                    <p style={{ margin: '0 0 5px 0', fontSize: '11px', color: '#999', textTransform: 'uppercase' }}>Order ID</p>
                    <p style={{ margin: '0', fontSize: '16px', fontWeight: 'bold', color: '#990000' }}>#{order.id}</p>
                  </div>
                  <div>
                    <p style={{ margin: '0 0 5px 0', fontSize: '11px', color: '#999', textTransform: 'uppercase' }}>Status</p>
                    <select value={order.status} onChange={(e) => handleStatusChange(order.id, e.target.value)} style={{ padding: '6px', borderRadius: '4px', border: '1px solid #ddd', fontWeight: 'bold', color: '#990000', cursor: 'pointer' }}>
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px', marginBottom: '15px' }}>
                  <div>
                    <p style={{ margin: '0 0 3px 0', fontSize: '11px', color: '#999', textTransform: 'uppercase' }}>Customer</p>
                    <p style={{ margin: '0', fontSize: '14px', fontWeight: 'bold' }}>{order.name}</p>
                  </div>
                  <div>
                    <p style={{ margin: '0 0 3px 0', fontSize: '11px', color: '#999', textTransform: 'uppercase' }}>Phone</p>
                    <p style={{ margin: '0', fontSize: '14px' }}>
                      <a href={`tel:${order.phone}`} style={{ color: '#990000', textDecoration: 'none', fontWeight: 'bold' }}>📱 {order.phone}</a>
                    </p>
                  </div>
                  <div>
                    <p style={{ margin: '0 0 3px 0', fontSize: '11px', color: '#999', textTransform: 'uppercase' }}>Event Date</p>
                    <p style={{ margin: '0', fontSize: '14px' }}>{order.eventDate} @ {order.eventTime}</p>
                  </div>
                  <div>
                    <p style={{ margin: '0 0 3px 0', fontSize: '11px', color: '#999', textTransform: 'uppercase' }}>Guest Count</p>
                    <p style={{ margin: '0', fontSize: '14px', fontWeight: 'bold' }}>👥 {order.guestCount} Guests</p>
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <p style={{ margin: '0 0 3px 0', fontSize: '11px', color: '#999', textTransform: 'uppercase' }}>Menu</p>
                    <p style={{ margin: '0', fontSize: '14px' }}>{order.dishes}</p>
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <p style={{ margin: '0 0 3px 0', fontSize: '11px', color: '#999', textTransform: 'uppercase' }}>Delivery Address</p>
                    <p style={{ margin: '0', fontSize: '14px' }}>📍 {order.address}</p>
                  </div>
                </div>

                <p style={{ margin: '0 0 15px 0', fontSize: '12px', color: '#666' }}>📅 Received: {order.timestamp}</p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                  <button onClick={() => handleWhatsAppMessage(order)} style={{ padding: '10px', backgroundColor: '#25D366', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}>
                    💬 Send to Customer
                  </button>
                  <button onClick={() => handleAdminNotification(order)} style={{ padding: '10px', backgroundColor: '#990000', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}>
                    📢 Notify Admin ({adminPhone})
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#f0f0f0', borderRadius: '8px', textAlign: 'center', fontSize: '12px', color: '#666' }}>
          <p style={{ margin: '0' }}>Royal Biriyani & Fast Food Admin Dashboard | © 2024</p>
          <p style={{ margin: '5px 0 0 0' }}>For support, contact: <strong>+91 74185 25405</strong></p>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
