import { DM_Sans, Outfit } from "next/font/google";
import "./globals.css";
import { CartProvider } from "../lib/CartContext";
import { ProductProvider } from "../lib/ProductContext";
import ClientLayout from "../components/ClientLayout";

const dmSans = DM_Sans({
  variable: "--font-main",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-heading",
  subsets: ["latin"],
});

export const metadata = {
  title: "Beauty Bees | Authentic Korean Skincare in Nepal",
  description: "Shop Beauty Bees — your destination for authentic Korean skincare and beauty in Nepal. Discover the best K-beauty products.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${outfit.variable}`}>
      <body>
        <ProductProvider>
          <CartProvider>
            <ClientLayout>
              {children}
            </ClientLayout>
          </CartProvider>
        </ProductProvider>
      </body>
    </html>
  );
}
