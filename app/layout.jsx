import "./globals.css";

export const metadata = {
  title: "Suzana Ali & Partners | Advocates & Solicitors",
  description:
    "Premium Malaysian law firm website for banking, property, litigation, corporate, probate and institutional legal matters.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000")
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
