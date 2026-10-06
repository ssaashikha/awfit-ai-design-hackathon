import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { BodyScannerModal } from './components/BodyScannerModal';
import { VirtualTryOnModal } from './components/VirtualTryOnModal';
import { IrisChat } from './components/IrisChat';
import { CartDrawer } from './components/CartDrawer';
import { Footer } from './components/Footer';
import { PRODUCTS } from './data/products';
import { Product, SizeOption, BespokeFitProfile, CartItem } from './types';
import { Sparkles, Camera, Check, ShoppingBag, Heart, ArrowUp } from 'lucide-react';

export default function App() {
  const [products] = useState<Product[]>(PRODUCTS);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Sizing & Try-on Modals
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isTryOnOpen, setIsTryOnOpen] = useState(false);
  const [tryOnProduct, setTryOnProduct] = useState<Product | null>(null);
  const [scannerProduct, setScannerProduct] = useState<Product | null>(null);

  // Active Bespoke Profile
  const [activeProfile, setActiveProfile] = useState<BespokeFitProfile | null>(null);

  // Chatbot State
  const [isIrisOpen, setIsIrisOpen] = useState(false);
  const [showIrisBubble, setShowIrisBubble] = useState(true);

  // Cart State
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Filter products by category and search
  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Handle Add to Cart
  const handleAddToCart = (
    product: Product,
    size: SizeOption = 'S',
    color: string = product.colors[0]?.name,
    isCustom: boolean = false
  ) => {
    const cartItemId = `${product.id}-${color}-${isCustom ? 'custom' : size}`;

    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === cartItemId);
      if (existing) {
        return prev.map((item) =>
          item.id === cartItemId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          id: cartItemId,
          productId: product.id,
          product,
          selectedColor: color,
          isCustomMade: isCustom,
          selectedSize: isCustom ? undefined : size,
          customProfile: isCustom ? (activeProfile || undefined) : undefined,
          quantity: 1,
          unitPrice: product.price,
        },
      ];
    });

    showToast(
      isCustom
        ? `✨ Added ${product.name} (Bespoke Tailored) to bag!`
        : `🛍️ Added ${product.name} (Size ${size}) to bag!`
    );
  };

  // Handle Save Profile from Scanner
  const handleSaveProfile = (profile: BespokeFitProfile, autoAddProduct?: Product) => {
    setActiveProfile(profile);
    showToast(`🎀 Bespoke sizing calibrated: ${profile.bodyType} saved!`);

    if (autoAddProduct) {
      handleAddToCart(autoAddProduct, 'S', autoAddProduct.colors[0]?.name, true);
    }
  };

  // Quick custom make trigger from card
  const handleCustomMakeProduct = (product: Product) => {
    setScannerProduct(product);
    setIsScannerOpen(true);
  };

  // Quick try on trigger from card
  const handleTryOnProduct = (product: Product) => {
    setTryOnProduct(product);
    setIsTryOnOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FFFDFB] text-[#1E1B18] flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-zinc-900 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 border border-zinc-700 animate-slide-down">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Header */}
      <Header
        cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenScanner={() => {
          setScannerProduct(null);
          setIsScannerOpen(true);
        }}
        onOpenTryOn={() => {
          setTryOnProduct(products[0]);
          setIsTryOnOpen(true);
        }}
        onOpenIris={() => setIsIrisOpen(true)}
        activeProfile={activeProfile}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* Hero Banner */}
      <HeroBanner
        onOpenScanner={() => {
          setScannerProduct(null);
          setIsScannerOpen(true);
        }}
        onOpenTryOn={() => {
          setTryOnProduct(products[0]);
          setIsTryOnOpen(true);
        }}
        onOpenIris={() => setIsIrisOpen(true)}
      />

      {/* Catalog & Main Store Section */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Section Heading */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-pink-600 uppercase tracking-widest mb-1">
              <span>Viral Drops &amp; Tailored Edits</span>
              <span className="w-1.5 h-1.5 rounded-full bg-pink-400"></span>
              <span>Atelier Collection</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight">
              {selectedCategory === 'All' ? 'Trending Fast Fashion Pieces' : selectedCategory}
            </h2>
          </div>

          {/* Quick Active Silhouette Badge if scanned */}
          {activeProfile ? (
            <div className="bg-pink-50 border border-pink-200 rounded-2xl px-4 py-2 text-xs flex items-center gap-2.5 shadow-xs">
              <span className="text-base">🎀</span>
              <div>
                <div className="font-extrabold text-pink-900">
                  Custom Fit Active: {activeProfile.bodyType}
                </div>
                <div className="text-[11px] text-pink-700">
                  Bust {activeProfile.measurements.bust}&quot; • Waist {activeProfile.measurements.waist}&quot; • Hips {activeProfile.measurements.hips}&quot;
                </div>
              </div>
              <button
                onClick={() => {
                  setScannerProduct(null);
                  setIsScannerOpen(true);
                }}
                className="text-[10px] font-bold text-pink-600 underline ml-1 cursor-pointer"
              >
                Edit
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setScannerProduct(null);
                setIsScannerOpen(true);
              }}
              className="group flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 text-white font-bold text-xs shadow-xs hover:shadow-md transition cursor-pointer self-start sm:self-auto"
            >
              <Camera className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
              <span>Calibrate My Sizing Chart (Free)</span>
            </button>
          )}
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-pink-100 p-8 space-y-3">
            <span className="text-3xl">🔍</span>
            <h3 className="font-bold text-base text-zinc-800">No items match your search</h3>
            <p className="text-xs text-zinc-500">
              Try searching for &quot;corset&quot;, &quot;cargo&quot;, or ask Iris to style you!
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="px-4 py-2 rounded-xl bg-pink-50 text-pink-700 font-bold text-xs hover:bg-pink-100"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                onSelect={(p) => setSelectedProduct(p)}
                onTryOn={(p) => handleTryOnProduct(p)}
                onCustomMake={(p) => handleCustomMakeProduct(p)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Floating Iris Launcher Widget */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2 pointer-events-auto">
        {showIrisBubble && !isIrisOpen && (
          <div className="relative bg-white rounded-2xl p-3 shadow-xl border border-pink-200 text-xs text-zinc-800 max-w-xs animate-bounce-short flex items-start gap-2">
            <span className="text-base select-none">🎀</span>
            <div className="flex-1">
              <span className="font-extrabold text-pink-600 block text-[11px] uppercase tracking-wider">
                Iris AI Assistant
              </span>
              <p className="text-[11px] text-zinc-600 leading-tight">
                Don&apos;t see your size? I can scan your photo &amp; custom-stitch it! ♡
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowIrisBubble(false);
              }}
              className="text-zinc-400 hover:text-zinc-600 text-[10px] p-0.5"
            >
              ✕
            </button>
            <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-white rotate-45 border-r border-b border-pink-200"></div>
          </div>
        )}

        {/* Floating Iris Launcher Button */}
        <button
          onClick={() => {
            setIsIrisOpen(!isIrisOpen);
            setShowIrisBubble(false);
          }}
          className="relative group p-3.5 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white shadow-xl shadow-pink-300 hover:shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
          aria-label="Open Iris AI Stylist"
        >
          <div className="w-6 h-6 flex items-center justify-center font-bold text-lg">
            🎀
          </div>
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full"></span>
        </button>
      </div>

      {/* Footer */}
      <Footer
        onOpenScanner={() => {
          setScannerProduct(null);
          setIsScannerOpen(true);
        }}
        onOpenTryOn={() => {
          setTryOnProduct(products[0]);
          setIsTryOnOpen(true);
        }}
        onOpenIris={() => setIsIrisOpen(true)}
      />

      {/* Product Detail Modal */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={(p, sz, clr, isCustom) => {
          handleAddToCart(p, sz, clr, isCustom);
          setSelectedProduct(null);
        }}
        onOpenTryOn={(p) => {
          setSelectedProduct(null);
          handleTryOnProduct(p);
        }}
        onOpenCustomSizing={(p) => {
          setSelectedProduct(null);
          handleCustomMakeProduct(p);
        }}
        activeProfile={activeProfile}
      />

      {/* Body Scanner & Custom Sizing Studio Modal */}
      <BodyScannerModal
        isOpen={isScannerOpen}
        onClose={() => {
          setIsScannerOpen(false);
          setScannerProduct(null);
        }}
        targetProduct={scannerProduct}
        onSaveProfile={handleSaveProfile}
        currentProfile={activeProfile}
      />

      {/* Virtual Try-On Studio Modal */}
      <VirtualTryOnModal
        isOpen={isTryOnOpen}
        onClose={() => setIsTryOnOpen(false)}
        initialProduct={tryOnProduct || products[0]}
        onAddToCart={(p, isCustom) => {
          handleAddToCart(p, 'S', p.colors[0]?.name, isCustom);
        }}
        activeProfile={activeProfile}
      />

      {/* Iris Chatbot Assistant */}
      <IrisChat
        isOpen={isIrisOpen}
        onClose={() => setIsIrisOpen(false)}
        onOpenScanner={() => {
          setIsIrisOpen(false);
          setIsScannerOpen(true);
        }}
        onOpenTryOn={() => {
          setIsIrisOpen(false);
          setIsTryOnOpen(true);
        }}
        currentProduct={selectedProduct}
        activeProfile={activeProfile}
      />

      {/* Shopping Bag Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={(id, qty) => {
          if (qty <= 0) {
            setCartItems((prev) => prev.filter((i) => i.id !== id));
          } else {
            setCartItems((prev) =>
              prev.map((i) => (i.id === id ? { ...i, quantity: qty } : i))
            );
          }
        }}
        onRemoveItem={(id) => {
          setCartItems((prev) => prev.filter((i) => i.id !== id));
        }}
        onClearCart={() => setCartItems([])}
      />
    </div>
  );
}
