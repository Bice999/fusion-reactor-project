"use client";

import { useState, useTransition } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, Sparkles, Send } from 'lucide-react';
import { getAiSuggestions } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

export function CheckInCard() {
  const { toast } = useToast();
  const [isCheckingIn, setCheckingIn] = useState(false);
  const [isCheckedIn, setCheckedIn] = useState(false);
  const [isFetchingSuggestions, startFetchingSuggestions] = useTransition();
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleCheckIn = () => {
    setCheckingIn(true);
    setSuggestions([]);
    setTimeout(() => {
      setCheckingIn(false);
      setCheckedIn(true);
      toast({
        title: "Check-in Successful!",
        description: "Your partner has been notified.",
        className: "bg-accent text-accent-foreground border-accent",
      });
      setTimeout(() => setCheckedIn(false), 3000);
    }, 1500);
  };
  
  const handleGetSuggestions = () => {
    startFetchingSuggestions(async () => {
        const fakeLocation = "downtown";
        const result = await getAiSuggestions(fakeLocation);
        setSuggestions(result);
    });
  };

  return (
    <Card className={cn(
        "shadow-lg transition-all duration-500",
        isCheckedIn && "border-accent ring-2 ring-accent/50"
    )}>
      <CardHeader>
        <CardTitle className="text-2xl font-headline">Reassure Your Partner</CardTitle>
        <CardDescription>Perform a quick one-tap check-in to share your status.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={handleCheckIn} 
          disabled={isCheckingIn || isCheckedIn} 
          size="lg" 
          className="w-full text-lg py-6"
        >
          {isCheckingIn ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : isCheckedIn ? (
            <CheckCircle className="mr-2 h-5 w-5" />
          ) : null}
          {isCheckingIn ? 'Checking In...' : isCheckedIn ? 'Checked In!' : 'Check-in Now'}
        </Button>
        <Separator />
        <div className="space-y-3 pt-2">
            <h3 className="font-semibold flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary" /> AI Response Suggestions</h3>
            <p className="text-sm text-muted-foreground">Optionally, generate a message to send with your check-in.</p>
            <Button
                variant="outline"
                onClick={handleGetSuggestions}
                disabled={isFetchingSuggestions}
            >
                {isFetchingSuggestions ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Sparkles className="mr-2 h-4 w-4" />
                )}
                {isFetchingSuggestions ? 'Generating...' : 'Get Suggestions'}
            </Button>
            {suggestions.length > 0 && (
                <div className="space-y-2 pt-2">
                    {suggestions.map((suggestion, index) => (
                        <div key={index} className="flex items-center justify-between gap-2 p-3 bg-muted rounded-md text-sm">
                           <span>{suggestion}</span>
                           <Button size="sm" variant="ghost"><Send className="h-4 w-4" /></Button>
                        </div>
                    ))}
                </div>
            )}
        </div>
      </CardContent>
    </Card>
  );
}
