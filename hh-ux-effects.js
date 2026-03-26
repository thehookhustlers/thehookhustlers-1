(function() {
    // Only run on mobile screens
    if (window.matchMedia('(max-width: 768px)').matches) {
        // Inject CSS for the simple ripple
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
                z-index: 99999;
                transform: translate(-50%, -50%) scale(0.5);
                opacity: 0;
                transition: transform 0.4s ease-out, opacity 0.4s ease-out;
            }
            .hh-touch-ripple.active {
                transform: translate(-50%, -50%) scale(1.5);
                opacity: 1;
            }
        `;
        document.head.appendChild(style);

        document.addEventListener('touchstart', (e) => {
            createRipple(e.touches[0].clientX, e.touches[0].clientY);
        }, {passive: true});

        function createRipple(x, y) {
            const ripple = document.createElement('div');
            ripple.className = 'hh-touch-ripple';
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            document.body.appendChild(ripple);

            // Trigger animation in next frame
            requestAnimationFrame(() => {
                ripple.classList.add('active');
            });

            // Cleanup
            setTimeout(() => {
                ripple.style.opacity = '0';
                setTimeout(() => ripple.remove(), 400);
            }, 100);
        }
    }
})();
