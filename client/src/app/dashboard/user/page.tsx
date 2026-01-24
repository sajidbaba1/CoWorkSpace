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
    LifeBuoy
} from "lucide-react";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

import Image from "next/image";

export default function UserDashboard() {
    const { user } = useAuth();
    const [bookings, setBookings] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("overview");
    const router = useRouter();

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const res = await api.get('/bookings/my');
                setBookings(res.data);
            } catch (err) {
                console.error("Failed to fetch bookings", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchBookings();
    }, []);

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
                            <Image src={`https://i.pravatar.cc/150?u=${user?.email}`} alt="avatar" fill className="rounded-full object-cover border-4 border-primary/10" />
                            <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full" />
                        </div>
                        <h2 className="font-bold text-lg">{user?.name}</h2>
                        <p className="text-xs text-muted-foreground uppercase tracking-widest">{user?.role} Account</p>
                    </div>

                    {[
                        { icon: LayoutDashboard, label: "Overview", active: activeTab === "overview" },
                        { icon: Calendar, label: "My Bookings" },
                        { icon: History, label: "History" },
                        { icon: CreditCard, label: "Payments" },
                        { icon: Bell, label: "Notifications" },
                        { icon: Settings, label: "Settings" },
                        { icon: LifeBuoy, label: "Help & Support", path: "/support" },
                    ].map((item: any, i) => (
                        <button
                            key={i}
                            onClick={() => item.path ? router.push(item.path) : setActiveTab(item.label.toLowerCase())}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${item.active ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-muted-foreground hover:bg-secondary'}`}
                        >
                            <item.icon className="h-4 w-4" /> {item.label}
                        </button>
                    ))}
                </div>

                {/* Main Content */}
                <div className="flex-1 space-y-8 text-foreground">
                    {/* Welcome Card */}
                    <div className="bg-primary rounded-[2rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20" />
                        <div className="relative z-10">
                            <h1 className="text-3xl font-bold mb-2">Welcome Back, {user?.name ? user.name.split(' ')[0] : 'User'}!</h1>
                            <p className="text-white/80 mb-6 font-light">You have {bookings.length} active reservations on the platform.</p>
                            <div className="flex gap-4">
                                <button className="bg-white text-primary px-6 py-2.5 rounded-full text-sm font-bold shadow-lg hover:bg-secondary transition-all">View All Bookings</button>
                                <button className="bg-white/20 hover:bg-white/30 text-white px-6 py-2.5 rounded-full text-sm font-bold backdrop-blur-md transition-all">Download Invoices</button>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Bookings List */}
                        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm overflow-hidden">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold">Recent Bookings</h3>
                                <span className="text-xs font-bold text-primary cursor-pointer">See all</span>
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
                                                <span className="text-xs font-black text-foreground">${booking.totalPrice}</span>
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

                        {/* Recent Activity */}
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
                                    <div className="text-2xl font-black text-green-600">${totalSpent}</div>
                                    <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">Total Spent</div>
                                </div>
                                <div className="bg-secondary/50 p-4 rounded-xl text-center">
                                    <div className="text-2xl font-black text-yellow-500">4.9</div>
                                    <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">Avg Rating</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Recommendations */}
                    <div>
                        <h3 className="font-bold mb-6 flex items-center gap-2">
                            <Star className="h-4 w-4 text-yellow-500" /> Recommended For You
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="bg-card border border-border rounded-2xl overflow-hidden group hover:shadow-lg transition-all">
                                    <div className="relative h-32">
                                        <Image src={`https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=400`} alt="Space" fill className="object-cover" />
                                    </div>
                                    <div className="p-4">
                                        <h4 className="font-bold text-sm truncate">Creative Loft {i}</h4>
                                        <p className="text-[10px] text-muted-foreground uppercase mt-1">from $15/hr</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
