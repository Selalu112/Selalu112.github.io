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
  showToast('Kursi berhasil ditahan selama 10 menit.');
  closeModal();
});

$('.login-button').addEventListener('click', () => showToast('Demo portal login akan tersedia pada tahap MVP.'));
$$('.trip-tab').forEach(tab => tab.addEventListener('click', () => {
  $$('.trip-tab').forEach(item => item.classList.remove('active'));
  tab.classList.add('active');
  if (tab.textContent.includes('Pulang')) showToast('Tanggal pulang akan ditambahkan pada versi berikutnya.');
}));

function renderChart() {
  const values = [62, 74, 66, 88, 79, 95, 86, 100];
  $('#bar-chart').innerHTML = values.map((height, index) => `<div class="bar-column"><div class="bar" style="height:${height}%" data-value="Rp${Math.round(height * .7)} jt"></div><small>M${index + 1}</small></div>`).join('');
}

setDefaultDate();
renderChart();

const initialView = new URLSearchParams(window.location.search).get('view');
if (initialView === 'reports') switchView('reports');
