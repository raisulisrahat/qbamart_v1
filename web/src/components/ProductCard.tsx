import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Eye, Heart, Check, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { resolveImageUrl } from '../utils/image';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    slug: string;
    regular_price: string;
    sale_price: string | null;
    image: string;
    brand_name?: string;
    categories?: any[];
    stock?: number;
  };
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToWishlist, removeFromWishlist, isInWishlist, wishlist } = useWishlist();
  const { addToCart, cart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const regPrice = parseFloat(product.regular_price);
  const salePrice = product.sale_price ? parseFloat(product.sale_price) : null;
  const discount = (salePrice && regPrice > 0 && salePrice < regPrice) 
    ? Math.round((1 - salePrice / regPrice) * 100)
    : null;

  const isWishlisted = isInWishlist(product.id);
  const wishlistItem = wishlist.find(item => item.product.id === product.id);
  const isCarted = cart.some(item => item.id === product.id);
  const isAvailable = product.stock !== undefined ? product.stock > 0 : true;

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (isWishlisted && wishlistItem) {
      await removeFromWishlist(wishlistItem.id);
    } else {
      await addToWishlist(product.id);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isAvailable && !isCarted) {
      addToCart(product, 1);
    } else if (isCarted) {
      navigate('/cart');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className={`group relative bg-white rounded-xl overflow-hidden border border-neutral-100 hover:shadow-xl transition-all duration-300 flex flex-col ${!isAvailable ? 'opacity-75' : ''}`}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden m-1.5 rounded-xl bg-neutral-50">
        <Link to={`/product/${product.slug}`} className="block w-full h-full">
          <img 
            src={resolveImageUrl(product.image)} 
            alt={product.name}
            className={`w-full h-full object-cover transition-transform duration-500 ${isAvailable ? 'group-hover:scale-105' : 'grayscale'}`}
          />
        </Link>
        
        {discount && isAvailable && (
          <div className="absolute top-3 left-3 bg-brand text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm z-10">
            -{discount}%
          </div>
        )}

        {/* Action Buttons (Wishlist & Cart) */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 translate-x-12 group-hover:translate-x-0 transition-transform duration-300 z-10">
           {/* Wishlist Button */}
           <button 
             onClick={toggleWishlist}
             className={`p-2.5 rounded-lg shadow-lg border backdrop-blur-md transition-all ${
               isWishlisted 
                ? 'bg-brand text-white border-brand' 
                : 'bg-white/90 text-neutral-400 border-neutral-100 hover:text-brand'
             }`}
             title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
           >
             <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
           </button>

           {/* Add to Cart Button */}
           {isAvailable && (
             <button 
               onClick={handleAddToCart}
               className={`p-2.5 rounded-lg shadow-lg border backdrop-blur-md transition-all ${
                 isCarted 
                  ? 'bg-brand text-white border-brand' 
                  : 'bg-white/90 text-neutral-400 border-neutral-100 hover:text-brand'
               }`}
               title={isCarted ? "View Cart" : "Add to Cart"}
             >
               <ShoppingCart className={`w-4 h-4 ${isCarted ? 'fill-current' : ''}`} />
             </button>
           )}
        </div>
      </div>

      {/* Content */}
      <div className="px-3 pb-3 pt-1 flex flex-col flex-grow space-y-1">
        <Link to={`/product/${product.slug}`}>
          <h3 className="text-sm font-bold text-neutral-800 line-clamp-1 group-hover:text-brand transition-colors">
            {product.name}
          </h3>
        </Link>
        
        <div className="flex flex-wrap gap-1">
          {product.categories && product.categories.length > 0 ? (
            product.categories.map((c, i) => (
              <span key={c.id} className="flex items-center">
                <Link 
                  to={`/products?category=${c.slug}`}
                  className="text-[10px] font-medium text-neutral-400 hover:text-brand transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  {c.name}
                </Link>
                {i < (product.categories?.length || 0) - 1 && <span className="text-[10px] text-neutral-300 ml-0.5 mr-0.5">,</span>}
              </span>
            ))
          ) : (
            <span className="text-[11px] text-neutral-400">General</span>
          )}
        </div>

        {isAvailable ? (
          <div className="flex items-center space-x-1.5 text-brand">
             <Check className="w-3.5 h-3.5" strokeWidth={3} />
             <span className="text-[11px] font-bold">In stock</span>
          </div>
        ) : (
          <div className="flex items-center space-x-1.5 text-rose-500">
             <X className="w-3.5 h-3.5" strokeWidth={3} />
             <span className="text-[11px] font-bold">Out of stock</span>
          </div>
        )}

        <div className="flex items-center space-x-2 pt-1">
          {isAvailable && !isNaN(regPrice) && regPrice > 0 ? (
            <>
              {salePrice && salePrice < regPrice && (
                <span className="text-sm text-neutral-400 line-through">
                  ৳{Math.round(regPrice)}
                </span>
              )}
              <span className="text-base font-bold text-brand">
                ৳{Math.round(salePrice || regPrice)}
              </span>
            </>
          ) : (
            <span className="text-sm font-bold text-neutral-500">
              To be announced
            </span>
          )}
        </div>

        <div className="pt-2 md:pt-3">
          {isAvailable ? (
            <Link 
              to={`/product/${product.slug}`}
              className="w-full bg-brand hover:bg-brand-hover text-white text-[10px] md:text-xs font-black py-2.5 rounded-lg transition-colors flex items-center justify-center uppercase tracking-wider shadow-sm hover:shadow-md"
            >
              Order Now
            </Link>
          ) : (
            <button 
              disabled
              className="w-full bg-neutral-200 text-neutral-400 cursor-not-allowed text-[10px] md:text-xs font-black py-2.5 rounded-lg transition-colors flex items-center justify-center uppercase tracking-wider"
            >
              Out Of Stock
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;