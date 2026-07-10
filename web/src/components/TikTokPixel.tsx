import { useEffect } from 'react';
import { useSettings } from '../context/SettingsContext';

const TikTokPixel = () => {
    const { settings } = useSettings();
    const pixelId = settings?.tiktok_pixel_id;

    useEffect(() => {
        if (!pixelId || settings?.enable_tiktok_pixel === false) return;
        if (settings?.enable_google_tag_manager === true) return;

        // Initialize TikTok SDK script
        const scriptId = 'tiktok-pixel-script';
        if (!document.getElementById(scriptId)) {
            const script = document.createElement('script');
            script.id = scriptId;
            script.innerHTML = `
                !function (w, d, t) {
                    w.TiktokSdkObject = t;
                    var ttq = w[t] = w[t] || [];
                    ttq.methods = ["page", "track", "identify", "instances", "debug", "on", "off", "once", "ready", "alias", "group", "enableCookie", "disableCookie"];
                    ttq.setAndDefer = function (t, e) {
                        t[e] = function () {
                            t.push([e].concat(Array.prototype.slice.call(arguments, 0)))
                        }
                    };
                    for (var e = 0; e < ttq.methods.length; e++) ttq.setAndDefer(ttq, ttq.methods[e]);
                    ttq.instance = function (t) {
                        for (var e = ttq._i[t] || [], n = 0; n < ttq.methods.length; n++) ttq.setAndDefer(e, ttq.methods[n]);
                        return e
                    };
                    ttq.load = function (e, n) {
                        var i = "https://analytics.tiktok.com/i18n/pixel/events.js";
                        ttq._i = ttq._i || {}, ttq._i[e] = [], ttq._i[e]._u = i, ttq._t = ttq._t || {}, ttq._t[e] = +new Date, ttq._o = ttq._o || {}, ttq._o[e] = n || {};
                        var o = d.createElement("script");
                        o.type = "text/javascript", o.async = !0, o.src = i + "?sdkid=" + e + "&lib=" + t;
                        var a = d.getElementsByTagName("script")[0];
                        a.parentNode.insertBefore(o, a)
                    };
                    ttq.load('${pixelId}');
                    ttq.page();
                }(window, document, 'ttq');
            `;
            document.head.appendChild(script);
        }
    }, [pixelId]);

    return null;
};

export default TikTokPixel;
