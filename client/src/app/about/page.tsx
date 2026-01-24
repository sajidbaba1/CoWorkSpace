"use client";

import { motion } from "framer-motion";
import { Users, Target, Rocket, ShieldCheck, Heart, Sparkles } from "lucide-react";
import Image from "next/image";

export default function AboutPage() {
    const stats = [
        { label: "Active Users", value: "50K+" },
        { label: "Cities Covered", value: "120+" },
        { label: "Workspaces", value: "2,500+" },
        { label: "Support", value: "24/7" },
    ];

    const values = [
        { icon: Target, title: "Our Mission", desc: "To democratize office spaces and empower professionals to work productively from anywhere in the world." },
        { icon: Rocket, title: "Our Vision", desc: "Building the world's most intelligent and accessible workspace network for the next generation of business." },
        { icon: ShieldCheck, title: "Our Promise", desc: "Verified listings, secure payments, and a seamless booking experience every single time." },
    ];

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative py-24 px-6 overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[120px] -mr-48 -mt-48" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-[120px] -ml-48 -mb-48" />

                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-bold mb-8"
                    >
                        <Sparkles className="h-4 w-4" /> Empowering the Future of Work
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-black mb-8 tracking-tight"
                    >
                        We're Redefining <br />
                        <span className="gradient-text text-glow">Office Spaces</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-muted-foreground max-w-3xl mx-auto font-light leading-relaxed"
                    >
                        CoWorkSpace was born out of a simple idea: that where you work shouldn't be a barrier to what you can achieve. We connect people with professional spaces that inspire focus and collaboration.
                    </motion.p>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-12 px-6">
                <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 bg-card border border-border rounded-[2.5rem] p-12 shadow-xl">
                    {stats.map((stat, i) => (
                        <div key={i} className="text-center">
                            <div className="text-4xl font-black text-primary mb-2">{stat.value}</div>
                            <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Values Section */}
            <section className="py-24 px-6 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {values.map((v, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="bg-card border border-border p-10 rounded-[2rem] hover:shadow-2xl transition-all group"
                        >
                            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-all">
                                <v.icon className="h-7 w-7" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">{v.title}</h3>
                            <p className="text-muted-foreground leading-relaxed">{v.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Team/Message Section */}
            <section className="py-24 px-6 bg-secondary/30 border-y border-border">
                <div className="max-w-4xl mx-auto text-center">
                    <Heart className="h-12 w-12 text-red-500 mx-auto mb-8 animate-pulse" />
                    <h2 className="text-3xl font-bold mb-8">Built for Professionals, by Professionals</h2>
                    <p className="text-lg text-muted-foreground italic leading-relaxed">
                        "We believe the future of work is flexible. Whether you need a quiet corner for an hour or a private office for a year, we're here to make sure your workspace is ready when you are."
                    </p>
                    <div className="mt-12 flex items-center justify-center gap-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden">
                            <Image src="https://i.pravatar.cc/100?u=ceo" alt="CEO" width={48} height={48} />
                        </div>
                        <div className="text-left">
                            <div className="font-bold">Adnan Pathan</div>
                            <div className="text-xs text-muted-foreground">Founder & CEO, CoWorkSpace</div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
