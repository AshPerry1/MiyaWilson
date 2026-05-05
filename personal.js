(function () {
  const STORAGE_KEY = "miyaVisitorProfile";

  /** @returns {{ name: string, gender: string, age: number } | null} */
  function loadProfile() {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const p = JSON.parse(raw);
      if (
        !p ||
        typeof p.name !== "string" ||
        typeof p.gender !== "string" ||
        typeof p.age !== "number"
      ) {
        return null;
      }
      return p;
    } catch {
      return null;
    }
  }

  function saveProfile(profile) {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  }

  function firstName(full) {
    const t = (full || "").trim();
    if (!t) return "friend";
    const part = t.split(/\s+/)[0];
    return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
  }

  function ageBand(age) {
    if (age < 35) return "age-young";
    if (age < 55) return "age-mid";
    return "age-mature";
  }

  function vibeClass(gender) {
    const map = {
      woman: "vibe-woman",
      man: "vibe-man",
      nonbinary: "vibe-nb",
      "prefer-not": "vibe-neutral",
    };
    return map[gender] || "vibe-neutral";
  }

  function applyBodyTheme(profile) {
    document.body.classList.remove(
      "vibe-woman",
      "vibe-man",
      "vibe-nb",
      "vibe-neutral",
      "age-young",
      "age-mid",
      "age-mature",
      "is-personalized"
    );
    document.body.classList.add(vibeClass(profile.gender), ageBand(profile.age), "is-personalized");
  }

  function fillNames(displayName) {
    document.querySelectorAll("[data-p-name]").forEach(function (el) {
      el.textContent = displayName;
    });
  }

  function setGateVisible(show) {
    const gate = document.getElementById("vibe-gate");
    if (!gate) return;
    gate.classList.toggle("vibe-gate--hidden", !show);
    gate.setAttribute("aria-hidden", show ? "false" : "true");
    document.body.classList.toggle("vibe-gate-open", show);
    if (show) {
      const focusEl = gate.querySelector("input, select, button");
      if (focusEl) focusEl.focus();
    }
  }

  function initFromProfile(profile) {
    const display = firstName(profile.name);
    applyBodyTheme(profile);
    fillNames(display);
    document.documentElement.classList.add("vibe-skip-gate");
    const titleEl = document.querySelector("title");
    if (titleEl) {
      titleEl.textContent = "Miya Wilson · Home Transformations · " + display;
    }
    setGateVisible(false);
  }

  function initGate() {
    const form = document.getElementById("vibe-form");
    if (!form) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const fd = new FormData(form);
      const name = String(fd.get("name") || "").trim();
      const gender = String(fd.get("gender") || "");
      const age = parseInt(String(fd.get("age") || "0"), 10);

      if (!name || !gender || !Number.isFinite(age) || age < 13 || age > 120) {
        return;
      }

      const profile = { name, gender, age };
      saveProfile(profile);
      initFromProfile(profile);
    });
  }

  function initReset() {
    document.querySelectorAll("[data-reset-vibe]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        sessionStorage.removeItem(STORAGE_KEY);
        window.location.reload();
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initGate();
    initReset();

    const existing = loadProfile();
    if (existing) {
      initFromProfile(existing);
    } else {
      setGateVisible(true);
    }
  });
})();
