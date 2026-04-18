"use client";

import { useState, useCallback, useRef } from "react";
import { useDropzone } from "react-dropzone";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, UploadCloud, Images, Wand2, DownloadCloud, Loader2, User, ChevronRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";

type PhotoStyle = "Auto" | "Wedding" | "Birthday" | "Pre-wedding" | "Portrait";

interface Photo {
  id: string;
  file: File;
  previewUrl: string;
  enhancedBlob?: Blob;
  enhancedUrl?: string;
  status: "pending" | "processing" | "done";
  detectedStyle?: PhotoStyle;
}

export function Dashboard({ user }: { user: any }) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [globalStyle, setGlobalStyle] = useState<PhotoStyle>("Auto");
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewPhoto, setPreviewPhoto] = useState<Photo | null>(null);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.reload();
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newPhotos = acceptedFiles.map((file) => ({
      id: Math.random().toString(36).substring(7),
      file,
      previewUrl: URL.createObjectURL(file),
      status: "pending" as const,
    }));
    setPhotos((prev) => [...prev, ...newPhotos]);
    toast.success(`Added ${acceptedFiles.length} photos.`);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpeg", ".jpg"],
      "image/png": [".png"],
    },
  });

  const getFilterForStyle = (style: PhotoStyle) => {
    switch (style) {
      case "Wedding":
        return "sepia(0.2) contrast(1.1) brightness(1.05) saturate(1.1)";
      case "Birthday":
        return "saturate(1.3) brightness(1.1) contrast(1.05)";
      case "Pre-wedding":
        return "contrast(1.05) saturate(0.9) brightness(1.1) sepia(0.1)";
      case "Portrait":
        return "brightness(1.05) contrast(1.1) saturate(1.05)";
      default:
        // 'Auto' basically chooses a random good one or defaults
        return "contrast(1.15) brightness(1.1) saturate(1.2)";
    }
  };

  const processPhoto = async (photo: Photo): Promise<Photo> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return resolve(photo);

        const appliedStyle = globalStyle === "Auto" 
          ? (["Wedding", "Birthday", "Portrait"][Math.floor(Math.random() * 3)] as PhotoStyle) 
          : globalStyle;

        ctx.filter = getFilterForStyle(appliedStyle);
        ctx.drawImage(img, 0, 0);

        canvas.toBlob((blob) => {
          if (blob) {
            resolve({
              ...photo,
              status: "done",
              detectedStyle: appliedStyle,
              enhancedBlob: blob,
              enhancedUrl: URL.createObjectURL(blob),
            });
          } else {
            resolve({ ...photo, status: "pending" });
          }
        }, "image/jpeg", 0.95);
      };
      img.src = photo.previewUrl;
    });
  };

  const startProcessing = async () => {
    if (photos.length === 0) return;
    setProcessing(true);
    setProgress(0);

    const updated = [...photos];
    for (let i = 0; i < updated.length; i++) {
        const p = updated[i];
        if (p.status === "done") continue;
        
        updated[i] = { ...updated[i], status: "processing" };
        setPhotos([...updated]);

        // Fake processing delay for UX (AI modeling time)
        await new Promise((r) => setTimeout(r, 600));

        const enhanced = await processPhoto(p);
        updated[i] = enhanced;
        setPhotos([...updated]);
        setProgress(Math.round(((i + 1) / updated.length) * 100));
    }

    setProcessing(false);
    toast.success("Enhancement Complete", {
      description: `Successfully enhanced all ${photos.length} images.`,
    });
  };

  const handleDownloadZip = async () => {
    const zip = new JSZip();
    const folder = zip.folder("Toniro_AI_Enhanced");
    if (!folder) return;

    photos.forEach((p, idx) => {
      if (p.enhancedBlob) {
        folder.file(`enhanced_${p.file.name}`, p.enhancedBlob);
      }
    });

    toast.info("Generating ZIP file...");
    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, "Toniro_AI_Photos.zip");
    toast.success("Download started!");
  };

  const openPreview = (photo: Photo) => {
    if (photo.status !== "done") return;
    setPreviewPhoto(photo);
    setShowPreviewModal(true);
  };

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text-main flex flex-col relative z-0 overflow-hidden">
      {/* Background Glow Orbs */}
      <div className="absolute blur-[100px] z-[-1] opacity-40 -top-[100px] -right-[100px] w-[400px] h-[400px] bg-brand-primary rounded-full pointer-events-none" />
      <div className="absolute blur-[100px] z-[-1] opacity-40 -bottom-[100px] -left-[100px] w-[400px] h-[400px] bg-brand-secondary rounded-full pointer-events-none" />
      <div className="absolute blur-[100px] z-[-1] opacity-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-brand-accent rounded-full pointer-events-none" />

      <header className="h-[72px] flex items-center justify-between px-6 lg:px-10 bg-[#0F172A]/80 backdrop-blur-[10px] border-b border-brand-glass-border sticky top-0 z-20">
        <div className="text-[24px] font-[800] tracking-[-0.5px] bg-gradient-to-r from-brand-secondary to-brand-primary bg-clip-text text-transparent flex items-center gap-2">
          Toniro AI
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 px-4 py-1.5 bg-brand-card border border-brand-glass-border rounded-full">
            {user?.picture ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.picture} alt="User" className="w-7 h-7 rounded-full" />
            ) : (
              <div className="w-7 h-7 rounded-full bg-slate-600 flex items-center justify-center text-[10px]">JD</div>
            )}
            <span className="text-[14px] hidden md:inline-block">{user?.name}</span>
          </div>
          <button onClick={handleLogout} className="text-brand-text-dim hover:text-white transition-colors">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-[1440px] w-full mx-auto p-6 lg:p-8 xl:p-[32px_40px] grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6 xl:gap-[24px]">
        
        {/* Left Sidebar Control */}
        <aside className="space-y-6 flex flex-col">
          <div className="bg-brand-card backdrop-blur-[10px] border border-brand-glass-border rounded-[16px] p-6 shadow-xl flex-1 flex flex-col">
            <h2 className="text-[38px] font-bold leading-[1.1] mb-2 text-white">
              Perfect Tone.<br/>Every Photo.
            </h2>
            <p className="text-brand-text-dim text-[16px] mb-6">
              AI-powered color correction for professional albums in seconds.
            </p>
            
            <div className="space-y-4 mb-auto">
              <div>
                <label className="text-sm font-medium mb-3 block text-brand-text-dim">Target Style</label>
                <div className="grid gap-2">
                  {["Auto", "Wedding", "Birthday", "Pre-wedding", "Portrait"].map((style) => (
                    <button
                      key={style}
                      onClick={() => setGlobalStyle(style as PhotoStyle)}
                      className={`text-left px-4 py-3 rounded-xl border text-[14px] transition-all ${
                        globalStyle === style 
                          ? "bg-brand-primary/20 border-brand-primary text-brand-primary font-medium" 
                          : "bg-white/5 border-brand-glass-border text-brand-text-main hover:bg-white/10"
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 border-t border-brand-glass-border pt-6">
              <button 
                className="w-full p-4 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-xl text-white font-semibold text-[16px] shadow-[0_10px_20px_rgba(108,99,255,0.3)] transition-all hover:scale-[1.02] flex justify-center items-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={startProcessing}
                disabled={processing || photos.length === 0}
              >
                {processing ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Wand2 className="w-5 h-5 mr-2" />}
                {processing ? "Processing..." : "Auto Color AI Engine"}
              </button>

              {photos.some(p => p.status === "done") && (
                <button 
                  className="w-full mt-3 p-3 bg-white/5 border border-brand-glass-border rounded-full text-[14px] text-white hover:bg-white/10 transition-colors flex justify-center items-center cursor-pointer"
                  onClick={handleDownloadZip}
                >
                  <DownloadCloud className="w-4 h-4 mr-2" /> Batch Export .ZIP
                </button>
              )}
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <section className="space-y-6 flex flex-col min-w-0">
          <div 
            {...getRootProps()} 
            className={`bg-brand-card backdrop-blur-[20px] border-2 border-dashed rounded-[20px] p-[40px_24px] text-center transition-all cursor-pointer flex flex-col justify-center items-center ${
              isDragActive ? "border-brand-primary bg-brand-primary/10" : "border-brand-glass-border hover:bg-white/5"
            }`}
          >
            <input {...getInputProps()} />
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-brand-secondary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-3">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            <span className="text-brand-text-dim text-[14px] mb-2 block">Drag & Drop photos here</span>
            <p className="text-[12px] text-brand-text-dim">Support: JPG, PNG (or click to browse)</p>
          </div>

          <AnimatePresence>
            {processing && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-brand-card border border-slate-800 p-6 rounded-2xl"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-brand-secondary">AI Processing in progress...</span>
                  <span className="text-sm text-slate-400">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2 bg-slate-800" />
                <p className="text-xs text-slate-500 mt-3 flex items-center gap-2">
                  <Loader2 className="w-3 h-3 animate-spin" /> Adjusting exposure, mapping skin tones, removing color casts...
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {photos.length > 0 && (
            <div>
              <h3 className="font-medium text-slate-300 mb-4 flex items-center gap-2">
                Uploaded Files ({photos.length}) 
                <span className="text-xs ml-auto text-slate-500">Click a processed image to compare</span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {photos.map((photo) => (
                  <motion.div
                    key={photo.id}
                    layout // Animate sorting/changes ideally
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`relative aspect-square rounded-xl overflow-hidden border ${
                      photo.status === "done" ? "border-green-500/50 cursor-pointer" : "border-brand-glass-border"
                    }`}
                    onClick={() => openPreview(photo)}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={photo.enhancedUrl || photo.previewUrl} 
                      alt="upload" 
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Status overlay */}
                    <div className="absolute inset-0 flex flex-col justify-end p-2 bg-gradient-to-t from-[#0F172A]/80 to-transparent">
                      {photo.status === "processing" ? (
                        <div className="flex items-center justify-center p-2">
                           <Loader2 className="w-6 h-6 text-brand-primary animate-spin" />
                        </div>
                      ) : photo.status === "done" ? (
                        <div className="flex justify-between items-end">
                          <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded backdrop-blur">Enhanced</span>
                          {photo.detectedStyle && globalStyle === "Auto" && (
                            <span className="text-[10px] bg-brand-primary/20 text-brand-primary px-2 py-0.5 rounded backdrop-blur">
                              {photo.detectedStyle}
                            </span>
                          )}
                        </div>
                      ) : null}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </section>
      </main>

      <Dialog open={showPreviewModal} onOpenChange={setShowPreviewModal}>
        <DialogContent className="max-w-4xl bg-brand-card backdrop-blur-xl border-brand-glass-border p-0 overflow-hidden">
           <DialogHeader className="p-6 pb-2">
             <DialogTitle className="text-white text-xl">Before & After Comparison</DialogTitle>
             <DialogDescription className="text-brand-text-dim">
               Interactive preview of AI enhancements
             </DialogDescription>
           </DialogHeader>
           {previewPhoto && (
             <div className="p-6 pt-0">
               <BeforeAfterSlider 
                 before={previewPhoto.previewUrl} 
                 after={previewPhoto.enhancedUrl!} 
               />
             </div>
           )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function BeforeAfterSlider({ before, after }: { before: string, after: string }) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    setSliderPosition(percent);
  };

  const onMouseMove = (e: React.MouseEvent) => handleMove(e.clientX);
  const onTouchMove = (e: React.TouchEvent) => handleMove(e.touches[0].clientX);

  return (
    <div 
      className="relative w-full aspect-video rounded-[24px] overflow-hidden cursor-ew-resize select-none bg-[#1E293B] border border-brand-glass-border"
      ref={containerRef}
      onMouseMove={onMouseMove}
      onTouchMove={onTouchMove}
      onMouseLeave={() => setSliderPosition(50)}
    >
      {/* After Image (Enhanced) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={after} alt="After" className="absolute inset-0 w-full h-full object-contain pointer-events-none" />

      {/* Before Image (Original) - clipped */}
      <div 
        className="absolute inset-0 overflow-hidden" 
        style={{ width: `${sliderPosition}%` }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={before} 
          alt="Before" 
          className="absolute inset-0 w-full h-full object-contain max-w-none pointer-events-none" 
          style={{ width: '100%', minWidth: '100%' }}
        />
      </div>

      <div 
        className="absolute inset-0 pointer-events-none"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={before} alt="Before" className="w-full h-full object-contain pointer-events-none" />
      </div>

      {/* Slider Divider */}
      <div 
        className="absolute top-0 bottom-0 w-1 bg-brand-accent shadow-[0_0_15px_rgba(255,179,71,1)] pointer-events-none z-10"
        style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 bg-brand-accent rounded-full flex items-center justify-center text-black font-bold shadow-lg">
          ↔
        </div>
      </div>

      <div className="absolute bottom-4 left-4 bg-black/50 text-white/50 text-[12px] px-3 py-1 font-bold tracking-widest rounded backdrop-blur">
        ORIGINAL
      </div>
      <div className="absolute bottom-4 right-4 bg-gradient-to-r from-[#4C51BF] via-[#6B46C1] to-[#D69E2E] text-white/80 text-[12px] px-3 py-1 font-bold tracking-widest rounded">
        ENHANCED
      </div>
    </div>
  );
}
