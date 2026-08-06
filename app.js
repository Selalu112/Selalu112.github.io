const rupiah = value => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);

const schedules = [
  { id: 1, depart: '06:30', arrive: '09:45', from: 'Grogol', to: 'Dipatiukur', vehicle: 'Premium Shuttle', seats: 7, price: 125000 },
  { id: 2, depart: '09:00', arrive: '12:15', from: 'Bintaro', to: 'Pasteur', vehicle: 'Executive Shuttle', seats: 4, price: 135000 },
  { id: 3, depart: '13:30', arrive: '16:45', from: 'Grogol', to: 'Dipatiukur', vehicle: 'Premium Shuttle', seats: 9, price: 125000 },
  { id: 4, depart: '18:00', arrive: '21:15', from: 'Bintaro', to: 'Pasteur', vehicle: 'Executive Shuttle', seats: 6, price: 145000 }
];

const state = { schedule: null, selectedSeats: [], passengerCount: 1 };
const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const reportsTemplate = $('#admin-panel').innerHTML;
let holdInterval = null;

function setDefaultDate() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  $('#travel-date').value = tomorrow.toISOString().slice(0, 10);
  $('#travel-date').min = new Date().toISOString().slice(0, 10);
}

function showToast(message) {
  const toast = $('#toast');
  toast.textContent = message;
  toast.classList.add('show');
  window.setTimeout(() => toast.classList.remove('show'), 2600);
}

function switchView(view) {
  $$('.view').forEach(item => item.classList.toggle('active', item.id === `${view}-view`));
  $$('.nav-link[data-view]').forEach(item => item.classList.toggle('active', item.dataset.view === view));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

$$('.nav-link[data-view]').forEach(button => button.addEventListener('click', () => switchView(button.dataset.view)));
$$('[data-view="reports"]').forEach(button => button.addEventListener('click', () => switchView('reports')));

$('#swap-route').addEventListener('click', () => {
  const origin = $('#origin');
  const destination = $('#destination');
  [origin.value, destination.value] = [destination.value, origin.value];
});

$('#search-form').addEventListener('submit', event => {
  event.preventDefault();
  const origin = $('#origin').value;
  const destination = $('#destination').value;
  if (origin === destination) {
    showToast('Kota asal dan tujuan harus berbeda.');
    return;
  }
  state.passengerCount = Number($('#passengers').value);
  $('#route-title').textContent = `${origin} → ${destination}`;
  const date = new Date(`${$('#travel-date').value}T12:00:00`);
  $('#result-date').textContent = date.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' });
  $('#schedule-list').innerHTML = schedules.map(schedule => `
    <article class="schedule">
      <div class="schedule-time"><strong>${schedule.depart}</strong><i></i><strong>${schedule.arrive}</strong></div>
      <div><b>${schedule.from} → ${schedule.to}</b><small>${schedule.vehicle} • Estimasi 3j 15m</small></div>
      <div class="schedule-price"><strong>${rupiah(schedule.price)}</strong><small>${schedule.seats} kursi tersedia</small></div>
      <button data-schedule="${schedule.id}">Pilih Kursi</button>
    </article>`).join('');
  $('#results').classList.remove('hidden');
  $('#results').scrollIntoView({ behavior: 'smooth', block: 'start' });
});

$('#schedule-list').addEventListener('click', event => {
  const button = event.target.closest('[data-schedule]');
  if (!button) return;
  openSeatModal(Number(button.dataset.schedule));
});

function openSeatModal(id) {
  state.schedule = schedules.find(schedule => schedule.id === id);
  state.selectedSeats = [];
  const route = `${$('#origin').value} → ${$('#destination').value}`;
  $('#seat-title').textContent = route;
  $('#summary-route').textContent = route;
  $('#selected-schedule').textContent = `${state.schedule.depart} • ${state.schedule.from} • ${state.schedule.vehicle}`;
  const occupied = [2, 5, 9, 14, 18];
  $('#seat-grid').innerHTML = Array.from({ length: 20 }, (_, index) => {
    const number = index + 1;
    return `<button class="seat ${occupied.includes(number) ? 'occupied' : ''}" data-seat="${number}" ${occupied.includes(number) ? 'disabled' : ''}>${number}</button>`;
  }).join('');
  updateSummary();
  $('#seat-modal').classList.add('open');
  $('#seat-modal').setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  $('#seat-modal').classList.remove('open');
  $('#seat-modal').setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

$$('[data-close-modal]').forEach(element => element.addEventListener('click', closeModal));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeModal(); });

