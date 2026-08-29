/* Chakkani Chitralu — Enhancement Layer JS
   Header scroll shadow, scroll-reveal animations,
   decorative bloom-flower SVG injection, falling petals. */
(function(){

  /* ---- header shadow on scroll ---- */
  var header = document.querySelector('header.site');
  function onScroll(){
    if(!header) return;
    if(window.scrollY > 10) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  /* ---- scroll reveal ---- */
  var revealSelectors = '.card,.gallery-item,.step,.about-image,.about > div,.contact-list,form,.section-head,.cta h2,.cta p,.cta .btn';
  var revealEls = document.querySelectorAll(revealSelectors);
  revealEls.forEach(function(el){ el.classList.add('reveal'); });

  if('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, {threshold:.15, rootMargin:'0px 0px -40px 0px'});
    revealEls.forEach(function(el){ io.observe(el); });
  } else {
    revealEls.forEach(function(el){ el.classList.add('in-view'); });
  }

  /* ---- decorative bloom flower ---- */
  var FLOWER_SVG =
    '<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      '<g>' +
        Array.from({length:8}).map(function(_,i){
          var angle = i * 45;
          return '<ellipse cx="100" cy="58" rx="17" ry="40" transform="rotate(' + angle + ' 100 100)" ' +
            'fill="var(--clay)" fill-opacity="0.14" stroke="var(--clay)" stroke-opacity="0.45" stroke-width="1"/>';
        }).join('') +
        '<circle cx="100" cy="100" r="13" fill="var(--soft)" fill-opacity="0.4" stroke="var(--soft)" stroke-opacity="0.7" stroke-width="1"/>' +
      '</g>' +
    '</svg>';

  document.querySelectorAll('.hero, .page-head').forEach(function(section){
    var deco = document.createElement('div');
    deco.className = 'bloom-flower';
    deco.setAttribute('aria-hidden', 'true');
    deco.innerHTML = FLOWER_SVG;
    section.appendChild(deco);
  });

  /* ---- falling petals ---- */
  var field = document.createElement('div');
  field.id = 'petal-field';
  field.setAttribute('aria-hidden', 'true');
  document.body.appendChild(field);

  var PETAL_COLORS = ['#D4A359', '#E5B86F', '#7c3f3f', '#F5F2EB'];
  function petalSvg(color){
    return '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">' +
      '<path d="M12 2C7 6 4 10 4 14a8 8 0 0 0 16 0c0-4-3-8-8-12z" fill="' + color + '" opacity="0.82"/>' +
      '</svg>';
  }

  var petalCount = window.innerWidth < 640 ? 7 : 13;
  for (var i = 0; i < petalCount; i++){
    var p = document.createElement('div');
    p.className = 'petal';
    var size = 10 + Math.random() * 14;
    p.style.width = size + 'px';
    p.style.height = size + 'px';
    p.style.left = (Math.random() * 100) + 'vw';
    var duration = 13 + Math.random() * 15;
    p.style.animationDuration = duration + 's';
    p.style.animationDelay = (Math.random() * duration * -1) + 's';
    p.innerHTML = petalSvg(PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)]);
    field.appendChild(p);
  }

  /* ---- announcement banner dismiss (persists via localStorage) ---- */
  var banner = document.getElementById('announceBanner');
  var closeBtn = document.getElementById('announceClose');
  if (banner && closeBtn) {
    try {
      if (localStorage.getItem('cc-announce-dismissed') === '1') {
        banner.classList.add('dismissed');
      }
    } catch (e) {}
    closeBtn.addEventListener('click', function(){
      banner.classList.add('dismissed');
      try { localStorage.setItem('cc-announce-dismissed', '1'); } catch (e) {}
    });
  }

  /* ---- click-to-zoom / full screen image view ---- */
  var overlay = document.createElement('div');
  overlay.className = 'lightbox-overlay';
  overlay.setAttribute('aria-hidden', 'true');
  overlay.innerHTML =
    '<button type="button" class="lightbox-close" aria-label="Close">&times;</button>' +
    '<img src="" alt="">';
  document.body.appendChild(overlay);
  var overlayImg = overlay.querySelector('img');
  var overlayClose = overlay.querySelector('.lightbox-close');
  var lastFocused = null;

  function openLightbox(src, alt){
    overlayImg.src = src;
    overlayImg.alt = alt || '';

    // Lock BOTH the document and body so the full-screen viewer is truly
    // viewport-sized and the underlying page cannot scroll underneath it.
    // Keeping the scroll position also makes closing the viewer return the
    // visitor to exactly the same place in the gallery.
    window.__ccLightboxScrollY = window.scrollY || window.pageYOffset || 0;
    document.documentElement.classList.add('lightbox-open');
    document.body.classList.add('lightbox-open');

    overlay.classList.add('open');

    lastFocused = document.activeElement;
    overlayClose.focus();
  }
  function closeLightbox(){
    overlay.classList.remove('open');
    document.documentElement.classList.remove('lightbox-open');
    document.body.classList.remove('lightbox-open');
    if (typeof window.__ccLightboxScrollY === 'number') {
      window.scrollTo(0, window.__ccLightboxScrollY);
    }
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }
  overlay.addEventListener('click', function(e){
    if (e.target === overlay) closeLightbox();
  });
  overlayClose.addEventListener('click', closeLightbox);
  document.addEventListener('keydown', function(e){
    if (e.key === 'Escape' && overlay.classList.contains('open')) closeLightbox();
  });

  var zoomSelectors = '.card-image img,.gallery-item img,.about-image img,.hero-image img';
  var TAP_MOVE_TOLERANCE = 10;   // px of finger movement still counted as a tap
  var TAP_TIME_LIMIT = 500;      // ms — longer than this counts as a press/hold, not a tap

  document.querySelectorAll(zoomSelectors).forEach(function(img){
    img.setAttribute('tabindex', '0');
    img.setAttribute('role', 'button');
    img.setAttribute('aria-label', 'View full screen: ' + (img.alt || 'image'));
    img.style.touchAction = 'manipulation';

    var startX = 0, startY = 0, startTime = 0, tracking = false;

    img.addEventListener('pointerdown', function(e){
      // Only track primary touch/mouse interactions
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      tracking = true;
      startX = e.clientX;
      startY = e.clientY;
      startTime = Date.now();
    });

    img.addEventListener('pointerup', function(e){
      if (!tracking) return;
      tracking = false;
      var dx = Math.abs(e.clientX - startX);
      var dy = Math.abs(e.clientY - startY);
      var dt = Date.now() - startTime;
      // Only treat as a "view full screen" tap if the finger/mouse barely moved
      // and it wasn't a long press — this avoids scroll/swipe gestures being
      // mistaken for (or swallowing) a tap on touch devices.
      if (dx <= TAP_MOVE_TOLERANCE && dy <= TAP_MOVE_TOLERANCE && dt <= TAP_TIME_LIMIT){
        openLightbox(img.currentSrc || img.src, img.alt);
      }
    });

    img.addEventListener('pointercancel', function(){
      tracking = false;
    });

    // Fallback for browsers without PointerEvent support
    if (!window.PointerEvent){
      img.addEventListener('click', function(){
        openLightbox(img.currentSrc || img.src, img.alt);
      });
    }

    img.addEventListener('keydown', function(e){
      if (e.key === 'Enter' || e.key === ' '){
        e.preventDefault();
        openLightbox(img.currentSrc || img.src, img.alt);
      }
    });
  });

})();
