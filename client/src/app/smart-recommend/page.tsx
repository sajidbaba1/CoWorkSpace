"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Sparkles, Check, ArrowRight, Star } from 'lucide-react';
import Link from 'next/link';

export default function SmartRecommend() {
    const [step, setStep] = useState(1);
    const [preferences, setPreferences] = useState({
        location: '',
        budget: 0,
        facilities: [] as string[],
        requirement: ''
    });
    const [results, setResults] = useState<any[] | null>(null);
    const [loading, setLoading] = useState(false);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

    const handleNext = () => setStep(step + 1);
    const handleBack = () => setStep(step - 1);

    const toggleFacility = (facility: string) => {
        setPreferences(prev => ({
            ...prev,
            facilities: prev.facilities.includes(facility)
                ? prev.facilities.filter(f => f !== facility)
                : [...prev.facilities, facility]
        }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/ai/recommend`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(preferences)
            });
            const data = await res.json();
            if (data.success) {
                setResults(data.recommendations);
                setStep(4); // Results step
            }
        } catch (error) {
            console.error(error);
            alert('Failed to get recommendations');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col items-center pt-24 px-4 pb-12">
            <div className="w-full max-w-2xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary font-bold text-sm mb-4">
                        <Sparkles className="w-4 h-4" />
                        AI Workspace Matcher
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Find your perfect office <br /> in seconds.</h1>
                    <p className="text-muted-foreground text-lg">Answer a few questions and let our AI find the best workspace for you.</p>
                </motion.div>

                {step === 1 && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-card glass border border-border p-8 rounded-3xl shadow-xl"
                    >
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                            <span className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
                            Where do you want to work?
                        </h2>
                        <div className="relative mb-8">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="City or Area (e.g. San Francisco)"
                                value={preferences.location}
                                onChange={(e) => setPreferences({ ...preferences, location: e.target.value })}
                                className="w-full bg-secondary/50 border-2 border-transparent focus:border-primary rounded-xl py-4 pl-12 pr-4 text-lg outline-none transition-all"
                            />
                        </div>
                        <button
                            onClick={handleNext}
                            disabled={!preferences.location}
                            className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold text-lg hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                        >
                            Next Step <ArrowRight className="w-5 h-5" />
                        </button>
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-card glass border border-border p-8 rounded-3xl shadow-xl"
                    >
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                            <span className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
                            What is your max budget?
                        </h2>
                        <div className="mb-8">
                            <div className="flex items-center gap-2 mb-2 text-primary font-bold text-xl">
                                ₹ {preferences.budget} <span className="text-muted-foreground text-sm font-normal">/ day</span>
                            </div>
                            <input
                                type="range"
                                min="100"
                                max="5000"
                                step="100"
                                value={preferences.budget || 500}
                                onChange={(e) => setPreferences({ ...preferences, budget: parseInt(e.target.value) })}
                                className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                            />
                            <div className="flex justify-between text-sm text-muted-foreground mt-2">
                                <span>₹100</span>
                                <span>₹5000+</span>
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 mt-8">
                            <span className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center text-sm">3</span>
                            What are you looking for?
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                            {['Individual Desk', 'Team Office', 'Meeting Room'].map((req) => (
                                <button
                                    key={req}
                                    onClick={() => setPreferences({ ...preferences, requirement: req })}
                                    className={`p-4 rounded-xl border-2 transition-all font-bold ${preferences.requirement === req
                                        ? 'border-primary bg-primary/10 text-primary'
                                        : 'border-border hover:border-primary/50 text-muted-foreground'
                                        }`}
                                >
                                    {req}
                                </button>
                            ))}
                        </div>

                        <div className="flex gap-4">
                            <button onClick={handleBack} className="flex-1 py-4 font-bold text-muted-foreground hover:text-foreground">Back</button>
                            <button
                                onClick={handleNext}
                                className="flex-[2] bg-primary text-primary-foreground py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-all"
                            >
                                Next Step
                            </button>
                        </div>
                    </motion.div>
                )}

                {step === 3 && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-card glass border border-border p-8 rounded-3xl shadow-xl"
                    >
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                            <span className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center text-sm">4</span>
                            Any must-have facilities?
                        </h2>
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            {['WiFi', 'AC', 'Parking', 'Coffee', 'Projector', 'Whiteboard', 'Lounge'].map((fac) => (
                                <button
                                    key={fac}
                                    onClick={() => toggleFacility(fac)}
                                    className={`p-4 rounded-xl border-2 transition-all font-bold text-left flex items-center justify-between ${preferences.facilities.includes(fac)
                                        ? 'border-primary bg-primary/10 text-primary'
                                        : 'border-border hover:border-primary/50 text-muted-foreground'
                                        }`}
                                >
                                    {fac}
                                    {preferences.facilities.includes(fac) && <Check className="w-5 h-5" />}
                                </button>
                            ))}
                        </div>

                        <div className="flex gap-4">
                            <button onClick={handleBack} className="flex-1 py-4 font-bold text-muted-foreground hover:text-foreground">Back</button>
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="flex-[2] bg-primary text-primary-foreground py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-all flex items-center justify-center gap-2"
                            >
                                {loading ? 'Finding Best Match...' : 'Find My Office'}
                                {!loading && <Sparkles className="w-5 h-5" />}
                            </button>
                        </div>
                    </motion.div>
                )}

                {step === 4 && results && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-6"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-3xl font-bold">We found {results.length} perfect matches!</h2>
                            <button onClick={() => setStep(1)} className="text-primary font-bold hover:underline">Start Over</button>
                        </div>

                        {results.length === 0 ? (
                            <div className="text-center py-12 bg-card rounded-3xl border border-border">
                                <p className="text-xl text-muted-foreground">No workspaces found matching your exact criteria.</p>
                                <button onClick={() => setStep(1)} className="mt-4 text-primary font-bold">Try adjusting filters</button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-6">
                                {results.map((ws: any) => (
                                    <div key={ws._id} className="bg-card border border-border rounded-2xl p-6 flex flex-col md:flex-row gap-6 hover:shadow-xl transition-all">
                                        <div className="w-full md:w-48 h-32 bg-secondary rounded-xl relative overflow-hidden">
                                            {/* Placeholder for image */}
                                            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary font-bold">
                                                {ws.name[0]}
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <h3 className="text-xl font-bold mb-2">{ws.name}</h3>
                                                <div className="flex items-center gap-1 text-primary font-bold bg-primary/10 px-2 py-1 rounded-lg text-sm">
                                                    <Star className="w-4 h-4 fill-primary" /> {ws.aiScore ? (ws.aiScore / 10).toFixed(1) : 'New'} AI Score
                                                </div>
                                            </div>
                                            <p className="text-muted-foreground mb-4">{ws.location}</p>
                                            <div className="flex gap-2 flex-wrap mb-4">
                                                {ws.amenities?.slice(0, 3).map((f: string) => (
                                                    <span key={f} className="text-xs font-bold uppercase tracking-wider bg-secondary px-2 py-1 rounded text-secondary-foreground">{f}</span>
                                                ))}
                                                {ws.amenities?.length > 3 && <span className="text-xs text-muted-foreground">+{ws.amenities.length - 3} more</span>}
                                            </div>
                                            <div className="flex justify-between items-center mt-auto">
                                                <div>
                                                    <span className="text-xl font-bold">₹{ws.pricePerHour} <span className="text-sm font-normal text-muted-foreground">/ hr</span></span>
                                                    <div className="text-xs text-muted-foreground">Approx ₹{ws.pricePerHour * 8}/day</div>
                                                </div>
                                                <button onClick={() => window.location.href = `/workspace/${ws._id}`} className="bg-primary text-primary-foreground px-6 py-2 rounded-full font-bold hover:bg-primary/90">
                                                    View Details
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}
            </div>
        </div>
    );
}
