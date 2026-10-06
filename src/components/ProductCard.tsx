import React from 'react';
import { Product, SizeOption } from '../types';
import { Sparkles, Eye, Star, Heart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onTryOn: (product: Product) => void;
  onCustomMake: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onTryOn,
  onCustomMake,
}) => {
  const soldOutSizes = (Object.keys(product.stockBySize) as SizeOption[]).filter(
    (size) => product.stockBySize[size] === 0
  );

  return (
    <div className="group relative bg-white rounded-3xl p-3 border border-pink-100 hover:border-pink-300 shadow-sm hover:shadow-xl hover:shadow-pink-100 transition-all duration-300 flex flex-col">
      {/* Image Container */}
      <div className="relative aspect-3/4 rounded-2xl overflow-hidden bg-zinc-100 mb-3 cursor-pointer" onClick={() => onSelect(product)}>
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Floating Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {product.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-full text-[10px] font-extrabold tracking-wide uppercase bg-white/90 backdrop-blur-md text-pink-700 shadow-xs"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Wishlist Heart Icon */}
        <button
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-zinc-600 hover:text-pink-600 backdrop-blur-md flex items-center justify-center transition shadow-xs z-10"
          aria-label="Save to wishlist"
        >
          <Heart className="w-4 h-4" />
        </button>

        {/* Sold-out size custom-make prompt overlay */}
        {soldOutSizes.length > 0 && (
          <div className="absolute bottom-2 left-2 right-2 bg-black/75 backdrop-blur-md text-white text-[11px] font-semibold py-1.5 px-2.5 rounded-xl flex items-center justify-between border border-white/10">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping"></span>
              <span>Sizes {soldOutSizes.slice(0, 2).join(', ')} sold out!</span>
            </span>
            <span className="text-pink-300 text-[10px] font-bold underline flex items-center gap-0.5">
              Custom-make it ✨
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex-1 flex flex-col">
        {/* Category & Rating */}
        <div className="flex items-center justify-between text-xs text-zinc-500 mb-1">
          <span className="font-medium text-pink-600 uppercase tracking-wider text-[10px]">
            {product.category}
          </span>
          <div className="flex items-center gap-1 text-zinc-700 font-semibold">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>{product.rating}</span>
            <span className="text-zinc-400 text-[10px]">({product.reviewsCount})</span>
          </div>
        </div>

        {/* Product Name */}
        <h3
          onClick={() => onSelect(product)}
          className="font-bold text-zinc-900 text-sm hover:text-pink-600 transition cursor-pointer line-clamp-1 mb-1.5"
        >
          {product.name}
        </h3>

        {/* Color swatches */}
        <div className="flex items-center gap-1.5 mb-2.5">
          {product.colors.map((color) => (
            <span
              key={color.name}
              title={color.name}
              className="w-3.5 h-3.5 rounded-full border border-zinc-200 shadow-xs"
              style={{ backgroundColor: color.hex }}
            />
          ))}
          <span className="text-[10px] text-zinc-400 pl-1 font-medium">
            {product.colors.length} shades
          </span>
        </div>

        {/* Price & Savings */}
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-lg font-black text-zinc-900">${product.price}</span>
          <span className="text-xs text-zinc-400 line-through">${product.originalPrice}</span>
          <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded-md">
            Save ${product.originalPrice - product.price}
          </span>
        </div>

        {/* Size Availability Strip */}
        <div className="flex items-center gap-1 text-[10px] font-bold text-zinc-500 mb-3 overflow-x-auto pb-0.5">
          <span className="text-[9px] uppercase tracking-wider text-zinc-400 pr-1">Sizes:</span>
          {(['XS', 'S', 'M', 'L', 'XL', 'XXL'] as SizeOption[]).map((size) => {
            const inStock = product.stockBySize[size] > 0;
            return (
              <span
                key={size}
                className={`px-1.5 py-0.5 rounded text-[10px] ${
                  inStock
                    ? 'bg-zinc-100 text-zinc-800'
                    : 'bg-rose-50 text-rose-400 line-through opacity-70'
                }`}
                title={inStock ? `In Stock (${product.stockBySize[size]} left)` : 'Sold Out - Custom Tailoring Available'}
              >
                {size}
              </span>
            );
          })}
        </div>

        {/* Actions Button Group */}
        <div className="mt-auto grid grid-cols-2 gap-2 pt-1 border-t border-pink-50">
          <button
            onClick={() => onTryOn(product)}
            className="flex items-center justify-center gap-1 py-2 px-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs transition cursor-pointer"
          >
            <span>🪞</span>
            <span>Try On</span>
          </button>

          <button
            onClick={() => onCustomMake(product)}
            className="flex items-center justify-center gap-1 py-2 px-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 text-white font-bold text-xs shadow-xs hover:shadow-md transition cursor-pointer"
          >
            <Sparkles className="w-3 h-3" />
            <span>Custom Fit</span>
          </button>
        </div>
      </div>
    </div>
  );
};
