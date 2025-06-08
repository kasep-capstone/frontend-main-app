"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="max-w-4xl mx-auto px-4 py-6 sm:py-12">
        {/* Header */}
        <div className="mb-12">
          <Link href="/auth">
            <Button 
              variant="ghost" 
              size="sm" 
              className="mb-6 -ml-2 text-muted-foreground hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Halaman Masuk
            </Button>
          </Link>
          <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-8 border shadow-lg">
            <h1 className="text-4xl font-bold text-foreground mb-3 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Kebijakan Privasi
            </h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Terakhir diperbarui: {new Date().toLocaleDateString('id-ID', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
            <p className="text-muted-foreground mt-4 text-lg leading-relaxed">
              Kami berkomitmen melindungi privasi dan keamanan data pribadi Anda dalam penggunaan aplikasi KASEP.
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          <div className="grid gap-6">
            <section className="bg-card/30 rounded-xl p-6 border backdrop-blur-sm hover:bg-card/50 transition-colors">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-lg">📊</span>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-foreground mb-3">Informasi yang Kami Kumpulkan</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Aplikasi KASEP mengumpulkan informasi berikut untuk memberikan layanan deteksi bahan makanan dan rekomendasi resep:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-muted-foreground text-sm">Informasi profil dari akun Google (nama, email, foto profil)</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-muted-foreground text-sm">Foto bahan makanan yang Anda scan melalui kamera</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-muted-foreground text-sm">Data hasil deteksi bahan makanan dan estimasi kalori</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-muted-foreground text-sm">Riwayat pemantauan kalori harian</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-muted-foreground text-sm">Preferensi resep dan bahan makanan favorit</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-muted-foreground text-sm">Data interaksi dengan rekomendasi resep</span>
                    </div>
                    <div className="flex items-start gap-3 md:col-span-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-muted-foreground text-sm">Informasi perangkat (untuk optimasi performa model ML)</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-card/30 rounded-xl p-6 border backdrop-blur-sm hover:bg-card/50 transition-colors">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 font-bold text-lg">⚙️</span>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-foreground mb-3">Bagaimana Kami Menggunakan Informasi</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Tim KASEP menggunakan informasi yang dikumpulkan untuk:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-muted-foreground text-sm">Menjalankan model Machine Learning untuk deteksi bahan makanan dari citra</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-muted-foreground text-sm">Menghitung estimasi kandungan kalori berdasarkan bahan yang terdeteksi</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-muted-foreground text-sm">Menyediakan rekomendasi resep sehat berdasarkan bahan yang tersedia</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-muted-foreground text-sm">Menyimpan dan melacak progress kalori harian pengguna</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-muted-foreground text-sm">Meningkatkan akurasi model klasifikasi gambar</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-muted-foreground text-sm">Mengoptimalkan performa aplikasi untuk perangkat mobile</span>
                    </div>
                    <div className="flex items-start gap-3 md:col-span-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-muted-foreground text-sm">Menyediakan fitur riwayat scan dan konsumsi makanan</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-card/30 rounded-xl p-6 border backdrop-blur-sm hover:bg-card/50 transition-colors">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-500/10 rounded-lg flex items-center justify-center">
                  <span className="text-purple-600 font-bold text-lg">🔒</span>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-foreground mb-3">Perlindungan Data</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    KASEP menggunakan teknologi dan praktik keamanan modern untuk melindungi data Anda:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-muted-foreground text-sm">Autentikasi Google OAuth untuk keamanan login</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-muted-foreground text-sm">Penyimpanan data menggunakan Supabase dengan enkripsi</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-muted-foreground text-sm">Backend API berbasis ExpressJS dengan sistem keamanan terintegrasi</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-muted-foreground text-sm">Foto bahan makanan diproses secara lokal pada perangkat saat memungkinkan</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-muted-foreground text-sm">Akses data terbatas hanya untuk tim pengembang yang berwenang</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-muted-foreground text-sm">Hosting pada platform terpercaya (Vercel dan Netlify)</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-card/30 rounded-xl p-6 border backdrop-blur-sm hover:bg-card/50 transition-colors">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-orange-500/10 rounded-lg flex items-center justify-center">
                  <span className="text-orange-600 font-bold text-lg">👀</span>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-foreground mb-3">Berbagi Informasi</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Kami tidak akan menjual, menyewakan, atau membagikan informasi pribadi Anda kepada pihak ketiga, kecuali:
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-muted-foreground text-sm">Dengan persetujuan eksplisit dari Anda</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-muted-foreground text-sm">Untuk mematuhi kewajiban hukum</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-muted-foreground text-sm">Kepada penyedia layanan terpercaya yang membantu operasional aplikasi</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-muted-foreground text-sm">Dalam keadaan darurat untuk melindungi keselamatan pengguna</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-card/30 rounded-xl p-6 border backdrop-blur-sm hover:bg-card/50 transition-colors">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                  <span className="text-emerald-600 font-bold text-lg">👤</span>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-foreground mb-3">Hak Pengguna</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Anda memiliki hak untuk:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-muted-foreground text-sm">Mengakses data pribadi yang kami simpan</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-muted-foreground text-sm">Memperbarui atau mengoreksi informasi yang tidak akurat</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-muted-foreground text-sm">Menghapus akun dan data pribadi Anda</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-muted-foreground text-sm">Menarik persetujuan penggunaan data</span>
                    </div>
                    <div className="flex items-start gap-3 md:col-span-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-muted-foreground text-sm">Mengunduh salinan data pribadi Anda</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-card/30 rounded-xl p-6 border backdrop-blur-sm hover:bg-card/50 transition-colors">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-red-500/10 rounded-lg flex items-center justify-center">
                  <span className="text-red-600 font-bold text-lg">⏰</span>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-foreground mb-3">Retensi Data</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Kami akan menyimpan informasi pribadi Anda selama akun Anda aktif atau sepanjang diperlukan untuk memberikan layanan. 
                    Jika Anda menghapus akun, kami akan menghapus data pribadi Anda dalam waktu 30 hari, kecuali jika diperlukan untuk 
                    kewajiban hukum atau keamanan.
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">🤖</span>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-foreground mb-3">Penggunaan Model Machine Learning</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    KASEP menggunakan model Machine Learning yang dikembangkan secara mandiri untuk:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-muted-foreground text-sm">Model dibangun menggunakan TensorFlow/Keras dengan arsitektur CNN</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-muted-foreground text-sm">Dataset publik seperti Food-101 dan dataset bahan makanan lokal Indonesia</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-muted-foreground text-sm">Model disimpan dalam format .pkl/.joblib untuk integrasi dengan backend</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-muted-foreground text-sm">Proses inferensi dilakukan secara real-time tanpa menyimpan foto permanen</span>
                    </div>
                    <div className="flex items-start gap-3 md:col-span-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-muted-foreground text-sm">Tidak menggunakan model pre-trained komersial atau API eksternal</span>
                    </div>
                  </div>
                  <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-muted-foreground text-sm">
                      <strong className="text-blue-700 dark:text-blue-400">Catatan Penting: </strong> 
                      Foto yang Anda scan dapat digunakan untuk meningkatkan akurasi model (dengan persetujuan), 
                      namun identitas pribadi akan dihapus dari dataset pelatihan.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-card/30 rounded-xl p-6 border backdrop-blur-sm hover:bg-card/50 transition-colors">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <span className="text-primary font-bold text-lg">8</span>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-foreground mb-3">Perubahan Kebijakan</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Sebagai proyek capstone dengan timeline terbatas, perubahan kebijakan akan dikomunikasikan 
                    melalui update aplikasi atau email setidaknya 7 hari sebelum implementasi. 
                    Proyek ini beroperasi dalam konteks akademik dengan fokus pada inovasi kesehatan.
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl p-6 border border-primary/20">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">📧</span>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-foreground mb-3">Hubungi Kami</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Jika Anda memiliki pertanyaan tentang kebijakan privasi ini atau ingin menggunakan hak privasi Anda:
                  </p>
                  <div className="bg-card/60 backdrop-blur-sm rounded-lg p-5 border grid gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <div>
                    <p className="text-xs text-muted-foreground">Tim ID</p>
                    <p className="text-foreground font-medium">CC25-CF171</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-foreground font-medium">kasep.privacy@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <div>
                    <p className="text-xs text-muted-foreground">Project Lead</p>
                    <p className="text-foreground font-medium">Tim KASEP (Health Innovation)</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <div>
                    <p className="text-xs text-muted-foreground">Institusi</p>
                    <p className="text-foreground font-medium">Telkom University & UIN SGD Bandung</p>
                  </div>
                </div>
                                    <div className="mt-3 pt-3 border-t border-muted/50">
                      <p className="text-muted-foreground text-sm">
                        Sebagai proyek capstone, tim kami berkomitmen untuk menjaga privasi data sesuai standar akademik dan etika teknologi.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8">
          <div className="text-center bg-card/30 rounded-xl p-6 border backdrop-blur-sm">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-muted-foreground">
                © 2024 KASEP Team
              </div>
              <Link href="/auth">
                <Button className="bg-primary hover:bg-primary/90 text-white px-6">
                  Kembali ke Halaman Masuk
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 