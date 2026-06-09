import React from 'react';
import SEO from '../components/SEO';
import { motion } from 'framer-motion';
import { useSettings } from '../context/SettingsContext';

const AboutUs = () => {
  const { siteTitle } = useSettings();
  return (
    <div className="bg-white min-h-screen">
      <SEO title="About Us" description={`Learn more about ${siteTitle} - your trusted e-commerce destination in Bangladesh.`} />
      
      {/* Hero Section */}
      <div className="bg-neutral-50 py-20 border-b border-neutral-100">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black text-neutral-900 tracking-tighter mb-6 uppercase"
          >
            About <span className="text-brand">{siteTitle}</span>
          </motion.h1>
          <p className="text-lg text-neutral-500 max-w-2xl mx-auto font-medium">
            Building the most reliable and trusted e-commerce destination in Bangladesh.
          </p>
        </div>
      </div>

      <div className="max-w-[800px] mx-auto px-6 py-20 prose prose-neutral prose-brand">
        <section className="mb-12">
          <p className="text-neutral-600 leading-relaxed mb-6 font-medium text-lg">
            Welcome to {siteTitle} – one of the most trusted online shopping platforms in Bangladesh! 🇧🇩 We’re proud to be a leading e-commerce destination, offering a smooth, secure, and reliable shopping experience to customers across the country.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {[
              { icon: "🚚", title: "Nationwide Delivery", desc: "Quick and dependable delivery service to every corner of Bangladesh." },
              { icon: "💵", title: "Cash on Delivery", desc: "Pay only when your product arrives—no advance payment needed!" },
              { icon: "✅", title: "100% Authentic Products", desc: "What you see is exactly what you get—always genuine, always original." },
              { icon: "🔄", title: "Easy Return Policy", desc: "Hassle-free returns and replacements to ensure your satisfaction." },
              { icon: "💰", title: "Great Value Deals", desc: "Enjoy amazing offers and competitive prices every day." },
              { icon: "🔐", title: "Secure Shopping", desc: "Shop with confidence through our safe and trusted payment methods." }
            ].map((item, i) => (
              <div key={i} className="bg-neutral-50 p-6 rounded-2xl border border-neutral-100">
                <span className="text-2xl mb-3 block">{item.icon}</span>
                <h3 className="text-neutral-900 font-bold mb-2">{item.title}</h3>
                <p className="text-neutral-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <p className="text-neutral-600 leading-relaxed mb-12">
            At {siteTitle}, we’re here to make your online shopping journey easy, affordable, and enjoyable. Thank you for choosing us—we’re honored to serve you. 🌟
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-black text-neutral-900 mb-6 uppercase tracking-tight">Our Vision</h2>
          <p className="text-neutral-600 leading-relaxed">
            To revolutionize online shopping in Bangladesh by providing a wide range of quality products, exceptional customer service, and a secure, user-friendly platform tailored to meet the diverse needs of our valued customers.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-black text-neutral-900 mb-6 uppercase tracking-tight">Our Mission</h2>
          <p className="text-neutral-600 leading-relaxed">
            To make online shopping accessible, dependable, and enjoyable for everyone in Bangladesh by ensuring:
          </p>
          <ul className="space-y-2 mt-4">
            <li className="flex items-center text-neutral-600">✔️ High-quality products</li>
            <li className="flex items-center text-neutral-600">✔️ Smooth and efficient delivery</li>
            <li className="flex items-center text-neutral-600">✔️ Friendly and responsive customer support</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-black text-neutral-900 mb-6 uppercase tracking-tight">Commitment to Quality</h2>
          <p className="text-neutral-600 leading-relaxed">
            At {siteTitle}, quality is our top priority. From daily essentials to the latest gadgets, every product is carefully handpicked to meet high standards of:
          </p>
          <div className="flex flex-wrap gap-4 mt-4">
            {["✨ Durability", "✨ Functionality", "✨ Style"].map((tag, i) => (
              <span key={i} className="bg-brand/5 text-brand px-4 py-2 rounded-full text-sm font-bold">{tag}</span>
            ))}
          </div>
          <p className="text-neutral-600 mt-6">
            We aim to give you not just products, but trust and satisfaction with every order.
          </p>
        </section>

        {/* <section>
          <h2 className="text-2xl font-black text-neutral-900 mb-6 uppercase tracking-tight">Our Sub-Brands</h2>
          <div className="space-y-6">
            <div className="border-l-4 border-brand pl-6">
              <h3 className="text-xl font-bold text-neutral-900 mb-2">Time Space</h3>
              <p className="text-neutral-600 text-sm">Time Space by {siteTitle} – A premium brand for elegant watches, stylish sunglasses, and refined wallets.</p>
            </div>
            <div className="border-l-4 border-neutral-900 pl-6">
              <h3 className="text-xl font-bold text-neutral-900 mb-2">Bunon Space</h3>
              <p className="text-neutral-600 text-sm">Bunon Space by {siteTitle} – A stylish clothing brand for women, men, and kids, blending fashion with comfort.</p>
            </div>
          </div>
        </section> */}
      </div>
    </div>
  );
};

export default AboutUs;
