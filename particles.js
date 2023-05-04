(function (init) {
  window.addEventListener("load", init);
})(function () {
  "use strict";
  const canvas = document.getElementById("cvs");
  const context = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const gradient = context.createLinearGradient(
    0,
    0,
    canvas.width,
    canvas.height
  );
  gradient.addColorStop(0, "#fff");
  gradient.addColorStop(0.5, "magenta");
  gradient.addColorStop(1, "blue");
  context.fillStyle = gradient;
  context.strokeStyle = gradient;

  class Particle {
    constructor(effect) {
      this.effect = effect;
      this.radius = Math.floor(Math.random() * 5 + 2);
      this.x =
        this.radius + Math.random() * (this.effect.width - this.radius * 2);
      this.y =
        this.radius + Math.random() * (this.effect.height - this.radius * 2);
      this.vx = Math.random() * 4 - 2;
      this.vy = Math.random() * 4 - 2;
    }

    draw(context) {
      context.beginPath();
      context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      context.fill();
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x > this.effect.width || this.x < 0) this.vx *= -1;
      if (this.y > this.effect.height || this.y < 0) this.vy *= -1;
    }
  }
  class Effect {
    constructor(canvas) {
      this.canvas = canvas;
      this.width = this.canvas.width;
      this.height = this.canvas.height;
      this.particles = [];
      this.numberOfParticles = 50;
      this.createParticles();
    }
    createParticles() {
      for (let i = 0; i < this.numberOfParticles; i++) {
        this.particles.push(new Particle(this));
      }
    }
    handleParticles() {
      this.particles.forEach((particle) => {
        particle.draw(context);
        particle.update();
        this.connectParticles(context);
      });
    }

    connectParticles(context) {
      const maxDistance = 200;
      for (let a = 0; a < this.particles.length; a++) {
        for (let b = a; b < this.particles.length; b++) {
          const dx = this.particles[a].x - this.particles[b].x;
          const dy = this.particles[a].y - this.particles[b].y;
          const distance = Math.hypot(dx, dy);
          if (distance < maxDistance) {
            const opacity = 1 - distance / maxDistance;
            context.globalAlpha = opacity;
            context.beginPath();
            context.moveTo(this.particles[a].x, this.particles[a].y);
            context.lineTo(this.particles[b].x, this.particles[b].y);
            context.stroke();
            context.restore();
          }
        }
      }
    }
  }
  const effect = new Effect(canvas);
  function animate() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    window.requestAnimationFrame(animate);
    effect.handleParticles(context);
  }
  animate();
});
