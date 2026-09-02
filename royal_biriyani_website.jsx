import React, { useState } from 'react';
import { ChevronRight, MapPin, Phone, ShoppingCart, Menu, X, Send, Users, Calendar, Utensils } from 'lucide-react';

const RoyalBiriyani = () => {
  const [activeCategory, setActiveCategory] = useState('Biriyani');
  const [cart, setCart] = useState([]);
  const [bulkFormData, setBulkFormData] = useState({
    name: '',
    phone: '',
    eventDate: '',
    eventTime: '',
    guestCount: '',
    dishes: '',
    address: ''
  });
  const [menuOpen, setMenuOpen] = useState(false);

  const menuItems = {
    'Biriyani': [
      { name: 'Mutton Biriyani', price: '₹280', desc: 'Aromatic basmati with tender mutton' },
      { name: 'Chicken Biriyani', price: '₹240', desc: 'Fragrant rice with spiced chicken' },
      { name: 'Kabab Biriyani', price: '₹300', desc: 'Royal blend with seekh kababs' },
      { name: 'Kushka', price: '₹250', desc: 'Premium biriyani special preparation' }
    ],
    'Fast Food & Noodles': [
      { name: 'Chicken Rice', price: '₹150', desc: 'Flavored rice with tender chicken' },
      { name: 'Egg Rice', price: '₹120', desc: 'Fried rice with scrambled eggs' },
      { name: 'Chicken Noodles', price: '₹140', desc: 'Stir-fried noodles with chicken' },
      { name: 'Egg Noodles', price: '₹110', desc: 'Crispy noodles with egg' }
    ],
    'Starters & Gravy': [
      { name: 'Chicken Fry', price: '₹180', desc: 'Spicy fried chicken pieces' },
      { name: 'Chicken Leg Piece', price: '₹160', desc: 'Tender & juicy leg fry' },
      { name: 'Liver Fry', price: '₹150', desc: 'Crispy liver delicacy' },
      { name: 'Kadai Fry', price: '₹200', desc: 'Restaurant specialty fry' },
      { name: 'Egg Masala', price: '₹140', desc: 'Boiled eggs in gravy' },
      { name: 'Chicken Masala', price: '₹220', desc: 'Tender chicken in rich gravy' }
    ]
  };

  const addToCart = (item) => {
    setCart([...cart, item]);
  };

  const handleBulkFormChange = (e) => {
    const { name, value } = e.target;
    setBulkFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBulkSubmit = (e) => {
    e.preventDefault();
    const message = `*Bulk Order Request*\n\n👤 *Name:* ${bulkFormData.name}\n📱 *Phone:* ${bulkFormData.phone}\n📅 *Event Date:* ${bulkFormData.eventDate}\n🕐 *Event Time:* ${bulkFormData.eventTime}\n👥 *Guest Count:* ${bulkFormData.guestCount}\n🍽️ *Dishes/Menu:* ${bulkFormData.dishes}\n📍 *Delivery Address:* ${bulkFormData.address}`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/917418525405?text=${encodedMessage}`, '_blank');
  };

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50" style={{ '--gold': '#D4AF37', '--crimson': '#990000', '--charcoal': '#1A1A1A' }}>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-xl" style={{ backgroundColor: '#990000' }}>
              🍛
            </div>
            <div>
              <h1 className="font-bold text-lg" style={{ color: '#990000' }}>Royal Biriyani</h1>
              <p className="text-xs text-gray-600">Authentic South Indian</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <button onClick={() => scrollToSection('menu')} className="text-gray-700 hover:text-red-700 font-medium">Menu</button>
            <button onClick={() => scrollToSection('bulk')} className="text-gray-700 hover:text-red-700 font-medium">Bulk Orders</button>
            <button onClick={() => scrollToSection('contact')} className="text-gray-700 hover:text-red-700 font-medium">Contact</button>
            <button className="relative">
              <ShoppingCart className="w-6 h-6 text-gray-700" />
              {cart.length > 0 && <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{cart.length}</span>}
            </button>
          </nav>

          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden">
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 p-4 space-y-3">
            <button onClick={() => scrollToSection('menu')} className="block w-full text-left py-2 text-gray-700">Menu</button>
            <button onClick={() => scrollToSection('bulk')} className="block w-full text-left py-2 text-gray-700">Bulk Orders</button>
            <button onClick={() => scrollToSection('contact')} className="block w-full text-left py-2 text-gray-700">Contact</button>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative h-80 md:h-96 overflow-hidden">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: 'linear-gradient(135deg, #990000 0%, #D4AF37 100%)',
            opacity: 0.9
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
        <div className="relative h-full flex flex-col items-center justify-center text-center text-white px-4 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">Royal Biriyani & Fast Food</h2>
          <p className="text-lg md:text-xl" style={{ color: '#D4AF37' }}>🌟 Taste the Royalty in Every Grain! 🌟</p>
          <div className="flex flex-col md:flex-row gap-4 mt-6">
            <button className="px-8 py-3 bg-white text-red-700 font-bold rounded-lg hover:bg-gray-100 transition flex items-center justify-center gap-2">
              <Utensils className="w-5 h-5" /> Order Online
            </button>
            <button onClick={() => scrollToSection('bulk')} className="px-8 py-3 border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition flex items-center justify-center gap-2">
              📞 Book Bulk Orders
            </button>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="py-16 max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-2" style={{ color: '#990000' }}>Our Menu</h2>
        <p className="text-center text-gray-600 mb-8">Authentic South Indian Flavors, Freshly Prepared</p>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {Object.keys(menuItems).map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2 rounded-full font-semibold transition ${
                activeCategory === category
                  ? 'text-white'
                  : 'border border-gray-300 text-gray-700 hover:border-red-600'
              }`}
              style={{
                backgroundColor: activeCategory === category ? '#990000' : 'transparent'
              }}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems[activeCategory].map((item, idx) => (
            <div key={idx} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition border border-gray-100">
              <div className="h-40 bg-gradient-to-br from-red-100 to-yellow-100 flex items-center justify-center text-5xl">
                🍲
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg" style={{ color: '#990000' }}>{item.name}</h3>
                <p className="text-gray-600 text-sm mb-3">{item.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold" style={{ color: '#D4AF37' }}>{item.price}</span>
                  <button
                    onClick={() => addToCart(item)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-semibold"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bulk Order Section */}
      <section id="bulk" className="py-16 bg-gradient-to-r from-red-50 to-yellow-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-8 text-center" style={{ backgroundColor: '#990000' }}>
              <h2 className="text-3xl font-bold text-white mb-2">🎉 Hosting an Event?</h2>
              <p className="text-yellow-100">Let Us Serve the Royal Feast!</p>
            </div>

            <div className="p-8">
              <p className="text-gray-700 text-center mb-8">We specialize in bulk catering for marriages, functions, and parties. Our experienced team ensures every guest enjoys authentic South Indian flavors!</p>

              <form onSubmit={handleBulkSubmit} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={bulkFormData.name}
                    onChange={handleBulkFormChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-600"
                  />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="WhatsApp Number (+91...)"
                    value={bulkFormData.phone}
                    onChange={handleBulkFormChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-600"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="date"
                    name="eventDate"
                    value={bulkFormData.eventDate}
                    onChange={handleBulkFormChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-600"
                  />
                  <input
                    type="time"
                    name="eventTime"
                    value={bulkFormData.eventTime}
                    onChange={handleBulkFormChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-600"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <select
                    name="guestCount"
                    value={bulkFormData.guestCount}
                    onChange={handleBulkFormChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-600"
                  >
                    <option value="">Estimated Guest Count</option>
                    <option value="50">50 Guests</option>
                    <option value="100">100 Guests</option>
                    <option value="250">250+ Guests</option>
                    <option value="500">500+ Guests</option>
                  </select>
                  <input
                    type="text"
                    name="dishes"
                    placeholder="Selected Dishes / Menu Package"
                    value={bulkFormData.dishes}
                    onChange={handleBulkFormChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-600"
                  />
                </div>

                <textarea
                  name="address"
                  placeholder="Delivery Address / Event Location"
                  value={bulkFormData.address}
                  onChange={handleBulkFormChange}
                  required
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-600"
                />

                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold text-lg rounded-lg hover:shadow-lg transition flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" /> Submit Bulk Order via WhatsApp
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Contact & Location */}
      <section id="contact" className="py-16 bg-gray-100">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12" style={{ color: '#990000' }}>Contact & Location</h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Map Placeholder */}
            <div className="rounded-lg overflow-hidden shadow-lg h-80 bg-gray-300 flex items-center justify-center text-gray-600">
              <div className="text-center">
                <MapPin className="w-12 h-12 mx-auto mb-2 text-gray-500" />
                <p className="font-semibold">Google Map</p>
                <p className="text-sm">Salem Main Rd, Komarapalayam</p>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                  <MapPin className="w-5 h-5" style={{ color: '#990000' }} />
                  Address
                </h3>
                <p className="text-gray-700">Salem Main Rd, Near TMMB Bank,<br />JKK Nattraja Nagar,<br />Komarapalayam, Tamil Nadu 638183</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                  <Phone className="w-5 h-5" style={{ color: '#990000' }} />
                  Contact
                </h3>
                <a href="tel:+917418525405" className="inline-block px-6 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition flex items-center gap-2">
                  <Phone className="w-4 h-4" /> Call Now: +91 74185 25405
                </a>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                  <Utensils className="w-5 h-5" style={{ color: '#990000' }} />
                  Special Services
                </h3>
                <p className="text-gray-700 text-sm">✅ Marriages & Functions<br />✅ Parties & Events<br />✅ Bulk Catering<br />✅ Home Delivery Available</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-gray-600 text-sm border-t border-gray-200">
        <p className="mb-2" style={{ color: '#990000' }}>Royal Biriyani & Fast Food</p>
        <p className="text-xs">Taste the Royalty in Every Grain! 🌟</p>
        <p className="text-xs mt-3">© 2024 All Rights Reserved | Salem Main Rd, Komarapalayam</p>
      </footer>
    </div>
  );
};

export default RoyalBiriyani;
