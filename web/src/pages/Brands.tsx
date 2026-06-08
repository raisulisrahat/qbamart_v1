import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getBrands, BASE_URL } from '../services/api';
import { Zap, ArrowRight, Loader2, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';

const Brands = () => {
    const [brands, setBrands] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchBrands = async () => {
            try {
                const response = await getBrands();
                setBrands(response.data.results || response.data);
            } catch (error) {
                console.error('Error fetching brands:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchBrands();
    }, []);

    const filteredBrands = brands.filter(b => 
        b.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
                <SEO title="Our Brands" />
                <Loader2 className="w-10 h-10 text-[#5173FB] animate-spin" />
                <p className="text-sm font-bold text-neutral-400 uppercase tracking-widest">Discovering Brands...</p>
            </div>
        );
    }

    return (
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 animate-in fade-in slide-in-from-bottom-2 duration-700">
            <SEO 
                title="Official Brands Directory" 
                description="Explore our world-class manufacturing partners and premium brands. Discover high-quality gadgets and accessories at Qbamart." 
            />
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div className="max-w-xl">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-[1px] bg-[#5173FB]" />
                        <span className="text-[9px] font-bold text-[#5173FB] uppercase tracking-[0.3em]">Official Partners</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-black text-neutral-900 tracking-tight leading-none">
                        Shop by <span className="text-[#5173FB]">Brand</span>
                    </h1>
                    <p className="mt-4 text-[12px] text-neutral-500 font-medium leading-relaxed max-w-md opacity-80">
                        Explore curated collections from our world-class manufacturing partners. Every brand we host meets our signature quality standards.
                    </p>
                </div>

                <div className="relative w-full md:w-64 group">
                    <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-neutral-400 group-focus-within:text-[#5173FB] transition-colors">
                        <Search size={14} />
                    </div>
                    <input 
                        type="text"
                        placeholder="Search directory..."
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-neutral-200 rounded-xl focus:ring-2 focus:ring-[#5173FB]/5 focus:border-[#5173FB] outline-none transition-all font-medium text-[12px] text-neutral-900 shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Brands Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3 sm:gap-4">
                {filteredBrands.map((brand, index) => (
                    <motion.div
                        key={brand.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                    >
                        <Link 
                            to={`/products?brand=${brand.id}`}
                            className="group block bg-white border border-neutral-100 rounded-2xl p-4 hover:border-[#5173FB]/20 hover:shadow-lg transition-all duration-300 text-center relative overflow-hidden h-full flex flex-col items-center justify-center"
                        >
                            <div className="w-full aspect-square flex items-center justify-center mb-3 p-4 bg-neutral-50 rounded-xl group-hover:bg-white group-hover:shadow-sm transition-all duration-300">
                                {brand.logo ? (
                                    <img 
                                        src={brand.logo.startsWith('http') ? brand.logo : `${BASE_URL}${brand.logo}`} 
                                        alt={brand.name} 
                                        className="max-h-full max-w-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-500 scale-90 group-hover:scale-100"
                                    />
                                ) : (
                                    <Zap className="w-6 h-6 text-neutral-200" />
                                )}
                            </div>
                            <h3 className="text-[11px] font-bold text-neutral-900 group-hover:text-[#5173FB] transition-colors tracking-tight truncate w-full">{brand.name}</h3>
                            <div className="mt-2 flex items-center justify-center gap-1.5 text-[8px] font-bold uppercase tracking-widest text-neutral-400 group-hover:text-[#5173FB] transition-all opacity-0 group-hover:opacity-100 transform translate-y-1 group-hover:translate-y-0">
                                <span>Browse</span>
                                <ArrowRight size={8} />
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>

            {filteredBrands.length === 0 && (
                <div className="py-24 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-neutral-50 rounded-full mb-4">
                        <Search className="w-4 h-4 text-neutral-300" />
                    </div>
                    <p className="text-[12px] font-bold text-neutral-400 tracking-tight">No results for "{searchTerm}"</p>
                    <button 
                        onClick={() => setSearchTerm('')}
                        className="mt-4 text-[#5173FB] font-bold uppercase tracking-[0.2em] text-[9px] hover:underline"
                    >
                        Reset Directory
                    </button>
                </div>
            )}
        </div>
    );
};

export default Brands;
