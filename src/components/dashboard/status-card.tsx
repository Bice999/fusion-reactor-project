import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { User, CheckIn } from "@/lib/types";
import { MapPin, Clock } from 'lucide-react';
import placeholderImages from '@/lib/placeholder-images.json';

interface StatusCardProps {
  user: User;
  lastCheckIn: CheckIn | undefined;
}

export function StatusCard({ user, lastCheckIn }: StatusCardProps) {
  const isPartner = user.name !== 'You';
  const avatarData = isPartner ? placeholderImages.partnerAvatar : placeholderImages.userAvatar;
  
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <Avatar className="h-12 w-12 border-2 border-primary/50">
            <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint={avatarData.hint} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="text-xl font-headline">{user.name}'s Status</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {lastCheckIn ? (
          <>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4 text-primary" />
              <span>Last seen <Badge variant="secondary">{lastCheckIn.location}</Badge></span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4 text-primary" />
              <span>{formatDistanceToNow(lastCheckIn.timestamp, { addSuffix: true })}</span>
            </div>
            {lastCheckIn.message && (
              <p className="text-sm text-foreground pt-2 border-t mt-3">"{lastCheckIn.message}"</p>
            )}
          </>
        ) : (
          <p className="text-muted-foreground">No recent check-ins.</p>
        )}
      </CardContent>
    </Card>
  );
}
