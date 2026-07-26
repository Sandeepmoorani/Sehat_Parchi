import React from 'react';
import { HistoryItem } from '@/types';
import { Clock, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';

interface HistorySectionProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
}

export function HistorySection({ history, onSelect }: HistorySectionProps) {
  if (history.length === 0) return null;

  return (
    <div className="w-full max-w-4xl mx-auto mt-16 print:hidden">
      <div className="flex items-center gap-2 mb-6">
        <Clock className="w-5 h-5 text-slate-400" />
        <h3 className="text-lg font-semibold text-slate-800">Recent Reports</h3>
      </div>
      
      <div className="grid md:grid-cols-2 gap-4">
        {history.map((item) => (
          <Card 
            key={item.id}
            className="cursor-pointer hover:border-primary/50 hover:shadow-md transition-all group"
            onClick={() => onSelect(item)}
          >
            <div className="p-4 flex items-center gap-4">
              {item.image ? (
                <div className="w-16 h-16 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0">
                  <img src={item.image} alt="Report thumbnail" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-lg bg-slate-100 flex-shrink-0 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-slate-400" />
                </div>
              )}
              
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-slate-900 truncate">
                  {item.testName || 'Lab Report'}
                </h4>
                <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                  <span>{new Date(item.date).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>{item.language}</span>
                </div>
              </div>
              
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
