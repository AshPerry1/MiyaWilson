(function () {
  var STEPS = [
    {
      id: "tour-entry",
      title: "The front porch",
      text:
        "Start where every showing starts—threshold energy. This is how Move Wise stewards the story before a single hinge turns.",
    },
    {
      id: "tour-hall",
      title: "The gallery hall",
      text:
        "This is where light hits—our rule of thumb once you’re inside. If it doesn’t slow a buyer in the doorway, we keep sanding.",
    },
    {
      id: "tour-workshop",
      title: "The workshop",
      text:
        "Quiet acquisition, disciplined build, deliberate reveal—workflow like floor joists you don’t notice until they matter.",
    },
    {
      id: "work",
      title: "The living spine",
      text:
        "Before and after aren’t garnish here—they’re the same footprint in a braver conversation. That’s the heart of the walk-through.",
    },
    {
      id: "process",
      title: "The rhythm of the house",
      text:
        "Discovery, build, reveal—three beats we repeat until they feel like a second floor you trust under your feet.",
    },
    {
      id: "contact",
      title: "The side door out",
      text:
        "Leave a note, a rumor, or a brief—whisper or shout. The tour ends; the door stays open for your next lead.",
    },
  ];

  var i = 0;
  var root;
  var card;
  var titleEl;
  var textEl;
  var stepLabel;
  var prevBtn;
  var nextBtn;
  var endBtn;
  var activeEl;
  var reduceMotion = false;

  try {
    reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch (e) {}

  function clearFocus() {
    if (activeEl) {
      activeEl.classList.remove("home-tour-focus");
      activeEl = null;
    }
  }

  function scrollToEl(el) {
    if (!el) return;
    el.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "center",
    });
  }

  function renderStep() {
    var step = STEPS[i];
    var el = document.getElementById(step.id);
    clearFocus();
    if (el) {
      activeEl = el;
      el.classList.add("home-tour-focus");
      scrollToEl(el);
    }
    titleEl.textContent = step.title;
    textEl.textContent = step.text;
    stepLabel.textContent = "Stop " + (i + 1) + " of " + STEPS.length;
    prevBtn.disabled = i === 0;
    nextBtn.textContent = i === STEPS.length - 1 ? "Finish tour" : "Next room";
  }

  function openTour() {
    if (!root) buildUI();
    document.body.classList.add("home-tour--active");
    root.hidden = false;
    i = 0;
    renderStep();
    try {
      history.replaceState({}, "", window.location.pathname + window.location.hash);
    } catch (e) {}
    nextBtn.focus();
  }

  function closeTour() {
    clearFocus();
    document.body.classList.remove("home-tour--active");
    if (root) root.hidden = true;
  }

  function next() {
    if (i < STEPS.length - 1) {
      i += 1;
      renderStep();
    } else {
      closeTour();
    }
  }

  function prev() {
    if (i > 0) {
      i -= 1;
      renderStep();
    }
  }

  function buildUI() {
    root = document.createElement("div");
    root.className = "home-tour";
    root.setAttribute("role", "dialog");
    root.setAttribute("aria-modal", "true");
    root.setAttribute("aria-labelledby", "home-tour-dialog-title");
    root.hidden = true;

    card = document.createElement("div");
    card.className = "home-tour__card";

    stepLabel = document.createElement("p");
    stepLabel.className = "home-tour__step";
    stepLabel.setAttribute("aria-live", "polite");

    titleEl = document.createElement("h2");
    titleEl.className = "home-tour__title";
    titleEl.id = "home-tour-dialog-title";

    textEl = document.createElement("p");
    textEl.className = "home-tour__text";

    var actions = document.createElement("div");
    actions.className = "home-tour__actions";

    endBtn = document.createElement("button");
    endBtn.type = "button";
    endBtn.className = "home-tour__btn home-tour__btn--ghost";
    endBtn.textContent = "End tour";
    endBtn.addEventListener("click", closeTour);

    prevBtn = document.createElement("button");
    prevBtn.type = "button";
    prevBtn.className = "home-tour__btn home-tour__btn--ghost";
    prevBtn.textContent = "Previous";
    prevBtn.addEventListener("click", prev);

    nextBtn = document.createElement("button");
    nextBtn.type = "button";
    nextBtn.className = "home-tour__btn home-tour__btn--primary";
    nextBtn.addEventListener("click", next);

    actions.appendChild(endBtn);
    actions.appendChild(prevBtn);
    actions.appendChild(nextBtn);

    card.appendChild(stepLabel);
    card.appendChild(titleEl);
    card.appendChild(textEl);
    card.appendChild(actions);
    root.appendChild(card);
    document.body.appendChild(root);

    document.addEventListener("keydown", function (ev) {
      if (!root || root.hidden) return;
      if (ev.key === "Escape") {
        ev.preventDefault();
        closeTour();
      }
    });
  }

  document.addEventListener("click", function (e) {
    if (e.target.closest("[data-home-tour]")) {
      e.preventDefault();
      openTour();
    }
  });

  function maybeAutoStart() {
    try {
      var q = new URLSearchParams(window.location.search).get("homeTour");
      if (q === "1") {
        openTour();
        try {
          history.replaceState({}, "", window.location.pathname + window.location.hash);
        } catch (e2) {}
      }
    } catch (e3) {}
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", maybeAutoStart);
  } else {
    maybeAutoStart();
  }
})();
