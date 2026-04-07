(function() {
    // 1. ROBUST TOUCH DETECTION
    const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0) || (window.matchMedia('(pointer: coarse)').matches);
    const isMobileWidth = window.matchMedia('(max-width: 1024px)').matches;

    if (isTouch || isMobileWidth) {
        
        // 2. AGGRESSIVE CLEANUP: Remove legacy bubbles/particles/trails
        function cleanupLegacy() {
            try {
                // Remove particle canvases
                const legacyCanvas = document.querySelectorAll('#particles, #particleCanvas, .particles-container');
                legacyCanvas.forEach(c => c.remove());

                // Remove all custom cursor elements (dot, ring, trail, orbs)
                const cursorElements = document.querySelectorAll('.hh-trail, .orb, #hh-cursor, #hh-ring, #cursor, #cursorRing, .cursor, .cursor-ring, #hh-bg-glow');
                cursorElements.forEach(el => el.remove());

                // Force individual element cursor reset
                document.querySelectorAll('*').forEach(el => {
                    if (window.getComputedStyle(el).cursor === 'none') {
                        el.style.setProperty('cursor', 'auto', 'important');
                    }
                });
            } catch (e) {
                console.warn('HHEffects: Cleanup encountered minor issue:', e);
            }
        }

        // Run immediately
        cleanupLegacy();
        
        // Force body cursor auto
        document.documentElement.style.setProperty('cursor', 'auto', 'important');
        document.body.style.setProperty('cursor', 'auto', 'important');

        document.addEventListener('DOMContentLoaded', () => {
            cleanupLegacy();
            document.documentElement.style.setProperty('cursor', 'auto', 'important');
            document.body.style.setProperty('cursor', 'auto', 'important');
        });

        // Periodic cleanup for late-injected elements (like from 3D libraries or other scripts)
        const cleanupInterval = setInterval(cleanupLegacy, 1000);
        setTimeout(() => clearInterval(cleanupInterval), 5000);

        // 3. INJECT MOBILE-ONLY STYLES (Performance & Touch Fixes)
        const style = document.createElement('style');
        style.id = 'hh-mobile-performance-fix';
        style.textContent = `
            /* FORCE AUTO CURSOR ON TOUCH DEVICES - CRITICAL FIX */
            html, body, *, button, a, [role="button"] {
                cursor: auto !important;
            }

            /* Fix excessive padding and blank spaces on mobile */
            section, .page-hero, .cta-section, .how, .stats, .tier-section, .features-section, .founder-section, .reviews-section {
                min-height: 0 !important;
                height: auto !important;
                padding: 45px 20px !important;
            }
            .sec-inner, .stats-inner {
                padding: 0 !important;
                margin: 0 !important;
            }
            .hero, .page-hero { 
                padding: 100px 20px 45px !important; 
                min-height: 0 !important;
            }
            /* Eliminate massive gaps between text elements */
            h1, h2, h3, h4, p, .sec-title, .sec-sub, .sec-label, .journey-header, .how-head, .hero-sub, .hero-actions, .hero-trust {
                margin-bottom: 18px !important;
                margin-top: 0 !important;
            }
            /* Tighten grids and cards */
            .steps, .feat-grid, .vc-grid, .tier-grid, .sectors-grid, .how-grid {
                gap: 16px !important;
                margin-bottom: 24px !important;
            }
            .stat-box, .step, .feat, .price-card, .vc-card, .tier-card, .sector-card, .journey-col {
                padding: 24px 18px !important;
                margin-bottom: 12px !important;
            }
            .footer-inner {
                gap: 24px !important;
            }
            footer {
                padding: 40px 20px 20px !important;
            }

            /* Premium Touch Ripple Effect Styling */
            .hh-touch-ripple {
                position: fixed;
                width: 24px;
                height: 24px;
                background: radial-gradient(circle, rgba(124, 58, 237, 0.5) 0%, transparent 70%);
                border: 1px solid rgba(6, 182, 212, 0.4);
                border-radius: 50%;
                pointer-events: none;
                z-index: 999999;
                transform: translate(-50%, -50%) scale(0.2);
                opacity: 0;
                transition: transform 0.4s cubic-bezier(0.1, 0.7, 0.1, 1), opacity 0.4s ease-out;
            }
            .hh-touch-ripple.active {
                transform: translate(-50%, -50%) scale(1.8);
                opacity: 1;
            }

            /* Ensure No Legacy Canvas Backgrounds are sticking around */
            #particles, .hh-trail, .orb, #hh-cursor, #hh-ring, #cursor, #cursorRing, #hh-bg-glow {
                display: none !important;
                opacity: 0 !important;
                visibility: hidden !important;
                pointer-events: none !important;
            }
        `;
        document.head.appendChild(style);

        // 4. PREMIUM TOUCH RIPPLE IMPLEMENTATION
        document.addEventListener('touchstart', (e) => {
            if (e.touches && e.touches[0]) {
                createRipple(e.touches[0].clientX, e.touches[0].clientY);
            }
        }, {passive: true});

        function createRipple(x, y) {
            const ripple = document.createElement('div');
            ripple.className = 'hh-touch-ripple';
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            document.body.appendChild(ripple);

            // Reflow to trigger transition
            void ripple.offsetWidth;

            requestAnimationFrame(() => {
                ripple.classList.add('active');
            });

            setTimeout(() => {
                ripple.classList.remove('active');
                ripple.style.opacity = '0';
                setTimeout(() => ripple.remove(), 400);
            }, 100);
        }
    }
})();
