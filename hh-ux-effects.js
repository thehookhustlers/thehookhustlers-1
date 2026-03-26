(function() {
    // Only run on mobile machines/screens
    if (window.matchMedia('(max-width: 768px)').matches) {
        // Inject Canvas dynamically
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.id = 'hh-mobile-ux-canvas';
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '99999';
        document.body.appendChild(canvas);

        let width, height;
        let targetX = -200, targetY = -200;
        let currentX = -200, currentY = -200;
        let isActive = false;
        let rotation = 0;
        let ringPulse = 0;

        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        }

        window.addEventListener('resize', resize);
        resize();

        function drawHUD(x, y, opacity) {
            if (opacity <= 0) return;

            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rotation);
            ctx.strokeStyle = `rgba(6, 182, 212, ${opacity * 0.4})`; // Cyan
            ctx.lineWidth = 1;

            // Inner Rotating Ring
            ctx.beginPath();
            ctx.arc(0, 0, 25 + Math.sin(ringPulse) * 2, 0, Math.PI * 2);
            ctx.stroke();

            // Outer Dashed Ring (Opposite Rotation)
            ctx.save();
            ctx.rotate(-rotation * 1.5);
            ctx.strokeStyle = `rgba(124, 58, 237, ${opacity * 0.3})`; // Violet
            ctx.setLineDash([5, 15]);
            ctx.beginPath();
            ctx.arc(0, 0, 40, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();

            // Corner Brackets (Targeting feel)
            ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.5})`;
            const bSize = 12;
            const bOffset = 45;
            
            for (let i = 0; i < 4; i++) {
                ctx.save();
                ctx.rotate((Math.PI / 2) * i);
                ctx.beginPath();
                ctx.moveTo(bOffset - bSize, bOffset);
                ctx.lineTo(bOffset, bOffset);
                ctx.lineTo(bOffset, bOffset - bSize);
                ctx.stroke();
                ctx.restore();
            }

            // Central faint glow
            const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 60);
            gradient.addColorStop(0, `rgba(124, 58, 237, ${opacity * 0.15})`);
            gradient.addColorStop(1, 'transparent');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(0, 0, 60, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
        }

        function animate() {
            ctx.clearRect(0, 0, width, height);

            // Smooth following (Easing/Lerp)
            currentX += (targetX - currentX) * 0.15;
            currentY += (targetY - currentY) * 0.15;
            
            rotation += 0.02;
            ringPulse += 0.05;

            const opacity = isActive ? 1 : 0;
            // Additional check to keep drawing while fading
            // (We could add a dedicated alpha lerp here if we wanted longer trails)
            
            drawHUD(currentX, currentY, opacity);

            requestAnimationFrame(animate);
        }

        animate();

        document.addEventListener('touchstart', (e) => {
            isActive = true;
            targetX = e.touches[0].clientX;
            targetY = e.touches[0].clientY;
            // Instant snap on first touch to avoid flying in from corner
            if (currentX < 0) {
                currentX = targetX;
                currentY = targetY;
            }
        }, {passive: true});

        document.addEventListener('touchmove', (e) => {
            targetX = e.touches[0].clientX;
            targetY = e.touches[0].clientY;
        }, {passive: true});

        document.addEventListener('touchend', () => {
            isActive = false;
        }, {passive: true});
    }
})();
