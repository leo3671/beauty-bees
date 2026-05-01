import Link from 'next/link';
import styles from './ShopByCategory.module.css';

const categories = [
  { name: 'Cleanser', img: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=400' },
  { name: 'Toner', img: 'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&q=80&w=400' },
  { name: 'Serum/Essence', img: 'https://images.unsplash.com/photo-1629198688000-71f23e745b6e?auto=format&fit=crop&q=80&w=400' },
  { name: 'Moisturizer', img: 'https://images.unsplash.com/photo-1608248593842-8d7d4c82b130?auto=format&fit=crop&q=80&w=400' },
  { name: 'Sunscreen', img: 'https://images.unsplash.com/photo-1599305090598-fe179d501227?auto=format&fit=crop&q=80&w=400' },
  { name: 'Eye Care', img: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=400' },
  { name: 'Sheet Mask', img: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=400' },
  { name: 'Wash-off Mask', img: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=400' },
];

export default function ShopByCategory() {
  return (
    <div className={styles.categoryScrollContainer}>
      <div className={styles.categoryTrack}>
        {categories.map((cat) => (
          <Link href={`/shop?category=${encodeURIComponent(cat.name)}`} key={cat.name} className={styles.categoryItem}>
            <div className={styles.imageWrapper}>
              <img src={cat.img} alt={cat.name} />
            </div>
            <span className={styles.categoryName}>{cat.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
