"use client";

import { motion } from "framer-motion";
import {
    Calendar,
    Clock,
    MapPin,
    User,
    Settings,
    History,
    CreditCard,
    LayoutDashboard,
    Bell,
    Search,
    ChevronRight,
    Star,
    LifeBuoy,
    Heart,
    Trash2,
    ShieldCheck,
    Upload,
    Save
} from "lucide-react";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

import Image from "next/image";
import { toast } from "react-hot-toast";

export default function UserDashboard() {
    const { user, refreshUser } = useAuth();
    const [bookings, setBookings] = useState<any[]>([]);
    const [wishlist, setWishlist] = useState<any[]>([]);
    const [payments, setPayments] = useState<any[]>([]);
    const [selectedBooking, setSelectedBooking] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("overview");
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [bookingsRes, wishlistRes, paymentsRes] = await Promise.all([
                    api.get('/bookings/my'),
                    api.get('/users/wishlist'),
                    api.get('/payments')
                ]);
                setBookings(bookingsRes.data);
                setWishlist(wishlistRes.data || []);
                setPayments(paymentsRes.data || []);
            } catch (err) {
                console.error("Failed to fetch data", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleCancel = async (bookingId: string) => {
        if (!confirm("Are you sure you want to cancel this booking?")) return;
        try {
            await api.patch(`/bookings/${bookingId}/status`, { status: "cancelled" });
            setBookings(prev => prev.map(b => b._id === bookingId ? { ...b, status: "cancelled" } : b));
            toast.success("Booking cancelled successfully");
        } catch (err) {
            toast.error("Failed to cancel booking");
        }
    };

    const removeFromWishlist = async (id: string, e: any) => {
        e.stopPropagation();
        try {
            await api.delete(`/users/wishlist/${id}`);
            setWishlist(prev => prev.filter(w => w._id !== id));
            toast.success("Removed from wishlist");
        } catch (err) {
            toast.error("Failed to remove");
        }
    };



    const totalSpent = bookings.reduce((acc, b) => acc + (b.totalPrice || 0), 0);

    if (isLoading) return (
        <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
    );

    return (
        <div className="min-h-screen bg-secondary/30">
            <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row gap-8">
                {/* Sidebar */}
                <div className="w-full md:w-64 space-y-2">
                    <div className="bg-card border border-border rounded-2xl p-6 mb-6 text-center">
                        <div className="relative w-24 h-24 mx-auto mb-4">
                            <Image src={user?.profileImage || `https://i.pravatar.cc/150?u=${user?.email}`} alt="avatar" fill className="rounded-full object-cover border-4 border-primary/10" />
                            <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full" />
                        </div>
                        <h2 className="font-bold text-lg">{user?.name}</h2>
                        <p className="text-xs text-muted-foreground uppercase tracking-widest">{user?.role} Account</p>
                    </div>

                    {[
                        { icon: LayoutDashboard, label: "Overview", id: "overview" },
                        { icon: Calendar, label: "My Bookings", id: "my bookings" },
                        { icon: Heart, label: "Favorites", id: "favorites" },
                        { icon: History, label: "History", id: "history" },
                        { icon: CreditCard, label: "Payments", id: "payments" },
                        { icon: Bell, label: "Notifications", id: "notifications" },
                        { icon: Settings, label: "Settings", id: "settings" },
                        { icon: LifeBuoy, label: "Help & Support", path: "/support" },
                    ].map((item: any, i) => (
                        <button
                            key={i}
                            onClick={() => item.path ? router.push(item.path) : setActiveTab(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${activeTab === item.id ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-muted-foreground hover:bg-secondary'}`}
                        >
                            <item.icon className="h-4 w-4" /> {item.label}
                        </button>
                    ))}
                </div>

                {/* Main Content */}
                <div className="flex-1 space-y-8 text-foreground">
                    {activeTab === 'overview' && (
                        <>
                            {/* Welcome Card */}
                            <div className="bg-primary rounded-[2rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20" />
                                <div className="relative z-10">
                                    <h1 className="text-3xl font-bold mb-2">Welcome Back, {user?.name ? user.name.split(' ')[0] : 'User'}!</h1>
                                    <p className="text-white/80 mb-6 font-light">You have {bookings.length} active reservations on the platform.</p>
                                    <div className="flex gap-4">
                                        <button onClick={() => setActiveTab('my bookings')} className="bg-white text-primary px-6 py-2.5 rounded-full text-sm font-bold shadow-lg hover:bg-secondary transition-all">View All Bookings</button>
                                        <button className="bg-white/20 hover:bg-white/30 text-white px-6 py-2.5 rounded-full text-sm font-bold backdrop-blur-md transition-all">Download Invoices</button>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Bookings List (Short) */}
                                <div className="bg-card border border-border rounded-2xl p-6 shadow-sm overflow-hidden">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="font-bold">Recent Bookings</h3>
                                        <span onClick={() => setActiveTab('my bookings')} className="text-xs font-bold text-primary cursor-pointer hover:underline">See all</span>
                                    </div>
                                    <div className="space-y-6">
                                        {bookings.length > 0 ? bookings.slice(0, 3).map((booking, i) => (
                                            <div key={i} className="flex gap-4 relative">
                                                <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                                                    <Image src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=200" alt="Space" fill className="object-cover" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-bold truncate">{booking.workspace?.name}</h4>
                                                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground mt-1 uppercase font-bold tracking-tight">
                                                        <MapPin className="h-3 w-3" /> {booking.workspace?.location}
                                                    </div>
                                                    <div className="mt-2 flex items-center justify-between">
                                                        <div className="flex items-center gap-1 text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                                                            <Clock className="h-3 w-3" /> {new Date(booking.date).toLocaleDateString()} • {booking.duration}h
                                                        </div>
                                                        <span className="text-xs font-black text-foreground">₹{booking.totalPrice}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )) : (
                                            <div className="py-10 text-center text-muted-foreground text-sm italic">
                                                No bookings yet. Start exploring!
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Stats Overview */}
                                <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                                    <h3 className="font-bold mb-6">Stats Overview</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-secondary/50 p-4 rounded-xl text-center">
                                            <div className="text-2xl font-black text-primary">{bookings.reduce((a, b) => a + b.duration, 0)}</div>
                                            <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">Total Hours</div>
                                        </div>
                                        <div className="bg-secondary/50 p-4 rounded-xl text-center">
                                            <div className="text-2xl font-black text-accent">{bookings.length}</div>
                                            <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">Bookings</div>
                                        </div>
                                        <div className="bg-secondary/50 p-4 rounded-xl text-center">
                                            <div className="text-2xl font-black text-green-600">₹{totalSpent}</div>
                                            <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">Total Spent</div>
                                        </div>
                                        <div className="bg-secondary/50 p-4 rounded-xl text-center">
                                            <div className="text-2xl font-black text-yellow-500">4.9</div>
                                            <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">Avg Rating</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {activeTab === 'my bookings' && (
                        <div>
                            <h2 className="text-2xl font-bold mb-6">All Bookings</h2>
                            <div className="grid grid-cols-1 gap-6">
                                {bookings.length > 0 ? bookings.map((booking, i) => (
                                    <div key={i} className="bg-card border border-border p-6 rounded-3xl flex flex-col md:flex-row gap-6 hover:shadow-lg transition-all">
                                        <div className="relative w-full md:w-48 h-32 rounded-2xl overflow-hidden shadow-inner flex-shrink-0">
                                            <Image src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=400" alt="Space" fill className="object-cover" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="text-xl font-bold">{booking.workspace?.name}</h3>
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                                        <MapPin className="h-4 w-4" /> {booking.workspace?.location}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-2xl font-black text-primary">₹{booking.totalPrice}</div>
                                                    <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                                        booking.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                                        }`}>
                                                        {booking.status || 'Pending'}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-6 mt-6">
                                                <div className="flex items-center gap-2 text-sm font-medium">
                                                    <Calendar className="h-4 w-4 text-primary" /> {new Date(booking.date).toLocaleDateString()}
                                                </div>
                                                <div className="flex items-center gap-2 text-sm font-medium">
                                                    <Clock className="h-4 w-4 text-primary" /> {booking.startTime} ({booking.duration} hrs)
                                                </div>
                                            </div>

                                            <div className="flex gap-3 mt-6">
                                                <button
                                                    onClick={() => setSelectedBooking(booking)}
                                                    className="flex-1 bg-primary text-white py-2 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors"
                                                >
                                                    View Details
                                                </button>
                                                {booking.status === 'approved_for_payment' && (
                                                    <button
                                                        onClick={() => router.push(`/payment/${booking._id}`)}
                                                        className="px-6 py-2 bg-green-600 text-white rounded-xl text-sm font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-500/20"
                                                    >
                                                        Pay Now
                                                    </button>
                                                )}
                                                {booking.status !== 'cancelled' && booking.status !== 'confirmed' && (
                                                    <button
                                                        onClick={() => handleCancel(booking._id)}
                                                        className="px-6 py-2 border border-border rounded-xl text-sm font-bold hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-colors"
                                                    >
                                                        Cancel
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="text-center py-20 bg-card border border-dashed border-border rounded-3xl">
                                        <p className="text-muted-foreground">You haven't made any bookings yet.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    {activeTab === 'favorites' && (
                        <div>
                            <h2 className="text-2xl font-bold mb-6">My Wishlist</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {wishlist.length > 0 ? wishlist.map((item, i) => (
                                    <div key={i} className="bg-card border border-border rounded-3xl overflow-hidden hover:shadow-lg transition-all group relative cursor-pointer" onClick={() => router.push(`/workspace/${item._id}`)}>
                                        <div className="relative h-48">
                                            <Image src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600" alt="Space" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                                            <button
                                                onClick={(e) => removeFromWishlist(item._id, e)}
                                                className="absolute top-4 right-4 p-2 bg-white/90 rounded-full text-red-500 hover:bg-red-500 hover:text-white transition-colors z-10"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                        <div className="p-6">
                                            <h3 className="font-bold text-lg mb-2">{item.name}</h3>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                                                <MapPin className="h-4 w-4" /> {item.location}
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="font-black text-xl text-primary">₹{item.pricePerHour}<span className="text-xs text-muted-foreground font-medium">/hr</span></span>
                                                <div className="flex items-center gap-1 text-xs font-bold bg-secondary px-2 py-1 rounded-lg">
                                                    <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" /> 4.9
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="md:col-span-2 text-center py-20 bg-card border border-dashed border-border rounded-3xl">
                                        <p className="text-muted-foreground">Your wishlist is empty.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'history' && (
                        <div>
                            <h2 className="text-2xl font-bold mb-6">Booking History</h2>
                            <div className="space-y-4">
                                {bookings.filter(b => ['completed', 'cancelled', 'confirmed', 'rejected'].includes(b.status || '')).length > 0 ? (
                                    bookings.filter(b => ['completed', 'cancelled', 'confirmed', 'rejected'].includes(b.status || '')).map((booking, i) => (
                                        <div key={i} className="bg-card border border-border p-6 rounded-3xl flex justify-between items-center hover:shadow-md transition-all opacity-80 hover:opacity-100">
                                            <div>
                                                <h3 className="font-bold text-lg">{booking.workspace?.name || 'Deleted Workspace'}</h3>
                                                <p className="text-sm text-muted-foreground">{new Date(booking.date).toLocaleDateString()} • {booking.duration} Hours</p>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-bold text-lg">₹{booking.totalPrice}</div>
                                                <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${booking.status === 'confirmed' || booking.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                    booking.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                                                    }`}>
                                                    {booking.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-20 bg-card border border-dashed border-border rounded-3xl">
                                        <p className="text-muted-foreground">No history available.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'payments' && (
                        <div>
                            <h2 className="text-2xl font-bold mb-6">Payment History</h2>
                            <div className="space-y-4">
                                {payments.length > 0 ? (
                                    payments.map((payment, i) => (
                                        <div key={i} className="bg-card border border-border p-6 rounded-3xl flex justify-between items-center hover:shadow-md transition-all">
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 bg-green-500/10 text-green-500 rounded-full">
                                                    <CreditCard className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-sm">Payment for {payment.booking?.workspace?.name || "Booking"}</h3>
                                                    <p className="text-xs text-muted-foreground font-mono mt-1">{payment.transactionId}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-black text-xl text-green-600">₹{payment.amount}</div>
                                                <div className="text-xs text-muted-foreground uppercase">{new Date(payment.createdAt).toLocaleDateString()}</div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-20 bg-card border border-dashed border-border rounded-3xl">
                                        <p className="text-muted-foreground">No payment records found.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <div className="max-w-2xl">
                            <h2 className="text-2xl font-bold mb-6">Account Settings</h2>

                            {/* Profile Picture */}
                            <div className="bg-card border border-border p-6 rounded-3xl mb-6">
                                <h3 className="font-bold mb-4">Profile Image</h3>
                                <div className="flex items-center gap-6">
                                    <div className="relative w-20 h-20">
                                        <Image src={user?.profileImage || `https://i.pravatar.cc/150?u=${user?.email}`} alt="Profile" fill className="rounded-full object-cover" />
                                    </div>
                                    <div className="flex-1">
                                        <label className="block mb-2 text-sm text-muted-foreground">Upload new picture</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={async (e) => {
                                                const file = e.target.files?.[0];
                                                if (!file) return;
                                                const formData = new FormData();
                                                formData.append('profileImage', file);
                                                try {
                                                    const res = await api.post('/users/upload-profile', formData);
                                                    if (res.data.success) {
                                                        toast.success('Profile image updated');
                                                        await refreshUser();
                                                    }
                                                } catch (err) {
                                                    toast.error('Failed to upload image');
                                                }
                                            }}
                                            className="w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Change Password */}
                            <div className="bg-card border border-border p-6 rounded-3xl mb-6">
                                <h3 className="font-bold mb-4">Change Password</h3>
                                <form onSubmit={async (e: any) => {
                                    e.preventDefault();
                                    const currentPassword = e.target.currentPassword.value;
                                    const newPassword = e.target.newPassword.value;
                                    const confirmPassword = e.target.confirmPassword.value;

                                    if (newPassword !== confirmPassword) {
                                        return toast.error("New passwords do not match");
                                    }

                                    try {
                                        const res = await api.put('/users/change-password', { currentPassword, newPassword });
                                        if (res.data.success) {
                                            toast.success("Password changed successfully");
                                            e.target.reset();
                                        }
                                    } catch (err: any) {
                                        toast.error(err.response?.data?.message || "Failed to change password");
                                    }
                                }} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold mb-1">Current Password</label>
                                        <input name="currentPassword" type="password" required className="w-full bg-secondary border border-border rounded-xl px-4 py-2" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold mb-1">New Password</label>
                                        <input name="newPassword" type="password" required className="w-full bg-secondary border border-border rounded-xl px-4 py-2" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold mb-1">Confirm New Password</label>
                                        <input name="confirmPassword" type="password" required className="w-full bg-secondary border border-border rounded-xl px-4 py-2" />
                                    </div>
                                    <button type="submit" className="bg-primary text-primary-foreground px-6 py-2 rounded-xl font-bold text-sm">Update Password</button>
                                </form>
                            </div>

                            {/* KYC / Identity */}
                            <div className="bg-card border border-border p-6 rounded-3xl">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-bold">Identity Verification (KYC)</h3>
                                        <p className="text-sm text-muted-foreground">Required for booking workspaces</p>
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${user?.kycStatus === 'verified' ? 'bg-green-100 text-green-700' : user?.kycStatus === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                                        {user?.kycStatus || 'Not Submitted'}
                                    </div>
                                </div>

                                {user?.kycStatus !== 'verified' && (
                                    <div className="space-y-4">
                                        <div className="p-4 bg-secondary/50 rounded-xl">
                                            <p className="text-sm font-medium mb-2">Upload Aadhar Card (PDF or Image)</p>
                                            <input
                                                type="file"
                                                accept="application/pdf,image/*"
                                                onChange={async (e) => {
                                                    const file = e.target.files?.[0];
                                                    if (!file) return;
                                                    const formData = new FormData();
                                                    formData.append('aadharCard', file);

                                                    try {
                                                        const res = await api.post('/users/upload-kyc', formData);
                                                        if (res.data.success) {
                                                            toast.success('KYC document uploaded. Pending approval.');
                                                            await refreshUser();
                                                        }
                                                    } catch (err: any) {
                                                        toast.error(err.response?.data?.message || 'Upload failed');
                                                    }
                                                }}
                                                className="w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                                            />
                                        </div>
                                    </div>
                                )}
                                {user?.kycStatus === 'verified' && (
                                    <div className="flex items-center gap-2 text-green-600 font-bold text-sm">
                                        <ShieldCheck className="w-5 h-5" /> Your identity is verified.
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Booking Details Modal */}
            {selectedBooking && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-card w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-border"
                    >
                        <div className="bg-primary p-6 text-white text-center relative overflow-hidden">
                            <div className="relative z-10">
                                <h3 className="text-lg font-bold opacity-80 mb-1">Entry Ticket</h3>
                                <h2 className="text-3xl font-black">{selectedBooking.workspace?.name}</h2>
                            </div>
                            <button onClick={() => setSelectedBooking(null)} className="absolute top-4 right-4 p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors z-20">
                                <Trash2 className="h-4 w-4 rotate-45 transform" />
                            </button>
                        </div>
                        <div className="p-8 flex flex-col items-center">
                            <div className="w-48 h-48 bg-white p-4 rounded-xl shadow-lg mb-6">
                                <Image
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${selectedBooking._id}`}
                                    alt="QR Code"
                                    width={200}
                                    height={200}
                                    className="w-full h-full"
                                />
                            </div>
                            <div className="text-center space-y-2 mb-6">
                                <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Scan at Entrance</div>
                                <div className="font-mono text-sm bg-secondary px-3 py-1 rounded border border-border">{selectedBooking._id}</div>
                            </div>
                            <div className="w-full grid grid-cols-2 gap-4 text-sm">
                                <div className="bg-secondary/50 p-3 rounded-xl">
                                    <div className="text-xs font-bold text-muted-foreground uppercase">Date</div>
                                    <div className="font-bold">{new Date(selectedBooking.date).toLocaleDateString()}</div>
                                </div>
                                <div className="bg-secondary/50 p-3 rounded-xl">
                                    <div className="text-xs font-bold text-muted-foreground uppercase">Time</div>
                                    <div className="font-bold">{selectedBooking.startTime}</div>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 border-t border-border bg-secondary/20 text-center">
                            <p className="text-xs text-muted-foreground">Show this ticket to the workspace manager.</p>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
