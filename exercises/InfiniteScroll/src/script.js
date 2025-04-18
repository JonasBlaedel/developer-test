const API_URL = 'https://api.frontendexpert.io/api/fe/testimonials';
const CORS_PROXY = 'https://corsproxy.io/?url=';
const NEW_URL = CORS_PROXY + API_URL;

const testimonialContainer = document.getElementById('testimonial-container');

const testimonialAmount = 5;
let finalTestimonialId;
let hasNext;
let testimonialArr = [];
let isLoading = false;

const listOfNames = [
  'Emma Johnson', 'Liam Smith', 'Olivia Williams', 'Noah Brown', 'Ava Jones',
  'Ethan Garcia', 'Sophia Miller', 'Mason Davis', 'Isabella Rodriguez', 'Lucas Martinez',
  'Mia Anderson', 'Oliver Taylor', 'Charlotte Thomas', 'Elijah Moore', 'Amelia Jackson',
  'James Martin', 'Harper Lee', 'Benjamin Perez', 'Evelyn Thompson', 'William White',
  'Abigail Harris', 'Alexander Clark', 'Emily Lewis', 'Michael Robinson', 'Elizabeth Walker',
  'Daniel Young', 'Sofia Hall', 'Matthew Allen', 'Victoria King', 'Henry Wright',
  'Scarlett Scott', 'Joseph Green', 'Grace Baker', 'Samuel Adams', 'Chloe Nelson',
  'David Carter', 'Zoey Mitchell', 'Jackson Turner', 'Lily James', 'Sebastian Campbell',
  'Layla Parker', 'Jack Evans', 'Nora Edwards', 'Aiden Collins', 'Hannah Stewart',
  'Julian Sanchez', 'Zoe Morris', 'Gabriel Rogers', 'Stella Reed', 'Carter Cook'
];

document.addEventListener('DOMContentLoaded', async () => {
  await fetchTestimonials(testimonialAmount);
});

function fetchTestimonials(testimonialAmount) {
  const params = new URLSearchParams({
    limit: testimonialAmount,
    after: finalTestimonialId || ''
  });
  const apiUrl = `${API_URL}?${params.toString()}`;
  const encodedApiUrl = encodeURIComponent(apiUrl);
  const fetchUrl = `${CORS_PROXY}${encodedApiUrl}`;

  return fetch(fetchUrl, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  })
    .then(response => response.json())
    .then(data => {

      testimonialArr = [];
      testimonialArr = data.testimonials;
      const lastTestimonial = data.testimonials[data.testimonials.length - 1].id;
      finalTestimonialId = parseInt(lastTestimonial, 10);
      hasNext = data.hasNext;
      buildTestimonial(testimonialArr);
    })
    .catch(error => {
      console.error('Error fetching testimonials:', error);
    });
}

function buildTestimonial(testimonials) {
  testimonials.forEach(testimonial => {
    const testimonialElement = document.createElement('div');
    testimonialElement.classList.add('testimonial');
    testimonialElement.id = testimonial.id;
    testimonialElement.innerHTML = `
    <img src="https://i.pravatar.cc/48?u=${testimonial.id}" alt="Avatar" class="avatar">
    <div class="testimonial-content">
    <h3 class="testimonial-name">${listOfNames[Math.floor(Math.random() * listOfNames.length)]}</h3>
    <p class="testimonial-text">${testimonial.message}</p>
    </div>
  `;
    testimonialContainer.appendChild(testimonialElement);
  });
}

async function scrollHandler() {
  if (hasNext === true && !isLoading) {
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight) {
      isLoading = true;
      await fetchTestimonials(testimonialAmount);
      isLoading = false;
    }
  }
}

window.addEventListener('scroll', scrollHandler);


