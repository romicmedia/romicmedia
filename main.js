// Force page to always start at the very top (0, 0) on load/reload
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

window.addEventListener('load', () => {
    window.scrollTo(0, 0);
    setTimeout(() => {
        window.scrollTo(0, 0);
        document.documentElement.classList.add('smooth-scroll');
    }, 150);
});

document.addEventListener('DOMContentLoaded', () => {
    window.scrollTo(0, 0);

    // 1. Page Fade In
    document.body.classList.add('page-fade-in');
    setTimeout(() => {
        document.body.classList.add('animation-done');
    }, 700);

    // 3. Hero Video Showcase & Sound Controller
    const heroVideo = document.getElementById('heroVideo');
    const soundToggle = document.getElementById('soundToggle');
    const soundIcon = document.getElementById('soundIcon');

    if (heroVideo && soundToggle) {
        soundToggle.addEventListener('click', () => {
            if (heroVideo.muted) {
                heroVideo.muted = false;
                if (soundIcon) {
                    soundIcon.classList.remove('fa-volume-xmark');
                    soundIcon.classList.add('fa-volume-high');
                    soundIcon.style.color = 'var(--accent-green)';
                }
                soundToggle.style.borderColor = 'var(--accent-green)';
            } else {
                heroVideo.muted = true;
                if (soundIcon) {
                    soundIcon.classList.remove('fa-volume-high');
                    soundIcon.classList.add('fa-volume-xmark');
                    soundIcon.style.color = '';
                }
                soundToggle.style.borderColor = 'rgba(255, 255, 255, 0.12)';
            }
        });

        // Ensure video autoplays smoothly
        heroVideo.play().catch(() => {
            heroVideo.muted = true;
            heroVideo.play().catch(() => {});
        });
    }

    // 4. Header Scroll Frosted Glass Effect
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 5. Mobile Hamburger Drawer Menu
    const hamburger = document.getElementById('hamburger-menu');
    const navMenu = document.getElementById('nav-menu');
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('mobile-open');
        });
        
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('mobile-open');
            });
        });
    }

    // 6. Scroll Trigger Reveal Animations
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // 7. Stat Counters Animation
    const stats = document.querySelectorAll('.counter-number');
    const animateCounters = () => {
        stats.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const duration = 2000;
            const step = (target / duration) * 10;
            let current = 0;
            
            const updateCount = () => {
                current += step;
                if (current < target) {
                    counter.innerText = Math.ceil(current);
                    setTimeout(updateCount, 10);
                } else {
                    counter.innerText = target;
                }
            };
            updateCount();
        });
    };

    const statsSection = document.querySelector('.stats-bar-section');
    if (statsSection && stats.length > 0) {
        const statsObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.6 });
        statsObserver.observe(statsSection);
    }

    // 8. Client Logos Infinite Marquee Loop
    const marqueeTrack = document.getElementById('marquee-track');
    if (marqueeTrack) {
        const innerHTML = marqueeTrack.innerHTML;
        marqueeTrack.innerHTML = innerHTML + innerHTML;
    }

    // 9. Client Reviews Auto-Playing & Draggable Carousel
    const reviewsCarousel = document.getElementById('reviews-carousel');
    if (reviewsCarousel) {
        let isDown = false;
        let startX;
        let scrollLeft;
        let autoplayInterval;

        const startAutoplay = () => {
            autoplayInterval = setInterval(() => {
                const cardWidth = 424;
                const currentScroll = reviewsCarousel.scrollLeft;
                const maxScroll = reviewsCarousel.scrollWidth - reviewsCarousel.clientWidth;
                
                if (currentScroll >= maxScroll - 10) {
                    reviewsCarousel.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    reviewsCarousel.scrollBy({ left: cardWidth, behavior: 'smooth' });
                }
            }, 4000);
        };

        const stopAutoplay = () => {
            clearInterval(autoplayInterval);
        };

        startAutoplay();
        
        reviewsCarousel.addEventListener('mouseenter', stopAutoplay);
        reviewsCarousel.addEventListener('mouseleave', startAutoplay);

        reviewsCarousel.addEventListener('mousedown', (e) => {
            isDown = true;
            reviewsCarousel.style.cursor = 'grabbing';
            startX = e.pageX - reviewsCarousel.offsetLeft;
            scrollLeft = reviewsCarousel.scrollLeft;
        });

        reviewsCarousel.addEventListener('mouseleave', () => {
            isDown = false;
            reviewsCarousel.style.cursor = 'grab';
        });

        reviewsCarousel.addEventListener('mouseup', () => {
            isDown = false;
            reviewsCarousel.style.cursor = 'grab';
        });

        reviewsCarousel.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - reviewsCarousel.offsetLeft;
            const walk = (x - startX) * 1.5;
            reviewsCarousel.scrollLeft = scrollLeft - walk;
        });
    }

    // 10. Portfolio Filtering Logic (work.html)
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioCards = document.querySelectorAll('.portfolio-card');
    
    if (filterButtons.length > 0 && portfolioCards.length > 0) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const filter = btn.getAttribute('data-filter');
                
                portfolioCards.forEach(card => {
                    const category = card.getAttribute('data-category');
                    if (filter === 'all' || category === filter) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'scale(0.8)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }

    // 11. FAQ Accordion Logic (faq.html)
    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length > 0) {
        faqItems.forEach(item => {
            const headerBtn = item.querySelector('.faq-header');
            const content = item.querySelector('.faq-content');
            
            headerBtn.addEventListener('click', () => {
                const isOpen = item.classList.contains('active');
                
                faqItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.faq-content').style.maxHeight = null;
                });
                
                if (!isOpen) {
                    item.classList.add('active');
                    content.style.maxHeight = content.scrollHeight + 'px';
                }
            });
        });
    }

    // 12. Contact Form — EmailJS Integration
    const contactForm = document.getElementById('contact-form');
    const successMsg = document.getElementById('success-message');

    if (contactForm && successMsg) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('.form-btn');
            const originalText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin"></i>';

            const templateParams = {
                name:    document.getElementById('name').value,
                email:   document.getElementById('email').value,
                phone:   document.getElementById('phone').value || 'Not provided',
                brand:   document.getElementById('brand').value || 'Not provided',
                project: document.getElementById('project').value,
                message: document.getElementById('message').value
            };

            emailjs.send('service_s4sr6kk', 'template_h4v3ma8', templateParams)
                .then(function () {
                    contactForm.reset();
                    contactForm.style.display = 'none';
                    successMsg.style.display = 'block';
                    successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
                })
                .catch(function (error) {
                    console.error('EmailJS error:', error);
                    submitBtn.innerHTML = 'Failed. Try Again <i class="fas fa-exclamation-circle"></i>';
                    submitBtn.disabled = false;
                });
        });
    }
});
