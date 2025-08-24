// Import our component library
import "./components/index.js";

// Debug browser session differences
console.log("Browser info:", {
  userAgent: navigator.userAgent,
  cookieEnabled: navigator.cookieEnabled,
  onLine: navigator.onLine,
  language: navigator.language,
  viewport: `${window.innerWidth}x${window.innerHeight}`,
  devicePixelRatio: window.devicePixelRatio,
  hasLocalStorage: typeof Storage !== "undefined",
  timestamp: new Date().toISOString(),
});

// Check for browser extensions that might affect rendering
if (window.chrome && window.chrome.runtime) {
  console.log(
    "Chrome extensions detected - this may affect rendering in logged-in sessions"
  );
}

// Main application entrypoint for Law Offices of Harper & Cats
// Only run DOM wiring when `document` exists (avoid errors in Node test env)
if (typeof document !== "undefined") {
  // Ensure DOM is fully loaded before initializing
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeApp);
  } else {
    // DOM is already ready
    initializeApp();
  }
}

function initializeApp() {
  console.log("Initializing app at:", new Date().toISOString());

  // Setup smooth scrolling for navigation links
  setupSmoothScrolling();

  // Setup component event listeners
  setupComponentEvents();

  // Setup scroll animations
  setupScrollAnimations();

  // Setup phone call functionality
  setupPhoneCallHandling();

  // Force layout recalculation to ensure consistent rendering
  setTimeout(() => {
    const serviceHighlights = document.querySelector(".service-highlights");
    if (serviceHighlights) {
      serviceHighlights.style.display = "none";
      serviceHighlights.offsetHeight; // Force reflow
      serviceHighlights.style.display = "grid";
      console.log("Service highlights layout refreshed");
    }
  }, 100);
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

    // Note: Notifications can be added explicitly when needed
  });

  // Listen for custom flow-call-button events
  document.addEventListener("flow-call-click", (e) => {
    console.log("Call button clicked:", e.detail);

    const { phoneNumber, variant, size } = e.detail;

    // Track call attempt with additional context
    trackEvent("phone_call_attempted", {
      phone_number: phoneNumber,
      source: variant === "hero" ? "hero_section" : "navbar",
      button_size: size,
      button_variant: variant,
    });

    // Note: Call confirmation alerts can be added explicitly when needed
  });

  // Listen for alert events
  document.addEventListener("flow-alert-closed", (e) => {
    console.log("Alert closed:", e.detail);
  });

  // Listen for scroll-to-top events
  document.addEventListener("flow-scroll-top-click", (e) => {
    console.log("Scroll to top clicked:", e.detail);

    // Track scroll to top usage
    trackEvent("scroll_to_top_used", {
      timestamp: e.detail.timestamp,
      scroll_position: e.detail.scrollPosition,
      source: "scroll_to_top_button",
    });

    // Note: Scroll confirmation alerts can be added explicitly when needed
  });

  // Listen for scales icon events
  document.addEventListener("scales-click", (e) => {
    console.log("Scales of Justice clicked:", e.detail);

    // Track scales interaction
    trackEvent("scales_icon_clicked", {
      timestamp: e.detail.timestamp,
      current_state: e.detail.currentState,
      source: "navbar_scales_icon",
    });
  });

  // Listen for floating call button events
  document.addEventListener("flow-floating-call-click", (e) => {
    console.log("Floating call button clicked:", e.detail);

    // Track floating call button usage
    trackEvent("floating_call_button_clicked", {
      timestamp: e.detail.timestamp,
      phone_number: e.detail.phoneNumber,
      scroll_position: e.detail.scrollPosition,
      source: "floating_call_button",
    });
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

      // Note: Call confirmation alerts can be added explicitly when needed
    }
  });
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
