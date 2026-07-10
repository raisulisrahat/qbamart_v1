import { useEffect } from 'react';
import { useSettings } from '../context/SettingsContext';

const BingUETTag = () => {
    const { settings } = useSettings();
    const tagId = settings?.bing_uet_id;

    useEffect(() => {
        if (!tagId || settings?.enable_bing_uet === false) return;
        if (settings?.enable_google_tag_manager === true) return;

        // Initialize Bing UET script
        const scriptId = 'bing-uet-script';
        if (!document.getElementById(scriptId)) {
            const script = document.createElement('script');
            script.id = scriptId;
            script.innerHTML = `
                (function(w,d,t,r,u){
                    var f,n,i;
                    w[u]=w[u]||[],f=function(){
                        var o={ti:"${tagId}"};
                        o.q=w[u],w[u]=new UET(o),w[u].push("pageLoad")
                    },
                    n=d.createElement(t),n.src=r,n.async=1,
                    n.onload=n.onreadystatechange=function(){
                        var s=this.readyState;
                        s&&s!=="loaded"&&s!=="complete"||(f(),n.onload=n.onreadystatechange=null)
                    },
                    i=d.getElementsByTagName(t)[0],i.parentNode.insertBefore(n,i)
                })(window,document,"script","//bat.bing.com/bat.js","uetq");
            `;
            document.head.appendChild(script);
        }

        // Listen for new dataLayer purchase events to trigger conversion
        const handlePush = (e: Event) => {
            const eventData = (e as CustomEvent).detail;
            if (eventData && eventData.event === 'purchase') {
                (window as any).uetq = (window as any).uetq || [];
                const trackingParams: any = {
                    'ea': 'purchase',
                    'gv': parseFloat(eventData.ecommerce?.value) || 0,
                    'gc': eventData.ecommerce?.currency || 'BDT'
                };
                (window as any).uetq.push('event', 'purchase', trackingParams);
            }
        };

        window.addEventListener('dataLayerPush', handlePush);
        
        return () => {
            window.removeEventListener('dataLayerPush', handlePush);
        };
    }, [tagId, settings]);

    return null;
};

export default BingUETTag;
