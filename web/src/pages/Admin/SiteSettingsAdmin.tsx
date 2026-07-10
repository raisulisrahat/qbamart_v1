import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Globe, 
  Key, 
  Truck, 
  Shield, 
  Save, 
  Loader2,
  CheckCircle2,
  Settings,
  Mail,
  Facebook,
  Instagram,
  Target,
  Twitter,
  Youtube,
  Phone,
  MessageCircle,
  AlertCircle,
  Send
} from 'lucide-react';
import { getSiteSettings, updateSiteSettings } from '../../services/api';
import { motion } from 'framer-motion';

const SiteSettingsAdmin = () => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<any>({});
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { data: config, isLoading } = useQuery({
    queryKey: ['site-settings'],
    queryFn: () => getSiteSettings().then(res => Array.isArray(res.data) ? res.data[0] : res.data)
  });

  useEffect(() => {
    if (config) {
      setFormData(config);
    }
  }, [config]);

  const updateMutation = useMutation({
    mutationFn: (data: any) => updateSiteSettings(config.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site-settings'] });
      setSuccessMsg('Settings updated successfully!');
      setErrorMsg(null);
      setTimeout(() => setSuccessMsg(null), 3500);
    },
    onError: (err: any) => {
      setErrorMsg(err.response?.data?.detail || 'Failed to update settings. Please try again.');
      setSuccessMsg(null);
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSave = () => {
    if (!config?.id) return;
    updateMutation.mutate(formData);
  };

  const Section = ({ title, icon: Icon, children }: any) => (
    <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm overflow-hidden mb-8">
      <div className="px-8 py-6 border-b border-neutral-50 flex items-center bg-neutral-50/30">
        <Icon className="w-5 h-5 text-brand mr-3" />
        <h3 className="font-bold text-neutral-900 uppercase tracking-widest text-xs">{title}</h3>
      </div>
      <div className="p-8">
        {children}
      </div>
    </div>
  );

  const InputField = ({ label, name, type = 'text', placeholder, value, icon: Icon }: any) => (
    <div className="space-y-2">
      <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest ml-1">{label}</label>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
           <Icon className="w-4 h-4" />
        </div>
        <input 
          type={type}
          name={name}
          value={formData[name] ?? ''}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full pl-12 pr-4 py-3.5 bg-neutral-50 border border-neutral-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all text-neutral-800 font-medium"
        />
      </div>
    </div>
  );

  const TextAreaField = ({ label, name, placeholder, rows = 3 }: any) => (
    <div className="space-y-2">
      <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest ml-1">{label}</label>
      <textarea 
        name={name}
        value={formData[name] ?? ''}
        onChange={handleChange}
        placeholder={placeholder}
        rows={rows}
        className="w-full px-4 py-3.5 bg-neutral-50 border border-neutral-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all text-neutral-800 font-medium resize-none"
      />
    </div>
  );

  const CheckboxField = ({ label, name }: any) => (
    <div className="flex items-center space-x-3 pt-6">
      <input 
        type="checkbox"
        name={name}
        checked={!!formData[name]}
        onChange={handleChange}
        className="w-5 h-5 text-brand bg-neutral-50 border-neutral-200 rounded focus:ring-brand"
      />
      <label className="text-sm font-bold text-neutral-700">{label}</label>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-brand animate-spin" />
        <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Loading configuration...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-neutral-900 tracking-tight">System Configuration</h1>
          <p className="text-neutral-500 mt-2 font-medium">Manage store identity and courier integrations</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={updateMutation.isPending}
          className="flex items-center justify-center space-x-2 px-8 py-4 bg-brand text-white rounded-2xl font-bold shadow-xl shadow-brand/20 hover:bg-[#3a5bd9] transition-all disabled:opacity-70 min-w-[200px]"
        >
          {updateMutation.isPending ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <Save className="w-5 h-5" />
              <span>Save Configuration</span>
            </>
          )}
        </button>
      </div>

      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 px-6 py-4 rounded-2xl text-sm font-semibold flex items-center space-x-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="bg-rose-50 border border-rose-100 text-rose-700 px-6 py-4 rounded-2xl text-sm font-semibold flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-8">
        <Section title="Store Identity" icon={Globe}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="Store Name" name="site_title" icon={Globe} />
            <InputField label="Support Phone" name="support_phone" icon={Phone} />
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
              <TextAreaField label="SEO Description" name="meta_description" placeholder="Brief description for search engines..." />
              <TextAreaField label="Footer Description" name="footer_description" placeholder="Footer description text..." />
              <TextAreaField label="Footer Address Info" name="footer_address" placeholder="Footer address details..." />
            </div>
            <InputField label="SEO Keywords" name="meta_keywords" icon={Target} />
          </div>
        </Section>

        <Section title="Social & Communication" icon={MessageCircle}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="Facebook Page URL" name="facebook_url" icon={Facebook} />
            <InputField label="Instagram Profile URL" name="instagram_url" icon={Instagram} />
            <InputField label="Twitter Profile URL" name="twitter_url" icon={Twitter} />
            <InputField label="YouTube Channel URL" name="youtube_url" icon={Youtube} />
            <InputField label="WhatsApp Number" name="whatsapp_number" icon={Phone} />
            <InputField label="Messenger URL" name="messenger_url" icon={Mail} />
          </div>
        </Section>

        <Section title="Courier Integration (Steadfast)" icon={Truck}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="API Key" name="steadfast_api_key" icon={Key} type="password" />
            <InputField label="Secret Key" name="steadfast_secret_key" icon={Shield} type="password" />
          </div>
          <p className="mt-4 text-xs text-neutral-400 italic">Required for automated shipment creation in Steadfast portal.</p>
        </Section>

        <Section title="Courier Integration (Carrybee)" icon={Truck}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InputField label="Client ID" name="carrybee_client_id" icon={Key} type="password" />
            <InputField label="Client Secret" name="carrybee_client_secret" icon={Shield} type="password" />
            <InputField label="Client Context" name="carrybee_client_context" icon={Globe} />
          </div>
          <p className="mt-4 text-xs text-neutral-400 italic">Required for automated shipment creation in Carrybee portal.</p>
        </Section>

        <Section title="Telegram Integration" icon={Send}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="Bot Token" name="telegram_bot_token" icon={Key} type="password" />
            <InputField label="Chat ID" name="telegram_chat_id" icon={Target} />
            <CheckboxField label="Enable Telegram Order Alert" name="enable_telegram_order_alert" />
          </div>
          <p className="mt-4 text-xs text-neutral-400 italic">Receive notifications on Telegram for every new order placed.</p>
        </Section>

        <Section title="Marketing Pixels & Tracking" icon={Target}>
          <div className="space-y-6">
            {/* Facebook Pixel & CAPI */}
            <div className="bg-neutral-50/50 p-6 rounded-2xl border border-neutral-100 space-y-6">
              <h4 className="text-xs font-bold text-neutral-800 uppercase tracking-widest">Meta Pixel & Conversions API</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <InputField label="Facebook Pixel ID" name="facebook_pixel_id" icon={Target} />
                <InputField label="Facebook Ad Account ID" name="facebook_ad_account_id" icon={Target} />
                <InputField label="Facebook Test Event Code" name="facebook_test_code" icon={Target} />
              </div>
              <div>
                <TextAreaField label="Facebook Conversions API (CAPI) Access Token" name="facebook_capi_token" placeholder="Enter CAPI Token (e.g. EAAG...)" />
              </div>
            </div>

            {/* Google Analytics GA4 */}
            <div className="bg-neutral-50/50 p-6 rounded-2xl border border-neutral-100 space-y-6">
              <h4 className="text-xs font-bold text-neutral-800 uppercase tracking-widest">Google Analytics (GA4)</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <InputField label="Google Analytics ID" name="google_tag_id" icon={Target} placeholder="e.g. G-XXXXXXXXXX" />
                <InputField label="Google Analytics API Secret" name="google_analytics_api_secret" icon={Target} placeholder="Measurement Protocol Secret" />
                <InputField label="Server Container URL" name="server_container_url" icon={Globe} placeholder="https://analytics.example.com" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <InputField label="Transport URL" name="transport_url" icon={Globe} placeholder="https://tagging.mywebsite.com" />
                <CheckboxField label="Enable GA4 Measurement Protocol" name="enable_measurement_protocol" />
                <CheckboxField label="Enable Server Container URL" name="enable_server_container" />
              </div>
            </div>

            {/* TikTok Pixel & Events API */}
            <div className="bg-neutral-50/50 p-6 rounded-2xl border border-neutral-100 space-y-6">
              <h4 className="text-xs font-bold text-neutral-800 uppercase tracking-widest">TikTok Pixel & Events API</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <InputField label="TikTok Pixel ID" name="tiktok_pixel_id" icon={Target} placeholder="e.g. CPCXXXXXXXX" />
                <InputField label="EAPI Test Event Code" name="tiktok_test_event_code" icon={Target} />
                <div className="flex items-center pt-6">
                  <CheckboxField label="Enable Advanced Matching" name="tiktok_enable_advanced_matching" />
                </div>
              </div>
              <div>
                <TextAreaField label="TikTok Events API Token" name="tiktok_events_api_token" placeholder="Enter Events API Token..." />
              </div>
            </div>

            {/* Google Ads */}
            <div className="bg-neutral-50/50 p-6 rounded-2xl border border-neutral-100 space-y-6">
              <h4 className="text-xs font-bold text-neutral-800 uppercase tracking-widest">Google Ads Conversion Tracking</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField label="Google Ads Tag ID" name="google_ads_id" icon={Target} placeholder="e.g. AW-XXXXXXXXXX" />
                <InputField label="Google Ads Conversion Label" name="google_ads_conversion_label" icon={Target} placeholder="e.g. AbC-D_efG-h" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField label="Merchant Center ID" name="google_ads_merchant_center_id" icon={Target} />
                <InputField label="Business Vertical" name="google_ads_business_vertical" icon={Target} placeholder="retail" />
              </div>
            </div>

            {/* Pinterest Tag & Conversions API */}
            <div className="bg-neutral-50/50 p-6 rounded-2xl border border-neutral-100 space-y-6">
              <h4 className="text-xs font-bold text-neutral-800 uppercase tracking-widest">Pinterest Tag & Conversions API</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField label="Pinterest Tag ID" name="pinterest_tag_id" icon={Target} placeholder="e.g. 26XXXXXXXXX" />
                <InputField label="Pinterest Ad Account ID" name="pinterest_ad_account_id" icon={Target} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <CheckboxField label="Enable Enhanced Match" name="pinterest_enhanced_match" />
                <CheckboxField label="Enable Advanced Matching" name="pinterest_advanced_matching" />
              </div>
              <div>
                <TextAreaField label="Pinterest Conversions API Token" name="pinterest_capi_token" placeholder="Enter Pinterest Conversions API Token..." />
              </div>
            </div>

            {/* Microsoft Advertising & Clarity */}
            <div className="bg-neutral-50/50 p-6 rounded-2xl border border-neutral-100 space-y-6">
              <h4 className="text-xs font-bold text-neutral-800 uppercase tracking-widest">Microsoft Advertising & Clarity</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField label="Bing UET Tag ID" name="bing_uet_id" icon={Target} placeholder="e.g. 56XXXXXX" />
                <InputField label="Microsoft Clarity Project ID" name="microsoft_clarity_project_id" icon={Target} placeholder="e.g. q9zk3x7p2w" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <CheckboxField label="Enable Enhanced Conversions" name="bing_uet_enhanced_conversions" />
                <CheckboxField label="Enable Microsoft Clarity" name="enable_microsoft_clarity" />
              </div>
            </div>

            {/* Other Pixels */}
            <div className="bg-neutral-50/50 p-6 rounded-2xl border border-neutral-100 space-y-6">
              <h4 className="text-xs font-bold text-neutral-800 uppercase tracking-widest">Other Tracking Pixels</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField label="Google Tag Manager ID" name="google_tag_manager_id" icon={Target} placeholder="e.g. GTM-XXXXXXX" />
                <InputField label="Reddit Tag ID" name="reddit_tag_id" icon={Target} placeholder="e.g. t2_xxxxxx" />
              </div>
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
};

export default SiteSettingsAdmin;
