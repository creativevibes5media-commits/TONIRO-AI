"use client";

import { useState, useEffect } from "react";
import { LogIn, Sparkles, Image as ImageIcon, Zap, UploadCloud, Star, Check } from "lucide-react";
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
    <div className="min-h-screen flex flex-col relative z-0 bg-brand-bg text-brand-text-main">
      {/* Background Glow Orbs */}
      <div className="fixed blur-[100px] z-[-1] opacity-40 -top-[100px] -right-[100px] w-[400px] h-[400px] bg-brand-primary rounded-full pointer-events-none" />
      <div className="fixed blur-[100px] z-[-1] opacity-40 -bottom-[100px] -left-[100px] w-[400px] h-[400px] bg-brand-secondary rounded-full pointer-events-none" />
      <div className="fixed blur-[100px] z-[-1] opacity-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-brand-accent rounded-full pointer-events-none" />

      {/* Navigation Header */}
      <header className="h-[72px] flex items-center justify-between px-6 lg:px-10 bg-[#0F172A]/80 backdrop-blur-[10px] border-b border-brand-glass-border fixed top-0 w-full z-50">
        <div className="text-[24px] font-[800] tracking-[-0.5px] bg-gradient-to-r from-brand-secondary to-brand-primary bg-clip-text text-transparent flex items-center gap-2">
          Toniro AI
        </div>
        
        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-8 text-[14px] font-medium text-brand-text-dim">
          <a href="#features" className="hover:text-white transition-colors cursor-pointer">Features</a>
          <a href="#reviews" className="hover:text-white transition-colors cursor-pointer">Reviews</a>
          <a href="#pricing" className="hover:text-white transition-colors cursor-pointer">Pricing</a>
        </nav>

        <button 
          className="flex items-center gap-3 px-4 py-2 bg-brand-card border border-brand-glass-border rounded-full hover:bg-white/5 transition-colors text-[14px]"
          onClick={handleGoogleLogin}
          disabled={loading}
        >
          <LogIn className="w-4 h-4" />
          <span className="hidden sm:inline">Continue with Google</span>
          <span className="sm:hidden">Login</span>
        </button>
      </header>

      <main className="flex-1 flex flex-col pt-32 pb-20 px-6 md:px-12 z-10 relative">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto mt-8 md:mt-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-primary/10 border border-brand-primary/20 rounded-full text-brand-primary text-[12px] font-bold uppercase tracking-wider mb-6">
            <Sparkles className="w-4 h-4" /> Version 2.0 Now Live
          </div>
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
            Start Your 1-Month Free Trial Now
          </button>
          
          {/* Trust Banner / Ratings */}
          <div className="flex items-center justify-center gap-4 mt-8 text-[13px] text-brand-text-dim">
            <div className="flex flex-col sm:flex-row items-center gap-2 bg-brand-card/50 backdrop-blur-md px-5 py-3 rounded-full border border-brand-glass-border">
              <div className="flex gap-1 text-brand-accent">
                {[1, 2, 3, 4, 5].map((i) => <Star key={i} className="w-4 h-4 fill-current" />)}
              </div>
              <span>Trusted by <b>5,000+</b> professional photographers</span>
            </div>
          </div>
        </motion.div>

        {/* Features Section */}
        <section id="features" className="w-full pt-32 scroll-mt-24">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto"
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
        </section>

        {/* Reviews Section */}
        <section id="reviews" className="w-full pt-32 scroll-mt-24 max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-[36px] font-bold text-white mb-4">Loved by Professionals</h2>
            <p className="text-brand-text-dim text-[16px]">See what wedding and portrait studios are saying about Toniro AI.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TestimonialCard 
              name="Sarah Jenkins" 
              role="Wedding Photographer" 
              content="Toniro AI saves me roughly 15 hours per wedding. The colors are instantly matched to my signature style and the skin tones are flawless." 
            />
            <TestimonialCard 
              name="David Miller" 
              role="Portrait Studio" 
              content="The intelligent exposure adjustment combined with the true-to-life color correction is unmatched. My clients instantly noticed the difference." 
            />
            <TestimonialCard 
              name="Elena Rodriguez" 
              role="Event Photographer" 
              content="I loved the generous 1-month free trial, but I knew I needed the lifetime Pro version on day two. This is the ultimate tool for batch processing." 
            />
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="w-full pt-32 pb-20 scroll-mt-24 max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-[36px] font-bold text-white mb-4">Simple, Transparent Pricing</h2>
            <p className="text-brand-text-dim text-[16px]">Start for free, upgrade when you need to process unlimited albums.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <PricingCard 
              title="1 Month Free Trial" 
              price="$0" 
              desc="Try all professional features completely free for 30 days."
              features={["Batch processing up to 200 images", "All AI Enhancement Styles included", "HD Web Export Engine", "Interactive Before/After Preview"]}
              isPro={false}
              onAction={handleGoogleLogin}
            />
            <PricingCard 
              title="Toniro Pro" 
              price="$29" 
              period="/mo"
              desc="Unlimited processing for professional studios and freelancers."
              features={["Unlimited batch processing limit", "Priority cloud processing speed", "Print-ready 4K Archive Export", "Lifetime priority support"]}
              isPro={true}
              onAction={handleGoogleLogin}
            />
          </div>
        </section>

        {/* Footer */}
        <footer className="w-full border-t border-brand-glass-border pt-8 flex flex-col items-center justify-center text-brand-text-dim text-[14px]">
          <div className="flex items-center gap-2 mb-4 text-white font-bold tracking-[-0.5px]">
            <Sparkles className="w-4 h-4 text-brand-primary" /> Toniro AI
          </div>
          <p>© {new Date().getFullYear()} Toniro AI Studio. All rights reserved.</p>
        </footer>
      </main>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="bg-brand-card backdrop-blur-[10px] border border-brand-glass-border p-6 rounded-[16px] transition-all group hover:border-brand-primary/40 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
      <div className="mb-4 bg-slate-800/80 w-10 h-10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg border border-brand-glass-border">
        {icon}
      </div>
      <h3 className="text-[13px] font-bold mb-2 text-brand-accent uppercase tracking-[0.05em]">{title}</h3>
      <p className="text-brand-text-dim text-[13px] leading-relaxed">{desc}</p>
    </div>
  );
}

