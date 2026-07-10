import { useEffect } from 'react';
import { useSettings } from '../context/SettingsContext';

const RedditTag = () => {
    const { settings } = useSettings();
    const tagId = settings?.reddit_tag_id;

    useEffect(() => {
        if (!tagId || settings?.enable_reddit_tag === false) return;
        if (settings?.enable_google_tag_manager === true) return;

        // Initialize Reddit Pixel script
        const scriptId = 'reddit-pixel-script';
        if (!document.getElementById(scriptId)) {
            const script = document.createElement('script');
            script.id = scriptId;
            script.innerHTML = `
                !function(w,d){if(!w.rdt){var p=w.rdt=function(){p.sendEvent?p.sendEvent.apply(p,arguments):p.callQueue.push(arguments)};p.callQueue=[];var t=d.createElement("script");t.src="https://www.redditstatic.com/ads/pixel.js",t.async=!0;var s=d.getElementsByTagName("script")[0];s.parentNode.insertBefore(t,s)}}(window,document);
                rdt('init', '${tagId}');
                rdt('track', 'PageVisit');
            `;
            document.head.appendChild(script);
        }
    }, [tagId, settings?.enable_reddit_tag]);

    return null;
};

export default RedditTag;
