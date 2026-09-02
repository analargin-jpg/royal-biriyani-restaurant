'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Check, X, RefreshCw, Flame, Utensils } from 'lucide-react';
import { menuApi } from '../lib/api';

export default function MenuManager() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Biriyani',
    price: '',
    description: '',
    dietaryType: 'non-veg',
    imageEmoji: '🍛',
    isPopular: false
  });

  const categories = ['Biriyani', 'Fast Food & Noodles', 'Starters & Gravy', 'Beverages & Desserts', 'Specials'];

  const fetchMenu = async () => {
    try {
      setLoading(true);
      const res = await menuApi.getMenuItems();
      if (res && res.data) {
        setItems(res.data);
      }
    } catch (err) {
      console.error('Menu load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      category: 'Biriyani',
      price: '',
      description: '',
      dietaryType: 'non-veg',
      imageEmoji: '🍛',
      isPopular: false
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      price: item.price,
      description: item.description || '',
      dietaryType: item.dietaryType || 'non-veg',
      imageEmoji: item.imageEmoji || '🍛',
      isPopular: Boolean(item.isPopular)
    });
    setIsModalOpen(true);
  };

  const handleToggle = async (item) => {
    try {
      await menuApi.toggleAvailability(item._id);
      setItems(prev => prev.map(i => i._id === item._id ? { ...i, isAvailable: !i.isAvailable } : i));
    } catch (err) {
      alert('Error toggling status: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this menu item?')) return;
    try {
      await menuApi.deleteMenuItem(id);
      setItems(prev => prev.filter(i => i._id !== id));
    } catch (err) {
      alert('Error deleting item: ' + err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        const res = await menuApi.updateMenuItem(editingItem._id, formData);
        setItems(prev => prev.map(i => i._id === editingItem._id ? res.data : i));
      } else {
        const res = await menuApi.createMenuItem(formData);
        setItems(prev => [res.data, ...prev]);
      }
      setIsModalOpen(false);
    } catch (err) {
      alert('Error saving menu item: ' + err.message);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top action bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
        <div>
          <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
            <Utensils className="w-5 h-5 text-royal-crimson" /> Menu &amp; Catalog Management
          </h2>
          <p className="text-xs text-gray-500">
            Add new dishes, update pricing, and toggle instant item availability.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={fetchMenu}
            className="p-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-700 transition"
            title="Refresh menu items"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 bg-royal-crimson hover:bg-royal-crimson-dark text-white text-xs font-bold rounded-xl shadow transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add New Dish
          </button>
        </div>
      </div>

      {/* Menu Items Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-500 font-extrabold uppercase border-b border-gray-200">
              <tr>
                <th className="px-5 py-4">Item</th>
                <th className="px-5 py-4">Category</th>
                <th className="px-5 py-4">Price</th>
                <th className="px-5 py-4">Type</th>
                <th className="px-5 py-4">Availability</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {items.map((item) => (
                <tr key={item._id || item.name} className="hover:bg-gray-50 transition">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{item.imageEmoji || '🍛'}</span>
                      <div>
                        <p className="font-extrabold text-gray-900 text-sm">{item.name}</p>
                        <p className="text-gray-400 text-[11px] line-clamp-1">{item.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-gray-600 font-semibold">{item.category}</td>
                  <td className="px-5 py-4 font-black text-royal-crimson text-sm">₹{item.price}</td>
                  <td className="px-5 py-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      item.dietaryType === 'veg' ? 'bg-emerald-100 text-emerald-800' :
                      item.dietaryType === 'egg' ? 'bg-amber-100 text-amber-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {item.dietaryType || 'non-veg'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => handleToggle(item)}
                      className={`px-3 py-1 rounded-full text-[11px] font-bold transition flex items-center gap-1 ${
                        item.isAvailable
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${item.isAvailable ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                      {item.isAvailable ? 'In Stock' : 'Sold Out'}
                    </button>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="Edit Dish"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Delete Dish"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h3 className="text-lg font-black text-royal-crimson">
                {editingItem ? 'Edit Dish' : 'Add New Menu Dish'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Dish Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Mutton Chukka Biriyani"
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-crimson focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-crimson focus:outline-none bg-white"
                  >
                    {categories.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="280"
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-crimson focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Dietary Type</label>
                  <select
                    value={formData.dietaryType}
                    onChange={(e) => setFormData({ ...formData, dietaryType: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-crimson focus:outline-none bg-white"
                  >
                    <option value="non-veg">Non-Veg</option>
                    <option value="veg">Veg</option>
                    <option value="egg">Egg</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Emoji Icon</label>
                  <input
                    type="text"
                    value={formData.imageEmoji}
                    onChange={(e) => setFormData({ ...formData, imageEmoji: e.target.value })}
                    placeholder="🍛"
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-crimson focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Aromatic basmati rice cooked with..."
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-crimson focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isPopular"
                  checked={formData.isPopular}
                  onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                  className="rounded text-royal-crimson focus:ring-royal-crimson"
                />
                <label htmlFor="isPopular" className="text-xs font-bold text-gray-700">
                  Mark as Bestseller / Popular Dish
                </label>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-bold text-xs rounded-xl hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-royal-crimson text-white font-bold text-xs rounded-xl hover:bg-royal-crimson-dark transition shadow"
                >
                  {editingItem ? 'Save Changes' : 'Create Dish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
