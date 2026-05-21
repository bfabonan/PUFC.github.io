// =====================
// THEME SWITCHER
// =====================
const themeSwitcher = document.getElementById('theme-switcher');
const themeButtons = themeSwitcher.querySelectorAll('.theme-btn');

// Load saved theme
const savedTheme = localStorage.getItem('pufc-theme') || 'deep-purple-gold';
document.documentElement.setAttribute('data-theme', savedTheme);
themeButtons.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.theme === savedTheme);
});

themeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const theme = btn.dataset.theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('pufc-theme', theme);
        themeButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    });
});

// Navbar scroll effect
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile navigation toggle
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');

navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('open');
    navbar.classList.toggle('menu-open');
});

// Close mobile nav when a link is clicked
navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('open');
        navbar.classList.remove('menu-open');
    });
});

// Scroll animations using Intersection Observer
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, index * 150);
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
});

// =====================
// GALLERY SYSTEM
// =====================
// To add a new album:
// 1. Create a new folder inside /gallery/ (e.g., gallery/my-new-album/)
// 2. Add images named photo-01.svg, photo-02.svg, etc.
// 3. Add an entry to gallery/albums.json with folder name, title, and count
// That's it! The gallery will automatically pick it up.

const albumTabs = document.getElementById('album-tabs');
const galleryGrid = document.getElementById('gallery-grid');

let albums = [];
let activeAlbum = 0;

async function loadGallery() {
    try {
        const response = await fetch('gallery/albums.json');
        albums = await response.json();
        renderAlbumTabs();
        renderAlbumPhotos(0);
    } catch (error) {
        // Fallback if fetch fails (e.g., file:// protocol)
        // Keep this list in sync with gallery/albums.json
        albums = [
            { folder: 'karawat-kawat-2026', title: 'Karawat-kawat 2026', count: 10, format: 'jpg' },
            { folder: 'play-for-peace-2026', title: 'Play for Peace 2026', count: 10, format: 'jpg' }
        ];
        renderAlbumTabs();
        renderAlbumPhotos(0);
    }
}

function renderAlbumTabs() {
    albumTabs.innerHTML = '';
    albums.forEach((album, index) => {
        const tab = document.createElement('button');
        tab.className = `album-tab ${index === 0 ? 'active' : ''}`;
        tab.textContent = album.title;
        tab.addEventListener('click', () => {
            document.querySelectorAll('.album-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            renderAlbumPhotos(index);
        });
        albumTabs.appendChild(tab);
    });
}

function renderAlbumPhotos(albumIndex) {
    activeAlbum = albumIndex;
    const album = albums[albumIndex];
    galleryGrid.innerHTML = '';
    galleryGrid.classList.add('loading');

    for (let i = 1; i <= album.count; i++) {
        const num = String(i).padStart(2, '0');
        const ext = album.format || 'svg';
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.style.animationDelay = `${(i - 1) * 0.05}s`;
        item.style.cursor = 'pointer';

        const img = document.createElement('img');
        img.src = `gallery/${album.folder}/photo-${num}.${ext}`;
        img.alt = `${album.title} - Photo ${i}`;
        img.loading = 'lazy';

        const overlay = document.createElement('div');
        overlay.className = 'gallery-item-overlay';
        overlay.innerHTML = `<span>${album.title}</span><small>Photo ${i}</small>`;

        item.appendChild(img);
        item.appendChild(overlay);
        galleryGrid.appendChild(item);

        // Click to open lightbox
        item.addEventListener('click', () => {
            openLightbox(albumIndex, i - 1);
        });
    }

    // Trigger entrance animation
    requestAnimationFrame(() => {
        galleryGrid.classList.remove('loading');
    });
}

// =====================
// LIGHTBOX
// =====================
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');
const lightboxClose = document.getElementById('lightbox-close');
const lightboxPrev = document.getElementById('lightbox-prev');
const lightboxNext = document.getElementById('lightbox-next');

let currentPhotoIndex = 0;
let currentAlbumIndex = 0;

function openLightbox(albumIdx, photoIdx) {
    currentAlbumIndex = albumIdx;
    currentPhotoIndex = photoIdx;
    updateLightboxImage();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

function updateLightboxImage() {
    const album = albums[currentAlbumIndex];
    const num = String(currentPhotoIndex + 1).padStart(2, '0');
    const ext = album.format || 'svg';
    lightboxImg.src = `gallery/${album.folder}/photo-${num}.${ext}`;
    lightboxImg.alt = `${album.title} - Photo ${currentPhotoIndex + 1}`;
    lightboxCaption.textContent = `${album.title} — Photo ${currentPhotoIndex + 1} of ${album.count}`;
}

function nextPhoto() {
    const album = albums[currentAlbumIndex];
    currentPhotoIndex = (currentPhotoIndex + 1) % album.count;
    updateLightboxImage();
}

function prevPhoto() {
    const album = albums[currentAlbumIndex];
    currentPhotoIndex = (currentPhotoIndex - 1 + album.count) % album.count;
    updateLightboxImage();
}

lightboxClose.addEventListener('click', closeLightbox);
lightboxNext.addEventListener('click', nextPhoto);
lightboxPrev.addEventListener('click', prevPhoto);

// Close on background click
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextPhoto();
    if (e.key === 'ArrowLeft') prevPhoto();
});

