"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    LayoutDashboard,
    Plus,
    Upload,
    MapPin,
    IndianRupee,
    Users,
    Info,
    CheckCircle2,
    Loader2
} from "lucide-react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { ErrorDisplay } from "@/components/ErrorDisplay";

export default function CreateWorkspace() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<string[]>([]);
    const [formData, setFormData] = useState({
        name: "",
        type: "Hot Desk",
        location: "",
        pricePerHour: "",
        capacity: "",
        description: "",
        address: "",
        amenities: [] as string[]
    });
    const [images, setImages] = useState<File[]>([]);

    const amenitiesList = [
        "High-speed WiFi", "Artisan Coffee", "24/7 Access", "Power Backup",
        "Meeting Rooms", "Parking", "AC", "Phone Booths"
    ];

    const toggleAmenity = (amenity: string) => {
        setFormData(prev => ({
            ...prev,
            amenities: prev.amenities.includes(amenity)
                ? prev.amenities.filter(a => a !== amenity)
                : [...prev.amenities, amenity]
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors([]);

        try {
            const data = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                if (key === 'amenities') {
                    formData.amenities.forEach(amenity => data.append('amenities', amenity));
                } else {
                    data.append(key, value as string);
                }
            });

            images.forEach(image => {
                data.append('images', image);
            });

            await api.post('/workspaces', data);
            router.push('/dashboard/owner');
        } catch (err: any) {
            setErrors([err.response?.data?.message || "Failed to create workspace."]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setImages(Array.from(e.target.files));
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-4xl mx-auto px-6 py-12">
                <div className="flex items-center gap-4 mb-8">
                    <button onClick={() => router.back()} className="p-2 hover:bg-secondary rounded-full transition-all">
                        <LayoutDashboard className="h-5 w-5" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-black tracking-tight">List New Workspace</h1>
                        <p className="text-muted-foreground text-sm">Fill in the details to start hosting professionals.</p>
                    </div>
                </div>

                <ErrorDisplay errors={errors} clearError={() => setErrors([])} />

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Basic Info */}
                    <div className="bg-card border border-border rounded-3xl p-8 shadow-sm">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Info className="h-5 w-5 text-primary" /> Basic Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold ml-1">Workspace Name</label>
                                <input
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-secondary border border-border rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary/20"
                                    placeholder="e.g. Skyline Innovation Hub"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold ml-1">Workspace Type</label>
                                <select
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    className="w-full bg-secondary border border-border rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary/20"
                                >
                                    <option>Hot Desk</option>
                                    <option>Dedicated Desk</option>
                                    <option>Private Office</option>
                                    <option>Meeting Room</option>
                                    <option>Conference Hall</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Images */}
                    <div className="bg-card border border-border rounded-3xl p-8 shadow-sm">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Upload className="h-5 w-5 text-primary" /> Workspace Images
                        </h2>
                        <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:bg-secondary/20 transition-all">
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                                id="workspace-images"
                            />
                            <label htmlFor="workspace-images" className="cursor-pointer flex flex-col items-center gap-2">
                                <Upload className="h-8 w-8 text-muted-foreground" />
                                <span className="font-bold text-sm">Click to upload images</span>
                                <span className="text-xs text-muted-foreground">Max 5 images (JPG, PNG)</span>
                            </label>
                            {images.length > 0 && (
                                <div className="mt-4 flex flex-wrap gap-2 justify-center">
                                    {images.map((img, i) => (
                                        <span key={i} className="text-xs bg-secondary px-2 py-1 rounded-lg">{img.name}</span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Location & Pricing */}
                    <div className="bg-card border border-border rounded-3xl p-8 shadow-sm">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-primary" /> Location & Pricing
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold ml-1">City/Area</label>
                                <input
                                    required
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    className="w-full bg-secondary border border-border rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary/20"
                                    placeholder="e.g. Downtown, New York"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold ml-1">Price per Hour (₹)</label>
                                <div className="relative">
                                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <input
                                        required
                                        type="number"
                                        value={formData.pricePerHour}
                                        onChange={(e) => setFormData({ ...formData, pricePerHour: e.target.value })}
                                        className="w-full bg-secondary border border-border rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-primary/20"
                                        placeholder="25"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold ml-1">Full Address</label>
                            <input
                                required
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                className="w-full bg-secondary border border-border rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary/20"
                                placeholder="123 Workspace Blvd, Floor 4..."
                            />
                        </div>
                    </div>

                    {/* Amenities */}
                    <div className="bg-card border border-border rounded-3xl p-8 shadow-sm">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5 text-primary" /> Amenities
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {amenitiesList.map((amenity) => (
                                <button
                                    key={amenity}
                                    type="button"
                                    onClick={() => toggleAmenity(amenity)}
                                    className={`p-3 rounded-xl border text-xs font-bold transition-all ${formData.amenities.includes(amenity) ? 'bg-primary border-primary text-white shadow-lg' : 'bg-secondary border-border text-muted-foreground'}`}
                                >
                                    {amenity}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Description & Capacity */}
                    <div className="bg-card border border-border rounded-3xl p-8 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <Users className="h-5 w-5 text-primary" /> Capacity & Details
                            </h2>
                            <div className="w-32">
                                <input
                                    type="number"
                                    value={formData.capacity}
                                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                                    className="w-full bg-secondary border border-border rounded-xl p-2 text-center outline-none"
                                    placeholder="Pax"
                                />
                            </div>
                        </div>
                        <textarea
                            required
                            rows={5}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full bg-secondary border border-border rounded-xl p-4 outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                            placeholder="Describe your workspace, atmosphere, and special rules..."
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-primary text-white py-5 rounded-[2rem] font-black text-xl hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 disabled:opacity-70"
                    >
                        {isLoading ? <Loader2 className="animate-spin h-6 w-6" /> : <Plus className="h-6 w-6" />}
                        {isLoading ? "Publishing..." : "List Workspace Now"}
                    </button>
                    <p className="text-center text-xs text-muted-foreground font-medium italic">
                        By listing your space, you agree to our Terms of Service and Hosting Guidelines.
                    </p>
                </form>
            </div>
        </div>
    );
}
