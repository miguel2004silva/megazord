/* ==========================================================================
   ATLÉTICA MEGAZORD - UNIFICADA UNILESTE
   Interactive Application Engine v11.0 (Lovable Match Engine)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initBackgroundVideo();
  initNavbar();
  initCountdown();
  initAccordion();
  initCounters();
  initFormValidation();
  initModals();
  initScrollEffects();
  initCookieBanner();
  initSportsTabs();
  initBackgroundMusic();

  // Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
});

/* --- 0. GLOBAL BACKGROUND VIDEO ENGINE --- */
function initBackgroundVideo() {
  const video = document.getElementById('bgVideo') || document.getElementById('heroVideo');
  if (!video) return;

  video.muted = true;
  video.loop = true;
  video.playsInline = true;

  // Diagnostics check for format and loading errors
  video.addEventListener('error', (e) => {
    console.error('🚨 [VÍDEO DE FUNDO] Ocorreu um erro ao carregar o vídeo:', video.src);
    if (video.error) {
      console.error('Código do Erro:', video.error.code);
      console.error('Mensagem do Erro:', video.error.message);
      if (video.error.code === 4) {
        console.warn('⚠️ DICA: O navegador não pôde decodificar o vídeo. Se você renomeou o arquivo .mov para .mp4 manualmente sem convertê-lo de verdade, o navegador não conseguirá ler o codec de vídeo QuickTime/Apple.');
      }
    }
  });

  const playVideo = () => {
    const promise = video.play();
    if (promise !== undefined) {
      promise.catch((err) => {
        console.log('Autoplay prevented, attaching interaction triggers:', err);
        const handleUserInteraction = () => {
          video.play();
          window.removeEventListener('click', handleUserInteraction);
          window.removeEventListener('touchstart', handleUserInteraction);
          window.removeEventListener('scroll', handleUserInteraction);
          window.removeEventListener('mousemove', handleUserInteraction);
        };
        window.addEventListener('click', handleUserInteraction);
        window.addEventListener('touchstart', handleUserInteraction);
        window.addEventListener('scroll', handleUserInteraction);
        window.addEventListener('mousemove', handleUserInteraction);
      });
    }
  };

  playVideo();
}

/* --- 1. NAVBAR & MOBILE DRAWER --- */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerClose = document.getElementById('drawerClose');
  const drawerLinks = document.querySelectorAll('.drawer-link');
  const stickyCta = document.getElementById('stickyMobileCta');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }

    if (window.scrollY > 400) {
      stickyCta?.classList.add('visible');
    } else {
      stickyCta?.classList.remove('visible');
    }
  });

  mobileToggle?.addEventListener('click', () => {
    mobileDrawer?.classList.add('open');
    document.body.style.overflow = 'hidden';
  });

  const closeDrawer = () => {
    mobileDrawer?.classList.remove('open');
    document.body.style.overflow = '';
  };

  drawerClose?.addEventListener('click', closeDrawer);
  drawerLinks.forEach(link => link.addEventListener('click', closeDrawer));
}

/* --- 2. COUNTDOWN ENGINE --- */
function initCountdown() {
  const targetDate = new Date('2026-11-20T08:00:00').getTime();

  const daysEl = document.getElementById('cd-days');
  const hoursEl = document.getElementById('cd-hours');
  const minsEl = document.getElementById('cd-mins');
  const secsEl = document.getElementById('cd-secs');

  if (!daysEl) return;

  function updateTimer() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minsEl.textContent = '00';
      secsEl.textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minsEl.textContent = String(minutes).padStart(2, '0');
    secsEl.textContent = String(seconds).padStart(2, '0');
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

/* --- 3. ACCORDION SYSTEM --- */
function initAccordion() {
  const accordionHeaders = document.querySelectorAll('.accordion-header');

  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const isOpen = item.classList.contains('open');

      document.querySelectorAll('.accordion-item').forEach(i => {
        i.classList.remove('open');
        const btn = i.querySelector('.accordion-header');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        item.classList.add('open');
        header.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* --- 4. ANIMATED STATS COUNTERS --- */
function initCounters() {
  const statNumbers = document.querySelectorAll('.stat-number');
  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        statNumbers.forEach(counter => {
          const target = parseInt(counter.getAttribute('data-target') || '0', 10);
          let count = 0;
          const duration = 2000;
          const step = Math.ceil(target / (duration / 30));

          const timer = setInterval(() => {
            count += step;
            if (count >= target) {
              counter.textContent = `+${target}`;
              clearInterval(timer);
            } else {
              counter.textContent = `+${count}`;
            }
          }, 30);
        });
      }
    });
  }, { threshold: 0.5 });

  const statsSection = document.getElementById('sobre');
  if (statsSection) observer.observe(statsSection);
}

