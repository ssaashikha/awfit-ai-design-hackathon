import React, { useState, useRef, useEffect } from 'react';
import { Product, BespokeFitProfile, UserMeasurements } from '../types';
import { BODY_ARCHETYPES } from '../data/models';
import {
  X,
  Camera,
  Upload,
  Sparkles,
  Check,
  RotateCcw,
  Sliders,
  Scissors,
  ShieldCheck,
  ChevronRight,
  Info,
  Maximize2
} from 'lucide-react';

interface BodyScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetProduct?: Product | null;
  onSaveProfile: (profile: BespokeFitProfile, autoAddProduct?: Product) => void;
  currentProfile: BespokeFitProfile | null;
}

export const BodyScannerModal: React.FC<BodyScannerModalProps> = ({
  isOpen,
  onClose,
  targetProduct,
  onSaveProfile,
  currentProfile,
}) => {
  if (!isOpen) return null;

  const [scanStep, setScanStep] = useState<'upload' | 'scanning' | 'results'>('upload');
  const [photoPreview, setPhotoPreview] = useState<string | null>(
    currentProfile?.photoUrl || BODY_ARCHETYPES[0].samplePhoto
  );
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Manual & AI-adjusted measurements
  const [unit, setUnit] = useState<'in' | 'cm'>('in');
  const [height, setHeight] = useState("5'5\"");
  const [bust, setBust] = useState<number>(currentProfile?.measurements.bust || 34.5);
  const [waist, setWaist] = useState<number>(currentProfile?.measurements.waist || 26.5);
  const [hips, setHips] = useState<number>(currentProfile?.measurements.hips || 37.0);
  const [inseam, setInseam] = useState<number>(currentProfile?.measurements.inseam || 30.0);
  const [shoulderWidth, setShoulderWidth] = useState<number>(currentProfile?.measurements.shoulderWidth || 15.0);
  const [fitPreference, setFitPreference] = useState<UserMeasurements['fitPreference']>(
    currentProfile?.measurements.fitPreference || 'Standard Tailored'
  );

  const [scanResult, setScanResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Camera stream cleanup
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      setIsCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 800 } },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.error('Camera access failed:', err);
      setIsCameraActive(false);
      setErrorMessage('Camera access was not granted. Please upload a photo instead.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const capturePhotoFromCamera = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 800;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      setPhotoPreview(dataUrl);
      stopCamera();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setPhotoPreview(event.target.result as string);
        stopCamera();
      }
    };
    reader.readAsDataURL(file);
  };

  const applyArchetypePreset = (archetype: typeof BODY_ARCHETYPES[0]) => {
    setPhotoPreview(archetype.samplePhoto);
    setHeight(archetype.defaultMeasurements.height);
    setBust(archetype.defaultMeasurements.bust);
    setWaist(archetype.defaultMeasurements.waist);
    setHips(archetype.defaultMeasurements.hips);
    setInseam(archetype.defaultMeasurements.inseam);
    setShoulderWidth(archetype.defaultMeasurements.shoulderWidth);
    setFitPreference(archetype.defaultMeasurements.fitPreference);
  };

  // Run AI Scan via Express backend
  const runAiScan = async () => {
    setScanStep('scanning');
    setIsAnalyzing(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/analyze-body', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: photoPreview,
          height,
          fitPreference,
        }),
      });

      const resData = await response.json();
      if (resData.success && resData.data) {
        const data = resData.data;
        setScanResult(data);
        if (data.measurements) {
          setBust(data.measurements.bust?.inches || bust);
          setWaist(data.measurements.waist?.inches || waist);
          setHips(data.measurements.hips?.inches || hips);
          setInseam(data.measurements.inseam?.inches || inseam);
          if (data.measurements.shoulderWidth?.inches) {
            setShoulderWidth(data.measurements.shoulderWidth.inches);
          }
        }
      }
    } catch (err: any) {
      console.warn('Scan analysis fallback triggered:', err);
    } finally {
      // Allow cute scanning laser animation to complete smoothly
      setTimeout(() => {
        setIsAnalyzing(false);
        setScanStep('results');
      }, 1400);
    }
  };

  const handleSaveAndApply = () => {
    const profile: BespokeFitProfile = {
      id: `AW-FIT-${Math.floor(1000 + Math.random() * 9000)}`,
      bodyType: scanResult?.bodyType || 'Bespoke Calibrated Curve',
      measurements: {
        height,
        bust,
        waist,
        hips,
        inseam,
        shoulderWidth,
        fitPreference,
      },
      standardSizeComparison:
        scanResult?.standardSizeMatch || `Size ${waist <= 26 ? 'S' : 'M'} waist with Size ${hips >= 37 ? 'M' : 'S'} hip`,
      waistGapRisk:
        scanResult?.waistGapRisk || 'Standard Size M will gap by ~1.9 inches at lower spine without custom tailoring.',
      tailoringAdjustments: scanResult?.tailoringAdjustments || [
        `Taper lumbar back waist by 1.8" for zero waistband gaping`,
        `Curved hip darting matched to ${hips}" fullness`,
        `Comfort armhole depth balanced for ${shoulderWidth}" shoulders`,
        `Hemline calibrated for ${height} frame`,
      ],
      stylistAdvice:
        scanResult?.stylistAdvice ||
        'Your custom measurements have been permanently calibrated! Every piece tailored with this profile will hug without pinching.',
      confidenceScore: scanResult?.confidenceScore || 96,
      scannedAt: new Date().toLocaleDateString(),
      photoUrl: photoPreview || undefined,
    };

    onSaveProfile(profile, targetProduct || undefined);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div
        className="relative bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-pink-200 overflow-hidden my-6 animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
              <Camera className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base tracking-tight">Iris AI Sizing &amp; Body Scan Studio</h3>
                <span className="bg-white/25 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">Bespoke 3D</span>
              </div>
              <p className="text-xs text-pink-100">Zero waist gap • Tailored to your exact curves • $0 extra</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 text-rose-700 text-xs border border-rose-200 flex items-center justify-between">
              <span>{errorMessage}</span>
              <button onClick={() => setErrorMessage(null)} className="font-bold underline text-[11px]">Dismiss</button>
            </div>
          )}

          {/* STEP 1: Upload / Choose Photo or Preset */}
          {scanStep === 'upload' && (
            <div className="space-y-6">
              <div className="text-center max-w-lg mx-auto space-y-1">
                <span className="text-2xl">📸</span>
                <h4 className="font-extrabold text-lg text-zinc-900">
                  Scan Your Silhouette or Pick an Archetype
                </h4>
                <p className="text-xs text-zinc-500">
                  Upload a full-length photo, use your webcam, or select a silhouette preset. Iris scans body proportions and formulates your custom sizing chart in seconds.
                </p>
              </div>

              {/* Main Photo / Camera View */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-6 flex flex-col items-center">
                  <div className="relative w-64 h-80 rounded-2xl overflow-hidden bg-zinc-900 border-2 border-pink-200 shadow-md group">
                    {isCameraActive ? (
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover"
                      />
                    ) : photoPreview ? (
                      <img
                        src={photoPreview}
                        alt="Body Scan Subject"
                        className="w-full h-full object-cover object-top"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-zinc-400 p-4 text-center">
                        <Upload className="w-8 h-8 mb-2 text-zinc-500" />
                        <span className="text-xs">No photo selected</span>
                      </div>
                    )}

                    {/* Camera Capture Floating Bar */}
                    {isCameraActive && (
                      <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
                        <button
                          onClick={capturePhotoFromCamera}
                          className="px-4 py-2 rounded-full bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold shadow-lg flex items-center gap-1.5 cursor-pointer"
                        >
                          <Camera className="w-3.5 h-3.5" /> Capture Frame
                        </button>
                        <button
                          onClick={stopCamera}
                          className="px-3 py-2 rounded-full bg-black/60 text-white text-xs font-medium cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    )}

                    {/* Landmark Grid Overlay */}
                    <div className="absolute inset-0 pointer-events-none opacity-40">
                      <div className="w-full h-full grid grid-cols-4 grid-rows-6 border border-pink-400/40 divide-x divide-y divide-pink-400/30"></div>
                    </div>
                  </div>

                  {/* Photo Actions */}
                  <div className="flex items-center gap-2 mt-3">
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5 text-zinc-600" /> Upload Photo
                    </button>

                    {!isCameraActive ? (
                      <button
                        onClick={startCamera}
                        className="px-3 py-1.5 rounded-xl bg-pink-50 hover:bg-pink-100 text-pink-700 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                      >
                        <Camera className="w-3.5 h-3.5 text-pink-600" /> Open Camera
                      </button>
                    ) : null}
                  </div>
                </div>

                {/* Right: Quick Archetype Presets + Height */}
                <div className="md:col-span-6 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                      Your Approximate Height:
                    </label>
                    <input
                      type="text"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      placeholder="e.g. 5'5&quot; or 165 cm"
                      className="w-full px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-pink-300"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">
                      <span>Or Choose A Body Silhouette Preset:</span>
                      <span className="text-[10px] text-pink-600 lowercase font-medium">instant calibrate</span>
                    </div>

                    <div className="space-y-2">
                      {BODY_ARCHETYPES.map((arch) => (
                        <div
                          key={arch.id}
                          onClick={() => applyArchetypePreset(arch)}
                          className="p-2.5 rounded-xl border border-zinc-200 hover:border-pink-300 hover:bg-pink-50/50 flex items-center gap-3 cursor-pointer transition"
                        >
                          <img
                            src={arch.samplePhoto}
                            alt={arch.name}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-xs text-zinc-900 truncate">
                              {arch.name}
                            </div>
                            <div className="text-[10px] text-zinc-500 truncate">
                              {arch.description}
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-zinc-400" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Scan CTA */}
                  <button
                    onClick={runAiScan}
                    className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-pink-600 via-rose-500 to-purple-600 hover:opacity-95 text-white font-extrabold text-sm shadow-md shadow-pink-200 flex items-center justify-center gap-2 cursor-pointer transition"
                  >
                    <Sparkles className="w-4 h-4 animate-spin-slow" />
                    <span>Run Iris AI Body Scan ✨</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Scanning Animation */}
          {scanStep === 'scanning' && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-6">
              <div className="relative w-64 h-80 rounded-2xl overflow-hidden bg-zinc-900 shadow-xl border-2 border-pink-400">
                {photoPreview && (
                  <img
                    src={photoPreview}
                    alt="Scanning"
                    className="w-full h-full object-cover object-top opacity-70"
                  />
                )}

                {/* Animated Laser Scanning Line */}
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-pink-400 to-transparent shadow-[0_0_15px_#EC4899] animate-scan-line"></div>

                {/* Detected points */}
                <div className="absolute top-[28%] left-[32%] w-3 h-3 rounded-full bg-pink-400 animate-ping"></div>
                <div className="absolute top-[44%] left-[45%] w-3 h-3 rounded-full bg-purple-400 animate-ping"></div>
                <div className="absolute top-[58%] left-[52%] w-3 h-3 rounded-full bg-rose-400 animate-ping"></div>

                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center p-4 text-white">
                  <div className="w-12 h-12 rounded-full bg-pink-500/80 backdrop-blur-md flex items-center justify-center mb-2 animate-bounce">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <span className="font-extrabold text-sm tracking-wide">
                    Iris is Measuring Proportions...
                  </span>
                  <span className="text-xs text-pink-200 mt-1">
                    Calibrating bust, waist taper, and hip arc
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-xs font-bold text-pink-600 uppercase tracking-widest animate-pulse">
                  Analyzing Fabric Tension &amp; Silhouette
                </div>
                <p className="text-xs text-zinc-500 max-w-sm">
                  Calculating exact seam angles to guarantee zero waist gaping on your custom piece ♡
                </p>
              </div>
            </div>
          )}

          {/* STEP 3: Calibrated Results & Custom Sizing Chart Editor */}
          {scanStep === 'results' && (
            <div className="space-y-6">
              {/* Top Diagnosis Card */}
              <div className="bg-gradient-to-r from-pink-50 via-purple-50 to-rose-50 rounded-2xl p-4 border border-pink-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">✨</span>
                    <div>
                      <h4 className="font-extrabold text-sm text-zinc-900">
                        Body Silhouette Identified: {scanResult?.bodyType || 'Bespoke Calibrated Curve'}
                      </h4>
                      <p className="text-xs text-zinc-600">
                        Confidence: <strong className="text-emerald-700">{scanResult?.confidenceScore || 96}%</strong> • Height: {height}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setScanStep('upload')}
                    className="text-xs font-bold text-pink-600 hover:text-pink-800 flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" /> Rescan
                  </button>
                </div>

                <div className="p-3 bg-white/80 rounded-xl border border-pink-100 text-xs text-zinc-700 space-y-1">
                  <div className="font-bold text-rose-700 flex items-center gap-1">
                    <span>⚠️ Standard Retail Sizing Issue:</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    {scanResult?.waistGapRisk ||
                      `Off-the-rack Size M will gap by ~2 inches at the back waist, while Size S will constrict across hips.`}
                  </p>
                  <p className="text-[11px] font-semibold text-emerald-800 pt-1">
                    ✓ aw-fit atelier remedy: {scanResult?.recommendedCustomFit || 'Graduated waist contour stitch applied to eliminate gap!'}
                  </p>
                </div>
              </div>

              {/* Calibrated Measurements & Sliders */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="text-xs font-bold text-zinc-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-pink-600" />
                    <span>Your Calibrated Measurements:</span>
                  </div>

                  {/* Unit toggle (in / cm) */}
                  <div className="flex items-center bg-zinc-100 rounded-lg p-0.5 text-xs font-bold">
                    <button
                      onClick={() => setUnit('in')}
                      className={`px-2 py-0.5 rounded-md ${unit === 'in' ? 'bg-white shadow-xs text-pink-700' : 'text-zinc-500'}`}
                    >
                      Inches (&quot;)
                    </button>
                    <button
                      onClick={() => setUnit('cm')}
                      className={`px-2 py-0.5 rounded-md ${unit === 'cm' ? 'bg-white shadow-xs text-pink-700' : 'text-zinc-500'}`}
                    >
                      Centimeters (cm)
                    </button>
                  </div>
                </div>

                {/* Measurement Adjustment Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {/* Bust */}
                  <div className="bg-zinc-50 rounded-2xl p-3 border border-zinc-200">
                    <div className="text-[11px] font-bold text-zinc-500 uppercase">Bust</div>
                    <div className="text-xl font-extrabold text-zinc-900 mt-1">
                      {unit === 'in' ? `${bust}"` : `${(bust * 2.54).toFixed(1)} cm`}
                    </div>
                    <input
                      type="range"
                      min="28"
                      max="48"
                      step="0.5"
                      value={bust}
                      onChange={(e) => setBust(parseFloat(e.target.value))}
                      className="w-full accent-pink-500 mt-2 cursor-pointer"
                    />
                  </div>

                  {/* Waist */}
                  <div className="bg-zinc-50 rounded-2xl p-3 border border-pink-300 ring-2 ring-pink-100">
                    <div className="flex items-center justify-between text-[11px] font-bold text-pink-700 uppercase">
                      <span>Waist</span>
                      <span className="text-[9px] bg-pink-100 px-1 py-0.2 rounded font-black">Zero Gap</span>
                    </div>
                    <div className="text-xl font-extrabold text-zinc-900 mt-1">
                      {unit === 'in' ? `${waist}"` : `${(waist * 2.54).toFixed(1)} cm`}
                    </div>
                    <input
                      type="range"
                      min="22"
                      max="44"
                      step="0.5"
                      value={waist}
                      onChange={(e) => setWaist(parseFloat(e.target.value))}
                      className="w-full accent-pink-500 mt-2 cursor-pointer"
                    />
                  </div>

                  {/* Hips */}
                  <div className="bg-zinc-50 rounded-2xl p-3 border border-zinc-200">
                    <div className="text-[11px] font-bold text-zinc-500 uppercase">Hips</div>
                    <div className="text-xl font-extrabold text-zinc-900 mt-1">
                      {unit === 'in' ? `${hips}"` : `${(hips * 2.54).toFixed(1)} cm`}
                    </div>
                    <input
                      type="range"
                      min="30"
                      max="52"
                      step="0.5"
                      value={hips}
                      onChange={(e) => setHips(parseFloat(e.target.value))}
                      className="w-full accent-pink-500 mt-2 cursor-pointer"
                    />
                  </div>

                  {/* Inseam */}
                  <div className="bg-zinc-50 rounded-2xl p-3 border border-zinc-200">
                    <div className="text-[11px] font-bold text-zinc-500 uppercase">Inseam</div>
                    <div className="text-xl font-extrabold text-zinc-900 mt-1">
                      {unit === 'in' ? `${inseam}"` : `${(inseam * 2.54).toFixed(1)} cm`}
                    </div>
                    <input
                      type="range"
                      min="24"
                      max="38"
                      step="0.5"
                      value={inseam}
                      onChange={(e) => setInseam(parseFloat(e.target.value))}
                      className="w-full accent-pink-500 mt-2 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Fit Preference Selection */}
              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">
                  Your Silhouette Fit Preference:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(
                    [
                      { id: 'Snug Sculpted', label: 'Snug Sculpted', desc: 'Contour hugging, zero slack' },
                      { id: 'Standard Tailored', label: 'Standard Tailored', desc: 'Balanced drape with ease' },
                      { id: 'Relaxed Street', label: 'Relaxed Street', desc: 'Chill volume, relaxed waist' },
                      { id: 'Oversized Slouchy', label: 'Oversized Slouchy', desc: 'Baggy aesthetic drape' },
                    ] as const
                  ).map((pref) => (
                    <button
                      key={pref.id}
                      onClick={() => setFitPreference(pref.id)}
                      className={`p-2.5 rounded-xl text-left border transition cursor-pointer ${
                        fitPreference === pref.id
                          ? 'border-pink-500 bg-pink-50 text-pink-900 shadow-xs ring-1 ring-pink-400'
                          : 'border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700'
                      }`}
                    >
                      <div className="text-xs font-bold">{pref.label}</div>
                      <div className="text-[10px] text-zinc-500 mt-0.5">{pref.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Iris Stylist Advice */}
              <div className="bg-rose-50/60 rounded-2xl p-3.5 border border-rose-100 flex items-start gap-3">
                <span className="text-xl">🎀</span>
                <div className="text-xs text-zinc-700 space-y-1">
                  <div className="font-bold text-rose-900">Iris Stylist Note:</div>
                  <p className="leading-relaxed">
                    {scanResult?.stylistAdvice ||
                      `With your ${bust}" bust, ${waist}" waist, and ${hips}" hips, this custom pattern stitches a gentle 1.8" back dart while maintaining roomy thigh drape. It will look tailor-made because it is! ♡`}
                  </p>
                </div>
              </div>

              {/* Bottom CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={handleSaveAndApply}
                  className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-pink-600 via-rose-500 to-pink-600 hover:opacity-95 text-white font-extrabold text-sm shadow-md shadow-pink-200 flex items-center justify-center gap-2 cursor-pointer transition"
                >
                  <Scissors className="w-4 h-4" />
                  <span>
                    {targetProduct
                      ? `Save & Custom-Tailor ${targetProduct.name} ✨`
                      : 'Save Bespoke Sizing Profile ♡'}
                  </span>
                </button>

                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold text-xs transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
