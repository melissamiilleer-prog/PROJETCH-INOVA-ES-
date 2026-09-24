/* ═══════════════════════════════════════════════════
   PROJETCH INOVAÇÕES — main.js
   ═══════════════════════════════════════════════════ */
(() => {
  'use strict';

  /* ── DETECÇÃO MOBILE ─────────────────────────── */
  const isMobile = () => window.innerWidth <= 768;

  /* ── BARRA DE PROGRESSO ──────────────────────── */
  const progressBar = document.createElement('div');
  progressBar.id = 'scroll-progress';
  document.body.prepend(progressBar);

  /* ── CURSOR PERSONALIZADO ────────────────────── */
  let cursor = null, cursorRing = null;
  if (!isMobile()) {
    cursor    = document.createElement('div'); cursor.className    = 'cursor';
    cursorRing = document.createElement('div'); cursorRing.className = 'cursor-ring';
    document.body.append(cursor, cursorRing);
    // Só esconde o cursor padrão do sistema depois que o cursor
    // customizado foi criado com sucesso — evita ficar sem cursor
    // visível caso algo falhe antes deste ponto.
    document.body.classList.add('custom-cursor-active');
  }

  let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX; mouseY = e.clientY;
    if (cursor) { cursor.style.left = mouseX + 'px'; cursor.style.top = mouseY + 'px'; }
  });

  if (cursorRing) {
    const animRing = () => {
      ringX += (mouseX - ringX) * 0.11;
      ringY += (mouseY - ringY) * 0.11;
      cursorRing.style.left = ringX + 'px';
      cursorRing.style.top  = ringY + 'px';
      requestAnimationFrame(animRing);
    };
    animRing();
  }

  const hoverTargets = 'a, button, .tech-pill, .service-card, .diff-card, .project-card, .stat-box, .hamburger, input, select, textarea';
  document.querySelectorAll(hoverTargets).forEach(el => {
    el.addEventListener('mouseenter', () => { cursor?.classList.add('hover'); cursorRing?.classList.add('hover'); });
    el.addEventListener('mouseleave', () => { cursor?.classList.remove('hover'); cursorRing?.classList.remove('hover'); });
  });

  /* ── PARTÍCULAS DO HERO ──────────────────────── */
  const hero = document.querySelector('.hero');
  if (hero) {
    const particles = document.createElement('div');
    particles.className = 'hero-particles';
    for (let i = 0; i < 8; i++) particles.appendChild(document.createElement('span'));
    hero.prepend(particles);

    const heroVisual = hero.querySelector('.hero-visual');
    if (heroVisual && !heroVisual.querySelector('.hero-ring3')) {
      const ring3 = document.createElement('div');
      ring3.className = 'hero-ring3';
      heroVisual.appendChild(ring3);
    }
  }

  /* ── TECH TRACK: DUPLICAR PARA SCROLL INFINITO ─ */
  const techTrack = document.querySelector('.tech-track, .tech-row');
  if (techTrack && !techTrack.dataset.cloned) {
    techTrack.dataset.cloned = '1';
    const clone = techTrack.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    techTrack.parentElement.appendChild(clone);
  }

  /* ── SERVICE CARD — RASTREIO DE MOUSE ───────── */
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', ((e.clientX - r.left) / r.width  * 100).toFixed(1) + '%');
      card.style.setProperty('--my', ((e.clientY - r.top)  / r.height * 100).toFixed(1) + '%');
    });
  });

  /* ── SCROLL REVEAL ───────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -36px 0px' });
  revealEls.forEach(el => revealObs.observe(el));

  /* ── SCROLL: PROGRESS + NAV ──────────────────── */
  const nav = document.querySelector('nav');
  const onScroll = () => {
    const scrolled  = window.scrollY;
    const maxScroll = Math.max(document.body.scrollHeight - window.innerHeight, 1);
    progressBar.style.width = (scrolled / maxScroll * 100) + '%';
    nav?.classList.toggle('scrolled', scrolled > 24);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── HAMBURGER / MENU MOBILE ─────────────────── */
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  window.toggleMobile = () => {
    const open = mobileMenu?.classList.toggle('open');
    hamburger?.classList.toggle('open');
    document.body.style.overflow = open ? 'hidden' : '';
  };

  mobileMenu?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger?.classList.remove('open');
      mobileMenu?.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  document.addEventListener('click', e => {
    if (
      mobileMenu?.classList.contains('open') &&
      !mobileMenu.contains(e.target) &&
      !hamburger?.contains(e.target)
    ) {
      hamburger?.classList.remove('open');
      mobileMenu?.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  /* ── LINK ATIVO NA NAV ───────────────────────── */
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a => {
    if (a.getAttribute('href') === page) a.classList.add('active-link');
  });

  /* ── TOAST ───────────────────────────────────── */
  let toastTimer = null;
  window.showToast = (msg, success = false) => {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.style.borderColor = success ? 'rgba(0,224,255,0.4)' : 'rgba(255,80,80,0.4)';
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 3600);
  };

  /* ── FORMULÁRIO DE CONTATO ───────────────────── */
  window.submitForm = () => {
    const get = id => document.getElementById(id);
    const nome    = get('f-nome')?.value.trim();
    const empresa = get('f-empresa')?.value.trim();
    const email   = get('f-email')?.value.trim();
    const tel     = get('f-tel')?.value.trim();
    const tipo    = get('f-tipo')?.value;
    const prazo   = get('f-prazo')?.value;
    const desc    = get('f-desc')?.value.trim();
    const refs    = get('f-refs')?.value.trim();
    const lgpd    = get('f-lgpd')?.checked;
    const btn     = get('btn-submit');
    const honeypot = get('f-website')?.value.trim();

    // Campo-armadilha preenchido = provavelmente um bot. Finge sucesso
    // e não envia nada, sem alertar o robô de que foi bloqueado.
    if (honeypot) {
      get('form-area').style.display    = 'none';
      get('form-success').style.display = 'block';
      return;
    }

    if (!nome)                          { showToast('Informe seu nome.', false);             return; }
    if (!email || !email.includes('@')) { showToast('Informe um e-mail válido.', false);      return; }
    if (!tipo)                          { showToast('Selecione o tipo de projeto.', false);   return; }
    if (!desc)                          { showToast('Descreva o seu projeto.', false);        return; }
    if (!lgpd)                          { showToast('Aceite os termos da LGPD.', false);      return; }

    btn.disabled = true;
    const span = btn.querySelector('span') || btn;
    span.textContent = 'Enviando...';

    const payload = {
      nome,
      empresa:  empresa  || 'Não informada',
      email,
      telefone: tel       || 'Não informado',
      tipo_projeto: tipo,
      prazo:     prazo    || 'Não informado',
      descricao: desc,
      referencias: refs   || 'Nenhuma',
      _subject:  `[Projetch] Novo projeto — ${tipo}`,
      _replyto:  email,
      _template: 'table',
      _captcha:  'false'
    };

    fetch('https://formsubmit.co/ajax/projetechinovacoes@gmail.com', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body:    JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(data => {
      if (data.success === 'true' || data.success === true) {
        get('form-area').style.display    = 'none';
        get('form-success').style.display = 'block';
        showToast('Solicitação enviada com sucesso!', true);
      } else {
        throw new Error('Falha no envio');
      }
    })
    .catch(() => {
      btn.disabled = false;
      span.textContent = '⟶ ENVIAR SOLICITAÇÃO';
      showToast('Erro ao enviar. Tente novamente ou nos contacte por e-mail.', false);
    });
  };

  window.resetForm = () => {
    const get = id => document.getElementById(id);
    const btn = get('btn-submit');
    if (btn) {
      btn.disabled = false;
      (btn.querySelector('span') || btn).textContent = '⟶ ENVIAR SOLICITAÇÃO';
    }
    const ids = ['f-nome','f-empresa','f-email','f-tel','f-tipo','f-prazo','f-desc','f-refs'];
    ids.forEach(id => { const el = get(id); if (el) el.value = ''; });
    const lgpd = get('f-lgpd'); if (lgpd) lgpd.checked = false;
    get('form-area').style.display   = 'block';
    get('form-success').style.display = 'none';
  };

  /* ── RESIZE: RECRIAR CURSOR SE NECESSÁRIO ────── */
  window.addEventListener('resize', () => {
    if (!isMobile() && !cursor) location.reload();
  });

})();
