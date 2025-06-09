import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Twitter, Instagram, Link as LinkIcon } from 'lucide-react';

interface SocialMediaSectionProps {
  onConnectTwitter: () => void;
  onConnectInstagram: () => void;
}

export const SocialMediaSection: React.FC<SocialMediaSectionProps> = ({
  onConnectTwitter,
  onConnectInstagram
}) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <LinkIcon className="w-5 h-5 text-amber-600" />
          Sosial Media
        </CardTitle>
        <CardDescription>
          Hubungkan akun sosial media Anda
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <Button 
            variant="outline" 
            className="w-full justify-start gap-3 h-12 hover:bg-blue-50 hover:border-blue-200" 
            onClick={onConnectTwitter}
          >
            <Twitter className="w-4 h-4 text-blue-500" />
            <span>Hubungkan Twitter</span>
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start gap-3 h-12 hover:bg-pink-50 hover:border-pink-200" 
            onClick={onConnectInstagram}
          >
            <Instagram className="w-4 h-4 text-pink-500" />
            <span>Hubungkan Instagram</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}; 