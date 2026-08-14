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

})();
