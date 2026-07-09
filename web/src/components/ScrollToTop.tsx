import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { pushToDataLayer } from "../utils/dataLayer";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    window.scrollTo(0, 0);

    // Wait 150ms for document.title to update
    const timer = setTimeout(() => {
      const isProduct = pathname.startsWith('/product/');
      const isFunnel = pathname.startsWith('/offer/') || pathname.startsWith('/step/');
      const isBlog = pathname.startsWith('/blog/');

      if (isProduct || isFunnel || isBlog) return;

      pushToDataLayer({
        event: 'page_view',
        page_title: document.title || 'Qbamart',
        event_url: window.location.href,
        post_type: 'page',
        post_id: '0',
        user_role: user ? user.role : 'guest'
      });
    }, 150);

    return () => clearTimeout(timer);
  }, [pathname, user]);

  return null;
};

export default ScrollToTop;
