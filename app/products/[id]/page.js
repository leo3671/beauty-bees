import { getLiveProducts } from '../../../lib/serverData';
import styles from './page.module.css';
import AddToCartButton from '../../../components/AddToCartButton';
import ProductCard from '../../../components/ProductCard';
import ReviewSection from '../../../components/ReviewSection';
import ProductRating from '../../../components/ProductRating';

export default async function ProductDetails({ params }) {
  // Await the params to avoid Next.js sync params error in newer versions
  const resolvedParams = await params;
  const products = getLiveProducts();
  const product = products.find(p => p.id === resolvedParams.id) || products[0];

  // Logic: Find 4 related products from the same category or brand, excluding the current one
  let related = products.filter(p => 
    (p.category === product.category || p.brand === product.brand) && p.id !== product.id
  );
  
  if (related.length < 4) {
    // Fallback to other best sellers if we don't have enough related ones
    const fillers = products.filter(p => p.id !== product.id && !related.includes(p));
    related = [...related, ...fillers];
  }
  
  const recommendedProducts = related.slice(0, 4);

  return (
    <div className={`container ${styles.productPage}`}>
      <div className={styles.grid}>
        <div className={styles.imageGallery}>
          <div className={styles.mainImage}>
            <img src={product.image} alt={product.name} />
          </div>
        </div>
        
        <div className={styles.details}>
          <p className={styles.brand}>{product.brand}</p>
          <h1 className={styles.title}>
            {product.name}
            {product.originalPrice && product.originalPrice > product.price && (
              <span style={{ backgroundColor: '#ef4444', color: 'white', padding: '4px 8px', fontSize: '0.4em', borderRadius: '4px', marginLeft: '10px', verticalAlign: 'middle' }}>SALE</span>
            )}
            {product.inStock === false && (
              <span style={{ backgroundColor: '#666', color: 'white', padding: '4px 8px', fontSize: '0.4em', borderRadius: '4px', marginLeft: '10px', verticalAlign: 'middle' }}>OUT OF STOCK</span>
            )}
          </h1>
          <ProductRating productId={product.id} />
          <p className={styles.price}>
            Rs. {product.price}
            {product.originalPrice && product.originalPrice > product.price && (
              <del style={{ color: '#999', fontSize: '0.8em', marginLeft: '12px' }}>Rs. {product.originalPrice}</del>
            )}
          </p>
          
          <div className={styles.description}>
            <p>{product.description}</p>
            <p className={styles.extraInfo}>
              <strong>How to use:</strong> Apply an appropriate amount to cleansed skin and pat gently for absorption.
            </p>
          </div>

          <AddToCartButton product={product} />
          
          <div className={styles.accordion}>
            <details>
              <summary>Ingredients</summary>
              <p>Water, Glycerin, Centella Asiatica Extract, Butylene Glycol, 1,2-Hexanediol...</p>
            </details>
            <details>
              <summary>Shipping & Returns</summary>
              <p>Free shipping on orders over Rs. 5000. Returns accepted within 14 days of purchase.</p>
            </details>
          </div>
        </div>
      </div>

      {/* Recommended Products Section */}
      <div className={styles.recommendationSection}>
        <h2>You May Also Like</h2>
        <div className={styles.relatedGrid}>
          {recommendedProducts.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>

      {/* Product Reviews Section */}
      <ReviewSection productId={product.id} />
    </div>
  );
}
