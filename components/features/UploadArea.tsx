import React, { useCallback, useRef, useState } from 'react';
import { UploadCloud, X, FileImage } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

interface UploadAreaProps {
  onImageSelect: (file: File) => void;
  isLoading?: boolean;
}

export function UploadArea({ onImageSelect, isLoading }: UploadAreaProps) {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const processFile = useCallback((file: File) => {
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      onImageSelect(file);
    } else {
      alert('Please upload a valid JPG or PNG image.');
    }
  }, [onImageSelect]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }, [processFile]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  }, [processFile]);

  const clearImage = () => {
    setPreview(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  if (preview) {
    return (
      <div className="relative w-full max-w-md mx-auto rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-white p-4">
        <div className="relative aspect-[3/4] w-full bg-slate-100 rounded-xl overflow-hidden flex items-center justify-center">
          <img src={preview} alt="Report Preview" className="max-w-full max-h-full object-contain" />
          {!isLoading && (
            <button
              onClick={clearImage}
              className="absolute top-2 right-2 bg-white/90 text-slate-700 p-2 rounded-full shadow-sm hover:bg-red-50 hover:text-red-600 transition-colors"
              title="Remove image"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative w-full max-w-md mx-auto border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center text-center transition-all duration-200 bg-white cursor-pointer",
        dragActive ? "border-primary bg-secondary/50" : "border-slate-200 hover:border-primary/50 hover:bg-slate-50",
        isLoading && "opacity-50 pointer-events-none"
      )}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg, image/png"
        onChange={handleChange}
        className="hidden"
      />
      <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4 text-primary">
        <UploadCloud className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-semibold text-slate-800 mb-2">Upload Lab Report</h3>
      <p className="text-sm text-slate-500 max-w-[250px]">
        Drag & drop a clear photo of your lab report here, or click to browse.
      </p>
      <div className="mt-6 flex items-center gap-2 text-xs font-medium text-slate-400">
        <FileImage className="w-4 h-4" />
        Supports JPG, PNG
      </div>
    </div>
  );
}
