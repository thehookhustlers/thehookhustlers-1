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
        let particles = [];
        const maxParticles = 25;
        let touchX = -100;
        let touchY = -100;
        let isActive = false;

        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        }

        window.addEventListener('resize', resize);
        resize();

        class Particle {
            constructor(x, y) {
                this.x = x;
                this.y = y;
                this.size = Math.random() * 15 + 5;
                this.speedX = Math.random() * 2 - 1;
                this.speedY = Math.random() * 2 - 1;
                this.color = Math.random() > 0.5 ? '#7c3aed' : '#06b6d4'; // Violet or Cyan
                this.alpha = 1;
                this.decay = Math.random() * 0.02 + 0.015;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                this.alpha -= this.decay;
                if (this.size > 0.2) this.size -= 0.1;
            }

            draw() {
                ctx.save();
                ctx.globalAlpha = this.alpha;
                ctx.shadowBlur = 15;
                ctx.shadowColor = this.color;
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }

        function createParticles(x, y) {
            if (particles.length < maxParticles) {
                particles.push(new Particle(x, y));
            }
        }

        function animate() {
            ctx.clearRect(0, 0, width, height);
            
            if (isActive) {
                // Main soft glow at touch point
                const gradient = ctx.createRadialGradient(touchX, touchY, 0, touchX, touchY, 50);
                gradient.addColorStop(0, 'rgba(124, 58, 237, 0.3)');
                gradient.addColorStop(0.5, 'rgba(6, 182, 212, 0.1)');
                gradient.addColorStop(1, 'transparent');
                ctx.fillStyle = gradient;
                ctx.fillRect(touchX - 75, touchY - 75, 150, 150);
                
                createParticles(touchX, touchY);
            }

            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
                if (particles[i].alpha <= 0) {
                    particles.splice(i, 1);
                    i--;
                }
            }
            requestAnimationFrame(animate);
        }

        animate();

        document.addEventListener('touchstart', (e) => {
            isActive = true;
            touchX = e.touches[0].clientX;
            touchY = e.touches[0].clientY;
        }, {passive: true});

        document.addEventListener('touchmove', (e) => {
            touchX = e.touches[0].clientX;
            touchY = e.touches[0].clientY;
            // Density boost on move
            createParticles(touchX, touchY);
        }, {passive: true});

        document.addEventListener('touchend', () => {
            isActive = false;
        }, {passive: true});
    }
})();
