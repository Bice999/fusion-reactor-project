"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Copy, Link2 } from "lucide-react";

export function LinkCard() {
  const { toast } = useToast();
  const [partnerCode, setPartnerCode] = useState('');
  const secureCode = "TLink-A8B2-C3D4-E5F6";

  const handleCopy = () => {
    navigator.clipboard.writeText(secureCode);
    toast({
      title: "Copied to clipboard!",
      description: "Your secure code has been copied.",
    });
  };

  const handleLink = () => {
    if (partnerCode.trim() === '') {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter your partner's code.",
      });
      return;
    }
    toast({
      title: "Successfully Linked!",
      description: "You are now connected with your partner.",
      className: "bg-accent text-accent-foreground",
    });
    setPartnerCode('');
  };

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link2 className="text-primary" />
          Link with Your Partner
        </CardTitle>
        <CardDescription>Share your code or enter your partner's code to connect.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="your-code">Your Secure Code</Label>
          <div className="flex items-center gap-2">
            <Input id="your-code" value={secureCode} readOnly className="font-mono bg-muted" />
            <Button variant="outline" size="icon" onClick={handleCopy} aria-label="Copy code">
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="partner-code">Enter Partner's Code</Label>
          <Input 
            id="partner-code" 
            placeholder="e.g., TLink-G7H8-I9J0-K1L2" 
            value={partnerCode}
            onChange={(e) => setPartnerCode(e.target.value)}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handleLink}>
          Link Account
        </Button>
      </CardFooter>
    </Card>
  );
}
