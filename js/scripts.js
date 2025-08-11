const cards = document.querySelectorAll('.hover-card, .produto-card');

function checkCenter() {
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;

  if (window.innerWidth < 576) {
    let closestCard = null;
    let closestDistance = Infinity;

    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      const distanceToCenter = Math.hypot(
        rect.left + rect.width / 2 - centerX,
        rect.top + rect.height / 2 - centerY
      );
      const isVisible =
        rect.top < window.innerHeight &&
        rect.bottom > 0 &&
        rect.left < window.innerWidth &&
        rect.right > 0;

      if (
        isVisible &&
        (distanceToCenter < 200 ||
          (rect.top < centerY + 100 && rect.bottom > centerY - 100))
      ) {
        if (distanceToCenter < closestDistance) {
          closestCard = card;
          closestDistance = distanceToCenter;
        }
      }
    });

    cards.forEach((card) => {
      card.classList.toggle('hover', card === closestCard);
    });
  } else if (window.innerWidth < 768) {
    let closestCard = null;
    let closestDistance = Infinity;

    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      const distanceToCenter = Math.hypot(
        rect.left + rect.width / 2 - centerX,
        rect.top + rect.height / 2 - centerY
      );
      const isVisible =
        rect.top < window.innerHeight &&
        rect.bottom > 0 &&
        rect.left < window.innerWidth &&
        rect.right > 0;

      if (
        isVisible &&
        (distanceToCenter < 250 ||
          (rect.top < centerY + 150 && rect.bottom > centerY - 150))
      ) {
        if (distanceToCenter < closestDistance) {
          closestCard = card;
          closestDistance = distanceToCenter;
        }
      }
    });

    cards.forEach((card) => {
      card.classList.toggle('hover', card === closestCard);
    });
  } else {
    cards.forEach((card) => {
      card.classList.remove('hover');
    });
  }
}

window.addEventListener('scroll', checkCenter);
window.addEventListener('resize', checkCenter);


function getApiBase() {
  return window.location.hostname === 'localhost' ? 'http://localhost:3000' : '';
}

async function fetchReviews() {
  const base = getApiBase();
  const response = await fetch(`${base}/api/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
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
  const carousel = document.getElementById('carousel');
  if (!carousel) return; 

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
  try {
    const reviews = await fetchReviews();
    if (reviews.length > 0) {
      renderReviews(reviews);

      if (typeof Swiper !== 'undefined') {
        new Swiper('.mySwiper', {
          slidesPerView: 3,
          spaceBetween: 30,
          loop: reviews.length > 3,
          pagination: {
            el: '.swiper-pagination',
            clickable: true,
            renderBullet: (index, className) => `<span class="${className} custom-dot"></span>`,
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
  } catch (err) {
    console.error('Failed to fetch reviews:', err);
  }
}

init();

if (typeof AOS !== 'undefined') {
  AOS.init();
}


const items = document.querySelectorAll('.faq-item');

items.forEach(item => {
  item.addEventListener('click', () => {
    const answer = item.querySelector('.faq-answer');
    const isActive = item.classList.contains('active');

    document.querySelectorAll('.faq-item.active').forEach(activeItem => {
      activeItem.classList.remove('active');
      const activeAnswer = activeItem.querySelector('.faq-answer');
      activeAnswer.style.height = '0';
      activeAnswer.style.paddingTop = '0';
    });

    if (!isActive) {
      item.classList.add('active');
      setTimeout(() => {
        answer.style.height = `${answer.scrollHeight}px`;
      }, 10);
      answer.style.paddingTop = '10px';
    } else {
      answer.style.height = '0';
      answer.style.paddingTop = '0';
    }
  });
});
