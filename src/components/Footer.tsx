import React from 'react';
import { Sparkles, Heart, Scissors, ShieldCheck, RefreshCw, Mail } from 'lucide-react';

interface FooterProps {
  onOpenScanner: () => void;
  onOpenTryOn: () => void;
  onOpenIris: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenScanner,
  onOpenTryOn,
  onOpenIris,
}) => {
  return (
    <footer className="bg-white border-t border-pink-100 mt-16 text-zinc-600 text-xs">
      {/* Upper Promise Section */}
      <div className="bg-gradient-to-r from-pink-50 via-rose-50/50 to-purple-50 py-10 border-b border-pink-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
            <div className="flex flex-col items-center md:items-start gap-2">
              <div className="w-10 h-10 rounded-2xl bg-white shadow-xs flex items-center justify-center text-xl">
                🎀
              </div>
              <h4 className="font-extrabold text-sm text-zinc-900">
                The aw-fit Sizing Revolution
              </h4>
              <p className="text-zinc-500 leading-relaxed text-[11px]">
                Standard brands produce XS-XXL based on an imaginary rigid mannequin. Real bodies have curves, high waists, and unique hip arcs. Iris AI calculates your true proportions so clothes fit you like a glove.
              </p>
            </div>

            <div className="flex flex-col items-center md:items-start gap-2">
              <div className="w-10 h-10 rounded-2xl bg-white shadow-xs flex items-center justify-center text-xl">
                ✂️
              </div>
              <h4 className="font-extrabold text-sm text-zinc-900">
                Custom Tailored at $0 Surcharge
              </h4>
              <p className="text-zinc-500 leading-relaxed text-[11px]">
                Whether a popular size is sold out or you simply demand a bespoke silhouette, our on-demand micro-atelier stitches your piece for the exact same retail price.
              </p>
            </div>

            <div className="flex flex-col items-center md:items-start gap-2">
              <div className="w-10 h-10 rounded-2xl bg-white shadow-xs flex items-center justify-center text-xl">
                🪞
              </div>
              <h4 className="font-extrabold text-sm text-zinc-900">
                Virtual Try-On Confidence
              </h4>
              <p className="text-zinc-500 leading-relaxed text-[11px]">
                Preview fabric drape, waist cinch, and stretch tension before your garments ever touch needle and thread. Shop with 100% confidence.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">🎀</span>
              <span className="text-lg font-black tracking-tight text-zinc-900">aw-fit</span>
            </div>
            <p className="text-[11px] text-zinc-500 leading-relaxed mb-3">
              Fast fashion reimagined for your exact silhouette. Powered by Iris AI Stylist.
            </p>
            <div className="flex gap-2">
              <span className="w-7 h-7 rounded-full bg-pink-50 flex items-center justify-center text-pink-600 font-bold text-xs cursor-pointer hover:bg-pink-100">
                IG
              </span>
              <span className="w-7 h-7 rounded-full bg-pink-50 flex items-center justify-center text-pink-600 font-bold text-xs cursor-pointer hover:bg-pink-100">
                TT
              </span>
              <span className="w-7 h-7 rounded-full bg-pink-50 flex items-center justify-center text-pink-600 font-bold text-xs cursor-pointer hover:bg-pink-100">
                PIN
              </span>
            </div>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 uppercase tracking-wider text-[11px] mb-3">
              Bespoke Studio
            </h5>
            <ul className="space-y-2 text-[11px] text-zinc-500">
              <li>
                <button onClick={onOpenScanner} className="hover:text-pink-600 cursor-pointer">
                  AI Body Silhouette Scan
                </button>
              </li>
              <li>
                <button onClick={onOpenTryOn} className="hover:text-pink-600 cursor-pointer">
                  Virtual Try-On Room
                </button>
              </li>
              <li>
                <button onClick={onOpenIris} className="hover:text-pink-600 cursor-pointer">
                  Ask Iris Stylist
                </button>
              </li>
              <li>
                <span className="text-zinc-400">Zero-Waste Atelier Guide</span>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 uppercase tracking-wider text-[11px] mb-3">
              Customer Care
            </h5>
            <ul className="space-y-2 text-[11px] text-zinc-500">
              <li>Free Fit Alterations</li>
              <li>Track Atelier Order</li>
              <li>Shipping &amp; Delivery</li>
              <li>Easy 30-Day Returns</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 uppercase tracking-wider text-[11px] mb-3">
              VIP Club
            </h5>
            <p className="text-[11px] text-zinc-500 mb-2">
              Get 15% off your first custom fit piece with code <strong className="text-pink-600">AWFITFIRST</strong>.
            </p>
            <div className="flex gap-1.5">
              <input
                type="email"
                placeholder="your.email@vibes.com"
                className="w-full px-3 py-1.5 rounded-xl bg-pink-50/50 border border-pink-200 text-xs focus:outline-none focus:ring-1 focus:ring-pink-400 placeholder:text-zinc-400"
              />
              <button className="px-3 py-1.5 bg-zinc-900 text-white rounded-xl font-bold text-xs hover:bg-zinc-800 shrink-0">
                Join
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-zinc-400 gap-2">
          <span>&copy; {new Date().getFullYear()} aw-fit inc. All rights reserved. Made with ♡ for real bodies.</span>
          <span className="flex items-center gap-1">
            Built with Iris AI • Zero Waist Gap Guarantee
          </span>
        </div>
      </div>
    </footer>
  );
};
