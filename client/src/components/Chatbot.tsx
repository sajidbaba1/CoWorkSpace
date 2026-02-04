"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ text: string; isBot: boolean }[]>([
        { text: "Hi! I'm your workspace assistant. How can I help you today?", isBot: true }
    ]);
    const [input, setInput] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = () => {
        if (!input.trim()) return;

        const userMessage = input;
        setMessages(prev => [...prev, { text: userMessage, isBot: false }]);
        setInput("");

        // Simulate bot response
        setTimeout(() => {
            let botResponse = "I'm not sure about that. Can you contact support?";
            const lower = userMessage.toLowerCase();

            if (lower.includes("price") || lower.includes("cost")) {
                botResponse = "Prices vary by workspace, but hot desks usually start around $10/day and private offices at $50/day.";
            } else if (lower.includes("booking") || lower.includes("book")) {
                botResponse = "You can book a workspace by selecting a location, choosing a date, and clicking 'Reserve Space'.";
            } else if (lower.includes("cancel") || lower.includes("refund")) {
                botResponse = "You can cancel bookings from your user dashboard. Refunds are processed within 5-7 business days.";
            } else if (lower.includes("wifi") || lower.includes("internet")) {
                botResponse = "All our workspaces come with high-speed WiFi included in the price.";
            } else if (lower.includes("hello") || lower.includes("hi")) {
                botResponse = "Hello there! Looking for a workspace?";
            }

            setMessages(prev => [...prev, { text: botResponse, isBot: true }]);
        }, 1000);
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-2xl transition-all hover:scale-110 active:scale-95 ${isOpen ? 'hidden' : 'bg-primary text-white'}`}
            >
                <MessageSquare className="h-6 w-6" />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        className="fixed bottom-6 right-6 z-50 w-80 md:w-96 bg-card border border-border rounded-3xl shadow-2xl flex flex-col overflow-hidden h-[500px]"
                    >
                        {/* Header */}
                        <div className="bg-primary p-4 flex justify-between items-center text-primary-foreground">
                            <div className="flex items-center gap-2">
                                <div className="bg-white/20 p-1.5 rounded-lg">
                                    <Bot className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm">CoWork Assistant</h3>
                                    <div className="flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                                        <span className="text-[10px] opacity-80">Online</span>
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-full transition-colors">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-secondary/30">
                            {messages.map((msg, i) => (
                                <div key={i} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                                    {msg.isBot && (
                                        <div className="w-6 h-6 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center mr-2 mt-2">
                                            <Bot className="h-3 w-3 text-primary" />
                                        </div>
                                    )}
                                    <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.isBot ? 'bg-card border border-border text-foreground rounded-tl-sm' : 'bg-primary text-primary-foreground rounded-tr-sm'}`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-4 bg-card border-t border-border">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Ask me anything..."
                                    className="flex-1 bg-secondary rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!input.trim()}
                                    className="p-2 bg-primary text-primary-foreground rounded-xl disabled:opacity-50 hover:bg-primary/90 transition-colors"
                                >
                                    <Send className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
