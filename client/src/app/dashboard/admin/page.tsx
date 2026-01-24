"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Shield,
    Users,
    Home,
    AlertTriangle,
    CheckCircle,
    XCircle,
    TrendingUp,
    MessageSquare,
    Calendar,
    DollarSign,
    Trash2,
    Briefcase,
    PieChart,
    BarChart as BarIcon,
    Wallet
} from "lucide-react";
import Image from "next/image";
import api from "@/lib/api";
import { toast } from "react-hot-toast";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Legend
} from "recharts";

export default function AdminDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [pendingWorkspaces, setPendingWorkspaces] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [bookings, setBookings] = useState<any[]>([]);
    const [complaints, setComplaints] = useState<any[]>([]);
    const [payouts, setPayouts] = useState<any[]>([]);
    const [analyticsData, setAnalyticsData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("overview");

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            setLoading(true);
            const [statsRes, pendingRes, analyticsRes] = await Promise.all([
                api.get("/admin/stats"),
                api.get("/admin/workspaces/pending"),
                api.get("/admin/analytics")
            ]);

            setStats(statsRes.data.stats || {});
            setPendingWorkspaces(Array.isArray(pendingRes.data) ? pendingRes.data : []);
            setAnalyticsData(Array.isArray(analyticsRes.data) ? analyticsRes.data : []);
        } catch (err) {
            console.error(err);
            toast.error("Failed to fetch dashboard data");
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            const res = await api.get("/admin/users");
            setUsers(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            toast.error("Failed to fetch users");
            setUsers([]);
        }
    };

    const fetchBookings = async () => {
        try {
            const res = await api.get("/admin/bookings");
            setBookings(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            toast.error("Failed to fetch bookings");
            setBookings([]);
        }
    };

    const fetchComplaints = async () => {
        try {
            const res = await api.get("/admin/complaints");
            setComplaints(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            toast.error("Failed to fetch complaints");
            setComplaints([]);
        }
    };

    const fetchPayouts = async () => {
        try {
            const res = await api.get("/admin/payouts");
            setPayouts(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            toast.error("Failed to fetch payouts");
            setPayouts([]);
        }
    };

    useEffect(() => {
        if (activeTab === "users") fetchUsers();
        if (activeTab === "bookings") fetchBookings();
        if (activeTab === "complaints") fetchComplaints();
        if (activeTab === "payouts") fetchPayouts();
    }, [activeTab]);

    const handleVerifyWorkspace = async (id: string, isVerified: boolean) => {
        try {
            await api.patch(`/admin/workspaces/${id}/verify`, { isVerified });
            setPendingWorkspaces(prev => prev.filter(w => w._id !== id));
            toast.success(isVerified ? "Workspace approved!" : "Workspace rejected!");
        } catch (err) {
            toast.error("Process failed");
        }
    };

    const handleDeleteUser = async (id: string) => {
        if (!confirm("Are you sure you want to delete this user?")) return;
        try {
            await api.delete(`/admin/users/${id}`);
            setUsers(prev => prev.filter(u => u._id !== id));
            toast.success("User deleted");
        } catch (err) {
            toast.error("Delete failed");
        }
    };

    const handleCancelBooking = async (id: string) => {
        if (!confirm("Are you sure you want to cancel this booking? This action cannot be undone.")) return;
        try {
            await api.delete(`/admin/bookings/${id}`);
            setBookings(prev => prev.filter(b => b._id !== id));
            toast.success("Booking cancelled");
        } catch (err) {
            toast.error("Cancel failed");
        }
    };

    const handleProcessPayout = async (bookingIds: string[], ownerId: string) => {
        try {
            await api.post('/admin/payouts/process', { bookingIds });
            setPayouts(prev => prev.filter(p => p._id !== ownerId));
            toast.success("Payout marked as processed");
        } catch (err) {
            toast.error("Payout failed");
        }
    };

    const handleResolveComplaint = async (id: string) => {
        try {
            await api.patch(`/admin/complaints/${id}`, { status: "resolved" });
            setComplaints(prev => prev.map(c => c._id === id ? { ...c, status: "resolved" } : c));
            toast.success("Complaint resolved");
        } catch (err) {
            toast.error("Update failed");
        }
    };

    const handleDownloadReport = () => {
        if (!bookings.length) return toast.error("No data to export");

        const headers = ["Booking ID", "Transaction ID", "Workspace", "User", "Date", "Total", "Commission", "Status"];
        const csvContent = [
            headers.join(","),
            ...bookings.map(b => [
                b._id,
                b.transactionId || "N/A",
                b.workspace?.name || "Deleted",
                b.user?.name || "Unknown",
                new Date(b.date).toLocaleDateString(),
                b.totalPrice,
                b.platformFee,
                b.status
            ].join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `bookings_report_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    if (loading && !stats) return <div className="min-h-screen flex items-center justify-center font-black">L-O-A-D-I-N-G...</div>;

    return (
        <div className="min-h-screen bg-secondary/30">
            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Shield className="h-5 w-5 text-primary" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-primary">Admin Control Center</span>
                        </div>
                        <h1 className="text-4xl font-black text-foreground">Platform Overview</h1>
                    </div>

                    <div className="flex bg-card border border-border p-1 rounded-2xl overflow-x-auto max-w-full">
                        {["overview", "users", "bookings", "payouts", "complaints"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-tight transition-all whitespace-nowrap ${activeTab === tab
                                    ? "bg-primary text-primary-foreground shadow-lg"
                                    : "hover:bg-secondary text-muted-foreground"
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {activeTab === "overview" && (
                    <div className="space-y-8">
                        {/* Financial Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {[
                                { label: "Gross Volume", value: `$${(stats?.grossRevenue || 0).toLocaleString()}`, icon: DollarSign, color: "text-blue-500", bg: "bg-blue-500/10" },
                                { label: "Net Revenue", value: `$${(stats?.netRevenue || 0).toLocaleString()}`, icon: Wallet, color: "text-green-500", bg: "bg-green-500/10" },
                                { label: "Pending Payouts", value: `$${(stats?.payoutPending || 0).toLocaleString()}`, icon: Briefcase, color: "text-orange-500", bg: "bg-orange-500/10" },
                                { label: "Total Bookings", value: stats?.totalBookings || 0, icon: TrendingUp, color: "text-purple-500", bg: "bg-purple-500/10" },
                            ].map((stat, i) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    key={i}
                                    className="bg-card border border-border p-6 rounded-3xl shadow-sm hover:shadow-md transition-all group"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                                            <stat.icon className="h-6 w-6" />
                                        </div>
                                    </div>
                                    <div className="text-2xl font-black">{stat.value}</div>
                                    <div className="text-xs text-muted-foreground font-bold uppercase tracking-widest mt-1">{stat.label}</div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Charts Area */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 bg-card border border-border p-6 rounded-3xl shadow-sm">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-lg font-bold flex items-center gap-2">
                                        <BarIcon className="h-5 w-5 text-primary" />
                                        Revenue Overview (6 Months)
                                    </h2>
                                </div>
                                <div className="h-[300px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={analyticsData}>
                                            <defs>
                                                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                                </linearGradient>
                                                <linearGradient id="colorCom" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                            <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                                            <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                                itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                                            />
                                            <Legend iconType="circle" />
                                            <Area type="monotone" dataKey="revenue" name="Total Revenue" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                                            <Area type="monotone" dataKey="commission" name="Net Commission" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorCom)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {/* Smart Insights (Mock AI) */}
                                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-6 rounded-3xl h-full flex flex-col shadow-lg shadow-indigo-500/20">
                                    <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
                                        <TrendingUp className="h-5 w-5 text-white" />
                                        Smart Insights
                                    </h2>
                                    <div className="space-y-6">
                                        <div>
                                            <p className="text-white/60 text-xs font-bold uppercase tracking-wider mb-1">Top Performing Day</p>
                                            <p className="text-2xl font-black">Wednesday</p>
                                            <p className="text-xs text-white/80 mt-1">Accts for 28% of bookings</p>
                                        </div>
                                        <div>
                                            <p className="text-white/60 text-xs font-bold uppercase tracking-wider mb-1">Occupancy Forecast</p>
                                            <p className="text-2xl font-black">High (85%)</p>
                                            <p className="text-xs text-white/80 mt-1">Expected next week</p>
                                        </div>
                                        <div className="bg-white/10 p-3 rounded-xl mt-auto">
                                            <p className="text-xs font-medium">💡 Tip: Increase prices by 5% on weekends to maximize yield.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "users" && (
                    <div className="bg-card border border-border rounded-3xl overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-secondary/50 border-b border-border">
                                <tr>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">User</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">Email</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">Role</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">Joined</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {Array.isArray(users) && users.filter(u => !!u).map((user, i) => (
                                    <tr key={user?._id || `user-${i}`} className="hover:bg-secondary/20 transition-all">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-xs">
                                                    {(() => {
                                                        const name = user?.name;
                                                        const email = user?.email;
                                                        if (typeof name === 'string' && name.length > 0) return name[0].toUpperCase();
                                                        if (typeof email === 'string' && email.length > 0) return email[0].toUpperCase();
                                                        return 'U';
                                                    })()}
                                                </div>
                                                <span className="font-bold text-sm">{user?.name || 'Anonymous'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-muted-foreground">{user.email || 'No email'}</td>
                                        <td className="px-6 py-4">
                                            <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-md ${user.role === 'admin' ? 'bg-red-500/10 text-red-500' :
                                                user.role === 'owner' ? 'bg-purple-500/10 text-purple-500' :
                                                    'bg-blue-500/10 text-blue-500'
                                                }`}>
                                                {user.role || 'customer'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-muted-foreground">
                                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => handleDeleteUser(user._id)}
                                                className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-all"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === "bookings" && (
                    <div className="space-y-4">
                        <div className="flex justify-end">
                            <button
                                onClick={handleDownloadReport}
                                className="flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-foreground px-4 py-2 rounded-xl text-xs font-bold transition-all border border-border"
                            >
                                <Briefcase className="h-4 w-4" /> Export Report (CSV)
                            </button>
                        </div>
                        <div className="bg-card border border-border rounded-3xl overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-secondary/50 border-b border-border">
                                    <tr>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">Transaction ID</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">Workspace</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">User</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">Date/Time</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-right">Amount</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">Status</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {Array.isArray(bookings) && bookings.filter(b => !!b).map(booking => (
                                        <tr key={booking._id} className="hover:bg-secondary/20 transition-all">
                                            <td className="px-6 py-4 text-xs font-mono text-muted-foreground">
                                                {booking.transactionId || '---'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="font-bold text-sm">{booking.workspace?.name || 'Deleted Workspace'}</span>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-semibold">{booking.user?.name || 'Unknown User'}</td>
                                            <td className="px-6 py-4 text-xs text-muted-foreground">
                                                {booking.date ? new Date(booking.date).toLocaleDateString() : 'No date'} at {booking.startTime || '??'}
                                            </td>
                                            <td className="px-6 py-4 text-sm font-black text-right">
                                                <div className="text-foreground">${booking.totalPrice || 0}</div>
                                                <div className="text-[10px] text-muted-foreground">Com: ${(booking.platformFee || 0).toFixed(2)}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-md ${booking.status === 'confirmed' ? 'bg-green-500/10 text-green-500' : 'bg-orange-500/10 text-orange-500'
                                                    }`}>
                                                    {booking.status || 'pending'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => handleCancelBooking(booking._id)}
                                                    className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-all"
                                                    title="Cancel Booking"
                                                >
                                                    <XCircle className="h-4 w-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === "payouts" && (
                    <div className="space-y-6">
                        <div className="bg-blue-500/5 border border-blue-500/10 p-6 rounded-3xl flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-bold text-blue-500">Payout Management</h3>
                                <p className="text-blue-500/60 text-sm">Review earnings and release payments to workspace owners.</p>
                            </div>
                            <Wallet className="h-8 w-8 text-blue-500 opacity-50" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {Array.isArray(payouts) && payouts.length === 0 ? (
                                <div className="col-span-full py-20 text-center text-muted-foreground bg-card border border-border rounded-3xl">
                                    <CheckCircle className="h-10 w-10 mx-auto mb-4 text-green-500" />
                                    No pending payouts found.
                                </div>
                            ) : (
                                Array.isArray(payouts) && payouts.map(payout => (
                                    <div key={payout._id} className="bg-card border border-border p-6 rounded-3xl flex flex-col gap-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-bold text-lg">{payout.ownerName}</h4>
                                                <p className="text-xs text-muted-foreground">{payout.ownerEmail}</p>
                                            </div>
                                            <div className="bg-green-500/10 text-green-500 px-3 py-1 rounded-full text-xs font-black uppercase">
                                                {payout.bookingsCount} orders
                                            </div>
                                        </div>
                                        <div className="py-4 border-y border-border">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-sm text-muted-foreground">Total Payable</span>
                                                <span className="text-2xl font-black">${payout.totalAmount.toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs text-muted-foreground">Platform Fees Deducted</span>
                                                <span className="text-xs font-bold text-green-500">10% Applied</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleProcessPayout(payout.bookingIds, payout._id)}
                                            className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                                        >
                                            Release Payout
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}

                {activeTab === "complaints" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {Array.isArray(complaints) && complaints.length === 0 ? (
                            <div className="col-span-2 py-20 bg-card border border-border rounded-3xl text-center">
                                <MessageSquare className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                                <p className="font-bold text-muted-foreground">No active complaints</p>
                            </div>
                        ) : (
                            Array.isArray(complaints) && complaints.filter(c => !!c).map(complaint => (
                                <div key={complaint._id} className="bg-card border border-border p-6 rounded-3xl space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold text-lg">{complaint.subject || 'No Subject'}</h3>
                                            <p className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground">
                                                From: {complaint.user?.name || 'Unknown'} ({complaint.user?.email || 'No email'})
                                            </p>
                                        </div>
                                        <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-md ${complaint.status === 'pending' ? 'bg-orange-500/10 text-orange-500' : 'bg-green-500/10 text-green-500'
                                            }`}>
                                            {complaint.status || 'pending'}
                                        </span>
                                    </div>
                                    <p className="text-sm text-foreground/80 leading-relaxed">
                                        {complaint.description || 'No description provided.'}
                                    </p>
                                    {complaint.status === 'pending' && (
                                        <button
                                            onClick={() => handleResolveComplaint(complaint._id)}
                                            className="w-full py-3 bg-secondary hover:bg-secondary/80 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-2"
                                        >
                                            <CheckCircle className="h-4 w-4" />
                                            Mark as Resolved
                                        </button>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
