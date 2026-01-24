"use client";

import { motion } from "framer-motion";
import {
    LayoutDashboard,
    Plus,
    Home,
    Settings,
    Bell,
    DollarSign,
    Users,
    Clock,
    ChevronRight,
    Search,
    Edit3,
    Trash2,
    MapPin
} from "lucide-react";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function OwnerDashboard() {
    const { user } = useAuth();
    const [myListings, setMyListings] = useState<any[]>([]);
    const [incomingBookings, setIncomingBookings] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [listingsRes, bookingsRes] = await Promise.all([
                    api.get('/workspaces/my'),
                    api.get('/bookings/owner')
                ]);
                setMyListings(listingsRes.data);
                setIncomingBookings(bookingsRes.data);
            } catch (err) {
                console.error("Failed to fetch dashboard data", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const totalRevenue = incomingBookings.reduce((acc, b) => acc + (b.totalPrice || 0), 0);

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
                            <div className="absolute bottom-1 right-1 w-5 h-5 bg-primary border-2 border-white rounded-full" />
                        </div>
                        <h2 className="font-bold text-lg">{user?.name}</h2>
                        <p className="text-[10px] text-primary font-black uppercase tracking-widest bg-primary/10 px-2 py-0.5 rounded-full inline-block">Verified Owner</p>
                    </div>

                    {[
                        { icon: LayoutDashboard, label: "Dashboard", active: true },
                        { icon: Home, label: "My Listings" },
                        { icon: DollarSign, label: "Earnings" },
                        { icon: Users, label: "Bookings" },
                        { icon: Bell, label: "Requests" },
                        { icon: Settings, label: "Settings" },
                    ].map((item, i) => (
                        <button key={i} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${item.active ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-muted-foreground hover:bg-card'}`}>
                            <item.icon className="h-4 w-4" /> {item.label}
                        </button>
                    ))}
                </div>

                {/* Main Content */}
                <div className="flex-1 space-y-8">
                    {/* Header */}
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-black text-foreground">Overview</h1>
                            <p className="text-muted-foreground text-sm">Welcome back, {user?.name ? user.name.split(' ')[0] : 'Partner'}. Here's what's happening.</p>
                        </div>
                        <Link href="/dashboard/owner/create" className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all">
                            <Plus className="h-5 w-5" /> List Workspace
                        </Link>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { label: "Total Revenue", value: `$${totalRevenue.toLocaleString()}`, icon: DollarSign, color: "text-green-500" },
                            { label: "Total Bookings", value: incomingBookings.length.toString(), icon: Users, color: "text-primary" },
                            { label: "Active Listings", value: myListings.length.toString(), icon: Home, color: "text-accent" },
                        ].map((stat, i) => (
                            <div key={i} className="bg-card border border-border p-6 rounded-3xl shadow-sm">
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`p-3 rounded-2xl bg-secondary ${stat.color}`}>
                                        <stat.icon className="h-6 w-6" />
                                    </div>
                                    <span className="text-xs font-bold text-green-500">+8%</span>
                                </div>
                                <div className="text-2xl font-black">{stat.value}</div>
                                <div className="text-xs text-muted-foreground font-bold uppercase tracking-widest mt-1">{stat.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* My Listings */}
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold">Your Listings</h2>
                            <button className="text-primary text-sm font-bold hover:underline">View All</button>
                        </div>

                        <div className="grid grid-cols-1 gap-4 text-foreground">
                            {myListings.length > 0 ? myListings.map((listing, i) => (
                                <motion.div key={i} className="bg-card border border-border p-4 rounded-3xl flex flex-col md:flex-row gap-6 items-center hover:shadow-lg transition-all">
                                    <div className="relative w-full md:w-32 h-24 rounded-2xl overflow-hidden shadow-inner">
                                        <Image src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=200" alt="Space" fill className="object-cover" />
                                    </div>
                                    <div className="flex-1 text-center md:text-left">
                                        <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                                            <h3 className="font-bold">{listing.name}</h3>
                                            <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">Active</span>
                                        </div>
                                        <div className="flex items-center justify-center md:justify-start gap-1 text-xs text-muted-foreground">
                                            <MapPin className="h-3 w-3" /> {listing.location}
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-center md:items-end px-6">
                                        <div className="text-lg font-black text-primary">${listing.pricePerHour}/hr</div>
                                        <div className="text-[10px] text-muted-foreground font-bold uppercase">Base Price</div>
                                    </div>
                                    <div className="flex gap-2 p-2">
                                        <button className="p-3 bg-secondary hover:bg-primary/10 hover:text-primary rounded-xl transition-all" title="Edit">
                                            <Edit3 className="h-4 w-4" />
                                        </button>
                                        <button className="p-3 bg-secondary hover:bg-red-500/10 hover:text-red-500 rounded-xl transition-all" title="Delete">
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </motion.div>
                            )) : (
                                <div className="text-center py-10 bg-card border border-dashed border-border rounded-3xl text-muted-foreground text-sm flex flex-col items-center gap-2">
                                    <Home className="h-8 w-8 opacity-20" />
                                    You haven't listed any workspaces yet.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Recent Bookings */}
                    <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
                        <div className="p-6 border-b border-border bg-secondary/20 flex justify-between items-center">
                            <h3 className="font-bold">Recent Inbound Bookings</h3>
                            <div className="flex bg-secondary p-1 rounded-lg border border-border">
                                <Search className="h-4 w-4 text-muted-foreground m-1" />
                            </div>
                        </div>
                        <div className="p-0 overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-secondary/10 border-b border-border text-left">
                                    <tr>
                                        <th className="px-6 py-4 font-bold">Customer</th>
                                        <th className="px-6 py-4 font-bold">Space</th>
                                        <th className="px-6 py-4 font-bold">Date</th>
                                        <th className="px-6 py-4 font-bold">Status</th>
                                        <th className="px-6 py-4 font-bold text-right">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {incomingBookings.length > 0 ? incomingBookings.map((booking, i) => (
                                        <tr key={i} className="hover:bg-secondary/5 transition-colors">
                                            <td className="px-6 py-4 flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                    {(booking.user?.name || "U")[0]}
                                                </div>
                                                <span className="font-semibold">{booking.user?.name || "Anonymous"}</span>
                                            </td>
                                            <td className="px-6 py-4 text-muted-foreground truncate max-w-[150px]">{booking.workspace?.name}</td>
                                            <td className="px-6 py-4">{new Date(booking.date).toLocaleDateString()}</td>
                                            <td className="px-6 py-4">
                                                <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-1 rounded-md capitalize">{booking.status}</span>
                                            </td>
                                            <td className="px-6 py-4 text-right font-bold">${booking.totalPrice}</td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-10 text-center text-muted-foreground italic">No bookings received yet.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