/* --- 5. FORM VALIDATION, MULTI-SELECT & GOOGLE SHEETS ENGINE --- */
function initFormValidation() {
  const form = document.getElementById('sellerForm');
  if (!form) return;

  // Toggle visual de botões tag-pill (Multi-seleção de esportes e diretorias)
  const tagPillBtns = document.querySelectorAll('.tag-pill-btn');
  tagPillBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.toggle('active');
    });
  });

  // URL Oficial do Google Apps Script fornecido pela diretoria
  const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbw_QAoCfptX-VrFuLvutiS2XYYCikjTtztVDDf33xbg1u1jTLWoZs7YP60ugBSkOhM/exec';

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const honeypot = document.getElementById('hp_field');
    if (honeypot && honeypot.value !== '') {
      showToast('Tentativa de spam detectada.', 'error');
      return;
    }

    const fullName = document.getElementById('fullName')?.value.trim();
    const email = document.getElementById('email')?.value.trim();
    const phone = document.getElementById('phone')?.value.trim();
    const course = document.getElementById('course')?.value.trim();
    const period = document.getElementById('period')?.value || '';
    const motivation = document.getElementById('motivation')?.value.trim();

    // Coleta dos itens selecionados nas tags
    const selectedSports = Array.from(document.querySelectorAll('#sportsTagGroup .tag-pill-btn.active'))
      .map(b => b.getAttribute('data-value'));

    const selectedDirectorates = Array.from(document.querySelectorAll('#directorateTagGroup .tag-pill-btn.active'))
      .map(b => b.getAttribute('data-value'));

    if (!fullName || fullName.length < 3) {
      showToast('Por favor, digite seu nome completo.', 'error');
      return;
    }
    if (!email || !email.includes('@')) {
      showToast('Por favor, digite um e-mail válido.', 'error');
      return;
    }
    if (!phone || phone.length < 10) {
      showToast('Por favor, digite seu número de WhatsApp com DDD.', 'error');
      return;
    }
    if (selectedSports.length === 0 && selectedDirectorates.length === 0) {
      showToast('Selecione pelo menos 1 esporte ou 1 diretoria de interesse!', 'error');
      return;
    }
    if (!motivation) {
      showToast('Por favor, preencha o campo de motivação.', 'error');
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="inline-flex items-center gap-2">Enviando Inscrição...</span>';
    }

    const sportsText = selectedSports.length > 0 ? selectedSports.join(', ') : 'Nenhum';
    const directoratesText = selectedDirectorates.length > 0 ? selectedDirectorates.join(', ') : 'Nenhuma';
    const timestamp = new Date().toLocaleString('pt-BR');

    const payload = {
      timestamp,
      nome: fullName,
      email,
      telefone: `+55${phone}`,
      curso: course,
      periodo: period,
      esportes: sportsText,
      diretorias: directoratesText,
      motivacao: motivation
    };

    // 1. Salva localmente como backup de segurança
    const existing = JSON.parse(localStorage.getItem('megazord_inscricoes') || '[]');
    existing.unshift(payload);
    localStorage.setItem('megazord_inscricoes', JSON.stringify(existing));

    // 2. Envio automático para a Planilha do Google via Google Apps Script
    try {
      await fetch(GOOGLE_SHEET_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (err) {
      console.warn('Servidor da planilha temporariamente inalcançável, dados salvos no backup local:', err);
    }

    showToast('Inscrição enviada com sucesso!', 'success');

    // Limpar formulário e tags ativas
    form.reset();
    tagPillBtns.forEach(b => b.classList.remove('active'));

    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `
        <span class="inline-flex items-center gap-2 group">
          Enviar Inscrição para a Equipe
          <i data-lucide="arrow-right" class="icon-inline" style="width: 17px; height: 17px; margin-left: 4px;"></i>
        </span>
      `;
      if (typeof lucide !== 'undefined') lucide.createIcons();
    }
  });
}

