# Royal Biriyani & Fast Food - Complete Setup Guide

## 🎯 Overview

This package contains:
1. **royal_biriyani_website.jsx** - Customer-facing website
2. **admin_panel.jsx** - React-based admin panel
3. **admin_panel_standalone.html** - Standalone HTML admin panel (NO dependencies)

---

## 📱 Admin Panel Features

### WhatsApp Integration with 6384945599
- ✅ Send confirmation messages to customers
- ✅ Receive bulk order notifications on admin number
- ✅ One-click order management
- ✅ Real-time order status tracking

### Key Features:
- 📊 Dashboard with order statistics
- 📝 Add orders manually
- 🎯 Filter orders by status (Pending, Confirmed, Completed)
- 💬 Direct WhatsApp messaging to customers
- 📢 Admin notifications
- 💾 Local storage (saves data in browser)
- 📱 Mobile responsive

---

## 🚀 Quick Start

### Option 1: Use Standalone HTML (EASIEST - No Setup Required)
**Best for:** Immediate deployment, no coding knowledge needed

```bash
# Simply open the file in any browser:
admin_panel_standalone.html

# Or deploy to any web host (Netlify, Vercel, GitHub Pages, etc.)
# The file works completely offline with browser storage
```

**Advantages:**
- No installation required
- Works on any device with a browser
- Data persists in browser's local storage
- Self-contained (no dependencies)

---

### Option 2: React Version (For Developers)

#### Prerequisites:
```bash
Node.js 16+ and npm/yarn installed
```

#### Installation:
```bash
# Create a new React project
npx create-react-app royal-biriyani
cd royal-biriyani

# Replace src/App.js with admin_panel.jsx content
# Then run:
npm start
```

#### Or use with Vercel (Recommended):
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy directly
vercel

# It will ask a few questions and deploy automatically
```

---

## 📋 How to Use the Admin Panel

### Dashboard Overview:
1. **Total Orders** - All orders received
2. **Pending** - Orders awaiting confirmation
3. **Confirmed** - Orders confirmed with customers
4. **Completed** - Finished orders

### Adding New Orders:
1. Fill in the form with customer details
2. Click "Add Order"
3. Order appears immediately in the list

### Managing Orders:
1. Change status using the dropdown (Pending → Confirmed → Completed)
2. Click "Send to Customer" to send WhatsApp confirmation
3. Click "Notify Admin (6384945599)" to inform the restaurant

### WhatsApp Integration Details:

**Customer WhatsApp Message Includes:**
- Order ID
- Customer name
- Event date & time
- Number of guests
- Selected menu/dishes
- Delivery address

**Admin Notification Includes:**
- All above details
- Formatted for quick reading
- Direct from customer's phone number

---

## 🔧 Configuration

### Change Admin WhatsApp Number:

#### For Standalone HTML:
Find this line (around line 28):
```javascript
const adminPhone = '6384945599';
```
Replace with your number:
```javascript
const adminPhone = 'YOUR_NUMBER_HERE';
```

#### For React Version:
Find this line (around line 17):
```javascript
const [adminPhone] = useState('6384945599');
```
Replace with:
```javascript
const [adminPhone] = useState('YOUR_NUMBER_HERE');
```

### Add Menu Items to Website:

Edit the `menuItems` object in `royal_biriyani_website.jsx`:
```javascript
const menuItems = {
  'Biriyani': [
    { name: 'Mutton Biriyani', price: '₹280', desc: 'Your description' },
    // Add more items...
  ]
};
```

---

## 🌐 Deployment Options

### Option 1: Vercel (Recommended - Easiest)
```bash
1. Create account at vercel.com
2. Connect your GitHub repo
3. Vercel auto-deploys on every push
```

### Option 2: Netlify
```bash
1. Create account at netlify.com
2. Drag and drop admin_panel_standalone.html
3. Instant deployment!
```

### Option 3: GitHub Pages
```bash
1. Create GitHub account
2. Create new repo: username.github.io
3. Upload admin_panel_standalone.html as index.html
4. Access at: https://username.github.io
```

### Option 4: Self-Hosted
- Any web hosting provider (GoDaddy, Hostinger, etc.)
- Upload the HTML/React files via FTP
- Done!

---

## 📞 WhatsApp API Configuration

### Current Setup: Direct WhatsApp Web Links
- Uses `https://wa.me/` format
- Works on all devices with WhatsApp installed
- No API key required
- Instant messaging

