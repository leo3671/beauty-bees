"use client";

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import StarRating from './StarRating';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

export default function ReviewSection({ productId }) {
  const [reviews, setReviews]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [showForm, setShowForm]     = useState(false);
  const [newReview, setNewReview]   = useState({ rating: 5, comment: '', images: [] });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { fetchReviews(); }, [productId]);

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
    <div className="mt-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h3 className="font-heading text-xl font-bold text-bb-heading mb-2">Customer Reviews</h3>
          {reviews.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold text-bb-heading">{averageRating}</span>
              <StarRating initialRating={Math.round(averageRating)} readOnly />
              <span className="text-sm text-slate-500">({reviews.length} reviews)</span>
            </div>
          )}
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          variant={showForm ? "outline" : "default"}
          className={showForm ? "border-bb-border text-bb-text" : "bg-bb-heading text-white hover:bg-bb-text h-auto py-2.5 px-6"}
        >
          {showForm ? 'Cancel' : 'Write a Review'}
        </Button>
      </div>

      {/* Review Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 p-6 bg-bb-peach/50 rounded-2xl border border-bb-border/40 animate-fade-in">
          <h4 className="font-heading font-semibold text-bb-heading mb-4">Share your experience</h4>
          <div className="mb-4">
            <StarRating
              initialRating={newReview.rating}
              onRatingChange={(val) => setNewReview({ ...newReview, rating: val })}
            />
          </div>
          <textarea
            placeholder="What did you think of this product? Mention your skin type and concerns!"
            value={newReview.comment}
            onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
            required
            rows={4}
            className="w-full border border-bb-border/50 rounded-xl px-4 py-3 text-sm text-bb-text bg-white
              focus:outline-none focus:border-bb-pink focus:shadow-[0_0_0_3px_rgba(255,183,197,0.2)] transition-all resize-none"
          />
          <div className="flex items-center justify-between mt-4">
            <p className="text-xs text-slate-400">Photo uploads coming soon!</p>
            <Button
              type="submit"
              disabled={submitting}
              className="bg-bb-pink text-white hover:bg-bb-pink-hover h-auto py-2.5 px-6"
            >
              {submitting ? 'Submitting...' : 'Post Review'}
            </Button>
          </div>
        </form>
      )}

      {/* Reviews List */}
      <div className="flex flex-col gap-4">
        {loading ? (
          <p className="text-slate-500 text-sm">Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p className="text-slate-500 text-sm py-6 text-center">No reviews yet. Be the first to review!</p>
        ) : (
          reviews.map((review, idx) => (
            <div key={review.id}>
              <div className="py-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-bb-pink text-white text-sm font-bold">
                        {(review.userName || 'A').charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <strong className="text-sm font-semibold text-bb-heading">{review.userName}</strong>
                      <div className="mt-0.5">
                        <StarRating initialRating={review.rating} readOnly />
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400">{new Date(review.date).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-bb-text leading-relaxed">{review.comment}</p>
                {review.images && JSON.parse(review.images).length > 0 && (
                  <div className="flex gap-2 mt-3 flex-wrap">
                    {JSON.parse(review.images).map((img, i) => (
                      <img key={i} src={img} alt="User review" className="w-16 h-16 object-cover rounded-lg" />
                    ))}
                  </div>
                )}
              </div>
              {idx < reviews.length - 1 && <Separator className="bg-bb-border/30" />}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