/* --- 6. MODAL MANAGER INSTITUCIONAL --- */
function initModals() {
  const backdrop = document.getElementById('modalBackdrop');
  const modalBox = document.getElementById('modalContent');
  const modalClose = document.getElementById('modalClose');

  function openModal(htmlContent) {
    if (!backdrop || !modalBox) return;
    modalBox.innerHTML = htmlContent;
    backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!backdrop) return;
    backdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  modalClose?.addEventListener('click', closeModal);
  backdrop?.addEventListener('click', (e) => {
    if (e.target === backdrop) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  // Modal de Produtos
  document.querySelectorAll('[data-action="open-product-modal"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const pName = btn.getAttribute('data-product-name') || 'Produto Megazord';
      const pPrice = btn.getAttribute('data-product-price') || 'R$ 0,00';
      openModal(`
        <div style="text-align: center;">
          <span style="font-size: 2.2rem;">👕</span>
          <h3 style="font-family: var(--font-display); font-size: 1.5rem; font-weight: 800; color: #fff; margin-top: 8px;">${pName}</h3>
          <p style="color: #60a5fa; font-size: 1.4rem; font-weight: 800; margin-top: 2px;">${pPrice}</p>
          
          <div style="margin: 20px 0; text-align: left;">
            <label style="color: var(--text-muted); font-size: 0.85rem; font-weight: 600;">Selecione seu Tamanho:</label>
            <select id="prod_size" class="form-select" style="margin-top: 5px; margin-bottom: 12px;">
              <option value="PP">PP</option>
              <option value="P">P</option>
              <option value="M" selected>M</option>
              <option value="G">G</option>
              <option value="GG">GG</option>
              <option value="XGG">XGG</option>
              <option value="Único">Tamanho Único</option>
            </select>

            <label style="color: var(--text-muted); font-size: 0.85rem; font-weight: 600;">Seu Nome & Curso:</label>
            <input type="text" id="prod_user" class="form-input" style="margin-top: 5px;" placeholder="Ex: Lucas - Engenharia 3º">
          </div>

          <button class="btn btn-primary w-full" onclick="
            const size = document.getElementById('prod_size').value;
            const user = document.getElementById('prod_user').value || 'Aluno Unileste';
            window.open('https://wa.me/5531999999999?text=' + encodeURIComponent('Olá! Quero encomendar ' + '${pName}' + ' (Tamanho: ' + size + ') no valor de ${pPrice}. Meu nome é ' + user + '. #TheLionIsInCharge'), '_blank');
          ">Fazer Pedido no WhatsApp</button>
        </div>
      `);
    });
  });

  // Modal de Eventos
  document.querySelectorAll('[data-action="open-ticket-modal"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const eventName = btn.getAttribute('data-event-name') || 'Evento Megazord';
      openModal(`
        <div style="text-align: center;">
          <span style="font-size: 2.2rem;">🏆</span>
          <h3 style="font-family: var(--font-display); font-size: 1.6rem; font-weight: 800; color: #fff; margin-top: 8px;">${eventName}</h3>
          <p style="color: var(--text-muted); font-size: 0.9rem; margin-top: 4px;">Informações oficiais e presença da Atlética Megazord</p>
          <div style="margin: 18px 0; padding: 16px; background: rgba(255,255,255,0.04); border-radius: 12px; text-align: left; border: 1px solid var(--border-card);">
            <p style="color: #fff; font-weight: bold; margin-bottom: 4px; font-size: 0.9rem;">📍 Localização & Detalhes:</p>
            <p style="color: var(--text-muted); font-size: 0.875rem; line-height: 1.5;">Acompanhe a cobertura oficial do evento, horários dos jogos e ponto de encontro da torcida unificada nas nossas redes sociais.</p>
          </div>
          <button class="btn btn-primary w-full" onclick="window.open('https://wa.me/5531999999999?text=' + encodeURIComponent('Olá! Quero saber mais detalhes sobre ' + '${eventName}'), '_blank');">Falar no WhatsApp</button>
        </div>
      `);
    });
  });

  // Modal de Esportes
  document.querySelectorAll('[data-action="open-sport-modal"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const sportName = btn.getAttribute('data-sport-name') || 'Modalidade';
      openModal(`
        <div style="text-align: center;">
          <span style="font-size: 2.2rem;">⚡</span>
          <h3 style="font-family: var(--font-display); font-size: 1.6rem; font-weight: 800; color: #fff; margin-top: 8px;">Seletiva ${sportName}</h3>
          <p style="color: var(--text-muted); font-size: 0.9rem; margin-top: 4px;">Venha vestir a camisa da Megazord nos torneios oficiais do Unileste!</p>
          <div style="margin: 18px 0; text-align: left;">
            <label style="color: var(--text-muted); font-size: 0.85rem; font-weight: 600;">Seu Nome Completo:</label>
            <input type="text" id="sport_athlete_name" class="form-input" style="margin-top: 4px; margin-bottom: 10px;" placeholder="Digite seu nome">
            <label style="color: var(--text-muted); font-size: 0.85rem; font-weight: 600;">Curso / Período / Posição:</label>
            <input type="text" id="sport_athlete_pos" class="form-input" style="margin-top: 4px;" placeholder="Ex: Engenharia 3º Período">
          </div>
          <button class="btn btn-primary w-full" onclick="
            const name = document.getElementById('sport_athlete_name').value || 'Atleta';
            const pos = document.getElementById('sport_athlete_pos').value || 'Geral';
            window.open('https://wa.me/5531999999999?text=' + encodeURIComponent('Olá! Quero me inscrever no treino de ${sportName}. Meu nome é ' + name + ' (' + pos + '). #TheLionIsInCharge'), '_blank');
          ">Confirmar no WhatsApp</button>
        </div>
      `);
    });
  });
}