$('#seat-grid').addEventListener('click', event => {
  const seat = event.target.closest('[data-seat]');
  if (!seat || seat.disabled) return;
  const number = Number(seat.dataset.seat);
  if (state.selectedSeats.includes(number)) {
    state.selectedSeats = state.selectedSeats.filter(item => item !== number);
  } else if (state.selectedSeats.length < state.passengerCount) {
    state.selectedSeats.push(number);
  } else {
    showToast(`Maksimal ${state.passengerCount} kursi sesuai jumlah penumpang.`);
  }
  $$('.seat').forEach(item => item.classList.toggle('selected', state.selectedSeats.includes(Number(item.dataset.seat))));
  updateSummary();
});

function updateSummary() {
  $('#summary-seats').textContent = state.selectedSeats.length ? state.selectedSeats.sort((a, b) => a - b).join(', ') : 'Belum dipilih';
  $('#summary-total').textContent = rupiah((state.schedule?.price || 0) * state.selectedSeats.length);
  $('#continue-button').disabled = state.selectedSeats.length !== state.passengerCount;
}

$('#continue-button').addEventListener('click', () => {
  closeModal();
  openCheckout();
});

function openCheckout() {
  const route = `${$('#origin').value} → ${$('#destination').value}`;
  $('#checkout-route').textContent = route;
  $('#checkout-schedule').textContent = `${state.schedule.depart} • ${state.schedule.from} → ${state.schedule.to}`;
  $('#checkout-seats').textContent = state.selectedSeats.join(', ');
  $('#checkout-total').textContent = rupiah(state.schedule.price * state.selectedSeats.length);
  $('#checkout-modal').classList.add('open');
  $('#checkout-modal').setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  let seconds = 599;
  clearInterval(holdInterval);
  holdInterval = setInterval(() => {
    seconds = Math.max(0, seconds - 1);
    const minutes = String(Math.floor(seconds / 60)).padStart(2, '0');
    const rest = String(seconds % 60).padStart(2, '0');
    $('#hold-timer').textContent = `${minutes}:${rest}`;
  }, 1000);
}

function closeCheckout() {
  $('#checkout-modal').classList.remove('open');
  $('#checkout-modal').setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  clearInterval(holdInterval);
}

$$('[data-close-checkout]').forEach(item => item.addEventListener('click', closeCheckout));
$('#checkout-form').addEventListener('submit', event => {
  event.preventDefault();
  closeCheckout();
  showToast('Pembayaran berhasil. E-ticket TF-260806-A82K telah diterbitkan.');
});

