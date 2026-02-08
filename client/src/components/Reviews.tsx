"use client";

import { useState, useEffect } from "react";
import { Star, User } from "lucide-react";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

interface Review {
    _id: string;
    user: {
        _id: string;
        name: string;
    };
    rating: number;
    comment: string;
    createdAt: string;
}

export function Reviews({ workspaceId }: { workspaceId: string }) {
    const { isAuthenticated } = useAuth();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const fetchReviews = async () => {
        if (!workspaceId) return;
        try {
            const res = await api.get(`/reviews/workspace/${workspaceId}`);
            setReviews(res.data);
        } catch (err) {
            console.error("Failed to fetch reviews");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [workspaceId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isAuthenticated) {
            toast.error("Please login to leave a review");
            return;
        }

        setSubmitting(true);
        try {
            await api.post('/reviews', {
                workspaceId,
                rating,
                comment
            });
            toast.success("Review posted!");
            setComment("");
            fetchReviews();
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to post review");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="py-8">
            <h3 className="text-2xl font-bold mb-6">Reviews & Ratings</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="bg-secondary/20 p-6 rounded-3xl border border-border flex items-center justify-center flex-col text-center">
                    <div className="text-5xl font-black text-primary mb-2">4.9</div>
                    <div className="flex text-yellow-500 mb-2">
                        {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-5 h-5 fill-current" />)}
                    </div>
                    <p className="text-sm text-muted-foreground">{reviews.length} Trustworthy Reviews</p>
                </div>

                {isAuthenticated ? (
                    <form onSubmit={handleSubmit} className="bg-card border border-border p-6 rounded-3xl">
                        <h4 className="font-bold mb-4">Write a Review</h4>
                        <div className="flex items-center gap-2 mb-4">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    type="button"
                                    key={star}
                                    onClick={() => setRating(star)}
                                    className={`transition-all hover:scale-110 ${star <= rating ? 'text-yellow-500' : 'text-gray-300'}`}
                                >
                                    <Star className={`w-6 h-6 ${star <= rating ? 'fill-current' : ''}`} />
                                </button>
                            ))}
                        </div>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Share your experience..."
                            required
                            className="w-full bg-secondary rounded-xl p-3 text-sm outline-none border focus:border-primary/50 transition-all min-h-[80px] resize-none mb-4"
                        />
                        <button
                            disabled={submitting}
                            className="w-full bg-primary text-white font-bold py-2 rounded-xl text-sm disabled:opacity-50"
                        >
                            {submitting ? "Posting..." : "Post Review"}
                        </button>
                    </form>
                ) : (
                    <div className="bg-secondary/20 p-6 rounded-3xl border border-border flex items-center justify-center">
                        <p className="text-muted-foreground font-medium">Please <a href="/login" className="text-primary underline">login</a> to write a review.</p>
                    </div>
                )}
            </div>

            <div className="space-y-4">
                {reviews.length > 0 ? reviews.map((review) => (
                    <div key={review._id} className="bg-card border border-border p-6 rounded-3xl">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center font-bold text-primary">
                                    <User className="w-5 h-5" />
                                </div>
                                <div>
                                    <h5 className="font-bold text-sm">{review.user?.name || "Anonymous User"}</h5>
                                    <div className="flex text-yellow-500 text-xs">
                                        {[...Array(review.rating)].map((_, i) => (
                                            <Star key={i} className="w-3 h-3 fill-current" />
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <span className="text-xs text-muted-foreground">{new Date(review.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            {review.comment}
                        </p>
                    </div>
                )) : (
                    <div className="text-center text-muted-foreground py-8">
                        No reviews yet. Be the first!
                    </div>
                )}
            </div>
        </div>
    );
}
