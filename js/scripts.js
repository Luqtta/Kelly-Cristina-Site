const cards = document.querySelectorAll('.hover-card, .produto-card');

function checkCenter() {
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;

  if (window.innerWidth < 576) {
    let closestCard = null;
    let closestDistance = Infinity;

    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      const distanceToCenter = Math.sqrt(Math.pow(rect.left + rect.width / 2 - centerX, 2) + Math.pow(rect.top + rect.height / 2 - centerY, 2));
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0 && rect.left < window.innerWidth && rect.right > 0;

      if (isVisible && (distanceToCenter < 200 || rect.top < centerY + 100 && rect.bottom > centerY - 100)) {
        if (distanceToCenter < closestDistance) {
          closestCard = card;
          closestDistance = distanceToCenter;
        }
      }
    });

    cards.forEach((card) => {
      if (card === closestCard) {
        card.classList.add('hover');
      } else {
        card.classList.remove('hover');
      }
    });
  } else if (window.innerWidth < 768) {
    // Modo responsivo para telas médias
    let closestCard = null;
    let closestDistance = Infinity;

    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      const distanceToCenter = Math.sqrt(Math.pow(rect.left + rect.width / 2 - centerX, 2) + Math.pow(rect.top + rect.height / 2 - centerY, 2));
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0 && rect.left < window.innerWidth && rect.right > 0;

      if (isVisible && (distanceToCenter < 250 || rect.top < centerY + 150 && rect.bottom > centerY - 150)) {
        if (distanceToCenter < closestDistance) {
          closestCard = card;
          closestDistance = distanceToCenter;
        }
      }
    });

    cards.forEach((card) => {
      if (card === closestCard) {
        card.classList.add('hover');
      } else {
        card.classList.remove('hover');
      }
    });
  } else {
    // Modo não responsivo
    cards.forEach((card) => {
      card.classList.remove('hover');
    });
  }
}

window.addEventListener('scroll', checkCenter);
window.addEventListener('resize', checkCenter);

const carousel = document.getElementById('carousel');

async function fetchReviews() {
  const response = await fetch('http://localhost:3001/reviews');
  const data = await response.json();
  return data;
}

function createStarRating(rating) {
  let stars = '';
  for (let i = 0; i < 5; i++) {
    stars += i < rating ? '★' : '☆';
  }
  return stars;
}

function renderReviews(reviews) {
  carousel.innerHTML = '';

  reviews.forEach((review) => {
    const card = document.createElement('div');
    card.className = 'swiper-slide';

    card.innerHTML = `
      <div class="review-header">
        <img src="${review.profile_photo_url}" alt="${review.author_name}" class="review-img">
        <div>
          <a href="${review.author_url}" target="_blank" class="review-name">
            ${review.author_name}
            <svg xmlns="http://www.w3.org/2000/svg" style="margin-left:4px; vertical-align: middle;" width="22" height="22" viewBox="0 0 24 24" fill="#1DA1F2">
              <path d="M22.25 12l-2.32-1.52.39-2.74-2.71-.91-1.19-2.53-2.82.49L12 2 10.4 4.79l-2.82-.49-1.19 2.53-2.71.91.39 2.74L1.75 12l2.32 1.52-.39 2.74 2.71.91 1.19 2.53 2.82-.49L12 22l1.6-2.79 2.82.49 1.19-2.53 2.71-.91-.39-2.74L22.25 12zm-12 5l-3-3 1.41-1.41L10.25 14.17l5.59-5.59L17.25 10l-7 7z"/>
            </svg>
          </a><br>
          <small>${review.relative_time_description}</small>
        </div>
      </div>
      <div class="review-stars">${createStarRating(review.rating)}</div>
      <div class="review-text">${review.text}</div>
    `;
    carousel.appendChild(card);
  });
}


async function init() {
  const reviews = await fetchReviews();
  if (reviews.length > 0) {
    renderReviews(reviews);

    const shouldLoop = reviews.length > 3; // Só ativa loop se tiver mais de 3

    new Swiper('.mySwiper', {
      slidesPerView: 3,
      spaceBetween: 30,
      loop: shouldLoop,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
        renderBullet: function (index, className) {
          return `<span class="${className} custom-dot"></span>`;
        },
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      autoplay: {
        delay: 4000,
        disableOnInteraction: false,
      },
      breakpoints: {
        1024: { slidesPerView: 3 },
        768: { slidesPerView: 2 },
        0: { slidesPerView: 1 },
      },
    });
  }
}


init();


