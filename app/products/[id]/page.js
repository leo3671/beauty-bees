import { getLiveProducts } from '../../../lib/serverData';
import styles from './page.module.css';
import AddToCartButton from '../../../components/AddToCartButton';
import ProductCard from '../../../components/ProductCard';
import ReviewSection from '../../../components/ReviewSection';
import ProductRating from '../../../components/ProductRating';
import Image from 'next/image';

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
    <div className={`container ${styles.productPage}`}>
      <div className={styles.breadcrumb}>
        <span>Shop</span> / <span>{product.brand}</span> / <span className={styles.active}>{product.name}</span>
      </div>

      <div className={styles.grid}>
        <div className={styles.imageGallery}>
          <div className={styles.mainImageContainer}>
             <Image 
              src={product.image} 
              alt={product.name} 
              fill
              priority
              style={{ objectFit: 'contain' }}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
        
        <div className={styles.details}>
          <div className={styles.brandBadge}>{product.brand}</div>
          <h1 className={styles.title}>
            {product.name}
            {product.originalPrice && product.originalPrice > product.price && (
              <span className={styles.saleTag}>SALE</span>
            )}
          </h1>
          
          <div className={styles.ratingRow}>
            <ProductRating productId={product.id} />
            <span className={styles.stockStatus}>
              {product.stock > 0 ? (
                <span className={styles.inStock}>● In Stock ({product.stock} units)</span>
              ) : (
                <span className={styles.outOfStock}>● Temporarily Unavailable</span>
              )}
            </span>
          </div>

          <p className={styles.price}>
            <span className={styles.currency}>Rs.</span> {product.price.toLocaleString()}
            {product.originalPrice && product.originalPrice > product.price && (
              <del className={styles.originalPrice}>Rs. {product.originalPrice.toLocaleString()}</del>
            )}
          </p>
          
          <div className={styles.divider}></div>

          <div className={styles.description}>
            <p>{product.description}</p>
          </div>

          <AddToCartButton product={product} />
          
          <div className={styles.guaranteeBox}>
            <div className={styles.guaranteeItem}>
              <span>✨</span>
              <p>100% Authentic K-Beauty</p>
            </div>
            <div className={styles.guaranteeItem}>
              <span>✈️</span>
              <p>Fast Delivery Across Nepal</p>
            </div>
          </div>

          <div className={styles.accordion}>
            <details open>
              <summary>Product Information</summary>
              <div className={styles.detailsContent}>
                <p><strong>Category:</strong> {product.category}</p>
                <p><strong>Best For:</strong> All skin types, particularly sensitive or redness-prone skin.</p>
              </div>
            </details>
            <details>
              <summary>How to Use</summary>
              <div className={styles.detailsContent}>
                <p>Apply an appropriate amount to cleansed skin (after toner) and pat gently for full absorption. Use morning and night for best results.</p>
              </div>
            </details>
            <details>
              <summary>Shipping & Returns</summary>
              <div className={styles.detailsContent}>
                <p>Free shipping on orders over Rs. 10,000. Returns accepted within 7 days for unopened products. Authentic import from South Korea.</p>
              </div>
            </details>
          </div>
        </div>
      </div>

      <div className={styles.recommendationSection}>
        <div className={styles.sectionHeader}>
          <h2>You May Also Like</h2>
          <p>Hand-picked additions to your skincare ritual.</p>
        </div>
        <div className={styles.relatedGrid}>
          {recommendedProducts.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>

      <ReviewSection productId={product.id} />
    </div>
  );
}
