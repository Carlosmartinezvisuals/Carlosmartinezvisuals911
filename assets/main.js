(function () {
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // ---- Hero background video ----
  var hero = document.getElementById('hero-video');
  if (hero) {
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var saveData = navigator.connection && navigator.connection.saveData;
    if (reduce || saveData) {
      hero.removeAttribute('autoplay');
      hero.pause();
      hero.preload = 'none';
    } else {
      var p = hero.play && hero.play();
      if (p && p.catch) p.catch(function () {}); // poster stays if autoplay is blocked
    }
  }

  // ---- Showreel modal ----
  var openBtn = document.getElementById('open-showreel');
  var closeBtn = document.getElementById('close-modal');
  var modal = document.getElementById('video-modal');
  var slot = document.getElementById('video-slot');
  var fallback = document.getElementById('video-fallback');
  if (!openBtn || !modal || !closeBtn) return;

  function embedUrl(src) {
    var m;
    if ((m = src.match(/vimeo\.com\/(?:video\/)?(\d+)(?:\/(\w+))?/)))
      return 'https://player.vimeo.com/video/' + m[1] + '?autoplay=1&title=0&byline=0&portrait=0' + (m[2] ? '&h=' + m[2] : '');
    if ((m = src.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/)))
      return 'https://www.youtube-nocookie.com/embed/' + m[1] + '?autoplay=1&rel=0';
    return null;
  }

  function open() {
    var src = (modal.getAttribute('data-video') || '').trim();
    slot.innerHTML = '';
    fallback.hidden = false;
    if (src) {
      var url = embedUrl(src), el;
      if (url) {
        el = document.createElement('iframe');
        el.src = url;
        el.title = 'Showreel';
        el.allow = 'autoplay; fullscreen; picture-in-picture';
        el.allowFullscreen = true;
        fallback.hidden = true;
      } else {
        el = document.createElement('video');
        el.src = src;
        el.controls = true;
        el.autoplay = true;
        el.playsInline = true;
        el.addEventListener('loadeddata', function () { fallback.hidden = true; });
        el.addEventListener('error', function () { el.remove(); fallback.hidden = false; });
      }
      el.className = 'absolute inset-0 w-full h-full bg-black';
      slot.appendChild(el);
    }
    if (hero) hero.pause();
    modal.hidden = false;
    requestAnimationFrame(function () { modal.classList.remove('opacity-0', 'pointer-events-none'); });
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }
  function close() {
    modal.classList.add('opacity-0', 'pointer-events-none');
    slot.innerHTML = '';
    document.body.style.overflow = '';
    setTimeout(function () { modal.hidden = true; }, 300);
    if (hero && !hero.hasAttribute('data-paused') && hero.autoplay) { var p = hero.play(); if (p && p.catch) p.catch(function(){}); }
    openBtn.focus();
  }
  openBtn.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  modal.addEventListener('click', function (e) { if (e.target === modal) close(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !modal.hidden) close(); });
})();
