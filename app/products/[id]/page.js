import { getLiveProducts } from '../../../lib/serverData';
import AddToCartButton from '../../../components/AddToCartButton';
import ProductCard from '../../../components/ProductCard';
import ReviewSection from '../../../components/ReviewSection';
import ProductRating from '../../../components/ProductRating';
import Image from 'next/image';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const products = await getLiveProducts();
  const product = products.find(p => p.id === resolvedParams.id);

  if (!product) {
    return {
      title: 'Product Not Found | Beauty Bees Cosmetics',
    };
  }

  return {
    title: `${product.name} | ${product.brand} | Beauty Bees Nepal`,
    description: `Buy authentic ${product.brand} ${product.name} in Nepal. ${product.description?.slice(0, 150)}... 100% genuine K-beauty at Beauty Bees Cosmetics.`,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [{ url: product.image }],
    },
  };
}

export default async function ProductDetails({ params }) {
  const resolvedParams = await params;
  const products = await getLiveProducts();
  const product = products.find(p => p.id === resolvedParams.id);

  if (!product) {
    return (
      <div className="container" style={{ padding: '100px 20px', textAlign: 'center' }}>
        <h2>Product not found</h2>
        <p>The boutique item you're looking for may have been moved or is currently out of stock.</p>
      </div>
    );
  }

  // Related products logic
  let related = products.filter(p => 
    (p.category === product.category || p.brand === product.brand) && p.id !== product.id
  );
  
  if (related.length < 4) {
    const fillers = products.filter(p => p.id !== product.id && !related.includes(p));
    related = [...related, ...fillers];
  }
  
  const recommendedProducts = related.slice(0, 4);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="text-sm text-slate-400 mb-6 flex items-center gap-2">
        <span>Shop</span> / <span className="font-semibold">{product.brand}</span> / <span className="text-bb-pink font-semibold truncate max-w-[200px]">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-16">
        {/* Image Gallery */}
        <div className="w-full">
          <div className="relative aspect-square w-full rounded-2xl bg-white border border-bb-border/30 overflow-hidden flex items-center justify-center p-4">
             <Image 
              src={product.image} 
              alt={product.name} 
              fill
              priority
              style={{ objectFit: 'contain', padding: '1.5rem' }}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
        
        {/* Details */}
        <div className="flex flex-col">
          <div className="inline-block px-3 py-1 bg-bb-peach text-bb-text text-xs font-semibold uppercase tracking-wider rounded-full w-fit mb-3">
            {product.brand}
          </div>
          
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-bb-heading mb-4 flex items-center gap-3">
            {product.name}
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-md">SALE</span>
            )}
          </h1>
          
          <div className="flex items-center gap-4 mb-4 flex-wrap text-sm border-b border-bb-border/20 pb-4">
            <ProductRating productId={product.id} />
            <span className="text-xs font-medium">
              {product.stock > 0 ? (
                <span className="text-green-600">● In Stock ({product.stock} units)</span>
              ) : (
                <span className="text-red-500">● Temporarily Unavailable</span>
              )}
            </span>
          </div>

          <p className="text-2xl font-bold text-bb-pink mb-6 flex items-baseline gap-2">
            Rs. {product.price.toLocaleString()}
            {product.originalPrice && product.originalPrice > product.price && (
              <del className="text-base font-normal text-slate-400 line-through">Rs. {product.originalPrice.toLocaleString()}</del>
            )}
          </p>
          
          <div className="text-bb-text/80 text-sm leading-relaxed mb-6">
            <p>{product.description}</p>
          </div>

          <div className="mb-8">
            <AddToCartButton product={product} />
          </div>
          
          {/* Guarantee Box */}
          <div className="grid grid-cols-2 gap-4 border-t border-bb-border/30 pt-6">
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-bb-peach/30 border border-bb-border/20">
              <span className="text-xl">✨</span>
              <p className="text-xs font-semibold text-bb-text/90">100% Authentic K-Beauty</p>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-bb-peach/30 border border-bb-border/20">
              <span className="text-xl">✈️</span>
              <p className="text-xs font-semibold text-bb-text/90">Fast Delivery Across Nepal</p>
            </div>
          </div>

          {/* Accordion / Details */}
          <div className="mt-8 space-y-3">
            <details open className="border border-bb-border/30 rounded-xl overflow-hidden bg-white">
              <summary className="px-4 py-3 text-sm font-semibold text-bb-heading bg-bb-peach/20 cursor-pointer list-none flex justify-between items-center select-none">
                Product Information
              </summary>
              <div className="p-4 text-sm text-bb-text/80 space-y-1">
                <p><strong>Category:</strong> {product.category}</p>
                <p><strong>Best For:</strong> All skin types, particularly sensitive or redness-prone skin.</p>
              </div>
            </details>
            
            <details className="border border-bb-border/30 rounded-xl overflow-hidden bg-white">
              <summary className="px-4 py-3 text-sm font-semibold text-bb-heading bg-bb-peach/20 cursor-pointer list-none flex justify-between items-center select-none">
                How to Use
              </summary>
              <div className="p-4 text-sm text-bb-text/80">
                <p>Apply an appropriate amount to cleansed skin (after toner) and pat gently for full absorption. Use morning and night for best results.</p>
              </div>
            </details>
            
            <details className="border border-bb-border/30 rounded-xl overflow-hidden bg-white">
              <summary className="px-4 py-3 text-sm font-semibold text-bb-heading bg-bb-peach/20 cursor-pointer list-none flex justify-between items-center select-none">
                Shipping & Returns
              </summary>
              <div className="p-4 text-sm text-bb-text/80">
                <p>Free shipping on orders over Rs. 10,000. Returns accepted within 7 days for unopened products. Authentic import from South Korea.</p>
              </div>
            </details>
          </div>
        </div>
      </div>

      {/* Recommendations Section */}
      <div className="mt-16 pt-8 border-t border-bb-border/30">
        <div className="text-center mb-8">
          <h2 className="font-heading text-2xl font-bold text-bb-heading mb-1">You May Also Like</h2>
          <p className="text-slate-400 text-sm">Hand-picked additions to your skincare ritual.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {recommendedProducts.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>

      <ReviewSection productId={product.id} />
    </div>
  );
}
