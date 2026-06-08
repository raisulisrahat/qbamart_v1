import React from 'react';
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
  Target
} from 'lucide-react';
import { getSiteSettings } from '../../services/api';
import { motion } from 'framer-motion';

const SiteSettingsAdmin = () => {
  const queryClient = useQueryClient();
  const { data: config, isLoading } = useQuery({
    queryKey: ['site-settings'],
    queryFn: () => getSiteSettings().then(res => res.data)
  });

  const Section = ({ title, icon: Icon, children }: any) => (
    <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm overflow-hidden mb-8">
      <div className="px-8 py-6 border-b border-neutral-50 flex items-center bg-neutral-50/30">
        <Icon className="w-5 h-5 text-[#5173FB] mr-3" />
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
          defaultValue={value}
          placeholder={placeholder}
          className="w-full pl-12 pr-4 py-3.5 bg-neutral-50 border border-neutral-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#5173FB]/20 focus:border-[#5173FB] transition-all"
        />
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-neutral-900 tracking-tight">System Configuration</h1>
          <p className="text-neutral-500 mt-2 font-medium">Manage store identity and courier integrations</p>
        </div>
        <button className="flex items-center space-x-2 px-8 py-4 bg-[#5173FB] text-white rounded-2xl font-bold shadow-xl shadow-[#5173FB]/20 hover:bg-[#3a5bd9] transition-all">
          <Save className="w-5 h-5" />
          <span>Save Configuration</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <Section title="Store Identity" icon={Globe}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="Store Name" icon={Globe} value={config?.site_title} />
            <InputField label="SEO Description" icon={Target} value={config?.meta_description} />
            <InputField label="Contact Email" icon={Mail} value="support@qbamart.com" />
            <InputField label="FB Page URL" icon={Facebook} value={config?.facebook_url} />
          </div>
        </Section>

        <Section title="Courier Integration (Steadfast)" icon={Truck}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="API Key" icon={Key} type="password" value={config?.steadfast_api_key} />
            <InputField label="Secret Key" icon={Shield} type="password" value={config?.steadfast_secret_key} />
          </div>
          <p className="mt-4 text-xs text-neutral-400 italic">Required for automated shipment creation in Steadfast portal.</p>
        </Section>

        <Section title="Marketing Pixels" icon={Target}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <InputField label="Facebook Pixel ID" icon={Target} value="1234567890" />
             <InputField label="Google Analytics ID" icon={Target} value="G-XXXXXXXXXX" />
          </div>
        </Section>
      </div>
    </div>
  );
};

export default SiteSettingsAdmin;
