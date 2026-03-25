(function() {
    // Only run on mobile machines/screens
    if (window.matchMedia('(max-width: 768px)').matches) {
        // Inject CSS dynamically so we don't have to touch every <style> block
        const style = document.createElement('style');
        style.textContent = `
            .touch-glow {
                position: fixed;
                width: 80px;
                height: 80px;
                background: radial-gradient(circle, rgba(124, 58, 237, 0.4) 0%, rgba(6, 182, 212, 0.2) 40%, transparent 70%);
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                opacity: 0;
                transition: opacity 0.4s ease, transform 0.05s linear;
                mix-blend-mode: screen;
                filter: blur(12px);
            }
        `;
        document.head.appendChild(style);

        // Bootstrap the Glow Element
        const glow = document.createElement('div');
        glow.className = 'touch-glow';
        document.body.appendChild(glow);

        // Touch event captures
        document.addEventListener('touchstart', (e) => {
            glow.style.opacity = '1';
            updateGlow(e.touches[0]);
        }, {passive:true});

        document.addEventListener('touchmove', (e) => {
            updateGlow(e.touches[0]);
        }, {passive:true});

        document.addEventListener('touchend', () => {
            glow.style.opacity = '0';
        });

        function updateGlow(touch) {
            glow.style.transform = `translate(${touch.clientX - 40}px, ${touch.clientY - 40}px)`;
        }
    }
})();
