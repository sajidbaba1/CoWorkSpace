"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CreditCard, CheckCircle, AlertTriangle, Shield, Loader2, DollarSign } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function PaymentPage() {
    const { bookingId } = useParams();
    const router = useRouter();
    const [booking, setBooking] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [success, setSuccess] = useState(false);

    // Card details state
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');
    const [name, setName] = useState('');

    useEffect(() => {
        const fetchBooking = async () => {
            try {
                const res = await api.get(`/bookings/${bookingId}`);
                setBooking(res.data);
            } catch (err) {
                console.error(err);
                toast.error("Failed to load booking details");
            } finally {
                setLoading(false);
            }
        };
        if (bookingId) fetchBooking();
    }, [bookingId]);

    const handlePayment = async () => {
        if (paymentMethod === 'card' && (!cardNumber || !expiry || !cvv || !name)) {
            toast.error("Please fill in all card details");
            return;
        }

        setProcessing(true);
        try {
            // 1. Create Order
            const orderRes = await api.post('/payments/create-order', {
                bookingId,
                amount: booking?.totalPrice,
                paymentMethod
            });

            if (orderRes.data.success) {
                // 2. Simulate Payment Verification
                setTimeout(async () => {
                    const verifyRes = await api.post('/payments/verify', {
                        transactionId: orderRes.data.orderId,
                        status: 'success'
                    });

                    if (verifyRes.data.success) {
                        setSuccess(true);
                        toast.success("Payment Successful!");
                        setTimeout(() => router.push('/dashboard/user'), 2000);
                    } else {
                        toast.error("Payment verification failed");
                        setProcessing(false);
                    }
                }, 2000);
            }
        } catch (err) {
            console.error(err);
            toast.error("Payment process failed");
            setProcessing(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
    );

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-green-50">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white p-12 rounded-3xl shadow-xl text-center max-w-md"
                >
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-12 h-12 text-green-600" />
                    </div>
                    <h1 className="text-3xl font-black text-green-800 mb-2">Payment Successful!</h1>
                    <p className="text-green-600 mb-8">Your booking for <b>{booking?.workspace?.name}</b> is confirmed.</p>
                    <p className="text-sm text-green-600/60 font-bold uppercase tracking-widest">Redirecting...</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-secondary/30 pt-24 pb-12 px-6">
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Order Summary */}
                <div className="space-y-6">
                    <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="bg-card border border-border rounded-3xl p-8 shadow-sm"
                    >
                        <h2 className="text-xl font-bold mb-6">Booking Summary</h2>
                        <div className="space-y-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-lg">{booking?.workspace?.name}</h3>
                                    <p className="text-sm text-muted-foreground">{booking?.workspace?.location}</p>
                                </div>
                                <div className="text-right">
                                    <div className="font-black text-xl">${booking?.workspace?.pricePerHour}/hr</div>
                                </div>
                            </div>
                            <hr className="border-border" />
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Date</span>
                                <span className="font-bold">{new Date(booking?.date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Duration</span>
                                <span className="font-bold">{booking?.duration} Hours</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Service Fee</span>
                                <span className="font-bold">$30.00</span>
                            </div>
                            <hr className="border-border" />
                            <div className="flex justify-between items-center">
                                <span className="font-bold text-lg">Total Due</span>
                                <span className="font-black text-3xl text-primary">${booking?.totalPrice}</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Payment Form */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="bg-card border border-border rounded-3xl p-8 shadow-xl"
                >
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                            <Shield className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black">Secure Checkout</h1>
                            <p className="text-muted-foreground text-xs">Encrypted payment gateway</p>
                        </div>
                    </div>

                    <h3 className="font-bold mb-4">Payment Method</h3>
                    <div className="grid grid-cols-3 gap-3 mb-8">
                        {['card', 'paypal', 'crypto'].map(method => (
                            <button
                                key={method}
                                onClick={() => setPaymentMethod(method)}
                                className={`p-3 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${paymentMethod === method
                                    ? 'border-primary bg-primary/5 text-primary'
                                    : 'border-border hover:border-primary/30'
                                    }`}
                            >
                                {method === 'card' && <CreditCard className="w-6 h-6" />}
                                {method === 'paypal' && <DollarSign className="w-6 h-6" />}
                                {method === 'crypto' && <Shield className="w-6 h-6" />}
                                <span className="font-bold text-[10px] uppercase tracking-wider">{method}</span>
                            </button>
                        ))}
                    </div>

                    {paymentMethod === 'card' && (
                        <div className="space-y-4 mb-8">
                            <div>
                                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1 block">Card Number</label>
                                <input
                                    type="text"
                                    placeholder="0000 0000 0000 0000"
                                    value={cardNumber}
                                    onChange={e => setCardNumber(e.target.value)}
                                    className="w-full bg-secondary rounded-xl p-3 font-mono text-sm outline-none focus:ring-2 focus:ring-primary/50"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1 block">Expiry</label>
                                    <input
                                        type="text"
                                        placeholder="MM/YY"
                                        value={expiry}
                                        onChange={e => setExpiry(e.target.value)}
                                        className="w-full bg-secondary rounded-xl p-3 font-mono text-sm outline-none focus:ring-2 focus:ring-primary/50"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1 block">CVV</label>
                                    <input
                                        type="text"
                                        placeholder="123"
                                        value={cvv}
                                        onChange={e => setCvv(e.target.value)}
                                        className="w-full bg-secondary rounded-xl p-3 font-mono text-sm outline-none focus:ring-2 focus:ring-primary/50"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1 block">Cardholder Name</label>
                                <input
                                    type="text"
                                    placeholder="JANE DOE"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    className="w-full bg-secondary rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-primary/50"
                                />
                            </div>
                        </div>
                    )}

                    <button
                        onClick={handlePayment}
                        disabled={processing}
                        className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-all shadow-lg active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
                    >
                        {processing ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" /> Processing...
                            </>
                        ) : (
                            <>
                                Pay ${booking?.totalPrice}
                            </>
                        )}
                    </button>

                    <p className="text-center text-[10px] text-muted-foreground mt-4">
                        By confirming, you agree to our Terms & Conditions.
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
