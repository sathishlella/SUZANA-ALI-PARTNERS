import { Inter, Cormorant_Garamond } from "next/font/google";
import Script from "next/script";
import "./globals.css";

// GA4 measurement ID. Public by design (it ships in the page source to every
// visitor), so it is hardcoded rather than moved into env configuration.
const GA_MEASUREMENT_ID = "G-XFFC25Q5L7";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap"
});

export const metadata = {
  title: "Suzana Ali & Partners | Advocates & Solicitors",
  description:
    "Experienced and trusted legal counsel across Malaysia. Banking, property, litigation, corporate and private client matters."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable}`}>
      <body>
        {children}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
      </body>
    </html>
  );
}
