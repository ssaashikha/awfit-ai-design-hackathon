import React, { useState } from 'react';
import { CartItem } from '../types';
import {
  X,
  Trash2,
  Plus,
  Minus,
  Sparkles,
  Scissors,
  ShieldCheck,
  ArrowRight,
  ShoppingBag,
  CheckCircle2,
  Tag
} from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (cartItemId: string, newQty: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [promoMessage, setPromoMessage] = useState<string | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const discountAmount = (subtotal * appliedDiscount) / 100;
  const shipping = subtotal > 50 || subtotal === 0 ? 0 : 5.99;
  const total = Math.max(0, subtotal - discountAmount + shipping);

  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (code === 'AWFITFIRST') {
      setAppliedDiscount(15);
      setPromoMessage('✨ 15% First Order VIP discount applied!');
    } else if (code === 'IRIS') {
      setAppliedDiscount(10);
      setPromoMessage('🎀 Iris Atelier VIP 10% discount applied!');
    } else {
      setPromoMessage('Invalid code. Try "AWFITFIRST" or "IRIS" ♡');
    }
  };

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      setOrderComplete(true);
      onClearCart();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
      <div
        className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-slide-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-pink-100 flex items-center justify-between bg-gradient-to-r from-pink-50 via-white to-pink-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center font-bold">
              🎀
            </div>
            <div>
              <h3 className="font-extrabold text-base text-zinc-900">Your Shopping Bag</h3>
              <p className="text-xs text-zinc-500">{items.length} items selected</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-zinc-100 text-zinc-500 hover:text-zinc-800 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Meter */}
        <div className="px-5 py-2.5 bg-pink-50/70 border-b border-pink-100 text-xs text-zinc-700">
          {subtotal >= 50 ? (
            <div className="text-emerald-700 font-bold flex items-center gap-1.5">
              <span>🎉</span>
              <span>You unlocked FREE Express Atelier Shipping!</span>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span>Add <strong>${(50 - subtotal).toFixed(2)}</strong> for Free Express Delivery</span>
                <span className="font-bold text-pink-600">${subtotal.toFixed(0)} / $50</span>
              </div>
              <div className="w-full bg-pink-200/60 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-pink-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (subtotal / 50) * 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Order Success State */}
        {orderComplete ? (
          <div className="flex-1 p-6 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <h4 className="font-black text-xl text-zinc-900">Order Confirmed! ♡</h4>
              <p className="text-xs text-zinc-500 max-w-xs">
                Your bespoke pattern has been sent directly to our tailoring team. Zero waist gap guaranteed!
              </p>
            </div>

            <div className="w-full bg-pink-50 rounded-2xl p-4 border border-pink-200 text-left text-xs space-y-2">
              <div className="font-bold text-pink-900 flex items-center gap-1.5">
                <Scissors className="w-3.5 h-3.5" />
                <span>aw-fit Atelier Production Timeline:</span>
              </div>
              <div className="space-y-1.5 text-[11px] text-zinc-600">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>Day 1: Iris AI laser pattern cut</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>Day 2: Bespoke stitch &amp; contour check</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-pink-400"></span>
                  <span>Day 3: Express dispatch to your doorstep</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setOrderComplete(false);
                onClose();
              }}
              className="w-full py-3 rounded-2xl bg-zinc-900 text-white font-bold text-xs hover:bg-zinc-800 transition cursor-pointer"
            >
              Continue Shopping ♡
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="flex-1 p-6 flex flex-col items-center justify-center text-center space-y-3 text-zinc-500">
            <div className="w-16 h-16 rounded-full bg-pink-50 flex items-center justify-center text-2xl">
              🛍️
            </div>
            <h4 className="font-bold text-base text-zinc-800">Your bag is empty</h4>
            <p className="text-xs text-zinc-500 max-w-xs">
              Explore our trending drops or ask Iris to custom-make a bespoke fit for you!
            </p>
          </div>
        ) : (
          /* Item List */
          <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-3.5">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-3 border border-pink-100 shadow-xs flex gap-3 relative"
              >
                {/* Product Image */}
                <div className="w-20 h-24 rounded-xl overflow-hidden bg-zinc-100 shrink-0">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-full h-full object-cover object-top"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="font-bold text-xs text-zinc-900 truncate">
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-zinc-400 hover:text-rose-500 transition p-0.5"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-[11px] text-zinc-500 flex items-center gap-2 mt-0.5">
                      <span>Color: <strong>{item.selectedColor}</strong></span>
                      <span>•</span>
                      <span>
                        Size:{' '}
                        <strong>
                          {item.isCustomMade ? 'Bespoke Custom' : item.selectedSize}
                        </strong>
                      </span>
                    </div>

                    {/* Custom-tailored badge */}
                    {item.isCustomMade && (
                      <div className="mt-1.5 p-1.5 rounded-lg bg-pink-50 border border-pink-200 text-[10px] text-pink-900 space-y-0.5">
                        <div className="font-extrabold flex items-center gap-1 text-rose-700">
                          <Scissors className="w-3 h-3" />
                          <span>Custom-Made Silhouette ($0 Tailoring Fee)</span>
                        </div>
                        {item.customProfile ? (
                          <div className="text-zinc-600 truncate">
                            Bust {item.customProfile.measurements.bust}&quot; • Waist {item.customProfile.measurements.waist}&quot; • Hips {item.customProfile.measurements.hips}&quot;
                          </div>
                        ) : (
                          <div className="text-zinc-600">Tailored to your body scan profile</div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Quantity & Price */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center border border-zinc-200 rounded-lg overflow-hidden bg-zinc-50">
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        className="px-2 py-0.5 hover:bg-zinc-200 text-zinc-600 transition cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2.5 py-0.5 text-xs font-bold text-zinc-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="px-2 py-0.5 hover:bg-zinc-200 text-zinc-600 transition cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="font-black text-sm text-zinc-900">
                      ${item.unitPrice * item.quantity}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer & Checkout Breakdown */}
        {items.length > 0 && !orderComplete && (
          <div className="p-4 sm:p-5 border-t border-pink-100 bg-white space-y-3">
            {/* Promo Code Input */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Code (e.g. AWFITFIRST)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-zinc-50 rounded-xl border border-zinc-200 uppercase font-semibold focus:outline-none focus:ring-1 focus:ring-pink-300"
                />
              </div>
              <button
                onClick={handleApplyPromo}
                className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs rounded-xl transition cursor-pointer"
              >
                Apply
              </button>
            </div>
            {promoMessage && (
              <p className="text-[11px] text-pink-700 font-medium">{promoMessage}</p>
            )}

            {/* Price Calculations */}
            <div className="space-y-1.5 text-xs text-zinc-600 pt-1">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {appliedDiscount > 0 && (
                <div className="flex justify-between text-rose-600 font-bold">
                  <span>VIP Discount ({appliedDiscount}%)</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Atelier Custom Tailoring</span>
                <span className="text-emerald-700 font-bold">$0.00 (Included ♡)</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shipping === 0 ? <strong className="text-emerald-700">FREE</strong> : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-zinc-900 pt-1.5 border-t border-pink-100">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-pink-600 via-rose-500 to-pink-600 hover:opacity-95 text-white font-extrabold text-xs shadow-md shadow-pink-200 flex items-center justify-center gap-2 cursor-pointer transition disabled:opacity-60"
            >
              {isCheckingOut ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin-slow" />
                  <span>Processing Custom Atelier Order...</span>
                </>
              ) : (
                <>
                  <span>Checkout &amp; Send to Atelier (${total.toFixed(2)})</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-[10px] text-zinc-400">
              <ShieldCheck className="w-3 h-3 text-pink-500" />
              <span>Free returns &amp; complimentary alterations if fit isn&apos;t 100% perfect ♡</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
