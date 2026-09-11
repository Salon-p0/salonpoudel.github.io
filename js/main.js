/* =========================================================================
   Salon Poudel — Portfolio interactions
   Vanilla JS: no build step required.
   ========================================================================= */
(function(){
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isFinePointer = window.matchMedia('(pointer:fine)').matches;
  if(isFinePointer){ document.documentElement.classList.add('has-fine-pointer'); }

  document.addEventListener('DOMContentLoaded', function(){
    initNav();
    initMobileMenu();
    initScrollProgress();
    initReveals();
    initCursor();
    initMagnetic();
    initAccordions();
    initHeroCanvas();
    initBackToTop();
    initPageTransitions();
    initActiveNav();
  });

  /* Sticky nav appearance -------------------------------------------------- */
  function initNav(){
    var nav = document.querySelector('.nav');
    if(!nav) return;
    var onScroll = function(){
      if(window.scrollY > 24){ nav.classList.add('is-scrolled'); }
      else{ nav.classList.remove('is-scrolled'); }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive:true });
  }

  /* Mobile menu -------------------------------------------------------------- */
  function initMobileMenu(){
    var toggle = document.querySelector('.nav-toggle');
    var menu = document.querySelector('.mobile-menu');
    if(!toggle || !menu) return;
    toggle.addEventListener('click', function(){
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      menu.classList.toggle('is-open', !open);
      document.body.style.overflow = !open ? 'hidden' : '';
    });
    menu.querySelectorAll('a').forEach(function(link){
      link.addEventListener('click', function(){
        toggle.setAttribute('aria-expanded','false');
        menu.classList.remove('is-open');
        document.body.style.overflow = '';
      });
    });
  }

  /* Scroll progress bar -------------------------------------------------- */
  function initScrollProgress(){
    var bar = document.querySelector('.scroll-progress');
    if(!bar) return;
    var update = function(){
      var h = document.documentElement;
      var scrollable = h.scrollHeight - h.clientHeight;
      var pct = scrollable > 0 ? (h.scrollTop / scrollable) * 100 : 0;
      bar.style.width = pct + '%';
    };
    update();
    window.addEventListener('scroll', update, { passive:true });
    window.addEventListener('resize', update);
  }

  /* Reveal-on-scroll ------------------------------------------------------ */
  function initReveals(){
    var items = document.querySelectorAll('.reveal, .reveal-mask');
    if(!items.length) return;
    if(reduceMotion || !('IntersectionObserver' in window)){
      items.forEach(function(el){ el.classList.add('in-view'); });
      return;
    }
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold:.16, rootMargin:'0px 0px -8% 0px' });
    items.forEach(function(el, i){
      el.style.setProperty('--i', el.closest('.stagger') ? (i % 8) : 0);
      io.observe(el);
    });
  }

  /* Custom cursor ----------------------------------------------------------- */
  function initCursor(){
    if(!isFinePointer || reduceMotion) return;
    var cursor = document.createElement('div');
    cursor.className = 'cursor';
    cursor.setAttribute('aria-hidden','true');
    document.body.appendChild(cursor);

    var x = window.innerWidth/2, y = window.innerHeight/2, cx = x, cy = y;
    window.addEventListener('mousemove', function(e){ x = e.clientX; y = e.clientY; });

    function raf(){
      cx += (x - cx) * .18;
      cy += (y - cy) * .18;
      cursor.style.transform = 'translate('+cx+'px,'+cy+'px) translate(-50%,-50%)';
      requestAnimationFrame(raf);
    }
    raf();

    document.querySelectorAll('.project, .cs-next').forEach(function(el){
      el.addEventListener('mouseenter', function(){ cursor.classList.add('is-view'); });
      el.addEventListener('mouseleave', function(){ cursor.classList.remove('is-view'); });
    });
    document.querySelectorAll('a, button, .skill-tag').forEach(function(el){
      if(el.closest('.project') || el.closest('.cs-next')) return;
      el.addEventListener('mouseenter', function(){ cursor.classList.add('is-link'); });
      el.addEventListener('mouseleave', function(){ cursor.classList.remove('is-link'); });
    });
  }

  /* Magnetic buttons --------------------------------------------------------- */
  function initMagnetic(){
    if(!isFinePointer || reduceMotion) return;
    document.querySelectorAll('.magnetic').forEach(function(el){
      el.addEventListener('mousemove', function(e){
        var r = el.getBoundingClientRect();
        var relX = e.clientX - r.left - r.width/2;
        var relY = e.clientY - r.top - r.height/2;
        el.style.transform = 'translate(' + (relX*.28) + 'px,' + (relY*.35) + 'px)';
      });
      el.addEventListener('mouseleave', function(){ el.style.transform = 'translate(0,0)'; });
    });
  }

  /* Accordions: services / timeline / process ---------------------------- */
  function initAccordions(){
    bindGroup('.service-row', false);
    bindGroup('.timeline-item', true);
    bindGroup('.process-item', false);

    function bindGroup(selector, allowMultiple){
      var items = document.querySelectorAll(selector);
      items.forEach(function(item){
        var head = item.querySelector('[data-accordion-trigger]') || item;
        head.addEventListener('click', function(){
          var willOpen = !item.classList.contains('is-open');
          if(!allowMultiple){
            items.forEach(function(other){ if(other !== item) other.classList.remove('is-open'); });
          }
          item.classList.toggle('is-open', willOpen);
        });
      });
    }
  }

  /* Hero canvas: subtle animated line/grid that responds to the cursor ---- */
  function initHeroCanvas(){
    var canvas = document.getElementById('hero-canvas');
    if(!canvas) return;
    var ctx = canvas.getContext('2d');
    var wrap = canvas.parentElement;
    var w, h, dpr = Math.min(window.devicePixelRatio || 1, 2);
    var pointer = { x:-9999, y:-9999 };
    var points = [];

    function resize(){
      w = wrap.clientWidth; h = wrap.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      canvas.style.width = w+'px'; canvas.style.height = h+'px';
      ctx.setTransform(dpr,0,0,dpr,0,0);
      buildGrid();
    }

    function buildGrid(){
      points = [];
      var cols = 12, rows = 8;
      var spacingX = w/(cols-1), spacingY = h/(rows-1);
      for(var i=0;i<cols;i++){
        for(var j=0;j<rows;j++){
          points.push({
            ox: i*spacingX, oy: j*spacingY,
            x: i*spacingX, y: j*spacingY
          });
        }
      }
    }

    window.addEventListener('mousemove', function(e){
      var r = wrap.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
    });
    window.addEventListener('mouseleave', function(){ pointer.x=-9999; pointer.y=-9999; });

    var accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#5BC1AC';
    var lineColor = 'rgba(24,24,24,0.06)';

    function draw(){
      if(!w || !h) { requestAnimationFrame(draw); return; }
      ctx.clearRect(0,0,w,h);
      var radius = Math.max(w,h) * .18;

      points.forEach(function(p){
        var dx = pointer.x - p.ox, dy = pointer.y - p.oy;
        var dist = Math.sqrt(dx*dx + dy*dy);
        var influence = Math.max(0, 1 - dist/radius);
        var pushX = influence * -dx * .12;
        var pushY = influence * -dy * .12;
        p.x += (p.ox + pushX - p.x) * .09;
        p.y += (p.oy + pushY - p.y) * .09;
      });

      ctx.strokeStyle = lineColor;
      ctx.lineWidth = 1;
      var cols = 12, rows = 8;
      for(var i=0;i<cols;i++){
        ctx.beginPath();
        for(var j=0;j<rows;j++){
          var p = points[i*rows+j];
          if(j===0) ctx.moveTo(p.x,p.y); else ctx.lineTo(p.x,p.y);
        }
        ctx.stroke();
      }
      for(var j2=0;j2<rows;j2++){
        ctx.beginPath();
        for(var i2=0;i2<cols;i2++){
          var p2 = points[i2*rows+j2];
          if(i2===0) ctx.moveTo(p2.x,p2.y); else ctx.lineTo(p2.x,p2.y);
        }
        ctx.stroke();
      }

      // Highlight nearest points to the cursor with the accent color
      ctx.fillStyle = accent;
      points.forEach(function(p){
        var dx = pointer.x - p.x, dy = pointer.y - p.y;
        var dist = Math.sqrt(dx*dx+dy*dy);
        if(dist < 60){
          var alpha = 1 - dist/60;
          ctx.globalAlpha = alpha * .8;
          ctx.beginPath();
          ctx.arc(p.x,p.y, 2.4, 0, Math.PI*2);
          ctx.fill();
          ctx.globalAlpha = 1;
        }
      });

      requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener('resize', resize);
    if(!reduceMotion){ requestAnimationFrame(draw); }
    else{ draw(); }
  }

  /* Back to top -------------------------------------------------------------- */
  function initBackToTop(){
    document.querySelectorAll('[data-back-top]').forEach(function(el){
      el.addEventListener('click', function(e){
        e.preventDefault();
        window.scrollTo({ top:0, behavior: reduceMotion ? 'auto' : 'smooth' });
      });
    });
  }

  /* Simple full-page transition overlay for internal navigation ------------ */
  function initPageTransitions(){
    if(reduceMotion) return;
    var overlay = document.createElement('div');
    overlay.className = 'page-overlay';
    document.body.appendChild(overlay);

    document.querySelectorAll('a[href]').forEach(function(link){
      var href = link.getAttribute('href');
      if(!href || href.indexOf('#') === 0 || href.indexOf('http') === 0 || href.indexOf('mailto:') === 0) return;
      link.addEventListener('click', function(e){
        if(e.metaKey || e.ctrlKey || link.target === '_blank') return;
        e.preventDefault();
        overlay.classList.add('animate-in');
        setTimeout(function(){ window.location.href = href; }, 520);
      });
    });

    window.addEventListener('pageshow', function(){
      overlay.classList.remove('animate-in');
      overlay.classList.add('animate-out');
    });
  }

  /* Active section indicator in nav (home page) ----------------------------- */
  function initActiveNav(){
    var sections = document.querySelectorAll('[data-nav-section]');
    var links = document.querySelectorAll('.nav-links a[data-nav-link]');
    if(!sections.length || !links.length || !('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          var id = entry.target.getAttribute('id');
          links.forEach(function(l){
            l.removeAttribute('aria-current');
            if(l.getAttribute('data-nav-link') === id){ l.setAttribute('aria-current','page'); }
          });
        }
      });
    }, { rootMargin:'-45% 0px -45% 0px' });
    sections.forEach(function(s){ io.observe(s); });
  }

/* Hero Typewriter Effect */
document.addEventListener("DOMContentLoaded", () => {
  const heading = document.getElementById("hero-typewriter");

  if (!heading) return;

  const textContainer = heading.querySelector(".typewriter-text");

  const fullText =
    "I design digital experiences that make complex things feel simple.";

  const beforeHighlight = "I design ";
  const highlightText = "digital experiences";
  const afterHighlight = " that make complex things feel simple.";

  let index = 0;

  function renderText() {
    const typedText = fullText.slice(0, index);

    const before = typedText.slice(0, beforeHighlight.length);

    const highlightStart = beforeHighlight.length;
    const highlightEnd = highlightStart + highlightText.length;

    const highlighted = typedText.slice(
      highlightStart,
      Math.min(index, highlightEnd)
    );

    const after = index > highlightEnd
      ? typedText.slice(highlightEnd)
      : "";

    textContainer.innerHTML =
      before +
      (highlighted
        ? `<span class="typewriter-highlight">${highlighted}</span>`
        : "") +
      after;

    if (index < fullText.length) {
      index++;
      setTimeout(renderText, 45);
    }
  }

  setTimeout(renderText, 500);
});   
   
})();
