/* ============================================================
   tinyclayshiba — script.js
   ============================================================

   HOW TO ADD PHOTOS
   -----------------
   1. Name your files: shiba1.jpg, shiba2.jpg, shiba3.jpg … (all lowercase)
   2. Drop them into the  assets/gallery/  folder.
   3. Update the TWO numbers below to match how many photos you have
      in each category (or just add more to "all" and set totalImages).

   Each image can optionally belong to a category.
   Edit the  imageData  array below to assign tags.
   ============================================================ */

// ── CONFIGURATION ─────────────────────────────────────────────
//  Change this number whenever you add a new numbered image.
const totalImages = 12;

// ── IMAGE DATA ────────────────────────────────────────────────
//  Assign a category tag to each numbered image.
//  Valid tags: "pots" | "figurines" | "spoonrests" | "bowls" | "giftsets"
//  Leave the array shorter than totalImages and the rest default to "all".
const imageTags = [
  'bowls',      // shiba1.jpg
  'spoonrests', // shiba2.jpg
  'figurines',  // shiba3.jpg
  'figurines',  // shiba4.jpg
  'pots',       // shiba5.jpg
  'bowls',      // shiba6.jpg
  'giftsets',   // shiba7.jpg
  'spoonrests', // shiba8.jpg
  'pots',       // shiba9.jpg
  'figurines',  // shiba10.jpg
  'giftsets',   // shiba11.jpg
  'bowls',      // shiba12.jpg
  // add more lines here as you add images…
];

// ── BUILD IMAGE LIST ──────────────────────────────────────────
const images = Array.from({ length: totalImages }, (_, i) => ({
  src:    `assets/gallery/shiba${i + 1}.jpg`,
  alt:    `Tinyclayshiba ceramic piece ${i + 1}`,
  filter: imageTags[i] || 'all',
}));

// ── DOM REFS ──────────────────────────────────────────────────
const galleryGrid  = document.getElementById('galleryGrid');
const instaGrid    = document.getElementById('instaGrid');
const emptyState   = document.getElementById('emptyState');
const filterBtns   = document.querySelectorAll('.filter-btn');
const categoryCards = document.querySelectorAll('.category-card');
const menuBtn      = document.getElementById('menuBtn');
const mobileMenu   = document.getElementById('mobileMenu');

let currentFilter = 'all';

// ── RENDER GALLERY ────────────────────────────────────────────
function renderGallery(filter) {
  galleryGrid.innerHTML = '';
  const visible = filter === 'all'
    ? images
    : images.filter(img => img.filter === filter);

  if (visible.length === 0) {
    emptyState.classList.remove('hidden');
    return;
  }
  emptyState.classList.add('hidden');

  visible.forEach((img, idx) => {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.style.animationDelay = `${idx * 40}ms`;
    item.dataset.filter = img.filter;
    item.innerHTML = `
      <img src="${img.src}" alt="${img.alt}"
           loading="lazy"
           onerror="this.closest('.gallery-item').classList.add('no-image'); this.remove();" />
      <div class="overlay"><span>View</span></div>
      <noscript><img src="${img.src}" alt="${img.alt}" /></noscript>
    `;
    item.addEventListener('click', () => openLightbox(idx, visible));
    galleryGrid.appendChild(item);
  });
}

// ── RENDER INSTAGRAM STRIP ────────────────────────────────────
//  Shows the first 6 gallery images as a pseudo Instagram feed.
function renderInstaGrid() {
  const strip = images.slice(0, 6);
  instaGrid.innerHTML = '';
  strip.forEach(img => {
    const thumb = document.createElement('a');
    thumb.href   = 'https://www.instagram.com/tinyclayshiba';
    thumb.target = '_blank';
    thumb.rel    = 'noopener';
    thumb.className = 'insta-thumb';
    thumb.innerHTML = `<img src="${img.src}" alt="${img.alt}" loading="lazy"
      onerror="this.parentElement.style.background='#E8DFD0'; this.remove();" />`;
    instaGrid.appendChild(thumb);
  });
}

// ── FILTER BUTTONS ────────────────────────────────────────────
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    renderGallery(currentFilter);
  });
});

