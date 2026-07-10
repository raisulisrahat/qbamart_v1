import { useEffect } from 'react';
import { useSettings } from '../context/SettingsContext';

const GoogleAdsTag = () => {
    const { settings } = useSettings();
    const adsId = settings?.google_ads_id;

    useEffect(() => {
        if (!adsId || settings?.enable_google_ads === false) return;
        if (settings?.enable_google_tag_manager === true) return;

        // Initialize dataLayer
        (window as any).dataLayer = (window as any).dataLayer || [];
        
        // Setup gtag function if not exists
        if (!(window as any).gtag) {
            (window as any).gtag = function() {
                (window as any).dataLayer.push(arguments);
            };
        }

        // Ensure script is loaded
        const scriptId = 'google-tag-manager';
        if (!document.getElementById(scriptId)) {
            const script = document.createElement('script');
            script.id = scriptId;
            script.async = true;
            script.src = `https://www.googletagmanager.com/gtag/js?id=${adsId}`;
            document.head.appendChild(script);

            const inlineScript = document.createElement('script');
            inlineScript.id = 'google-tag-inline';
            inlineScript.innerHTML = `
                window.gtag('js', new Date());
            `;
            document.head.appendChild(inlineScript);
        }

        // Configure the Google Ads conversion ID
        const configOptions: any = {};
        if (settings?.google_ads_merchant_center_id) {
            configOptions.merchant_id = settings.google_ads_merchant_center_id;
        }
        (window as any).gtag('config', adsId, configOptions);

        // Listen for new dataLayer purchase events to trigger conversion
        const handlePush = (e: Event) => {
            const eventData = (e as CustomEvent).detail;
            if (eventData && eventData.event === 'purchase' && settings?.google_ads_conversion_label) {
                (window as any).gtag('event', 'conversion', {
                    'send_to': `${adsId}/${settings.google_ads_conversion_label}`,
                    'value': parseFloat(eventData.ecommerce?.value) || 0,
                    'currency': eventData.ecommerce?.currency || 'BDT',
                    'transaction_id': eventData.ecommerce?.transaction_id || eventData.order_id
                });
            }
        };

        window.addEventListener('dataLayerPush', handlePush);
        
        return () => {
            window.removeEventListener('dataLayerPush', handlePush);
        };
    }, [adsId, settings]);

    return null;
};

export default GoogleAdsTag;
