import { createContext, useContext, ReactNode, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getSiteSettings, BASE_URL } from '../services/api';
import api from '../services/api';
import defaultLogo from '../assets/logo.svg';

interface SiteSettings {
  id: number;
  site_title: string;
  site_logo: string | null;
  footer_logo: string | null;
  site_favicon: string | null;
  meta_description: string;
  footer_description?: string;
  footer_address?: string;
  meta_keywords: string;
  facebook_url?: string;
  twitter_url?: string;
  instagram_url?: string;
  youtube_url?: string;
  discord_url?: string;
  linkedin_url?: string;
  messenger_url?: string;
  messenger_image?: string;
  whatsapp_number?: string;
  support_phone?: string;
  whatsapp_message?: string;
  show_chat_bubble?: boolean;
  facebook_pixel_id?: string;
  facebook_app_id?: string;
  facebook_capi_token?: string;
  facebook_ad_account_id?: string;
  facebook_test_code?: string;
  google_tag_id?: string;
  enable_measurement_protocol?: boolean;
  google_analytics_api_secret?: string;
  enable_server_container?: boolean;
  server_container_url?: string;
  transport_url?: string;
  google_tag_manager_id?: string;
  tiktok_pixel_id?: string;
  tiktok_events_api_token?: string;
  tiktok_test_event_code?: string;
  tiktok_enable_advanced_matching?: boolean;
  google_ads_id?: string;
  google_ads_conversion_label?: string;
  google_ads_merchant_center_id?: string;
  google_ads_business_vertical?: string;
  pinterest_tag_id?: string;
  pinterest_ad_account_id?: string;
  pinterest_capi_token?: string;
  pinterest_enhanced_match?: boolean;
  pinterest_advanced_matching?: boolean;
  bing_uet_id?: string;
  bing_uet_enhanced_conversions?: boolean;
  microsoft_clarity_project_id?: string;
  reddit_tag_id?: string;
  other_pixel_id?: string;
  custom_head_script?: string;
  enable_facebook_pixel?: boolean;
  enable_google_analytics?: boolean;
  enable_google_tag_manager?: boolean;
  enable_tiktok_pixel?: boolean;
  enable_google_ads?: boolean;
  enable_pinterest_tag?: boolean;
  enable_bing_uet?: boolean;
  enable_microsoft_clarity?: boolean;
  enable_reddit_tag?: boolean;
  enable_other_pixel?: boolean;
  enable_custom_head_script?: boolean;
  enable_district_upazila?: boolean;
}

export interface PageSeoRecord {
  id?: number;
  page_key: string;
  page_label: string;
  page_path: string;
  seo_title?: string | null;
  seo_description?: string | null;
  seo_keywords?: string | null;
}

interface SettingsContextType {
  settings: SiteSettings | null;
  isLoading: boolean;
  pageSeoList: PageSeoRecord[];
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const { data, isLoading } = useQuery({
    queryKey: ['site-settings'],
    queryFn: () => getSiteSettings().then(res => {
      const settingsArray = res.data;
      return Array.isArray(settingsArray) ? settingsArray[0] : settingsArray;
    }),
  });

  const { data: pageSeoData } = useQuery({
    queryKey: ['page-seo-all'],
    queryFn: () => api.get('page-seo/').then(res => {
      const d = res.data;
      return (Array.isArray(d) ? d : (d?.results || [])) as PageSeoRecord[];
    }),
    staleTime: 5 * 60 * 1000, // cache 5 minutes
  });

  useEffect(() => {
    if (data) {
      // Update Favicon
      if (data.site_favicon) {
        let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
        if (!link) {
          link = document.createElement('link');
          link.rel = 'icon';
          document.getElementsByTagName('head')[0].appendChild(link);
        }
        const faviconUrl = data.site_favicon.startsWith('http') 
          ? data.site_favicon 
          : `${BASE_URL}${data.site_favicon}`;
        link.href = faviconUrl;
      }
    }
  }, [data]);

  return (
    <SettingsContext.Provider value={{ settings: data || null, isLoading, pageSeoList: pageSeoData || [] }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  
  const settings = context.settings;
  
  return {
    ...context,
    siteTitle: settings?.site_title,
    siteLogo: settings?.site_logo || defaultLogo,
    footerLogo: settings?.footer_logo || settings?.site_logo || defaultLogo,
    favicon: settings?.site_favicon,
    pageSeoList: context.pageSeoList,
  };
};
