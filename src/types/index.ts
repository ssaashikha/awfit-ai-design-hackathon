export type SizeOption = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  category: 'Corsets & Tops' | 'Cargos & Bottoms' | 'Dresses' | 'Knitwear' | 'Outerwear';
  description: string;
  images: string[];
  tryOnImage?: string;
  tags: string[];
  stockBySize: Record<SizeOption, number>; // 0 means sold out
  colors: { name: string; hex: string }[];
  details: string[];
  fabric: string;
  care: string;
  rating: number;
  reviewsCount: number;
}

export interface UserMeasurements {
  height: string; // e.g. "5'6\"" or "168cm"
  bust: number; // in inches
  waist: number; // in inches
  hips: number; // in inches
  inseam: number; // in inches
  shoulderWidth?: number; // in inches
  torsoLength?: number;
  fitPreference: 'Snug Sculpted' | 'Standard Tailored' | 'Relaxed Street' | 'Oversized Slouchy';
}

export interface BespokeFitProfile {
  id: string;
  bodyType: string;
  measurements: UserMeasurements;
  standardSizeComparison: string;
  waistGapRisk: string;
  tailoringAdjustments: string[];
  stylistAdvice: string;
  confidenceScore: number;
  scannedAt: string;
  photoUrl?: string;
}

export interface CartItem {
  id: string; // unique cart line id
  productId: string;
  product: Product;
  selectedColor: string;
  isCustomMade: boolean;
  selectedSize?: SizeOption;
  customProfile?: BespokeFitProfile;
  quantity: number;
  unitPrice: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  actionPrompt?: {
    type: 'open_scanner' | 'open_tryon' | 'view_product' | 'apply_custom_fit';
    label: string;
    payload?: any;
  };
}

export interface TryOnModel {
  id: string;
  name: string;
  height: string;
  stats: string;
  bodyType: string;
  imageUrl: string;
  overlayDrapeUrl?: string;
}
