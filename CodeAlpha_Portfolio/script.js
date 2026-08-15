
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    navLinks.classList.toggle('active');
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}


const revealItems = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

revealItems.forEach((item) => observer.observe(item));


const themeToggle = document.getElementById('themeToggle');
const root = document.documentElement;
const savedTheme = localStorage.getItem('portfolio-theme');

if (savedTheme) {
  root.setAttribute('data-theme', savedTheme);
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const currentTheme = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', nextTheme);
    localStorage.setItem('portfolio-theme', nextTheme);
    themeToggle.querySelector('.theme-toggle__icon').textContent = nextTheme === 'light' ? '☀️' : '🌙';
  });

  const initialTheme = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  themeToggle.querySelector('.theme-toggle__icon').textContent = initialTheme === 'light' ? '☀️' : '🌙';
}


const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    filterButtons.forEach((btn) => btn.classList.remove('active'));
    button.classList.add('active');

    const filter = button.dataset.filter;
    projectCards.forEach((card) => {
      const matches = filter === 'all' || card.dataset.tech.includes(filter);
      card.style.display = matches ? 'block' : 'none';
    });
  });
});

document.querySelectorAll('.detail-toggle').forEach((button) => {
  button.addEventListener('click', () => {
    const details = button.nextElementSibling;
    const isOpen = details.classList.toggle('open');
    button.setAttribute('aria-expanded', String(isOpen));
    button.textContent = isOpen ? 'Hide Details' : 'View Project Details';
  });
});


const year = document.getElementById('year');
if (year) {
  year.textContent = new Date().getFullYear();
}


const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  if (window.scrollY > 500) {
    backToTop.style.display = 'block';
  } else {
    backToTop.style.display = 'none';
  }
});

if (backToTop) {
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}


const form = document.getElementById('contact-form');
const formMessage = document.getElementById('form-message');

if (form && formMessage) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();
    const subject = encodeURIComponent(`Portfolio inquiry from ${name || 'a visitor'}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);

    window.location.href = `mailto:latifneelam26@gmail.com?subject=${subject}&body=${body}`;
    formMessage.textContent = `Thanks, ${name || 'there'}! Your email app should open with your message.`;
    form.reset();
  });
}
