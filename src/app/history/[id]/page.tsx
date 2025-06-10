'use client'

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { MenuBar } from '@/components/menu-bar';
import { MenuBarTop } from '@/components/menu-bar-top';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ImagePopup from '@/components/image-popup';
import {
  ArrowLeft,
  Clock,
  Users,
  ChefHat,
  Flame,
  Sparkles,
  BadgeCheck,
  Utensils,
  Eye
} from 'lucide-react';
import { DailyFood } from '@/types/dashboard';
import { dailyFoodHistory } from '@/constants/dashboard-data';

export default function FoodDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [selectedImage, setSelectedImage] = useState<{ url: string; alt: string } | null>(null);

  const foodId = parseInt(params.id as string);
  const food = dailyFoodHistory.find(f => f.id === foodId);

  if (!food) {
    return (
      <>
        <MenuBarTop />
        <div className="min-h-screen bg-background pt-16 pb-20">
          <div className="max-w-md mx-auto px-4">
            <div className="flex items-center gap-3 mb-6">
              <Button
                variant="ghost"
                onClick={() => router.back()}
                className="p-2 h-auto hover:bg-amber-50"
              >
                <ArrowLeft className="w-5 h-5 text-amber-600" />
              </Button>
              <h1 className="text-2xl font-bold">Makanan Tidak Ditemukan</h1>
            </div>
            <Card className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <Utensils className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-medium text-lg mb-2">Makanan tidak ditemukan</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Data makanan yang Anda cari tidak tersedia
              </p>
              <Button onClick={() => router.push('/history')} className="bg-amber-600 hover:bg-amber-700">
                Kembali ke History
              </Button>
            </Card>
          </div>
        </div>
        <MenuBar />
      </>
    );
  }

  return (
    <>
      <MenuBarTop />
      <div className="min-h-screen bg-background pt-16 pb-20">
        <div className="max-w-md mx-auto px-4">
          {/* Hero Section */}
          <div className="relative h-64 w-full rounded-xl overflow-hidden mb-6">
            <Image
              src={food.mainImage || food.image}
              alt={food.name}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

            {/* Food Title and Info */}
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
              <h1 className="text-2xl font-bold mb-2">{food.name}</h1>
              <div className="flex items-center gap-3 text-sm">
                <div className="flex items-center gap-1.5 px-2 py-1 bg-amber-500/90 text-white rounded-full backdrop-blur-sm">
                  <Flame className="w-3 h-3" />
                  <span>{food.calories} kcal</span>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1 bg-white/20 text-white rounded-full backdrop-blur-sm">
                  <Clock className="w-3 h-3" />
                  <span>{food.time}</span>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1 bg-white/20 text-white rounded-full backdrop-blur-sm">
                  <span>{food.category}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          {food.description && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BadgeCheck className="w-5 h-5 text-amber-600" />
                  Deskripsi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed -mt-5">{food.description}</p>
              </CardContent>
            </Card>
          )}

          {/* Captured Image Preview */}
          {food.capturedImage && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BadgeCheck className="w-5 h-5 text-amber-600" />
                  Gambar yang Di-scan
                </CardTitle>
                <CardDescription>
                  Foto asli yang diambil saat melakukan scan makanan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className="relative w-full h-48 rounded-xl overflow-hidden border border-border/40 shadow-lg transition-transform duration-300 hover:scale-[1.02] cursor-pointer"
                  onClick={() => setSelectedImage({ url: food.capturedImage!, alt: "Captured ingredients" })}
                >
                  <Image
                    src={food.capturedImage}
                    alt="Captured ingredients"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-200">
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="flex items-center justify-center gap-2 text-white text-sm">
                        <Eye className="w-4 h-4" />
                        <span>Klik untuk memperbesar</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Detected Materials */}
          {food.material && food.material.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-600" />
                  Bahan yang Terdeteksi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {food.material.map((material, index) => (
                    <span
                      key={index}
                      className="px-3 py-2 bg-amber-100 text-amber-800 rounded-full text-sm font-medium"
                    >
                      {material}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Materials Section */}
          {(food.usedMaterial || food.unusedMaterial || food.missingMaterial) && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <ChefHat className="w-5 h-5 text-amber-600" />
                  Bahan-bahan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {food.usedMaterial && food.usedMaterial.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500"></span>
                      Bahan yang digunakan
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {food.usedMaterial.map((material, index) => (
                        <span key={index} className="px-3 py-1.5 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                          {material}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {food.unusedMaterial && food.unusedMaterial.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                      Bahan yang tidak digunakan
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {food.unusedMaterial.map((material, index) => (
                        <span key={index} className="px-3 py-1.5 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                          {material}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {food.missingMaterial && food.missingMaterial.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-500"></span>
                      Bahan yang kurang
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {food.missingMaterial.map((material, index) => (
                        <span key={index} className="px-3 py-1.5 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                          {material}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Steps Section */}
          {food.step && food.step.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <ChefHat className="w-5 h-5 text-amber-600" />
                  Langkah-langkah Memasak
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {food.step.map((step, index) => (
                    <div key={index} className="bg-muted/30 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-sm font-semibold">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm leading-relaxed mb-3">{step.instruction}</p>
                          {step.image && step.image.length > 0 && (
                            <div className="grid grid-cols-2 gap-2">
                              {step.image.map((img, imgIndex) => (
                                <div
                                  key={imgIndex}
                                  className="relative aspect-[4/3] rounded-lg overflow-hidden group cursor-pointer"
                                  onClick={() => setSelectedImage({ url: img, alt: `Step ${index + 1} - Image ${imgIndex + 1}` })}
                                >
                                  <Image
                                    src={img}
                                    alt={`Step ${index + 1} - Image ${imgIndex + 1}`}
                                    fill
                                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Nutrition Info */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-600" />
                Informasi Gizi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-amber-50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Kalori</p>
                  <p className="text-xl font-bold text-amber-700">{food.calories}</p>
                  <p className="text-xs text-muted-foreground">kcal</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Protein</p>
                  <p className="text-xl font-bold text-green-700">~15</p>
                  <p className="text-xs text-muted-foreground">gram</p>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Karbohidrat</p>
                  <p className="text-xl font-bold text-blue-700">~25</p>
                  <p className="text-xs text-muted-foreground">gram</p>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Lemak</p>
                  <p className="text-xl font-bold text-orange-700">~8</p>
                  <p className="text-xs text-muted-foreground">gram</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-3 mb-6">
            <Button
              onClick={() => router.push('/snap')}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3"
            >
              Scan Makanan Serupa
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/history')}
              className="w-full border-amber-200 text-amber-700 hover:bg-amber-50"
            >
              Lihat History Lainnya
            </Button>
          </div>

          {/* Bottom spacing for menu bar */}
          <div className="h-20" />
        </div>
      </div>

      <ImagePopup
        isOpen={selectedImage !== null}
        onClose={() => setSelectedImage(null)}
        imageUrl={selectedImage?.url || ''}
        alt={selectedImage?.alt || ''}
      />

      <div className="flex justify-center">
        <MenuBar />
      </div>
    </>
  );
} 