// Initialize gallery
loadGallery();

// =====================
// COACHES MODAL
// =====================
const coachesCard = document.getElementById('coaches-card');
const coachesModal = document.getElementById('coaches-modal');
const coachesModalClose = document.getElementById('coaches-modal-close');
const coachesGrid = document.getElementById('coaches-grid');

const defaultCoaches = [
    { name: 'Coach Name 1', role: 'Head Coach', photo: 'images/coaches/coach-01.jpg', bio: 'Add a short introduction about this coach here.' },
    { name: 'Coach Name 2', role: 'Assistant Coach', photo: 'images/coaches/coach-02.jpg', bio: 'Add a short introduction about this coach here.' },
    { name: 'Coach Name 3', role: 'Goalkeeper Coach', photo: 'images/coaches/coach-03.jpg', bio: 'Add a short introduction about this coach here.' },
    { name: 'Coach Name 4', role: 'Fitness Coach', photo: 'images/coaches/coach-04.jpg', bio: 'Add a short introduction about this coach here.' }
];

async function loadCoaches() {
    let coaches;
    try {
        const response = await fetch('data/coaches.json');
        coaches = await response.json();
    } catch (e) {
        coaches = defaultCoaches;
    }
    renderCoaches(coaches);
}

function renderCoaches(coaches) {
    coachesGrid.innerHTML = '';
    coaches.forEach(coach => {
        const card = document.createElement('div');
        card.className = 'coach-card';
        card.innerHTML = `
            <img src="${coach.photo}" alt="${coach.name}" class="coach-photo" onerror="this.src='images/coaches.svg'">
            <div class="coach-info">
                <h3>${coach.name}</h3>
                <p class="coach-role">${coach.role}</p>
                <p class="coach-bio">${coach.bio}</p>
            </div>
        `;
        coachesGrid.appendChild(card);
    });
}

coachesCard.addEventListener('click', () => {
    loadCoaches();
    coachesModal.classList.add('active');
    document.body.style.overflow = 'hidden';
});

coachesModalClose.addEventListener('click', () => {
    coachesModal.classList.remove('active');
    document.body.style.overflow = '';
});

coachesModal.addEventListener('click', (e) => {
    if (e.target === coachesModal) {
        coachesModal.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// =====================
// COPY PHONE NUMBER
// =====================
const phoneCard = document.getElementById('phone-card');
const copyHint = document.getElementById('copy-hint');

phoneCard.addEventListener('click', () => {
    navigator.clipboard.writeText('09985847212').then(() => {
        copyHint.textContent = '✓ Copied!';
        setTimeout(() => {
            copyHint.textContent = 'Tap to copy';
        }, 2000);
    }).catch(() => {
        // Fallback for older browsers
        const temp = document.createElement('input');
        temp.value = '09985847212';
        document.body.appendChild(temp);
        temp.select();
        document.execCommand('copy');
        document.body.removeChild(temp);
        copyHint.textContent = '✓ Copied!';
        setTimeout(() => {
            copyHint.textContent = 'Tap to copy';
        }, 2000);
    });
});

// =====================
// SMOOTH SCROLL
// =====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
