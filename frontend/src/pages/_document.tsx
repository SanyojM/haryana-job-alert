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
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8101539968683225"
     crossorigin="anonymous"></script>
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
