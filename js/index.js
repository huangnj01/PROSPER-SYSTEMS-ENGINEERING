/*
  Homepage JavaScript
  ------------------------------------------------------------
  Purpose: Homepage loading state, smooth scroll, forms, animations, carousel behavior, and optional product showcase rotation.
  Related HTML: index.html
  Function map:
  - Spinner: hides the loading screen once the page is ready.
  - Smooth scroll: moves navbar and CTA links to page sections.
  - Quote/contact forms: opens email drafts with visitor details.
  - Scroll effects: reveals animated sections and highlights active navigation.
  - Catalog carousel: scrolls category cards and autoplay dots.
  - Showcase rotation: rotates product imagery when catalog data is available.
*/

// SECTION: Spinner / Page Loading
  window.addEventListener('load', () => {
    const s = document.getElementById('spinner');
    s.classList.add('hide');
    setTimeout(() => s.style.display = 'none', 400);
  });

  // SECTION: Smooth Section Scrolling
  function smoothScroll(e, id) {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // SECTION: Back To Top Button
  const btt = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    btt.classList.toggle('show', window.scrollY > 300);
  });

  // SECTION: Toast Message Helper
  function showToast(msg) {
    const t = document.getElementById('toastMsg');
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3500);
  }

  // SECTION: Quote And Contact Forms
  function submitQuote(e) {
    e.preventDefault();
    const form = e.target;
    const name = form.querySelector('input[placeholder="Your Name"]')?.value || '';
    const email = form.querySelector('input[placeholder="Email Address"]')?.value || '';
    const msg = form.querySelector('textarea')?.value || '';
    // Build mailto
    const subject = encodeURIComponent('Quote Request from ' + name);
    const body = encodeURIComponent('Name: ' + name + '\nEmail: ' + email + '\n\nMessage:\n' + msg);
    window.location.href = 'mailto:nigel_pse@outlook.com?subject=' + subject + '&body=' + body;
    showToast('Opening your email client to send the request...');
    form.reset();
  }

  function submitContact(e) {
    e.preventDefault();
    const form = e.target;
    const inputs = form.querySelectorAll('input, select, textarea');
    let body = '';
    inputs.forEach(i => { if (i.value) body += (i.placeholder || i.tagName) + ': ' + i.value + '\n'; });
    const subject = encodeURIComponent('PSE Website Inquiry');
    window.location.href = 'mailto:nigel_pse@outlook.com?subject=' + subject + '&body=' + encodeURIComponent(body);
    showToast('Opening your email client...');
    form.reset();
  }

  // SECTION: Scroll Reveal Animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.fade-up, .fade-left, .fade-right').forEach(el => observer.observe(el));

  // SECTION: Active Navigation Highlight
  const sections = ['about', 'catalog', 'partner-vendor', 'contact'];
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el && window.scrollY >= el.offsetTop - 120) current = id;
    });
    document.querySelectorAll('.navbar .nav-link').forEach(a => {
      a.classList.remove('active');
      if (a.getAttribute('href') === '#' + current || a.getAttribute('onclick')?.includes(current)) {
        a.classList.add('active');
      }
    });
  });

  // SECTION: Homepage Carousels
  function setupHorizontalCarousel(trackId, dotsId, scrollFnName, intervalMs) {
    const track = document.getElementById(trackId);
    const dotsWrap = document.getElementById(dotsId);
    if (!track || !dotsWrap) return;

    const slides = Array.from(track.children);
    const total = slides.length;
    if (!total) return;

    dotsWrap.innerHTML = '';
    slides.forEach((_, i) => {
      const d = document.createElement('button');
      d.className = 'cat-dot' + (i === 0 ? ' active' : '');
      d.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(d);
    });

    function getVisible() {
      return window.innerWidth < 768 ? 1 : window.innerWidth < 992 ? 2 : 3;
    }

    function getSlideWidth() {
      const styles = window.getComputedStyle(track);
      const gap = Number.parseFloat(styles.columnGap || styles.gap) || 20;
      return slides[0].offsetWidth + gap;
    }

    function setActiveDot(idx) {
      dotsWrap.querySelectorAll('.cat-dot').forEach((d, i) => d.classList.toggle('active', i === idx));
    }

    function goTo(idx) {
      const maxIdx = Math.max(0, total - getVisible());
      const targetIdx = Math.max(0, Math.min(idx, maxIdx));
      track.scrollTo({ left: targetIdx * getSlideWidth(), behavior: 'smooth' });
      setActiveDot(targetIdx);
    }

    window[scrollFnName] = function(dir) {
      const current = Math.round(track.scrollLeft / getSlideWidth());
      goTo(current + dir);
    };

    track.addEventListener('scroll', () => {
      const idx = Math.round(track.scrollLeft / getSlideWidth());
      setActiveDot(idx);
    });

    let autoIdx = 0;
    let autoTimer;

    function autoPlay() {
      stopAuto();
      autoTimer = setInterval(() => {
        const maxIdx = Math.max(0, total - getVisible());
        autoIdx = autoIdx >= maxIdx ? 0 : autoIdx + 1;
        goTo(autoIdx);
      }, intervalMs);
    }

    function stopAuto() { clearInterval(autoTimer); }
    function resumeAuto() {
      autoIdx = Math.round(track.scrollLeft / getSlideWidth());
      autoPlay();
    }

    track.addEventListener('mouseenter', stopAuto);
    track.addEventListener('touchstart', stopAuto, { passive: true });
    track.addEventListener('mouseleave', resumeAuto);
    track.addEventListener('touchend', resumeAuto);
    window.addEventListener('resize', () => goTo(Math.round(track.scrollLeft / getSlideWidth())));

    autoPlay();
  }

  setupHorizontalCarousel('catTrack', 'catDots', 'catCarouselScroll', 3000);
  setupHorizontalCarousel('partnerTrack', 'partnerDots', 'partnerCarouselScroll', 3600);

  // SECTION: Optional Product Showcase Rotation
document.addEventListener("DOMContentLoaded", function () {

  if (typeof CATALOG_DATA === "undefined") return;

  const showcaseImages = [];

  CATALOG_DATA.forEach(product => {
    if (product.images && product.images.length > 0) {

      product.images.forEach(image => {
        showcaseImages.push(image);
      });

    }
  });

  if (showcaseImages.length === 0) return;

  let currentImage = 0;
  const img = document.getElementById("catalogShowcase");

  setInterval(() => {

    img.style.opacity = 0;

    setTimeout(() => {
      currentImage = (currentImage + 1) % showcaseImages.length;
      img.src = showcaseImages[currentImage];
      img.style.opacity = 1;
    }, 300);
  }, 5000);
});
