(function() {
    // Only run on mobile screens
    if (window.matchMedia('(max-width: 768px)').matches) {
        
        // 1. AGGRESSIVE CLEANUP: Remove legacy bubbles/particles/trails
        function cleanupLegacy() {
            // Remove particle canvas
            const legacyCanvas = document.getElementById('particles') || document.getElementById('particleCanvas');
            if (legacyCanvas) legacyCanvas.remove();

            // Remove cursor trails and orbs
            document.querySelectorAll('.hh-trail, .orb, #hh-cursor, #hh-ring, #cursor, #cursorRing').forEach(el => el.remove());

            // Disable background glow if it sticks
            const bgGlow = document.getElementById('hh-bg-glow');
            if (bgGlow) bgGlow.style.display = 'none';
        }

        // Run immediately and also on DOMContentLoaded
        cleanupLegacy();
        document.addEventListener('DOMContentLoaded', cleanupLegacy);
        // Also run periodic cleanup to catch late-injected elements
        const cleanupInterval = setInterval(cleanupLegacy, 500);
        setTimeout(() => clearInterval(cleanupInterval), 3000);

        // 2. INJECT SUBTLE RIPPLE & LAYOUT CSS
        const style = document.createElement('style');
        style.textContent = `
            /* Fix excessive padding and blank spaces on mobile */
            section, .page-hero, .cta-section, .how, .stats, .tier-section, .features-section, .founder-section, .reviews-section {
                min-height: 0 !important;
                height: auto !important;
                padding: 40px 16px !important;
            }
            .sec-inner, .stats-inner {
                padding: 0 !important;
                margin: 0 !important;
            }
            .hero { 
                padding: 90px 16px 40px !important; 
                min-height: 0 !important;
            }
            /* Eliminate massive gaps between text elements */
            h1, h2, h3, h4, p, .sec-title, .sec-sub, .sec-label, .journey-header, .how-head, .hero-sub, .hero-actions, .hero-trust {
                margin-bottom: 16px !important;
                margin-top: 0 !important;
            }
            /* Tighten grids and cards */
            .steps, .feat-grid, .vc-grid, .tier-grid, .sectors-grid, .how-grid {
                gap: 16px !important;
                margin-bottom: 24px !important;
            }
            .stat-box, .step, .feat, .price-card, .vc-card, .tier-card, .sector-card, .journey-col {
                padding: 24px 16px !important;
                margin-bottom: 12px !important;
            }
            .footer-inner {
                gap: 24px !important;
            }
            footer {
                padding: 40px 16px 20px !important;
            }

            /* Subtle Touch Ripple */
            .hh-touch-ripple {
                position: fixed;
                width: 16px;
                height: 16px;
                background: rgba(124, 58, 237, 0.6);
                border-radius: 50%;
                pointer-events: none;
                z-index: 999999;
                transform: translate(-50%, -50%) scale(0.5);
                opacity: 0;
                transition: transform 0.3s ease-out, opacity 0.3s ease-out;
            }
            .hh-touch-ripple.active {
                transform: translate(-50%, -50%) scale(1.2);
                opacity: 1;
            }
            /* Force hide legacy elements via CSS as well */
            #particles, .hh-trail, .orb, #hh-cursor, #hh-ring, #cursor, #cursorRing, #hh-bg-glow {
                display: none !important;
                opacity: 0 !important;
                visibility: hidden !important;
            }
        `;
        document.head.appendChild(style);

        // 3. IMPLEMENT SIMPLE RIPPLE
        document.addEventListener('touchstart', (e) => {
            createRipple(e.touches[0].clientX, e.touches[0].clientY);
        }, {passive: true});

        function createRipple(x, y) {
            const ripple = document.createElement('div');
            ripple.className = 'hh-touch-ripple';
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            document.body.appendChild(ripple);

            requestAnimationFrame(() => {
                ripple.classList.add('active');
            });

            setTimeout(() => {
                ripple.style.opacity = '0';
                setTimeout(() => ripple.remove(), 400);
            }, 100);
        }
    }
})();
