(function () {
  "use strict";

  var figure = document.getElementById("ba");
  var handle = document.getElementById("baHandle");
  var hint = document.getElementById("hint");
  if (!figure || !handle) return;

  var beforeLabel = figure.querySelector(".ba__label--before");
  var afterLabel = figure.querySelector(".ba__label--after");

  var pos = 50;
  var dragging = false;
  var interacted = false;

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function setPosition(next) {
    pos = clamp(next, 0, 100);
    var rounded = Math.round(pos);

    figure.style.setProperty("--pos", pos + "%");
    handle.setAttribute("aria-valuenow", String(rounded));
    handle.setAttribute(
      "aria-valuetext",
      rounded + "% before, " + (100 - rounded) + "% after"
    );

    if (beforeLabel) {
      beforeLabel.style.opacity = pos < 14 ? clamp(pos / 14, 0, 1) : 1;
    }
    if (afterLabel) {
      afterLabel.style.opacity = pos > 86 ? clamp((100 - pos) / 14, 0, 1) : 1;
    }
  }

  function percentFromClientX(clientX) {
    var rect = figure.getBoundingClientRect();
    if (rect.width === 0) return pos;
    return ((clientX - rect.left) / rect.width) * 100;
  }

  function dismissHint() {
    if (interacted || !hint) return;
    interacted = true;
    hint.style.transition = "opacity 0.4s ease";
    hint.style.opacity = "0.45";
  }

  figure.addEventListener("pointerdown", function (event) {
    dragging = true;
    figure.classList.add("is-dragging");
    figure.setPointerCapture(event.pointerId);
    setPosition(percentFromClientX(event.clientX));
    dismissHint();
    event.preventDefault();
  });

  figure.addEventListener("pointermove", function (event) {
    if (!dragging) return;
    setPosition(percentFromClientX(event.clientX));
  });

  function endDrag() {
    if (!dragging) return;
    dragging = false;
    figure.classList.remove("is-dragging");
  }

  figure.addEventListener("pointerup", endDrag);
  figure.addEventListener("pointercancel", endDrag);

  handle.addEventListener("keydown", function (event) {
    var step = event.shiftKey ? 10 : 2;
    var handled = true;

    switch (event.key) {
      case "ArrowLeft":
      case "ArrowDown":
        setPosition(pos - step);
        break;
      case "ArrowRight":
      case "ArrowUp":
        setPosition(pos + step);
        break;
      case "Home":
        setPosition(0);
        break;
      case "End":
        setPosition(100);
        break;
      default:
        handled = false;
    }

    if (handled) {
      event.preventDefault();
      dismissHint();
    }
  });

  // Keep the divider aligned if the viewport changes while focused.
  window.addEventListener("resize", function () {
    setPosition(pos);
  });

  // ---- Scene picker: swap the compared pair without touching the slider ----
  var imgBefore = document.getElementById("imgBefore");
  var imgAfter = document.getElementById("imgAfter");
  var caption = document.getElementById("caption");
  var scenes = Array.prototype.slice.call(document.querySelectorAll(".scene"));

  scenes.forEach(function (btn) {
    [btn.dataset.before, btn.dataset.after].forEach(function (src) {
      var img = new Image();
      img.src = src;
    });
  });

  function selectScene(btn) {
    if (!btn || !imgBefore || !imgAfter) return;
    var title = btn.dataset.title || "";

    imgBefore.src = btn.dataset.before;
    imgAfter.src = btn.dataset.after;
    imgBefore.alt = title + " before renovation";
    imgAfter.alt = title + " after renovation";
    if (caption) caption.textContent = title;

    scenes.forEach(function (other) {
      var active = other === btn;
      other.classList.toggle("is-active", active);
      if (active) other.setAttribute("aria-current", "true");
      else other.removeAttribute("aria-current");
    });
  }

  scenes.forEach(function (btn) {
    btn.addEventListener("click", function () {
      selectScene(btn);
    });
  });

  setPosition(pos);
})();

// ---- Progress gallery: auto-fill from images/progress-1, -2, ... ----
(function () {
  var section = document.getElementById("progress");
  var grid = document.getElementById("progressGrid");
  if (!section || !grid) return;

  var MAX_PHOTOS = 12; // raise this if you add more than 12 progress photos
  var EXTS = ["jpg", "JPG"]; // phone exports are often uppercase; accept either
  var slots = [];
  var settled = 0;

  function reveal() {
    if (++settled < MAX_PHOTOS) return;
    var any = false;
    slots.forEach(function (fig) {
      if (!fig) return;
      grid.appendChild(fig);
      any = true;
    });
    if (any) section.hidden = false;
  }

  function makeFigure(n, src) {
    var fig = document.createElement("figure");
    fig.className = "shot";
    var img = document.createElement("img");
    img.src = src;
    img.alt = "Renovation in progress " + n;
    img.loading = "lazy";
    img.decoding = "async";
    fig.appendChild(img);
    return fig;
  }

  function loadSlot(n) {
    var ext = 0;
    (function tryNext() {
      if (ext >= EXTS.length) {
        reveal(); // no file for this number in any supported case
        return;
      }
      var src = "images/progress-" + n + "." + EXTS[ext++];
      var probe = new Image();
      probe.onload = function () {
        slots[n - 1] = makeFigure(n, src);
        reveal();
      };
      probe.onerror = tryNext;
      probe.src = src;
    })();
  }

  for (var i = 1; i <= MAX_PHOTOS; i++) loadSlot(i);
})();
