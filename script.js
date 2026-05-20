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
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.style.animationDelay = `${(i - 1) * 0.05}s`;

        const img = document.createElement('img');
        img.src = `gallery/${album.folder}/photo-${num}.svg`;
        img.alt = `${album.title} - Photo ${i}`;
        img.loading = 'lazy';

        const overlay = document.createElement('div');
        overlay.className = 'gallery-item-overlay';
        overlay.innerHTML = `<span>${album.title}</span><small>Photo ${i}</small>`;

        item.appendChild(img);
        item.appendChild(overlay);
        galleryGrid.appendChild(item);
    }

    // Trigger entrance animation
    requestAnimationFrame(() => {
        galleryGrid.classList.remove('loading');
    });
}

// Initialize gallery
loadGallery();

// =====================
// FORM SUBMISSION
// =====================
const form = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const btn = form.querySelector('.submit-btn');
    btn.textContent = 'Sending...';
    btn.disabled = true;

    setTimeout(() => {
        form.classList.add('hidden');
        formSuccess.classList.remove('hidden');
    }, 1000);
});

// Smooth scroll for nav links
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