function TestimonialCard({ name, role, content }: { name: string, role: string, content: string }) {
  return (
    <div className="bg-brand-card backdrop-blur-[10px] border border-brand-glass-border p-8 rounded-[16px] relative">
      <div className="flex gap-1 text-brand-accent mb-4">
        {[1, 2, 3, 4, 5].map((i) => <Star key={i} className="w-4 h-4 fill-current" />)}
      </div>
      <p className="text-white text-[14px] leading-relaxed italic mb-6">"{content}"</p>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center font-bold text-white border border-brand-glass-border">
          {name.charAt(0)}
        </div>
        <div>
          <div className="text-[14px] font-bold text-white">{name}</div>
          <div className="text-[12px] text-brand-text-dim">{role}</div>
        </div>
      </div>
    </div>
  );
}

function PricingCard({ title, price, period, desc, features, isPro, onAction }: { title: string, price: string, period?: string, desc: string, features: string[], isPro: boolean, onAction: () => void }) {
  return (
    <div className={`p-8 rounded-[24px] backdrop-blur-[10px] border transition-all ${isPro ? 'bg-brand-primary/10 border-brand-primary shadow-[0_0_40px_rgba(108,99,255,0.15)] relative transform md:hover:-translate-y-1' : 'bg-brand-card border-brand-glass-border'}`}>
      {isPro && (
        <div className="absolute top-0 right-8 -translate-y-1/2 bg-gradient-to-r from-brand-secondary to-brand-primary text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-lg">
          Most Popular
        </div>
      )}
      <h3 className="text-[20px] font-bold text-white mb-2">{title}</h3>
      <p className="text-brand-text-dim text-[14px] mb-6">{desc}</p>
      <div className="flex items-baseline gap-1 mb-8">
        <span className="text-[48px] font-[800] leading-none text-white tracking-tight">{price}</span>
        {period && <span className="text-brand-text-dim text-[16px] font-medium">{period}</span>}
      </div>
      <ul className="space-y-4 mb-8">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-start gap-3">
            <div className="mt-0.5 w-5 h-5 rounded-full bg-brand-primary/20 flex items-center justify-center flex-shrink-0">
              <Check className="w-3 h-3 text-brand-primary" />
            </div>
            <span className="text-[14px] text-brand-text-dim">{feature}</span>
          </li>
        ))}
      </ul>
      <button 
        onClick={onAction}
        className={`w-full py-4 rounded-[12px] font-semibold text-[15px] transition-all ${isPro ? 'bg-gradient-to-r from-brand-primary to-brand-secondary text-white shadow-lg hover:shadow-xl hover:scale-[1.02]' : 'bg-white/5 border border-brand-glass-border text-white hover:bg-white/10'}`}
      >
        {isPro ? 'Upgrade to Pro' : 'Start Free Trial'}
      </button>
    </div>
  );
}
