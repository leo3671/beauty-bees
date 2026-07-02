import { DM_Sans, Outfit } from "next/font/google";
import "./globals.css";
import { CartProvider } from "../lib/CartContext";
import { ProductProvider } from "../lib/ProductContext";
import { LanguageProvider } from "../lib/LanguageContext";
import { AuthProvider } from "../lib/AuthContext";
import ClientLayout from "../components/ClientLayout";
import PostHogProvider from "../components/PostHogProvider";

const dmSans = DM_Sans({
  variable: "--font-main",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-heading",
  subsets: ["latin"],
});

export const metadata = {
  title: "Beauty Bees Cosmetics | Authentic Korean Skincare in Nepal 🐝",
  description: "Your destination for 100% authentic Korean skincare & beauty in Nepal. Shop brands like Skin1004, Anua, and more. Fast delivery across Nepal.",
  keywords: ["K-beauty Nepal", "Korean Skincare Nepal", "Authentic Cosmetics Nepal", "Beauty Bees Cosmetics", "Skin1004 Nepal", "Anua Nepal"],
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: "Beauty Bees Cosmetics | Authentic K-Beauty Nepal",
    description: "Discover the best of Korean skincare, handpicked for you.",
    url: "https://beautybees.com.np",
    siteName: "Beauty Bees Cosmetics",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${outfit.variable}`}>
      <body>
        <LanguageProvider>
          <PostHogProvider>
            <AuthProvider>
              <ProductProvider>
                <CartProvider>
                  <ClientLayout>
                    {children}
                  </ClientLayout>
                </CartProvider>
              </ProductProvider>
            </AuthProvider>
          </PostHogProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
