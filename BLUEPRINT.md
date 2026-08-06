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

## Cakupan fitur setara platform operator shuttle modern

### Kanal pelanggan

- Beranda, pencarian sekali jalan/pulang-pergi, promo, dan informasi layanan
- Pemilihan kota, outlet/pickup point, tanggal, jumlah penumpang, jadwal, dan kelas armada
- Pemilihan kursi visual, data penumpang, kode promo, dan checkout
- QRIS, virtual account, e-wallet, kartu, serta pembayaran di outlet
- E-ticket/QR, cek booking, reschedule, refund, dan riwayat perjalanan
- Daftar outlet per kota, detail armada/fasilitas, cara bayar, bantuan, syarat, dan blog
- Akun pelanggan, membership, poin, voucher, dan notifikasi

### Shuttle dan operasional

- Master kota, outlet, virtual pickup point, rute, titik singgah, dan zona
- Jadwal berulang/khusus, tarif hari biasa/weekend/musim, kelas armada, dan kuota
- Armada, layout kursi, fasilitas, dokumen, servis, sopir, kru, serta roster
- Dispatch, manifest, check-in/boarding, no-show, perubahan armada, dan keterlambatan
- GPS, estimasi tiba, geofence, histori perjalanan, dan ketepatan waktu
- Penjualan walk-in, kas shift, cetak tiket, agen, deposit, dan komisi

### Express dan layanan tambahan

- Tarif berdasarkan rute, berat aktual/volume, tipe layanan, dan asuransi
- Pickup, sortir, manifest, perjalanan, outlet tujuan, pelacakan resi, dan proof of delivery
- Sewa armada/grup, permintaan penawaran, kalender ketersediaan, dan invoice

### Komersial dan administrasi

- Promo, kode voucher, kuota, segmentasi, loyalty tier, dan membership
- Payment reconciliation, settlement outlet/agen, refund, dan audit log
- White-label logo, warna, domain, aplikasi, e-ticket, invoice, WhatsApp, dan email
- Role-based access untuk owner, admin, operasional, kasir, agen, auditor, sopir, dan pelanggan
- Auto Report PDF/Excel terjadwal melalui WhatsApp/email

## Layar yang tersedia pada demo penjualan

- Landing dan pencarian tiket yang responsif
- Daftar jadwal dan harga
- Pemilihan kursi
- Data pemesan dan pilihan pembayaran
- Simulasi penerbitan e-ticket
- Cek booking/pelacakan resi
- Layanan Shuttle, Express, sewa armada, membership, dan jaringan outlet
- Dashboard, Auto Report, booking, jadwal/armada, outlet/agen, Express, promo/member, branding, dan pengguna

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
