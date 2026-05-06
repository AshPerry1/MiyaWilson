(function () {
  function reveal(el) {
    el.classList.add("lux-reveal--in");
    el.removeAttribute("data-lux-hidden");
  }

  function revealAll() {
    document.querySelectorAll(".lux-reveal").forEach(reveal);
  }

  try {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      revealAll();
      return;
    }
  } catch (e) {}

  if (!window.IntersectionObserver) {
    revealAll();
    return;
  }

  document.querySelectorAll(".lux-reveal").forEach(function (el) {
    el.setAttribute("data-lux-hidden", "");
  });

  var obs = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting || (e.intersectionRatio > 0 && e.boundingClientRect.height > 0)) {
          reveal(e.target);
          obs.unobserve(e.target);
        }
      });
    },
    { rootMargin: "0px 0px 0px 0px", threshold: [0, 0.01] }
  );

  document.querySelectorAll(".lux-reveal").forEach(function (el) {
    obs.observe(el);
  });

  /* Guarantee above-the-fold blocks are never stuck hidden (IO quirks, slow paint). */
  function kickVisible() {
    document.querySelectorAll(".lux-reveal").forEach(function (el) {
      if (el.classList.contains("lux-reveal--in")) return;
      var r = el.getBoundingClientRect();
      if (r.height > 0 && r.top < window.innerHeight && r.bottom > 0) {
        reveal(el);
        try {
          obs.unobserve(el);
        } catch (ignore) {}
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      requestAnimationFrame(function () {
        kickVisible();
      });
    });
  } else {
    requestAnimationFrame(kickVisible);
  }

  window.addEventListener(
    "load",
    function () {
      kickVisible();
      setTimeout(kickVisible, 100);
      setTimeout(kickVisible, 800);
    },
    { once: true }
  );
})();
