import React from 'react';
import { Sparkles, Camera, ArrowRight, ShieldCheck, Scissors, HeartHandshake } from 'lucide-react';

interface HeroBannerProps {
  onOpenScanner: () => void;
  onOpenTryOn: () => void;
  onOpenIris: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onOpenScanner,
  onOpenTryOn,
  onOpenIris,
}) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-[#FFF5F7] via-[#FFF9FA] to-[#FDF4FF] border-b border-pink-100/80">
      {/* Decorative cute subtle blobs */}
      <div className="absolute top-0 right-10 w-96 h-96 bg-pink-200/30 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-purple-200/25 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Copy & CTAs */}
          <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-pink-200 shadow-xs text-xs font-bold text-pink-700">
              <span className="text-sm">🎀</span>
              <span>Next-Gen Fast Fashion Atelier</span>
              <span className="w-1.5 h-1.5 rounded-full bg-pink-400"></span>
              <span className="text-zinc-500 font-normal">No More Sold-Out Heartbreak</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-900 leading-[1.15]">
              Wear clothes made for{' '}
              <span className="bg-gradient-to-r from-pink-600 via-rose-500 to-purple-600 bg-clip-text text-transparent">
                YOUR body
              </span>
              , not the rack ♡
            </h1>

            <p className="text-base sm:text-lg text-zinc-600 max-w-2xl leading-relaxed">
              Tired of pants gaping at the waist, corsets digging in, or your size always being out of stock?
              Meet <strong className="text-zinc-900 font-semibold">Iris</strong>: our AI stylist scans your photo, generates your calibrated sizing chart, and <span className="underline decoration-pink-300 decoration-2 underline-offset-2">custom-stitches any piece</span> to your exact measurements.
            </p>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
              <button
                onClick={onOpenScanner}
                className="group flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-pink-600 to-rose-500 text-white font-bold text-sm shadow-md shadow-pink-200 hover:shadow-xl hover:shadow-pink-300 hover:-translate-y-0.5 transition cursor-pointer"
              >
                <Camera className="w-4 h-4 text-pink-100 group-hover:rotate-12 transition-transform" />
                <span>Scan My Silhouette (Free)</span>
                <ArrowRight className="w-4 h-4 text-pink-200 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onOpenTryOn}
                className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-white hover:bg-pink-50 text-zinc-800 hover:text-pink-600 font-bold text-sm border border-pink-200 shadow-xs hover:border-pink-300 transition cursor-pointer"
              >
                <span>🪞</span>
                <span>Launch Virtual Try-On</span>
              </button>

              <button
                onClick={onOpenIris}
                className="flex items-center gap-1.5 px-4 py-3.5 rounded-2xl bg-pink-100/70 hover:bg-pink-100 text-pink-800 font-bold text-sm transition cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-pink-600" />
                <span>Chat with Iris</span>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-pink-100 text-left">
              <div className="flex items-start gap-2">
                <div className="w-7 h-7 rounded-xl bg-pink-100 flex items-center justify-center shrink-0 mt-0.5">
                  <Scissors className="w-3.5 h-3.5 text-pink-600" />
                </div>
                <div>
                  <div className="text-xs font-bold text-zinc-800">Zero Extra Cost</div>
                  <div className="text-[11px] text-zinc-500">Custom tailored same price as off-rack</div>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <div className="w-7 h-7 rounded-xl bg-purple-100 flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                </div>
                <div>
                  <div className="text-xs font-bold text-zinc-800">Zero Waist Gap</div>
                  <div className="text-[11px] text-zinc-500">Curved darts shaped to your spine</div>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <div className="w-7 h-7 rounded-xl bg-rose-100 flex items-center justify-center shrink-0 mt-0.5">
                  <HeartHandshake className="w-3.5 h-3.5 text-rose-600" />
                </div>
                <div>
                  <div className="text-xs font-bold text-zinc-800">Fit Guarantee</div>
                  <div className="text-[11px] text-zinc-500">Free adjustments if not 100% in love</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Card Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-sm sm:max-w-md">
              {/* Backglow */}
              <div className="absolute inset-0 bg-gradient-to-tr from-pink-400/20 to-purple-400/20 rounded-3xl transform rotate-2 scale-102"></div>

              {/* Main Card */}
              <div className="relative bg-white rounded-3xl p-4 shadow-xl border border-pink-100 space-y-3">
                <div className="relative h-72 sm:h-80 rounded-2xl overflow-hidden bg-zinc-100">
                  <img
                    src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80"
                    alt="aw-fit model tryon"
                    className="w-full h-full object-cover object-top"
                  />
                  {/* Floating AI Body Scan Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-4 text-white">
                    <div className="flex items-center justify-between text-xs font-bold mb-1">
                      <span className="flex items-center gap-1 bg-pink-500/90 backdrop-blur-xs px-2 py-0.5 rounded-full">
                        <Sparkles className="w-3 h-3" /> Iris AI Scan Active
                      </span>
                      <span className="bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-full text-[10px]">
                        98% Fit Accuracy
                      </span>
                    </div>

                    <div className="bg-white/15 backdrop-blur-md rounded-xl p-2.5 text-xs border border-white/20 space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-pink-200">Silhouette:</span>
                        <span className="font-semibold text-white">Hourglass Curve (Waist: 26&quot;, Hip: 37&quot;)</span>
                      </div>
                      <div className="flex justify-between text-[11px]">
                        <span className="text-pink-200">Standard Retail Flaw:</span>
                        <span className="font-medium text-rose-200">Size M gaps 2.2&quot; at waist</span>
                      </div>
                      <div className="text-[11px] font-semibold text-emerald-300 flex items-center gap-1">
                        ✓ Solution: Custom Back-Contour Stitch applied!
                      </div>
                    </div>
                  </div>

                  {/* Cute floating badge */}
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md text-pink-700 text-xs font-extrabold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                    <span>🎀</span>
                    <span>Sold Out in M? We Custom-Stitch It!</span>
                  </div>
                </div>

                {/* Bottom preview strip */}
                <div className="flex items-center justify-between pt-1 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center font-bold text-pink-600 text-sm">
                      ✨
                    </div>
                    <div>
                      <div className="font-bold text-zinc-900">Cyber Ballet Corset</div>
                      <div className="text-zinc-500 text-[11px]">Bespoke tailored in 48 hours</div>
                    </div>
                  </div>

                  <button
                    onClick={onOpenScanner}
                    className="px-3 py-1.5 rounded-xl bg-pink-50 hover:bg-pink-100 text-pink-700 font-bold text-xs border border-pink-200 transition"
                  >
                    Try My Size →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
