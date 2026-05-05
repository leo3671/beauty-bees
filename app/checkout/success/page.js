import Link from 'next/link';
import { CheckCircle, Package, Truck, ArrowRight } from 'lucide-react';
import styles from './success.module.css';

export default function OrderSuccess() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.iconWrapper}>
          <CheckCircle className={styles.checkIcon} />
        </div>
        
        <h1 className={styles.title}>Thank You for Your Order!</h1>
        <p className={styles.subtitle}>
          Your order has been placed successfully and is now being processed. 
          We've sent a confirmation email to your inbox.
        </p>

        <div className={styles.orderInfo}>
          <div className={styles.infoItem}>
            <Package className={styles.infoIcon} />
            <div>
              <strong>Order Confirmed</strong>
              <p>Items are being packed</p>
            </div>
          </div>
          <div className={styles.infoItem}>
            <Truck className={styles.infoIcon} />
            <div>
              <strong>Delivery</strong>
              <p>Arriving in 2-5 business days</p>
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <Link href="/account/orders" className={styles.primaryBtn}>
            Track My Order <ArrowRight size={18} />
          </Link>
          <Link href="/shop" className={styles.secondaryBtn}>
            Continue Shopping
          </Link>
        </div>

        <div className={styles.supportNote}>
          Need help? <Link href="/contact">Contact our support team</Link>
        </div>
      </div>
    </div>
  );
}
