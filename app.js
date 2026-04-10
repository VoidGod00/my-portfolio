// ══════════════════════════════
//  SAHIL NIAZI — PORTFOLIO JS
// ══════════════════════════════

document.addEventListener('DOMContentLoaded', function () {
  emailjs.init({ publicKey: "3DDXlmpTK1SAiiZ-c" });

  initFloatNav();
  initSmoothScroll();
  initScrollAnimations();
  initContactForm();
  initScrollTop();
  initAOS();
});

// ── Floating Nav: active section highlight ──
function initFloatNav() {
  const links = document.querySelectorAll('.fnav-link');
  const sections = document.querySelectorAll('section[id]');

  function updateActive() {
    const scrollY = window.scrollY + window.innerHeight / 3;
    let current = '';
    sections.forEach(sec => {
      if (scrollY >= sec.offsetTop) current = sec.id;
    });
    links.forEach(l => {
      l.classList.toggle('active', l.dataset.section === current);
    });
  }

  window.addEventListener('scroll', updateActive, { passive: true });
  updateActive();
}

// ── Smooth scroll for all # links ──
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function (e) {
      const id = this.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const offset = 70;
      window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
    });
  });
}

// ── Scroll-to-top button ──
function initScrollTop() {
  const btn = document.getElementById('scrollTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ── Section & card scroll animations ──
function initScrollAnimations() {
  // sections fade-in
  const sections = document.querySelectorAll('section:not(.hero)');
  const secObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity = '1';
        e.target.style.transform = 'translateY(0)';
        secObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });

  sections.forEach(s => {
    s.style.opacity = '0';
    s.style.transform = 'translateY(24px)';
    s.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    secObserver.observe(s);
  });
}

// ── AOS (Animate On Scroll) for project cards & skill cards ──
function initAOS() {
  const els = document.querySelectorAll('[data-aos]');
  const obs = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => {
          e.target.classList.add('visible');
        }, (e.target.dataset.aosDelay || 0) * 1);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '-30px' });

  // stagger cards
  document.querySelectorAll('.project-card, .skill-item-card').forEach((el, i) => {
    el.dataset.aosDelay = i * 60;
    obs.observe(el);
  });
}

// ── EmailJS helper ──
function sendEmailJS(formData) {
  return emailjs.send('service_97ml128', 'template_55lnhzq', {
    from_name: formData.get('name'),
    from_email: formData.get('email'),
    message: formData.get('message'),
    to_email: 'sniyazi102938@outlook.com'
  });
}

// ── Contact form ──
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const fd = new FormData(form);
    const name = fd.get('name')?.trim();
    const email = fd.get('email')?.trim();
    const message = fd.get('message')?.trim();

    // clear errors
    form.querySelectorAll('input, textarea').forEach(i => i.style.borderColor = '');

    if (!name || !email || !message) {
      showNotification('Please fill in all fields.', 'error');
      if (!name) document.getElementById('name').style.borderColor = '#ef4444';
      if (!email) document.getElementById('email').style.borderColor = '#ef4444';
      if (!message) document.getElementById('message').style.borderColor = '#ef4444';
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showNotification('Please enter a valid email address.', 'error');
      document.getElementById('email').style.borderColor = '#ef4444';
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const origHTML = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';
    submitBtn.disabled = true;

    sendEmailJS(fd)
      .then(() => {
        showNotification(`Thanks, ${name}! Message sent. I'll get back to you soon.`, 'success');
        form.reset();
      })
      .catch(() => {
        showNotification('Something went wrong. Please try emailing me directly.', 'error');
      })
      .finally(() => {
        submitBtn.innerHTML = origHTML;
        submitBtn.disabled = false;
      });
  });
}

// ── Notification ──
function showNotification(message, type = 'info') {
  document.querySelectorAll('.notification').forEach(n => n.remove());

  const icons = { success: 'check-circle', error: 'exclamation-circle', info: 'info-circle' };
  const n = document.createElement('div');
  n.className = `notification notification-${type}`;
  n.innerHTML = `
    <div class="notification-content">
      <i class="fas fa-${icons[type]}"></i>
      <span>${message}</span>
      <button class="notification-close" aria-label="Close"><i class="fas fa-times"></i></button>
    </div>`;

  document.body.appendChild(n);
  requestAnimationFrame(() => n.classList.add('show'));

  const timer = setTimeout(() => removeN(n), 6000);
  n.querySelector('.notification-close').addEventListener('click', () => {
    clearTimeout(timer);
    removeN(n);
  });
}

function removeN(n) {
  n.classList.remove('show');
  setTimeout(() => n?.remove(), 400);
}

// ── Contact link copy ──
document.addEventListener('click', function (e) {
  const email = e.target.closest('a[href^="mailto:"]');
  const phone = e.target.closest('a[href^="tel:"]');

  if (email && e.target.closest('.contact-link-card')) {
    e.preventDefault();
    const addr = email.href.replace('mailto:', '');
    navigator.clipboard.writeText(addr)
      .then(() => showNotification('Email copied to clipboard!', 'success'))
      .catch(() => window.location.href = email.href);
  }

  if (phone && e.target.closest('.contact-link-card')) {
    e.preventDefault();
    const num = phone.href.replace('tel:', '');
    navigator.clipboard.writeText(num)
      .then(() => showNotification('Phone number copied!', 'success'))
      .catch(() => window.location.href = phone.href);
  }
});
