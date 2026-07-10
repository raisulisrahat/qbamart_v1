import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, MessageSquare, ChevronRight, Phone, Mail, MapPin } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const Footer = () => {
  const { footerLogo, siteTitle, settings } = useSettings();
  const formattedSiteTitle = (siteTitle || 'Qbamart').toLowerCase().replace(/\s+/g, '');
  const siteEmail = `support@${formattedSiteTitle}.com`;

  return (
    <footer className="bg-neutral-200 text-neutral-800 pt-16 pb-8 border-t border-neutral-100">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Col */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center" aria-label="Home">
              <img src={footerLogo} alt={siteTitle || 'Qbamart'} width="120" height="32" className="h-8 md:h-10 w-auto" />
            </Link>
            <p className="text-[13px] leading-relaxed max-w-xs font-medium text-neutral-700">
              {settings?.footer_description || `${siteTitle || 'Qbamart'} is Bangladesh's most reliable and trusted e-commerce destination.`}
            </p>
            <div className="space-y-3">
              <h4 className="text-neutral-900 font-bold text-base">Subscribe us</h4>
              <div className="flex space-x-2">
                <a href={settings?.facebook_url || "#"} aria-label="Facebook" className="w-8 h-8 rounded-full bg-[#1877F2] flex items-center justify-center text-white hover:scale-110 transition-transform"><Facebook className="w-4 h-4" /></a>
                <a href={settings?.twitter_url || "#"} aria-label="Twitter" className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white hover:scale-110 transition-transform"><Twitter className="w-4 h-4" /></a>
                <a href={settings?.instagram_url || "#"} aria-label="Instagram" className="w-8 h-8 rounded-full bg-[#E4405F] flex items-center justify-center text-white hover:scale-110 transition-transform"><Instagram className="w-4 h-4" /></a>
                <a href={settings?.youtube_url || "#"} aria-label="YouTube" className="w-8 h-8 rounded-full bg-[#FF0000] flex items-center justify-center text-white hover:scale-110 transition-transform"><Youtube className="w-4 h-4" /></a>
                <a href={settings?.discord_url || "#"} aria-label="Discord" className="w-8 h-8 rounded-full bg-[#5865F2] flex items-center justify-center text-white hover:scale-110 transition-transform"><MessageSquare className="w-4 h-4" /></a>
              </div>
            </div>
          </div>

          {/* Categories Col */}
          <div>
            <h4 className="text-neutral-900 font-bold mb-6 text-base">Collection</h4>
            <ul className="space-y-3 text-[13px] font-medium text-neutral-700">
              <li><Link to="/products" className="hover:text-brand transition-colors">All Products</Link></li>
              <li><Link to="/offer" className="hover:text-brand transition-colors">Special Offers</Link></li>
              <li><Link to="/brands" className="hover:text-brand transition-colors">Brands</Link></li>
              <li><Link to="/categories" className="hover:text-brand transition-colors">Categories</Link></li>
              <li><Link to="/flash-sale" className="hover:text-brand transition-colors">Flash Sale</Link></li>
            </ul>
          </div>

          {/* Informational Links Col */}
          <div>
            <h4 className="text-neutral-900 font-bold mb-6 text-base">Informational Links</h4>
            <ul className="space-y-3 text-[13px] font-medium text-neutral-700">
              <li><Link to="/about-us" className="hover:text-brand transition-colors">About Us</Link></li>
              <li><Link to="/contact-us" className="hover:text-brand transition-colors">Contact Us</Link></li>
              <li><Link to="/shipping-policy" className="hover:text-brand transition-colors">Shipping Policy</Link></li>
              <li><Link to="/return-replacement-policy" className="hover:text-brand transition-colors">Return & Replacement Policy</Link></li>
              <li><Link to="/blogs" className="hover:text-brand transition-colors">Blog</Link></li>
            </ul>
          </div>

          {/* Contact Col */}
          <div>
            <h4 className="text-neutral-900 font-bold mb-6 text-base">Contact Us</h4>
            <ul className="space-y-4 text-[13px] font-medium text-neutral-700">
              <li className="flex items-start space-x-3 group">
                <div className="w-5 h-5 flex items-center justify-center text-brand"><Phone className="w-4 h-4" /></div>
                <div>
                  <span className="block font-bold text-neutral-900">Hotline: {settings?.support_phone}</span>
                </div>
              </li>
              <li className="flex items-start space-x-3 group">
                <div className="w-5 h-5 flex items-center justify-center text-brand"><Mail className="w-4 h-4" /></div>
                <div>
                  <span className="block font-bold text-neutral-900">Email: {siteEmail}</span>
                </div>
              </li>
              <li className="flex items-start space-x-3 group">
                <div className="w-5 h-5 flex items-center justify-center text-brand"><MapPin className="w-4 h-4" /></div>
                <div>
                  <span className="block font-bold text-neutral-900 mb-1">Address:</span>
                  <p className="leading-relaxed whitespace-pre-line">
                    {settings?.footer_address || `${siteTitle}\nGirls School Street, Rajbari Sadar, Rajbari.`}
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-300 pt-8 flex flex-col md:flex-row justify-between items-center text-xs space-y-4 md:space-y-0 text-neutral-700 font-medium">
          <p>© 2026 {siteTitle}. Powered by <a href="https://ctsolutionbd.com" target="_blank" rel="noopener noreferrer" className="hover:text-brand transition-colors">Cyber and Tech Solution</a>.</p>
          <div className="flex space-x-6 uppercase tracking-widest">
            <Link to="/privacy-policy" className="hover:text-brand">Privacy Policy</Link>
            <Link to="/terms-conditions" className="hover:text-brand">Terms & Conditions</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
