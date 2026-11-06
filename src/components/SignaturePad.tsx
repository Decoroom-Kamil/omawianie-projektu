import React, { useRef, useEffect, useState, useCallback } from 'react';
import { PenTool, RotateCcw, Check, Clock, UserCheck } from 'lucide-react';

interface SignaturePadProps {
  title: string;
  role: 'architekt' | 'koordynator';
  signerName: string;
  signatureDataUrl?: string;
  signedAt?: string;
  onSaveSignature: (dataUrl: string, signedAt: string) => void;
  onClearSignature: () => void;
}

export function SignaturePad({
  title,
  role,
  signerName,
  signatureDataUrl,
  signedAt,
  onSaveSignature,
  onClearSignature,
}: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawnStroke, setHasDrawnStroke] = useState(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);

  // Setup canvas high-DPI scaling
  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    // Set display size (css pixels)
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.scale(dpr, dpr);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#020617'; // Deep dark ink

    // If existing signature exists, draw it onto canvas
    if (signatureDataUrl) {
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, rect.width, rect.height);
        ctx.drawImage(img, 0, 0, rect.width, rect.height);
      };
      img.src = signatureDataUrl;
      setHasDrawnStroke(true);
    } else {
      ctx.clearRect(0, 0, rect.width, rect.height);
      setHasDrawnStroke(false);
    }
  }, [signatureDataUrl]);

  useEffect(() => {
    setupCanvas();
    const handleResize = () => setupCanvas();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setupCanvas]);

  const getCanvasCoordinates = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const startDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      canvas.setPointerCapture(e.pointerId);
    } catch {}

    const coords = getCanvasCoordinates(e);
    lastPointRef.current = coords;
    setIsDrawing(true);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw single dot in case of a tap
    ctx.beginPath();
    ctx.arc(coords.x, coords.y, 1.25, 0, Math.PI * 2);
    ctx.fillStyle = '#020617';
    ctx.fill();
    setHasDrawnStroke(true);
  };

  const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const currentCoords = getCanvasCoordinates(e);
    const lastCoords = lastPointRef.current || currentCoords;

    ctx.beginPath();
    ctx.moveTo(lastCoords.x, lastCoords.y);
    ctx.lineTo(currentCoords.x, currentCoords.y);
    ctx.stroke();

    lastPointRef.current = currentCoords;
    setHasDrawnStroke(true);
  };

  const stopDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    setIsDrawing(false);
    lastPointRef.current = null;

    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      canvas.releasePointerCapture(e.pointerId);
    } catch {}

    // Save signature data URL
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    const formattedTimestamp = `${pad(now.getDate())}.${pad(now.getMonth() + 1)}.${now.getFullYear()} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
    const dataUrl = canvas.toDataURL('image/png');
    onSaveSignature(dataUrl, formattedTimestamp);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    setHasDrawnStroke(false);
    onClearSignature();
  };

  const isSigned = Boolean(signatureDataUrl || hasDrawnStroke);

  return (
    <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-4 sm:p-5 shadow-lg space-y-3">
      {/* Title & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
            role === 'architekt' ? 'bg-amber-500/20 text-amber-400' : 'bg-cyan-500/20 text-cyan-400'
          }`}>
            <PenTool className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
              {title}
            </h3>
            <p className="text-xs text-slate-400">
              {signerName ? `${signerName}` : `(Podpisujący: ${role === 'architekt' ? 'Architekt' : 'Koordynator'})`}
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2">
          {isSigned ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              Podpisano {signedAt ? `• ${signedAt}` : ''}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-400 text-xs font-medium">
              <Clock className="w-3 h-3" />
              Oczekuje na podpis
            </span>
          )}

          {isSigned && (
            <button
              type="button"
              onClick={handleClear}
              className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-rose-300 border border-slate-700 flex items-center gap-1 transition-colors cursor-pointer"
              title="Wyczyść i podpisz ponownie"
            >
              <RotateCcw className="w-3 h-3" />
              Wyczyść
            </button>
          )}
        </div>
      </div>

      {/* Signature Canvas Area */}
      <div className="relative group">
        <div className="w-full h-36 sm:h-44 bg-white rounded-xl border-2 border-dashed border-slate-600 focus-within:border-amber-400 overflow-hidden relative shadow-inner touch-none">
          <canvas
            ref={canvasRef}
            onPointerDown={startDrawing}
            onPointerMove={draw}
            onPointerUp={stopDrawing}
            onPointerCancel={stopDrawing}
            className="w-full h-full cursor-crosshair touch-none select-none"
            style={{ touchAction: 'none' }}
          />

          {/* Guide baseline */}
          <div className="absolute bottom-8 left-6 right-6 border-b border-slate-300 pointer-events-none flex justify-between text-[10px] text-slate-400 select-none">
            <span>Miejsce na podpis palcem lub rysikiem ✍️</span>
            <span>X</span>
          </div>

          {!isSigned && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
              <span className="text-xs sm:text-sm font-medium text-slate-400 bg-white/80 px-3 py-1.5 rounded-lg border border-slate-200">
                Podpisz palcem lub rysikiem tutaj
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Helper text */}
      <div className="flex items-center justify-between text-[11px] text-slate-400">
        <span>Możesz podpisać na ekranie dotykowym telefonu, tabletu lub myszką.</span>
        {signerName && (
          <span className="font-semibold text-slate-300 flex items-center gap-1">
            <UserCheck className="w-3 h-3 text-emerald-400" />
            {signerName}
          </span>
        )}
      </div>
    </div>
  );
}
