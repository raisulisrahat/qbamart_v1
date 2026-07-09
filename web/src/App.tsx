import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CartProvider } from './context/CartContext';
import { SettingsProvider } from './context/SettingsContext';
import { AuthProvider } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MobileBottomNav from './components/MobileBottomNav';
import CartDrawer from './components/CartDrawer';
import ScrollToTop from './components/ScrollToTop';
import FacebookPixel from './components/FacebookPixel';
import GoogleTag from './components/GoogleTag';
import GoogleTagManager from './components/GoogleTagManager';
import React, { lazy, Suspense, useEffect } from 'react';
import Home from './pages/Home'; // Let's keep the home page synchronously loaded to minimize First Contentful Paint delay on homepage
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Shop = lazy(() => import('./pages/Shop'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const Account = lazy(() => import('./pages/Account'));
const MyOrders = lazy(() => import('./pages/MyOrders'));
const OrderDetails = lazy(() => import('./pages/OrderDetails'));
const FlashSale = lazy(() => import('./pages/FlashSale'));
const ChangePassword = lazy(() => import('./pages/ChangePassword'));
const BlogList = lazy(() => import('./pages/BlogList'));
const BlogDetail = lazy(() => import('./pages/BlogDetail'));
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
const OfferPage = lazy(() => import('./pages/OfferPage'));
const Offers = lazy(() => import('./pages/Offers'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const AboutUs = lazy(() => import('./pages/AboutUs'));
const ContactUs = lazy(() => import('./pages/ContactUs'));
const ShippingPolicy = lazy(() => import('./pages/ShippingPolicy'));
const ReturnPolicy = lazy(() => import('./pages/ReturnPolicy'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsConditions = lazy(() => import('./pages/TermsConditions'));
const Brands = lazy(() => import('./pages/Brands'));
const Categories = lazy(() => import('./pages/Categories'));
const StepFunnel = lazy(() => import('./pages/StepFunnel'));
const NotFound = lazy(() => import('./pages/NotFound'));


// Admin
const StaffDashboard = lazy(() => import('./pages/Admin/StaffDashboard'));

import UserLayout from './components/UserLayout';

import Lenis from 'lenis';

const queryClient = new QueryClient();

function App() {
  useEffect(() => {
    // Initialize Lenis Smooth Scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Meta Ads Tracking
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has('fbclid') || searchParams.has('utm_source') || searchParams.has('utm_campaign')) {
      sessionStorage.setItem('meta_ad_link', window.location.href);
    }

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <SettingsProvider>
        <LanguageProvider>
          <AuthProvider>
            <WishlistProvider>
              <CartProvider>
                <Router>
                <ScrollToTop />
                <FacebookPixel />
                <GoogleTag />
                <GoogleTagManager />
                <div className="flex flex-col min-h-screen bg-neutral-50 font-sans selection:bg-indigo-100 selection:text-indigo-900">
                  <Suspense fallback={
                    <div className="flex h-screen w-screen items-center justify-center bg-neutral-50">
                      <div className="w-8 h-8 border-2 border-zinc-200 border-t-zinc-900 rounded-full animate-spin"></div>
                    </div>
                  }>
                    <Routes>
                      {/* User Routes */}
                      <Route element={<UserLayout />}>
                        <Route path="/" element={<Home />} />
                        <Route path="/products" element={<Shop />} />
                        <Route path="/product/:slug" element={<ProductDetail />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/checkout" element={<Checkout />} />
                        <Route path="/wishlist" element={<Wishlist />} />
                        <Route path="/flash-sale" element={<FlashSale />} />
                        <Route path="/offer" element={<Offers />} />
                        <Route path="/blogs" element={<BlogList />} />
                        <Route path="/blog/:slug" element={<BlogDetail />} />
                        <Route path="/about-us" element={<AboutUs />} />
                        <Route path="/contact-us" element={<ContactUs />} />
                        <Route path="/shipping-policy" element={<ShippingPolicy />} />
                        <Route path="/return-replacement-policy" element={<ReturnPolicy />} />
                        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                        <Route path="/terms-conditions" element={<TermsConditions />} />
                        <Route path="/brands" element={<Brands />} />
                        <Route path="/categories" element={<Categories />} />


                        {/* Guest Only Routes */}
                        <Route element={<PublicRoute />}>
                          <Route path="/login" element={<Login />} />
                          <Route path="/signup" element={<Signup />} />
                          <Route path="/forgot-password" element={<ForgotPassword />} />
                        </Route>

                        {/* Protected Routes */}
                        <Route element={<ProtectedRoute />}>
                          <Route path="/account" element={<Account />} />
                          <Route path="/account/profile" element={<Account />} />
                          <Route path="/account/orders" element={<MyOrders />} />
                          <Route path="/account/orders/:id" element={<OrderDetails />} />
                          <Route path="/account/change-password" element={<ChangePassword />} />
                        </Route>
                      </Route>

                      {/* Standalone Landing Pages */}
                      <Route path="/offer/:slug" element={<OfferPage />} />

                      <Route path="/step/:slug" element={<StepFunnel />} />

                      {/* Admin Routes */}
                      <Route path="/staff/admin/*" element={<StaffDashboard role="admin" />} />
                      <Route path="/staff/moderator/*" element={<StaffDashboard role="moderator" />} />
                      <Route path="/staff/ads_manager/*" element={<StaffDashboard role="ads_manager" />} />

                      {/* 404 Catch-all */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Suspense>
                </div>
              </Router>
            </CartProvider>
          </WishlistProvider>
        </AuthProvider>
        </LanguageProvider>
      </SettingsProvider>
    </QueryClientProvider>
  );
}


export default App;
