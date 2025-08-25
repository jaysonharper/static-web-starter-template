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

// Development utilities
if (import.meta.env.DEV) {
  // Add global console clearing function for development
  window.clearAll = () => {
    console.clear();
    console.log("🧹 Console cleared!");
    console.log("🚀 Law Offices of Harper & Cats - Development Mode");
  };
  console.log("💡 Development mode: Use clearAll() to clear console");
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

  // Setup attorney cards with data
  setupAttorneyCards();

  // Setup smooth scrolling for navigation links
  setupSmoothScrolling();

  // Setup attorney specialty tag scrolling
  setupAttorneySpecialtyScrolling();

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

function setupAttorneyCards() {
  // Attorney data
  const attorneyData = {
    "Roxie Harper": {
      specialties: [
        "Corporate Law",
        "Personal Injury",
        "Family Law",
        "Estate Plans",
        "Guardianships",
        "Litigation",
        "Collections",
      ],
      education: [
        "J.D., Harvard Law School, magna cum laude (2018)",
        "B.A., Political Science, Yale University, summa cum laude (2015)",
        "Certificate in Corporate Finance, Wharton School (2019)",
      ],
      memberships: [
        "American Bar Association",
        "State Bar of California",
        "Los Angeles County Bar Association",
        "American Association for Justice",
        "National Association of Criminal Defense Lawyers",
      ],
      admissions: [
        "California State Bar (2018)",
        "U.S. District Court, Central District of California (2019)",
        "U.S. Court of Appeals, Ninth Circuit (2020)",
      ],
      biography:
        "Roxie Harper is a dedicated attorney with over 6 years of experience in corporate law and personal injury cases. She has successfully represented clients in complex litigation matters, securing millions in settlements and verdicts. Roxie is known for her meticulous attention to detail and aggressive advocacy for her clients. When not practicing law, she enjoys hiking with her rescue cats and volunteering at local animal shelters.",
    },
    "Shadow Harper": {
      specialties: [
        "Elder Law",
        "Business Law",
        "Real Estate",
        "Conservatorships",
        "Guardianships",
        "Litigation",
        "Collections",
      ],
      education: [
        "J.D., Stanford Law School, Order of the Coif (2015)",
        "LL.M., Tax Law, New York University (2016)",
        "B.S., Business Administration, UC Berkeley, Phi Beta Kappa (2012)",
      ],
      memberships: [
        "American Bar Association",
        "National Academy of Elder Law Attorneys",
        "California Association of Business Trial Lawyers",
        "Real Property Section of the State Bar",
        "Estate Planning Council of Los Angeles",
      ],
      admissions: [
        "California State Bar (2015)",
        "Nevada State Bar (2017)",
        "U.S. District Court, Northern District of California (2016)",
        "U.S. Tax Court (2017)",
      ],
      biography:
        "Shadow Harper specializes in elder law and estate planning with over 8 years of experience protecting seniors and their families. She has helped hundreds of families navigate complex Medicaid planning, guardianship proceedings, and estate administration. Shadow is particularly passionate about advocating for vulnerable adults and has been recognized by the National Academy of Elder Law Attorneys for her outstanding service. She frequently speaks at continuing education seminars and community workshops.",
    },
  };

  // Find and populate attorney cards
  const attorneyCards = document.querySelectorAll("flow-attorney-card");
  attorneyCards.forEach((card) => {
    const name = card.getAttribute("name");
    const data = attorneyData[name];

    if (data) {
      card.specialties = data.specialties;
      card.education = data.education;
      card.memberships = data.memberships;
      card.admissions = data.admissions;
      card.biography = data.biography;

      // Add event listeners using the reusable function
      setupAttorneyCardListeners(card, data);
    }
  });
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

function setupAttorneySpecialtyScrolling() {
  // Handle clicks on attorney specialty tags
  document.addEventListener("click", (e) => {
    const specialtyTag = e.target.closest(".specialty-tag[data-service]");
    if (specialtyTag) {
      e.preventDefault();
      e.stopPropagation(); // Prevent other click handlers from interfering

      const serviceId = specialtyTag.getAttribute("data-service");
      const targetElement = document.getElementById(serviceId);

      console.log(`Specialty tag clicked: ${serviceId}`);
      console.log("Target element found:", targetElement);

      if (targetElement) {
        // Get the current scroll position and target position
        const currentScrollY = window.scrollY;
        const targetRect = targetElement.getBoundingClientRect();
        const absoluteTop = targetRect.top + currentScrollY;

        // Calculate navbar height and responsive offset
        const navbar =
          document.querySelector("flow-navbar") ||
          document.querySelector("nav") ||
          document.querySelector("header");
        let navbarHeight = 80; // Default fallback

        if (navbar) {
          const navbarRect = navbar.getBoundingClientRect();
          navbarHeight = navbarRect.height;
        }

        // Add extra padding for larger screens to ensure top border is visible
        const extraPadding = window.innerWidth >= 768 ? 40 : 20; // More padding on tablet/desktop
        const offsetTop = absoluteTop - navbarHeight - extraPadding;

        console.log(
          `Current scroll: ${currentScrollY}, Target absolute top: ${absoluteTop}, Navbar height: ${navbarHeight}, Extra padding: ${extraPadding}, Final offset: ${offsetTop}`
        );

        // Add visual feedback
        specialtyTag.style.transform = "scale(0.95)";
        setTimeout(() => {
          specialtyTag.style.transform = "";
        }, 150);

        // Smooth scroll to the service
        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        });

        // Add highlight effect to the target service
        targetElement.classList.add("highlight-flash");
        setTimeout(() => {
          targetElement.classList.remove("highlight-flash");
        }, 2000);

        console.log(`Scrolled to service: ${serviceId}`);
      } else {
        console.error(`Target element not found for service: ${serviceId}`);
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
