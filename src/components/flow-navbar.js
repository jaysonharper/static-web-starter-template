import { LitElement, html, css } from "lit";

/**
 * A professional navigation bar component for Law Offices
 * Features GitHub-inspired dark theme with smooth animations
 */
export class FlowNavbar extends LitElement {
  static styles = css`
    :host {
      display: block;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      background: linear-gradient(135deg, #0d1117 0%, #161b22 100%);
      border-bottom: 1px solid #30363d;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    }

    .navbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.75rem 1rem;
      max-width: 1200px;
      margin: 0 auto;
      position: relative;
    }

    /* Mobile Menu Toggle */
    .menu-toggle {
      display: flex;
      flex-direction: column;
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 0.375rem;
      transition: background-color 0.2s ease;
    }

    .menu-toggle:hover {
      background-color: #21262d;
    }

    .menu-toggle span {
      width: 1.5rem;
      height: 2px;
      background-color: #f0f6fc;
      margin: 2px 0;
      transition: all 0.3s ease;
      border-radius: 1px;
    }

    .menu-toggle.active span:nth-child(1) {
      transform: rotate(45deg) translate(5px, 5px);
    }

    .menu-toggle.active span:nth-child(2) {
      opacity: 0;
    }

    .menu-toggle.active span:nth-child(3) {
      transform: rotate(-45deg) translate(7px, -6px);
    }

    /* Company Name */
    .company-name {
      text-align: center;
      flex-grow: 1;
      margin: 0 1rem;
      cursor: pointer;
      transition: all 0.2s ease;
      padding: 0.5rem;
      border-radius: 0.375rem;
    }

    .company-name:hover {
      background-color: rgba(124, 58, 237, 0.1);
      transform: translateY(-1px);
    }

    .company-line-1 {
      font-size: 1.125rem;
      font-weight: 300;
      color: #8b949e;
      letter-spacing: 0.025em;
      margin-bottom: -2px;
      transition: color 0.2s ease;
    }

    .company-name:hover .company-line-1 {
      color: #f0f6fc;
    }

    .company-line-2 {
      font-size: 1.375rem;
      font-weight: 700;
      background: linear-gradient(
        135deg,
        #f0f6fc 0%,
        #7c3aed 50%,
        #2563eb 100%
      );
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      letter-spacing: 0.05em;
      text-shadow: 0 0 30px rgba(124, 58, 237, 0.3);
      transition: all 0.2s ease;
    }

    .company-name:hover .company-line-2 {
      text-shadow: 0 0 40px rgba(124, 58, 237, 0.5);
    }

    /* Desktop Navigation */
    .desktop-nav {
      display: none;
      align-items: center;
      gap: 2rem;
      margin-right: 1rem;
    }

    .nav-link {
      color: #f0f6fc;
      text-decoration: none;
      font-weight: 600;
      font-size: 0.925rem;
      padding: 0.5rem 1rem;
      border-radius: 0.375rem;
      transition: all 0.2s ease;
      position: relative;
      overflow: hidden;
    }

    .nav-link::before {
      content: "";
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(124, 58, 237, 0.1),
        transparent
      );
      transition: left 0.5s ease;
    }

    .nav-link:hover {
      color: #7c3aed;
      background-color: #21262d;
      transform: translateY(-1px);
    }

    .nav-link:hover::before {
      left: 100%;
    }

    /* Mobile Menu */
    .mobile-menu {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: linear-gradient(135deg, #0d1117 0%, #161b22 100%);
      border-bottom: 1px solid #30363d;
      transform: translateY(-100%);
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    }

    .mobile-menu.active {
      transform: translateY(0);
      opacity: 1;
      visibility: visible;
    }

    .mobile-nav {
      display: flex;
      flex-direction: column;
      padding: 1rem;
      gap: 0.5rem;
    }

    .mobile-nav .nav-link {
      width: 100%;
      text-align: center;
      padding: 0.75rem 1rem;
      border: 1px solid #30363d;
      margin-bottom: 0.5rem;
    }

    /* Responsive Design */
    @media (min-width: 768px) {
      .menu-toggle {
        display: none;
      }

      .desktop-nav {
        display: flex;
      }

      .company-line-1 {
        font-size: 1.25rem;
      }

      .company-line-2 {
        font-size: 1.5rem;
      }
    }

    @media (min-width: 1024px) {
      .navbar {
        padding: 1rem 2rem;
      }

      .company-line-1 {
        font-size: 1.375rem;
      }

      .company-line-2 {
        font-size: 1.75rem;
      }
    }
  `;

  static properties = {
    mobileMenuOpen: { type: Boolean },
  };

  constructor() {
    super();
    this.mobileMenuOpen = false;
  }

  render() {
    return html`
      <nav class="navbar">
        <!-- Mobile Menu Toggle -->
        <div
          class="menu-toggle ${this.mobileMenuOpen ? "active" : ""}"
          @click="${this._toggleMobileMenu}"
        >
          <span></span>
          <span></span>
          <span></span>
        </div>

        <!-- Company Name -->
        <div
          class="company-name"
          @click="${this._scrollToTop}"
          role="button"
          tabindex="0"
          @keydown="${this._handleCompanyNameKeydown}"
        >
          <div class="company-line-1">Law Offices of</div>
          <div class="company-line-2">Harper & Cats</div>
        </div>

        <!-- Desktop Navigation -->
        <div class="desktop-nav">
          <a href="#services" class="nav-link" @click="${this._handleNavClick}"
            >Services</a
          >
          <a href="#attorneys" class="nav-link" @click="${this._handleNavClick}"
            >Attorneys</a
          >
          <a
            href="#testimonials"
            class="nav-link"
            @click="${this._handleNavClick}"
            >Testimonials</a
          >
          <a href="#find-us" class="nav-link" @click="${this._handleNavClick}"
            >Find Us</a
          >
        </div>

        <!-- Scales of Justice Icon -->
        <flow-scales-icon></flow-scales-icon>

        <!-- Mobile Menu -->
        <div class="mobile-menu ${this.mobileMenuOpen ? "active" : ""}">
          <div class="mobile-nav">
            <a
              href="#services"
              class="nav-link"
              @click="${this._handleMobileNavClick}"
              >Services</a
            >
            <a
              href="#attorneys"
              class="nav-link"
              @click="${this._handleMobileNavClick}"
              >Attorneys</a
            >
            <a
              href="#testimonials"
              class="nav-link"
              @click="${this._handleMobileNavClick}"
              >Testimonials</a
            >
            <a
              href="#find-us"
              class="nav-link"
              @click="${this._handleMobileNavClick}"
              >Find Us</a
            >
          </div>
        </div>
      </nav>
    `;
  }

  _toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  _handleNavClick(e) {
    this._smoothScroll(e.target.getAttribute("href"));
  }

  _handleMobileNavClick(e) {
    this.mobileMenuOpen = false;
    this._smoothScroll(e.target.getAttribute("href"));
  }

  _smoothScroll(target) {
    const element = document.querySelector(target);
    if (element) {
      const offsetTop = element.offsetTop - 80; // Account for fixed navbar
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
  }

  _scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  _handleCompanyNameKeydown(e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      this._scrollToTop();
    }
  }
}

customElements.define("flow-navbar", FlowNavbar);