// ── CATEGORY CARDS → FILTER GALLERY ──────────────────────────
categoryCards.forEach(card => {
  card.addEventListener('click', e => {
    e.preventDefault();
    const filter = card.dataset.filter;
    // activate matching filter button
    filterBtns.forEach(b => {
      b.classList.toggle('active', b.dataset.filter === filter);
    });
    currentFilter = filter;
    renderGallery(currentFilter);
    // smooth scroll to gallery
    document.getElementById('gallery').scrollIntoView({ behavior: 'smooth' });
  });
});

// ── LIGHTBOX ──────────────────────────────────────────────────
const lightbox = document.createElement('div');
lightbox.id = 'lightbox';
lightbox.innerHTML = `
  <button class="lb-close" aria-label="Close">&times;</button>
  <button class="lb-prev"  aria-label="Previous">&#8249;</button>
  <button class="lb-next"  aria-label="Next">&#8250;</button>
  <div class="lb-img-wrap">
    <img src="" alt="" />
  </div>
  <p class="lb-counter"></p>
`;
document.body.appendChild(lightbox);

const lightboxImg     = lightbox.querySelector('img');
const lightboxCounter = lightbox.querySelector('.lb-counter');

// tracks the *filtered* list shown when the lightbox was opened
let lbList  = [];
let lbIndex = 0;

function openLightbox(index, list) {
  lbList  = list;
  lbIndex = index;
  showLbImage();
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function showLbImage() {
  const item = lbList[lbIndex];
  lightboxImg.classList.remove('lb-loaded');
  lightboxImg.src = item.src;
  lightboxImg.alt = item.alt;
  lightboxImg.onload = () => lightboxImg.classList.add('lb-loaded');
  lightboxCounter.textContent = `${lbIndex + 1} / ${lbList.length}`;
  lightbox.querySelector('.lb-prev').style.visibility = lbList.length > 1 ? 'visible' : 'hidden';
  lightbox.querySelector('.lb-next').style.visibility = lbList.length > 1 ? 'visible' : 'hidden';
}

function lbPrev() { lbIndex = (lbIndex - 1 + lbList.length) % lbList.length; showLbImage(); }
function lbNext() { lbIndex = (lbIndex + 1)                 % lbList.length; showLbImage(); }

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

lightbox.querySelector('.lb-close').addEventListener('click', closeLightbox);
lightbox.querySelector('.lb-prev').addEventListener('click', e => { e.stopPropagation(); lbPrev(); });
lightbox.querySelector('.lb-next').addEventListener('click', e => { e.stopPropagation(); lbNext(); });
lightbox.addEventListener('click', e => { if (e.target === lightbox || e.target.classList.contains('lb-img-wrap')) closeLightbox(); });

document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape')     closeLightbox();
  if (e.key === 'ArrowLeft')  lbPrev();
  if (e.key === 'ArrowRight') lbNext();
});

// swipe support for mobile
let touchStartX = 0;
lightbox.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
lightbox.addEventListener('touchend',   e => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(dx) > 50) dx < 0 ? lbNext() : lbPrev();
});

// ── MOBILE MENU ───────────────────────────────────────────────
menuBtn.addEventListener('click', () => {
  mobileMenu.classList.toggle('hidden');
});

// close mobile menu when a link is clicked
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.add('hidden'));
});

// ── YEAR IN FOOTER ────────────────────────────────────────────
document.getElementById('year').textContent = new Date().getFullYear();

// ── ACTIVE NAV ON SCROLL ──────────────────────────────────────
const sections = ['top', 'gallery', 'about', 'contact'];
const navLinks  = document.querySelectorAll('.nav-link');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        const href = link.getAttribute('href').replace('#', '');
        link.classList.toggle('active', href === entry.target.id || (href === 'top' && entry.target.id === 'top'));
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(id => {
  const el = document.getElementById(id);
  if (el) observer.observe(el);
});

// ── INIT ──────────────────────────────────────────────────────
document.body.style.overflow = ''; // safety: ensure scroll is never locked on load
renderGallery('all');
renderInstaGrid();
