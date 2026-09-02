import './globals.css';

export const metadata = {
  title: 'Royal Biriyani & Fast Food | Authentic South Indian Feast',
  description: 'Taste the Royalty in Every Grain! Authentic South Indian Biriyani, Fast Food, Starters & Bulk Catering for Marriages, Functions and Events in Komarapalayam.',
  keywords: 'Royal Biriyani, Komarapalayam Biriyani, Bulk Biriyani Orders, Catering, South Indian Food',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col antialiased selection:bg-royal-gold selection:text-royal-charcoal">
        {children}
      </body>
    </html>
  );
}
