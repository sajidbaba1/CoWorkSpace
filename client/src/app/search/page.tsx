"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Search, MapPin, Filter, Star, Wifi, Coffee, Clock, CreditCard, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import api from "@/lib/api";

import { useRouter } from "next/navigation";

export default function SearchPage() {
    const router = useRouter();
    const [workspaces, setWorkspaces] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchWorkspaces = async (query = "") => {
        setIsLoading(true);
        try {
            const response = await api.get(`/workspaces?search=${query}`);
            if (response.data.length > 0) {
                setWorkspaces(response.data);
            } else {
                setWorkspaces(MOCK_FALLBACK);
            }
        } catch (error) {
            console.error("Error fetching workspaces:", error);
            setWorkspaces(MOCK_FALLBACK);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchWorkspaces();
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchWorkspaces(searchQuery);
    };


    const MOCK_FALLBACK = [
        {
            _id: "1",
            name: "Skyline Coworking",
            location: "Downtown, New York",
            pricePerHour: 35,
            rating: 4.8,
            images: ["https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800"],
            amenities: ["WiFi", "Coffee", "AC", "24/7 Access"],
            type: "Hot Desk"
        },
        {
            _id: "2",
            name: "The Green Suite",
            location: "Brooklyn, NY",
            pricePerHour: 120,
            rating: 4.9,
            images: ["https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800"],
            amenities: ["Private Office", "Meeting App", "Parking"],
            type: "Private Office"
        }
    ];

    return (
        <div className="min-h-screen bg-background text-foreground">
            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* Header & Filter Bar */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">Workspaces in New York</h1>
                        <p className="text-muted-foreground">{workspaces.length} spaces found matching your criteria.</p>
                    </div>
                    <div className="flex gap-4 w-full md:w-auto">
                        <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-secondary px-6 py-3 rounded-xl font-medium border border-border hover:bg-secondary/80 transition-all">
                            <Filter className="h-4 w-4" /> Filters
                        </button>
                        <form onSubmit={handleSearch} className="flex-[2] md:w-64 bg-card border border-border rounded-xl px-4 py-3 flex items-center gap-2">
                            <Search className="h-4 w-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search areas..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-transparent border-none outline-none w-full text-sm font-medium"
                            />
                        </form>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Main List */}
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {isLoading ? (
                            <div className="col-span-2 flex justify-center py-20">
                                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                            </div>
                        ) : (
                            workspaces.map((space) => (
                                <motion.div
                                    key={space._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    onClick={() => router.push(`/workspace/${space._id}`)}
                                    className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl transition-all cursor-pointer group"
                                >
                                    <div className="relative h-56">
                                        <Image src={(Array.isArray(space.images) && space.images.length > 0 && space.images[0]) || space.image || "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800"} alt={space.name || "Workspace"} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                                        <div className="absolute top-4 left-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">{space.type}</div>
                                        <div className="absolute bottom-4 left-4 glass px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1">
                                            <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" /> {space.rating}
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{space.name}</h3>
                                            <div className="text-right">
                                                <span className="text-lg font-bold text-primary">₹{space.pricePerHour || space.price}</span>
                                                <span className="text-xs text-muted-foreground block">/hr</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 text-muted-foreground text-sm mb-6">
                                            <MapPin className="h-3 w-3" /> {space.location}
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <Wifi className="h-3.5 w-3.5" /> High-speed WiFi
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <Coffee className="h-3.5 w-3.5" /> Free Coffee
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <Clock className="h-3.5 w-3.5" /> 24/7 Access
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <CreditCard className="h-3.5 w-3.5" /> Instant Pay
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>

                    {/* Map Preview Placeholder */}
                    <div className="w-full lg:w-[400px] h-[600px] sticky top-28 bg-secondary rounded-3xl overflow-hidden border border-border group">
                        <div className="absolute inset-0 flex items-center justify-center p-8 text-center bg-[url('https://api.mapbox.com/styles/v1/mapbox/light-v10/static/-74.006,40.7128,12,0/400x600?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZzeXoiLCJhIjoiY2l6Nzh2Z293MDAycTJ3cXByNzlvN2NjIn0')] bg-cover opacity-80 group-hover:opacity-100 transition-opacity">
                            <div className="glass p-6 rounded-2xl relative z-10 border-white/50">
                                <MapPin className="h-8 w-8 text-primary mx-auto mb-4 animate-bounce" />
                                <p className="font-bold text-foreground">Interactive Map View</p>
                                <p className="text-xs text-muted-foreground mt-2">Browse spaces in New York visually</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
