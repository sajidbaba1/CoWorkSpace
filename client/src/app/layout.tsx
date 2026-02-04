import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat" });

export const metadata: Metadata = {
  title: "CoWorkSpace | Smart Workspace & Office Booking",
  description: "Book meeting rooms, private offices, and coworking desks instantly. The ultimate platform for flexible workspace management.",
};

import { Chatbot } from "@/components/Chatbot";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${montserrat.variable} font-sans antialiased`}>
        <Toaster position="bottom-right" />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <Navbar />
            <main className="min-h-screen pt-20">
              {children}
            </main>
            <Chatbot />
            <footer className="bg-muted py-12 px-6 border-t border-border">
              <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="col-span-1 md:col-span-1">
                  <h3 className="text-xl font-bold gradient-text mb-4">CoWorkSpace</h3>
                  <p className="text-muted-foreground text-sm">
                    Connecting companies and freelancers with premium workspaces worldwide.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-4 text-foreground">Explore</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li><a href="/search" className="hover:text-primary">Find a Space</a></li>
                    <li><a href="/locations" className="hover:text-primary">Locations</a></li>
                    <li><a href="/pricing" className="hover:text-primary">Corporate Plans</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-4 text-foreground">Host</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li><a href="/list-space" className="hover:text-primary">List Your Property</a></li>
                    <li><a href="/host/dashboard" className="hover:text-primary">Host Dashboard</a></li>
                    <li><a href="/host/resources" className="hover:text-primary">Host Resources</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-4 text-foreground">Support</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li><a href="/contact" className="hover:text-primary">Contact Us</a></li>
                    <li><a href="/faq" className="hover:text-primary">FAQs</a></li>
                    <li><a href="/terms" className="hover:text-primary">Terms of Service</a></li>
                  </ul>
                </div>
              </div>
              <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
                © {new Date().getFullYear()} CoWorkSpace Inc. All rights reserved.
              </div>
            </footer>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
