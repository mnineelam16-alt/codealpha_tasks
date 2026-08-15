const filterButtons = Array.from(document.querySelectorAll('.filter-button'));
const galleryCards = Array.from(document.querySelectorAll('.gallery-card'));
const galleryCount = document.getElementById('galleryCount');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxTitle = document.getElementById('lightboxTitle');
const lightboxText = document.getElementById('lightboxText');
const lightboxClose = document.getElementById('lightboxClose');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

let activeFilter = 'all';
let visibleCards = [];
let activeIndex = 0;

function updateGallery() {
  let visibleCount = 0;

  galleryCards.forEach((card) => {
    const matches = activeFilter === 'all' || card.dataset.category === activeFilter;
    card.classList.toggle('is-hidden', !matches);
    if (matches) {
      visibleCount += 1;
    }
  });

  visibleCards = galleryCards.filter((card) => !card.classList.contains('is-hidden'));
  galleryCount.textContent = `Showing ${visibleCount} photo${visibleCount === 1 ? '' : 's'}`;

  if (visibleCards.length === 0) {
    return;
  }

  if (activeIndex >= visibleCards.length) {
    activeIndex = 0;
  }
}

function openLightbox(card) {
  const index = visibleCards.indexOf(card);
  if (index === -1) {
    return;
  }

  activeIndex = index;
  updateLightboxContent();
  lightbox.classList.add('is-open');
  lightbox.setAttribute('aria-hidden', 'false');
}

function updateLightboxContent() {
  const card = visibleCards[activeIndex];
  if (!card) {
    return;
  }

  lightboxImage.src = card.dataset.image;
  lightboxImage.alt = card.dataset.title;
  lightboxTitle.textContent = card.dataset.title;
  lightboxText.textContent = card.dataset.description;
}

function closeLightbox() {
  lightbox.classList.remove('is-open');
  lightbox.setAttribute('aria-hidden', 'true');
}

function showNext() {
  activeIndex = (activeIndex + 1) % visibleCards.length;
  updateLightboxContent();
}

function showPrev() {
  activeIndex = (activeIndex - 1 + visibleCards.length) % visibleCards.length;
  updateLightboxContent();
}

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    filterButtons.forEach((btn) => btn.classList.remove('active'));
    button.classList.add('active');
    activeFilter = button.dataset.filter;
    activeIndex = 0;
    updateGallery();
  });
});

galleryCards.forEach((card) => {
  card.addEventListener('click', (event) => {
    if (event.target.closest('.view-button')) {
      event.stopPropagation();
    }
    openLightbox(card);
  });
});

prevBtn.addEventListener('click', showPrev);
nextBtn.addEventListener('click', showNext);
lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

document.addEventListener('keydown', (event) => {
  if (!lightbox.classList.contains('is-open')) {
    return;
  }

  if (event.key === 'Escape') {
    closeLightbox();
  } else if (event.key === 'ArrowRight') {
    showNext();
  } else if (event.key === 'ArrowLeft') {
    showPrev();
  }
});

updateGallery();
