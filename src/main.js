// Import our component library
import "./components/index.js";

// Main application entrypoint for Law Offices of Harper & Cats
// Only run DOM wiring when `document` exists (avoid errors in Node test env)
if (typeof document !== "undefined") {
  // Initialize the application
  initializeApp();
}

function initializeApp() {
  // Setup smooth scrolling for navigation links
  setupSmoothScrolling();

  // Setup component event listeners
  setupComponentEvents();

  // Setup scroll animations
  setupScrollAnimations();

  // Setup phone call functionality
  setupPhoneCallHandling();
}

function setupSmoothScrolling() {
  // Handle all anchor links for smooth scrolling
  document.addEventListener("click", (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (link) {
      e.preventDefault();
      const targetId = link.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        });
      }
    }
  });
}

function setupComponentEvents() {
  // Listen for custom flow-button events
  document.addEventListener("flow-click", (e) => {
    console.log("Flow button clicked:", e.detail);

    // Handle different button actions
    const target = e.detail.originalEvent.target.closest("a");
    if (target && target.href.startsWith("tel:")) {
      // Phone call button - handled by setupPhoneCallHandling
      return;
    }

    // Show success feedback for other buttons
    showNotification("Action completed successfully!", "success");
  });

  // Listen for alert events
  document.addEventListener("flow-alert-closed", (e) => {
    console.log("Alert closed:", e.detail);
  });
}

function setupScrollAnimations() {
  // Create an intersection observer for fade-in animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("fade-in");
        observer.unobserve(entry.target); // Only animate once
      }
    });
  }, observerOptions);

  // Observe all content sections
  const sections = document.querySelectorAll(".content-section");
  sections.forEach((section) => {
    observer.observe(section);
  });
}

function setupPhoneCallHandling() {
  // Track phone call attempts for analytics
  document.addEventListener("click", (e) => {
    const link = e.target.closest('a[href^="tel:"]');
    if (link) {
      const phoneNumber = link.href.replace("tel:", "");
      console.log("Phone call initiated:", phoneNumber);

      // Track call attempt (you could send this to analytics)
      trackEvent("phone_call_attempted", {
        phone_number: phoneNumber,
        source: link.closest(".call-button") ? "navbar" : "hero",
      });

      // Show confirmation message
      showNotification("Initiating call to " + phoneNumber, "info");
    }
  });
}

function showNotification(message, type = "info") {
  // Create and show a temporary notification
  const alert = document.createElement("flow-alert");
  alert.type = type;
  alert.dismissible = true;
  alert.innerHTML = `<strong>${
    type === "success" ? "Success!" : "Info:"
  }</strong> ${message}`;

  // Style the alert for better positioning
  alert.style.position = "fixed";
  alert.style.top = "100px";
  alert.style.right = "20px";
  alert.style.zIndex = "9999";
  alert.style.maxWidth = "400px";

  document.body.appendChild(alert);

  // Auto-remove after 5 seconds if not manually dismissed
  setTimeout(() => {
    if (alert.parentNode) {
      alert.remove();
    }
  }, 5000);
}

function trackEvent(eventName, eventData) {
  // Placeholder for analytics tracking
  // You could integrate with Google Analytics, Mixpanel, etc.
  console.log("Event tracked:", eventName, eventData);

  // Example integration:
  // if (typeof gtag !== 'undefined') {
  //   gtag('event', eventName, eventData);
  // }
}

// Utility function for other modules
export function greet(name = "Client") {
  return `Welcome to Law Offices of Harper & Cats, ${name}!`;
}

// Export main functions for testing
export {
  initializeApp,
  setupSmoothScrolling,
  setupComponentEvents,
  trackEvent,
};
