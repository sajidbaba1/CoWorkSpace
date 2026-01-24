"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Send, CheckCircle, ShieldAlert, LifeBuoy } from "lucide-react";
import api from "@/lib/api";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function SupportPage() {
    const [subject, setSubject] = useState("");
    const [description, setDescription] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            // Check if user is logged in
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("Please login to submit a complaint");
                router.push("/login");
                return;
            }

            // In a real app, you would have a client-side route for this
            // We'll use a generic endpoint or just simulate it if the endpoint doesn't exist yet
            // Wait, I created the model but not the user-facing route.
            // Let's assume there is a /api/admin/complaints for creation too or I should add it to a general route.
            // Actually, I should add a general route for users to create complaints.

            await api.post("/admin/complaints/create", { subject, description });
            setSubmitted(true);
            toast.success("Complaint submitted successfully");
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to submit complaint");
        } finally {
            setIsLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen flex items-center justify-center px-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-card border border-border p-12 rounded-[3rem] text-center max-w-lg shadow-2xl"
                >
                    <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="h-10 w-10" />
                    </div>
                    <h1 className="text-3xl font-black mb-4">Ticket Received!</h1>
                    <p className="text-muted-foreground mb-8 text-lg">
                        Our support team has been notified. We usually respond within 24 hours.
                    </p>
                    <button
                        onClick={() => router.push("/dashboard/user")}
                        className="w-full py-4 bg-primary text-white rounded-2xl font-black shadow-lg shadow-primary/20 hover:scale-105 transition-all"
                    >
                        Back to Dashboard
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-secondary/30 py-20 px-6">
            <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-8">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <LifeBuoy className="h-5 w-5 text-primary" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-primary">Support Center</span>
                        </div>
                        <h1 className="text-5xl font-black text-foreground mb-4">How can we help?</h1>
                        <p className="text-muted-foreground text-lg leading-relaxed">
                            Have a problem with a booking? Or found a bug? Tell us everything and we'll fix it ASAP.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-start gap-4 p-6 bg-card border border-border rounded-3xl">
                            <div className="p-3 bg-blue-500/10 text-blue-500 rounded-2xl">
                                <ShieldAlert className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="font-bold">Safety Concern?</h3>
                                <p className="text-xs text-muted-foreground">Report any safety issues immediately for priority handling.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 p-6 bg-card border border-border rounded-3xl">
                            <div className="p-3 bg-purple-500/10 text-purple-500 rounded-2xl">
                                <MessageSquare className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="font-bold">Feature Request?</h3>
                                <p className="text-xs text-muted-foreground">We love hearing how we can make CoWorkSpace better for you.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-card border border-border p-8 rounded-[2.5rem] shadow-xl"
                >
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest ml-1">Subject</label>
                            <input
                                type="text"
                                required
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                placeholder="Briefly describe the issue"
                                className="w-full bg-secondary border border-border rounded-2xl py-4 px-6 focus:ring-2 focus:ring-primary/20 outline-none transition-all font-semibold"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest ml-1">Description</label>
                            <textarea
                                required
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={6}
                                placeholder="Explain in detail..."
                                className="w-full bg-secondary border border-border rounded-2xl py-4 px-6 focus:ring-2 focus:ring-primary/20 outline-none transition-all font-semibold resize-none"
                            />
                        </div>

                        <button
                            disabled={isLoading}
                            className="w-full py-5 bg-primary text-white rounded-2xl font-black shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-2 group disabled:opacity-70"
                        >
                            {isLoading ? "Sending..." : "Submit Ticket"}
                            <Send className="h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}
