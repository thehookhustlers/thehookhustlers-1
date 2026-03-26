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

        // 2. INJECT SIMPLE RIPPLE CSS
        const style = document.createElement('style');
        style.textContent = `
            .hh-touch-ripple {
                position: fixed;
                width: 40px;
                height: 40px;
                background: radial-gradient(circle, rgba(124, 58, 237, 0.4) 0%, transparent 70%);
                border: 1.5px solid rgba(6, 182, 212, 0.5);
                border-radius: 50%;
                pointer-events: none;
                z-index: 999999;
                transform: translate(-50%, -50%) scale(0.5);
                opacity: 0;
                transition: transform 0.4s ease-out, opacity 0.4s ease-out;
            }
            .hh-touch-ripple.active {
                transform: translate(-50%, -50%) scale(1.5);
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
