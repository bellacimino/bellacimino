// Scroll-based velocity marquee, vanilla JS reimplementation.
// Two rows of text scroll continuously and speed up / reverse based on
// the user's scroll velocity, mirroring the Componentry "ScrollBasedVelocity"
// component (https://componentry.dev/docs/components/scroll-based-velocity),
// rebuilt without React or framer-motion since this is a static site.

(function () {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  function initRow(row) {
    const track = row.querySelector(".velocity-track");
    if (!track) return;

    const baseVelocity = parseFloat(row.dataset.baseVelocity || "40"); // px/sec, sign = direction

    // Keep a clean copy of the original items so we can rebuild on resize.
    const baseItems = Array.from(track.children).map((n) => n.cloneNode(true));

    let unitWidth = 0;

    function buildUnit() {
      track.innerHTML = "";
      baseItems.forEach((n) => track.appendChild(n.cloneNode(true)));

      // Repeat the base set until one "unit" is at least as wide as the row,
      // so there's never a gap on wide screens.
      let guard = 0;
      while (track.scrollWidth < row.clientWidth && guard < 30) {
        baseItems.forEach((n) => track.appendChild(n.cloneNode(true)));
        guard++;
      }
      const width = track.scrollWidth;

      // Duplicate the whole unit once more back-to-back for a seamless wrap.
      Array.from(track.children).forEach((n) => track.appendChild(n.cloneNode(true)));

      return width;
    }

    unitWidth = buildUnit();

    let x = 0;
    let lastScrollY = window.scrollY;
    let smoothVelocity = 0;
    let direction = 1;
    let lastTime = performance.now();

    function frame(now) {
      const delta = Math.min(now - lastTime, 50); // ms, clamp for tab-switch jumps
      lastTime = now;

      let velocityFactor = 0;
      if (!prefersReducedMotion) {
        const scrollY = window.scrollY;
        const rawVelocity = (scrollY - lastScrollY) / ((delta || 16) / 1000); // px/sec
        lastScrollY = scrollY;

        // Simple critically-damped-ish smoothing in place of a physical spring.
        smoothVelocity += (rawVelocity - smoothVelocity) * 0.15;

        // Map smoothed scroll velocity to a multiplier, similar to the
        // original's useTransform([0, 1000], [0, 5], { clamp: false }).
        velocityFactor = (smoothVelocity / 1000) * 5;
      }
      // Reduced-motion: skip the scroll-linked speed-up entirely and just
      // drift at a slow constant pace, rather than freezing outright.

      if (velocityFactor < 0) direction = -1;
      else if (velocityFactor > 0) direction = 1;

      let moveBy = direction * baseVelocity * (delta / 1000);
      moveBy += direction * moveBy * velocityFactor;

      x += moveBy;

      // Wrap seamlessly within one duplicated unit.
      if (unitWidth > 0) {
        if (x <= -unitWidth) x += unitWidth;
        if (x > 0) x -= unitWidth;
      }

      track.style.transform = `translateX(${x}px)`;
      requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);

    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        unitWidth = buildUnit();
        x = 0;
        track.style.transform = "translateX(0)";
      }, 150);
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".velocity-row").forEach(initRow);
  });
})();
