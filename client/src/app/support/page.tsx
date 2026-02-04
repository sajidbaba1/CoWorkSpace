"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send, MessageSquare, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function SupportPage() {
    const [submitting, setSubmitting] = useState(false);
    const { user, isAuthenticated } = useAuth();
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isAuthenticated) {
            toast.error("Please login to send a support request directly.");
            return;
        }

        setSubmitting(true);
        try {
            await api.post('/admin/complaints/create', {
                subject: subject,
                description: message
            });
            toast.success("Message sent! Track it in your dashboard.");
            setSubject("");
            setMessage("");
        } catch (err) {
            toast.error("Failed to send message.");
        } finally {
            setSubmitting(false);
        }
    };

    const faqs = [
        { q: "How do I cancel a booking?", a: "You can cancel any booking from your Dashboard > Bookings tab. Refunds are processed within 5-7 business days." },
        { q: "Is internet included?", a: "Yes, all our workspaces come with high-speed WiFi included in the price." },
        { q: "Can I host events?", a: "Some large workspaces support events. Check the 'Conference Hall' filter when searching." },
        { q: "How does the 'Smart Match' work?", a: "Our AI analyzes your preferences (team size, budget, amenities) to suggest the perfect workspace for you." },
    ];

    return (
        <div className="min-h-screen bg-background pb-20 pt-24 px-6">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
                        We're here to <span className="text-primary">help</span>.
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Got a question? Need support? Just want to say hi? We'd love to hear from you.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Contact Form */}
                    <div className="space-y-8">
                        <div className="bg-card border border-border p-8 rounded-[2.5rem] shadow-xl">
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                <Send className="h-6 w-6 text-primary" /> Send us a message
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Name</label>
                                        <input type="text" required className="w-full bg-secondary p-4 rounded-xl outline-none focus:ring-2 focus:ring-primary/50 transition-all font-semibold" placeholder="John Doe" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email</label>
                                        <input type="email" required className="w-full bg-secondary p-4 rounded-xl outline-none focus:ring-2 focus:ring-primary/50 transition-all font-semibold" placeholder="john@example.com" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Subject</label>
                                    <input type="text" required value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full bg-secondary p-4 rounded-xl outline-none focus:ring-2 focus:ring-primary/50 transition-all font-semibold" placeholder="Booking Inquiry" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Message</label>
                                    <textarea required value={message} onChange={(e) => setMessage(e.target.value)} className="w-full bg-secondary p-4 rounded-xl outline-none focus:ring-2 focus:ring-primary/50 transition-all font-semibold min-h-[150px] resize-none" placeholder="Describe your issue..." />
                                </div>
                                <button disabled={submitting} className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-primary/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                                    {submitting ? "Sending..." : "Send Message"}
                                </button>
                            </form>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-secondary/40 p-6 rounded-3xl flex flex-col items-center text-center gap-3">
                                <div className="p-3 bg-white rounded-full shadow-sm"><Mail className="h-5 w-5 text-primary" /></div>
                                <div className="font-bold text-sm">support@cowork.com</div>
                            </div>
                            <div className="bg-secondary/40 p-6 rounded-3xl flex flex-col items-center text-center gap-3">
                                <div className="p-3 bg-white rounded-full shadow-sm"><Phone className="h-5 w-5 text-primary" /></div>
                                <div className="font-bold text-sm">+1 (555) 123-4567</div>
                            </div>
                            <div className="bg-secondary/40 p-6 rounded-3xl flex flex-col items-center text-center gap-3">
                                <div className="p-3 bg-white rounded-full shadow-sm"><MapPin className="h-5 w-5 text-primary" /></div>
                                <div className="font-bold text-sm">San Francisco, CA</div>
                            </div>
                        </div>
                    </div>

                    {/* FAQ */}
                    <div>
                        <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                            <HelpCircle className="h-6 w-6 text-primary" /> Frequently Asked Questions
                        </h2>
                        <div className="space-y-4">
                            {faqs.map((faq, i) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    key={i}
                                    className="bg-card border border-border p-6 rounded-3xl hover:shadow-lg transition-all cursor-pointer group"
                                >
                                    <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">{faq.q}</h3>
                                    <p className="text-muted-foreground leading-relaxed">{faq.a}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
