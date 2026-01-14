// Parallax effect for decorative elements
export const initParallaxEffect = () => {
  const decorElements = document.querySelectorAll('.home__decor');
 
  window.addEventListener('mousemove', (e: MouseEvent) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;
 
    decorElements.forEach((element, index) => {
      const speed = (index + 1) * 10;
      const xOffset = x * speed;
      const yOffset = y * speed;
 
      (element as HTMLElement).style.transform = `translate(${xOffset}px, ${yOffset}px)`;
    });
  });
};
 
// Dynamic particle generation
export const initParticles = () => {
  const particlesContainer = document.querySelector('.home__particles');
  if (!particlesContainer) return;
 
  for (let i = 0; i < 20; i++) {
    const particle = document.createElement('div');
    particle.className = 'home__particle';
    particle.style.cssText = `
      position: absolute;
      width: ${Math.random() * 3 + 1}px;
      height: ${Math.random() * 3 + 1}px;
      background: #00ffff;
      box-shadow: 0 0 ${Math.random() * 10 + 5}px #00ffff;
      border-radius: 50%;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      animation: float ${Math.random() * 10 + 15}s infinite ease-in-out;
      animation-delay: ${Math.random() * 5}s;
    `;
    particlesContainer.appendChild(particle);
  }
};