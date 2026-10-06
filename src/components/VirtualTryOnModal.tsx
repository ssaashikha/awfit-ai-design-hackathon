import React, { useState, useEffect } from 'react';
import { Product, TryOnModel, BespokeFitProfile } from '../types';
import { PRODUCTS } from '../data/products';
import { TRY_ON_MODELS } from '../data/models';
import {
  X,
  Sparkles,
  Layers,
  SlidersHorizontal,
  Check,
  ShoppingBag,
  Camera,
  RotateCcw,
  Eye,
  Flame,
  ArrowRight
} from 'lucide-react';

interface VirtualTryOnModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProduct?: Product | null;
  onAddToCart: (product: Product, isCustom: boolean) => void;
  activeProfile: BespokeFitProfile | null;
}

export const VirtualTryOnModal: React.FC<VirtualTryOnModalProps> = ({
  isOpen,
  onClose,
  initialProduct,
  onAddToCart,
  activeProfile,
}) => {
  if (!isOpen) return null;

  const [selectedProduct, setSelectedProduct] = useState<Product>(
    initialProduct || PRODUCTS[0]
  );
  const [selectedModel, setSelectedModel] = useState<TryOnModel>(TRY_ON_MODELS[0]);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [tryOnReport, setTryOnReport] = useState<any>(null);

  // Fetch or simulate try-on feedback whenever product or model changes
  useEffect(() => {
    let isMounted = true;
    setIsSimulating(true);

    const runTryOn = async () => {
      try {
        const response = await fetch('/api/virtual-tryon', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productId: selectedProduct.id,
            productName: selectedProduct.name,
            category: selectedProduct.category,
            userMeasurements: activeProfile?.measurements,
            modelPreset: selectedModel.name,
          }),
        });
        const resData = await response.json();
        if (isMounted && resData.success && resData.data) {
          setTryOnReport(resData.data);
        }
      } catch (err) {
        console.warn('Try-on evaluation error:', err);
      } finally {
        if (isMounted) {
          setTimeout(() => setIsSimulating(false), 600);
        }
      }
    };

    runTryOn();

    return () => {
      isMounted = false;
    };
  }, [selectedProduct.id, selectedModel.id, activeProfile]);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div
        className="relative bg-white rounded-3xl max-w-5xl w-full shadow-2xl border border-pink-200 overflow-hidden my-4 animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-500 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🪞</span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base tracking-tight">aw-fit Virtual Try-On Studio</h3>
                <span className="bg-white/20 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                  Drape Engine 2.0
                </span>
              </div>
              <p className="text-xs text-pink-100">
                Visualize how trending items drape on your silhouette before stitching ♡
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 max-h-[82vh] overflow-y-auto">
          {/* Left Column: Try-On Visual Stage */}
          <div className="lg:col-span-7 bg-zinc-950 p-4 sm:p-6 flex flex-col justify-between relative overflow-hidden">
            {/* Visual Canvas */}
            <div className="relative aspect-3/4 max-h-[500px] mx-auto w-full rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 shadow-2xl flex items-center justify-center">
              {/* Model or Try-on Image */}
              <img
                src={showOriginal ? selectedModel.imageUrl : selectedProduct.tryOnImage || selectedProduct.images[0]}
                alt="Try-on visualization"
                className={`w-full h-full object-cover object-top transition-opacity duration-300 ${
                  isSimulating ? 'opacity-50 blur-xs' : 'opacity-100'
                }`}
              />

              {/* Simulation Loading Overlay */}
              {isSimulating && (
                <div className="absolute inset-0 bg-black/50 backdrop-blur-xs flex flex-col items-center justify-center text-white">
                  <Sparkles className="w-8 h-8 text-pink-400 animate-spin-slow mb-2" />
                  <span className="font-bold text-sm">Rendering Fabric Drape...</span>
                  <span className="text-[11px] text-pink-200">Matching contours to {selectedModel.name}</span>
                </div>
              )}

              {/* Fit Tension Heatmap Overlay */}
              {showHeatmap && !isSimulating && (
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/15 to-transparent pointer-events-none flex flex-col justify-around p-6">
                  {/* Tension points */}
                  <div className="flex justify-between items-center bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[11px] text-white border border-emerald-400/40 w-fit mx-auto">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 mr-1.5 animate-pulse"></span>
                    Chest Drape: Zero Tension (100% Ease)
                  </div>
                  <div className="flex justify-between items-center bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[11px] text-white border border-pink-400/50 w-fit mx-auto">
                    <span className="w-2 h-2 rounded-full bg-pink-400 mr-1.5 animate-pulse"></span>
                    Waist Cinch: Bespoke Darted Curve
                  </div>
                  <div className="flex justify-between items-center bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[11px] text-white border border-blue-400/40 w-fit mx-auto">
                    <span className="w-2 h-2 rounded-full bg-blue-400 mr-1.5 animate-pulse"></span>
                    Hip Hem: Relaxed Flare
                  </div>
                </div>
              )}

              {/* Floating Match Badge */}
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md rounded-xl px-2.5 py-1 text-xs font-extrabold text-pink-700 shadow-lg flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-pink-600" />
                <span>{tryOnReport?.matchScore || 96}% Silhouette Match</span>
              </div>

              {/* View toggle badge */}
              <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md text-white rounded-lg px-2 py-1 text-[10px] font-bold">
                {showOriginal ? 'Showing: Baseline Model' : 'Showing: Virtual Garment Drape'}
              </div>
            </div>

            {/* Interactive Canvas Controls */}
            <div className="flex items-center justify-between pt-3 gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowOriginal(!showOriginal)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    showOriginal
                      ? 'bg-white text-zinc-900 shadow-md'
                      : 'bg-zinc-800 text-zinc-300 hover:text-white'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{showOriginal ? 'View Garment' : 'View Before'}</span>
                </button>

                <button
                  onClick={() => setShowHeatmap(!showHeatmap)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    showHeatmap
                      ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md'
                      : 'bg-zinc-800 text-zinc-300 hover:text-white'
                  }`}
                >
                  <Flame className="w-3.5 h-3.5 text-rose-400" />
                  <span>Fit Heatmap</span>
                </button>
              </div>

              <span className="text-[11px] text-zinc-400">
                Model: <strong>{selectedModel.name}</strong> ({selectedModel.bodyType})
              </span>
            </div>
          </div>

          {/* Right Column: Controls, Product Selector, & Iris Stylist Report */}
          <div className="lg:col-span-5 p-6 flex flex-col justify-between space-y-5 bg-white">
            <div className="space-y-4">
              {/* Product Selector Ribbon */}
              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                  1. Choose Garment to Try On:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {PRODUCTS.slice(0, 6).map((prod) => {
                    const isSelected = selectedProduct.id === prod.id;
                    return (
                      <div
                        key={prod.id}
                        onClick={() => setSelectedProduct(prod)}
                        className={`p-2 rounded-xl border text-left cursor-pointer transition flex flex-col items-center ${
                          isSelected
                            ? 'border-pink-500 bg-pink-50 ring-2 ring-pink-300'
                            : 'border-zinc-200 hover:border-zinc-300 bg-zinc-50'
                        }`}
                      >
                        <img
                          src={prod.images[0]}
                          alt={prod.name}
                          className="w-12 h-14 object-cover rounded-lg mb-1"
                        />
                        <span className="text-[10px] font-bold text-zinc-800 truncate w-full text-center">
                          {prod.name}
                        </span>
                        <span className="text-[10px] text-pink-600 font-extrabold">
                          ${prod.price}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Model / Avatar Selector */}
              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                  2. Choose Wearer Avatar / Silhouette:
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {TRY_ON_MODELS.map((mod) => {
                    const isSelected = selectedModel.id === mod.id;
                    return (
                      <div
                        key={mod.id}
                        onClick={() => setSelectedModel(mod)}
                        className={`p-1.5 rounded-xl border text-center cursor-pointer transition ${
                          isSelected
                            ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-300'
                            : 'border-zinc-200 hover:border-zinc-300 bg-zinc-50'
                        }`}
                      >
                        <img
                          src={mod.imageUrl}
                          alt={mod.name}
                          className="w-full aspect-square object-cover rounded-lg mb-1"
                        />
                        <div className="text-[11px] font-bold text-zinc-800">{mod.name}</div>
                        <div className="text-[9px] text-zinc-500 truncate">{mod.bodyType}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Iris Drape Diagnosis & Styling Advice */}
              <div className="bg-gradient-to-r from-purple-50 via-pink-50 to-rose-50 rounded-2xl p-4 border border-pink-100 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🎀</span>
                  <div className="font-extrabold text-xs text-zinc-900">
                    Iris AI Fit &amp; Drape Report:
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-zinc-700">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-zinc-500">Waist Silhouette:</span>
                    <span className="font-bold text-emerald-800">
                      {tryOnReport?.fabricDrape?.waistDefinition || 'Cinched gracefully, zero bunching'}
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-zinc-500">Bust Tension:</span>
                    <span className="font-semibold text-zinc-800">
                      {tryOnReport?.fabricDrape?.bustTension || 'Smooth contour with comfortable ease'}
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-zinc-500">Length Hang:</span>
                    <span className="font-semibold text-zinc-800">
                      {tryOnReport?.fabricDrape?.lengthHang || 'Hits precisely balanced above knee'}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-pink-100 text-[11px] text-pink-900 font-medium leading-relaxed">
                  💡 <strong>Iris Style Tip:</strong> {tryOnReport?.stylingAdvice || `Style this ${selectedProduct.name} with chunky silver chains and platform boots for the viral Pinterest look! ♡`}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-zinc-100 space-y-2">
              <button
                onClick={() => {
                  onAddToCart(selectedProduct, true);
                  onClose();
                }}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-pink-600 via-rose-500 to-pink-600 hover:opacity-95 text-white font-extrabold text-xs shadow-md shadow-pink-200 flex items-center justify-center gap-2 cursor-pointer transition"
              >
                <Sparkles className="w-4 h-4" />
                <span>Add This Look to Bag (Bespoke Custom-Fit) ✨</span>
              </button>

              <button
                onClick={() => {
                  onAddToCart(selectedProduct, false);
                  onClose();
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-zinc-600" />
                <span>Add in Standard Retail Size</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
