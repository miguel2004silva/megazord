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

  window.addEventListener('resize', () => {
    if (window.innerWidth >= 1024) {
      closeDrawer();
    }
  });
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
  if (statNumbers.length === 0) return;

  const animateCounter = (counter) => {
    if (counter.classList.contains('animated')) return;
    counter.classList.add('animated');

    const target = parseInt(counter.getAttribute('data-target') || '0', 10);
    let count = 0;
    const duration = 2000;
    const step = Math.max(1, Math.ceil(target / (duration / 30)));

    const timer = setInterval(() => {
      count += step;
      if (count >= target) {
        counter.textContent = `+${target}`;
        clearInterval(timer);
      } else {
        counter.textContent = `+${count}`;
      }
    }, 30);
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -20px 0px' });

    statNumbers.forEach(counter => observer.observe(counter));
  } else {
    statNumbers.forEach(counter => animateCounter(counter));
  }
}

/* --- 5. FORM VALIDATION, CUSTOM SELECT, AUTOCOMPLETE & GOOGLE SHEETS ENGINE --- */
function initFormValidation() {
  const form = document.getElementById('sellerForm');
  
  // 1. MÁSCARA E RESTRIÇÃO ESTRITA DE NÚMERO DE TELEFONE (#phone)
  const phoneInput = document.getElementById('phone');
  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      phoneInput.classList.remove('input-error');
      let val = e.target.value;
      // Permite apenas dígitos
      let digits = val.replace(/\D/g, '');
      // Restringe estritamente a no máximo 11 dígitos (DDD + 9 dígitos)
      if (digits.length > 11) {
        digits = digits.slice(0, 11);
      }
      
      let formatted = '';
      if (digits.length > 0) {
        formatted = '(' + digits.slice(0, 2);
      }
      if (digits.length >= 3) {
        formatted += ') ';
        if (digits.length <= 10) {
          formatted += digits.slice(2, 6);
          if (digits.length >= 7) {
            formatted += '-' + digits.slice(6);
          }
        } else {
          formatted += digits.slice(2, 7);
          if (digits.length >= 8) {
            formatted += '-' + digits.slice(7);
          }
        }
      }
      e.target.value = formatted;
    });
  }

  // 2. AUTOCOMPLETE DE E-MAIL COM OPÇÕES (@gmail.com, @outlook.com, ETC)
  const emailInput = document.getElementById('email');
  const emailSuggestions = document.getElementById('emailSuggestions');
  const domains = ['@gmail.com', '@outlook.com', '@hotmail.com', '@yahoo.com.br', '@icloud.com', '@live.com'];

  if (emailInput && emailSuggestions) {
    emailInput.addEventListener('input', () => {
      emailInput.classList.remove('input-error');
      const val = emailInput.value;
      const atIndex = val.indexOf('@');

      if (atIndex !== -1) {
        const username = val.slice(0, atIndex);
        const typedDomain = val.slice(atIndex).toLowerCase();

        if (username.length > 0) {
          const matchingDomains = domains.filter(d => d.toLowerCase().startsWith(typedDomain));
          
          if (matchingDomains.length > 0) {
            emailSuggestions.innerHTML = matchingDomains.map(d => `
              <div class="email-suggestion-item" data-full-email="${username}${d}">
                <span>${username}<span class="email-suggestion-domain">${d}</span></span>
                <i data-lucide="corner-down-left" style="width: 14px; height: 14px; color: #60a5fa;"></i>
              </div>
            `).join('');
            
            if (typeof lucide !== 'undefined') lucide.createIcons();
            emailSuggestions.classList.add('active');

            // Adiciona evento de clique nas sugestões
            emailSuggestions.querySelectorAll('.email-suggestion-item').forEach(item => {
              item.addEventListener('mousedown', (e) => {
                e.preventDefault();
                emailInput.value = item.getAttribute('data-full-email');
                emailSuggestions.classList.remove('active');
              });
            });
            return;
          }
        }
      }
      emailSuggestions.classList.remove('active');
    });

    emailInput.addEventListener('blur', () => {
      setTimeout(() => emailSuggestions.classList.remove('active'), 200);
    });
  }

  // 3. SELECT DE PERÍODO CUSTOMIZADO PESQUISÁVEL (ESTILO DA FOTO)
  const periodWrapper = document.getElementById('periodSelectWrapper');
  const periodTrigger = document.getElementById('periodSelectTrigger');
  const periodPopover = document.getElementById('periodSelectPopover');
  const periodValue = document.getElementById('periodSelectValue');
  const periodHidden = document.getElementById('period');
  const periodSearchInput = document.getElementById('periodSearchInput');
  const periodOptionsList = document.getElementById('periodOptionsList');
  const periodNoResults = document.getElementById('periodNoResults');

  if (periodWrapper && periodTrigger && periodOptionsList) {
    const toggleDropdown = (e) => {
      if (e) e.stopPropagation();
      const isOpen = periodWrapper.classList.contains('open');
      document.querySelectorAll('.custom-select-wrapper.open').forEach(w => w.classList.remove('open'));
      
      if (!isOpen) {
        periodWrapper.classList.add('open');
        periodTrigger.classList.remove('input-error');
        if (periodSearchInput) {
          periodSearchInput.value = '';
          filterPeriodOptions('');
          setTimeout(() => periodSearchInput.focus(), 60);
        }
      } else {
        periodWrapper.classList.remove('open');
      }
    };

    periodTrigger.addEventListener('click', toggleDropdown);

    periodTrigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        toggleDropdown(e);
      }
    });

    if (periodPopover) {
      periodPopover.addEventListener('click', (e) => {
        e.stopPropagation();
      });
    }

    function filterPeriodOptions(query) {
      const q = query.trim().toLowerCase();
      let hasMatches = false;
      const items = periodOptionsList.querySelectorAll('.custom-select-item');
      
      items.forEach(item => {
        const text = item.textContent.toLowerCase();
        if (text.includes(q)) {
          item.style.display = 'block';
          hasMatches = true;
        } else {
          item.style.display = 'none';
        }
      });

      if (periodNoResults) {
        periodNoResults.style.display = hasMatches ? 'none' : 'block';
      }
    }

    if (periodSearchInput) {
      periodSearchInput.addEventListener('input', (e) => {
        filterPeriodOptions(e.target.value);
      });
    }

    periodOptionsList.querySelectorAll('.custom-select-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        const selectedVal = item.getAttribute('data-value');
        
        if (periodHidden) periodHidden.value = selectedVal;
        if (periodValue) {
          periodValue.textContent = selectedVal;
          periodValue.classList.remove('placeholder');
        }

        periodOptionsList.querySelectorAll('.custom-select-item').forEach(i => i.classList.remove('selected'));
        item.classList.add('selected');

        periodWrapper.classList.remove('open');
        periodTrigger.classList.remove('input-error');
      });
    });

    document.addEventListener('click', () => {
      periodWrapper.classList.remove('open');
    });
  }

  // 4. SELECTS CUSTOMIZADOS MULTI-SELEÇÃO PESQUISÁVEIS (MODALIDADES E DIRETORIAS)
  function initMultiCustomSelect({ wrapperId, triggerId, popoverId, valueId, searchInputId, optionsListId, noResultsId, tagsContainerId, countTextId, doneBtnId, placeholderText }) {
    const wrapper = document.getElementById(wrapperId);
    const trigger = document.getElementById(triggerId);
    const popover = document.getElementById(popoverId);
    const valueSpan = document.getElementById(valueId);
    const searchInput = document.getElementById(searchInputId);
    const optionsList = document.getElementById(optionsListId);
    const noResults = document.getElementById(noResultsId);
    const tagsContainer = document.getElementById(tagsContainerId);
    const countTextEl = countTextId ? document.getElementById(countTextId) : null;
    const doneBtnEl = doneBtnId ? document.getElementById(doneBtnId) : null;

    if (!wrapper || !trigger || !optionsList) return { getSelectedValues: () => [], reset: () => {} };

    const toggleDropdown = (e) => {
      if (e) e.stopPropagation();
      const isOpen = wrapper.classList.contains('open');
      document.querySelectorAll('.custom-select-wrapper.open').forEach(w => w.classList.remove('open'));
      
      if (!isOpen) {
        wrapper.classList.add('open');
        trigger.classList.remove('input-error');
        if (searchInput) {
          searchInput.value = '';
          filterOptions('');
          setTimeout(() => searchInput.focus(), 60);
        }
      } else {
        wrapper.classList.remove('open');
      }
    };

    trigger.addEventListener('click', toggleDropdown);

    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        toggleDropdown(e);
      }
    });

    if (popover) {
      popover.addEventListener('click', (e) => e.stopPropagation());
    }

    if (doneBtnEl) {
      doneBtnEl.addEventListener('click', (e) => {
        e.stopPropagation();
        wrapper.classList.remove('open');
      });
    }

    function filterOptions(query) {
      const q = query.trim().toLowerCase();
      let hasMatches = false;
      optionsList.querySelectorAll('.custom-select-item').forEach(item => {
        const text = item.textContent.toLowerCase();
        if (text.includes(q)) {
          item.style.display = 'flex';
          hasMatches = true;
        } else {
          item.style.display = 'none';
        }
      });
      if (noResults) noResults.style.display = hasMatches ? 'none' : 'block';
    }

    if (searchInput) {
      searchInput.addEventListener('input', (e) => filterOptions(e.target.value));
    }

    function updateDisplay() {
      const selectedItems = Array.from(optionsList.querySelectorAll('.custom-select-item.selected'));
      const values = selectedItems.map(i => i.getAttribute('data-value'));

      if (countTextEl) {
        countTextEl.textContent = `${values.length} selecionada(s)`;
      }

      if (values.length === 0) {
        if (valueSpan) {
          valueSpan.textContent = placeholderText;
          valueSpan.classList.add('placeholder');
        }
        if (tagsContainer) tagsContainer.style.display = 'none';
      } else {
        if (valueSpan) {
          if (values.length === 1) {
            valueSpan.textContent = values[0];
          } else {
            valueSpan.textContent = `${values[0]}...`;
          }
          valueSpan.classList.remove('placeholder');
        }
        
        if (tagsContainer) {
          tagsContainer.style.display = 'flex';
          tagsContainer.innerHTML = values.map(v => `
            <span class="selected-tag-chip">
              <span>${v}</span>
              <button type="button" data-remove-val="${v}" aria-label="Remover">&times;</button>
            </span>
          `).join('');

          tagsContainer.querySelectorAll('button[data-remove-val]').forEach(btn => {
            btn.addEventListener('click', (e) => {
              e.stopPropagation();
              const valToRemove = btn.getAttribute('data-remove-val');
              const targetOpt = optionsList.querySelector(`.custom-select-item[data-value="${valToRemove}"]`);
              if (targetOpt) {
                targetOpt.classList.remove('selected');
                updateDisplay();
              }
            });
          });
        }
      }
    }

    optionsList.querySelectorAll('.custom-select-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        item.classList.toggle('selected');
        updateDisplay();
        trigger.classList.remove('input-error');
      });
    });

    document.addEventListener('click', () => {
      wrapper.classList.remove('open');
    });

    return {
      getSelectedValues: () => Array.from(optionsList.querySelectorAll('.custom-select-item.selected')).map(i => i.getAttribute('data-value')),
      reset: () => {
        optionsList.querySelectorAll('.custom-select-item').forEach(i => i.classList.remove('selected'));
        updateDisplay();
      }
    };
  }

  const sportsSelect = initMultiCustomSelect({
    wrapperId: 'sportsSelectWrapper',
    triggerId: 'sportsSelectTrigger',
    popoverId: 'sportsSelectPopover',
    valueId: 'sportsSelectValue',
    searchInputId: 'sportsSearchInput',
    optionsListId: 'sportsOptionsList',
    noResultsId: 'sportsNoResults',
    tagsContainerId: 'sportsSelectedTags',
    countTextId: 'sportsCountText',
    doneBtnId: 'sportsDoneBtn',
    placeholderText: 'Selecione as Modalidades *'
  });

  const directorateSelect = initMultiCustomSelect({
    wrapperId: 'directorateSelectWrapper',
    triggerId: 'directorateSelectTrigger',
    popoverId: 'directorateSelectPopover',
    valueId: 'directorateSelectValue',
    searchInputId: 'directorateSearchInput',
    optionsListId: 'directorateOptionsList',
    noResultsId: 'directorateNoResults',
    tagsContainerId: 'directorateSelectedTags',
    countTextId: 'directorateCountText',
    doneBtnId: 'directorateDoneBtn',
    placeholderText: 'Selecione as Diretorias *'
  });

  // Limpar erro ao digitar nos campos
  ['fullName', 'course', 'motivation'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', (e) => {
      e.target.classList.remove('input-error');
    });
  });

  if (!form) return;

  // URL Oficial do Google Apps Script
  const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbw_QAoCfptX-VrFuLvutiS2XYYCikjTtztVDDf33xbg1u1jTLWoZs7YP60ugBSkOhM/exec';

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Resetar estilos de erro prévios
    document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));

    const honeypot = document.getElementById('hp_field');
    if (honeypot && honeypot.value !== '') {
      showToast('Tentativa de spam detectada.', 'error');
      return;
    }

    const fullNameEl = document.getElementById('fullName');
    const emailEl = document.getElementById('email');
    const phoneEl = document.getElementById('phone');
    const courseEl = document.getElementById('course');
    const periodHiddenEl = document.getElementById('period');
    const periodTriggerEl = document.getElementById('periodSelectTrigger');
    const motivationEl = document.getElementById('motivation');

    const fullName = fullNameEl?.value.trim() || '';
    const email = emailEl?.value.trim() || '';
    const phone = phoneEl?.value.trim() || '';
    const course = courseEl?.value.trim() || '';
    const period = periodHiddenEl?.value || '';
    const motivation = motivationEl?.value.trim() || '';

    // Coleta dos itens selecionados nos selects customizados
    const selectedSports = sportsSelect.getSelectedValues();
    const selectedDirectorates = directorateSelect.getSelectedValues();

    // VALIDAÇÃO RIGOROSA DE TODOS OS CAMPOS OBRIGATÓRIOS
    if (!fullName || fullName.length < 3) {
      fullNameEl?.classList.add('input-error');
      fullNameEl?.focus();
      showToast('Por favor, digite seu nome completo (campo obrigatório).', 'error');
      return;
    }

    if (!email || !email.includes('@') || !email.includes('.')) {
      emailEl?.classList.add('input-error');
      emailEl?.focus();
      showToast('Por favor, digite um e-mail válido com @ e domínio.', 'error');
      return;
    }

    const rawDigits = phone.replace(/\D/g, '');
    if (!phone || rawDigits.length < 10) {
      phoneEl?.classList.add('input-error');
      phoneEl?.focus();
      showToast('Por favor, digite um número de WhatsApp válido com DDD (10 ou 11 dígitos).', 'error');
      return;
    }

    if (!course || course.length < 2) {
      courseEl?.classList.add('input-error');
      courseEl?.focus();
      showToast('Por favor, informe seu curso no Unileste (campo obrigatório).', 'error');
      return;
    }

    if (!period) {
      periodTriggerEl?.classList.add('input-error');
      periodTriggerEl?.focus();
      showToast('Por favor, selecione seu período de graduação (campo obrigatório).', 'error');
      return;
    }

    if (selectedSports.length === 0 && selectedDirectorates.length === 0) {
      document.getElementById('sportsSelectTrigger')?.classList.add('input-error');
      document.getElementById('directorateSelectTrigger')?.classList.add('input-error');
      showToast('Por favor, selecione pelo menos 1 esporte ou 1 diretoria de interesse!', 'error');
      return;
    }

    if (!motivation || motivation.length < 5) {
      motivationEl?.classList.add('input-error');
      motivationEl?.focus();
      showToast('Por favor, preencha o campo de motivação (campo obrigatório).', 'error');
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
      telefone: `'` + `+55 ${phone}`,
      curso: course,
      periodo: period,
      esportes: sportsText,
      diretorias: directoratesText,
      motivacao: motivation
    };

    // Salva localmente como backup de segurança
    const existing = JSON.parse(localStorage.getItem('megazord_inscricoes') || '[]');
    existing.unshift(payload);
    localStorage.setItem('megazord_inscricoes', JSON.stringify(existing));

    // Envio para o Google Apps Script
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

    // Limpar formulário, select customizado e tags ativas
    form.reset();
    if (periodHiddenEl) periodHiddenEl.value = '';
    const periodValSpan = document.getElementById('periodSelectValue');
    if (periodValSpan) {
      periodValSpan.textContent = 'Selecione seu Período *';
      periodValSpan.classList.add('placeholder');
    }
    const periodOpts = document.getElementById('periodOptionsList');
    periodOpts?.querySelectorAll('.custom-select-item').forEach(i => i.classList.remove('selected'));
    sportsSelect.reset();
    directorateSelect.reset();

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
            window.open('https://wa.me/5531999999999?text=' + encodeURIComponent('Olá! Quero encomendar ' + '${pName}' + ' (Tamanho: ' + size + ') no valor de ${pPrice}. Meu nome é ' + user + '.'), '_blank');
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
            window.open('https://wa.me/5531999999999?text=' + encodeURIComponent('Olá! Quero me inscrever no treino de ${sportName}. Meu nome é ' + name + ' (' + pos + ').'), '_blank');
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
