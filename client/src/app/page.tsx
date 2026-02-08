"use client";

import Image from "next/image";
import Link from "next/link";
import { Search, MapPin, Calendar, Users, Star, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import api from "@/lib/api";

export default function Home() {
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const res = await api.get("/workspaces");
        setWorkspaces(res.data);
      } catch (err) {
        console.error("Failed to fetch workspaces", err);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkspaces();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-bg.png"
            alt="Premium Coworking Space"
            fill
            className="object-cover brightness-[0.7]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center text-white">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-tight"
          >
            Find Your Perfect <br />
            <span className="gradient-text">Workspace</span> Anywhere
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-white/90 mb-12 max-w-2xl mx-auto font-light"
          >
            From hot desks to private suites, book the space you need to thrive in the world's most innovative locations.
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="max-w-4xl mx-auto glass p-2 rounded-2xl md:rounded-full flex flex-col md:flex-row items-center gap-2 shadow-2xl"
          >
            <div className="flex-[2] flex items-center gap-3 px-6 py-3 w-full border-b md:border-b-0 md:border-r border-white/20">
              <MapPin className="text-primary h-5 w-5" />
              <input
                type="text"
                placeholder="Where are you working?"
                className="bg-transparent border-none outline-none text-foreground w-full placeholder:text-muted-foreground"
              />
            </div>
            <div className="flex-1 flex items-center gap-3 px-6 py-3 w-full border-b md:border-b-0 md:border-r border-white/20">
              <Calendar className="text-primary h-5 w-5" />
              <input
                type="text"
                placeholder="When?"
                className="bg-transparent border-none outline-none text-foreground w-full placeholder:text-muted-foreground"
              />
            </div>
            <div className="flex-1 flex items-center gap-3 px-6 py-3 w-full">
              <Users className="text-primary h-5 w-5" />
              <select className="bg-transparent border-none outline-none text-foreground w-full focus:ring-0 [&>option]:bg-white [&>option]:dark:bg-gray-800 [&>option]:text-gray-900 [&>option]:dark:text-white">
                <option value="1">1 Person</option>
                <option value="2-4">2-4 People</option>
                <option value="5-10">5-10 People</option>
                <option value="10+">10+ People</option>
              </select>
            </div>
            <button
              onClick={() => window.location.href = '/search'}
              className="w-full md:w-auto px-8 py-4 bg-primary text-white rounded-full font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-primary/40"
            >
              <Search className="h-5 w-5" />
              Search
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-8"
          >
            <Link href="/smart-recommend" className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors bg-white/10 px-4 py-2 rounded-full border border-white/10 backdrop-blur-sm">
              <span className="bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text font-bold">✨ New</span>
              try our AI Workspace Matcher
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Sections */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-bold text-foreground mb-4">Popular Spaces</h2>
            <p className="text-muted-foreground">Hand-picked workspaces loved by our community.</p>
          </div>
          <Link href="/search" className="text-primary font-semibold flex items-center gap-2 hover:gap-3 transition-all">
            View all spaces <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-foreground">
          {loading ? (
            [1, 2, 3].map((i) => (
              <div key={i} className="bg-card border border-border rounded-2xl h-96 animate-pulse" />
            ))
          ) : workspaces.length > 0 ? (
            workspaces.slice(0, 3).map((ws: any, i) => (
              <motion.div
                key={ws._id || i}
                whileHover={{ y: -10 }}
                className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer group"
                onClick={() => window.location.href = `/workspace/${ws._id}`}
              >
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={ws.images?.[0] || `https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&q=80&w=800`}
                    alt={ws.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 right-4 glass px-3 py-1 rounded-full text-xs font-bold text-primary flex items-center gap-1">
                    <Star className="h-3 w-3 fill-primary" /> {ws.averageRating || '4.9'}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold truncate pr-4">{ws.name}</h3>
                    <span className="text-primary font-bold whitespace-nowrap">₹{ws.pricePerHour}<span className="text-xs font-normal text-muted-foreground">/hr</span></span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground text-sm mb-4">
                    <MapPin className="h-3 w-3" /> <span className="truncate">{ws.location || 'Unknown Location'}</span>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {ws.amenities?.slice(0, 3).map((amenity: string, idx: number) => (
                      <span key={idx} className="px-2 py-1 bg-secondary text-secondary-foreground text-[10px] font-bold uppercase tracking-wider rounded-md">{amenity}</span>
                    ))}
                    {(!ws.amenities || ws.amenities.length === 0) && (
                      <>
                        <span className="px-2 py-1 bg-secondary text-secondary-foreground text-[10px] font-bold uppercase tracking-wider rounded-md">WiFi</span>
                        <span className="px-2 py-1 bg-secondary text-secondary-foreground text-[10px] font-bold uppercase tracking-wider rounded-md">Coffee</span>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            ))) : (
            <div className="col-span-3 text-center py-20 text-muted-foreground">
              No popular workspaces found at the moment.
            </div>
          )}
        </div>
      </section>

      {/* Trust Section */}
      <section className="bg-secondary/30 py-24 px-6 border-y border-border">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-16 text-foreground">Trusted by 5,000+ teams worldwide</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-12 items-center opacity-50 grayscale hover:grayscale-0 transition-opacity duration-500">
            {/* Simple placeholders for logos */}
            <div className="text-xl font-black text-foreground">TECHCO</div>
            <div className="text-xl font-black text-foreground">SPACE X</div>
            <div className="text-xl font-black text-foreground">GLOBAL</div>
            <div className="text-xl font-black text-foreground">INNOVATE</div>
            <div className="text-xl font-black text-foreground">NEXUS</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto bg-primary rounded-[3rem] p-12 md:p-20 relative overflow-hidden text-center text-primary-foreground">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -ml-20 -mb-20" />

          <h2 className="text-4xl md:text-5xl font-bold mb-6 relative z-10">Own a space? List it today.</h2>
          <p className="text-xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto relative z-10 font-light">
            Monetize your empty offices or meeting rooms. Reach thousands of potential clients looking for their next workspace.
          </p>
          <button className="bg-primary-foreground text-primary px-10 py-4 rounded-full font-bold text-lg hover:bg-secondary transition-all shadow-xl active:scale-95 relative z-10">
            Start Hosting Now
          </button>
        </div>
      </section>
    </div>
  );
}
