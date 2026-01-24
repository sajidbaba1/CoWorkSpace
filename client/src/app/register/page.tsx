"use client";

import Link from "next/link";
import { useState } from "react";
import { Mail, Lock, User, ArrowRight, Chrome, Github, Building2, UserCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { ErrorDisplay } from "@/components/ErrorDisplay";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
    const [role, setRole] = useState("customer");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<string[]>([]);
    const router = useRouter();
    const { login } = useAuth();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors([]);

        // Client-side validation
        const newErrors = [];
        if (name.length < 3) newErrors.push("Name must be at least 3 characters.");
        if (!email.includes('@')) newErrors.push("Please provide a valid email.");
        if (password.length < 6) newErrors.push("Password must be at least 6 characters.");

        if (newErrors.length > 0) {
            setErrors(newErrors);
            setIsLoading(false);
            return;
        }

        try {
            const response = await api.post('/auth/register', { name, email, password, role });
            login(response.data.user, response.data.token);
        } catch (err: any) {
            const msg = err.response?.data?.message || "Registration failed. Please try again.";
            setErrors([msg]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left side - Visual */}
            <div className="hidden lg:block flex-1 relative overflow-hidden bg-primary/5">
                <div className="absolute inset-0 bg-gradient-to-tr from-accent/20 to-primary/20" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] aspect-square">
                    <div className="absolute inset-0 bg-white/40 backdrop-blur-3xl rounded-full animate-pulse" />
                    <div className="absolute top-10 left-10 right-10 bottom-10 glass rounded-3xl p-12 flex flex-col justify-between border-white/40 shadow-2xl">
                        <div>
                            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-2xl mb-8">C</div>
                            <h2 className="text-3xl font-bold mb-4 text-foreground">Find or List, we've got you covered.</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Whether you're looking for a desk or managing a skyscraper, CoWorkSpace simple-to-use tools scale with your needs.
                            </p>
                        </div>
                        <div className="bg-white/50 p-6 rounded-2xl border border-white/40">
                            <div className="text-primary font-bold mb-2">Did you know?</div>
                            <p className="text-sm text-foreground/80 lowercase">Teams save up to 45% on office costs when switching to flexible workspaces.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right side - Form */}
            <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 bg-background">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="w-full max-w-md"
                >
                    <div className="text-center mb-10">
                        <h1 className="text-4xl font-bold tracking-tight mb-2">Create Account</h1>
                        <p className="text-muted-foreground">Join the future of work today</p>
                    </div>

                    <ErrorDisplay errors={errors} clearError={() => setErrors([])} />

                    <form onSubmit={handleRegister} className="space-y-6">
                        {/* Role Switcher */}
                        <div className="flex bg-secondary p-1 rounded-2xl border border-border">
                            <button
                                type="button"
                                onClick={() => setRole("customer")}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${role === 'customer' ? 'bg-white shadow-sm text-primary' : 'text-muted-foreground'}`}
                            >
                                <UserCircle className="h-4 w-4" /> Customer
                            </button>
                            <button
                                type="button"
                                onClick={() => setRole("owner")}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${role === 'owner' ? 'bg-white shadow-sm text-primary' : 'text-muted-foreground'}`}
                            >
                                <Building2 className="h-4 w-4" /> Owner
                            </button>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium ml-1">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-secondary border border-border rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    placeholder="John Doe"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium ml-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-secondary border border-border rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    placeholder="name@example.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium ml-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-secondary border border-border rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            disabled={isLoading}
                            className="w-full bg-primary text-white py-4 rounded-xl font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 group shadow-lg shadow-primary/20 disabled:opacity-70"
                        >
                            {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : `Create ${role === 'customer' ? 'User' : 'Host'} Account`}
                            {!isLoading && <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />}
                        </button>

                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-border"></span>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-4 text-muted-foreground font-medium">Or sign up with</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button type="button" className="flex items-center justify-center gap-2 border border-border py-3 rounded-xl hover:bg-secondary transition-all font-medium">
                                <Chrome className="h-4 w-4" /> Google
                            </button>
                            <button type="button" className="flex items-center justify-center gap-2 border border-border py-3 rounded-xl hover:bg-secondary transition-all font-medium">
                                <Github className="h-4 w-4" /> Github
                            </button>
                        </div>

                        <p className="text-center text-sm text-muted-foreground mt-8">
                            Already have an account? <Link href="/login" className="text-primary font-bold hover:underline">Log in</Link>
                        </p>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}
