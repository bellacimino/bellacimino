// Bella Cimino Portfolio, shared behavior

document.addEventListener("DOMContentLoaded", () => {
  // Mobile nav toggle
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", () => {
      links.classList.toggle("open");
      const expanded = links.classList.contains("open");
      toggle.setAttribute("aria-expanded", expanded);
    });
    links.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => links.classList.remove("open"))
    );
  }

  // Lightbox for any gallery image with [data-lightbox]
  const lightbox = document.getElementById("lightbox");
  if (lightbox) {
    const lightboxImg = lightbox.querySelector("img");
    const closeBtn = lightbox.querySelector(".lightbox-close");

    document.querySelectorAll("[data-lightbox]").forEach((trigger) => {
      trigger.addEventListener("click", (e) => {
        e.preventDefault();
        const fullSrc = trigger.getAttribute("href") || trigger.querySelector("img")?.src;
        lightboxImg.src = fullSrc;
        lightboxImg.alt = trigger.querySelector("img")?.alt || "";
        lightbox.classList.add("open");
      });
    });

    const close = () => {
      lightbox.classList.remove("open");
      lightboxImg.src = "";
    };
    closeBtn?.addEventListener("click", close);
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) close();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });
  }

  // Nav dropdowns (Design / Art subsections), tap-to-open on touch devices,
  // since hover isn't available there. Desktop relies on CSS :hover/:focus-within.
  if (window.matchMedia("(hover: none)").matches) {
    document.querySelectorAll(".has-dropdown > a").forEach((link) => {
      link.addEventListener("click", function (e) {
        const parentLi = this.parentElement;
        if (window.innerWidth > 820 && !parentLi.classList.contains("dropdown-open")) {
          e.preventDefault();
          document.querySelectorAll(".has-dropdown.dropdown-open").forEach((li) => {
            if (li !== parentLi) li.classList.remove("dropdown-open");
          });
          parentLi.classList.add("dropdown-open");
        }
      });
    });
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".has-dropdown")) {
        document.querySelectorAll(".has-dropdown.dropdown-open").forEach((li) =>
          li.classList.remove("dropdown-open")
        );
      }
    });
  }

  // Footer year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
