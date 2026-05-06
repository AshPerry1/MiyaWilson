(function () {
  var STEPS = [
    {
      id: "tour-entry",
      title: "Glad you’re here",
      text:
        "Tiny guided spin through the site—no quizzes, no jargon map. Hit Next whenever you’re ready for the next beat.",
    },
    {
      id: "tour-hall",
      title: "Our favorite soapbox",
      text:
        "We’re allergic to ‘cheap wow.’ If a buyer doesn’t slow down in the doorway, we keep fussing until they do.",
    },
    {
      id: "tour-workshop",
      title: "What we actually do",
      text:
        "Buy quiet, renovate loud only where it earns out, stage with a light hand—then resell with receipts instead of adjectives.",
    },
    {
      id: "work",
      title: "Receipts, not flexing",
      text:
        "Before and after share the same footprint here—same bones, braver story. It’s the shortest path to ‘oh, I get it.’",
    },
    {
      id: "process",
      title: "Always three beats",
      text:
        "Discovery, build, reveal—repeat until it’s almost boring in the best way. You always know which chapter we’re in.",
    },
    {
      id: "contact",
      title: "Now the fun part",
      text:
        "That was the highlights reel. Got a lead, a rumor, or a tired house? Whisper or shout—we read the real mail.",
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
    stepLabel.textContent = "Spin " + (i + 1) + " · " + STEPS.length;
    prevBtn.disabled = i === 0;
    nextBtn.textContent = i === STEPS.length - 1 ? "That’s the tour" : "Next";
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
    endBtn.textContent = "Exit";
    endBtn.addEventListener("click", closeTour);

    prevBtn = document.createElement("button");
    prevBtn.type = "button";
    prevBtn.className = "home-tour__btn home-tour__btn--ghost";
    prevBtn.textContent = "Back";
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
    var trigger = e.target.closest("[data-home-tour]");
    if (!trigger) return;
    var onHome = !!document.getElementById("tour-entry");
    if (onHome) {
      e.preventDefault();
      openTour();
      return;
    }
    if (trigger.tagName !== "A" || !trigger.getAttribute("href")) {
      e.preventDefault();
      window.location.href = "index.html?homeTour=1";
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
