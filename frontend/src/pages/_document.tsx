import { Html, Head, Main, NextScript } from 'next/document'
import Script from "next/script";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Add these lines to import Poppins */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-Y96FVJBE7W"></Script>
        <Script id="google-analytics" strategy="afterInteractive">
          {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          
          gtag('config', 'G-Y96FVJBE7W');
          `}
        </Script>
        <Script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8101539968683225"
     crossOrigin="anonymous"></Script>
        <Script id="facebook-pixel" strategy="afterInteractive">
          {`
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '2105995533470879');
fbq('track', 'PageView');
          `}
        </Script>
        <noscript><img height="1" width="1" style={{display:'none'}}
src="https://www.facebook.com/tr?id=2105995533470879&ev=PageView&noscript=1"
/></noscript>

      </Head>
      <body>
        <Main />
        <NextScript />
        <Script src="https://checkout.razorpay.com/v1/checkout.js"></Script>
        <Script async src="https://cdn.razorpay.com/widgets/trusted-badge.js" ></Script>
      </body>
    </Html>
  )
}
