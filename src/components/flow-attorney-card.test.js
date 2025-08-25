import { expect, describe, it, beforeEach, afterEach, vi } from "vitest";
import { FlowAttorneyCard } from "./flow-attorney-card.js";

// Register the custom element
if (!customElements.get("flow-attorney-card")) {
  customElements.define("flow-attorney-card", FlowAttorneyCard);
}

describe("FlowAttorneyCard", () => {
  let element;
  let container;

  const defaultProps = {
    name: "Test Attorney",
    email: "test@example.com",
    image: "test-image.jpg",
    imageAlt: "Test Attorney Profile",
    specialties: ["Corporate Law", "Litigation"],
    education: ["J.D., Test University"],
    memberships: ["Test Bar Association"],
    admissions: ["Test State Bar"],
    biography: "Test biography text",
  };

  beforeEach(async () => {
    container = document.createElement("div");
    document.body.appendChild(container);

    element = document.createElement("flow-attorney-card");
    Object.assign(element, defaultProps);
    container.appendChild(element);

    // Wait for component to update
    await new Promise((resolve) => setTimeout(resolve, 100));
  });

  afterEach(() => {
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }
  });

  describe("Rendering", () => {
    it("should render the component", () => {
      expect(element).to.exist;
      expect(element.tagName.toLowerCase()).to.equal("flow-attorney-card");
    });

    it("should display attorney name", async () => {
      await element.updateComplete;
      const name = element.shadowRoot.querySelector(".attorney-name");
      expect(name?.textContent).to.equal(defaultProps.name);
    });

    it("should display attorney email", async () => {
      await element.updateComplete;
      const emailLink = element.shadowRoot.querySelector(".attorney-email a");
      expect(emailLink?.textContent.trim()).to.equal(defaultProps.email);
      expect(emailLink?.getAttribute("href")).to.equal(
        `mailto:${defaultProps.email}`
      );
    });

    it("should display attorney image", async () => {
      await element.updateComplete;
      const image = element.shadowRoot.querySelector(".attorney-image");
      expect(image?.getAttribute("src")).to.equal(defaultProps.image);
      expect(image?.getAttribute("alt")).to.equal(defaultProps.imageAlt);
    });

    it("should display all specialties", () => {
      const specialtyTags =
        element.shadowRoot.querySelectorAll(".specialty-tag");
      expect(specialtyTags.length).to.equal(defaultProps.specialties.length);

      specialtyTags.forEach((tag, index) => {
        expect(tag.textContent.trim()).to.equal(
          defaultProps.specialties[index]
        );
      });
    });

    it("should display education section on back", async () => {
      await element.updateComplete;
      const educationItems = element.shadowRoot.querySelectorAll(
        ".card-back .bio-section h4"
      );
      const educationSection = Array.from(educationItems).find(
        (h4) => h4.textContent.trim() === "Education"
      );
      expect(educationSection).to.exist;
    });

    it("should display memberships section on back", async () => {
      await element.updateComplete;
      const membershipItems = element.shadowRoot.querySelectorAll(
        ".card-back .bio-section h4"
      );
      const membershipSection = Array.from(membershipItems).find(
        (h4) => h4.textContent.trim() === "Professional Memberships"
      );
      expect(membershipSection).to.exist;
    });

    it("should display admissions section on back", async () => {
      await element.updateComplete;
      const admissionItems = element.shadowRoot.querySelectorAll(
        ".card-back .bio-section h4"
      );
      const admissionSection = Array.from(admissionItems).find(
        (h4) => h4.textContent.trim() === "Bar Admissions"
      );
      expect(admissionSection).to.exist;
    });

    it("should display biography section on back", () => {
      const biography = element.shadowRoot.querySelector(
        ".card-back .bio-section:last-child p"
      );
      expect(biography.textContent).to.equal(defaultProps.biography);
    });
  });

  describe("Flip Functionality", () => {
    it("should start with card not flipped", () => {
      expect(element.isFlipped).to.be.false;
      const container = element.shadowRoot.querySelector(".card-container");
      expect(container.classList.contains("flipped")).to.be.false;
    });

    it("should flip card when clicked", async () => {
      const container = element.shadowRoot.querySelector(".card-container");
      container.click();

      await element.updateComplete;

      expect(element.isFlipped).to.be.true;
      expect(container.classList.contains("flipped")).to.be.true;
    });

    it("should flip back when clicked again", async () => {
      // First flip
      const container = element.shadowRoot.querySelector(".card-container");
      container.click();
      await element.updateComplete;

      // Second flip
      container.click();
      await element.updateComplete;

      expect(element.isFlipped).to.be.false;
      expect(container.classList.contains("flipped")).to.be.false;
    });

    it("should emit card-flip event when flipped", async () => {
      const eventSpy = vi.fn();
      element.addEventListener("card-flip", eventSpy);

      const container = element.shadowRoot.querySelector(".card-container");
      container.click();

      await element.updateComplete;

      expect(eventSpy).toHaveBeenCalledOnce();
      expect(eventSpy.mock.calls[0][0].detail).toMatchObject({
        name: defaultProps.name,
        isFlipped: true,
      });
    });
  });

  describe("Specialty Tag Interactions", () => {
    it("should emit specialty-click event when specialty tag is clicked", async () => {
      const eventSpy = vi.fn();
      element.addEventListener("specialty-click", eventSpy);

      const firstSpecialtyTag =
        element.shadowRoot.querySelector(".specialty-tag");
      firstSpecialtyTag.click();

      await element.updateComplete;

      expect(eventSpy).toHaveBeenCalledOnce();
      expect(eventSpy.mock.calls[0][0].detail).toMatchObject({
        specialty: defaultProps.specialties[0],
        attorneyName: defaultProps.name,
        serviceId: "service-corporate-law",
      });
    });

    it("should not flip card when specialty tag is clicked", async () => {
      const firstSpecialtyTag =
        element.shadowRoot.querySelector(".specialty-tag");
      firstSpecialtyTag.click();

      await element.updateComplete;

      expect(element.isFlipped).to.be.false;
    });

    it("should generate correct service ID from specialty name", () => {
      const testCases = [
        { specialty: "Corporate Law", expected: "service-corporate-law" },
        { specialty: "Personal Injury", expected: "service-personal-injury" },
        { specialty: "Estate Plans", expected: "service-estate-plans" },
      ];

      testCases.forEach(({ specialty, expected }) => {
        const serviceId = `service-${specialty
          .toLowerCase()
          .replace(/\s+/g, "-")}`;
        expect(serviceId).to.equal(expected);
      });
    });
  });

  describe("Email Link Interactions", () => {
    it("should not flip card when email link is clicked", async () => {
      const emailLink = element.shadowRoot.querySelector(".attorney-email a");
      emailLink.click();

      await element.updateComplete;

      expect(element.isFlipped).to.be.false;
    });
  });

  describe("Accessibility", () => {
    it("should have proper alt text for image", () => {
      const image = element.shadowRoot.querySelector(".attorney-image");
      expect(image.getAttribute("alt")).to.equal(defaultProps.imageAlt);
    });

    it('should have loading="lazy" on image', () => {
      const image = element.shadowRoot.querySelector(".attorney-image");
      expect(image.getAttribute("loading")).to.equal("lazy");
    });

    it("should have proper title attributes on flip indicators", () => {
      const flipIndicators =
        element.shadowRoot.querySelectorAll(".flip-indicator");
      flipIndicators.forEach((indicator) => {
        expect(indicator.getAttribute("title")).to.match(
          /(Show front|Show back)/
        );
      });
    });

    it("should have proper title on specialty tags", () => {
      const specialtyTags =
        element.shadowRoot.querySelectorAll(".specialty-tag");
      specialtyTags.forEach((tag, index) => {
        const expectedTitle = `Click to view ${defaultProps.specialties[index]} services`;
        expect(tag.getAttribute("title")).to.equal(expectedTitle);
      });
    });
  });

  describe("Responsive Design", () => {
    it("should apply mobile-specific classes for specialty tags", () => {
      const specialtyTags =
        element.shadowRoot.querySelectorAll(".specialty-tag");
      specialtyTags.forEach((tag) => {
        const styles = getComputedStyle(tag);
        expect(styles.width).to.exist;
        expect(styles.whiteSpace).to.equal("nowrap");
      });
    });

    it("should have proper max-width for specialty tags", () => {
      const specialtyTags =
        element.shadowRoot.querySelectorAll(".specialty-tag");
      specialtyTags.forEach((tag) => {
        const styles = getComputedStyle(tag);
        expect(styles.maxWidth).to.exist;
        expect(styles.textOverflow).to.equal("ellipsis");
      });
    });

    it("should handle container overflow properly", () => {
      const specialtiesContainer = element.shadowRoot.querySelector(
        ".attorney-specialties"
      );
      const styles = getComputedStyle(specialtiesContainer);
      expect(styles.maxWidth).to.equal("100%");
      expect(styles.overflow).to.equal("hidden");
    });
  });

  describe("CSS Transforms and Animations", () => {
    it("should have proper 3D transform setup", () => {
      const cardContainer = element.shadowRoot.querySelector(".card-container");
      const styles = getComputedStyle(cardContainer);
      expect(styles.transformStyle).to.equal("preserve-3d");
      expect(styles.perspective).to.exist;
    });

    it("should apply flipped class correctly", async () => {
      const cardContainer = element.shadowRoot.querySelector(".card-container");

      // Initially not flipped
      expect(cardContainer.classList.contains("flipped")).to.be.false;

      // After flip
      cardContainer.click();
      await element.updateComplete;
      expect(cardContainer.classList.contains("flipped")).to.be.true;
    });

    it("should have backface-visibility hidden on card faces", () => {
      const cardFaces = element.shadowRoot.querySelectorAll(".card-face");
      cardFaces.forEach((face) => {
        const styles = getComputedStyle(face);
        expect(styles.backfaceVisibility).to.equal("hidden");
      });
    });

    it("should have proper transform on card-back", () => {
      const cardBack = element.shadowRoot.querySelector(".card-back");
      const styles = getComputedStyle(cardBack);
      // Check if any transform is applied (rotateY becomes matrix3d in computed styles)
      expect(styles.transform).to.not.equal("none");
    });
  });

  describe("Event Propagation", () => {
    it("should stop propagation for email clicks", async () => {
      await element.updateComplete;
      const emailLink = element.shadowRoot.querySelector(".attorney-email a");

      // Click email link and verify card doesn't flip
      emailLink.click();
      await element.updateComplete;

      expect(element.isFlipped).to.be.false;
    });

    it("should stop propagation for specialty tag clicks", async () => {
      const specialtyTag = element.shadowRoot.querySelector(".specialty-tag");

      // Click specialty tag
      specialtyTag.click();
      await element.updateComplete;

      // Card should not flip
      expect(element.isFlipped).to.be.false;
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty specialties array", async () => {
      element.specialties = [];
      await element.updateComplete;

      const specialtyTags =
        element.shadowRoot.querySelectorAll(".specialty-tag");
      expect(specialtyTags.length).to.equal(0);
    });

    it("should handle empty education array", async () => {
      element.education = [];
      await element.updateComplete;

      const educationSection = element.shadowRoot.querySelector(
        ".card-back .bio-section:nth-child(2)"
      );
      expect(educationSection).to.not.exist;
    });

    it("should handle missing biography", async () => {
      element.biography = "";
      await element.updateComplete;

      const biographySection = element.shadowRoot.querySelector(
        ".card-back .bio-section:last-child"
      );
      expect(biographySection.textContent).to.not.include("Biography");
    });

    it("should handle long attorney names gracefully", async () => {
      const longName = "Dr. Professor Attorney McVeryLongNameson III Esquire";
      element.name = longName;
      await element.updateComplete;

      const nameElement = element.shadowRoot.querySelector(".attorney-name");
      expect(nameElement.textContent).to.equal(longName);
    });

    it("should handle image class attribute properly", async () => {
      element.imageClass = "roxie";
      await element.updateComplete;

      const image = element.shadowRoot.querySelector(".attorney-image");
      expect(image.className).to.include("roxie");
    });

    it("should handle undefined or null values gracefully", async () => {
      element.name = null;
      element.email = undefined;
      element.specialties = null;
      element.education = null;
      element.memberships = null;
      element.admissions = null;
      await element.updateComplete;

      // Should not crash and render empty content
      const nameElement = element.shadowRoot.querySelector(".attorney-name");
      expect(nameElement.textContent).to.equal("");
    });

    it("should handle very long specialty names with ellipsis", async () => {
      const longSpecialty =
        "Very Long Specialty Name That Should Be Truncated With Ellipsis";
      element.specialties = [longSpecialty];
      await element.updateComplete;

      const specialtyTag = element.shadowRoot.querySelector(".specialty-tag");
      expect(specialtyTag.textContent.trim()).to.equal(longSpecialty);

      const styles = getComputedStyle(specialtyTag);
      expect(styles.textOverflow).to.equal("ellipsis");
    });
  });
});

describe("FlowAttorneyCard Integration", () => {
  it("should work with default values", () => {
    const element = document.createElement("flow-attorney-card");
    expect(element).to.exist;
    expect(element.name).to.equal("");
    expect(element.specialties).to.deep.equal([]);
  });

  it("should handle image class attribute", () => {
    const element = document.createElement("flow-attorney-card");
    element.setAttribute("image", "test.jpg");
    element.setAttribute("image-class", "custom-class");
    element.setAttribute("image-alt", "Test");

    expect(element.imageClass).to.equal("custom-class");
  });
});
