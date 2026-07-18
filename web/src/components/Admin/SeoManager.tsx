import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import { useSettings } from '../../context/SettingsContext';
import {
    Search, Save, RefreshCw, AlertCircle, CheckCircle, Globe,
    Package, FileText, ChevronRight, X, Tag, Edit3,
    ArrowLeft, BarChart2, ExternalLink, Sparkles
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface SeoEntity {
    id: number;
    name?: string;   // product
    title?: string;  // blog
    slug?: string;
    image?: string;
    seo_title?: string | null;
    seo_description?: string | null;
    seo_keywords?: string | null;
}

interface Message { type: 'success' | 'error'; text: string; }

// ─── Helpers ─────────────────────────────────────────────────────────────────
const thumb = (url?: string) =>
    url
        ? url.startsWith('http')
            ? url
            : `${import.meta.env.VITE_API_URL?.replace('/api', '') || ''}/media/${url}`
        : null;

const descLen = (s?: string | null) => (s || '').length;

// ─── Sub-components ───────────────────────────────────────────────────────────
const SeoScore = ({ entity }: { entity: SeoEntity }) => {
    let score = 0;
    if (entity.seo_title) score += 35;
    if (entity.seo_description && descLen(entity.seo_description) >= 100) score += 45;
    else if (entity.seo_description) score += 20;
    if (entity.seo_keywords) score += 20;
    const color = score >= 80 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444';
    const label = score >= 80 ? 'Good' : score >= 50 ? 'Fair' : 'Needs Work';
    return (
        <div className="flex items-center gap-2">
            <div className="relative w-8 h-8">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                    <circle cx="18" cy="18" r="15" stroke="#f4f4f5" strokeWidth="3" fill="none" />
                    <circle cx="18" cy="18" r="15" stroke={color} strokeWidth="3" fill="none"
                        strokeDasharray="94.2" strokeDashoffset={94.2 - (94.2 * score / 100)}
                        className="transition-all duration-500" />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-[8px] font-black text-zinc-900">{score}</span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color }}>{label}</span>
        </div>
    );
};

const MsgBanner = ({ msg, onClose }: { msg: Message; onClose: () => void }) => (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold animate-in slide-in-from-top-2 duration-300 ${msg.type === 'error' ? 'bg-rose-50 text-rose-700 border border-rose-100' : 'bg-emerald-50 text-emerald-700 border border-emerald-100'}`}>
        {msg.type === 'error' ? <AlertCircle size={13} /> : <CheckCircle size={13} />}
        {msg.text}
        <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100"><X size={12} /></button>
    </div>
);

// ─── Inline SEO Editor Panel ──────────────────────────────────────────────────
const SeoEditor = ({
    entity, entityType, onSave, onClose
}: {
    entity: SeoEntity;
    entityType: 'product' | 'blog' | 'category' | 'brand';
    onSave: (updated: SeoEntity) => void;
    onClose: () => void;
}) => {
    const { settings: siteSettings } = useSettings();
    const siteDomain = (siteSettings as any)?.site_url || (typeof window !== 'undefined' ? window.location.hostname : 'qbamart.com');
    const cleanDomain = siteDomain.replace(/^(https?:\/\/)?(www\.)?/, '').replace(/\/$/, '');
    const displayName = entity.name || entity.title || '';
    const [form, setForm] = useState({
        seo_title: entity.seo_title || '',
        seo_description: entity.seo_description || '',
        seo_keywords: entity.seo_keywords || '',
    });
    const [saving, setSaving] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [msg, setMsg] = useState<Message | null>(null);

    const endpoint = entityType === 'product'
        ? `products/${entity.slug}/`
        : entityType === 'blog'
        ? `blog-posts/${entity.slug}/`
        : entityType === 'category'
        ? `categories/${entity.slug}/`
        : `brands/${entity.slug}/`;

    const handleAutoGenerate = () => {
        setIsGenerating(true);
        setTimeout(() => {
            const title = displayName;
            setForm({
                seo_title: `${title} - Buy Online at Best Price`,
                seo_description: `Get the best deals on ${title}. Shop now and enjoy fast shipping and excellent customer service.`,
                seo_keywords: `${title.toLowerCase()}, buy online, best price`
            });
            setIsGenerating(false);
            setMsg({ type: 'success', text: 'Suggestions generated!' });
            setTimeout(() => setMsg(null), 2500);
        }, 800);
    };

    const handleSave = async () => {
        setSaving(true);
        setMsg(null);
        try {
            const fd = new FormData();
            fd.append('seo_title', form.seo_title);
            fd.append('seo_description', form.seo_description);
            fd.append('seo_keywords', form.seo_keywords);
            const res = await api.patch(endpoint, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
            onSave({ ...entity, ...res.data });
            setMsg({ type: 'success', text: 'SEO saved!' });
            setTimeout(() => setMsg(null), 2500);
        } catch {
            setMsg({ type: 'error', text: 'Failed to save SEO.' });
        } finally {
            setSaving(false);
        }
    };

    const titleLen = form.seo_title.length;
    const descLn = form.seo_description.length;

    return (
        <div className="animate-in slide-in-from-right-4 duration-300 space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-400 hover:text-zinc-900 transition-colors">
                        <ArrowLeft size={16} />
                    </button>
                    <div>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-0.5">
                            {entityType === 'product' ? 'Product SEO' : entityType === 'blog' ? 'Blog Post SEO' : entityType === 'category' ? 'Category SEO' : 'Brand SEO'}
                        </p>
                        <h3 className="text-base font-bold text-zinc-900 leading-tight">{displayName}</h3>
                        {entity.slug && (
                            <a href={entityType === 'product' ? `/product/${entity.slug}` : entityType === 'blog' ? `/blog/${entity.slug}` : entityType === 'category' ? `/products?category=${entity.slug}` : `/products?brand=${entity.slug}`}
                                target="_blank" rel="noopener noreferrer"
                                className="flex items-center gap-1 text-[10px] text-zinc-400 hover:text-brand transition-colors mt-0.5">
                                <ExternalLink size={10} />/{entity.slug}
                            </a>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleAutoGenerate}
                        disabled={isGenerating}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-indigo-100 transition-all border border-indigo-100 disabled:opacity-50"
                    >
                        {isGenerating ? <RefreshCw size={12} className="animate-spin" /> : <Sparkles size={12} />}
                        Auto Generate
                    </button>
                    {msg && <MsgBanner msg={msg} onClose={() => setMsg(null)} />}
                </div>
            </div>

            {/* SERP Preview */}
            <div className="next-panel p-5 space-y-1.5 bg-white">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3">Google Preview</p>
                <p className="text-[13px] text-blue-600 font-medium truncate">
                    {form.seo_title || displayName}
                </p>
                <p className="text-[11px] text-green-700 font-medium">
                    {`${cleanDomain}/${entityType === 'product' ? 'product/' : entityType === 'blog' ? 'blog/' : entityType === 'category' ? 'products?category=' : 'products?brand='}${entity.slug || ''}`}
                </p>
                <p className="text-[11px] text-zinc-500 leading-relaxed line-clamp-2">
                    {form.seo_description || 'No meta description set. Search engines will use page content instead.'}
                </p>
            </div>

            {/* Form Fields */}
            <div className="next-panel p-6 space-y-5">
                {/* SEO Title */}
                <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">SEO Title</label>
                        <span className={`text-[10px] font-bold ${titleLen > 60 ? 'text-rose-500' : titleLen > 50 ? 'text-amber-500' : 'text-zinc-400'}`}>
                            {titleLen}/60
                        </span>
                    </div>
                    <input
                        type="text"
                        value={form.seo_title}
                        onChange={e => setForm(p => ({ ...p, seo_title: e.target.value }))}
                        placeholder={displayName}
                        className="w-full bg-zinc-50 border border-zinc-200 p-3 rounded-xl text-sm font-semibold text-zinc-900 outline-none focus:ring-2 focus:ring-brand/10 transition-all"
                    />
                    <p className="text-[9px] text-zinc-400">Optimal: 50–60 characters. Leave blank to use the {entityType} name.</p>
                </div>

                {/* SEO Description */}
                <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Meta Description</label>
                        <span className={`text-[10px] font-bold ${descLn > 160 ? 'text-rose-500' : descLn > 140 ? 'text-amber-500' : 'text-zinc-400'}`}>
                            {descLn}/160
                        </span>
                    </div>
                    <textarea
                        rows={3}
                        value={form.seo_description}
                        onChange={e => setForm(p => ({ ...p, seo_description: e.target.value }))}
                        placeholder="Write a compelling description that appears in search results..."
                        className="w-full bg-zinc-50 border border-zinc-200 p-3 rounded-xl text-sm font-semibold text-zinc-900 outline-none focus:ring-2 focus:ring-brand/10 transition-all resize-none"
                    />
                    <p className="text-[9px] text-zinc-400">Optimal: 120–160 characters.</p>
                </div>

                {/* SEO Keywords */}
                <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Focus Keywords</label>
                    <input
                        type="text"
                        value={form.seo_keywords}
                        onChange={e => setForm(p => ({ ...p, seo_keywords: e.target.value }))}
                        placeholder="keyword one, keyword two, keyword three"
                        className="w-full bg-zinc-50 border border-zinc-200 p-3 rounded-xl text-sm font-semibold text-zinc-900 outline-none focus:ring-2 focus:ring-brand/10 transition-all"
                    />
                    <p className="text-[9px] text-zinc-400">Comma-separated. Keep to 5–10 highly relevant terms.</p>
                </div>

                {/* Checklist */}
                <div className="pt-2 border-t border-zinc-100 space-y-2">
                    <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">SEO Checklist</p>
                    {[
                        { label: 'SEO Title set', ok: !!form.seo_title },
                        { label: 'Title length optimal (≤60)', ok: titleLen > 0 && titleLen <= 60 },
                        { label: 'Meta description set', ok: !!form.seo_description },
                        { label: 'Description length optimal (≤160)', ok: descLn > 0 && descLn <= 160 },
                        { label: 'Focus keywords set', ok: !!form.seo_keywords },
                        { label: 'Has URL slug', ok: !!entity.slug },
                    ].map(({ label, ok }) => (
                        <div key={label} className="flex items-center gap-2">
                            <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0 ${ok ? 'bg-emerald-100 text-emerald-600' : 'bg-zinc-100 text-zinc-400'}`}>
                                {ok ? <CheckCircle size={9} /> : <AlertCircle size={9} />}
                            </div>
                            <span className={`text-[10px] font-medium ${ok ? 'text-zinc-800' : 'text-zinc-400'}`}>{label}</span>
                        </div>
                    ))}
                </div>

                <div className="flex justify-end pt-2">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-indigo-500/10"
                    >
                        {saving ? <RefreshCw size={12} className="animate-spin" /> : <Save size={12} />}
                        {saving ? 'Saving...' : 'Save SEO'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─── Entity List (Products or Blogs) ─────────────────────────────────────────
const EntitySeoList = ({
    entityType, onSelect
}: {
    entityType: 'product' | 'blog' | 'category' | 'brand';
    onSelect: (e: SeoEntity) => void;
}) => {
    const [items, setItems] = useState<SeoEntity[]>([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState('');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);

    const endpoint = entityType === 'product' ? 'products/' : entityType === 'blog' ? 'blog-posts/' : entityType === 'category' ? 'categories/' : 'brands/';
    const nameKey = entityType === 'blog' ? 'title' : 'name';

    const load = useCallback(async (q: string, pg: number) => {
        setLoading(true);
        try {
            const params: any = { page: pg, page_size: 20 };
            if (q) params.search = q;
            const res = await api.get(endpoint, { params });
            const data = res.data;
            const results: SeoEntity[] = Array.isArray(data) ? data : (data.results || []);
            setItems(pg === 1 ? results : prev => [...prev, ...results]);
            setHasMore(!!(data.next));
        } catch { /* silent */ }
        finally { setLoading(false); }
    }, [endpoint]);

    useEffect(() => { setPage(1); load(query, 1); }, [query]);
    useEffect(() => { if (page > 1) load(query, page); }, [page]);

    const seoStatus = (item: SeoEntity) => {
        const has = !!(item.seo_title || item.seo_description || item.seo_keywords);
        return has;
    };

    const filtered = items.filter(i =>
        ((i as any)[nameKey] || '').toLowerCase().includes(query.toLowerCase())
    );

    return (
        <div className="space-y-4">
            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={14} />
                <input
                    type="text"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder={`Search ${entityType}s...`}
                    className="w-full pl-9 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-medium text-zinc-900 outline-none focus:ring-2 focus:ring-brand/10 transition-all"
                />
            </div>

            {/* Stats bar */}
            <div className="flex items-center gap-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-1">
                <span>{items.length} {entityType}s</span>
                <span className="text-emerald-600">{items.filter(seoStatus).length} optimized</span>
                <span className="text-amber-600">{items.filter(i => !seoStatus(i)).length} need attention</span>
            </div>

            {/* List */}
            <div className="space-y-1.5">
                {loading && items.length === 0 ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-6 h-6 border-2 border-zinc-200 border-t-zinc-900 rounded-full animate-spin" />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-16 text-zinc-400 text-sm font-medium">
                        No {entityType}s found.
                    </div>
                ) : filtered.map(item => {
                    const isOptimized = seoStatus(item);
                    const imgSrc = thumb(item.image);
                    return (
                        <button
                            key={item.id}
                            onClick={() => onSelect(item)}
                            className="w-full flex items-center gap-4 p-3.5 rounded-xl border border-zinc-100 hover:border-brand/20 hover:bg-indigo-50/30 transition-all group text-left"
                        >
                            {/* Thumbnail */}
                            <div className="w-10 h-10 rounded-lg bg-zinc-100 overflow-hidden flex-shrink-0">
                                {imgSrc
                                    ? <img src={imgSrc} alt="" className="w-full h-full object-cover" />
                                    : <div className="w-full h-full flex items-center justify-center text-zinc-300">
                                        {entityType === 'product' ? <Package size={16} /> : entityType === 'blog' ? <FileText size={16} /> : <Tag size={16} />}
                                    </div>
                                }
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <p className="text-[13px] font-semibold text-zinc-900 leading-tight truncate">
                                    {(item as any)[nameKey]}
                                </p>
                                {item.slug && (
                                    <p className="text-[10px] text-zinc-400 font-medium mt-0.5 truncate">/{item.slug}</p>
                                )}
                                {isOptimized ? (
                                    <p className="text-[9px] font-bold text-emerald-600 mt-1 uppercase tracking-wider">
                                        ✓ SEO Configured
                                    </p>
                                ) : (
                                    <p className="text-[9px] font-bold text-amber-500 mt-1 uppercase tracking-wider">
                                        ⚠ Needs SEO Setup
                                    </p>
                                )}
                            </div>

                            {/* Score */}
                            <div className="flex-shrink-0">
                                <SeoScore entity={item} />
                            </div>

                            <ChevronRight size={14} className="text-zinc-300 group-hover:text-brand transition-colors flex-shrink-0" />
                        </button>
                    );
                })}
            </div>

            {hasMore && (
                <button
                    onClick={() => setPage(p => p + 1)}
                    disabled={loading}
                    className="w-full py-2.5 text-[10px] font-bold text-zinc-500 hover:text-zinc-900 uppercase tracking-widest border border-dashed border-zinc-200 rounded-xl hover:border-zinc-400 transition-all flex items-center justify-center gap-2"
                >
                    {loading ? <RefreshCw size={12} className="animate-spin" /> : null}
                    Load More
                </button>
            )}
        </div>
    );
};

// ─── Global SEO Settings Panel ────────────────────────────────────────────────
const GlobalSeoPanel = ({ siteSettings }: { siteSettings: any }) => {
    const [config, setConfig] = useState({ meta_description: '', meta_keywords: '', facebook_app_id: '' });
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState<Message | null>(null);

    useEffect(() => {
        if (siteSettings) {
            setConfig({
                meta_description: siteSettings.meta_description || '',
                meta_keywords: siteSettings.meta_keywords || '',
                facebook_app_id: siteSettings.facebook_app_id || '',
            });
        }
    }, [siteSettings]);

    const handleSave = async () => {
        setSaving(true);
        setMsg(null);
        try {
            const fd = new FormData();
            fd.append('meta_description', config.meta_description);
            fd.append('meta_keywords', config.meta_keywords);
            fd.append('facebook_app_id', config.facebook_app_id);
            await api.patch(`site-settings/${siteSettings?.id || 1}/`, fd, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setMsg({ type: 'success', text: 'Global SEO saved!' });
            setTimeout(() => setMsg(null), 2500);
        } catch {
            setMsg({ type: 'error', text: 'Failed to save.' });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="next-panel p-6 space-y-5">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <Globe size={15} className="text-zinc-400" />
                    <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-900">Global / Default SEO</h3>
                </div>
                {msg && <MsgBanner msg={msg} onClose={() => setMsg(null)} />}
            </div>
            <p className="text-[10px] text-zinc-400 font-medium -mt-2">
                Fallback meta tags used on pages without specific SEO settings.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                    <div className="flex justify-between">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Default Meta Keywords</label>
                    </div>
                    <input
                        type="text"
                        value={config.meta_keywords}
                        onChange={e => setConfig(p => ({ ...p, meta_keywords: e.target.value }))}
                        placeholder="e.g. ecommerce, online shop, bangladesh"
                        className="w-full bg-zinc-50 border border-zinc-200 p-3 rounded-xl text-sm font-semibold text-zinc-900 outline-none focus:ring-2 focus:ring-brand/10 transition-all"
                    />
                </div>

                <div className="space-y-1.5">
                    <div className="flex justify-between">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Facebook App ID</label>
                    </div>
                    <input
                        type="text"
                        value={config.facebook_app_id}
                        onChange={e => setConfig(p => ({ ...p, facebook_app_id: e.target.value }))}
                        placeholder="e.g. 966242223397117"
                        className="w-full bg-zinc-50 border border-zinc-200 p-3 rounded-xl text-sm font-semibold text-zinc-900 outline-none focus:ring-2 focus:ring-brand/10 transition-all"
                    />
                </div>
            </div>

            <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Default Meta Description</label>
                    <span className={`text-[10px] font-bold ${config.meta_description.length > 160 ? 'text-rose-500' : 'text-zinc-400'}`}>
                        {config.meta_description.length}/160
                    </span>
                </div>
                <textarea
                    rows={3}
                    value={config.meta_description}
                    onChange={e => setConfig(p => ({ ...p, meta_description: e.target.value }))}
                    placeholder="Site-wide fallback meta description..."
                    className="w-full bg-zinc-50 border border-zinc-200 p-3 rounded-xl text-sm font-semibold text-zinc-900 outline-none focus:ring-2 focus:ring-brand/10 transition-all resize-none"
                />
            </div>

            <div className="flex justify-end">
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-zinc-900 hover:bg-zinc-800 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all active:scale-95"
                >
                    {saving ? <RefreshCw size={12} className="animate-spin" /> : <Save size={12} />}
                    {saving ? 'Saving...' : 'Save Global SEO'}
                </button>
            </div>
        </div>
    );
};

// ─── Page SEO Editor ────────────────────────────────────────────────────────
interface PageSeoRecord {
    id?: number;
    page_key: string;
    page_label: string;
    page_path: string;
    seo_title?: string | null;
    seo_description?: string | null;
    seo_keywords?: string | null;
}

const PageSeoEditor = ({ page, onSave, onClose }: {
    page: PageSeoRecord;
    onSave: (updated: PageSeoRecord) => void;
    onClose: () => void;
}) => {
    const { settings: siteSettings } = useSettings();
    const siteDomain = (siteSettings as any)?.site_url || (typeof window !== 'undefined' ? window.location.hostname : 'qbamart.com');
    const cleanDomain = siteDomain.replace(/^(https?:\/\/)?(www\.)?/, '').replace(/\/$/, '');
    const [form, setForm] = useState({
        seo_title: page.seo_title || '',
        seo_description: page.seo_description || '',
        seo_keywords: page.seo_keywords || '',
    });
    const [saving, setSaving] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [msg, setMsg] = useState<Message | null>(null);

    const handleAutoGenerate = () => {
        setIsGenerating(true);
        setTimeout(() => {
            const title = page.page_label;
            setForm({
                seo_title: `${title} - Official Store`,
                seo_description: `Discover the best ${title} at our store. Shop now for exclusive deals and offers.`,
                seo_keywords: `${title.toLowerCase()}, shop online, exclusive deals`
            });
            setIsGenerating(false);
            setMsg({ type: 'success', text: 'Suggestions generated!' });
            setTimeout(() => setMsg(null), 2500);
        }, 800);
    };

    const handleSave = async () => {
        setSaving(true);
        setMsg(null);
        try {
            let res;
            if (page.id) {
                res = await api.patch(`page-seo/${page.page_key}/`, form);
            } else {
                res = await api.post('page-seo/', { ...form, page_key: page.page_key, page_label: page.page_label, page_path: page.page_path });
            }
            onSave({ ...page, ...res.data });
            setMsg({ type: 'success', text: 'Page SEO saved!' });
            setTimeout(() => setMsg(null), 2500);
        } catch {
            setMsg({ type: 'error', text: 'Failed to save.' });
        } finally { setSaving(false); }
    };

    const titleLen = form.seo_title.length;
    const descLn = form.seo_description.length;

    return (
        <div className="animate-in slide-in-from-right-4 duration-300 space-y-6">
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-400 hover:text-zinc-900 transition-colors">
                        <ArrowLeft size={16} />
                    </button>
                    <div>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-0.5">Page SEO</p>
                        <h3 className="text-base font-bold text-zinc-900 leading-tight">{page.page_label}</h3>
                        <p className="text-[10px] text-zinc-400 font-medium mt-0.5">{page.page_path}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleAutoGenerate}
                        disabled={isGenerating}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-indigo-100 transition-all border border-indigo-100 disabled:opacity-50"
                    >
                        {isGenerating ? <RefreshCw size={12} className="animate-spin" /> : <Sparkles size={12} />}
                        Auto Generate
                    </button>
                    {msg && <MsgBanner msg={msg} onClose={() => setMsg(null)} />}
                </div>
            </div>

            {/* SERP Preview */}
            <div className="next-panel p-5 space-y-1.5 bg-white">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3">Google Preview</p>
                <p className="text-[13px] text-blue-600 font-medium truncate">{form.seo_title || page.page_label}</p>
                <p className="text-[11px] text-green-700 font-medium">
                    {cleanDomain}{page.page_path.startsWith('/') ? page.page_path : '/' + page.page_path}
                </p>
                <p className="text-[11px] text-zinc-500 leading-relaxed line-clamp-2">
                    {form.seo_description || 'No meta description set.'}
                </p>
            </div>

            <div className="next-panel p-6 space-y-5">
                <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">SEO Title</label>
                        <span className={`text-[10px] font-bold ${titleLen > 60 ? 'text-rose-500' : titleLen > 50 ? 'text-amber-500' : 'text-zinc-400'}`}>{titleLen}/60</span>
                    </div>
                    <input type="text" value={form.seo_title}
                        onChange={e => setForm(p => ({ ...p, seo_title: e.target.value }))}
                        placeholder={page.page_label}
                        className="w-full bg-zinc-50 border border-zinc-200 p-3 rounded-xl text-sm font-semibold text-zinc-900 outline-none focus:ring-2 focus:ring-brand/10 transition-all" />
                    <p className="text-[9px] text-zinc-400">Optimal: 50–60 characters.</p>
                </div>
                <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Meta Description</label>
                        <span className={`text-[10px] font-bold ${descLn > 160 ? 'text-rose-500' : descLn > 140 ? 'text-amber-500' : 'text-zinc-400'}`}>{descLn}/160</span>
                    </div>
                    <textarea rows={3} value={form.seo_description}
                        onChange={e => setForm(p => ({ ...p, seo_description: e.target.value }))}
                        placeholder="Write a compelling description..."
                        className="w-full bg-zinc-50 border border-zinc-200 p-3 rounded-xl text-sm font-semibold text-zinc-900 outline-none focus:ring-2 focus:ring-brand/10 transition-all resize-none" />
                    <p className="text-[9px] text-zinc-400">Optimal: 120–160 characters.</p>
                </div>
                <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Focus Keywords</label>
                    <input type="text" value={form.seo_keywords}
                        onChange={e => setForm(p => ({ ...p, seo_keywords: e.target.value }))}
                        placeholder="keyword one, keyword two"
                        className="w-full bg-zinc-50 border border-zinc-200 p-3 rounded-xl text-sm font-semibold text-zinc-900 outline-none focus:ring-2 focus:ring-brand/10 transition-all" />
                </div>
                <div className="pt-2 border-t border-zinc-100 space-y-2">
                    <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">SEO Checklist</p>
                    {[
                        { label: 'SEO Title set', ok: !!form.seo_title },
                        { label: 'Title optimal (≤60)', ok: titleLen > 0 && titleLen <= 60 },
                        { label: 'Meta description set', ok: !!form.seo_description },
                        { label: 'Description optimal (≤160)', ok: descLn > 0 && descLn <= 160 },
                        { label: 'Keywords set', ok: !!form.seo_keywords },
                    ].map(({ label, ok }) => (
                        <div key={label} className="flex items-center gap-2">
                            <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0 ${ok ? 'bg-emerald-100 text-emerald-600' : 'bg-zinc-100 text-zinc-400'}`}>
                                {ok ? <CheckCircle size={9} /> : <AlertCircle size={9} />}
                            </div>
                            <span className={`text-[10px] font-medium ${ok ? 'text-zinc-800' : 'text-zinc-400'}`}>{label}</span>
                        </div>
                    ))}
                </div>
                <div className="flex justify-end pt-2">
                    <button onClick={handleSave} disabled={saving}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-indigo-500/10">
                        {saving ? <RefreshCw size={12} className="animate-spin" /> : <Save size={12} />}
                        {saving ? 'Saving...' : 'Save Page SEO'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─── Pages SEO List ───────────────────────────────────────────────────────────
const STATIC_PAGES: PageSeoRecord[] = [
    { page_key: 'home',             page_label: 'Home Page',            page_path: '/' },
    { page_key: 'products',         page_label: 'Shop / All Products',   page_path: '/products' },
    { page_key: 'blogs',            page_label: 'Blog Listing',          page_path: '/blogs' },
    { page_key: 'about-us',         page_label: 'About Us',              page_path: '/about-us' },
    { page_key: 'contact-us',       page_label: 'Contact Us',            page_path: '/contact-us' },
    { page_key: 'flash-sale',       page_label: 'Flash Sale',            page_path: '/flash-sale' },
    { page_key: 'offer',            page_label: 'Offers',                page_path: '/offer' },
    { page_key: 'brands',           page_label: 'Brands',                page_path: '/brands' },
    { page_key: 'categories',       page_label: 'Categories',            page_path: '/categories' },
    { page_key: 'shipping-policy',  page_label: 'Shipping Policy',       page_path: '/shipping-policy' },
    { page_key: 'return-policy',    page_label: 'Return & Replacement',  page_path: '/return-replacement-policy' },
    { page_key: 'privacy-policy',   page_label: 'Privacy Policy',        page_path: '/privacy-policy' },
    { page_key: 'terms-conditions', page_label: 'Terms & Conditions',    page_path: '/terms-conditions' },
];

const PAGE_ICONS: Record<string, React.ReactNode> = {
    home: <Globe size={15} />,
    products: <Package size={15} />,
    blogs: <FileText size={15} />,
};

const PagesSeoList = ({ onSelect }: { onSelect: (p: PageSeoRecord) => void }) => {
    const [pages, setPages] = useState<PageSeoRecord[]>(STATIC_PAGES);
    const [loading, setLoading] = useState(true);
    const [seeding, setSeeding] = useState(false);

    const load = async () => {
        setLoading(true);
        try {
            const res = await api.get('page-seo/');
            const records: PageSeoRecord[] = Array.isArray(res.data) ? res.data : (res.data.results || []);
            // Merge DB records into static list
            setPages(STATIC_PAGES.map(sp => {
                const db = records.find(r => r.page_key === sp.page_key);
                return db ? { ...sp, ...db } : sp;
            }));
        } catch { /* silent */ } finally { setLoading(false); }
    };

    const seed = async () => {
        setSeeding(true);
        try { await api.post('page-seo/seed/'); await load(); } catch { /* silent */ } finally { setSeeding(false); }
    };

    useEffect(() => { load(); }, []);

    const optimized = pages.filter(p => p.seo_title || p.seo_description || p.seo_keywords);

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-1">
                    <span>{pages.length} pages</span>
                    <span className="text-emerald-600">{optimized.length} optimized</span>
                    <span className="text-amber-600">{pages.length - optimized.length} need attention</span>
                </div>
                <button onClick={seed} disabled={seeding}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-[9px] font-black uppercase tracking-widest border border-dashed border-zinc-300 rounded-lg text-zinc-500 hover:text-zinc-900 hover:border-zinc-500 transition-all">
                    {seeding ? <RefreshCw size={10} className="animate-spin" /> : <RefreshCw size={10} />}
                    Seed Pages
                </button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-16">
                    <div className="w-6 h-6 border-2 border-zinc-200 border-t-zinc-900 rounded-full animate-spin" />
                </div>
            ) : (
                <div className="space-y-1.5">
                    {pages.map(page => {
                        const isOpt = !!(page.seo_title || page.seo_description || page.seo_keywords);
                        const icon = PAGE_ICONS[page.page_key] || <Globe size={15} />;
                        return (
                            <button key={page.page_key} onClick={() => onSelect(page)}
                                className="w-full flex items-center gap-4 p-3.5 rounded-xl border border-zinc-100 hover:border-brand/20 hover:bg-indigo-50/30 transition-all group text-left">
                                <div className="w-10 h-10 rounded-lg bg-zinc-100 flex items-center justify-center flex-shrink-0 text-zinc-400">
                                    {icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[13px] font-semibold text-zinc-900 leading-tight">{page.page_label}</p>
                                    <p className="text-[10px] text-zinc-400 font-medium mt-0.5">{page.page_path}</p>
                                    {isOpt
                                        ? <p className="text-[9px] font-bold text-emerald-600 mt-1 uppercase tracking-wider">✓ SEO Configured</p>
                                        : <p className="text-[9px] font-bold text-amber-500 mt-1 uppercase tracking-wider">⚠ Needs SEO Setup</p>
                                    }
                                </div>
                                <div className="flex-shrink-0">
                                    {isOpt
                                        ? <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">SET</span>
                                        : <span className="text-[10px] font-black text-zinc-400 bg-zinc-100 px-2 py-1 rounded-lg">EMPTY</span>
                                    }
                                </div>
                                <ChevronRight size={14} className="text-zinc-300 group-hover:text-brand transition-colors flex-shrink-0" />
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

// ─── Main SeoManager ──────────────────────────────────────────────────────────
type Tab = 'products' | 'blogs' | 'categories' | 'brands' | 'pages';

const SeoManager = () => {
    const { settings: siteSettings } = useSettings();
    const [activeTab, setActiveTab] = useState<Tab>('products');
    const [selected, setSelected] = useState<{ entity: SeoEntity; type: 'product' | 'blog' | 'category' | 'brand' } | null>(null);
    const [selectedPage, setSelectedPage] = useState<PageSeoRecord | null>(null);

    const handleSaved = (updated: SeoEntity) => {
        setSelected(prev => prev ? { ...prev, entity: updated } : null);
    };

    return (
        <div className="animate-in fade-in duration-500 max-w-5xl mx-auto space-y-8 pb-24">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900">SEO Manager</h2>
                <p className="text-sm text-zinc-500 mt-1 font-medium">
                    Configure search engine metadata for products and blog posts individually.
                </p>
            </div>

            {/* Global SEO panel */}
            <GlobalSeoPanel siteSettings={siteSettings} />

            {/* Tab bar */}
            <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-xl w-fit">
                {([
                    { id: 'products', label: 'Products',   icon: <Package size={13} /> },
                    { id: 'categories', label: 'Categories', icon: <Tag size={13} /> },
                    { id: 'brands', label: 'Brands', icon: <Sparkles size={13} /> },
                    { id: 'blogs',    label: 'Blog Posts', icon: <FileText size={13} /> },
                    { id: 'pages',    label: 'Pages',      icon: <Globe size={13} /> },
                ] as { id: Tab; label: string; icon: React.ReactNode }[]).map(t => (
                    <button
                        key={t.id}
                        onClick={() => { setActiveTab(t.id); setSelected(null); }}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === t.id ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-500 hover:text-zinc-900'}`}
                    >
                        {t.icon} {t.label}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="next-panel p-6">
                {activeTab === 'pages' ? (
                    selectedPage ? (
                        <PageSeoEditor
                            page={selectedPage}
                            onSave={updated => setSelectedPage(updated)}
                            onClose={() => setSelectedPage(null)}
                        />
                    ) : (
                        <PagesSeoList onSelect={p => setSelectedPage(p)} />
                    )
                ) : selected ? (
                    <SeoEditor
                        entity={selected.entity}
                        entityType={selected.type}
                        onSave={handleSaved}
                        onClose={() => setSelected(null)}
                    />
                ) : (
                    <EntitySeoList
                        key={activeTab}
                        entityType={activeTab === 'products' ? 'product' : activeTab === 'blogs' ? 'blog' : activeTab === 'categories' ? 'category' : 'brand'}
                        onSelect={e => setSelected({ entity: e, type: activeTab === 'products' ? 'product' : activeTab === 'blogs' ? 'blog' : activeTab === 'categories' ? 'category' : 'brand' })}
                    />
                )}
            </div>
        </div>
    );
};

export default SeoManager;
