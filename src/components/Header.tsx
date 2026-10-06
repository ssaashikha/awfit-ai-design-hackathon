import React from 'react';
import { Sparkles, ShoppingBag, Search, Camera, Glasses, Heart, SlidersHorizontal } from 'lucide-react';
import { BespokeFitProfile } from '../types';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenScanner: () => void;
  onOpenTryOn: () => void;
  onOpenIris: () => void;
  activeProfile: BespokeFitProfile | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  onOpenCart,
  onOpenScanner,
  onOpenTryOn,
  onOpenIris,
  activeProfile,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
}) => {
  const categories = ['All', 'Corsets & Tops', 'Cargos & Bottoms', 'Dresses', 'Knitwear', 'Outerwear'];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-pink-100 shadow-[0_2px_15px_-4px_rgba(255,182,193,0.15)] transition-all">
      {/* Top Cute Announcement Bar */}
      <div className="bg-gradient-to-r from-pink-500 via-rose-400 to-pink-500 text-white text-xs font-semibold py-1.5 px-4 text-center flex items-center justify-center gap-2 overflow-hidden shadow-inner">
        <span className="inline-block animate-pulse">✨</span>
        <span>Out of your size? Don&apos;t stress! Iris AI scans your body &amp; custom-stitches your exact fit at zero extra cost ♡</span>
        <span className="hidden sm:inline bg-white/20 backdrop-blur-xs px-2 py-0.5 rounded-full text-[10px] tracking-wide uppercase">Free Bespoke Tailoring</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 gap-3 sm:gap-6">
          {/* Logo with Cute Mascot & Typography */}
          <div className="flex items-center gap-3">
            <a href="#" className="group flex items-center gap-2.5">
              <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-400 via-rose-300 to-pink-200 p-0.5 shadow-md shadow-pink-200 group-hover:scale-105 transition-transform flex items-center justify-center">
                <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center relative overflow-hidden">
                  {/* Cute bow / sparkle emblem */}
                  <span className="text-xl select-none group-hover:rotate-12 transition-transform">🎀</span>
                  <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-pink-500 rounded-full flex items-center justify-center">
                    <Sparkles className="w-2 h-2 text-white" />
                  </div>
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-2xl font-extrabold tracking-tight font-['Plus_Jakarta_Sans'] bg-gradient-to-r from-pink-600 via-rose-500 to-pink-500 bg-clip-text text-transparent">
                    aw-fit
                  </span>
                  <span className="text-xs bg-pink-100 text-pink-700 px-1.5 py-0.5 rounded-md font-bold tracking-wider uppercase scale-90">
                    bespoke
                  </span>
                </div>
                <span className="text-[10px] text-zinc-400 font-medium tracking-tight -mt-0.5">
                  made for your body ♡
                </span>
              </div>
            </a>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md relative">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search corsets, viral cargos, custom fits..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-pink-50/50 hover:bg-pink-50/80 focus:bg-white text-sm rounded-full border border-pink-200/80 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent transition placeholder:text-zinc-400"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-zinc-600"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Custom Sizing Scan Button */}
            <button
              onClick={onOpenScanner}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold transition shadow-xs ${
                activeProfile
                  ? 'bg-rose-50 text-rose-700 border border-rose-300 hover:bg-rose-100'
                  : 'bg-zinc-100 hover:bg-pink-50 text-zinc-700 hover:text-pink-600 border border-transparent'
              }`}
              title="Scan body for custom fit measurements"
            >
              <Camera className="w-3.5 h-3.5 text-pink-500" />
              <span className="hidden sm:inline">
                {activeProfile ? 'Custom Fit: Active ♡' : 'Body Scan Sizing'}
              </span>
              <span className="sm:hidden">Scan</span>
            </button>

            {/* Virtual Try-On Studio Button */}
            <button
              onClick={onOpenTryOn}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 transition shadow-xs"
              title="Open Virtual Try-On Studio"
            >
              <span className="text-xs">🪞</span>
              <span className="hidden sm:inline">Virtual Try-On</span>
              <span className="sm:hidden">Try-On</span>
            </button>

            {/* Iris Stylist Chat Button */}
            <button
              onClick={onOpenIris}
              className="relative flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-md shadow-pink-200 hover:shadow-lg hover:shadow-pink-300 hover:scale-102 transition"
            >
              <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
              <span>Iris AI</span>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-100 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
            </button>

            {/* Shopping Bag Button */}
            <button
              onClick={onOpenCart}
              className="relative p-2.5 rounded-full hover:bg-pink-50 text-zinc-700 hover:text-pink-600 transition"
              aria-label="Shopping bag"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-pink-600 text-white rounded-full text-[11px] font-bold flex items-center justify-center shadow-sm animate-bounce-short">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 py-2.5 overflow-x-auto scrollbar-none text-xs border-t border-pink-50">
          <span className="text-zinc-400 font-medium pl-1 flex items-center gap-1">
            <SlidersHorizontal className="w-3 h-3 text-pink-400" />
            Vibe:
          </span>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition cursor-pointer ${
                  isSelected
                    ? 'bg-zinc-900 text-white shadow-xs'
                    : 'bg-white hover:bg-pink-50 text-zinc-600 hover:text-pink-600 border border-zinc-200/60'
                }`}
              >
                {cat}
              </button>
            );
          })}

          {activeProfile && (
            <div className="ml-auto hidden lg:flex items-center gap-1.5 text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200 font-medium text-[11px]">
              <Heart className="w-3 h-3 fill-rose-500 text-rose-500" />
              <span>Bespoke Silhouette: {activeProfile.bodyType} ({activeProfile.measurements.bust}&quot; - {activeProfile.measurements.waist}&quot; - {activeProfile.measurements.hips}&quot;)</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
