import { useEffect } from 'react';
import { useSettings } from '../context/SettingsContext';

const PinterestTag = () => {
    const { settings } = useSettings();
    const tagId = settings?.pinterest_tag_id;

    useEffect(() => {
        if (!tagId || settings?.enable_pinterest_tag === false) return;
        if (settings?.enable_google_tag_manager === true) return;

        // Initialize Pinterest Tag script
        const scriptId = 'pinterest-tag-script';
        if (!document.getElementById(scriptId)) {
            const script = document.createElement('script');
            script.id = scriptId;
            script.innerHTML = `
                !function(e){if(!window.pintrk){window.pintrk=function(){window.pintrk.queue.push(Array.prototype.slice.call(arguments))};var n=window.pintrk;n.queue=[],n.version="3.0";var t=document.createElement("script");t.async=!0,t.src=e;var r=document.getElementsByTagName("script")[0];r.parentNode.insertBefore(t,r)}}("https://s.pinterest.com/js/pintrk.js");
                pintrk('load', '${tagId}');
                pintrk('page');
            `;
            document.head.appendChild(script);
        }

        // Listen for new dataLayer purchase events to trigger conversion
        const handlePush = (e: Event) => {
            const eventData = (e as CustomEvent).detail;
            if (eventData && eventData.event === 'purchase' && (window as any).pintrk) {
                (window as any).pintrk('track', 'checkout', {
                    value: parseFloat(eventData.ecommerce?.value) || 0,
                    currency: eventData.ecommerce?.currency || 'BDT',
                    order_id: eventData.ecommerce?.transaction_id || eventData.order_id
                });
            }
        };

        window.addEventListener('dataLayerPush', handlePush);
        
        return () => {
            window.removeEventListener('dataLayerPush', handlePush);
        };
    }, [tagId]);

    return null;
};

export default PinterestTag;
