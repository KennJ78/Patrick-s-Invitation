// Intersection Observer to reveal images when they enter the viewport
(function () {
  const supportsIO = 'IntersectionObserver' in window;
  const revealEls = Array.from(document.querySelectorAll('.reveal'));

  if (!revealEls.length) return;

  // If no IO support, just make them visible
  if (!supportsIO) {
    revealEls.forEach(el => el.classList.add('is-visible'));
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          // Unobserve after reveal to save work
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: document.querySelector('.invitation-scroll'),
      rootMargin: '0px 0px -10% 0px', // start animation a bit before fully in view
      threshold: 0.15
    });

    revealEls.forEach(el => observer.observe(el));
  }

  // Countdown to October 25, 1:00 PM (local time). If date has passed this year, target next year.
  (function initCountdown() {
    const dEl = document.getElementById('cd-days');
    const hEl = document.getElementById('cd-hours');
    const mEl = document.getElementById('cd-mins');
    const sEl = document.getElementById('cd-secs');
    const liveRegion = document.querySelector('.countdown-overlay');

    if (!dEl || !hEl || !mEl || !sEl) return; // countdown not present

    const now = new Date();
    const year = now.getFullYear();
    let target = new Date(year, 9, 25, 13, 0, 0, 0); // Month is 0-based; 9 => October
    if (target.getTime() <= now.getTime()) {
      target = new Date(year + 1, 9, 25, 13, 0, 0, 0);
    }

    function update() {
      const t = target.getTime() - Date.now();
      if (t <= 0) {
        dEl.textContent = '00';
        hEl.textContent = '00';
        mEl.textContent = '00';
        sEl.textContent = '00';
        if (liveRegion) liveRegion.setAttribute('aria-label', 'The event time has arrived');
        clearInterval(timer);
        return;
      }
      const totalSeconds = Math.floor(t / 1000);
      const days = Math.floor(totalSeconds / (24 * 3600));
      const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      dEl.textContent = String(days).padStart(2, '0');
      hEl.textContent = String(hours).padStart(2, '0');
      mEl.textContent = String(minutes).padStart(2, '0');
      sEl.textContent = String(seconds).padStart(2, '0');
    }

    update();
    const timer = setInterval(update, 1000);
  })();
})();
