"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Volume2, VolumeX } from "lucide-react";

export function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <section className="relative min-h-[75vh] sm:min-h-[85vh] lg:min-h-[90vh] flex items-center justify-start overflow-hidden bg-black text-white">
      {/* Background High-Definition Ornamental Aquarium Video - Highly Visible */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          poster="/images/fish/angels-altum-angel.webp"
          className="w-full h-full object-cover object-center filter brightness-[0.95] contrast-[1.05] saturate-[1.1]"
        >
          <source src="/videos/hero-aquarium.mp4" type="video/mp4" />
        </video>

        {/* Minimal subtle darkening scrim so text is crisp while video remains vibrant */}
        <div className="absolute inset-0 bg-black/25" />
      </div>

      {/* Hero Content - Clean & Minimal matching reference */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 w-full py-20">
        <div className="max-w-2xl text-left">
          <h1 className="font-sans text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-white leading-[1.05] drop-shadow-md">
            Curated
            <br />
            Aquatic Standard
          </h1>

          <div className="mt-8 sm:mt-10">
            <Link
              href="/fish"
              className="inline-block px-8 py-3 bg-transparent hover:bg-white text-white hover:text-black border border-white text-xs font-semibold uppercase tracking-widest transition-all duration-200"
            >
              Explore
            </Link>
          </div>
        </div>
      </div>

      {/* Mute toggle button in bottom corner */}
      <div className="absolute bottom-6 right-6 z-20">
        <button
          type="button"
          onClick={toggleMute}
          className="p-2 rounded-full bg-black/40 hover:bg-black/70 text-white/90 hover:text-white transition-colors backdrop-blur-sm border border-white/20"
          aria-label={isMuted ? "Unmute video" : "Mute video"}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>
    </section>
  );
}
