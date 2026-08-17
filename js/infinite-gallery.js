// Infinite 3D scroll gallery, vanilla JS reimplementation of a
// z-depth photo carousel (no React / three.js dependency, since this is
// a static site). Scroll, arrow keys, or touch swipe move through the
// photos in depth; the page scroll is released once you reach either end,
// so scrolling continues naturally to the rest of the page.

(function () {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  function initGallery(container) {
    const track = container.querySelector(".infinite-gallery-track");
    const items = Array.from(container.querySelectorAll(".infinite-gallery-item"));
    const count = items.length;
    if (!track || !count) return;

    const Z_STEP = 240; // px of depth between consecutive photos
    const FAR_LIMIT = 5.5; // photos ahead before fully faded into the distance
    const NEAR_LIMIT = 1.15; // photos "passed" before fully faded near the viewer

    let position = 0; // 0..count-1, clamped (not wrapping)
    let lastInteraction = performance.now();
    let lastTime = performance.now();
    const AUTO_SPEED = 0.12; // photos per second when idle
    const RESUME_DELAY = 3000; // ms of inactivity before autoplay resumes

    function clamp(v) {
      return Math.max(0, Math.min(count - 1, v));
    }

    function render() {
      items.forEach((item, i) => {
        const diff = i - position;
        const z = -diff * Z_STEP;
        let opacity;
        if (diff >= 0) {
          opacity = 1 - Math.min(diff / FAR_LIMIT, 1);
        } else {
          opacity = 1 - Math.min(-diff / NEAR_LIMIT, 1);
        }
        opacity = Math.max(0, opacity);
        item.style.transform = `translate(-50%, -50%) translateZ(${z}px)`;
        item.style.opacity = opacity.toFixed(3);
        item.style.zIndex = String(1000 - Math.round(Math.abs(diff) * 10));
        item.style.pointerEvents = opacity > 0.05 ? "auto" : "none";
      });
    }

    function markInteraction() {
      lastInteraction = performance.now();
    }

    // Mouse wheel: capture while there's still room to move in that
    // direction, release (let the page scroll normally) at either end.
    container.addEventListener(
      "wheel",
      (e) => {
        const goingDown = e.deltaY > 0;
        const atEnd = goingDown ? position >= count - 1 : position <= 0;
        if (atEnd) return; // let the page keep scrolling past the gallery
        e.preventDefault();
        position = clamp(position + e.deltaY * 0.012);
        markInteraction();
        render();
      },
      { passive: false }
    );

    // Keyboard, only when the gallery has focus.
    container.setAttribute("tabindex", "0");
    container.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        position = clamp(position + 1);
        markInteraction();
        render();
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        position = clamp(position - 1);
        markInteraction();
        render();
      }
    });

    // Touch swipe, same capture/release rule as wheel.
    let touchStartY = null;
    container.addEventListener(
      "touchstart",
      (e) => {
        touchStartY = e.touches[0].clientY;
      },
      { passive: true }
    );
    container.addEventListener(
      "touchmove",
      (e) => {
        if (touchStartY === null) return;
        const dy = touchStartY - e.touches[0].clientY;
        const goingDown = dy > 0;
        const atEnd = goingDown ? position >= count - 1 : position <= 0;
        if (atEnd) return;
        e.preventDefault();
        position = clamp(position + dy * 0.02);
        touchStartY = e.touches[0].clientY;
        markInteraction();
        render();
      },
      { passive: false }
    );

    function loop(now) {
      const dt = Math.min(now - lastTime, 50) / 1000;
      lastTime = now;
      if (!prefersReducedMotion && now - lastInteraction > RESUME_DELAY && position < count - 1) {
        position = clamp(position + AUTO_SPEED * dt);
        render();
      }
      requestAnimationFrame(loop);
    }

    render();
    requestAnimationFrame(loop);
  }

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".infinite-gallery").forEach(initGallery);
  });
})();
