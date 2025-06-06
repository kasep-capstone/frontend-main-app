import { MenuBar } from '@/components/menu-bar';
import { MenuBarTop } from '@/components/menu-bar-top';
import { ThemeToggle } from '@/components/themes/theme-toggle';
import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { LogOut, Trash2 } from 'lucide-react';

export default function Profile() {
  return (
    <>
      <MenuBarTop/>
      <div className="container mx-auto mt-12 px-4 py-8 min-h-[calc(100vh-8rem)] flex flex-col">
        <div className="max-w-4xl mx-auto flex-1">
          {/* Profile Header */}
          <div className="flex items-center gap-6 mb-8">
            {/* Profile Picture */}
            <div className="relative w-24 h-24 rounded-full overflow-hidden bg-muted flex items-center justify-center text-4xl">
              👤
            </div>
            
            {/* User Info */}
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-2">John Doe</h1>
              <div className="flex gap-4 text-sm text-muted-foreground">
                <div>
                  <span className="font-medium">Gender:</span> Male
                </div>
                <div>
                  <span className="font-medium">Age:</span> 25
                </div>
                <div>
                  <span className="font-medium">Total Calories:</span> 2,500
                </div>
              </div>
            </div>
          </div>
          
          {/* Theme Toggle */}
          <div className="flex justify-center mb-4">
            <ThemeToggle />
          </div>
        </div>

        {/* Action Buttons - Fixed at bottom */}
        <div className="flex flex-col gap-4 mt-auto pt-8 max-w-sm mx-auto w-full">
          <Button variant="outline" className="flex items-center justify-center gap-2">
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
          <Button variant="destructive" className="flex items-center justify-center gap-2">
            <Trash2 className="w-4 h-4" />
            Delete Account
          </Button>
        </div>
      </div>
      <div className="flex justify-center">
        <MenuBar/>
      </div>
    </>
  );
}