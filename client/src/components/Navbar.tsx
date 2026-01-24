"use client";

import Link from "next/link";
import { Search, MapPin, User, Menu, X, Info, Home as HomeIcon, LayoutDashboard } from "lucide-react";
import { useState, useEffect } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { user, logout, isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Home", icon: HomeIcon },
    { href: "/search", label: "Find Spaces", icon: Search },
    { href: "/about", label: "About", icon: Info },
  ];

  // Role-based dashboard link
  const getDashboardLink = () => {
    if (!user) return "/login";
    if (user.role === "admin") return "/dashboard/admin";
    if (user.role === "owner") return "/dashboard/owner";
    return "/dashboard/user";
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 px-4 py-3 ${isScrolled ? 'glass border-b border-border/40 shadow-sm' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
            <span className="text-white font-bold text-xl">C</span>
          </div>
          <span className="text-2xl font-bold tracking-tight gradient-text hidden sm:block">CoWorkSpace</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-8 mr-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${pathname === link.href ? 'text-primary' : 'text-muted-foreground'}`}
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated && (
              <Link
                href={getDashboardLink()}
                className={`text-sm font-medium transition-colors hover:text-primary ${pathname.includes('dashboard') ? 'text-primary' : 'text-muted-foreground'}`}
              >
                Dashboard
              </Link>
            )}
          </div>

          <div className="h-6 w-px bg-border mx-2" />

          <div className="flex items-center gap-4">
            <ThemeToggle />
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-end">
                  <span className="text-xs font-bold leading-none">{user?.name}</span>
                  <span className="text-[10px] text-primary font-black uppercase tracking-tighter">{user?.role}</span>
                </div>
                <button
                  onClick={logout}
                  className="px-4 py-2 text-sm font-bold border border-border rounded-full hover:bg-secondary transition-all"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link href="/login" className="text-sm font-semibold hover:text-primary transition-colors">Login</Link>
                <Link href="/register" className="px-6 py-2.5 bg-primary text-white rounded-full text-sm font-bold hover:bg-primary/90 transition-all shadow-md hover:shadow-lg active:scale-95">
                  Join Free
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Controls */}
        <div className="flex items-center gap-3 md:hidden">
          <ThemeToggle />
          <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-foreground focus:outline-none">
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Overlay */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full glass border-b border-border md:hidden animate-in slide-in-from-top duration-300 shadow-2xl">
          <div className="flex flex-col p-6 gap-5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 text-lg font-semibold text-foreground"
                onClick={() => setIsOpen(false)}
              >
                <link.icon className="h-5 w-5 text-primary" />
                {link.label}
              </Link>
            ))}
            {isAuthenticated && (
              <Link
                href={getDashboardLink()}
                className="flex items-center gap-3 text-lg font-semibold text-foreground"
                onClick={() => setIsOpen(false)}
              >
                <LayoutDashboard className="h-5 w-5 text-primary" />
                Dashboard
              </Link>
            )}
            <hr className="border-border opacity-50" />
            <div className="flex flex-col gap-4">
              {isAuthenticated ? (
                <button
                  onClick={() => { logout(); setIsOpen(false); }}
                  className="px-5 py-4 bg-secondary text-foreground rounded-xl text-center font-bold shadow-lg"
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link href="/login" onClick={() => setIsOpen(false)} className="text-lg font-semibold text-center py-2 border border-border rounded-xl">
                    Login
                  </Link>
                  <Link href="/register" onClick={() => setIsOpen(false)} className="px-5 py-4 bg-primary text-white rounded-xl text-center font-bold shadow-lg">
                    Create Account
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
