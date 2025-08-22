// Import our component library
import "./components/index.js";

// Simple entrypoint for the demo site
// Only run DOM wiring when `document` exists (avoid errors in Node test env)
if (typeof document !== "undefined") {
  const app = document.getElementById("app");
  const btn = document.getElementById("btn");

  if (btn && app) {
    btn.addEventListener("click", () => {
      // Breakpoint: Click in first column or set below
      // debugger;
      // Use Tailwind utility classes for scale and transition
      const activeClass = "scale-99";
      const transClass = "transition-transform";
      if (app.classList.contains(activeClass)) {
        app.classList.remove(activeClass, transClass);
        btn.textContent = "Click me";
      } else {
        app.classList.add(activeClass, transClass);
        btn.textContent = "Clicked ✓";
      }
    });
  }

  // Demo the new components
  setupComponentDemo();
}

function setupComponentDemo() {
  // Listen for custom component events
  document.addEventListener("flow-click", (e) => {
    console.log("Flow button clicked:", e.detail);

    // Show an alert when button is clicked
    const alert = document.createElement("flow-alert");
    alert.type = "success";
    alert.dismissible = true;
    alert.innerHTML = `<strong>Success!</strong> You clicked a ${e.detail.variant} button.`;

    document.body.insertBefore(alert, document.body.firstChild);
  });

  document.addEventListener("flow-alert-closed", (e) => {
    console.log("Alert closed:", e.detail);
  });
}

// Exported for tests or future modules
export function greet(name = "Visitor") {
  return `Hello, ${name}!`;
}
