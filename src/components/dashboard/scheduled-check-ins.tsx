import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Clock } from 'lucide-react';
import type { ScheduledCheckIn } from "@/lib/types";

interface ScheduledCheckInsProps {
  checkIns: ScheduledCheckIn[];
}

export function ScheduledCheckIns({ checkIns }: ScheduledCheckInsProps) {
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="text-primary" />
          Scheduled Check-ins
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {checkIns.map((checkIn) => (
            <li key={checkIn.id} className="flex items-center justify-between p-3 bg-muted rounded-md">
              <span className="font-medium">{checkIn.label}</span>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{checkIn.time}</span>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
