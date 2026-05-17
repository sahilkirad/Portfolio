(function () {
  const navbar = document.querySelector('[data-navbar]');
  const menuBtn = document.querySelector('[data-menu-btn]');
  const mobileMenu = document.querySelector('[data-mobile-menu]');

  function onScroll() {
    if (!navbar) return;
    navbar.classList.toggle('scrolled', window.scrollY > 10);
  }

  function setActiveNav() {
    const page = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('[data-nav]').forEach((el) => {
      const href = el.getAttribute('href');
      if (href === page) el.classList.add('active');
    });
  }

  function setupMenu() {
    if (!menuBtn || !mobileMenu) return;
    menuBtn.addEventListener('click', function () {
      mobileMenu.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', mobileMenu.classList.contains('open') ? 'true' : 'false');
    });
  }

  function setupFadeUp() {
    const nodes = document.querySelectorAll('.fade-up');
    if (!nodes.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('show');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    nodes.forEach((n) => observer.observe(n));
  }

  function setupPhotoFallback() {
    const img = document.querySelector('[data-photo]');
    const ph = document.querySelector('[data-photo-placeholder]');
    if (!img || !ph) return;
    img.addEventListener('error', function () {
      img.style.display = 'none';
      ph.style.display = 'flex';
    });
  }

  window.showToast = function (message, type) {
    const old = document.querySelector('.toast');
    if (old) old.remove();
    const toast = document.createElement('div');
    toast.className = type === 'error' ? 'toast error' : 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(function () {
      toast.remove();
    }, 4000);
  };

  onScroll();
  setActiveNav();
  setupMenu();
  setupFadeUp();
  setupPhotoFallback();
  window.addEventListener('scroll', onScroll);
})();
