import React, { useState, useEffect } from 'react';
import api, { BASE_URL } from '../../services/api';
import { Settings, Save, AlertCircle, CheckCircle, Upload, Globe, Facebook, Twitter, Instagram, Youtube, MessageSquare, Shield, Link as LinkIcon, Copy, Zap, RefreshCw, PenTool, MessageCircle, CreditCard } from 'lucide-react';

const MetaIcon = () => (
  <svg className="w-8 h-8 text-[#0064E0] flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16.63 7.02c-1.59 0-3.08.77-4.04 2.05a5.53 5.53 0 0 0-4.04-2.05C6.11 7.02 4 9.13 4 11.73s2.11 4.71 4.55 4.71c1.59 0 3.08-.77 4.04-2.05a5.53 5.53 0 0 0 4.04 2.05c2.44 0 4.55-2.11 4.55-4.71s-2.11-4.71-4.55-4.71zm-8.08 7.62c-1.52 0-2.75-1.11-2.75-2.91s1.23-2.91 2.75-2.91c.78 0 1.52.41 2.01 1.1a3.14 3.14 0 0 1 0 3.63c-.49.69-1.23 1.1-2.01 1.1zm8.08 0c-.78 0-1.52-.41-2.01-1.1a3.14 3.14 0 0 1 0-3.63c.49-.69 1.23-1.1 2.01-1.1 1.52 0 2.75 1.11 2.75 2.91s-1.23 2.91-2.75 2.91z"/>
  </svg>
);

const GoogleAnalyticsIcon = () => (
  <svg className="w-8 h-8 flex-shrink-0" viewBox="0 0 24 24" fill="none">
    <rect x="5" y="15" width="3" height="5" rx="1.5" fill="#F9AB00" />
    <rect x="10.5" y="9" width="3" height="11" rx="1.5" fill="#E37400" />
    <rect x="16" y="4" width="3" height="16" rx="1.5" fill="#F4B400" />
  </svg>
);

const GoogleAdsIcon = () => (
  <svg className="w-8 h-8 flex-shrink-0" viewBox="0 0 100 100" fill="none">
    <path d="M72.2 22.8L27.8 67.2c-2.4 2.4-2.4 6.4 0 8.8l8.8 8.8c2.4 2.4 6.4 2.4 8.8 0l44.4-44.4c2.4-2.4 2.4-6.4 0-8.8l-8.8-8.8c-2.4-2.4-6.4-2.4-8.8 0z" fill="#4285F4"/>
    <path d="M27.8 67.2L55.5 39.5l17.6 17.6L45.4 84.8c-2.4 2.4-6.4 2.4-8.8 0l-8.8-8.8c-2.4-2.4-2.4-6.4 0-8.8z" fill="#FBC02D"/>
  </svg>
);

const TikTokIcon = () => (
  <svg className="w-8 h-8 text-black flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.07-2.88-.53-4.08-1.39-.14-.1-.28-.2-.41-.31v5.71c.05 1.89-.52 3.82-1.74 5.25A7.54 7.54 0 0 1 10.9 22.2a7.6 7.6 0 0 1-6.19-2.91 7.6 7.6 0 0 1-1.38-6.62A7.62 7.62 0 0 1 9.4 7.15c.34-.07.69-.11 1.04-.12v4.11a3.55 3.55 0 0 0-3.3 2.6c-.66 2.1.51 4.41 2.6 5.07a3.56 3.56 0 0 0 4.44-2.48c.15-.53.21-1.09.19-1.64V.02h-1.84z"/>
  </svg>
);

const PinterestIcon = () => (
  <svg className="w-8 h-8 text-[#BD081C] flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.08 3.16 9.42 7.63 11.16-.1-.94-.2-2.39.04-3.41.22-.93 1.45-6.13 1.45-6.13s-.37-.74-.37-1.84c0-1.73 1-3.02 2.25-3.02 1.06 0 1.57.8 1.57 1.75 0 1.07-.68 2.66-1.03 4.14-.29 1.24.62 2.25 1.84 2.25 2.21 0 3.91-2.33 3.91-5.69 0-2.97-2.14-5.06-5.2-5.06-3.54 0-5.62 2.66-5.62 5.4 0 1.07.41 2.22.93 2.85.1.12.12.23.09.35l-.35 1.43c-.06.24-.19.29-.44.18-1.63-.76-2.65-3.14-2.65-5.05 0-4.11 3-7.89 8.62-7.89 4.53 0 8.04 3.23 8.04 7.54 0 4.5-2.83 8.12-6.76 8.12-1.32 0-2.56-.69-2.99-1.5l-.81 3.1c-.29 1.12-1.09 2.53-1.63 3.4A12 12 0 1 0 12 0z"/>
  </svg>
);

const BingIcon = () => (
  <svg className="w-8 h-8 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 2.5L14.5 6V16.5L8 20.5V11L4 9.5V2.5Z" fill="#008375" />
    <path d="M14.5 6L20 11.5L14.5 16.5V6Z" fill="#00A4EF" />
  </svg>
);

const RedditIcon = () => (
  <svg className="w-8 h-8 text-[#FF4500] flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 11.5c0-1.65-1.35-3-3-3-.96 0-1.86.48-2.42 1.24-1.64-1-3.75-1.64-5.99-1.72l1.2-3.8 3.9.83c.05.9 1.06 1.63 2.15 1.63 1.1 0 2-1 2-2.15s-.9-2-2-2c-.93 0-1.71.65-1.93 1.54l-4.32-.9c-.27-.06-.54.12-.6.38L10.74 8.7C8.42 8.78 6.2 9.42 4.5 10.45A3.72 3.72 0 0 0 2 11.5c0 1.65 1.35 3 3 3 .15 0 .3-.02.45-.05C5.16 15.3 5 16.15 5 17c0 3.86 3.58 7 8 7s8-3.14 8-7c0-.85-.16-1.7-.45-2.55.15.03.3.05.45.05 1.65 0 3-1.35 3-3zm-16.5 4.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm-5.45 3.12c-.17.18-.47.18-.65 0-1.12-1.12-2.88-1.12-4 0-.18.18-.48.18-.65 0-.18-.17-.18-.47 0-.65 1.48-1.48 3.82-1.48 5.3 0 .18.18.18.48 0 .65z"/>
  </svg>
);

const GtmIcon = () => (
  <svg className="w-8 h-8 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 21L21 12L12 3L3 12L12 21Z" fill="#246FDB" />
    <path d="M12 17.5C15.0376 17.5 17.5 15.0376 17.5 12C17.5 8.96243 15.0376 6.5 12 6.5C8.96243 6.5 6.5 8.96243 6.5 12C6.5 15.0376 8.96243 17.5 12 17.5Z" fill="#ffffff" opacity="0.3" />
    <circle cx="12" cy="12" r="3.5" fill="#ffffff" />
  </svg>
);

