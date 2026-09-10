/**
 * ROMIC MEDIA MOBILE APP - CORE CONTROLLER
 * Features: Native HTML5 Video Playback, Viral Videos Hub, Full Services & Live Tracker
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Status Bar Live Clock
  const updateTime = () => {
    const timeEl = document.getElementById('live-time');
    if (!timeEl) return;
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    hours = hours % 12 || 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    timeEl.textContent = `${hours}:${minutes}`;
  };
  updateTime();
  setInterval(updateTime, 10000);

  // 2. Tab Navigation System
  const navTabs = document.querySelectorAll('.nav-tab');
  const screens = document.querySelectorAll('.app-screen');

  window.switchTab = (tabName) => {
    navTabs.forEach((tab) => {
      if (tab.getAttribute('data-tab') === tabName) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });

    screens.forEach((screen) => {
      if (screen.id === `screen-${tabName}`) {
        screen.classList.add('active');
        screen.scrollTop = 0;
      } else {
        screen.classList.remove('active');
      }
    });

    // Auto pause or play home video depending on tab
    const homeVideo = document.getElementById('home-featured-video');
    if (homeVideo) {
      if (tabName === 'home') {
        homeVideo.play().catch(() => {});
      } else {
        homeVideo.pause();
      }
    }
  };

  navTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-tab');
      switchTab(target);
    });
  });

  // 3. Desktop Presentation Mode Switcher
  const toggleFrameBtn = document.getElementById('toggle-frame-btn');
  if (toggleFrameBtn) {
    toggleFrameBtn.addEventListener('click', () => {
      document.body.classList.toggle('fullscreen-mode');
      const isFull = document.body.classList.contains('fullscreen-mode');
      toggleFrameBtn.innerHTML = isFull
        ? '<i class="fa-solid fa-mobile-screen"></i> Phone Frame Mode'
        : '<i class="fa-solid fa-expand"></i> Full Screen Mode';
      showToast(isFull ? 'Switched to Full Screen Mode' : 'Switched to Phone Frame Mode');
    });
  }

  // 4. Toast Notification
  const toastEl = document.getElementById('app-toast');
  const toastMsg = document.getElementById('toast-text');
  let toastTimeout;

  window.showToast = (message) => {
    if (!toastEl || !toastMsg) return;
    clearTimeout(toastTimeout);
    toastMsg.textContent = message;
    toastEl.classList.add('show');
    toastTimeout = setTimeout(() => {
      toastEl.classList.remove('show');
    }, 2400);
  };

  // 5. Notification Bell
  const notifBtn = document.getElementById('notif-btn');
  const notifTray = document.getElementById('notifications-tray');
  if (notifBtn && notifTray) {
    notifBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      notifTray.classList.toggle('open');
    });
    document.addEventListener('click', () => {
      notifTray.classList.remove('open');
    });
  }

  // ============================================================
  // 6. REAL HOME VIDEO CONTROLS & SCROLL-TRIGGERED PLAYBACK
  // ============================================================
  const homeVideo = document.getElementById('home-featured-video');
  const homeVideoContainer = document.getElementById('home-video-container');
  const homePlayBtn = document.getElementById('home-play-btn');
  const homeSoundBtn = document.getElementById('home-sound-btn');
  const homeScreen = document.getElementById('screen-home');
  let isVideoPlayPending = false;

  // Smooth scroll to video from top hero button
  window.scrollToHomeVideo = () => {
    if (homeScreen && homeVideoContainer) {
      const targetTop = homeVideoContainer.offsetTop - 15;
      homeScreen.scrollTo({ top: targetTop, behavior: 'smooth' });
    }
  };

  window.toggleHomeVideoPlay = (e) => {
    if (e) e.stopPropagation();
    if (!homeVideo || isVideoPlayPending) return;
    if (homeVideo.paused) {
      isVideoPlayPending = true;
      homeVideo.play().then(() => {
        isVideoPlayPending = false;
        if (homePlayBtn) homePlayBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
        showToast('▶️ Video Playing');
      }).catch(() => {
        isVideoPlayPending = false;
      });
    } else {
      homeVideo.pause();
      if (homePlayBtn) homePlayBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
      showToast('⏸️ Video Paused');
    }
  };

  window.toggleHomeVideoSound = (e) => {
    if (e) e.stopPropagation();
    if (!homeVideo) return;
    homeVideo.muted = !homeVideo.muted;
    if (homeSoundBtn) {
      homeSoundBtn.innerHTML = homeVideo.muted
        ? '<i class="fa-solid fa-volume-xmark"></i>'
        : '<i class="fa-solid fa-volume-high"></i>';
    }
    showToast(homeVideo.muted ? '🔇 Sound Muted' : '🔊 Sound Unmuted');
  };

  // Scroll Triggered Auto-Play (IntersectionObserver + Scroll Fallback)
  if (homeVideo && homeScreen) {
    let scrollTimeout;
    const handleVideoScrollPlay = () => {
      if (!homeScreen.classList.contains('active')) return;
      if (scrollTimeout) clearTimeout(scrollTimeout);

      scrollTimeout = setTimeout(() => {
        const rect = homeVideo.getBoundingClientRect();
        const screenHeight = window.innerHeight;

        // Video is visible if its middle is within screen viewport
        const isVisible = rect.top < screenHeight * 0.85 && rect.bottom > screenHeight * 0.2;

        if (isVisible) {
          if (homeVideo.paused && !isVideoPlayPending) {
            isVideoPlayPending = true;
            homeVideo.play().then(() => {
              isVideoPlayPending = false;
              if (homePlayBtn) homePlayBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
            }).catch(() => {
              isVideoPlayPending = false;
              homeVideo.muted = true;
              homeVideo.play().catch(() => {});
            });
          }
        } else {
          if (!homeVideo.paused && !isVideoPlayPending) {
            homeVideo.pause();
            if (homePlayBtn) homePlayBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
          }
        }
      }, 50);
    };

    homeScreen.addEventListener('scroll', handleVideoScrollPlay, { passive: true });
    window.addEventListener('scroll', handleVideoScrollPlay, { passive: true });
  }

  // ============================================================
  // REVIEWS SWIPING & HORIZONTAL DRAG CONTROLS
  // ============================================================
  window.scrollReviews = (direction) => {
    const scroller = document.querySelector('.app-reviews-scroller');
    if (!scroller) return;
    const cardStep = 294; // 280px width + 14px gap
    scroller.scrollBy({
      left: direction === 'left' ? -cardStep : cardStep,
      behavior: 'smooth'
    });
  };

  const enableDragToScroll = (el) => {
    if (!el) return;
    let isDown = false;
    let startX;
    let scrollLeft;

    el.addEventListener('mousedown', (e) => {
      isDown = true;
      el.classList.add('active-dragging');
      startX = e.pageX - el.offsetLeft;
      scrollLeft = el.scrollLeft;
    });

    const endDrag = () => {
      isDown = false;
      el.classList.remove('active-dragging');
    };

    el.addEventListener('mouseleave', endDrag);
    el.addEventListener('mouseup', endDrag);

    el.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - el.offsetLeft;
      const walk = (x - startX) * 1.5;
      el.scrollLeft = scrollLeft - walk;
    });
  };

  document.querySelectorAll('.app-reviews-scroller, .stats-scroller, .insta-filter-bar, .category-filter-bar').forEach(enableDragToScroll);

  // ============================================================
  // 7. VIRAL VIDEOS DATABASE & FULLSCREEN REEL PLAYER
  // ============================================================
  const userVideoPath = 'video/From university dropout to building a global content business and documenting every step of the .mp4';

  const viralVideos = {
    'dropout-to-agency': {
      title: 'From Dropout to Global Agency',
      client: 'Romic Media Story',
      handle: '@romicmedia',
      avatar: 'Romic_Media_Logo.png',
      caption: 'From university dropout to building a global content business and documenting every single step. Built with hook retention & storytelling. 🔥🎬',
      views: '2.4M Views',
      likes: '84.5K',
      comments: '2,490',
      audio: 'Original Audio - Romic Media Official',
      mediaType: 'video',
      mediaSrc: userVideoPath
    },
    'london-motorsports': {
      title: 'Supercar Track Day Run',
      client: 'London Motor Sports',
      handle: '@londonmotorsports',
      avatar: 'images/02dg.png',
      caption: 'Raw V10 Lamborghini soundtrack meets FPV drone tracking. Color-graded with high-contrast cinematic pop. 🏎️💨 #Supercars',
      views: '3.1M Views',
      likes: '115K',
      comments: '3,890',
      audio: 'Lamborghini V10 Rev Sound FX - Romic Production',
      mediaType: 'video',
      mediaSrc: userVideoPath
    },
    'shapiro-penthouse': {
      title: '£4.2M Penthouse Luxury Tour',
      client: 'M. Shapiro Real Estate',
      handle: '@m.shapiro.realestate',
      avatar: 'images/01VC.png',
      caption: 'Exclusive £4.2M London Penthouse tour. Engineered with our 3-second hook retention framework. Over 1.8M organic views! 🏢🔥',
      views: '1.8M Views',
      likes: '48.2K',
      comments: '1,240',
      audio: 'Original Audio - Romic Media Edits',
      mediaType: 'video',
      mediaSrc: userVideoPath
    },
    'gongcha-autumn': {
      title: 'Brown Sugar Milk Tea ASMR',
      client: 'Gongcha UK',
      handle: '@gongcha_uk',
      avatar: 'images/03SM.png',
      caption: 'The crispiest ASMR Brown Sugar Bubble Tea pour in London. High-retention food styling and macro lighting. 🧋✨',
      views: '940K Views',
      likes: '32.5K',
      comments: '820',
      audio: 'Crispy Ice & Tea Pour ASMR - Romic Sound Lab',
      mediaType: 'video',
      mediaSrc: userVideoPath
    },
    'chai-khass-karak': {
      title: 'Clay Pot Karak Chai',
      client: 'Chai Khass',
      handle: '@chaikhassofficial',
      avatar: 'images/04IM.png',
      caption: 'Traditional clay pot Karak Chai simmering under slow-motion capture. Steaming hot engagement across the UK & GCC. ☕🔥',
      views: '720K Views',
      likes: '24.1K',
      comments: '610',
      audio: 'Original Chai Vibes - Romic Media',
      mediaType: 'video',
      mediaSrc: userVideoPath
    },
    'sultan-grill': {
      title: 'Turkish Charcoal Mixed Grill',
      client: 'Sultan Restaurant',
      handle: '@sultanrestaurant',
      avatar: 'images/07pv.png',
      caption: 'Sizzling Turkish mix grill platter right off the charcoal embers. Macro food videography that makes viewers crave. 🥩🍗',
      views: '540K Views',
      likes: '18.9K',
      comments: '430',
      audio: 'Sizzling Grill Beats - Romic Audio',
      mediaType: 'video',
      mediaSrc: userVideoPath
    }
  };

  const reelModal = document.getElementById('reel-modal-backdrop');
  const reelModalVideo = document.getElementById('reel-modal-video');
  const reelProgressFill = document.getElementById('reel-progress-fill');
  const reelFooterAvatar = document.getElementById('reel-footer-avatar');
  const reelFooterClient = document.getElementById('reel-footer-client');
  const reelFooterCaption = document.getElementById('reel-footer-caption');
  const reelAudioTitle = document.getElementById('reel-audio-title');
  const reelLikesText = document.getElementById('reel-modal-likes');
  const reelCommentsText = document.getElementById('reel-modal-comments');
  const reelLikeBtn = document.getElementById('reel-like-action-btn');

  window.openReelModal = (key) => {
    const item = viralVideos[key] || viralVideos['dropout-to-agency'];
    if (!reelModal) return;

    if (reelModalVideo) {
      reelModalVideo.src = item.mediaSrc;
      reelModalVideo.muted = false;
      reelModalVideo.currentTime = 0;
      reelModalVideo.play().catch(() => {
        reelModalVideo.muted = true;
        reelModalVideo.play().catch(() => {});
      });

      reelModalVideo.ontimeupdate = () => {
        if (reelModalVideo.duration && reelProgressFill) {
          const pct = (reelModalVideo.currentTime / reelModalVideo.duration) * 100;
          reelProgressFill.style.width = `${pct}%`;
        }
      };
    }

    if (reelFooterAvatar) reelFooterAvatar.src = item.avatar;
    if (reelFooterClient) reelFooterClient.textContent = item.handle;
    if (reelFooterCaption) reelFooterCaption.textContent = item.caption;
    if (reelAudioTitle) reelAudioTitle.textContent = item.audio;
    if (reelLikesText) reelLikesText.textContent = item.likes;
    if (reelCommentsText) reelCommentsText.textContent = item.comments;

    if (reelLikeBtn) reelLikeBtn.classList.remove('liked');
    reelModal.classList.add('open');

    // Pause home video
    if (homeVideo && !homeVideo.paused) homeVideo.pause();
  };

  window.closeReelModal = () => {
    if (reelModal) reelModal.classList.remove('open');
    if (reelModalVideo) {
      reelModalVideo.pause();
    }
    // Resume home video if active tab is home
    const homeScreen = document.getElementById('screen-home');
    if (homeScreen && homeScreen.classList.contains('active') && homeVideo) {
      homeVideo.play().catch(() => {});
    }
  };

  window.toggleReelSound = () => {
    if (!reelModalVideo) return;
    reelModalVideo.muted = !reelModalVideo.muted;
    showToast(reelModalVideo.muted ? '🔇 Video Muted' : '🔊 Sound Unmuted');
  };

  window.toggleReelLike = () => {
    if (!reelLikeBtn) return;
    reelLikeBtn.classList.toggle('liked');
    const isLiked = reelLikeBtn.classList.contains('liked');
    showToast(isLiked ? '❤️ Liked this viral reel!' : 'Unliked');
  };

  // ============================================================
  // 8. AI VIRAL HOOK GENERATOR
  // ============================================================
  const hookResultsContainer = document.getElementById('hook-results');
  let selectedNiche = 'Real Estate';

  const nicheChips = document.querySelectorAll('#niche-chips .choice-chip');
  nicheChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      nicheChips.forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');
      selectedNiche = chip.getAttribute('data-value');
    });
  });

  const toneChips = document.querySelectorAll('#tone-chips .choice-chip');
  toneChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      toneChips.forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');
    });
  });

  const hookTemplates = {
    'Real Estate': [
      {
        badge: 'High Viral Potential',
        hook: 'Never buy a property in 2026 until you check this 1 hidden clause...',
        script: 'Show luxury exterior -> Quick zoom into contract -> Reveal the £20,000 saving.'
      },
      {
        badge: 'Curiosity Loop',
        hook: 'This penthouse costs less than a 2-bed apartment, and here is why.',
        script: 'Fast pan around balcony view -> Highlight early-bird developer rate -> CTA in bio.'
      }
    ],
    'Gym & Fitness': [
      {
        badge: 'Myth Buster',
        hook: 'If you are still drinking protein shakes right after your workout, stop.',
        script: 'Trainer points at camera -> Text overlay debunking the anabolic window -> Optimal timing formula.'
      }
    ],
    'E-commerce': [
      {
        badge: 'TikTok Trend',
        hook: 'TikTok made me buy this, but nobody warned me about this 1 problem...',
        script: 'Unboxing aesthetic -> Zoom in on product feature -> Twist: "I cannot stop using it!"'
      }
    ],
    'Hospitality': [
      {
        badge: 'Secret Spot',
        hook: 'The secret underground cafe in London that locals begged us not to film.',
        script: 'Doorway reveal -> Coffee slow-mo pour -> Sizzling breakfast platter audio.'
      }
    ],
    'Tech / SaaS': [
      {
        badge: 'Productivity Hack',
        hook: 'This AI automation tool saved my team 18 hours this Monday alone.',
        script: 'Screen recording of tedious manual task -> 1 click run -> Link in bio for free trial.'
      }
    ]
  };

  window.generateHooks = () => {
    const list = hookTemplates[selectedNiche] || hookTemplates['Real Estate'];
    showToast('✨ AI generated viral hooks for ' + selectedNiche + '!');

    if (hookResultsContainer) {
      hookResultsContainer.innerHTML = list
        .map(
          (item) => `
        <div class="hook-result-card">
          <div class="hook-card-header">
            <span class="hook-badge">${item.badge}</span>
            <button class="copy-hook-btn" onclick="copyHookText('${item.hook.replace(/'/g, "\\'")}')" title="Copy">
              <i class="fa-regular fa-copy"></i> Copy
            </button>
          </div>
          <div class="hook-text">"${item.hook}"</div>
          <div class="script-desc"><strong>Visual Direction:</strong> ${item.script}</div>
        </div>
      `
        )
        .join('');
    }
  };

  window.copyHookText = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      showToast('📋 Hook copied to clipboard!');
    });
  };

  // Tool Tabs
  const toolTabBtns = document.querySelectorAll('.tool-tab-btn');
  const toolPanes = document.querySelectorAll('.tool-pane');
  toolTabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      toolTabBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const targetPane = btn.getAttribute('data-pane');
      toolPanes.forEach((p) => {
        if (p.id === targetPane) p.classList.add('active');
        else p.classList.remove('active');
      });
    });
  });

  // ============================================================
  // 9. SCOPE & COST ESTIMATOR
  // ============================================================
  const videoCountSlider = document.getElementById('video-count-slider');
  const videoCountDisplay = document.getElementById('video-count-display');
  const addonShoot = document.getElementById('addon-shoot');
  const addonVfx = document.getElementById('addon-vfx');
  const addonExpress = document.getElementById('addon-express');
  const quotePriceDisplay = document.getElementById('quote-price-display');
  const quoteSummaryDetails = document.getElementById('quote-summary-details');
  const quoteWhatsAppBtn = document.getElementById('quote-whatsapp-btn');

  const recalculateQuote = () => {
    if (!videoCountSlider) return;
    const count = parseInt(videoCountSlider.value, 10);
    videoCountDisplay.textContent = `${count} Videos / Month`;

    let basePrice = count * 65;
    let shootAddon = addonShoot && addonShoot.checked ? 300 : 0;
    let vfxAddon = addonVfx && addonVfx.checked ? 200 : 0;
    let expressAddon = addonExpress && addonExpress.checked ? 150 : 0;
    const total = basePrice + shootAddon + vfxAddon + expressAddon;

    quotePriceDisplay.textContent = `£${total.toLocaleString()} / mo`;
    const addonsList = [
      addonShoot && addonShoot.checked ? '4K On-Location Shoot' : null,
      addonVfx && addonVfx.checked ? '3D/VFX Animation' : null,
      addonExpress && addonExpress.checked ? '48h Express' : null
    ]
      .filter(Boolean)
      .join(', ');

    quoteSummaryDetails.textContent = `${count} Short-form Videos + ${addonsList || 'Standard Turnaround'}`;

    const waText = encodeURIComponent(
      `Hello Romic Media, I created an estimate on RomicApp:\n- Package: ${count} Short-form Videos / month\n- Addons: ${
        addonsList || 'None'
      }\n- Estimated Budget: £${total}/mo\n\nLet's discuss my brand campaign!`
    );
    if (quoteWhatsAppBtn) {
      quoteWhatsAppBtn.href = `https://wa.me/923209670625?text=${waText}`;
    }
  };

  if (videoCountSlider) {
    videoCountSlider.addEventListener('input', recalculateQuote);
    if (addonShoot) addonShoot.addEventListener('change', recalculateQuote);
    if (addonVfx) addonVfx.addEventListener('change', recalculateQuote);
    if (addonExpress) addonExpress.addEventListener('change', recalculateQuote);
    recalculateQuote();
  }

  // ============================================================
  // 10. CLIENT LIVE PROJECT TRACKER
  // ============================================================
  const trackerProjects = {
    'ROMIC-2026': {
      client: 'M. Shapiro Real Estate',
      project: 'Dubai Luxury Villa Viral Launch',
      progress: 75,
      status: 'First Cut Ready',
      timeline: [
        { title: 'Briefing & Storyboard Approved', date: 'Aug 28, 2026', done: true },
        { title: '4K Drone & Interior Footage Shot', date: 'Sept 02, 2026', done: true },
        { title: 'Viral Hook Editing & Sound Mix', date: 'Sept 06, 2026', done: true, active: true },
        { title: 'Client Review & Feedback', date: 'In Progress (Cut #1)', done: false },
        { title: 'Final 4K Master Export & Distribution', date: 'Estimated Sept 12', done: false }
      ],
      draftFile: 'VILLA_CUT_01_DRAFT_PREVIEW.mp4',
      draftSize: '48.2 MB'
    },
    'UK-GONGCHA': {
      client: 'Gongcha UK',
      project: 'Autumn Bubble Tea TikTok Campaign',
      progress: 90,
      status: 'Final Polish',
      timeline: [
        { title: 'Recipe Hook Concepts Locked', date: 'Aug 20, 2026', done: true },
        { title: 'Studio Production & Macro B-Roll', date: 'Aug 25, 2026', done: true },
        { title: 'Color Grading & Dynamic Subtitles', date: 'Aug 30, 2026', done: true },
        { title: 'Client Feedback Incorporated', date: 'Sept 04, 2026', done: true },
        { title: 'Final Delivery & TikTok Posting', date: 'Scheduled Tomorrow', done: false, active: true }
      ],
      draftFile: 'GONGCHA_AUTUMN_FINAL_BATCH.zip',
      draftSize: '142 MB'
    },
    'LONDON-MOTORS': {
      client: 'London Motor Sports',
      project: 'Supercar Showcase Series',
      progress: 40,
      status: 'In Production',
      timeline: [
        { title: 'Vehicle Roster & Location Scouted', date: 'Sept 01, 2026', done: true },
        { title: 'Track Day Filming (Gimbal + FPV Drone)', date: 'Sept 05, 2026', done: true, active: true },
        { title: 'Sound Design & Engine Rev VFX', date: 'Scheduled Sept 10', done: false },
        { title: 'Draft Video Review', date: 'Pending', done: false },
        { title: 'YouTube Shorts & Reels Delivery', date: 'Pending', done: false }
      ],
      draftFile: 'TRACK_DAY_RAW_SELECTS.mov',
      draftSize: '2.1 GB'
    }
  };

  window.lookupProject = (code) => {
    const input = document.getElementById('tracker-code-input');
    const searchCode = (code || (input ? input.value : '')).trim().toUpperCase();
    if (!searchCode) {
      showToast('⚠️ Please enter a project code');
      return;
    }

    const data = trackerProjects[searchCode];
    if (!data) {
      showToast('❌ Project not found. Try: ROMIC-2026');
      return;
    }

    if (input) input.value = searchCode;

    document.getElementById('tracker-client').textContent = data.client;
    document.getElementById('tracker-title').textContent = data.project;
    document.getElementById('tracker-status').textContent = data.status;
    document.getElementById('tracker-percent').textContent = `${data.progress}% Completed`;
    document.getElementById('tracker-bar').style.width = `${data.progress}%`;
    document.getElementById('tracker-file-name').textContent = data.draftFile;
    document.getElementById('tracker-file-size').textContent = data.draftSize;

    const timelineList = document.getElementById('tracker-timeline');
    timelineList.innerHTML = data.timeline
      .map(
        (t) => `
      <div class="timeline-item ${t.done ? 'done' : ''} ${t.active ? 'active' : ''}">
        <div class="timeline-node"><i class="fa-solid fa-check"></i></div>
        <div class="timeline-title">${t.title}</div>
        <div class="timeline-date">${t.date}</div>
      </div>
    `
      )
      .join('');

    showToast(`Loaded ${data.client} status!`);
  };

  window.playDraftVideo = () => {
    openReelModal('dropout-to-agency');
  };

  window.requestRevision = () => {
    const wa = encodeURIComponent(
      'Hi Romic Media, I am reviewing my campaign draft and would like to request an edit revision.'
    );
    window.open(`https://wa.me/923209670625?text=${wa}`, '_blank');
  };

  // 11. Direct Service WhatsApp Inquiry
  window.inquireServiceWhatsApp = (serviceName) => {
    const text = encodeURIComponent(`Hi Romic Media, I want to book or discuss your service: ${serviceName}. Please share details!`);
    window.open(`https://wa.me/923209670625?text=${text}`, '_blank');
  };

  // 12. Service Worker for PWA
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('./sw.js')
      .then(() => console.log('RomicApp SW Registered'))
      .catch((err) => console.log('SW registration error', err));
  }
});