### Example WhatsApp Link:
```
https://wa.me/6384945599?text=Your%20message%20here
```

### Future Enhancement: WhatsApp Business API
For automated messages, use:
- WhatsApp Business API
- Twilio WhatsApp Integration
- MessageBird
- AWS SNS

---

## 💾 Data Management

### Standalone HTML:
- Data saved in browser's localStorage
- Persists even after closing browser
- Clear cache to reset data
- Backup: Export before clearing

### React Version:
- Add backend for persistent storage:
  ```javascript
  // Firebase example
  import { getFirestore } from 'firebase/firestore';
  
  // Or use your own backend API
  ```

---

## 🎨 Customization

### Change Colors:
Update these values:
- Gold: `#D4AF37`
- Crimson Red: `#990000`
- Dark Gray: `#1A1A1A`

### Change Contact Information:
Search for these and update:
- Phone: `+91 74185 25405` → Your number
- Address: `Salem Main Rd, Komarapalayam` → Your address
- Email: Add if needed

### Change Business Name:
Replace all instances of:
- "Royal Biriyani & Fast Food" → Your name
- Update logo emoji from 🍛 to something else if needed

---

## ✅ Testing Checklist

- [ ] Admin panel opens in browser
- [ ] Can add new orders
- [ ] Can change order status
- [ ] WhatsApp link opens correctly on mobile
- [ ] Customer receives WhatsApp message
- [ ] Admin receives notifications
- [ ] Data persists after page refresh
- [ ] Mobile view is responsive
- [ ] All links work correctly

---

## 🐛 Troubleshooting

### "Unable to reach" Error?
✅ **Fixed!** Use the standalone HTML version instead.

### WhatsApp Link Not Opening?
- Ensure WhatsApp is installed on device
- Check internet connection
- Try on different device (phone vs desktop)

### Data Not Saving?
- Check browser's local storage (usually works)
- Try clearing browser cache
- Use incognito/private mode test

### Mobile Responsiveness Issues?
- The design auto-adapts to 320px screens
- Test with Chrome DevTools (F12 → Devices)

---

## 📊 Analytics Integration

### Add Google Analytics:
```html
<!-- Add to HTML head -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_ID');
</script>
```

### Track Events:
```javascript
// Track order submissions
gtag('event', 'order_placed', {
  'order_id': order.id,
  'guest_count': order.guestCount
});
```

---

## 🔐 Security Notes

- **Current Setup**: Client-side only (browser storage)
- **Recommended for Production**: 
  1. Add backend authentication
  2. Use database (Firebase, MongoDB, etc.)
  3. Implement user login for admin panel
  4. Encrypt sensitive data

### Basic Authentication Example:
```javascript
// Add password protection
const adminPassword = 'your_secure_password';

function loginAdmin(password) {
  if (password === adminPassword) {
    // Show dashboard
  } else {
    // Show error
  }
}
```

---

## 📞 Support Contact

**Restaurant:** +91 74185 25405  
**Admin WhatsApp:** 6384945599  
**Address:** Salem Main Rd, Near TMMB Bank, JKK Nattraja Nagar, Komarapalayam, Tamil Nadu 638183

---

## 📝 Version History

### v1.0 (Current)
- ✅ Standalone HTML admin panel
- ✅ React website component
- ✅ WhatsApp integration
- ✅ Order management
- ✅ Local storage persistence

### v1.1 (Planned)
- Email notifications
- SMS integration
- Customer dashboard
- Menu analytics
- Automated reminders

---

## 🎉 Ready to Launch?

1. ✅ Choose deployment method
2. ✅ Update phone numbers & address
3. ✅ Test WhatsApp integration
4. ✅ Share admin panel link with team
5. ✅ Start receiving orders!

**Questions?** Contact your developer or open an issue.

Happy selling! 🍛🌟
