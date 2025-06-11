"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="max-w-4xl mx-auto px-4 py-6 sm:py-12">
        {/* Header */}
        <div className="mb-12">
          <Link href="/signin">
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
              Syarat Layanan
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
              Dokumen ini mengatur penggunaan aplikasi KASEP dan melindungi hak-hak Anda sebagai pengguna.
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          <div className="grid gap-6">
            <section className="bg-card/30 rounded-xl p-6 border backdrop-blur-sm hover:bg-card/50 transition-colors">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <span className="text-primary font-bold text-lg">1</span>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-foreground mb-3">Penerimaan Syarat</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Dengan menggunakan aplikasi KASEP (Kalori & Resep), Anda menyetujui untuk terikat dengan syarat dan ketentuan ini. 
                    Jika Anda tidak menyetujui syarat ini, mohon untuk tidak menggunakan layanan kami.
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-card/30 rounded-xl p-6 border backdrop-blur-sm hover:bg-card/50 transition-colors">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <span className="text-primary font-bold text-lg">2</span>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-foreground mb-3">Deskripsi Layanan</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    KASEP adalah aplikasi pintar berbasis pengenalan citra yang menyediakan:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-muted-foreground">Deteksi bahan makanan secara otomatis melalui kamera smartphone</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-muted-foreground">Klasifikasi bahan makanan menggunakan teknologi Machine Learning</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-muted-foreground">Estimasi kandungan kalori berdasarkan bahan yang terdeteksi</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-muted-foreground">Rekomendasi resep sehat dan dinamis berdasarkan bahan yang tersedia</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-muted-foreground">Pemantauan progress kalori harian pengguna</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-muted-foreground">Antarmuka mobile-friendly untuk kemudahan penggunaan sehari-hari</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-card/30 rounded-xl p-6 border backdrop-blur-sm hover:bg-card/50 transition-colors">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <span className="text-primary font-bold text-lg">3</span>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-foreground mb-3">Penggunaan Layanan</h2>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-muted-foreground leading-relaxed">
                        Anda setuju untuk menggunakan layanan ini hanya untuk tujuan yang sah dan sesuai dengan peraturan yang berlaku.
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-muted-foreground leading-relaxed">
                        Anda bertanggung jawab untuk menjaga keamanan akun dan kata sandi Anda.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-card/30 rounded-xl p-6 border backdrop-blur-sm hover:bg-card/50 transition-colors">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-orange-500/10 rounded-lg flex items-center justify-center">
                  <span className="text-orange-600 font-bold text-lg">⚠</span>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-foreground mb-3">Pembatasan Tanggung Jawab</h2>
                  <div className="space-y-4">
                    <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                      <p className="text-muted-foreground leading-relaxed text-sm">
                        <strong className="text-orange-700 dark:text-orange-400">Disclaimer Medis:</strong> 
                        Informasi yang disediakan dalam aplikasi ini hanya untuk tujuan edukasi dan tidak menggantikan konsultasi medis profesional. 
                        Selalu konsultasikan dengan dokter atau ahli gizi sebelum membuat perubahan signifikan pada diet atau gaya hidup Anda.
                      </p>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                      <p className="text-muted-foreground leading-relaxed text-sm">
                        <strong className="text-blue-700 dark:text-blue-400">Akurasi ML:</strong> 
                        Estimasi kalori dan deteksi bahan makanan menggunakan teknologi Machine Learning yang mungkin tidak 100% akurat. 
                        Hasil deteksi dan perhitungan kalori bersifat perkiraan dan dapat bervariasi tergantung kondisi pencahayaan, 
                        kualitas gambar, dan faktor lainnya.
                      </p>
                    </div>
                    <p className="text-muted-foreground leading-relaxed text-sm">
                      Tim KASEP (ID: CC25-CF171) tidak bertanggung jawab atas kerugian atau dampak kesehatan yang mungkin timbul 
                      dari penggunaan aplikasi ini tanpa konsultasi profesional.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-card/30 rounded-xl p-6 border backdrop-blur-sm hover:bg-card/50 transition-colors">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <span className="text-primary font-bold text-lg">5</span>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-foreground mb-3">Perubahan Syarat</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Kami dapat memperbarui syarat layanan ini dari waktu ke waktu. Perubahan akan diberitahukan melalui aplikasi atau email. 
                    Penggunaan berkelanjutan setelah perubahan berarti Anda menyetujui syarat yang telah diperbarui.
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
                    Jika Anda memiliki pertanyaan tentang syarat layanan ini, silakan hubungi tim KASEP di:
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
                        <p className="text-foreground font-medium">kasep.team@gmail.com</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <div>
                        <p className="text-xs text-muted-foreground">Project</p>
                        <p className="text-foreground font-medium">Health Innovation - Kalori & Resep</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <div>
                        <p className="text-xs text-muted-foreground">Institusi</p>
                        <p className="text-foreground font-medium">Telkom University & UIN SGD Bandung</p>
                      </div>
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
              <Link href="/signin">
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