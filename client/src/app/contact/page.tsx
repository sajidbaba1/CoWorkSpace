"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            setSubmitting(false);
            setSubmitted(true);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-background pt-24 pb-12 px-6">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary font-bold text-sm mb-4">
                        <MessageSquare className="w-4 h-4" />
                        We'd love to hear from you
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black mb-6">Get in Touch</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Have a question about a workspace? Need help listing your property? Our team is here to help you 24/7.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Contact Info */}
                    <div className="space-y-8">
                        <div className="bg-card border border-border p-8 rounded-[2rem] shadow-sm hover:shadow-lg transition-all">
                            <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary flex-shrink-0">
                                        <Mail className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">Email Us</h3>
                                        <p className="text-muted-foreground mb-1">Our friendly team is here to help.</p>
                                        <a href="mailto:support@coworkspace.com" className="text-primary font-bold hover:underline">support@coworkspace.com</a>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary flex-shrink-0">
                                        <MapPin className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">Visit Us</h3>
                                        <p className="text-muted-foreground mb-1">Come say hello at our office HQ.</p>
                                        <p className="font-medium">100 Innovation Dr, Tech Valley, CA 94043</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary flex-shrink-0">
                                        <Phone className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">Call Us</h3>
                                        <p className="text-muted-foreground mb-1">Mon-Fri from 8am to 5pm.</p>
                                        <a href="tel:+1555000000" className="text-primary font-bold hover:underline">+1 (555) 000-0000</a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-secondary/30 p-8 rounded-[2rem] border border-border">
                            <h3 className="text-xl font-bold mb-4">Frequently Asked Questions</h3>
                            <div className="space-y-4">
                                <details className="group">
                                    <summary className="font-bold cursor-pointer list-none flex justify-between items-center">
                                        How do I book a space?
                                        <span className="transition group-open:rotate-180">▼</span>
                                    </summary>
                                    <p className="text-muted-foreground text-sm mt-2">Simply search for a location, choose your dates, and click 'Reserve Space'. You'll need to complete a quick KYC verification first.</p>
                                </details>
                                <hr className="border-border opacity-50" />
                                <details className="group">
                                    <summary className="font-bold cursor-pointer list-none flex justify-between items-center">
                                        Can I list my own office?
                                        <span className="transition group-open:rotate-180">▼</span>
                                    </summary>
                                    <p className="text-muted-foreground text-sm mt-2">Yes! Create an account, verified as an Owner, and you can start listing your properties immediately.</p>
                                </details>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-card glass border border-border p-8 md:p-10 rounded-[2.5rem] shadow-xl relative overflow-hidden"
                    >
                        {submitted ? (
                            <div className="absolute inset-0 z-10 bg-card flex flex-col items-center justify-center text-center p-8 animate-in fade-in duration-500">
                                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-6">
                                    <Send className="w-10 h-10" />
                                </div>
                                <h2 className="text-3xl font-black mb-2">Message Sent!</h2>
                                <p className="text-muted-foreground mb-8">Thanks for reaching out. We'll get back to you within 24 hours.</p>
                                <button
                                    onClick={() => { setSubmitted(false); setFormData({ name: "", email: "", subject: "", message: "" }) }}
                                    className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold hover:opacity-90 transition-all"
                                >
                                    Send Another Message
                                </button>
                            </div>
                        ) : null}

                        <h2 className="text-2xl font-bold mb-8">Send us a Message</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold ml-1">Your Name</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-secondary border border-border rounded-xl p-4 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold ml-1">Email Address</label>
                                    <input
                                        required
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full bg-secondary border border-border rounded-xl p-4 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                        placeholder="john@example.com"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold ml-1">Subject</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    className="w-full bg-secondary border border-border rounded-xl p-4 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                    placeholder="How can we help?"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold ml-1">Message</label>
                                <textarea
                                    required
                                    rows={5}
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    className="w-full bg-secondary border border-border rounded-xl p-4 outline-none focus:ring-2 focus:ring-primary/20 transition-all min-h-[150px]"
                                    placeholder="Write your message here..."
                                />
                            </div>
                            <button
                                disabled={submitting}
                                className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                            >
                                {submitting ? "Sending..." : "Send Message"}
                                {!submitting && <Send className="w-5 h-5" />}
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
