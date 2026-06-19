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

  setPosition(pos);
})();
