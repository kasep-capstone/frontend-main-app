"use client";

import React from 'react';
import Link from 'next/link';
import { MenuBarTop } from '@/components/menu-bar-top';
import { MenuBar } from '@/components/menu-bar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, ArrowLeft, Search, BookOpen, Calculator } from 'lucide-react';

export default function NotFound() {
  return (
    <>
      <div className="bg-background pt-16">
        <div className="max-w-md mx-auto px-4 min-h-screen">
          <div className="flex items-center justify-center min-h-[80vh]">
            <div className="w-full text-center space-y-8">
              {/* 404 Display */}
              <div className="space-y-4">
                <div className="text-9xl font-bold text-amber-600 mb-4">404</div>
                <div className="text-6xl mb-4">😕</div>
                <h1 className="text-2xl font-semibold text-foreground mb-2">
                  Halaman Tidak Ditemukan
                </h1>
                <p className="text-muted-foreground leading-relaxed">
                  Maaf, halaman yang Anda cari tidak dapat ditemukan. 
                  Mungkin halaman telah dipindahkan atau URL yang Anda masukkan salah.
                </p>
              </div>

              {/* Quick Actions Card */}
              <Card className="text-left">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Search className="w-5 h-5 text-amber-600" />
                    Aksi Cepat
                  </CardTitle>
                  <CardDescription>
                    Coba beberapa opsi berikut untuk melanjutkan
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link href="/" className="block">
                    <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white">
                      <Home className="w-4 h-4 mr-2" />
                      Kembali ke Beranda
                    </Button>
                  </Link>
                  
                  <Button 
                    onClick={() => window.history.back()}
                    variant="outline" 
                    className="w-full border-amber-600 text-amber-600 hover:bg-amber-50"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Kembali ke Halaman Sebelumnya
                  </Button>
                </CardContent>
              </Card>

              {/* Help Text */}
              <div className="text-sm text-muted-foreground space-y-2">
                <p>Jika masalah berlanjut, silakan hubungi tim support kami.</p>
                <div className="flex items-center justify-center gap-1">
                  <span>Email:</span>
                  <span className="text-amber-600 font-medium">kasep.team@gmail.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
