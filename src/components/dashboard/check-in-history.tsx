import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { CheckIn } from "@/lib/types";
import { History, User, MapPin } from 'lucide-react';

interface CheckInHistoryProps {
  checkIns: CheckIn[];
}

export function CheckInHistory({ checkIns }: CheckInHistoryProps) {
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="text-primary" />
          Check-in History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-64">
          <ul className="space-y-4">
            {checkIns.map((checkIn) => (
              <li key={checkIn.id} className="flex flex-col p-2 rounded-md border">
                <div className="flex justify-between items-center text-sm font-semibold">
                  <span className="flex items-center gap-1"><User className="h-3 w-3" /> {checkIn.userName}</span>
                  <span className="text-xs text-muted-foreground">{formatDistanceToNow(checkIn.timestamp, { addSuffix: true })}</span>
                </div>
                <div className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                  <MapPin className="h-3 w-3" /> 
                  Checked in from {checkIn.location}
                </div>
                {checkIn.message && (
                  <p className="text-sm mt-1 text-foreground">"{checkIn.message}"</p>
                )}
              </li>
            ))}
          </ul>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
