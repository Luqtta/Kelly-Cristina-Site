/* ========================
   NAVBAR - scroll + toggle mobile
   ======================== */

const siteNav = document.getElementById('site-nav');
const navToggle = document.querySelector('.site-nav__toggle');
const mobileMenu = document.getElementById('mobile-menu');
const mobileLinks = document.querySelectorAll('.site-nav__mobile-link');

window.addEventListener('scroll', () => {
  if (siteNav) {
    siteNav.classList.toggle('site-nav--scrolled', window.scrollY > 20);
  }
}, { passive: true });

if (navToggle && mobileMenu) {
  navToggle.addEventListener('click', () => {
    const isOpen = !mobileMenu.hidden;
    mobileMenu.hidden = isOpen;
    navToggle.setAttribute('aria-expanded', String(!isOpen));
    const icon = navToggle.querySelector('i');
    if (icon) icon.className = isOpen ? 'bi bi-list' : 'bi bi-x';
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.hidden = true;
      navToggle.setAttribute('aria-expanded', 'false');
      const icon = navToggle.querySelector('i');
      if (icon) icon.className = 'bi bi-list';
    });
  });

  // Fecha menu ao clicar fora
  document.addEventListener('click', (e) => {
    if (!siteNav.contains(e.target)) {
      mobileMenu.hidden = true;
      navToggle.setAttribute('aria-expanded', 'false');
      const icon = navToggle.querySelector('i');
      if (icon) icon.className = 'bi bi-list';
    }
  });
}

/* ========================
   AOS - animacoes de scroll
   ======================== */

if (typeof AOS !== 'undefined') {
  AOS.init({ once: true, duration: 700, offset: 60 });
}

/* ========================
   DEPOIMENTOS / SWIPER
   ======================== */

function getApiBase() {
  return window.location.hostname === 'localhost' ? 'http://localhost:3000' : '';
}

function createStarRating(rating) {
  return Array.from({ length: 5 }, (_, i) => i < rating ? '\u2605' : '\u2606').join('');
}

function renderReviews(reviews) {
  const carousel = document.getElementById('carousel');
  if (!carousel || reviews.length === 0) return;

  carousel.innerHTML = reviews.map(review => {
    return `
      <div class="swiper-slide">
        <div class="review-card">
          <div class="review-stars">${createStarRating(review.rating)}</div>
          <p class="review-text">"${review.text}"</p>
          <div class="review-header">
            <img src="${review.profile_photo_url}" alt="${review.author_name}" onerror="this.style.display='none'">
            <div>
              <a href="${review.author_url}" target="_blank" rel="noopener" class="review-name">${review.author_name}</a>
              <small>${review.relative_time_description}</small>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function initSwiper() {
  if (typeof Swiper === 'undefined') return;
  const reviewSlides = document.querySelectorAll('.mySwiper .swiper-slide').length;
  const canLoop = reviewSlides > 1;

  new Swiper('.mySwiper', {
    slidesPerView: 1,
    spaceBetween: 24,
    loop: canLoop,
    loopedSlides: reviewSlides,
    loopAdditionalSlides: reviewSlides,
    rewind: false,
    watchOverflow: false,
    centerInsufficientSlides: false,
    allowTouchMove: canLoop,
    slidesPerGroup: 1,
    centeredSlides: false,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    breakpoints: {
      768: { slidesPerView: 2 },
      1100: { slidesPerView: 3 },
    },
  });
}

async function loadReviews() {
  try {
    const base = getApiBase();
    const res = await fetch(`${base}/api/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const reviews = await res.json();
    if (Array.isArray(reviews) && reviews.length > 0) {
      renderReviews(reviews);
    }
  } catch (err) {
    console.warn('Depoimentos nao carregados:', err.message);
  } finally {
    initSwiper();
  }
}

loadReviews();

/* ========================
   FAQ - acordeao
   ======================== */

document.querySelectorAll('.faq-item').forEach(item => {
  const btn = item.querySelector('.faq-header');
  const answer = item.querySelector('.faq-answer');
  if (!btn || !answer) return;

  btn.addEventListener('click', () => {
    const isActive = item.classList.contains('active');

    // Fecha todos
    document.querySelectorAll('.faq-item.active').forEach(openItem => {
      openItem.classList.remove('active');
      const openBtn = openItem.querySelector('.faq-header');
      const openAnswer = openItem.querySelector('.faq-answer');
      if (openBtn) openBtn.setAttribute('aria-expanded', 'false');
      if (openAnswer) openAnswer.style.height = '0';
    });

    // Abre o clicado se estava fechado
    if (!isActive) {
      item.classList.add('active');
      btn.setAttribute('aria-expanded', 'true');
      answer.style.height = answer.scrollHeight + 'px';
    }
  });
});

/* ========================
   GOOGLE ADS - conversao
   ======================== */

function gtag_report_conversion(url) {
  const go = () => { if (url) window.location.assign(url); };
  try {
    if (typeof gtag === 'function') {
      gtag('event', 'conversion', {
        send_to: 'AW-11221257259/y2aUCPaasKsbEKuY2-Yp',
        event_callback: go,
      });
      setTimeout(go, 800);
    } else {
      go();
    }
  } catch (e) {
    go();
  }
  return false;
}

/* ========================
   ANO ATUAL no footer
   ======================== */

const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
