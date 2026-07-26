'use client';

import React, { useState, useEffect } from 'react';
import { Stethoscope, Activity, FileSearch, Sparkles } from 'lucide-react';
import { Language, AnalysisResult, HistoryItem } from '@/types';
import { LanguageSelector } from '@/components/features/LanguageSelector';
import { UploadArea } from '@/components/features/UploadArea';
import { ReportResults } from '@/components/features/ReportResults';
import { HistorySection } from '@/components/features/HistorySection';
import { Button } from '@/components/ui/Button';
import { fileToBase64 } from '@/lib/utils';

export default function Home() {
  const [language, setLanguage] = useState<Language>('English');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    // Load history
    const saved = localStorage.getItem('sehat_parchi_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse history', e);
      }
    }
  }, []);

  const saveToHistory = (res: AnalysisResult, imgB64: string | null) => {
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      testName: res.testName,
      language,
      data: res,
      // For MVP, saving the image base64 in localStorage might exceed limits quickly.
      // So we will just save a small thumbnail if possible, or null.
      // We will skip saving the full image to avoid quota exceeded error.
      image: imgB64 ? `data:image/jpeg;base64,${imgB64.slice(0, 1000)}` : undefined, // Just enough for a very broken preview, ideally we would resize
    };
    
    // Proper approach: Don't store full base64 in localstorage
    newItem.image = undefined;

    const newHistory = [newItem, ...history].slice(0, 5);
    setHistory(newHistory);
    localStorage.setItem('sehat_parchi_history', JSON.stringify(newHistory));
  };

  const handleImageSelect = async (file: File) => {
    setSelectedFile(file);
    setError(null);
    setResult(null);
    try {
      const b64 = await fileToBase64(file);
      setImageBase64(b64);
    } catch (err) {
      setError('Failed to process image');
    }
  };

  const loadSample = async () => {
    // We will use a mock sample image path or data
    setError(null);
    setResult(null);
    setImageBase64(null);
    setSelectedFile(null);
    
    // For demo, we just fetch a sample image and convert it
    try {
      const response = await fetch('/samples/report1.jpg');
      const blob = await response.blob();
      const file = new File([blob], 'sample.jpg', { type: 'image/jpeg' });
      await handleImageSelect(file);
    } catch (err) {
      setError('Failed to load sample report. Please try uploading one.');
    }
  };

  const analyzeReport = async () => {
    if (!imageBase64) return;
    
    setIsAnalyzing(true);
    setError(null);
    setResult(null);
    
    // Loading steps simulation
    setLoadingStep(1); // Reading
    const stepInterval = setInterval(() => {
      setLoadingStep(prev => prev < 3 ? prev + 1 : prev);
    }, 2000);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64, language }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || 'Analysis failed');
      }

      setResult(data as AnalysisResult);
      saveToHistory(data as AnalysisResult, imageBase64);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      clearInterval(stepInterval);
      setIsAnalyzing(false);
      setLoadingStep(0);
    }
  };

  const loadHistoryItem = (item: HistoryItem) => {
    setResult(item.data);
    setLanguage(item.language);
    setImageBase64(null);
    setSelectedFile(null);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary text-white p-2 rounded-xl">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-xl text-slate-900 tracking-tight">Sehat Parchi</h1>
              <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider hidden sm:block">
                Lab Report Samjhao - Asaan Zabaan Mein
              </p>
            </div>
          </div>
          <a 
            href="https://github.com/Sandeepmoorani/Sehat_Parchi.git" 
            target="_blank" 
            rel="noreferrer"
            className="text-slate-400 hover:text-slate-900 transition-colors"
          >
            <span className="text-sm font-semibold">GitHub</span>
          </a>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        
        {/* Main Interface (Hidden when result is shown, unless we want to show it on top. Let's show on top for MVP) */}
        {!result && (
          <div className="max-w-3xl mx-auto text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
              Understand your Lab Reports
            </h2>
            <p className="text-slate-500 mb-10 text-lg">
              Take a photo of your medical report and get a simple, easy-to-understand explanation in your preferred language.
            </p>

            <LanguageSelector selectedLanguage={language} onLanguageChange={setLanguage} />

            <div className="mb-8">
              <UploadArea onImageSelect={handleImageSelect} isLoading={isAnalyzing} />
            </div>

            {error && (
              <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
                {error}
              </div>
            )}

            {isAnalyzing ? (
              <div className="max-w-md mx-auto p-8 rounded-2xl bg-white border border-slate-100 shadow-sm">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      {loadingStep === 1 && <FileSearch className="w-6 h-6 text-primary animate-pulse" />}
                      {loadingStep === 2 && <Activity className="w-6 h-6 text-primary animate-pulse" />}
                      {loadingStep === 3 && <Sparkles className="w-6 h-6 text-primary animate-pulse" />}
                    </div>
                  </div>
                  
                  <div className="h-6">
                    {loadingStep === 1 && <p className="text-slate-600 animate-pulse font-medium">Reading your report... (OCR)</p>}
                    {loadingStep === 2 && <p className="text-slate-600 animate-pulse font-medium">Understanding values...</p>}
                    {loadingStep === 3 && <p className="text-primary animate-pulse font-medium">Generating explanation in {language}...</p>}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto min-w-[200px] text-lg font-semibold rounded-full shadow-md hover:shadow-lg transition-all"
                  onClick={analyzeReport}
                  disabled={!imageBase64}
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Analyze Report
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="w-full sm:w-auto rounded-full font-medium"
                  onClick={loadSample}
                >
                  Try Sample Report
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="relative">
            <button 
              onClick={() => setResult(null)}
              className="absolute -top-12 left-0 text-sm text-slate-500 hover:text-slate-900 font-medium print:hidden"
            >
              ← Back to upload
            </button>
            <ReportResults result={result} language={language} />
          </div>
        )}

        {/* History */}
        {!result && history.length > 0 && (
          <HistorySection history={history} onSelect={loadHistoryItem} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 text-center print:hidden mt-auto">
        <div className="max-w-7xl mx-auto px-4">
          <p className="font-medium text-slate-300 mb-2">Built for the community with ❤️</p>
          <p className="text-xs">Disclaimer: This tool is for educational purposes and not a substitute for professional medical advice.</p>
        </div>
      </footer>
    </div>
  );
}
