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
        document.body.classList.add('theme-transitioning');
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('pufc-theme', theme);
        themeButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        setTimeout(() => {
            document.body.classList.remove('theme-transitioning');
        }, 600);
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
// Each album is a thumbnail that links to a Facebook album.
// To add a new album: add an entry to gallery/albums.json with title, thumbnail, and url.

const galleryAlbums = document.getElementById('gallery-albums');

let albums = [];

async function loadGallery() {
    try {
        const response = await fetch('gallery/albums.json');
        albums = await response.json();
    } catch (error) {
        albums = [
            { title: 'Play for Peace 2026', thumbnail: 'gallery/play-for-peace-2026/photo-01.jpg', url: 'https://www.facebook.com/PrestigeSportsandWellness/posts/pfbid029hEEdFgn2dRsKnvjTds4aYSLMYyWgmssMSJmt6F8C8zmVnaEumzwWAeyJef1B72Wl' },
            { title: 'Karawat-kawat 2026', thumbnail: 'gallery/karawat-kawat-2026/photo-01.jpg', url: 'https://www.facebook.com/PrestigeSportsandWellness/posts/pfbid02o2yTb8CJgxr36A1TkCYxGRbkgviYuEEe7rityVH1eaqi5WKgNeUCRgv6JgidKkp5l' },
            { title: 'JVF Cup 2026', thumbnail: 'gallery/jvf-cup-2026/photo-01.jpg', url: 'https://www.facebook.com/PrestigeUnionFc/posts/pfbid02fnxBKfV6BQeA4jukf3C8JFE5SCD99z8WR8hgP6AXsxWu2Ew5C2TCmV1awEANqjDMl' }
        ];
    }
    renderAlbums();
}

function renderAlbums() {
    galleryAlbums.innerHTML = '';
    albums.forEach((album, index) => {
        const link = document.createElement('a');
        link.href = album.url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.className = 'gallery-album-card';
        link.style.animationDelay = `${index * 0.1}s`;

        link.innerHTML = `
            <div class="album-thumb">
                <img src="${album.thumbnail}" alt="${album.title}" loading="lazy">
            </div>
            <div class="album-info">
                <h3>${album.title}</h3>
                <span class="album-link-hint">View on Facebook →</span>
            </div>
        `;

        galleryAlbums.appendChild(link);
    });
}

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
// CALENDAR OF ACTIVITIES
// =====================
const calendarGrid = document.getElementById('calendar-grid');

const defaultCalendar = [
    { date: '2026-01', title: 'Friendly Match vs. Local FC', description: '', type: 'training' },
    { date: '2026-02', title: 'Community Service', description: '', type: 'event' },
    { date: '2026-03', title: 'Season Ender and Inhouse Cup', description: '', type: 'tournament' },
    { date: '2026-04', title: 'Summer Camp', description: 'Summer camp with Fiestahan - donation drive event', type: 'event' },
    { date: '2026-05', title: 'Tune up Matches and Tournaments', description: '', type: 'tournament' },
    { date: "2026-05-29", title: "PUFC Anniversary", description: "", type: "event" },
    { date: '2026-06', title: 'Bootcamp opening', description: '', type: 'training' },
    { date: '2026-07', title: 'Prestige Cup Football Fiesta', description: '', type: 'tournament' },
    { date: '2026-08', title: 'Individual coaching with guest coaches', description: '', type: 'training' },
    { date: '2026-09', title: 'Bootcam Ender and Football Break', description: '', type: 'event' },
    { date: '2026-10', title: 'Opening of Team Camp', description: 'Team building, Sports touring, Scouting event', type: 'event' },
    { date: '2026-11', title: 'Family Day and Sports Fest', description: '', type: 'tournament' },
    { date: '2026-12', title: 'Academy season completion and culminating event', description: 'Year end party', type: 'event' }
];

async function loadCalendar() {
    let events;
    try {
        const response = await fetch('data/calendar.json');
        events = await response.json();
    } catch (e) {
        events = defaultCalendar;
    }

    // Sort by month then day
    const monthOrder = {
        'january': 1, 'february': 2, 'march': 3, 'april': 4,
        'may': 5, 'june': 6, 'july': 7, 'august': 8,
        'september': 9, 'october': 10, 'november': 11, 'december': 12
    };

    function getSortKey(event) {
        if (event.date && event.date.match(/^\d{4}-\d{2}-\d{2}$/)) {
            // Full date: YYYY-MM-DD
            const d = new Date(event.date);
            return { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() };
        } else if (event.date && event.date.match(/^\d{4}-\d{2}$/)) {
            // Year-month: YYYY-MM
            const parts = event.date.split('-');
            return { year: parseInt(parts[0]), month: parseInt(parts[1]), day: 0 };
        } else if (event.date) {
            // Month name only
            const lower = event.date.toLowerCase().trim();
            const m = monthOrder[lower];
            if (m) return { year: 9999, month: m, day: 0 };
            return { year: 9999, month: 99, day: 0 };
        }
        return { year: 9999, month: 99, day: 99 };
    }

    events.sort((a, b) => {
        const keyA = getSortKey(a);
        const keyB = getSortKey(b);
        if (keyA.year !== keyB.year) return keyA.year - keyB.year;
        if (keyA.month !== keyB.month) return keyA.month - keyB.month;
        return keyA.day - keyB.day;
    });

    renderCalendar(events);
}

function renderCalendar(events) {
    calendarGrid.innerHTML = '';

    if (events.length === 0) {
        calendarGrid.innerHTML = '<div class="calendar-empty">No upcoming events. Check back soon!</div>';
        return;
    }

    const monthAbbr = {
        'january': 'Jan', 'february': 'Feb', 'march': 'Mar',
        'april': 'Apr', 'may': 'May', 'june': 'Jun',
        'july': 'Jul', 'august': 'Aug', 'september': 'Sep',
        'october': 'Oct', 'november': 'Nov', 'december': 'Dec'
    };

    events.forEach(event => {
        let day = '';
        let month = '';

        if (event.date && event.date.match(/^\d{4}-\d{2}-\d{2}$/)) {
            // Full date format: YYYY-MM-DD
            const dateObj = new Date(event.date);
            day = dateObj.getDate();
            month = dateObj.toLocaleString('en', { month: 'short' });
        } else if (event.date && event.date.match(/^\d{4}-\d{2}$/)) {
            // Year-month format: YYYY-MM
            const parts = event.date.split('-');
            const dateObj = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, 1);
            day = dateObj.toLocaleString('en', { month: 'short' });
            month = parts[0];
        } else if (event.date) {
            // Month name or abbreviation
            const lower = event.date.toLowerCase().trim();
            if (monthAbbr[lower]) {
                day = monthAbbr[lower];
                month = '';
            } else {
                // Already abbreviated or custom text
                day = event.date;
                month = '';
            }
        } else {
            day = '—';
            month = '';
        }

        const item = document.createElement('div');
        item.className = 'calendar-item';
        item.innerHTML = `
            <div class="calendar-date">
                <span class="calendar-date-day">${day}</span>
                ${month ? `<span class="calendar-date-month">${month}</span>` : ''}
            </div>
            <div class="calendar-details">
                <span class="calendar-type calendar-type-${event.type}">${event.type}</span>
                <h3>${event.title}</h3>
                <p>${event.description}</p>
            </div>
        `;
        calendarGrid.appendChild(item);
    });
}

loadCalendar();

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
