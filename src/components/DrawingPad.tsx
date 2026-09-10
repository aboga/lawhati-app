import React, { useRef, useState, useEffect } from 'react';
import { Eraser, RotateCcw, Check, Palette } from 'lucide-react';

interface DrawingPadProps {
  onSave: (dataUrl: string) => void;
  onCancel: () => void;
  initialData?: string;
}

export const DrawingPad: React.FC<DrawingPadProps> = ({ onSave, onCancel, initialData }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#0284c7');
  const [brushSize, setBrushSize] = useState(4);
  const [isEraser, setIsEraser] = useState(false);

  const colors = ['#000000', '#dc2626', '#ea580c', '#ca8a04', '#16a34a', '#0284c7', '#7c3aed', '#db2777'];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas resolution
    canvas.width = 600;
    canvas.height = 360;

    // Fill white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (initialData) {
      const img = new Image();
      img.src = initialData;
      img.onload = () => ctx.drawImage(img, 0, 0);
    }
  }, [initialData]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    ctx.beginPath();
    ctx.moveTo((clientX - rect.left) * scaleX, (clientY - rect.top) * scaleY);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = isEraser ? '#ffffff' : color;

    ctx.lineTo((clientX - rect.left) * scaleX, (clientY - rect.top) * scaleY);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    onSave(dataUrl);
  };

  return (
    <div className="flex flex-col gap-3 p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        {/* Colors */}
        <div className="flex items-center gap-1.5">
          {colors.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => { setColor(c); setIsEraser(false); }}
              className={`w-6 h-6 rounded-full border transition ${
                color === c && !isEraser ? 'scale-125 ring-2 ring-sky-500' : 'opacity-80 hover:opacity-100'
              }`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>

        {/* Tools */}
        <div className="flex items-center gap-2">
          {/* Eraser */}
          <button
            type="button"
            onClick={() => setIsEraser(!isEraser)}
            className={`p-1.5 rounded-lg border text-xs font-bold flex items-center gap-1 transition ${
              isEraser ? 'bg-sky-500 text-white' : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200'
            }`}
          >
            <Eraser className="w-3.5 h-3.5" />
            <span>ممحاة</span>
          </button>

          {/* Size slider */}
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-slate-500">الحجم:</span>
            <input
              type="range"
              min="2"
              max="24"
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
              className="w-16 accent-sky-500"
            />
          </div>

          {/* Clear */}
          <button
            type="button"
            onClick={clearCanvas}
            className="p-1.5 rounded-lg bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-rose-600 transition"
            title="مسح اللوحة"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="rounded-xl overflow-hidden border border-slate-300 dark:border-slate-700 bg-white shadow-inner cursor-crosshair touch-none">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full h-48 sm:h-64 object-contain block"
        />
      </div>

      {/* Action footer */}
      <div className="flex justify-end gap-2 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
        >
          إلغاء
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="px-4 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
        >
          <Check className="w-3.5 h-3.5" />
          <span>حفظ الرسم في المنشور</span>
        </button>
      </div>
    </div>
  );
};
