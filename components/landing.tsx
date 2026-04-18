"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { LogIn, Sparkles, Image as ImageIcon, Zap, UploadCloud } from "lucide-react";
import { motion } from "framer-motion";

export function Landing() {
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/auth/url");
      const { url } = await res.json();

      if (url) {
        const AuthWindow = window.open(url, "oauth_popup", "width=600,height=700");
        if (!AuthWindow) alert("Please allow popups for authenticating.");
      }
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === "OAUTH_AUTH_SUCCESS") {
        window.location.reload();
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <div className="min-h-screen flex flex-col relative z-0 overflow-hidden bg-brand-bg text-brand-text-main">
      {/* Background Glow Orbs */}
      <div className="absolute blur-[100px] z-[-1] opacity-40 -top-[100px] -right-[100px] w-[400px] h-[400px] bg-brand-primary rounded-full pointer-events-none" />
      <div className="absolute blur-[100px] z-[-1] opacity-40 -bottom-[100px] -left-[100px] w-[400px] h-[400px] bg-brand-secondary rounded-full pointer-events-none" />
      <div className="absolute blur-[100px] z-[-1] opacity-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-brand-accent rounded-full pointer-events-none" />

      <header className="h-[72px] flex items-center justify-between px-6 lg:px-10 bg-[#0F172A]/80 backdrop-blur-[10px] border-b border-brand-glass-border sticky top-0 z-20">
        <div className="text-[24px] font-[800] tracking-[-0.5px] bg-gradient-to-r from-brand-secondary to-brand-primary bg-clip-text text-transparent flex items-center gap-2">
          Toniro AI
        </div>
        <button 
          className="flex items-center gap-3 px-4 py-2 bg-brand-card border border-brand-glass-border rounded-full hover:bg-white/5 transition-colors text-[14px]"
          onClick={handleGoogleLogin}
          disabled={loading}
        >
          <LogIn className="w-4 h-4" />
          Continue with Google
        </button>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center pt-32 pb-20 px-6 md:px-12 z-10 relative">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h1 className="text-[48px] md:text-[64px] font-bold tracking-tight leading-[1.1] mb-6">
            Perfect Tone. <br/>
            Every Photo.
          </h1>
          <p className="text-[16px] md:text-[18px] text-brand-text-dim mb-10 max-w-2xl mx-auto">
            AI-powered color correction for professional albums in seconds. Upload bulk images, let our AI engine detect the style, and instantly perfect your portfolio.
          </p>

          <button 
            className="px-8 py-4 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-[12px] text-white font-semibold text-[16px] shadow-[0_10px_20px_rgba(108,99,255,0.3)] transition-all hover:scale-[1.02]"
            onClick={handleGoogleLogin}
          >
            Start Enhancing Now
          </button>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 max-w-5xl mx-auto"
        >
          <FeatureCard 
            icon={<UploadCloud className="text-brand-secondary w-5 h-5" />}
            title="Bulk Upload"
            desc="Drag and drop up to 200 images at once. Supports high-res JPG and PNG."
          />
          <FeatureCard 
            icon={<Zap className="text-brand-accent w-5 h-5" />}
            title="Smart Style Apply"
            desc="Auto-detects wedding, portrait, or indoor events."
          />
          <FeatureCard 
            icon={<ImageIcon className="text-brand-primary w-5 h-5" />}
            title="Export Print-Ready"
            desc="Batch download enhanced files in 300 DPI, ready for physical albums."
          />
        </motion.div>
      </main>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="bg-brand-card backdrop-blur-[10px] border border-brand-glass-border p-6 rounded-[16px] transition-all group">
      <div className="mb-4 bg-slate-800/80 w-10 h-10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
        {icon}
      </div>
      <h3 className="text-[13px] font-bold mb-2 text-brand-accent uppercase tracking-[0.05em]">{title}</h3>
      <p className="text-brand-text-dim text-[13px] leading-relaxed">{desc}</p>
    </div>
  );
}