const ConfigManager = () => {
    const [config, setConfig] = useState(null);
    const [originalConfig, setOriginalConfig] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);
    const [logoPreview, setLogoPreview] = useState(null);
    const [footerLogoPreview, setFooterLogoPreview] = useState(null);
    const [faviconPreview, setFaviconPreview] = useState(null);
    const [messengerImagePreview, setMessengerImagePreview] = useState(null);
    const [smsBalance, setSmsBalance] = useState(null);
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [activeTab, setActiveTab] = useState('general');

    useEffect(() => {
        fetchConfig();
        fetchSmsBalance();
        fetchPaymentMethods();
    }, []);

    const fetchConfig = async () => {
        try {
            const response = await api.get('site-settings/');
            const data = Array.isArray(response.data) ? response.data[0] : response.data;
            if (data) {
                setConfig(data);
                setOriginalConfig(data);
                setLogoPreview(data.site_logo);
                setFooterLogoPreview(data.footer_logo);
                setFaviconPreview(data.site_favicon);
                setMessengerImagePreview(data.messenger_image);
            }
            setLoading(false);
        } catch (error: any) {
            console.error('Error fetching config:', error.response?.data || error);
            alert('Failed to fetch configuration.');
        } finally {
            setLoading(false);
        }
    };

    const fetchSmsBalance = async () => {
        try {
            const response = await api.get('site-settings/sms_balance/');
            setSmsBalance(response.data.balance);
        } catch (error) {
            console.error('Error fetching SMS balance:', error);
        }
    };

    const fetchPaymentMethods = async () => {
        try {
            const response = await api.get('payment-methods/', { params: { manage: true } });
            setPaymentMethods(response.data);
        } catch (error) {
            console.error('Error fetching payment methods:', error);
        }
    };

    const handlePaymentMethodToggle = async (methodId, checked) => {
        try {
            await api.patch(`payment-methods/${methodId}/`, { is_active: checked });
            setPaymentMethods(prev => prev.map(m => m.id === methodId ? { ...m, is_active: checked } : m));
        } catch (error) {
            console.error('Failed to update payment method:', error);
            alert('Failed to update payment method status.');
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        
        if (type === 'checkbox') {
            setConfig(prev => ({ ...prev, [name]: checked }));
        } else if (type === 'file') {
            if (files && files[0]) {
                setConfig(prev => ({ ...prev, [name]: files[0] }));
                if (name === 'site_logo') {
                    setLogoPreview(URL.createObjectURL(files[0]));
                } else if (name === 'footer_logo') {
                    setFooterLogoPreview(URL.createObjectURL(files[0]));
                } else if (name === 'site_favicon') {
                    setFaviconPreview(URL.createObjectURL(files[0]));
                } else if (name === 'messenger_image') {
                    setMessengerImagePreview(URL.createObjectURL(files[0]));
                }
            }
        } else {
            setConfig(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);

        try {
            const formData = new FormData();
            for (const key in config) {
                if (['site_logo', 'footer_logo', 'site_favicon', 'messenger_image'].includes(key)) {
                    if (config[key] instanceof File) {
                        formData.append(key, config[key]);
                    }
                } else if (config[key] !== null && config[key] !== undefined) {
                    formData.append(key, config[key]);
                }
            }

            const response = await api.patch(`site-settings/${config.id || 1}/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            const data = Array.isArray(response.data) ? response.data[0] : response.data;
            setConfig(data);
            setOriginalConfig(data);
            setLogoPreview(data.site_logo);
            setFooterLogoPreview(data.footer_logo);
            setFaviconPreview(data.site_favicon);
            setMessengerImagePreview(data.messenger_image);
            setMessage({ type: 'success', text: 'Configuration saved successfully!' });
            fetchSmsBalance();
            setTimeout(() => setMessage(null), 3000);
        } catch (err: any) {
            alert(`Failed to save configuration: ${err.response?.data?.detail || err.message}`);
        } finally {
            setSaving(false);
        }
    };

    const isDirty = () => {
        if (!config || !originalConfig) return false;
        return JSON.stringify(config) !== JSON.stringify(originalConfig) || 
               config.site_logo instanceof File || 
               config.footer_logo instanceof File || 
               config.site_favicon instanceof File ||
               config.messenger_image instanceof File;
    };

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="w-8 h-8 border-2 border-zinc-200 border-t-zinc-900 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!config) {
        return (
            <div className="flex flex-col h-64 items-center justify-center gap-4 text-center max-w-md mx-auto">
                <AlertCircle className="w-8 h-8 text-rose-500 animate-bounce" />
                <div>
                    <h3 className="text-lg font-semibold text-zinc-900">Failed to Load Settings</h3>
                    <p className="text-sm text-zinc-500 mt-1">Please ensure the backend API server is running and try again.</p>
                </div>
                <button 
                    type="button"
                    onClick={() => { setLoading(true); fetchConfig(); fetchSmsBalance(); }} 
                    className="px-4 py-2 bg-brand text-white rounded-lg text-sm font-medium hover:bg-[#3a5bd9] transition-all"
                >
                    Retry Connection
                </button>
            </div>
        );
    }

    return (
        <div className="animate-in fade-in duration-500 max-w-5xl mx-auto">
            {/* Header Area */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-zinc-900">Settings</h2>
                    <p className="text-sm text-zinc-500 mt-1 font-medium">Configure global platform behavior, SEO, and integrations.</p>
                </div>
                
                {message && (
                    <div className={`px-4 py-2 rounded-lg flex items-center gap-2 text-xs font-bold uppercase tracking-wider animate-in slide-in-from-right-4 duration-300 ${message.type === 'error' ? 'bg-rose-50 text-rose-700 border border-rose-100' : 'bg-emerald-50 text-emerald-700 border border-emerald-100'}`}>
                        {message.type === 'error' ? <AlertCircle size={14} /> : <CheckCircle size={14} />}
                        {message.text}
                    </div>
                )}
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b border-zinc-200 mb-8 overflow-x-auto whitespace-nowrap scrollbar-none gap-2">
                <button
                    type="button"
                    onClick={() => setActiveTab('general')}
                    className={`flex items-center gap-2 px-5 py-3 font-semibold text-xs uppercase tracking-wider border-b-2 transition-all ${activeTab === 'general' ? 'border-brand text-brand font-bold' : 'border-transparent text-zinc-500 hover:text-zinc-950'}`}
                >
                    <Zap size={14} />
                    <span>General & Brand</span>
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab('tracking')}
                    className={`flex items-center gap-2 px-5 py-3 font-semibold text-xs uppercase tracking-wider border-b-2 transition-all ${activeTab === 'tracking' ? 'border-brand text-brand font-bold' : 'border-transparent text-zinc-500 hover:text-zinc-950'}`}
                >
                    <PenTool size={14} />
                    <span>Pixels & Tracking</span>
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab('integrations')}
                    className={`flex items-center gap-2 px-5 py-3 font-semibold text-xs uppercase tracking-wider border-b-2 transition-all ${activeTab === 'integrations' ? 'border-brand text-brand font-bold' : 'border-transparent text-zinc-500 hover:text-zinc-950'}`}
                >
                    <Shield size={14} />
                    <span>Integrations & Gateways</span>
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 pb-24">
                {activeTab === 'general' && (
                    <>
                        {/* Brand Identity */}
                <div className="next-panel p-8">
                    <div className="flex items-center gap-3 mb-8 border-b border-zinc-100 pb-4">
                        <div className="p-2 bg-zinc-100 rounded-lg text-zinc-900"><Zap size={18} /></div>
                        <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-900">Site Settings</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Site Title</label>
                                <input
                                    type="text"
                                    name="site_title"
                                    value={config.site_title || ''}
                                    onChange={handleChange}
                                    className="w-full bg-zinc-50 border border-zinc-200 p-3 rounded-xl focus:ring-2 focus:ring-brand/5 outline-none transition-all font-semibold text-zinc-900 text-sm"
                                    placeholder="Your Company Name"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <AssetUpload 
                                    label="Site Logo" 
                                    preview={logoPreview} 
                                    name="site_logo" 
                                    onChange={handleChange} 
                                    hint="200x50px recommended" 
                                    isFavicon={false}
                                />
                                <AssetUpload 
                                    label="Favicon" 
                                    preview={faviconPreview} 
                                    name="site_favicon" 
                                    onChange={handleChange} 
                                    hint="32x32px .ico/.png" 
                                    isFavicon={true} 
                                />
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">SEO Meta Description</label>
                                <textarea
                                    name="meta_description"
                                    value={config.meta_description || ''}
                                    onChange={handleChange}
                                    rows={3}
                                    className="w-full bg-zinc-50 border border-zinc-200 p-3 rounded-xl focus:ring-2 focus:ring-brand/5 outline-none transition-all font-semibold text-zinc-900 text-sm resize-none"
                                    placeholder="Brief description for search engines..."
                                />
                                <p className="text-[9px] text-zinc-400 font-bold uppercase text-right">{config.meta_description?.length || 0} / 160</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Footer Description</label>
                                <textarea
                                    name="footer_description"
                                    value={config.footer_description || ''}
                                    onChange={handleChange}
                                    rows={3}
                                    className="w-full bg-zinc-50 border border-zinc-200 p-3 rounded-xl focus:ring-2 focus:ring-brand/5 outline-none transition-all font-semibold text-zinc-900 text-sm resize-none"
                                    placeholder="Footer description text..."
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Footer Address Info</label>
                                <textarea
                                    name="footer_address"
                                    value={config.footer_address || ''}
                                    onChange={handleChange}
                                    rows={3}
                                    className="w-full bg-zinc-50 border border-zinc-200 p-3 rounded-xl focus:ring-2 focus:ring-brand/5 outline-none transition-all font-semibold text-zinc-900 text-sm resize-none"
                                    placeholder="Footer address details..."
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Social & Connections */}
                <div className="next-panel p-8">
                    <div className="flex items-center gap-3 mb-8 border-b border-zinc-100 pb-4">
                        <div className="p-2 bg-zinc-100 rounded-lg text-zinc-900"><Globe size={18} /></div>
                        <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-900">Social Media Integration</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <SocialInput icon={<Facebook size={14} />} label="Facebook" name="facebook_url" value={config.facebook_url} onChange={handleChange} />
                        <SocialInput icon={<Twitter size={14} />} label="Twitter" name="twitter_url" value={config.twitter_url} onChange={handleChange} />
                        <SocialInput icon={<Instagram size={14} />} label="Instagram" name="instagram_url" value={config.instagram_url} onChange={handleChange} />
                        <SocialInput icon={<Youtube size={14} />} label="YouTube" name="youtube_url" value={config.youtube_url} onChange={handleChange} />
                        <SocialInput icon={<MessageSquare size={14} />} label="Discord" name="discord_url" value={config.discord_url} onChange={handleChange} />
                    </div>
                </div>

                {/* Chat Support */}
                <div className="next-panel p-8">
                    <div className="flex items-center gap-3 mb-8 border-b border-zinc-100 pb-4">
                        <div className="p-2 bg-zinc-100 rounded-lg text-zinc-900"><MessageCircle size={18} /></div>
                        <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-900">Chat Support Bubble</h3>
                    </div>

                    <div className="space-y-8">
                        <div className="flex items-center justify-between p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                            <div>
                                <span className="text-[10px] font-bold text-emerald-900 uppercase tracking-widest block">Show Chat Bubble</span>
                                <span className="text-[9px] font-medium text-emerald-600 block mt-0.5">Toggle floating support bubble site-wide</span>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="show_chat_bubble"
                                    checked={config.show_chat_bubble || false}
                                    onChange={handleChange}
                                    className="sr-only peer"
                                />
                                <div className="w-10 h-5 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                            </label>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">WhatsApp Number</label>
                                    <input
                                        type="text"
                                        name="whatsapp_number"
                                        value={config.whatsapp_number || ''}
                                        onChange={handleChange}
                                        className="w-full bg-zinc-50 border border-zinc-200 p-3 rounded-xl focus:ring-2 focus:ring-brand/5 outline-none transition-all font-semibold text-zinc-900 text-sm"
                                        placeholder="+8801700000000"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Support Phone (Quick Call)</label>
                                    <input
                                        type="text"
                                        name="support_phone"
                                        value={config.support_phone || ''}
                                        onChange={handleChange}
                                        className="w-full bg-zinc-50 border border-zinc-200 p-3 rounded-xl focus:ring-2 focus:ring-brand/5 outline-none transition-all font-semibold text-zinc-900 text-sm"
                                        placeholder="+8801516542909"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">WhatsApp Default Message</label>
                                    <textarea
                                        name="whatsapp_message"
                                        value={config.whatsapp_message || ''}
                                        onChange={handleChange}
                                        rows={3}
                                        className="w-full bg-zinc-50 border border-zinc-200 p-3 rounded-xl focus:ring-2 focus:ring-brand/5 outline-none transition-all font-semibold text-zinc-900 text-sm resize-none"
                                        placeholder="Hello! I'm interested in your products."
                                    />
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Messenger URL</label>
                                    <input
                                        type="url"
                                        name="messenger_url"
                                        value={config.messenger_url || ''}
                                        onChange={handleChange}
                                        className="w-full bg-zinc-50 border border-zinc-200 p-3 rounded-xl focus:ring-2 focus:ring-brand/5 outline-none transition-all font-semibold text-zinc-900 text-sm"
                                        placeholder="https://m.me/yourpage"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Messenger Bubble Image (Optional)</label>
                                    <AssetUpload 
                                        label="Messenger Avatar" 
                                        preview={messengerImagePreview} 
                                        name="messenger_image" 
                                        onChange={handleChange} 
                                        hint="Square image recommended" 
                                        isFavicon={true}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                    </>
                )}

                {activeTab === 'tracking' && (
                    <>
                        {/* Pixel IDs Card */}
                <div className="next-panel p-8">
                    <div className="flex items-center justify-between mb-8 border-b border-zinc-100 pb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-zinc-100 rounded-lg text-zinc-900"><PenTool size={18} /></div>
                            <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-900">Pixel IDs</h3>
                        </div>
                    </div>

                    <div className="divide-y divide-zinc-100">
                        {/* Meta Pixel */}
                        <div className="py-6 first:pt-0 last:pb-0">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-4 flex-1">
                                    <div className="p-2 bg-zinc-50 rounded-xl border border-zinc-100 flex items-center justify-center w-12 h-12 flex-shrink-0">
                                        <MetaIcon />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-sm font-bold text-zinc-950">Your Meta Pixel</h4>
                                        <div className="text-[11px] font-medium text-zinc-500 mt-1 flex flex-wrap gap-x-3 gap-y-1">
                                            <span>Learn how to setup Meta Pixel: <a href="https://www.facebook.com/business/help/952192354843755" target="_blank" rel="noopener noreferrer" className="text-brand hover:underline font-semibold">click here</a></span>
                                            <span className="text-zinc-300">|</span>
                                            <span>Manage Events Manager: <a href="https://business.facebook.com/events_manager2" target="_blank" rel="noopener noreferrer" className="text-brand hover:underline font-semibold">visit manager</a></span>
                                        </div>
                                        
                                        {config.enable_facebook_pixel && (
                                            <div className="mt-4 space-y-4 animate-in slide-in-from-top-2 duration-200">
                                                <div className="space-y-1">
                                                    <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider ml-1">Meta Pixel ID</label>
                                                    <input
                                                        type="text"
                                                        name="facebook_pixel_id"
                                                        value={config.facebook_pixel_id || ''}
                                                        onChange={handleChange}
                                                        className="w-full max-w-md bg-zinc-50 border border-zinc-200 p-2.5 rounded-xl focus:ring-2 focus:ring-brand/5 outline-none transition-all font-mono text-zinc-900 text-sm block"
                                                        placeholder="Enter Meta Pixel ID (e.g. 2717976234992377)"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider ml-1">Conversions API (CAPI) Access Token</label>
                                                    <textarea
                                                        name="facebook_capi_token"
                                                        value={config.facebook_capi_token || ''}
                                                        onChange={handleChange}
                                                        rows={2}
                                                        className="w-full max-w-md bg-zinc-50 border border-zinc-200 p-2.5 rounded-xl focus:ring-2 focus:ring-brand/5 outline-none transition-all font-mono text-zinc-900 text-sm block resize-none"
                                                        placeholder="Enter CAPI Access Token (e.g. EAAG...)"
                                                    />
                                                </div>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md">
                                                    <div className="space-y-1">
                                                        <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider ml-1">Test Event Code</label>
                                                        <input
                                                            type="text"
                                                            name="facebook_test_code"
                                                            value={config.facebook_test_code || ''}
                                                            onChange={handleChange}
                                                            className="w-full bg-zinc-50 border border-zinc-200 p-2.5 rounded-xl focus:ring-2 focus:ring-brand/5 outline-none transition-all font-mono text-zinc-900 text-sm"
                                                            placeholder="TEST12345"
                                                        />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider ml-1">Ad Account ID</label>
                                                        <input
                                                            type="text"
                                                            name="facebook_ad_account_id"
                                                            value={config.facebook_ad_account_id || ''}
                                                            onChange={handleChange}
                                                            className="w-full bg-zinc-50 border border-zinc-200 p-2.5 rounded-xl focus:ring-2 focus:ring-brand/5 outline-none transition-all font-mono text-zinc-900 text-sm"
                                                            placeholder="act_123456789"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer mt-1 flex-shrink-0">
                                    <input
                                        type="checkbox"
                                        checked={config.enable_facebook_pixel ?? true}
                                        onChange={(e) => setConfig(prev => ({ ...prev, enable_facebook_pixel: e.target.checked }))}
                                        className="sr-only peer"
                                    />
                                    <div className="w-10 h-5 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand"></div>
                                </label>
                            </div>
                        </div>

                        {/* Google Analytics */}
                        <div className="py-6">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-4 flex-1">
                                    <div className="p-2 bg-zinc-50 rounded-xl border border-zinc-100 flex items-center justify-center w-12 h-12 flex-shrink-0">
                                        <GoogleAnalyticsIcon />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-sm font-bold text-zinc-950">Your Google Analytics</h4>
                                        <div className="text-[11px] font-medium text-zinc-500 mt-1 flex flex-wrap gap-x-3 gap-y-1">
                                            <span>Google Analytics 4 setup guide: <a href="https://support.google.com/analytics/answer/9304153" target="_blank" rel="noopener noreferrer" className="text-brand hover:underline font-semibold">click here</a></span>
                                            <span className="text-zinc-300">|</span>
                                            <span>Find your Measurement ID: <a href="https://support.google.com/analytics/answer/9539506" target="_blank" rel="noopener noreferrer" className="text-brand hover:underline font-semibold">watch guide</a></span>
                                        </div>

                                        {config.enable_google_analytics && (
                                            <div className="mt-4 space-y-4 animate-in slide-in-from-top-2 duration-200">
                                                <div className="space-y-1">
                                                    <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider ml-1">Measurement ID</label>
                                                    <input
                                                        type="text"
                                                        name="google_tag_id"
                                                        value={config.google_tag_id || ''}
                                                        onChange={handleChange}
                                                        className="w-full max-w-md bg-zinc-50 border border-zinc-200 p-2.5 rounded-xl focus:ring-2 focus:ring-brand/5 outline-none transition-all font-mono text-zinc-900 text-sm block"
                                                        placeholder="Enter Measurement ID (e.g. G-XXXXXXXXXX)"
                                                    />
                                                </div>

                                                <div className="space-y-3 pt-2">
                                                    {/* Measurement Protocol */}
                                                    <div className="flex items-center gap-3">
                                                        <input 
                                                            type="checkbox"
                                                            id="enable_measurement_protocol"
                                                            checked={config.enable_measurement_protocol ?? false}
                                                            onChange={(e) => setConfig(prev => ({ ...prev, enable_measurement_protocol: e.target.checked }))}
                                                            className="w-4 h-4 text-brand bg-zinc-50 border-zinc-200 rounded focus:ring-brand"
                                                        />
                                                        <label htmlFor="enable_measurement_protocol" className="text-xs font-bold text-zinc-700">Enable Measurement Protocol</label>
                                                    </div>
                                                    {config.enable_measurement_protocol && (
                                                        <div className="pl-7 flex flex-col animate-in lide-in-from-top-2 duration-200 space-y-1">
                                                            <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider ml-1">Measurement Protocol API Secret</label>
                                                            <input
                                                                type="text"
                                                                name="google_analytics_api_secret"
                                                                value={config.google_analytics_api_secret || ''}
                                                                onChange={handleChange}
                                                                className="w-full max-w-md bg-zinc-50 border border-zinc-200 p-2.5 rounded-xl focus:ring-2 focus:ring-brand/5 outline-none transition-all font-mono text-zinc-900 text-sm"
                                                                placeholder="Enter API Secret"
                                                            />
                                                        </div>
                                                    )}

                                                    {/* Server Container URL */}
                                                    <div className="flex items-center gap-3 pt-1">
                                                        <input 
                                                            type="checkbox"
                                                            id="enable_server_container"
                                                            checked={config.enable_server_container ?? false}
                                                            onChange={(e) => setConfig(prev => ({ ...prev, enable_server_container: e.target.checked }))}
                                                            className="w-4 h-4 text-brand bg-zinc-50 border-zinc-200 rounded focus:ring-brand"
                                                        />
                                                        <label htmlFor="enable_server_container" className="text-xs font-bold text-zinc-700">Enable Server Container URL</label>
                                                    </div>
                                                    {config.enable_server_container && (
                                                        <div className="pl-7 animate-in slide-in-from-top-2 duration-200 space-y-3 max-w-md">
                                                            <div className="space-y-1">
                                                                <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider ml-1">Server Container URL</label>
                                                                <input
                                                                    type="text"
                                                                    name="server_container_url"
                                                                    value={config.server_container_url || ''}
                                                                    onChange={handleChange}
                                                                    className="w-full bg-zinc-50 border border-zinc-200 p-2.5 rounded-xl focus:ring-2 focus:ring-brand/5 outline-none transition-all font-mono text-zinc-900 text-sm"
                                                                    placeholder="https://analytics.example.com"
                                                                />
                                                            </div>
                                                            <div className="space-y-1">
                                                                <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider ml-1">Transport URL</label>
                                                                <input
                                                                    type="text"
                                                                    name="transport_url"
                                                                    value={config.transport_url || ''}
                                                                    onChange={handleChange}
                                                                    className="w-full bg-zinc-50 border border-zinc-200 p-2.5 rounded-xl focus:ring-2 focus:ring-brand/5 outline-none transition-all font-mono text-zinc-900 text-sm"
                                                                    placeholder="https://tagging.mywebsite.com"
                                                                />
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer mt-1 flex-shrink-0">
                                    <input
                                        type="checkbox"
                                        checked={config.enable_google_analytics ?? true}
                                        onChange={(e) => setConfig(prev => ({ ...prev, enable_google_analytics: e.target.checked }))}
                                        className="sr-only peer"
                                    />
                                    <div className="w-10 h-5 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand"></div>
                                </label>
                            </div>
                        </div>

                        {/* Google Ads */}
                        <div className="py-6">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-4 flex-1">
                                    <div className="p-2 bg-zinc-50 rounded-xl border border-zinc-100 flex items-center justify-center w-12 h-12 flex-shrink-0">
                                        <GoogleAdsIcon />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-sm font-bold text-zinc-950">Your Google Ads Tag</h4>
                                        <div className="text-[11px] font-medium text-zinc-500 mt-1 flex flex-wrap gap-x-3 gap-y-1">
                                            <span>Learn how to install Google Ads Tag: <a href="https://support.google.com/google-ads/answer/7544399" target="_blank" rel="noopener noreferrer" className="text-brand hover:underline font-semibold">watch video</a></span>
                                            <span className="text-zinc-300">|</span>
                                            <span>Configure Enhanced Conversions: <a href="https://support.google.com/google-ads/answer/9888656" target="_blank" rel="noopener noreferrer" className="text-brand hover:underline font-semibold">click here</a></span>
                                        </div>{config.enable_google_ads && (


                                            <div className="mt-4 space-y-4 animate-in slide-in-from-top-2 duration-200">


                                                <div className="space-y-1">


                                                    <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider ml-1">Conversion ID</label>


                                                    <input


                                                        type="text"


                                                        name="google_ads_id"


                                                        value={config.google_ads_id || ''}


                                                        onChange={handleChange}


                                                        className="w-full max-w-md bg-zinc-50 border border-zinc-200 p-2.5 rounded-xl focus:ring-2 focus:ring-brand/5 outline-none transition-all font-mono text-zinc-900 text-sm block"


                                                        placeholder="Enter Google Ads Conversion ID (e.g. AW-123456789)"


                                                    />


                                                </div>


                                                <div className="space-y-1">


                                                    <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider ml-1">Conversion Label</label>


                                                    <input


                                                        type="text"


                                                        name="google_ads_conversion_label"


                                                        value={config.google_ads_conversion_label || ''}


                                                        onChange={handleChange}


                                                        className="w-full max-w-md bg-zinc-50 border border-zinc-200 p-2.5 rounded-xl focus:ring-2 focus:ring-brand/5 outline-none transition-all font-mono text-zinc-900 text-sm block"


                                                        placeholder="Enter Conversion Label (e.g. AbC-D_efG-h)"


                                                    />


                                                </div>


                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md">


                                                    <div className="space-y-1">


                                                        <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider ml-1">Merchant Center ID</label>


                                                        <input


                                                            type="text"


                                                            name="google_ads_merchant_center_id"


                                                            value={config.google_ads_merchant_center_id || ''}


                                                            onChange={handleChange}


                                                            className="w-full bg-zinc-50 border border-zinc-200 p-2.5 rounded-xl focus:ring-2 focus:ring-brand/5 outline-none transition-all font-mono text-zinc-900 text-sm"


                                                            placeholder="Merchant Center ID"


                                                        />


                                                    </div>


                                                    <div className="space-y-1">


                                                        <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider ml-1">Business Vertical</label>


                                                        <select


                                                            name="google_ads_business_vertical"


                                                            value={config.google_ads_business_vertical || 'retail'}


                                                            onChange={handleChange}


                                                            className="w-full bg-zinc-50 border border-zinc-200 p-2.5 rounded-xl focus:ring-2 focus:ring-brand/5 outline-none transition-all text-zinc-900 text-sm h-[42px]"


                                                        >


                                                            <option value="retail">Retail</option>


                                                            <option value="education">Education</option>


                                                            <option value="flights">Flights</option>


                                                            <option value="hotels_rentals">Hotels and Rentals</option>


                                                            <option value="jobs">Jobs</option>


                                                            <option value="local">Local Deals</option>


                                                            <option value="real_estate">Real Estate</option>


                                                            <option value="travel">Travel</option>


                                                            <option value="custom">Custom</option>


                                                        </select>


                                                    </div>


                                                </div>


                                            </div>


                                        )}
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer mt-1 flex-shrink-0">
                                    <input
                                        type="checkbox"
                                        checked={config.enable_google_ads ?? true}
                                        onChange={(e) => setConfig(prev => ({ ...prev, enable_google_ads: e.target.checked }))}
                                        className="sr-only peer"
                                    />
                                    <div className="w-10 h-5 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand"></div>
                                </label>
                            </div>
                        </div>

                        {/* TikTok Pixel */}
                        <div className="py-6">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-4 flex-1">
                                    <div className="p-2 bg-zinc-50 rounded-xl border border-zinc-100 flex items-center justify-center w-12 h-12 flex-shrink-0">
                                        <TikTokIcon />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-sm font-bold text-zinc-950">Your TikTok Pixel</h4>
                                        <div className="text-[11px] font-medium text-zinc-500 mt-1 flex flex-wrap gap-x-3 gap-y-1">
                                            <span>Install TikTok Pixel: <a href="https://ads.tiktok.com/help/article/tiktok-pixel" target="_blank" rel="noopener noreferrer" className="text-brand hover:underline font-semibold">watch video</a></span>
                                            <span className="text-zinc-300">|</span>
                                            <span>Enable TikTok API: <a href="https://ads.tiktok.com/help/article/events-api" target="_blank" rel="noopener noreferrer" className="text-brand hover:underline font-semibold">click here</a></span>
                                        </div>{config.enable_tiktok_pixel && (


                                            <div className="mt-4 space-y-4 animate-in slide-in-from-top-2 duration-200">


                                                <div className="space-y-1">


                                                    <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider ml-1">TikTok Pixel ID</label>


                                                    <input


                                                        type="text"


                                                        name="tiktok_pixel_id"


                                                        value={config.tiktok_pixel_id || ''}


                                                        onChange={handleChange}


                                                        className="w-full max-w-md bg-zinc-50 border border-zinc-200 p-2.5 rounded-xl focus:ring-2 focus:ring-brand/5 outline-none transition-all font-mono text-zinc-900 text-sm block"


                                                        placeholder="Enter TikTok Pixel ID (e.g. CPCXXXXXXXX)"


                                                    />


                                                </div>


                                                <div className="space-y-1">


                                                    <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider ml-1">Events API Token</label>
                                                    <textarea
                                                        name="tiktok_events_api_token"
                                                        value={config.tiktok_events_api_token || ''}
                                                        onChange={handleChange}
                                                        rows={2}
                                                        className="w-full max-w-md bg-zinc-50 border border-zinc-200 p-2.5 rounded-xl focus:ring-2 focus:ring-brand/5 outline-none transition-all font-mono text-zinc-900 text-sm block resize-none"
                                                        placeholder="Enter TikTok Events API Token"
                                                    />
                                                </div>


                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md">


                                                    <div className="space-y-1">


                                                        <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider ml-1">EAPI Test Event Code</label>


                                                        <input


                                                            type="text"


                                                            name="tiktok_test_event_code"


                                                            value={config.tiktok_test_event_code || ''}


                                                            onChange={handleChange}


                                                            className="w-full bg-zinc-50 border border-zinc-200 p-2.5 rounded-xl focus:ring-2 focus:ring-brand/5 outline-none transition-all font-mono text-zinc-900 text-sm"


                                                            placeholder="TEST12345"


                                                        />


                                                    </div>


                                                    <div className="flex items-center pt-5">


                                                        <input 


                                                            type="checkbox"


                                                            id="tiktok_enable_advanced_matching"


                                                            checked={config.tiktok_enable_advanced_matching ?? false}


                                                            onChange={(e) => setConfig(prev => ({ ...prev, tiktok_enable_advanced_matching: e.target.checked }))}


                                                            className="w-4 h-4 text-brand bg-zinc-50 border-zinc-200 rounded focus:ring-brand"


                                                        />


                                                        <label htmlFor="tiktok_enable_advanced_matching" className="text-xs font-bold text-zinc-700 ml-2">Advanced Matching</label>


                                                    </div>


                                                </div>


                                            </div>


                                        )}
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer mt-1 flex-shrink-0">
                                    <input
                                        type="checkbox"
                                        checked={config.enable_tiktok_pixel ?? true}
                                        onChange={(e) => setConfig(prev => ({ ...prev, enable_tiktok_pixel: e.target.checked }))}
                                        className="sr-only peer"
                                    />
                                    <div className="w-10 h-5 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand"></div>
                                </label>
                            </div>
                        </div>

                        {/* Pinterest Tag */}
                        <div className="py-6">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-4 flex-1">
                                    <div className="p-2 bg-zinc-50 rounded-xl border border-zinc-100 flex items-center justify-center w-12 h-12 flex-shrink-0">
                                        <PinterestIcon />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-sm font-bold text-zinc-950">Your Pinterest Tag</h4>
                                        <div className="text-[11px] font-medium text-zinc-500 mt-1 flex flex-wrap gap-x-3 gap-y-1">
                                            <span>Find Pinterest Tag ID: <a href="https://help.pinterest.com/en/business/article/add-the-pinterest-tag" target="_blank" rel="noopener noreferrer" className="text-brand hover:underline font-semibold">click here</a></span>
                                            <span className="text-zinc-300">|</span>
                                            <span>Verify implementation: <a href="https://help.pinterest.com/en/business/article/pinterest-tag-helper" target="_blank" rel="noopener noreferrer" className="text-brand hover:underline font-semibold">tag helper</a></span>
                                        </div>{config.enable_pinterest_tag && (


                                            <div className="mt-4 space-y-4 animate-in slide-in-from-top-2 duration-200">


                                                <div className="space-y-1">


                                                    <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider ml-1">Tag ID</label>


                                                    <input


                                                        type="text"


                                                        name="pinterest_tag_id"


                                                        value={config.pinterest_tag_id || ''}


                                                        onChange={handleChange}


                                                        className="w-full max-w-md bg-zinc-50 border border-zinc-200 p-2.5 rounded-xl focus:ring-2 focus:ring-brand/5 outline-none transition-all font-mono text-zinc-900 text-sm block"


                                                        placeholder="Enter Pinterest Tag ID (e.g. 26XXXXXXXXX)"


                                                    />


                                                </div>


                                                <div className="space-y-1">


                                                    <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider ml-1">Ad Account ID</label>


                                                    <input


                                                        type="text"


                                                        name="pinterest_ad_account_id"


                                                        value={config.pinterest_ad_account_id || ''}


                                                        onChange={handleChange}


                                                        className="w-full max-w-md bg-zinc-50 border border-zinc-200 p-2.5 rounded-xl focus:ring-2 focus:ring-brand/5 outline-none transition-all font-mono text-zinc-900 text-sm block"


                                                        placeholder="Enter Pinterest Ad Account ID"


                                                    />


                                                </div>


                                                <div className="space-y-1">


                                                    <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider ml-1">Conversions API Token</label>


                                                    <textarea


                                                        name="pinterest_capi_token"


                                                        value={config.pinterest_capi_token || ''}


                                                        onChange={handleChange}


                                                        rows={2}


                                                        className="w-full max-w-md bg-zinc-50 border border-zinc-200 p-2.5 rounded-xl focus:ring-2 focus:ring-brand/5 outline-none transition-all font-mono text-zinc-900 text-sm block resize-none"


                                                        placeholder="Enter Pinterest Conversions API Token"


                                                    />


                                                </div>


                                                <div className="flex flex-col sm:flex-row gap-4 max-w-md">


                                                    <div className="flex items-center">


                                                        <input 


                                                            type="checkbox"


                                                            id="pinterest_enhanced_match"


                                                            checked={config.pinterest_enhanced_match ?? false}


                                                            onChange={(e) => setConfig(prev => ({ ...prev, pinterest_enhanced_match: e.target.checked }))}


                                                            className="w-4 h-4 text-brand bg-zinc-50 border-zinc-200 rounded focus:ring-brand"


                                                        />


                                                        <label htmlFor="pinterest_enhanced_match" className="text-xs font-bold text-zinc-700 ml-2">Enhanced Match</label>


                                                    </div>


                                                    <div className="flex items-center">


                                                        <input 


                                                            type="checkbox"


                                                            id="pinterest_advanced_matching"


                                                            checked={config.pinterest_advanced_matching ?? false}


                                                            onChange={(e) => setConfig(prev => ({ ...prev, pinterest_advanced_matching: e.target.checked }))}


                                                            className="w-4 h-4 text-brand bg-zinc-50 border-zinc-200 rounded focus:ring-brand"


                                                        />


                                                        <label htmlFor="pinterest_advanced_matching" className="text-xs font-bold text-zinc-700 ml-2">Advanced Matching</label>


                                                    </div>


                                                </div>


                                            </div>


                                        )}
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer mt-1 flex-shrink-0">
                                    <input
                                        type="checkbox"
                                        checked={config.enable_pinterest_tag ?? true}
                                        onChange={(e) => setConfig(prev => ({ ...prev, enable_pinterest_tag: e.target.checked }))}
                                        className="sr-only peer"
                                    />
                                    <div className="w-10 h-5 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand"></div>
                                </label>
                            </div>
                        </div>

                        {/* Microsoft UET Tag (Bing) */}
                        <div className="py-6">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-4 flex-1">
                                    <div className="p-2 bg-zinc-50 rounded-xl border border-zinc-100 flex items-center justify-center w-12 h-12 flex-shrink-0">
                                        <BingIcon />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-sm font-bold text-zinc-950">Your Microsoft UET Tag (Bing)</h4>
                                        <div className="text-[11px] font-medium text-zinc-500 mt-1 flex flex-wrap gap-x-3 gap-y-1">
                                            <span>Learn about UET Tag: <a href="https://help.ads.microsoft.com/#apex/ads/en/56687/2" target="_blank" rel="noopener noreferrer" className="text-brand hover:underline font-semibold">click here</a></span>
                                            <span className="text-zinc-300">|</span>
                                            <span>How to create UET: <a href="https://help.ads.microsoft.com/#apex/ads/en/56799/2" target="_blank" rel="noopener noreferrer" className="text-brand hover:underline font-semibold">watch guide</a></span>
                                        </div>{config.enable_bing_uet && (


                                            <div className="mt-4 space-y-4 animate-in slide-in-from-top-2 duration-200">


                                                <div className="space-y-1">


                                                    <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider ml-1">UET Tag ID</label>


                                                    <input


                                                        type="text"


                                                        name="bing_uet_id"


                                                        value={config.bing_uet_id || ''}


                                                        onChange={handleChange}


                                                        className="w-full max-w-md bg-zinc-50 border border-zinc-200 p-2.5 rounded-xl focus:ring-2 focus:ring-brand/5 outline-none transition-all font-mono text-zinc-900 text-sm block"


                                                        placeholder="Enter Bing UET ID (e.g. 56XXXXXX)"


                                                    />


                                                </div>


                                                <div className="flex items-center pt-2">


                                                    <input 


                                                        type="checkbox"


                                                        id="bing_uet_enhanced_conversions"


                                                        checked={config.bing_uet_enhanced_conversions ?? false}


                                                        onChange={(e) => setConfig(prev => ({ ...prev, bing_uet_enhanced_conversions: e.target.checked }))}


                                                        className="w-4 h-4 text-brand bg-zinc-50 border-zinc-200 rounded focus:ring-brand"


                                                    />


                                                    <label htmlFor="bing_uet_enhanced_conversions" className="text-xs font-bold text-zinc-700 ml-2">Enhanced Conversions</label>


                                                </div>


                                            </div>


                                        )}


                                        </div>


                                        </div>


                                        


                                        {/* Microsoft Clarity */}


                                        <div className="py-6 border-t border-zinc-100">


                                            <div className="flex items-start justify-between gap-4">


                                                <div className="flex items-start gap-4 flex-1">


                                                    <div className="p-2 bg-zinc-50 rounded-xl border border-zinc-100 flex items-center justify-center w-12 h-12 flex-shrink-0">


                                                        <Globe className="w-6 h-6 text-indigo-600" />


                                                    </div>


                                                    <div className="flex-1">


                                                        <h4 className="text-sm font-bold text-zinc-950">Microsoft Clarity</h4>


                                                        <div className="text-[11px] font-medium text-zinc-500 mt-1">


                                                            <span>Enables Clarity heatmaps and session recordings. Find Project ID: <a href="https://clarity.microsoft.com/" target="_blank" rel="noopener noreferrer" className="text-brand hover:underline font-semibold">click here</a></span>


                                                        </div>


                                        


                                                        {config.enable_microsoft_clarity && (


                                                            <div className="mt-4 space-y-4 animate-in slide-in-from-top-2 duration-200">


                                                                <div className="space-y-1">


                                                                    <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider ml-1">Project ID</label>


                                                                    <input


                                                                        type="text"


                                                                        name="microsoft_clarity_project_id"


                                                                        value={config.microsoft_clarity_project_id || ''}


                                                                        onChange={handleChange}


                                                                        className="w-full max-w-md bg-zinc-50 border border-zinc-200 p-2.5 rounded-xl focus:ring-2 focus:ring-brand/5 outline-none transition-all font-mono text-zinc-900 text-sm block"


                                                                        placeholder="Enter Clarity Project ID (e.g. q9zk3x7p2w)"


                                                                    />


                                                                </div>


                                                            </div>


                                                        )}


                                                    </div>


                                                </div>


                                                <label className="relative inline-flex items-center cursor-pointer mt-1 flex-shrink-0">


                                                    <input


                                                        type="checkbox"


                                                        checked={config.enable_microsoft_clarity ?? true}


                                                        onChange={(e) => setConfig(prev => ({ ...prev, enable_microsoft_clarity: e.target.checked }))}


                                                        className="sr-only peer"


                                                    />


                                                    <div className="w-10 h-5 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand"></div>


                                                </label>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer mt-1 flex-shrink-0">
                                    <input
                                        type="checkbox"
                                        checked={config.enable_bing_uet ?? true}
                                        onChange={(e) => setConfig(prev => ({ ...prev, enable_bing_uet: e.target.checked }))}
                                        className="sr-only peer"
                                    />
                                    <div className="w-10 h-5 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand"></div>
                                </label>
                            </div>
                        </div>

                        {/* Reddit Tag */}
                        <div className="py-6">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-4 flex-1">
                                    <div className="p-2 bg-zinc-50 rounded-xl border border-zinc-100 flex items-center justify-center w-12 h-12 flex-shrink-0">
                                        <RedditIcon />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-sm font-bold text-zinc-950">Your Reddit Tag</h4>
                                        <div className="text-[11px] font-medium text-zinc-500 mt-1 flex flex-wrap gap-x-3 gap-y-1">
                                            <span>Reddit Tag Integration: <a href="https://business.reddithelp.com/helpcenter/s/article/Install-the-Reddit-Pixel" target="_blank" rel="noopener noreferrer" className="text-brand hover:underline font-semibold">click here</a></span>
                                            <span className="text-zinc-300">|</span>
                                            <span>Verify conversions: <a href="https://business.reddithelp.com/helpcenter/s/article/Reddit-Pixel-Helper" target="_blank" rel="noopener noreferrer" className="text-brand hover:underline font-semibold">pixel helper</a></span>
                                        </div>

                                        {config.enable_reddit_tag && (
                                            <div className="mt-4 animate-in slide-in-from-top-2 duration-200">
                                                <input
                                                    type="text"
                                                    name="reddit_tag_id"
                                                    value={config.reddit_tag_id || ''}
                                                    onChange={handleChange}
                                                    className="w-full max-w-md bg-zinc-50 border border-zinc-200 p-2.5 rounded-xl focus:ring-2 focus:ring-brand/5 outline-none transition-all font-mono text-zinc-900 text-sm"
                                                    placeholder="Enter Reddit Tag ID (e.g. t2_xxxxxx)"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer mt-1 flex-shrink-0">
                                    <input
                                        type="checkbox"
                                        checked={config.enable_reddit_tag ?? true}
                                        onChange={(e) => setConfig(prev => ({ ...prev, enable_reddit_tag: e.target.checked }))}
                                        className="sr-only peer"
                                    />
                                    <div className="w-10 h-5 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand"></div>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* GTM Tag Card */}
                <div className="next-panel p-8">
                    <div className="flex items-center justify-between mb-8 border-b border-zinc-100 pb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-zinc-100 rounded-lg text-zinc-900"><PenTool size={18} /></div>
                            <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-900">GTM Tag</h3>
                        </div>
                    </div>

                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4 flex-1">
                            <div className="p-2 bg-zinc-50 rounded-xl border border-zinc-100 flex items-center justify-center w-12 h-12 flex-shrink-0">
                                <GtmIcon />
                            </div>
                            <div className="flex-1">
                                <h4 className="text-sm font-bold text-zinc-950">Your GTM Tag</h4>
                                <div className="text-[11px] font-medium text-zinc-500 mt-1 flex flex-wrap gap-x-3 gap-y-1">
                                    <span>Google Tag Manager setup: <a href="https://support.google.com/tagmanager/answer/6103696" target="_blank" rel="noopener noreferrer" className="text-brand hover:underline font-semibold">click here</a></span>
                                    <span className="text-zinc-300">|</span>
                                    <span>Workspace overview: <a href="https://tagmanager.google.com" target="_blank" rel="noopener noreferrer" className="text-brand hover:underline font-semibold">visit console</a></span>
                                </div>

                                {config.enable_google_tag_manager && (
                                    <div className="mt-4 animate-in slide-in-from-top-2 duration-200">
                                        <input
                                            type="text"
                                            name="google_tag_manager_id"
                                            value={config.google_tag_manager_id || ''}
                                            onChange={handleChange}
                                            className="w-full max-w-md bg-zinc-50 border border-zinc-200 p-2.5 rounded-xl focus:ring-2 focus:ring-brand/5 outline-none transition-all font-mono text-zinc-900 text-sm"
                                            placeholder="Enter GTM ID (e.g. GTM-XXXXXXX)"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer mt-1 flex-shrink-0">
                            <input
                                type="checkbox"
                                checked={config.enable_google_tag_manager ?? true}
                                onChange={(e) => setConfig(prev => ({ ...prev, enable_google_tag_manager: e.target.checked }))}
                                className="sr-only peer"
                            />
                            <div className="w-10 h-5 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand"></div>
                        </label>
                    </div>
                </div>
                
                {/* Custom Head Scripts Card */}
                <div className="next-panel p-8">
                    <div className="flex items-center justify-between mb-8 border-b border-zinc-100 pb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-zinc-100 rounded-lg text-zinc-900"><Globe size={18} /></div>
                            <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-900">Custom Head Script / HTML</h3>
                        </div>
                    </div>

                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4 flex-1">
                            <div className="flex-1">
                                <h4 className="text-sm font-bold text-zinc-950">Header Scripts</h4>
                                <div className="text-[11px] font-medium text-zinc-500 mt-1">
                                    Inject custom HTML/JavaScript tracking scripts directly into the document head (e.g. Hotjar, custom conversion scripts).
                                </div>

                                {config.enable_custom_head_script && (
                                    <div className="mt-4 animate-in slide-in-from-top-2 duration-200 space-y-2">
                                        <textarea
                                            name="custom_head_script"
                                            value={config.custom_head_script || ''}
                                            onChange={handleChange}
                                            rows={8}
                                            className="w-full bg-zinc-50 border border-zinc-200 p-3 rounded-xl focus:ring-2 focus:ring-brand/5 outline-none transition-all font-mono text-zinc-900 text-xs resize-y"
                                            placeholder="<!-- Insert custom scripts here (e.g. <script>...</script>) -->"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer mt-1 flex-shrink-0">
                            <input
                                type="checkbox"
                                checked={config.enable_custom_head_script ?? false}
                                onChange={(e) => setConfig(prev => ({ ...prev, enable_custom_head_script: e.target.checked }))}
                                className="sr-only peer"
                            />
                            <div className="w-10 h-5 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand"></div>
                        </label>
                    </div>
                </div>
            </>
        )}

        {activeTab === 'integrations' && (
            <>
                {/* Checkout Configuration */}
                <div className="next-panel p-8">
                    <div className="flex items-center gap-3 mb-8 border-b border-zinc-100 pb-4">
                        <div className="p-2 bg-zinc-100 rounded-lg text-zinc-900"><PenTool size={18} /></div>
                        <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-900">Checkout Configuration</h3>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-2xl border border-zinc-200">
                            <div>
                                <span className="text-[10px] font-bold text-zinc-900 uppercase tracking-widest block">Enable District & Upazila</span>
                                <span className="text-[9px] font-medium text-zinc-400 block mt-0.5">Toggle between District/Upazila selection and manual Shipping Zones</span>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="enable_district_upazila"
                                    checked={config.enable_district_upazila || false}
                                    onChange={handleChange}
                                    className="sr-only peer"
                                />
                                <div className="w-10 h-5 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand"></div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Integration Stack */}
                <div className="next-panel p-8">
                    <div className="flex items-center gap-3 mb-8 border-b border-zinc-100 pb-4">
                        <div className="p-2 bg-zinc-100 rounded-lg text-zinc-900"><Shield size={18} /></div>
                        <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-900">Delivery API Integration</h3>
                    </div>

                    <div className="space-y-12">
                        {/* Courier: Steadfast */}
                        <div className="space-y-6">
                            <h4 className="text-[10px] font-black text-zinc-900 uppercase tracking-[0.2em] flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Steadfast Courier
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">API Key</label>
                                    <input 
                                        type="text" 
                                        name="steadfast_api_key" 
                                        value={config.steadfast_api_key || ''} 
                                        onChange={handleChange} 
                                        placeholder="Enter Steadfast API Key" 
                                        className="w-full bg-zinc-50 border border-zinc-200 p-3 rounded-xl focus:ring-2 focus:ring-brand/5 outline-none transition-all font-semibold text-zinc-900 text-sm" 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Secret Key</label>
                                    <input 
                                        type="password" 
                                        name="steadfast_secret_key" 
                                        value={config.steadfast_secret_key || ''} 
                                        onChange={handleChange} 
                                        placeholder="Enter Steadfast Secret Key" 
                                        className="w-full bg-zinc-50 border border-zinc-200 p-3 rounded-xl focus:ring-2 focus:ring-brand/5 outline-none transition-all font-semibold text-zinc-900 text-sm" 
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Courier: Carrybee */}
                        <div className="space-y-6 pt-6 border-t border-zinc-100">
                            <h4 className="text-[10px] font-black text-zinc-900 uppercase tracking-[0.2em] flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Carrybee Courier
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Base URL</label>
                                    <input 
                                        type="text" 
                                        name="carrybee_base_url" 
                                        value={config.carrybee_base_url || ''} 
                                        onChange={handleChange} 
                                        placeholder="https://developers.carrybee.com" 
                                        className="w-full bg-zinc-50 border border-zinc-200 p-3 rounded-xl focus:ring-2 focus:ring-brand/5 outline-none transition-all font-semibold text-zinc-900 text-sm" 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Client ID</label>
                                    <input 
                                        type="text" 
                                        name="carrybee_client_id" 
                                        value={config.carrybee_client_id || ''} 
                                        onChange={handleChange} 
                                        placeholder="Enter Carrybee Client ID" 
                                        className="w-full bg-zinc-50 border border-zinc-200 p-3 rounded-xl focus:ring-2 focus:ring-brand/5 outline-none transition-all font-semibold text-zinc-900 text-sm" 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Client Secret</label>
                                    <input 
                                        type="password" 
                                        name="carrybee_client_secret" 
                                        value={config.carrybee_client_secret || ''} 
                                        onChange={handleChange} 
                                        placeholder="Enter Carrybee Client Secret" 
                                        className="w-full bg-zinc-50 border border-zinc-200 p-3 rounded-xl focus:ring-2 focus:ring-brand/5 outline-none transition-all font-semibold text-zinc-900 text-sm" 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Client Context</label>
                                    <input 
                                        type="text" 
                                        name="carrybee_client_context" 
                                        value={config.carrybee_client_context || ''} 
                                        onChange={handleChange} 
                                        placeholder="Enter Carrybee Client Context" 
                                        className="w-full bg-zinc-50 border border-zinc-200 p-3 rounded-xl focus:ring-2 focus:ring-brand/5 outline-none transition-all font-semibold text-zinc-900 text-sm" 
                                    />
                                </div>
                            </div>
                        </div>


                        {/* Webhooks */}
                        <div className="space-y-6 pt-6 border-t border-zinc-100">
                            <div className="flex justify-between items-center">
                                <h4 className="text-[10px] font-black text-zinc-900 uppercase tracking-[0.2em]">External Webhooks</h4>
                                <div className="flex items-center gap-2 px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full text-[9px] font-bold border border-emerald-100 uppercase">
                                    <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" /> Listening
                                </div>
                            </div>
                            
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Callback Endpoint</label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            readOnly
                                            value={`${BASE_URL.replace(/\/$/, '')}/api/webhooks/courier/`}
                                            className="flex-1 bg-zinc-100 border border-zinc-200 p-3 rounded-xl font-mono text-[10px] text-zinc-500 outline-none"
                                        />
                                        <button 
                                            type="button"
                                            onClick={() => {
                                                navigator.clipboard.writeText(`${BASE_URL.replace(/\/$/, '')}/api/webhooks/courier/`);
                                                alert('URL copied');
                                            }}
                                            className="p-3 bg-brand text-white rounded-xl hover:bg-black transition-all active:scale-95"
                                        >
                                            <Copy size={16} />
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Secure Auth Token</label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            name="webhook_auth_token"
                                            value={config.webhook_auth_token || ''}
                                            onChange={handleChange}
                                            className="flex-1 bg-zinc-50 border border-zinc-200 p-3 rounded-xl focus:ring-2 focus:ring-brand/5 outline-none transition-all font-mono text-zinc-900 text-xs"
                                            placeholder="Secret bearer token..."
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const token = crypto.randomUUID ? crypto.randomUUID() : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                                                    var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
                                                    return v.toString(16);
                                                });
                                                setConfig(prev => ({ ...prev, webhook_auth_token: token }));
                                            }}
                                            className="p-3 bg-zinc-100 text-zinc-600 rounded-xl hover:bg-zinc-200 transition-all active:scale-95 font-bold text-[10px] uppercase tracking-wider whitespace-nowrap"
                                        >
                                            Generate
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* SMS Gateway Integration */}
                <div className="next-panel p-8">
                    <div className="flex items-center gap-3 mb-8 border-b border-zinc-100 pb-4">
                        <div className="p-2 bg-zinc-100 rounded-lg text-zinc-900"><MessageCircle size={18} /></div>
                        <div className="flex-1">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-900">SMS Gateway Integration</h3>
                        </div>
                        {smsBalance !== null && (
                            <div className="px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full flex items-center gap-2">
                                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Balance:</span>
                                <span className="text-[10px] font-black text-emerald-700 font-mono">৳{smsBalance}</span>
                            </div>
                        )}
                    </div>

                    <div className="space-y-8">
                        <div className="flex items-center justify-between p-4 bg-amber-50/50 rounded-2xl border border-amber-100">
                            <div>
                                <span className="text-[10px] font-bold text-amber-900 uppercase tracking-widest block">Order Confirmation SMS</span>
                                <span className="text-[9px] font-medium text-amber-600 block mt-0.5">Send automated SMS to customers when they place an order</span>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="enable_order_confirmation_sms"
                                    checked={config.enable_order_confirmation_sms || false}
                                    onChange={handleChange}
                                    className="sr-only peer"
                                />
                                <div className="w-10 h-5 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
                            </label>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">BulkSMSBD API Key</label>
                                    <input
                                        type="text"
                                        name="sms_api_key"
                                        value={config.sms_api_key || ''}
                                        onChange={handleChange}
                                        className="w-full bg-zinc-50 border border-zinc-200 p-3 rounded-xl focus:ring-2 focus:ring-brand/5 outline-none transition-all font-semibold text-zinc-900 text-sm"
                                        placeholder="Enter your API Key"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Sender ID / Masking</label>
                                    <input
                                        type="text"
                                        name="sms_sender_id"
                                        value={config.sms_sender_id || ''}
                                        onChange={handleChange}
                                        className="w-full bg-zinc-50 border border-zinc-200 p-3 rounded-xl focus:ring-2 focus:ring-brand/5 outline-none transition-all font-semibold text-zinc-900 text-sm"
                                        placeholder="8809617626322"
                                    />
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">OTP Message Format</label>
                                    <textarea
                                        name="otp_format"
                                        value={config.otp_format || ''}
                                        onChange={handleChange}
                                        rows={3}
                                        className="w-full bg-zinc-50 border border-zinc-200 p-3 rounded-xl focus:ring-2 focus:ring-brand/5 outline-none transition-all font-semibold text-zinc-900 text-sm resize-none"
                                        placeholder="Your {site_title} OTP is {otp}"
                                    />
                                    <p className="text-[10px] text-zinc-400 font-medium">Use {"{site_title}"} and {"{otp}"} as placeholders.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Payment Methods Control */}
                <div className="next-panel p-8">
                    <div className="flex items-center gap-3 mb-8 border-b border-zinc-100 pb-4">
                        <div className="p-2 bg-zinc-100 rounded-lg text-zinc-900"><CreditCard size={18} /></div>
                        <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-900">Payment Methods</h3>
                    </div>

                    <div className="space-y-4">
                        {paymentMethods.map((method: any) => (
                            <div key={method.id} className="flex items-center justify-between p-4 bg-zinc-50 rounded-2xl border border-zinc-200">
                                <div>
                                    <span className="text-[10px] font-bold text-zinc-900 uppercase tracking-widest block">{method.name}</span>
                                    <span className="text-[9px] font-medium text-zinc-400 block mt-0.5">
                                        Provider: {method.provider} | {method.is_active ? 'Active on Checkout' : 'Disabled'}
                                    </span>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={method.is_active || false}
                                        onChange={(e) => handlePaymentMethodToggle(method.id, e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-10 h-5 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand"></div>
                                </label>
                            </div>
                        ))}
                        {paymentMethods.length === 0 && (
                            <p className="text-xs text-zinc-400 italic">No payment methods found.</p>
                        )}
                    </div>
                </div>

                {/* bKash Payment Gateway Integration */}
                <div className="next-panel p-8">
                    <div className="flex items-center gap-3 mb-8 border-b border-zinc-100 pb-4">
                        <div className="p-2 bg-zinc-100 rounded-lg text-zinc-900"><Shield size={18} /></div>
                        <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-900">bKash Payment Gateway</h3>
                    </div>

                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">bKash API URL</label>
                                <input 
                                    type="text" 
                                    name="bkash_base_url" 
                                    value={config.bkash_base_url || ''} 
                                    onChange={handleChange} 
                                    placeholder="https://checkout.sandbox.bhash.com/v1.2.0-beta" 
                                    className="w-full bg-zinc-50 border border-zinc-200 p-3 rounded-xl focus:ring-2 focus:ring-brand/5 outline-none transition-all font-semibold text-zinc-900 text-sm" 
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">bKash App Key</label>
                                <input 
                                    type="text" 
                                    name="bkash_app_key" 
                                    value={config.bkash_app_key || ''} 
                                    onChange={handleChange} 
                                    placeholder="Enter bKash App Key" 
                                    className="w-full bg-zinc-50 border border-zinc-200 p-3 rounded-xl focus:ring-2 focus:ring-brand/5 outline-none transition-all font-semibold text-zinc-900 text-sm" 
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">bKash App Secret</label>
                                <input 
                                    type="password" 
                                    name="bkash_app_secret" 
                                    value={config.bkash_app_secret || ''} 
                                    onChange={handleChange} 
                                    placeholder="Enter bKash App Secret" 
                                    className="w-full bg-zinc-50 border border-zinc-200 p-3 rounded-xl focus:ring-2 focus:ring-brand/5 outline-none transition-all font-semibold text-zinc-900 text-sm" 
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">bKash Username</label>
                                <input 
                                    type="text" 
                                    name="bkash_username" 
                                    value={config.bkash_username || ''} 
                                    onChange={handleChange} 
                                    placeholder="Enter bKash Username" 
                                    className="w-full bg-zinc-50 border border-zinc-200 p-3 rounded-xl focus:ring-2 focus:ring-brand/5 outline-none transition-all font-semibold text-zinc-900 text-sm" 
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">bKash Password</label>
                                <input 
                                    type="password" 
                                    name="bkash_password" 
                                    value={config.bkash_password || ''} 
                                    onChange={handleChange} 
                                    placeholder="Enter bKash Password" 
                                    className="w-full bg-zinc-50 border border-zinc-200 p-3 rounded-xl focus:ring-2 focus:ring-brand/5 outline-none transition-all font-semibold text-zinc-900 text-sm" 
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )}

                {/* Sticky Action Bar */}
                <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[50] flex items-center justify-between bg-white/90 backdrop-blur-xl border border-zinc-200 p-4 rounded-2xl shadow-2xl transition-all duration-300 w-[90%] max-w-xl ${isDirty() ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0 pointer-events-none'}`}>
                    <div className="flex items-center gap-3 ml-2">
                        <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-pulse" />
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Configuration Modified</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => {
                                setConfig({...originalConfig});
                                setLogoPreview(originalConfig.site_logo);
                                setFaviconPreview(originalConfig.site_favicon);
                                setMessengerImagePreview(originalConfig.messenger_image);
                            }}
                            className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-900 transition-colors"
                            disabled={saving}
                        >
                            Discard
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="bg-brand text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-zinc-900/10 active:scale-95 transition-all flex items-center gap-2"
                        >
                            {saving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
                            {saving ? 'Saving...' : 'Persist Changes'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

const AssetUpload = ({ label, preview, name, onChange, hint, isFavicon }) => (
    <div className="space-y-2">
        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">{label}</label>
        <div className="flex items-center gap-4">
            <div className={`bg-white border border-zinc-200 rounded-xl flex items-center justify-center overflow-hidden shrink-0 shadow-sm ${isFavicon ? 'w-12 h-12' : 'w-20 h-12'}`}>
                {preview ? (
                    <img 
                        src={typeof preview === 'string' && (preview.startsWith('http') || preview.startsWith('blob')) ? preview : `${BASE_URL}${preview}`} 
                        alt={label} 
                        className="max-w-full max-h-full object-contain p-1" 
                    />
                ) : (
                    <div className="text-zinc-300"><Upload size={isFavicon ? 14 : 18} /></div>
                )}
            </div>
            <div className="flex-1">
                <label className="cursor-pointer inline-flex items-center justify-center w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl hover:bg-zinc-100 transition-all text-[9px] font-bold text-zinc-600 uppercase tracking-widest">
                    Change
                    <input type="file" name={name} accept="image/*" onChange={onChange} className="hidden" />
                </label>
            </div>
        </div>
        <p className="text-[8px] font-medium text-zinc-400 uppercase tracking-tight ml-1">{hint}</p>
    </div>
);

const SocialInput = ({ icon, label, name, value, onChange }) => (
    <div className="space-y-2">
        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">{label}</label>
        <div className="relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-zinc-900 transition-colors">
                {icon}
            </div>
            <input
                type="url"
                name={name}
                value={value || ''}
                onChange={onChange}
                className="w-full pl-9 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-brand/5 outline-none transition-all font-semibold text-zinc-900 text-xs"
                placeholder={`https://${label.toLowerCase()}.com/...`}
            />
        </div>
    </div>
);

export default ConfigManager;
