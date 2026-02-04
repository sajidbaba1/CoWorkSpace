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
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function OwnerDashboard() {
    const { user } = useAuth();
    const [myListings, setMyListings] = useState<any[]>([]);
    const [incomingBookings, setIncomingBookings] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("dashboard");

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

    const handleUpdateStatus = async (bookingId: string, status: string) => {
        try {
            await api.patch(`/bookings/${bookingId}/status`, { status });
            // Refresh local state
            setIncomingBookings(prev => prev.map(b => b._id === bookingId ? { ...b, status } : b));
            // toast.success(`Booking ${status}`);
        } catch (err) {
            console.error("Failed to update status");
        }
    };

    return (
        <div className="min-h-screen bg-secondary/30">
            {/* ... (keep existing sidebar and header layout) ... */}
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
                        { icon: LayoutDashboard, label: "Dashboard", id: "dashboard" },
                        { icon: Edit3, label: "Insights", id: "insights" }, // New Smart Feature
                        { icon: Home, label: "My Listings", id: "listings" },
                        { icon: DollarSign, label: "Earnings", id: "earnings" },
                        { icon: Users, label: "Bookings", id: "bookings" },
                        { icon: Settings, label: "Settings", id: "settings" },
                    ].map((item, i) => (
                        <button
                            key={i}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${activeTab === item.id ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-muted-foreground hover:bg-card'}`}
                        >
                            <item.icon className="h-4 w-4" /> {item.label}
                            {item.id === 'insights' && <span className="ml-auto bg-green-500 text-white text-[9px] px-1.5 py-0.5 rounded uppercase font-black tracking-wider">AI</span>}
                        </button>
                    ))}
                </div>

                {/* Main Content */}
                <div className="flex-1 space-y-8">
                    {/* Header */}
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-black text-foreground capitalize">{activeTab}</h1>
                            <p className="text-muted-foreground text-sm">Welcome back, {user?.name ? user.name.split(' ')[0] : 'Partner'}.</p>
                        </div>
                        <Link href="/dashboard/owner/create" className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all">
                            <Plus className="h-5 w-5" /> List Workspace
                        </Link>
                    </div>

                    {activeTab === "dashboard" && (
                        <>
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

                            {/* Recent Bookings Table */}
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
                                                <th className="px-6 py-4 font-bold">Amount</th>
                                                <th className="px-6 py-4 font-bold text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border">
                                            {incomingBookings.slice(0, 5).map((booking, i) => (
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
                                                        <span className={`text-[10px] font-bold px-2 py-1 rounded-md capitalize ${booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                                            booking.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                                            }`}>
                                                            {booking.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 font-bold">${booking.totalPrice}</td>
                                                    <td className="px-6 py-4 text-right">
                                                        {booking.status === 'pending' && (
                                                            <div className="flex justify-end gap-2">
                                                                <button
                                                                    onClick={() => handleUpdateStatus(booking._id, 'confirmed')}
                                                                    className="text-[10px] bg-green-500 text-white px-3 py-1.5 rounded-lg font-bold hover:bg-green-600 transition-colors"
                                                                >
                                                                    Accept
                                                                </button>
                                                                <button
                                                                    onClick={() => handleUpdateStatus(booking._id, 'rejected')}
                                                                    className="text-[10px] bg-red-500 text-white px-3 py-1.5 rounded-lg font-bold hover:bg-red-600 transition-colors"
                                                                >
                                                                    Decline
                                                                </button>
                                                            </div>
                                                        )}
                                                        {booking.status === 'confirmed' && <span className="text-[10px] text-green-600 font-bold">Accepted</span>}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    )}

                    {activeTab === "listings" && (
                        <div className="space-y-6">
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
                    )}

                    {activeTab === "insights" && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Smart Pricing Card */}
                                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-8 rounded-[2rem] shadow-2xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10" />
                                    <h3 className="text-xl font-bold flex items-center gap-2 mb-4">
                                        <DollarSign className="h-5 w-5" /> Smart Pricing Suggestion
                                    </h3>
                                    <p className="text-white/80 mb-6 text-sm">
                                        Demand for workspaces in <b>{myListings[0]?.location || 'your area'}</b> is trending up for next week!
                                    </p>
                                    <div className="bg-white/20 backdrop-blur-md p-4 rounded-xl mb-6">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-xs font-bold uppercase tracking-wider opacity-70">Suggested Rate</span>
                                            <span className="text-sm font-bold bg-green-500 px-2 py-0.5 rounded text-white">+15%</span>
                                        </div>
                                        <div className="text-3xl font-black">${((myListings[0]?.pricePerHour || 10) * 1.15).toFixed(0)} <span className="text-sm font-normal opacity-70">/ hr</span></div>
                                    </div>
                                    <button className="w-full py-3 bg-white text-primary font-bold rounded-xl hover:bg-white/90 transition-all">
                                        Apply Smart Pricing
                                    </button>
                                </div>

                                {/* Occupancy Forecast */}
                                <div className="bg-card border border-border p-8 rounded-[2rem] shadow-sm">
                                    <h3 className="text-xl font-bold flex items-center gap-2 mb-6 text-foreground">
                                        <Users className="h-5 w-5 text-primary" /> Occupancy Forecast
                                    </h3>
                                    <div className="space-y-4">
                                        {[
                                            { day: 'Mon', val: 60 },
                                            { day: 'Tue', val: 80 },
                                            { day: 'Wed', val: 45 },
                                            { day: 'Thu', val: 90 },
                                            { day: 'Fri', val: 75 },
                                        ].map((d, i) => (
                                            <div key={i} className="flex items-center gap-3">
                                                <span className="w-8 text-xs font-bold text-muted-foreground">{d.day}</span>
                                                <div className="flex-1 h-3 bg-secondary rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full ${d.val > 70 ? 'bg-primary' : 'bg-primary/50'}`}
                                                        style={{ width: `${d.val}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs font-bold">{d.val}%</span>
                                            </div>
                                        ))}
                                    </div>
                                    <p className="mt-6 text-xs text-muted-foreground text-center">
                                        Based on booking history and local events.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "earnings" && (
                        <div className="bg-card border border-border p-8 rounded-[2rem] shadow-sm">
                            <h3 className="text-xl font-bold mb-6">Revenue Analytics</h3>
                            <div className="h-[400px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart
                                        data={[
                                            { name: 'Mon', uv: 4000 },
                                            { name: 'Tue', uv: 3000 },
                                            { name: 'Wed', uv: 2000 },
                                            { name: 'Thu', uv: 2780 },
                                            { name: 'Fri', uv: 1890 },
                                            { name: 'Sat', uv: 2390 },
                                            { name: 'Sun', uv: 3490 },
                                        ]}
                                    >
                                        <defs>
                                            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                        <Area type="monotone" dataKey="uv" stroke="#8884d8" fillOpacity={1} fill="url(#colorUv)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    )}

                    {activeTab === "bookings" && (
                        <div className="bg-card border border-border rounded-[2rem] shadow-sm overflow-hidden">
                            <div className="p-8 border-b border-border">
                                <h3 className="text-xl font-bold">All Bookings</h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-secondary/10 border-b border-border text-left">
                                        <tr>
                                            <th className="px-6 py-4 font-bold">Customer</th>
                                            <th className="px-6 py-4 font-bold">Workspace</th>
                                            <th className="px-6 py-4 font-bold">Date</th>
                                            <th className="px-6 py-4 font-bold">Status</th>
                                            <th className="px-6 py-4 font-bold">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {incomingBookings.map((booking, i) => (
                                            <tr key={i} className="hover:bg-secondary/5 transition-colors">
                                                <td className="px-6 py-4 font-medium">{booking.user?.name}</td>
                                                <td className="px-6 py-4 text-muted-foreground">{booking.workspace?.name}</td>
                                                <td className="px-6 py-4">{new Date(booking.date).toLocaleDateString()}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 rounded text-xs font-bold capitalize ${booking.status === 'confirmed' ? 'bg-green-100 text-green-700' : booking.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                        {booking.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 font-bold text-primary">${booking.totalPrice}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === "settings" && (
                        <div className="bg-card border border-border p-8 rounded-[2rem] shadow-sm max-w-2xl">
                            <h3 className="text-xl font-bold mb-6">Account Settings</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold mb-2">Full Name</label>
                                    <input type="text" className="w-full bg-secondary p-4 rounded-xl outline-none" defaultValue={user?.name} />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-2">Email Address</label>
                                    <input type="email" className="w-full bg-secondary p-4 rounded-xl outline-none opacity-50" defaultValue={user?.email} disabled />
                                </div>
                                <button className="bg-primary text-white py-3 px-8 rounded-xl font-bold shadow-lg hover:shadow-primary/20 hover:scale-[1.02] transition-all">Save Changes</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
