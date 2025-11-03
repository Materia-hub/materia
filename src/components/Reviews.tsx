import React, { useState, useEffect } from 'react';
import { Star, User } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Avatar } from './ui/avatar';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { api } from '../utils/api';
import { toast } from 'sonner@2.0.3';

interface Review {
  id: string;
  listingId: string;
  sellerId: string;
  reviewerId: string;
  reviewerName: string;
  reviewerAvatar: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface ReviewsProps {
  listingId?: string;
  sellerId?: string;
  accessToken: string | null;
  currentUserId?: string;
  onReviewAdded?: () => void;
}

export default function Reviews({ listingId, sellerId, accessToken, currentUserId, onReviewAdded }: ReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [listingId, sellerId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      let response;
      
      if (listingId) {
        response = await api.getListingReviews(listingId);
      } else if (sellerId) {
        response = await api.getSellerReviews(sellerId);
      }
      
      setReviews(response?.reviews || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!accessToken) {
      toast.error('Please sign in to leave a review');
      return;
    }
    
    if (!listingId || !sellerId) {
      toast.error('Missing listing or seller information');
      return;
    }
    
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    
    try {
      setSubmitting(true);
      await api.createReview(
        {
          listingId,
          sellerId,
          rating,
          comment,
        },
        accessToken
      );
      
      toast.success('Review submitted successfully!');
      setShowReviewDialog(false);
      setRating(0);
      setComment('');
      fetchReviews();
      
      if (onReviewAdded) {
        onReviewAdded();
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating: number, interactive: boolean = false) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? 'button' : undefined}
            onClick={interactive ? () => setRating(star) : undefined}
            onMouseEnter={interactive ? () => setHoverRating(star) : undefined}
            onMouseLeave={interactive ? () => setHoverRating(0) : undefined}
            className={interactive ? 'cursor-pointer' : 'cursor-default'}
            disabled={!interactive}
          >
            <Star
              className={`w-5 h-5 ${
                star <= (interactive ? (hoverRating || rating) : rating)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  // Filter out any null/undefined reviews and calculate average
  const validReviews = reviews.filter((review) => review && typeof review.rating === 'number');
  const averageRating = validReviews.length > 0
    ? (validReviews.reduce((sum, review) => sum + review.rating, 0) / validReviews.length).toFixed(1)
    : '0.0';

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="text-4xl text-blue-700">{averageRating}</div>
              <div>
                {renderStars(parseFloat(averageRating))}
                <p className="text-sm text-muted-foreground mt-1">
                  {validReviews.length} {validReviews.length === 1 ? 'review' : 'reviews'}
                </p>
              </div>
            </div>
          </div>
          
          {accessToken && listingId && sellerId && (
            <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Write a Review
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Write a Review</DialogTitle>
                  <DialogDescription>
                    Share your experience with this listing
                  </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div>
                    <Label>Rating *</Label>
                    <div className="mt-2">
                      {renderStars(rating, true)}
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="comment">Comment (Optional)</Label>
                    <Textarea
                      id="comment"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Tell us about your experience..."
                      rows={4}
                      className="mt-2"
                    />
                  </div>
                  
                  <div className="flex gap-3 justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowReviewDialog(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={submitting || rating === 0}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {submitting ? 'Submitting...' : 'Submit Review'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </Card>

      {/* Reviews List */}
      <div className="space-y-4">
        <h3 className="text-gray-900">Customer Reviews</h3>
        
        {loading ? (
          <Card className="p-8 text-center text-muted-foreground">
            Loading reviews...
          </Card>
        ) : validReviews.length === 0 ? (
          <Card className="p-8 text-center">
            <Star className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <p className="text-muted-foreground">No reviews yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              Be the first to review this listing
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {validReviews.map((review) => (
              <Card key={review.id} className="p-6">
                <div className="flex gap-4">
                  <Avatar className="w-10 h-10 bg-blue-100 text-blue-700 flex items-center justify-center">
                    <span>{review.reviewerAvatar}</span>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-gray-900">{review.reviewerName}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {renderStars(review.rating)}
                          <span className="text-xs text-muted-foreground">
                            {getTimeAgo(review.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {review.comment && (
                      <p className="text-muted-foreground mt-3">
                        {review.comment}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
