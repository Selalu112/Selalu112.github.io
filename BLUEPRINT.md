# Blueprint Produk TravelFlow

## Posisi produk

TravelFlow adalah SaaS reservasi shuttle white-label multi-tenant. Satu platform dapat digunakan banyak operator, sementara setiap operator memiliki logo, warna, domain, outlet, armada, staf, rekening, dan data yang terpisah.

## Portal dan peran

### Pelanggan

- Pencarian rute dan jadwal
- Pemilihan kursi
- Pemesanan, pembayaran, e-ticket, dan QR
- Riwayat perjalanan, reschedule, dan pembatalan
- Notifikasi status melalui WhatsApp dan email

### Outlet atau kasir

- Penjualan tiket walk-in
- Pemilihan jadwal dan kursi
- Pencatatan pembayaran tunai/non-tunai
- Cetak tiket dan manifest
- Rekap kas per shift

### Operasional

- Rute, titik naik/turun, jadwal, dan tarif
- Armada, layout kursi, sopir, serta kru
- Penugasan armada ke jadwal
- Manifest dan status keberangkatan
- Reschedule, refund, dan gangguan operasional

### Pemilik atau admin

- Dashboard lintas outlet
- Pengguna dan hak akses
- Promo, komisi agen, dan aturan tarif
- Rekonsiliasi pembayaran
- Auto Report dan audit log
- Pengaturan merek, domain, template pesan, dan dokumen

## Modul MVP

1. Multi-tenant dan white-label
2. Master data kota, outlet, rute, titik singgah, armada, dan layout kursi
3. Jadwal serta inventori kursi per perjalanan
4. Seat hold dengan masa berlaku untuk mencegah double booking
5. Booking, penumpang, kode pesanan, e-ticket, dan QR
6. Payment gateway dan pembayaran kasir
7. Promo, reschedule, pembatalan, serta refund
8. Manifest dan check-in
9. Notifikasi WhatsApp/email
10. Dashboard serta Auto Report

## Auto Report

- Ringkasan penjualan harian, mingguan, dan bulanan
- Pendapatan kotor, diskon, refund, biaya gateway, dan pendapatan bersih
- Okupansi/load factor per rute, jadwal, armada, dan outlet
- Rute dan jam keberangkatan paling produktif
- Performa agen, kasir, serta kanal penjualan
- Rekonsiliasi kas dan pembayaran digital
- Manifest penumpang dan laporan pembatalan
- Pengiriman terjadwal dalam PDF/Excel melalui WhatsApp atau email
- Filter tenant, cabang, periode, rute, kanal, dan metode pembayaran

## Aturan kritis inventori kursi

- Kursi tersedia hanya dapat ditahan oleh satu transaksi aktif.
- Seat hold memiliki waktu kedaluwarsa, misalnya 10 menit.
- Pembayaran sukses mengubah status kursi secara atomik menjadi terjual.
- Pembayaran terlambat masuk ke proses rekonsiliasi, bukan langsung menjual kursi.
- Semua perubahan booking dicatat dalam audit log.

## Arsitektur yang disarankan

- Frontend publik dan admin: Next.js/TypeScript
- API: Laravel atau NestJS
- Database: PostgreSQL
- Cache dan seat hold: Redis
- Penyimpanan dokumen: S3-compatible object storage
- Antrean laporan/notifikasi: Redis Queue
- Deployment awal: Docker pada VPS terkelola
- Aplikasi mobile tahap awal: PWA; Flutter setelah product-market fit

## Tahapan produk

### Tahap 1 — Demo penjualan

- Landing page white-label
- Simulasi pencarian, jadwal, kursi, checkout
- Dashboard Auto Report
- Materi presentasi dan paket harga

### Tahap 2 — MVP operasional

- Backend multi-tenant
- Admin, outlet, inventori kursi, booking, e-ticket
- Payment gateway dan WhatsApp
- Laporan PDF/Excel

### Tahap 3 — Skala

- GPS tracking, aplikasi kru, loyalty, agen, API mitra
- Dynamic pricing dan prediksi okupansi
- Integrasi akuntansi dan OTA

## Model komersial awal

- Starter: satu brand dan maksimal dua outlet
- Growth: multi-outlet, agen, WhatsApp, dan Auto Report terjadwal
- Enterprise: domain khusus, SLA, API, GPS, serta integrasi khusus
- Komponen harga: setup/branding, langganan, biaya integrasi, dan dukungan

Nominal final sebaiknya ditetapkan setelah biaya payment gateway, WhatsApp BSP, server, dukungan, dan target margin diketahui.
