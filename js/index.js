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
  const sections = ['about', 'catalog', 'contact'];
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

    function getVisible() {
      return window.innerWidth < 768 ? 1 : window.innerWidth < 992 ? 2 : 3;
    }

    function getSlideWidth() {
      const styles = window.getComputedStyle(track);
      const gap = Number.parseFloat(styles.columnGap || styles.gap) || 20;
      return slides[0].offsetWidth + gap;
    }

    function getMaxIndex() {
      return Math.max(0, total - getVisible());
    }

    function setActiveDot(idx) {
      dotsWrap.querySelectorAll('.cat-dot').forEach((d, i) => d.classList.toggle('active', i === idx));
    }

    function goTo(idx) {
      const targetIdx = Math.max(0, Math.min(idx, getMaxIndex()));
      track.scrollTo({ left: targetIdx * getSlideWidth(), behavior: 'smooth' });
      setActiveDot(targetIdx);
    }

    function buildDots(activeIdx = 0) {
      const count = getMaxIndex() + 1;
      if (dotsWrap.children.length !== count) {
        dotsWrap.innerHTML = '';
        for (let i = 0; i < count; i++) {
          const d = document.createElement('button');
          d.className = 'cat-dot';
          d.setAttribute('aria-label', 'Show product carousel position ' + (i + 1));
          d.addEventListener('click', () => goTo(i));
          dotsWrap.appendChild(d);
        }
      }
      setActiveDot(Math.max(0, Math.min(activeIdx, count - 1)));
    }

    buildDots();

    window[scrollFnName] = function(dir) {
      const current = Math.round(track.scrollLeft / getSlideWidth());
      goTo(current + dir);
    };

    track.addEventListener('scroll', () => {
      const idx = Math.round(track.scrollLeft / getSlideWidth());
      setActiveDot(Math.min(idx, getMaxIndex()));
    });

    let autoIdx = 0;
    let autoTimer;

    function autoPlay() {
      stopAuto();
      autoTimer = setInterval(() => {
        const maxIdx = getMaxIndex();
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
    window.addEventListener('resize', () => {
      const idx = Math.round(track.scrollLeft / getSlideWidth());
      buildDots(idx);
      goTo(idx);
    });

    autoPlay();
  }



  // SECTION: Random Catalog Product Carousel
document.addEventListener('DOMContentLoaded', async function () {
  const track = document.getElementById('catTrack');
  if (!track || typeof CATALOG_DATA === 'undefined') return;

  const candidates = CATALOG_DATA.filter(product =>
    Array.isArray(product.images) && product.images.length > 0
  );
  if (!candidates.length) return;

  // Keep only catalog products whose first available photo loads successfully.
  const imageUrls = [...new Set(candidates.flatMap(product => product.images))];
  const imageStates = new Map(await Promise.all(imageUrls.map(url => new Promise(resolve => {
    const image = new Image();
    image.onload = () => resolve([url, true]);
    image.onerror = () => resolve([url, false]);
    image.src = url;
  }))));
  const photographedProducts = candidates.map(product => ({
    product,
    image: product.images.find(url => imageStates.get(url))
  })).filter(entry => entry.image);
  if (!photographedProducts.length) return;

  // Keep only one product per photo so length variants sharing an image don't repeat.
  const uniquePhotoProducts = new Map();
  photographedProducts.forEach(entry => {
    if (!uniquePhotoProducts.has(entry.image)) uniquePhotoProducts.set(entry.image, entry);
  });

  // Shuffle distinct photographed products so homepage selections vary by visit.
  const shuffled = [...uniquePhotoProducts.values()];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const featuredProducts = shuffled.slice(0, Math.min(9, shuffled.length));
  const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);

  track.innerHTML = featuredProducts.map(entry => {
    const product = entry.product;
    const name = escapeHTML(product.name);
    const partNumber = escapeHTML(product.partNumber || '');
    const category = escapeHTML(product.category || '');
    const description = escapeHTML(product.description || 'Contact us for product details.');
    const image = escapeHTML(entry.image);
    return `
      <div class="cat-slide">
        <a class="cat-card product-preview-card" href="catalog.html" aria-label="View ${name} in the product catalog">
          <div class="product-preview-image">
            <img src="${image}" alt="${name}" loading="lazy">
          </div>
          <div class="product-preview-content">
            <span class="product-preview-category">${category}</span>
            <h5>${name}</h5>
            ${partNumber ? `<div class="product-preview-part">${partNumber}</div>` : ''}
            <p>${description}</p>
            <span class="cat-link">View Catalog <i class="fas fa-arrow-right ms-1"></i></span>
          </div>
        </a>
      </div>`;
  }).join('');

  setupHorizontalCarousel('catTrack', 'catDots', 'catCarouselScroll', 3000);
});
