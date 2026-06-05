'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Brain, Send, Loader2, Sparkles, Lightbulb } from 'lucide-react';
import { askFusionExpert, type FusionExpertOutput } from '@/ai/flows/fusion-expert-flow';

export function FusionAdvisor() {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<{ q: string; a: FusionExpertOutput }[]>([]);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    try {
      const result = await askFusionExpert({ query });
      setHistory(prev => [{ q: query, a: result }, ...prev]);
      setQuery('');
    } catch (error) {
      console.error('Advisor error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="glass-panel text-white border-slate-800 flex flex-col h-[600px]">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Brain className="text-indigo-400 size-5" />
          AI Fusion Advisor
        </CardTitle>
        <CardDescription className="text-slate-400 text-xs">
          Ask technical questions about plasma stability, fuel cycles, or reactor logistics.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden">
        <form onSubmit={handleAsk} className="flex gap-2">
          <Input
            placeholder="e.g. Can we harvest Tritium from weapons?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-600 focus-visible:ring-indigo-500"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            disabled={isLoading}
            className="bg-indigo-600 hover:bg-indigo-500 text-white"
          >
            {isLoading ? <Loader2 className="animate-spin size-4" /> : <Send className="size-4" />}
          </Button>
        </form>

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-6">
            {history.length === 0 && !isLoading && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Sparkles className="size-10 text-slate-700 mb-2" />
                <p className="text-slate-500 text-sm italic font-mono">
                  Advisor online. Awaiting physics queries...
                </p>
              </div>
            )}
            
            {isLoading && (
              <div className="flex items-center gap-3 p-4 rounded-lg bg-indigo-950/20 border border-indigo-900/30 animate-pulse">
                <Brain className="size-5 text-indigo-400" />
                <span className="text-xs text-indigo-300 font-mono tracking-wider">CONSULTING DATABASE...</span>
              </div>
            )}

            {history.map((item, idx) => (
              <div key={idx} className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Query</span>
                  <p className="text-sm font-semibold text-slate-200">{item.q}</p>
                </div>
                
                <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-xl space-y-3">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="size-4 text-amber-400" />
                    <span className="text-[10px] text-amber-400 font-bold uppercase tracking-widest">Expert Analysis</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {item.a.answer}
                  </p>
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800">
                    {item.a.relatedConcepts.map((concept, cIdx) => (
                      <Badge key={cIdx} variant="outline" className="text-[9px] border-slate-700 text-slate-400 bg-slate-950/50">
                        {concept}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
