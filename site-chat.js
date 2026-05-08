(function () {
  var REDUCE_MOTION = false;
  try {
    REDUCE_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch (e) {}

  var BOT_NAME = "Ruby";

  var PROMPTS = [
    {
      id: "services",
      label: "What does Move Wise do?",
      reply:
        "Move Wise by Miya Wilson focuses on boutique residential redevelopment—quiet acquisitions, disciplined renovation, staging, and resale with discretion. Think calmer houses, clearer numbers, and no “cheap wow.”",
    },
    {
      id: "start",
      label: "How do we get started?",
      reply:
        "Reach out by email with the address (or neighborhood), what you’re trying to solve, and your timing. We’ll ask the impolite questions early—permits, dry rot, real math—before anyone picks up a hammer.",
    },
    {
      id: "process",
      label: "What’s the process like?",
      reply:
        "Three beats: discovery with receipts, build choreography, then reveal & reposition. You’ll always know which room of the project we’re in—no mystery phases.",
    },
    {
      id: "who",
      label: "Who is this for?",
      reply:
        "Brokers with a fragile lead, owners sitting on a tired asset, or anyone who overheard a rumor at Pilates. Whisper or shout—we thrive on both.",
    },
    {
      id: "contact",
      label: "How do I reach you?",
      reply:
        "Email Miya.Wilson@outlook.com from the utility bar or the contact section. That’s the line we watch for real conversations about real houses.",
    },
    {
      id: "tour",
      label: "How do I navigate quickly?",
      reply:
        "Use the top navigation: Agent coaching opens the coaching hub (1-on-1, group, VIP pages), Agent resources opens the Kits page, plus Buying/selling, About, and FAQ.",
    },
  ];

  var root;
  var panel;
  var messagesEl;
  var chipsEl;
  var toggleBtn;
  var nudgeBtn;
  var nudgeTimer;
  var open = false;
  var NUDGE_SESSION_KEY = "mwChatInviteShown";

  function delay(ms, fn) {
    if (REDUCE_MOTION) return fn();
    return window.setTimeout(fn, ms);
  }

  function scrollMessages() {
    if (!messagesEl) return;
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function bubble(text, who) {
    var row = document.createElement("div");
    row.className = "site-chat__row site-chat__row--" + who;
    var b = document.createElement("div");
    b.className = "site-chat__bubble site-chat__bubble--" + who;
    b.textContent = text;
    row.appendChild(b);
    messagesEl.appendChild(row);
    scrollMessages();
  }

  function typingIndicator() {
    var row = document.createElement("div");
    row.className = "site-chat__row site-chat__row--bot";
    row.setAttribute("data-typing", "");
    var t = document.createElement("div");
    t.className = "site-chat__typing";
    t.setAttribute("aria-hidden", "true");
    t.innerHTML = "<span></span><span></span><span></span>";
    row.appendChild(t);
    messagesEl.appendChild(row);
    scrollMessages();
    return row;
  }

  function removeTyping(el) {
    if (el && el.parentNode) el.parentNode.removeChild(el);
  }

  function renderChips() {
    chipsEl.innerHTML = "";
    PROMPTS.forEach(function (p) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "site-chat__chip";
      b.textContent = p.label;
      b.setAttribute("data-prompt-id", p.id);
      chipsEl.appendChild(b);
    });
  }

  function answerFor(id) {
    for (var i = 0; i < PROMPTS.length; i++) {
      if (PROMPTS[i].id === id) return PROMPTS[i].reply;
    }
    return "Pick a topic below and we’ll walk through it together.";
  }

  function onChipClick(ev) {
    var btn = ev.target.closest(".site-chat__chip");
    if (!btn) return;
    var id = btn.getAttribute("data-prompt-id");
    var label = btn.textContent.trim();
    chipsEl.querySelectorAll(".site-chat__chip").forEach(function (c) {
      c.disabled = true;
    });

    bubble(label, "user");

    var typingRow = typingIndicator();
    var responseDelay = REDUCE_MOTION ? 0 : 2200 + Math.floor(Math.random() * 1200);
    delay(responseDelay, function () {
      removeTyping(typingRow);
      bubble(answerFor(id), "bot");
      chipsEl.querySelectorAll(".site-chat__chip").forEach(function (c) {
        c.disabled = false;
      });
    });
  }

  function clearNudgeTimer() {
    if (nudgeTimer) {
      window.clearTimeout(nudgeTimer);
      nudgeTimer = null;
    }
  }

  function hideNudge() {
    if (!nudgeBtn) return;
    nudgeBtn.hidden = true;
    nudgeBtn.setAttribute("aria-hidden", "true");
  }

  function markNudgeConsumed() {
    try {
      window.sessionStorage.setItem(NUDGE_SESSION_KEY, "1");
    } catch (e) {}
    clearNudgeTimer();
    hideNudge();
  }

  function showNudgeIfEligible() {
    if (open) return;
    try {
      if (window.sessionStorage.getItem(NUDGE_SESSION_KEY)) return;
    } catch (e) {}
    if (!nudgeBtn) return;
    nudgeBtn.hidden = false;
    nudgeBtn.setAttribute("aria-hidden", "false");
    try {
      window.sessionStorage.setItem(NUDGE_SESSION_KEY, "1");
    } catch (e) {}
  }

  function scheduleNudgeInvite() {
    clearNudgeTimer();
    nudgeTimer = window.setTimeout(showNudgeIfEligible, 3000);
  }

  function setOpen(isOpen) {
    open = isOpen;
    panel.hidden = !isOpen;
    toggleBtn.setAttribute("aria-expanded", open ? "true" : "false");
    if (open) {
      markNudgeConsumed();
      delay(0, function () {
        var first = panel.querySelector(".site-chat__close, .site-chat__chip");
        if (first) first.focus();
        scrollMessages();
      });
    }
  }

  function build() {
    root = document.createElement("div");
    root.className = "site-chat";
    root.setAttribute("aria-label", "Help and quick answers");

    toggleBtn = document.createElement("button");
    toggleBtn.type = "button";
    toggleBtn.className = "site-chat__toggle";
    toggleBtn.setAttribute("aria-expanded", "false");
    toggleBtn.setAttribute("aria-controls", "site-chat-panel");
    toggleBtn.title = "Open quick answers";
    toggleBtn.innerHTML =
      '<span class="site-chat__toggle-icon" aria-hidden="true">' +
      '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round">' +
      '<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 7.5 7.5 0 0 1 .6-3h.1a8.48 8.48 0 0 1 8.1-6 8.64 8.64 0 0 1 8.3 6.2z"/>' +
      "</svg></span><span class=\"visually-hidden\">Open quick answers</span>";

    nudgeBtn = document.createElement("button");
    nudgeBtn.type = "button";
    nudgeBtn.className = "site-chat__nudge";
    nudgeBtn.hidden = true;
    nudgeBtn.setAttribute("aria-hidden", "true");
    nudgeBtn.setAttribute("aria-label", "Have questions? Open chat with Ruby");
    nudgeBtn.textContent = "Have questions? Tap to chat with Ruby.";

    var fabWrap = document.createElement("div");
    fabWrap.className = "site-chat__fab-wrap";
    fabWrap.appendChild(toggleBtn);
    fabWrap.appendChild(nudgeBtn);

    panel = document.createElement("div");
    panel.id = "site-chat-panel";
    panel.className = "site-chat__panel";
    panel.hidden = true;
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-modal", "true");
    panel.setAttribute("aria-labelledby", "site-chat-title");

    var head = document.createElement("header");
    head.className = "site-chat__head";
    head.innerHTML =
      '<div class="site-chat__avatar" aria-hidden="true">☺</div>' +
      '<div class="site-chat__head-text">' +
      '<p class="site-chat__kicker" id="site-chat-title">' +
      BOT_NAME +
      "</p>" +
      '<p class="site-chat__sub">Ask me anything about Move Wise.</p>' +
      "</div>";

    var closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "site-chat__close";
    closeBtn.setAttribute("aria-label", "Close");
    closeBtn.innerHTML = "&times;";
    head.appendChild(closeBtn);

    messagesEl = document.createElement("div");
    messagesEl.className = "site-chat__messages";
    messagesEl.setAttribute("role", "log");
    messagesEl.setAttribute("aria-live", "polite");
    messagesEl.setAttribute("aria-relevant", "additions");

    chipsEl = document.createElement("div");
    chipsEl.className = "site-chat__chips";
    chipsEl.addEventListener("click", onChipClick);

    panel.appendChild(head);
    panel.appendChild(messagesEl);
    panel.appendChild(chipsEl);

    root.appendChild(fabWrap);
    root.appendChild(panel);
    document.body.appendChild(root);

    nudgeBtn.addEventListener("click", function () {
      markNudgeConsumed();
      setOpen(true);
    });

    toggleBtn.addEventListener("click", function () {
      setOpen(!open);
    });
    closeBtn.addEventListener("click", function () {
      setOpen(false);
    });

    document.addEventListener("keydown", function (ev) {
      if (!open) return;
      if (ev.key === "Escape") {
        ev.preventDefault();
        setOpen(false);
        toggleBtn.focus();
      }
    });

    bubble(
      "Hi, I am Ruby. Tap a topic below and I will help you quickly.",
      "bot"
    );
    renderChips();
    scheduleNudgeInvite();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", build);
  } else {
    build();
  }
})();
