import React from 'react';
import { AnalysisResult, Language } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { AlertCircle, Download, FileText, HeartPulse, Info, List, Share2, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReportResultsProps {
  result: AnalysisResult;
  language: Language;
}

export function ReportResults({ result, language }: ReportResultsProps) {
  const isUrdu = language === 'اردو' || language === 'سنڌي';
  const textDirection = isUrdu ? 'rtl' : 'ltr';
  const textClass = isUrdu ? 'font-urdu leading-loose text-right' : 'text-left';

  const handleDownload = () => {
    window.print();
  };

  const handleShare = () => {
    const text = `Check out my lab report analysis from Sehat Parchi: ${result.testName}\n\nSummary: ${result.summary}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 mt-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      
      {/* 1. Test Summary Card */}
      <Card className="border-t-4 border-t-primary">
        <CardHeader className="bg-slate-50/50 pb-4 border-b border-slate-100 rounded-t-2xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-xl md:text-2xl text-slate-800">{result.testName}</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="text-lg text-slate-700 font-medium">{result.summary}</p>
        </CardContent>
      </Card>

      {/* 3. Simple Explanation Card (Moved up for better UX for patients) */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Info className="w-5 h-5 text-blue-500" />
            <CardTitle>Simple Explanation</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div dir={textDirection} className={cn("text-slate-700 space-y-2 text-lg", textClass)}>
            {result.simpleExplanation.split('\n').map((para, i) => (
              <p key={i} className="mb-2">
                {para.trim().startsWith('-') || para.trim().startsWith('*') ? (
                  <span className="flex gap-2 items-start">
                    <span className="text-primary mt-1">•</span>
                    <span>{para.replace(/^[-*]\s*/, '')}</span>
                  </span>
                ) : (
                  para
                )}
              </p>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 2. Values Table Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <List className="w-5 h-5 text-slate-500" />
            <CardTitle>Detailed Values</CardTitle>
          </div>
          <CardDescription>A breakdown of the parameters found in your report</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto p-0">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 font-medium border-y border-slate-200">
              <tr>
                <th className="px-6 py-4">Parameter</th>
                <th className="px-6 py-4">Your Value</th>
                <th className="px-6 py-4">Normal Range</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Meaning</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {result.values.map((val, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">{val.parameter}</td>
                  <td className="px-6 py-4 font-semibold">{val.yourValue}</td>
                  <td className="px-6 py-4 text-slate-500">{val.normalRange}</td>
                  <td className="px-6 py-4">
                    <Badge
                      variant={
                        val.status.toLowerCase() === 'normal' ? 'success' : 
                        val.status.toLowerCase() === 'high' ? 'danger' : 'warning'
                      }
                      className="px-3 py-1"
                    >
                      <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {val.status}
                      </span>
                    </Badge>
                  </td>
                  <td className={cn("px-6 py-4", textClass)} dir={textDirection}>
                    {val.simpleMeaning || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* 4. Diet & Lifestyle Tips Card */}
        <Card className="bg-secondary/30 border-secondary">
          <CardHeader>
            <div className="flex items-center gap-2">
              <HeartPulse className="w-5 h-5 text-primary" />
              <CardTitle>Diet & Lifestyle Tips</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ul dir={textDirection} className={cn("space-y-3", textClass)}>
              {result.dietTips.map((tip, idx) => (
                <li key={idx} className="flex gap-3 items-start">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-bold mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="text-slate-700">{tip}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* 5. When to See Doctor Card */}
        <Card className="bg-amber-50/50 border-amber-100">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-500" />
              <CardTitle>When to see a Doctor?</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p dir={textDirection} className={cn("text-slate-700", textClass)}>
              {result.whenToSeeDoctor}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 6. Disclaimer + Buttons */}
      <Card className="bg-slate-900 text-white border-transparent">
        <CardContent className="pt-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-6 h-6 text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
              <strong>Disclaimer:</strong> {result.disclaimer} <br/>
              This application provides AI-generated explanations for educational purposes only. It is NOT a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0 print:hidden">
            <Button variant="outline" className="text-slate-900 bg-white hover:bg-slate-100" onClick={handleDownload}>
              <Download className="w-4 h-4 mr-2" />
              Save PDF
            </Button>
            <Button onClick={handleShare} className="bg-[#25D366] text-white hover:bg-[#128C7E] border-transparent">
              <Share2 className="w-4 h-4 mr-2" />
              WhatsApp
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
