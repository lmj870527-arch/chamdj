document.addEventListener('DOMContentLoaded', () => {
  const scrollProgressBar = document.getElementById('scrollProgressBar');
  const siteHeader = document.getElementById('siteHeader');
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  const navTabs = document.querySelectorAll('.nav-tab');
  const sections = document.querySelectorAll('.leaflet-section');
  const revealElements = document.querySelectorAll('.reveal');

  const leafletModal = document.getElementById('leafletModal');
  const openLeafletBtn = document.getElementById('openLeafletBtn');
  const openLeafletBtnBottom = document.getElementById('openLeafletBtnBottom');
  const closeLeafletBtn = document.getElementById('closeLeafletBtn');
  const shareBtn = document.getElementById('shareBtn');
  const toastMsg = document.getElementById('toastMsg');

  // 1. Scroll Reveal Animation Observer
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -30px 0px' }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  // 2. Scroll Progress, Header Shadow, Active Tab & Scroll-to-Top Button
  const updateOnScroll = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0;

    if (scrollProgressBar) {
      scrollProgressBar.style.width = `${progress}%`;
    }

    if (siteHeader) {
      siteHeader.classList.toggle('scrolled', scrollTop > 16);
    }

    if (scrollTopBtn) {
      scrollTopBtn.classList.toggle('visible', scrollTop > 420);
    }

    // Determine active section
    let currentSectionId = 'sec-01';
    const triggerOffset = window.innerHeight * 0.32;

    sections.forEach((sec) => {
      const rect = sec.getBoundingClientRect();
      if (rect.top <= triggerOffset) {
        currentSectionId = sec.id;
      }
    });

    navTabs.forEach((tab) => {
      tab.classList.toggle('active', tab.dataset.target === currentSectionId);
    });
  };

  window.addEventListener('scroll', updateOnScroll, { passive: true });
  updateOnScroll();

  // 3. Scroll-to-Top Button
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 4. Original Leaflet Modal Controls
  const openModal = () => {
    if (!leafletModal) return;
    leafletModal.classList.add('open');
    leafletModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    if (!leafletModal) return;
    leafletModal.classList.remove('open');
    leafletModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  if (openLeafletBtn) openLeafletBtn.addEventListener('click', openModal);
  if (openLeafletBtnBottom) openLeafletBtnBottom.addEventListener('click', openModal);
  if (closeLeafletBtn) closeLeafletBtn.addEventListener('click', closeModal);

  if (leafletModal) {
    leafletModal.addEventListener('click', (e) => {
      if (e.target === leafletModal) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && leafletModal?.classList.contains('open')) {
      closeModal();
    }
  });

  // 5. Share / Copy Link Button
  let toastTimer = null;
  const showToast = (msg) => {
    if (!toastMsg) return;
    toastMsg.textContent = msg;
    toastMsg.classList.add('show');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastMsg.classList.remove('show');
    }, 2400);
  };

  if (shareBtn) {
    shareBtn.addEventListener('click', async () => {
      const shareData = {
        title: '전교조 대전지부 지부장·사무처장 선거 | 강정숙·이호숙 후보',
        text: '압도하는 실력, 돌파하는 대전지부! 교섭은 당당하게, 조직은 단단하게! 지부장 후보 강정숙 · 사무처장 후보 이호숙 웹 공보물',
        url: window.location.href,
      };

      if (navigator.share && window.location.protocol.startsWith('http')) {
        try {
          await navigator.share(shareData);
          return;
        } catch (err) {
          if (err.name === 'AbortError') return;
        }
      }

      try {
        await navigator.clipboard.writeText(window.location.href);
        showToast('공보물 주소가 복사되었습니다!');
      } catch {
        showToast('주소창의 링크를 복사해 공유해 주세요.');
      }
    });
  }
});
