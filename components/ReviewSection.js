"use client";

import { useState, useEffect } from 'react';
import styles from './ReviewSection.module.css';
import { toast } from 'react-hot-toast';
import StarRating from './StarRating';

export default function ReviewSection({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '', images: [] });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/reviews?productId=${productId}`);
      const data = await res.json();
      if (Array.isArray(data)) setReviews(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newReview, productId })
      });

      if (res.ok) {
        toast.success('Review submitted! Thank you.');
        setNewReview({ rating: 5, comment: '', images: [] });
        setShowForm(false);
        fetchReviews();
      } else {
        const err = await res.json();
        toast.error(err.error || 'Failed to submit review');
      }
    } catch (e) {
      toast.error('Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.summary}>
          <h3>Customer Reviews</h3>
          <div className={styles.ratingOverview}>
            <span className={styles.avgScore}>{averageRating}</span>
            <div className={styles.stars}>
              <StarRating initialRating={Math.round(averageRating)} readOnly={true} />
            </div>
            <span className={styles.totalCount}>({reviews.length} reviews)</span>
          </div>
        </div>
        <button className={styles.writeBtn} onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Write a Review'}
        </button>
      </div>

      {showForm && (
        <form className={styles.form} onSubmit={handleSubmit}>
          <h4>Share your experience</h4>
          <div className={styles.ratingInput}>
            <StarRating 
              initialRating={newReview.rating} 
              onRatingChange={(val) => setNewReview({...newReview, rating: val})} 
            />
          </div>
          <textarea 
            placeholder="What did you think of this product? Mention your skin type and concerns!"
            value={newReview.comment}
            onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
            required
          />
          <div className={styles.formFooter}>
            <p className={styles.imageHint}>Photo uploads coming soon!</p>
            <button type="submit" className={styles.submitBtn} disabled={submitting}>
              {submitting ? 'Submitting...' : 'Post Review'}
            </button>
          </div>
        </form>
      )}

      <div className={styles.list}>
        {loading ? (
          <p>Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p className={styles.noReviews}>No reviews yet. Be the first to review!</p>
        ) : (
          reviews.map(review => (
            <div key={review.id} className={styles.reviewCard}>
              <div className={styles.reviewTop}>
                <div className={styles.userMeta}>
                  <strong>{review.userName}</strong>
                  <div className={styles.stars}>
                    <StarRating initialRating={review.rating} readOnly={true} />
                  </div>
                </div>
                <span className={styles.date}>{new Date(review.date).toLocaleDateString()}</span>
              </div>
              <p className={styles.comment}>{review.comment}</p>
              {review.images && JSON.parse(review.images).length > 0 && (
                <div className={styles.reviewImages}>
                  {JSON.parse(review.images).map((img, i) => (
                    <img key={i} src={img} alt="User review" />
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
