import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Camera, Upload, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import { PlateAnalysisResult } from '../types';

interface PlateScannerProps {
  onAnalysisComplete: (result: PlateAnalysisResult, imageBase64: string) => void;
  scansRemaining: number;
  isPro: boolean;
  onOpenPricing: () => void;
}

export const PlateScanner: React.FC<PlateScannerProps> = ({
  onAnalysisComplete,
  scansRemaining,
  isPro,
  onOpenPricing,
}) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Sample food presets for quick testing
  const recommendedRecipes = [
    { id: 'r1', name: 'High Protein Chicken Bowl', time: '15 min', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80' },
    { id: 'r2', name: 'Keto Salmon Salad', time: '10 min', image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&auto=format&fit=crop&q=80' },
    { id: 'r3', name: 'Vegan Buddha Bowl', time: '20 min', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop&q=80' }
  ];

  const samplePresets = [
    {
      id: 'steak-corn-potatoes',
      name: 'Steak, Potatoes & Corn (1,150 kcal)',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'salmon-bowl',
      name: 'Salmon & Quinoa Bowl',
      image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'avocado-salad',
      name: 'Avocado Chicken Salad',
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'berry-pancakes',
      name: 'Pancakes & Berries',
      image: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=600&auto=format&fit=crop&q=80',
    }
  ];

  const startCamera = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (err) {
      console.error('Camera access error:', err);
      setError('Could not access camera. Please allow camera permissions or upload an image file instead.');
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

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setSelectedImage(dataUrl);
        stopCamera();
        analyzePlate(dataUrl);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (JPG or PNG).');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setSelectedImage(base64);
      analyzePlate(base64);
    };
    reader.readAsDataURL(file);
  };

  const handlePresetSelect = async (preset: { id: string; name: string; image: string }) => {
    try {
      setLoading(true);
      setError(null);
      setSelectedImage(preset.image);
      analyzePlate(preset.image, preset.id);
    } catch (e) {
      setLoading(false);
      setError('Failed to load sample image.');
    }
  };

  const analyzePlate = async (base64Image: string, presetId?: string) => {
    if (!isPro && scansRemaining <= 0) {
      onOpenPricing();
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/analyze-plate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64Image, presetId }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Plate analysis request failed.');
      }

      const result: PlateAnalysisResult = await res.json();
      onAnalysisComplete(result, base64Image);
    } catch (err: any) {
      console.error('Analysis error:', err);
      setError(err.message || 'Something went wrong while analyzing the plate. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      {/* Scanner Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden">
        {/* Background ambient glow */}
        <div className="absolute -top-24 -left-24 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-24 -left-24 w-60 h-60 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center max-w-xl mx-auto mb-8 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Calorie Estimation & Plate Reader</span>
          </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {t('hero_title')}
            </h2>
            <p className="text-slate-400 text-sm">
              {t('hero_desc')}
            </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Analysis Failed</p>
              <p className="text-xs text-rose-300/80">{error}</p>
            </div>
          </div>
        )}

        {/* Camera / Upload Container */}
        <div className="relative rounded-2xl border-2 border-dashed border-slate-700 bg-slate-950/60 p-6 sm:p-10 text-center flex flex-col items-center justify-center min-h-[320px] transition-all hover:border-emerald-500/50">
          
          {loading ? (
            <div className="space-y-4 py-8">
              <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-emerald-500/20 animate-ping" />
                <div className="w-16 h-16 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
                <Camera className="w-8 h-8 text-emerald-400 absolute" />
              </div>
              <div>
                <p className="text-white font-bold text-lg">AI Reading Plate & Items...</p>
                <p className="text-slate-400 text-xs mt-1 animate-pulse">
                  Calculating itemized calories (Corn, Potatoes, Meat) & saving daily totals
                </p>
              </div>
            </div>
          ) : isCameraActive ? (
            <div className="w-full space-y-4">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full max-h-[400px] rounded-xl object-cover border border-slate-800 bg-black"
              />
              <canvas ref={canvasRef} className="hidden" />
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={capturePhoto}
                  className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/30 flex items-center gap-2"
                >
                  <Camera className="w-4 h-4" />
                  Capture Photo
                </button>
                <button
                  onClick={stopCamera}
                  className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : selectedImage ? (
            <div className="w-full space-y-4">
              <div className="relative rounded-xl overflow-hidden max-h-[320px] mx-auto border border-slate-800 shadow-xl">
                <img
                  src={selectedImage}
                  alt="Selected Food Plate"
                  className="w-full h-64 object-cover"
                />
              </div>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => analyzePlate(selectedImage)}
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/30 flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Re-Analyze Plate
                </button>
                <button
                  onClick={() => {
                    setSelectedImage(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold"
                >
                  Choose Different Photo
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
                <Camera className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-white mb-1">
                  Upload or Take Food Photo
                </h3>
                <p className="text-slate-400 text-xs max-w-sm mx-auto">
                  Drag & drop your meal photo, or capture live using camera
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => cameraInputRef.current?.click()}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all hover:scale-105"
                >
                  <Camera className="w-4 h-4" />
                  Open Camera
                </button>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm border border-slate-700 flex items-center gap-2 transition-all"
                >
                  <Upload className="w-4 h-4 text-slate-400" />
                  Upload Photo
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            </div>
          )}
        </div>

        {/* Recommended Recipes */}
        <div className="mt-8 pt-6 border-t border-slate-800/80">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 text-center sm:text-left">
            Recommended Recipes for you:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {recommendedRecipes.map((recipe) => (
              <div
                key={recipe.id}
                className="group relative rounded-xl overflow-hidden border border-slate-800 hover:border-emerald-500/60 transition-all text-left bg-slate-950 cursor-pointer"
              >
                <img
                  src={recipe.image}
                  alt={recipe.name}
                  className="w-full h-24 object-cover group-hover:scale-105 transition-transform duration-300 opacity-80 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent p-3 flex flex-col justify-end">
                  <span className="text-[12px] font-semibold text-white group-hover:text-emerald-300 leading-tight">
                    {recipe.name}
                  </span>
                  <span className="text-[10px] text-emerald-400 mt-1">{recipe.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sample Food Presets */}
        <div className="mt-8 pt-6 border-t border-slate-800/80">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 text-center sm:text-left">
            Or test with sample food plates:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {samplePresets.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handlePresetSelect(preset)}
                disabled={loading}
                className="group relative rounded-xl overflow-hidden border border-slate-800 hover:border-emerald-500/60 transition-all text-left bg-slate-950"
              >
                <img
                  src={preset.image}
                  alt={preset.name}
                  className="w-full h-20 object-cover group-hover:scale-105 transition-transform duration-300 opacity-80 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent p-2 flex items-end">
                  <span className="text-[11px] font-semibold text-white group-hover:text-emerald-300 leading-tight">
                    {preset.name}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
