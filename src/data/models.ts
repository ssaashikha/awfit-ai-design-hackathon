import { TryOnModel } from '../types';

export const TRY_ON_MODELS: TryOnModel[] = [
  {
    id: 'model-yuna',
    name: 'Yuna',
    height: "5'4\" (163 cm)",
    stats: 'Bust 33" • Waist 24.5" • Hips 35"',
    bodyType: 'Petite Hourglass',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=80',
  },
  {
    id: 'model-maya',
    name: 'Maya',
    height: "5'7\" (170 cm)",
    stats: 'Bust 36" • Waist 27.5" • Hips 40.5"',
    bodyType: 'Curvy Pear Silhouette',
    imageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=700&q=80',
  },
  {
    id: 'model-chloe',
    name: 'Chloe',
    height: "5'9\" (175 cm)",
    stats: 'Bust 34" • Waist 26" • Hips 36"',
    bodyType: 'Athletic Slim Rectangle',
    imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=700&q=80',
  },
  {
    id: 'model-zara',
    name: 'Zara',
    height: "5'6\" (168 cm)",
    stats: 'Bust 40" • Waist 33" • Hips 43"',
    bodyType: 'Mid-Size Soft Curve',
    imageUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=700&q=80',
  },
];

export const BODY_ARCHETYPES = [
  {
    id: 'petite-hourglass',
    name: 'Petite Defined Curve',
    description: 'Narrow ribcage and waist with balanced bust and hip curves. Often suffers waist gaps on standard jeans and tops that are too long.',
    defaultMeasurements: {
      height: "5'3\"",
      bust: 33,
      waist: 24.5,
      hips: 35.5,
      inseam: 28.5,
      shoulderWidth: 14.5,
      fitPreference: 'Snug Sculpted' as const,
    },
    samplePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'curvy-pear',
    name: 'Curvy Pear Silhouette',
    description: 'Hips and thighs broader than shoulder/bust line. Off-the-rack Mediums gap 2-3 inches at the back waist.',
    defaultMeasurements: {
      height: "5'6\"",
      bust: 35,
      waist: 27,
      hips: 41,
      inseam: 30,
      shoulderWidth: 15.0,
      fitPreference: 'Standard Tailored' as const,
    },
    samplePhoto: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'athletic-rectangle',
    name: 'Athletic / Tall Straight',
    description: 'Even proportion from shoulder to hip with toned frame. Standard clothes often pull tight across broad shoulders.',
    defaultMeasurements: {
      height: "5'8\"",
      bust: 35,
      waist: 27.5,
      hips: 36.5,
      inseam: 32,
      shoulderWidth: 16.2,
      fitPreference: 'Relaxed Street' as const,
    },
    samplePhoto: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'midsize-curve',
    name: 'Mid-Size Voluptuous',
    description: 'Full bust and curvy hips. Standard fast-fashion L/XL is cut boxy rather than contouring the waist.',
    defaultMeasurements: {
      height: "5'5\"",
      bust: 39,
      waist: 32,
      hips: 43,
      inseam: 29.5,
      shoulderWidth: 15.8,
      fitPreference: 'Standard Tailored' as const,
    },
    samplePhoto: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80',
  },
];
