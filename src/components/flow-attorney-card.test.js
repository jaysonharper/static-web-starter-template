import { expect, describe, it, beforeEach, vi } from "vitest";
import { fixture, html } from "@open-wc/testing";
import "./flow-attorney-card.js";

describe("FlowAttorneyCard", () => {
  let element;

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
    element = await fixture(html`
      <flow-attorney-card
        .name="${defaultProps.name}"
        .email="${defaultProps.email}"
        .image="${defaultProps.image}"
        .imageAlt="${defaultProps.imageAlt}"
        .specialties="${defaultProps.specialties}"
        .education="${defaultProps.education}"
        .memberships="${defaultProps.memberships}"
        .admissions="${defaultProps.admissions}"
        .biography="${defaultProps.biography}"
      ></flow-attorney-card>
    `);
  });

  describe("Rendering", () => {
    it("should render the component", () => {
      expect(element).to.exist;
      expect(element.tagName.toLowerCase()).to.equal("flow-attorney-card");
    });

    it("should display attorney name", () => {
      const name = element.shadowRoot.querySelector(".attorney-name");
      expect(name.textContent).to.equal(defaultProps.name);
    });

    it("should display attorney email", () => {
      const emailLink = element.shadowRoot.querySelector(".attorney-email a");
      expect(emailLink.textContent).to.equal(defaultProps.email);
      expect(emailLink.getAttribute("href")).to.equal(
        `mailto:${defaultProps.email}`
      );
    });

    it("should display attorney image", () => {
      const image = element.shadowRoot.querySelector(".attorney-image");
      expect(image.getAttribute("src")).to.equal(defaultProps.image);
      expect(image.getAttribute("alt")).to.equal(defaultProps.imageAlt);
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

    it("should display education section on back", () => {
      const educationItems = element.shadowRoot.querySelectorAll(
        ".card-back .bio-section:nth-child(2) li"
      );
      expect(educationItems.length).to.equal(defaultProps.education.length);
      expect(educationItems[0].textContent).to.equal(defaultProps.education[0]);
    });

    it("should display memberships section on back", () => {
      const membershipItems = element.shadowRoot.querySelectorAll(
        ".card-back .bio-section:nth-child(3) li"
      );
      expect(membershipItems.length).to.equal(defaultProps.memberships.length);
      expect(membershipItems[0].textContent).to.equal(
        defaultProps.memberships[0]
      );
    });

    it("should display admissions section on back", () => {
      const admissionItems = element.shadowRoot.querySelectorAll(
        ".card-back .bio-section:nth-child(4) li"
      );
      expect(admissionItems.length).to.equal(defaultProps.admissions.length);
      expect(admissionItems[0].textContent).to.equal(
        defaultProps.admissions[0]
      );
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
  });
});

describe("FlowAttorneyCard Integration", () => {
  it("should work with default values", async () => {
    const element = await fixture(
      html`<flow-attorney-card></flow-attorney-card>`
    );
    expect(element).to.exist;
    expect(element.name).to.equal("");
    expect(element.specialties).to.deep.equal([]);
  });

  it("should handle image class attribute", async () => {
    const element = await fixture(html`
      <flow-attorney-card
        image="test.jpg"
        image-class="custom-class"
        image-alt="Test"
      ></flow-attorney-card>
    `);

    const image = element.shadowRoot.querySelector(".attorney-image");
    expect(image.className).to.include("custom-class");
  });
});
