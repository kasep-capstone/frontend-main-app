import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut, Trash2, Settings } from 'lucide-react';

interface AccountActionsProps {
  onLogout: () => void;
  onDeleteAppData: () => void;
}

export const AccountActions: React.FC<AccountActionsProps> = ({
  onLogout,
  onDeleteAppData
}) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Settings className="w-5 h-5 text-amber-600" />
          Keamanan & Aksi
        </CardTitle>
        <CardDescription>
          Kelola sesi dan keamanan akun Google Anda
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <Button 
            variant="outline" 
            className="w-full justify-start gap-3 h-12 hover:bg-orange-50 hover:border-orange-200" 
            onClick={onLogout}
          >
            <LogOut className="w-4 h-4 text-orange-600" />
            <div className="flex flex-col items-start">
              <span>Keluar</span>
              <span className="text-xs text-muted-foreground">Logout dari aplikasi ini</span>
            </div>
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start gap-3 h-12 hover:bg-red-50 hover:border-red-200 text-red-600 border-red-200" 
            onClick={onDeleteAppData}
          >
            <Trash2 className="w-4 h-4" />
            <div className="flex flex-col items-start">
              <span>Hapus Data Aplikasi</span>
              <span className="text-xs text-muted-foreground">Hapus semua data aplikasi, akun Google tetap aman</span>
            </div>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}; 