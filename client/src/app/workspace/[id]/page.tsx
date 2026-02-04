"use client";

import Image from "next/image";
import {
    MapPin,
    Star,
    Wifi,
    Coffee,
    Battery,
    Shield,
    Clock,
    Calendar,
    Users,
    ChevronRight,
    Monitor,
    Video,
    Wind,
    Phone,
    Loader2,
    CheckCircle2,
    Heart
} from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { ErrorDisplay } from "@/components/ErrorDisplay";
import { Reviews } from "@/components/Reviews";
import toast from "react-hot-toast";

export default function WorkspaceDetails() {
    const { id } = useParams();
    const router = useRouter();
    const { isAuthenticated, user } = useAuth();
    const [activeTab, setActiveTab] = useState("description");
    const [workspace, setWorkspace] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isBooking, setIsBooking] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [errors, setErrors] = useState<string[]>([]);

    // Booking states
    const [bookingDate, setBookingDate] = useState("2026-01-25");
    const [duration, setDuration] = useState(1);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [wsRes, userRes] = await Promise.all([
                    api.get(`/workspaces/${id}`),
                    isAuthenticated ? api.get('/users/wishlist') : Promise.resolve({ data: [] })
                ]);

                setWorkspace(wsRes.data);
                if (isAuthenticated && Array.isArray(userRes.data)) {
                    setIsFavorite(userRes.data.includes(id));
                }
            } catch (err) {
                console.error("Failed to fetch data", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [id, isAuthenticated]);

    const toggleFavorite = async () => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }
        try {
            if (isFavorite) {
                await api.delete(`/users/wishlist/${id}`);
                toast.success("Removed from wishlist");
            } else {
                await api.post(`/users/wishlist/${id}`);
                toast.success("Added to wishlist");
            }
            setIsFavorite(!isFavorite);
        } catch (err) {
            toast.error("Failed to update wishlist");
        }
    };

    const handleBooking = async () => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        setIsBooking(true);
        setErrors([]);

        try {
            const bookingData = {
                workspaceId: id,
                date: bookingDate,
                startTime: "09:00 AM",
                duration: duration,
                totalPrice: (workspace?.pricePerHour || 0) * duration
            };

            const res = await api.post('/bookings', bookingData);
            router.push(`/payment/${res.data._id}`);
        } catch (err: any) {
            setErrors([err.response?.data?.message || "Booking failed. Please try again."]);
        } finally {
            setIsBooking(false);
        }
    };

    if (isLoading) return (
        <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
    );

    if (!workspace) return <div className="min-h-screen flex items-center justify-center font-bold">Workspace not found.</div>;

    const basePrice = workspace.pricePerHour || 0;
    const totalPrice = (basePrice * duration) + 30; // 30 for fees

    return (
        <div className="min-h-screen bg-background text-foreground pb-20">
            {/* Gallery Section */}
            <div className="max-w-7xl mx-auto px-6 pt-8 grid grid-cols-1 md:grid-cols-4 gap-4 h-[500px]">
                <div className="md:col-span-2 relative rounded-3xl overflow-hidden group">
                    <Image src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200" alt="Main" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="hidden md:flex flex-col gap-4 md:col-span-1">
                    <div className="relative flex-1 rounded-3xl overflow-hidden group">
                        <Image src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=600" alt="Room" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                    </div>
                    <div className="relative flex-1 rounded-3xl overflow-hidden group">
                        <Image src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=600" alt="Lounge" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                    </div>
                </div>
                <div className="relative md:col-span-1 border border-border bg-secondary rounded-3xl flex items-center justify-center p-8 text-center bg-[url('https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&q=80&w=600')] bg-cover">
                    <div className="absolute inset-0 bg-primary/40 backdrop-blur-[2px]" />
                    <div className="relative z-10 text-white">
                        <span className="text-4xl font-bold">+12</span>
                        <p className="text-sm font-semibold mt-2">View all photos</p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-12">
                {/* Left Side - Details */}
                <div className="flex-1">
                    <ErrorDisplay errors={errors} clearError={() => setErrors([])} />

                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-widest">
                                {workspace.isVerified ? "Verified Partner" : "New Partner"}
                            </span>
                            <div className="flex items-center gap-1 text-sm font-bold">
                                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" /> 4.9 (Recent)
                            </div>
                        </div>
                        <div className="flex justify-between items-start">
                            <h1 className="text-4xl font-black mb-4 tracking-tight">{workspace.name}</h1>
                            <button
                                onClick={toggleFavorite}
                                className={`p-3 rounded-full border transition-all ${isFavorite ? 'bg-red-50 border-red-200 text-red-500' : 'bg-white border-gray-200 text-gray-400 hover:border-red-200 hover:text-red-500'}`}
                            >
                                <Heart className={`h-6 w-6 ${isFavorite ? 'fill-current' : ''}`} />
                            </button>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span>{workspace.address || workspace.location}</span>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex border-b border-border mb-8 gap-8 font-montserrat">
                        {["description", "amenities", "location"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`pb-4 text-sm font-bold capitalize transition-all relative ${activeTab === tab ? 'text-primary' : 'text-muted-foreground'}`}
                            >
                                {tab}
                                {activeTab === tab && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full" />}
                            </button>
                        ))}
                    </div>

                    <div className="prose prose-slate max-w-none text-muted-foreground leading-relaxed">
                        <p>{workspace.description}</p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10">
                            {workspace.amenities?.slice(0, 4).map((amenity: string, i: number) => (
                                <div key={i} className="text-center">
                                    <div className="w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-3">
                                        <CheckCircle2 className="h-6 w-6 text-primary" />
                                    </div>
                                    <span className="text-xs font-bold text-foreground">{amenity}</span>
                                </div>
                            ))}
                        </div>

                        <h3 className="text-lg font-bold text-foreground mb-4">Space Highlights</h3>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none p-0">
                            {workspace.amenities?.map((amenity: string, i: number) => (
                                <li key={i} className="flex items-center gap-2 text-sm">
                                    <div className="h-1.5 w-1.5 rounded-full bg-primary" /> {amenity}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <hr className="my-10 border-border" />
                    <Reviews workspaceId={id as string} />
                </div>

                {/* Right Side - Booking Card */}
                <div className="w-full lg:w-[450px]">
                    <div className="glass border border-white/40 p-8 rounded-[2.5rem] sticky top-28 shadow-2xl">
                        <div className="flex justify-between items-end mb-8">
                            <div>
                                <span className="text-3xl font-black">${workspace.pricePerHour}</span>
                                <span className="text-muted-foreground ml-1">/ hour</span>
                            </div>
                            <div className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full uppercase">Instant Booking</div>
                        </div>

                        <div className="space-y-4 mb-8">
                            <div className="border border-border rounded-2xl p-4 flex justify-between items-center group transition-all">
                                <div>
                                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Date</div>
                                    <input
                                        type="date"
                                        value={bookingDate}
                                        onChange={(e) => setBookingDate(e.target.value)}
                                        className="bg-transparent font-bold outline-none text-sm w-full"
                                    />
                                </div>
                            </div>
                            <div className="border border-border rounded-2xl p-4 flex justify-between items-center transition-all">
                                <div>
                                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Duration (Hours)</div>
                                    <div className="flex items-center gap-4">
                                        <button onClick={() => setDuration(Math.max(1, duration - 1))} className="h-6 w-6 rounded-md bg-secondary flex items-center justify-center font-bold">-</button>
                                        <span className="font-bold">{duration} hrs</span>
                                        <button onClick={() => setDuration(duration + 1)} className="h-6 w-6 rounded-md bg-secondary flex items-center justify-center font-bold">+</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">${workspace.pricePerHour} x {duration} hours</span>
                                <span className="font-bold">${basePrice * duration}.00</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Service & Platform fees</span>
                                <span className="font-bold">$30.00</span>
                            </div>
                            <hr className="border-border" />
                            <div className="flex justify-between items-center">
                                <span className="font-bold">Total</span>
                                <span className="text-2xl font-black">${totalPrice}.00</span>
                            </div>
                        </div>

                        <button
                            onClick={handleBooking}
                            disabled={isBooking}
                            className="w-full bg-primary text-white py-5 rounded-2xl font-black text-xl hover:bg-primary/90 transition-all shadow-xl shadow-primary/30 active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-3"
                        >
                            {isBooking && <Loader2 className="h-5 w-5 animate-spin" />}
                            {isBooking ? "Confirming..." : "Reserve Space"}
                        </button>
                        <p className="text-center text-[10px] text-muted-foreground mt-4 font-bold uppercase tracking-widest">No hidden charges • Cancel anytime</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
