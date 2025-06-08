import React from 'react';
import { User } from 'lucide-react';
import { ThemeToggle } from '@/components/themes/theme-toggle';

export function ProfileSection() {
  return (
    <div className="mb-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center shadow-lg">
            <User className="w-8 h-8 text-amber-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Welcome Back!</h2>
            <p className="text-muted-foreground">Let's check your progress</p>
          </div>
        </div>
        <ThemeToggle />
      </div>
    </div>
  );
} 