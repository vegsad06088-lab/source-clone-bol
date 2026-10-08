// src/lib/cookieConsent.ts

export function getConsent() {
  try {
    return JSON.parse(localStorage.getItem("cookie-consent") || "{}");
  } catch {
    return {};
  }
}

/* -----------------------------
   LOAD ANALYTICS (GA4 EXAMPLE)
-------------------------------- */
export function loadAnalytics() {
  if (document.getElementById("ga-script")) return;

  const script = document.createElement("script");
  script.id = "ga-script";
  script.async = true;
  script.src = "https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX"; // <-- replace with your GA ID
  document.head.appendChild(script);

  const inline = document.createElement("script");
  inline.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXX');
  `;
  document.head.appendChild(inline);
}

/* -----------------------------
   LOAD MARKETING SCRIPTS
   (Meta Pixel example)
-------------------------------- */
export function loadMarketing() {
  if (document.getElementById("fb-pixel")) return;

  const script = document.createElement("script");
  script.id = "fb-pixel";
  script.innerHTML = `
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', 'YOUR_PIXEL_ID');
    fbq('track', 'PageView');
  `;
  document.head.appendChild(script);
}

/* -----------------------------
   LOAD SMOOBU BOOKING WIDGET
-------------------------------- */
export function loadSmoobu() {
  if (document.getElementById("smoobu-widget")) return;

  const script = document.createElement("script");
  script.id = "smoobu-widget";
  script.src = "https://booking.smoobu.com/js/iframeResizer.min.js";
  script.async = true;
  document.head.appendChild(script);
}
