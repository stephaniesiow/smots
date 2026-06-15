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
    item.addEventListener('click', () => openLightbox(img.src, img.alt));
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
  <button class="close-btn" aria-label="Close">&times;</button>
  <img src="" alt="" />
`;
document.body.appendChild(lightbox);

const lightboxImg = lightbox.querySelector('img');

function openLightbox(src, alt) {
  lightboxImg.src = src;
  lightboxImg.alt = alt;
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

lightbox.querySelector('.close-btn').addEventListener('click', closeLightbox);
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

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
renderGallery('all');
renderInstaGrid();
