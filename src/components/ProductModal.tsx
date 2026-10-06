import React, { useState } from 'react';
import { Product, SizeOption, BespokeFitProfile } from '../types';
import { X, Sparkles, Check, Heart, ShieldCheck, Truck, RefreshCw, Scissors, ChevronRight } from 'lucide-react';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, size: SizeOption, color: string, isCustom: boolean) => void;
  onOpenTryOn: (product: Product) => void;
  onOpenCustomSizing: (product: Product) => void;
  activeProfile: BespokeFitProfile | null;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onOpenTryOn,
  onOpenCustomSizing,
  activeProfile,
}) => {
  if (!product) return null;

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || '');
  const [selectedSize, setSelectedSize] = useState<SizeOption>(() => {
    // Pick first in-stock size or XS
    const sizes: SizeOption[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
    const available = sizes.find((s) => product.stockBySize[s] > 0);
    return available || 'S';
  });

  const isCurrentSizeSoldOut = product.stockBySize[selectedSize] === 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div
        className="relative bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-pink-100 overflow-hidden my-6 animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-zinc-600 hover:text-zinc-900 shadow-md backdrop-blur-md flex items-center justify-center transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left: Images */}
          <div className="bg-zinc-50 p-4 sm:p-6 flex flex-col gap-3">
            <div className="relative aspect-3/4 rounded-2xl overflow-hidden bg-zinc-200 shadow-inner">
              <img
                src={product.images[selectedImage] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover object-top"
              />

              {/* Try on floating badge */}
              <button
                onClick={() => onOpenTryOn(product)}
                className="absolute bottom-3 right-3 bg-purple-600/90 hover:bg-purple-700 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-md shadow-lg flex items-center gap-1.5 transition cursor-pointer"
              >
                <span>🪞</span>
                <span>Launch Virtual Try-On</span>
              </button>
            </div>

            {/* Thumbnail selector */}
            <div className="flex gap-2.5 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-16 h-20 rounded-xl overflow-hidden border-2 transition shrink-0 ${
                    selectedImage === idx ? 'border-pink-500 scale-95 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="thumb" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Product Details & Custom Tailoring */}
          <div className="p-6 sm:p-8 flex flex-col justify-between max-h-[85vh] overflow-y-auto">
            <div className="space-y-4">
              {/* Category & Tags */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-pink-600 bg-pink-50 px-2 py-0.5 rounded-md">
                  {product.category}
                </span>
                {product.tags.map((t) => (
                  <span key={t} className="text-[11px] font-bold text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-md">
                    {t}
                  </span>
                ))}
              </div>

              {/* Title & Price */}
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-zinc-900 leading-snug">
                  {product.name}
                </h2>
                <div className="flex items-baseline gap-3 mt-2">
                  <span className="text-2xl font-black text-zinc-900">${product.price}</span>
                  <span className="text-sm text-zinc-400 line-through">${product.originalPrice}</span>
                  <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
                    Save ${product.originalPrice - product.price}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-zinc-600 leading-relaxed">
                {product.description}
              </p>

              {/* Color Selection */}
              <div>
                <div className="text-xs font-bold text-zinc-800 uppercase tracking-wider mb-2">
                  Color: <span className="text-pink-600 font-semibold">{selectedColor}</span>
                </div>
                <div className="flex items-center gap-2">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c.name)}
                      className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition cursor-pointer ${
                        selectedColor === c.name
                          ? 'border-pink-500 bg-pink-50 text-pink-900 shadow-xs'
                          : 'border-zinc-200 hover:border-zinc-300 text-zinc-700'
                      }`}
                    >
                      <span className="w-3.5 h-3.5 rounded-full shadow-inner" style={{ backgroundColor: c.hex }} />
                      <span>{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Standard Size Selection */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-zinc-800 uppercase tracking-wider mb-2">
                  <span>Standard Off-The-Rack Sizes:</span>
                  <button
                    onClick={() => onOpenCustomSizing(product)}
                    className="text-pink-600 hover:text-pink-700 font-semibold lowercase underline flex items-center gap-0.5 cursor-pointer"
                  >
                    <span>custom size scanner</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="grid grid-cols-6 gap-1.5">
                  {(['XS', 'S', 'M', 'L', 'XL', 'XXL'] as SizeOption[]).map((sz) => {
                    const inStock = product.stockBySize[sz] > 0;
                    const isSelected = selectedSize === sz;
                    return (
                      <button
                        key={sz}
                        onClick={() => setSelectedSize(sz)}
                        className={`py-2 text-center rounded-xl font-bold text-xs transition cursor-pointer relative ${
                          isSelected
                            ? 'bg-zinc-900 text-white ring-2 ring-pink-400'
                            : inStock
                            ? 'bg-zinc-100 hover:bg-zinc-200 text-zinc-800'
                            : 'bg-rose-50 text-rose-300 line-through border border-dashed border-rose-200'
                        }`}
                      >
                        {sz}
                        {!inStock && (
                          <span className="absolute -top-1.5 -right-1 w-2 h-2 rounded-full bg-rose-500" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sizing Status Box: Out of Stock or Custom Fit Opportunity */}
              {isCurrentSizeSoldOut ? (
                <div className="bg-gradient-to-r from-rose-50 via-pink-50 to-purple-50 rounded-2xl p-4 border border-rose-200 space-y-2">
                  <div className="flex items-center gap-2 text-rose-700 font-extrabold text-xs">
                    <span className="text-base">🎀</span>
                    <span>Standard Size &ldquo;{selectedSize}&rdquo; is currently sold out!</span>
                  </div>
                  <p className="text-xs text-zinc-600 leading-normal">
                    Don&apos;t worry! With <strong className="text-zinc-900">aw-fit atelier</strong>, our AI assistant Iris can custom-tailor this piece to your exact body measurements for the exact same price (${product.price}).
                  </p>
                  <button
                    onClick={() => onOpenCustomSizing(product)}
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-700 hover:to-rose-600 text-white font-extrabold text-xs shadow-md shadow-pink-200 flex items-center justify-center gap-2 cursor-pointer transition"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Custom-Make Size {selectedSize} with Iris ♡</span>
                  </button>
                </div>
              ) : activeProfile ? (
                <div className="bg-emerald-50 rounded-2xl p-3 border border-emerald-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-emerald-200 text-emerald-800 flex items-center justify-center font-bold">
                      ✓
                    </div>
                    <div>
                      <div className="font-bold text-emerald-900">
                        Bespoke Silhouette Ready: {activeProfile.bodyType}
                      </div>
                      <div className="text-emerald-700 text-[11px]">
                        Bust: {activeProfile.measurements.bust}&quot; • Waist: {activeProfile.measurements.waist}&quot; • Hips: {activeProfile.measurements.hips}&quot;
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}

              {/* Garment Details & Fabric */}
              <div className="pt-2 border-t border-zinc-100 text-xs space-y-2 text-zinc-600">
                <div className="font-bold text-zinc-800 uppercase tracking-wider text-[11px]">
                  Garment Features:
                </div>
                <ul className="list-disc pl-4 space-y-1 text-[11px]">
                  {product.details.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                  <li><strong>Fabric:</strong> {product.fabric}</li>
                  <li><strong>Care:</strong> {product.care}</li>
                </ul>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-pink-100 space-y-2.5">
              <div className="grid grid-cols-2 gap-2">
                {/* Add Standard Size to Bag (only if in stock) */}
                <button
                  disabled={isCurrentSizeSoldOut}
                  onClick={() => onAddToCart(product, selectedSize, selectedColor, false)}
                  className={`py-3 px-4 rounded-2xl font-bold text-xs transition flex items-center justify-center gap-2 ${
                    isCurrentSizeSoldOut
                      ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
                      : 'bg-zinc-900 hover:bg-zinc-800 text-white cursor-pointer shadow-md'
                  }`}
                >
                  <span>Add Standard ({selectedSize})</span>
                </button>

                {/* Custom-Make Bespoke Piece */}
                <button
                  onClick={() => {
                    if (activeProfile) {
                      onAddToCart(product, selectedSize, selectedColor, true);
                    } else {
                      onOpenCustomSizing(product);
                    }
                  }}
                  className="py-3 px-4 rounded-2xl font-extrabold text-xs bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 hover:opacity-95 text-white shadow-md shadow-pink-200 flex items-center justify-center gap-2 cursor-pointer transition"
                >
                  <Scissors className="w-3.5 h-3.5" />
                  <span>
                    {activeProfile ? 'Add Bespoke Custom-Fit ♡' : 'Custom-Make My Size ✨'}
                  </span>
                </button>
              </div>

              {/* Guarantees */}
              <div className="flex items-center justify-around text-[10px] text-zinc-500 pt-1">
                <span className="flex items-center gap-1">
                  <Truck className="w-3 h-3 text-pink-500" /> Free express over $50
                </span>
                <span className="flex items-center gap-1">
                  <Scissors className="w-3 h-3 text-pink-500" /> Tailored in 48 hrs
                </span>
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-pink-500" /> Perfect-Fit Guarantee
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
