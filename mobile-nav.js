(() => {
  const headers = document.querySelectorAll(".site-header--broker");

  headers.forEach((header) => {
    const toggle = header.querySelector(".nav-toggle");
    const nav = header.querySelector(".nav--broker");
    if (!toggle || !nav) return;

    const closeMenu = () => {
      header.classList.remove("nav-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open navigation menu");
    };

    const openMenu = () => {
      header.classList.add("nav-open");
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "Close navigation menu");
    };

    toggle.addEventListener("click", () => {
      const isOpen = header.classList.contains("nav-open");
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("click", (event) => {
      if (!header.contains(event.target)) {
        closeMenu();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 720) {
        closeMenu();
      }
    });
  });
})();
