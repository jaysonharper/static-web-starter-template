// Simple entrypoint for the demo site
// Only run DOM wiring when `document` exists (avoid errors in Node test env)
if (typeof document !== 'undefined') {
  const app = document.getElementById('app');
  const btn = document.getElementById('btn');

  if (btn && app) {
    btn.addEventListener('click', () => {
      // Use Tailwind utility classes for scale and transition
  const activeClass = 'scale-99';
      const transClass = 'transition-transform';
      if (app.classList.contains(activeClass)) {
        app.classList.remove(activeClass, transClass);
        btn.textContent = 'Click me';
      } else {
        app.classList.add(activeClass, transClass);
        btn.textContent = 'Clicked ✓';
      }
    });
  }
}

// Exported for tests or future modules
export function greet(name = 'Visitor') {
  return `Hello, ${name}!`;
}