/* --- 7. TOAST NOTIFICATIONS --- */
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  const icon = type === 'success' ? '✅' : type === 'error' ? '⚠️' : 'ℹ️';
  toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 300ms ease-out';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

/* --- 8. SCROLL REVEAL --- */
function initScrollEffects() {
  const elements = document.querySelectorAll('.lovable-card, .stat-card, .event-card, .sport-card, .product-card, .section-header');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.08 });

  elements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 500ms var(--ease-out), transform 500ms var(--ease-out)';
    observer.observe(el);
  });
}

/* --- 9. LGPD COOKIE BANNER --- */
function initCookieBanner() {
  if (localStorage.getItem('megazord_lgpd_consent') === 'true') return;

  const banner = document.createElement('div');
  banner.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 20px;
    right: 20px;
    max-width: 480px;
    z-index: 1000;
    background: rgba(15, 23, 42, 0.95);
    border: 1px solid var(--border-card);
    border-radius: 16px;
    padding: 18px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.7);
    backdrop-filter: blur(16px);
    color: #fff;
    font-size: 0.85rem;
  `;

  banner.innerHTML = `
    <p style="margin-bottom: 12px; color: #94a3b8; line-height: 1.5; display: flex; align-items: center; gap: 8px;">
      <i data-lucide="cookie" class="icon-inline" style="color: #fb923c; flex-shrink: 0; width: 18px; height: 18px;"></i>
      <span><strong>Privacidade:</strong> Utilizamos cookies para otimizar sua experiência de navegação e análise da Megazord.</span>
    </p>
    <div style="display: flex; gap: 10px; justify-content: flex-end;">
      <button id="acceptCookies" class="btn btn-primary btn-sm">Aceitar</button>
    </div>
  `;

  document.body.appendChild(banner);

  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  document.getElementById('acceptCookies')?.addEventListener('click', () => {
    localStorage.setItem('megazord_lgpd_consent', 'true');
    banner.remove();
    showToast('Preferências salvas.', 'success');
  });
}

/* --- 10. SPORTS TABS CONTROLLER --- */
function initSportsTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  if (tabBtns.length === 0) return;

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active from all buttons
      tabBtns.forEach(b => b.classList.remove('active'));
      // Add active to clicked button
      btn.classList.add('active');

      const targetTab = btn.getAttribute('data-tab');

      // Hide all content tabs
      tabContents.forEach(content => {
        content.style.display = 'none';
      });

      // Show target content tab
      const targetContent = document.getElementById(`tab-${targetTab}`);
      if (targetContent) {
        targetContent.style.display = 'block';
      }
    });
  });
}

/* --- 11. BACKGROUND MUSIC SYSTEM --- */
function initBackgroundMusic() {
  const audio = document.getElementById('bgMusic');
  const btn = document.getElementById('musicToggle');
  const volumeSlider = document.getElementById('volumeSlider');
  const volumeValue = document.getElementById('volumeValue');
  const tooltip = btn?.querySelector('.music-tooltip');
  
  if (!audio || !btn) return;

  // Set default initial volume to 10% (0.1) for soft ambient background sound
  const initialVolume = 0.1;
  audio.volume = initialVolume;

  if (volumeSlider) {
    volumeSlider.value = initialVolume;
    if (volumeValue) volumeValue.textContent = `${Math.round(initialVolume * 100)}%`;

    volumeSlider.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      audio.volume = val;
      if (volumeValue) volumeValue.textContent = `${Math.round(val * 100)}%`;
    });

    volumeSlider.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }

  // Tentar tocar no primeiro clique na página
  const tryAutoPlay = () => {
    audio.volume = volumeSlider ? parseFloat(volumeSlider.value) : 0.1;
    audio.play().then(() => {
      btn.classList.add('playing');
      if (tooltip) tooltip.textContent = 'Pausar Trilha';
      removeInteractionListeners();
    }).catch(err => {
      console.log('Autoplay recusado pelo navegador. Aguardando interação direta.', err);
    });
  };

  const removeInteractionListeners = () => {
    document.removeEventListener('click', tryAutoPlay);
    document.removeEventListener('touchstart', tryAutoPlay);
    document.removeEventListener('scroll', tryAutoPlay);
    document.removeEventListener('mousemove', tryAutoPlay);
  };

  // Tentar tocar imediatamente ao carregar (se permitido pelo navegador)
  tryAutoPlay();

  // Escuta interações globais para autoplay o mais rápido possível
  document.addEventListener('click', tryAutoPlay);
  document.addEventListener('touchstart', tryAutoPlay);
  document.addEventListener('scroll', tryAutoPlay);
  document.addEventListener('mousemove', tryAutoPlay);

  btn.addEventListener('click', (e) => {
    e.stopPropagation(); // Evitar disparar tryAutoPlay ao clicar no próprio botão
    removeInteractionListeners();

    if (audio.paused) {
      audio.volume = volumeSlider ? parseFloat(volumeSlider.value) : 0.1;
      audio.play();
      btn.classList.add('playing');
      if (tooltip) tooltip.textContent = 'Pausar Trilha';
      showToast('Trilha sonora iniciada', 'success');
    } else {
      audio.pause();
      btn.classList.remove('playing');
      if (tooltip) tooltip.textContent = 'Ativar Trilha';
      showToast('Trilha sonora pausada', 'info');
    }
  });
}
