(function () {
  if (!window.IntersectionObserver) return;

  document.querySelectorAll(".lux-reveal").forEach(function (el) {
    el.setAttribute("data-lux-hidden", "");
  });

  var obs = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add("lux-reveal--in");
        obs.unobserve(e.target);
      });
    },
    { rootMargin: "0px 0px -12% 0px", threshold: 0.08 }
  );

  document.querySelectorAll(".lux-reveal").forEach(function (el) {
    obs.observe(el);
  });

  try {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.querySelectorAll(".lux-reveal").forEach(function (el) {
        el.classList.add("lux-reveal--in");
      });
    }
  } catch (e) {}
})();
