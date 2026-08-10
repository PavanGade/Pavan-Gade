"use client";

import { analyticsIds, trackEvent } from "@/lib/analytics";
import Script from "next/script";
import { useEffect } from "react";

export function AnalyticsProvider() {
  const { gtm, ga4, metaPixel, linkedin } = analyticsIds;

  useEffect(() => {
    trackEvent("page_view", { path: window.location.pathname });
  }, []);

  return (
    <>
      {gtm ? (
        <>
          <Script id="gtm-init" strategy="afterInteractive">{`
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({'gtm.start': new Date().getTime(), event:'gtm.js'});
          `}</Script>
          <Script
            id="gtm"
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtm.js?id=${gtm}`}
          />
        </>
      ) : null}

      {ga4 && !gtm ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${ga4}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">{`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${ga4}');
          `}</Script>
        </>
      ) : null}

      {metaPixel ? (
        <Script id="meta-pixel" strategy="afterInteractive">{`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${metaPixel}');
          fbq('track', 'PageView');
        `}</Script>
      ) : null}

      {linkedin ? (
        <Script id="linkedin-insight" strategy="afterInteractive">{`
          _linkedin_partner_id = "${linkedin}";
          window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
          window._linkedin_data_partner_ids.push(_linkedin_partner_id);
          (function(l){
            if (!l){window.lintrk=function(a,b){window.lintrk.q.push([a,b])};
            window.lintrk.q=[]}
            var s = document.getElementsByTagName("script")[0];
            var b = document.createElement("script");
            b.type = "text/javascript";b.async = true;
            b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
            s.parentNode.insertBefore(b, s);
          })(window.lintrk);
        `}</Script>
      ) : null}
    </>
  );
}