function openTracking() {
  $('#tracking-result').classList.add('hidden');
  $('#tracking-modal').classList.add('open');
  $('#tracking-modal').setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeTracking() {
  $('#tracking-modal').classList.remove('open');
  $('#tracking-modal').setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

$('#check-booking-button').addEventListener('click', openTracking);
$('#track-package-button').addEventListener('click', openTracking);
$$('[data-close-tracking]').forEach(item => item.addEventListener('click', closeTracking));
$('#tracking-form').addEventListener('submit', event => {
  event.preventDefault();
  $('#tracking-result').classList.remove('hidden');
});
$('#inline-tracking-form').addEventListener('submit', event => { event.preventDefault(); openTracking(); });
$$('[data-scroll-booking]').forEach(item => item.addEventListener('click', () => $('#home').scrollIntoView({ behavior: 'smooth' })));
$$('.demo-action').forEach(item => item.addEventListener('click', () => showToast('Modul ini tersedia dan dapat disesuaikan untuk operator.')));
$$('.trip-tab').forEach(tab => tab.addEventListener('click', () => {
  $$('.trip-tab').forEach(item => item.classList.remove('active'));
  tab.classList.add('active');
  if (tab.textContent.includes('Pulang')) showToast('Tanggal pulang akan ditambahkan pada versi berikutnya.');
}));

function renderChart() {
  const values = [62, 74, 66, 88, 79, 95, 86, 100];
  $('#bar-chart').innerHTML = values.map((height, index) => `<div class="bar-column"><div class="bar" style="height:${height}%" data-value="Rp${Math.round(height * .7)} jt"></div><small>M${index + 1}</small></div>`).join('');
}

const adminTemplates = {
  dashboard: () => `
    <header class="report-header"><div><span class="mobile-report-label">TravelFlow Admin</span><h1>Dashboard Operasional</h1><p>Pantau keberangkatan, penjualan, dan aktivitas outlet hari ini.</p></div><div class="report-actions"><button class="export-button">+ Booking Baru</button></div></header>
    <div class="stat-grid"><article><span>Keberangkatan hari ini</span><strong>86</strong><small class="up">74 tepat waktu</small></article><article><span>Penumpang</span><strong>1.284</strong><small class="up">82,6% okupansi</small></article><article><span>Penjualan hari ini</span><strong>Rp142 jt</strong><small class="up">↑ 14,2%</small></article><article><span>Perlu tindakan</span><strong>7</strong><small class="down">3 jadwal • 4 pembayaran</small></article></div>
    <div class="module-grid" style="margin-top:15px"><article class="module-card"><span class="module-icon">◫</span><h3>Keberangkatan terdekat</h3><p>Jakarta → Bandung • 09.00<br>Armada B 7214 TF • 12/14 kursi</p><div class="progress-line"><i style="width:86%"></i></div></article><article class="module-card"><span class="module-icon">⌖</span><h3>Armada aktif</h3><p>42 armada dalam perjalanan<br>3 armada menunggu keberangkatan</p><div class="progress-line"><i style="width:72%"></i></div></article><article class="module-card"><span class="module-icon">▤</span><h3>Transaksi terbaru</h3><p>TF-260806-A82K • QRIS<br>Jakarta → Bandung • Rp250.000</p><span class="admin-status">Lunas</span></article></div>`,
  bookings: () => `
    <header class="report-header"><div><h1>Pemesanan & Tiket</h1><p>Kelola booking online, transaksi outlet, reschedule, dan refund.</p></div><div class="report-actions"><button class="export-button">+ Booking Baru</button></div></header>
    <div class="admin-toolbar"><div class="report-actions"><select><option>Semua kanal</option><option>Website</option><option>Outlet</option><option>Agen</option></select><select><option>Semua status</option><option>Lunas</option><option>Menunggu</option></select></div></div>
    <div class="admin-table"><div class="admin-row"><span>Kode / pelanggan</span><span>Perjalanan</span><span>Jadwal</span><span>Total</span><span>Status</span></div><div class="admin-row"><span><b>TF-A82K</b><small>Muhtar • Website</small></span><span>Jakarta → Bandung<small>Grogol → Dipatiukur</small></span><span>06 Agu • 09.00</span><strong>Rp250.000</strong><span class="admin-status">Lunas</span></div><div class="admin-row"><span><b>TF-P91C</b><small>Rani • Outlet</small></span><span>Bandung → Jakarta<small>Pasteur → Bintaro</small></span><span>06 Agu • 13.30</span><strong>Rp135.000</strong><span class="admin-status">Check-in</span></div><div class="admin-row"><span><b>TF-K77M</b><small>Dedi • Agen</small></span><span>Jakarta → Semarang<small>Cawang → Banyumanik</small></span><span>06 Agu • 18.00</span><strong>Rp325.000</strong><span class="admin-status">Menunggu</span></div></div>`,
  operations: () => `
    <header class="report-header"><div><h1>Jadwal & Armada</h1><p>Atur rute, tarif, layout kursi, sopir, dan penugasan armada.</p></div><div class="report-actions"><button class="export-button">+ Jadwal</button></div></header>
    <div class="module-grid"><article class="module-card"><span class="module-icon">↔</span><h3>128 Rute aktif</h3><p>Tarif berdasarkan outlet, kelas armada, hari, dan musim.</p><span class="admin-status">Kelola rute</span></article><article class="module-card"><span class="module-icon">◫</span><h3>86 Jadwal hari ini</h3><p>74 tepat waktu, 9 boarding, dan 3 memerlukan perhatian.</p><span class="admin-status">Buka dispatch</span></article><article class="module-card"><span class="module-icon">▰</span><h3>48 Armada</h3><p>42 aktif, 3 tersedia, 2 servis rutin, dan 1 inspeksi.</p><span class="admin-status">Kelola armada</span></article><article class="module-card"><span class="module-icon">♙</span><h3>56 Sopir & kru</h3><p>Jadwal kerja, dokumen, performa, dan riwayat perjalanan.</p></article><article class="module-card"><span class="module-icon">▦</span><h3>Layout kursi</h3><p>Konfigurasi 8, 10, 12, 14, atau layout custom per armada.</p></article><article class="module-card"><span class="module-icon">⌖</span><h3>GPS & ketepatan waktu</h3><p>Lokasi armada, estimasi tiba, geofence, dan histori perjalanan.</p></article></div>`,
  network: () => `
    <header class="report-header"><div><h1>Outlet & Agen</h1><p>Kelola jaringan penjualan, pickup point, kasir, dan komisi agen.</p></div><div class="report-actions"><button class="export-button">+ Outlet / Agen</button></div></header>
    <div class="stat-grid"><article><span>Outlet aktif</span><strong>31</strong><small>8 kota</small></article><article><span>Pickup point</span><strong>74</strong><small>Virtual & physical</small></article><article><span>Agen aktif</span><strong>126</strong><small class="up">↑ 8 bulan ini</small></article><article><span>Penjualan agen</span><strong>Rp86 jt</strong><small>17,7% total</small></article></div>
    <div class="admin-table" style="margin-top:15px"><div class="admin-row"><span>Outlet</span><span>Kota / alamat</span><span>Penjualan</span><span>Okupansi</span><span>Status</span></div><div class="admin-row"><span><b>Grogol</b><small>Outlet utama</small></span><span>Jakarta<small>Jl. Daan Mogot KM 1</small></span><strong>Rp42,8 jt</strong><span>89%</span><span class="admin-status">Aktif</span></div><div class="admin-row"><span><b>Pasteur</b><small>Outlet utama</small></span><span>Bandung<small>Jl. Dr. Djunjunan</small></span><strong>Rp38,4 jt</strong><span>87%</span><span class="admin-status">Aktif</span></div></div>`,
  express: () => `
    <header class="report-header"><div><h1>Express & Pelacakan Resi</h1><p>Kelola tarif paket, pickup, manifest, tracking, dan proof of delivery.</p></div><div class="report-actions"><button class="export-button">+ Kiriman Baru</button></div></header>
    <div class="stat-grid"><article><span>Paket hari ini</span><strong>684</strong><small class="up">↑ 11,6%</small></article><article><span>Dalam perjalanan</span><strong>328</strong><small>18 manifest</small></article><article><span>Terkirim</span><strong>342</strong><small>98,2% tepat waktu</small></article><article><span>Perlu tindakan</span><strong>14</strong><small class="down">Alamat / keterlambatan</small></article></div>
    <div class="module-grid" style="margin-top:15px"><article class="module-card"><span class="module-icon">▣</span><h3>Tarif & zona</h3><p>Berat aktual/volume, kota asal-tujuan, same-day, dan asuransi.</p></article><article class="module-card"><span class="module-icon">⌖</span><h3>Tracking event</h3><p>Pickup, sortir, manifest, perjalanan, outlet tujuan, dan POD.</p></article><article class="module-card"><span class="module-icon">✓</span><h3>Proof of Delivery</h3><p>Nama penerima, foto, tanda tangan, waktu, dan lokasi serah-terima.</p></article></div>`,
  promos: () => `
    <header class="report-header"><div><h1>Promo & Membership</h1><p>Kelola voucher, aturan diskon, poin, tier, dan segmentasi pelanggan.</p></div><div class="report-actions"><button class="export-button">+ Promo Baru</button></div></header>
    <div class="module-grid"><article class="module-card"><span class="module-icon">◇</span><h3>Promo rute</h3><p>Diskon berdasarkan rute, jadwal, kanal, kode voucher, dan kuota.</p><span class="admin-status">12 aktif</span></article><article class="module-card"><span class="module-icon">★</span><h3>Membership tier</h3><p>Silver, Gold, dan Platinum dengan poin serta benefit berbeda.</p><span class="admin-status">8.426 member</span></article><article class="module-card"><span class="module-icon">◎</span><h3>Segmentasi</h3><p>Pelanggan baru, loyal, dorman, rute favorit, dan nilai transaksi.</p></article></div>`,
  branding: () => `
    <header class="report-header"><div><h1>Branding White-label</h1><p>Sesuaikan identitas platform untuk setiap operator.</p></div><div class="report-actions"><button class="export-button">Simpan Branding</button></div></header>
    <div class="module-grid"><article class="module-card"><span class="module-icon">TF</span><h3>Logo & warna</h3><p>Logo utama, ikon aplikasi, palet warna, tipografi, dan banner.</p></article><article class="module-card"><span class="module-icon">www</span><h3>Domain & aplikasi</h3><p>Domain operator, nama aplikasi, splash screen, dan store listing.</p></article><article class="module-card"><span class="module-icon">✉</span><h3>Template komunikasi</h3><p>E-ticket, invoice, WhatsApp, email, kebijakan, dan footer dokumen.</p></article></div><div class="admin-note">Demo ini memakai TravelFlow. Saat onboarding, seluruh identitas dapat diganti menjadi merek perusahaan customer.</div>`,
  users: () => `
    <header class="report-header"><div><h1>Pengguna & Hak Akses</h1><p>Kontrol akses owner, admin, operasional, kasir, agen, dan auditor.</p></div><div class="report-actions"><button class="export-button">+ Pengguna</button></div></header>
    <div class="module-grid"><article class="module-card"><span class="module-icon">♙</span><h3>Owner</h3><p>Akses seluruh outlet, laporan, rekonsiliasi, dan konfigurasi.</p></article><article class="module-card"><span class="module-icon">▤</span><h3>Kasir & operasional</h3><p>Akses terbatas berdasarkan outlet, fungsi, dan jadwal kerja.</p></article><article class="module-card"><span class="module-icon">◎</span><h3>Agen</h3><p>Portal khusus penjualan, deposit, komisi, dan histori transaksi.</p></article></div>`
};

function renderAdminPage(page) {
  const panel = $('#admin-panel');
  panel.innerHTML = page === 'reports' ? reportsTemplate : adminTemplates[page]();
  $$('.sidebar-item[data-admin-page]').forEach(item => item.classList.toggle('active', item.dataset.adminPage === page));
  if (page === 'reports') renderChart();
}

$$('.sidebar-item[data-admin-page]').forEach(item => item.addEventListener('click', () => renderAdminPage(item.dataset.adminPage)));

setDefaultDate();
renderChart();

const initialView = new URLSearchParams(window.location.search).get('view');
if (initialView === 'reports') switchView('reports');
const initialAdmin = new URLSearchParams(window.location.search).get('admin');
if (initialAdmin && adminTemplates[initialAdmin]) renderAdminPage(initialAdmin);
const initialDemo = new URLSearchParams(window.location.search).get('demo');
if (initialDemo === 'checkout') {
  state.schedule = schedules[0];
  state.selectedSeats = [1];
  openCheckout();
}
if (initialDemo === 'tracking') openTracking();
