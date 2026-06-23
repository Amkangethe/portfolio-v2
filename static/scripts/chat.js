(function () {
  var log     = document.getElementById("chat-log");
  var empty   = document.getElementById("chat-empty");
  var input   = document.getElementById("chat-input");
  var sendBtn = document.getElementById("chat-send");

  if (!log || !input || !sendBtn) return;

  var isTyping = false;

  // ── Styles ──────────────────────────────────────────────────────────────────
  var S = {
    rowUser: "display:flex;justify-content:flex-end;",
    rowAsst: "display:flex;justify-content:flex-start;",
    bubbleUser: [
      "max-width:78%;padding:10px 14px;",
      "border-radius:16px 16px 4px 16px;",
      "background:oklch(0.28 0.018 255);",
      "color:oklch(0.94 0.006 255);",
      "font-size:13.5px;line-height:1.55;",
    ].join(""),
    bubbleAsst: [
      "max-width:82%;padding:10px 14px;",
      "border-radius:16px 16px 16px 4px;",
      "background:oklch(0.22 0.013 255);",
      "border:1px solid oklch(0.3 0.014 255);",
      "color:oklch(0.90 0.006 255);",
      "font-size:13.5px;line-height:1.55;",
    ].join(""),
  };

  // ── Helpers ─────────────────────────────────────────────────────────────────
  function hideEmpty() {
    if (empty) empty.style.display = "none";
  }

  function scrollBottom() {
    log.scrollTop = log.scrollHeight;
  }

  function addBubble(text, isUser) {
    hideEmpty();
    var row    = document.createElement("div");
    var bubble = document.createElement("div");
    row.style.cssText    = isUser ? S.rowUser    : S.rowAsst;
    bubble.style.cssText = isUser ? S.bubbleUser : S.bubbleAsst;
    bubble.textContent   = text;
    row.appendChild(bubble);
    log.appendChild(row);
    scrollBottom();
    return bubble;
  }

  function showTyping() {
    hideEmpty();
    var row    = document.createElement("div");
    var bubble = document.createElement("div");
    row.id             = "chat-typing";
    row.style.cssText  = S.rowAsst;
    bubble.style.cssText = S.bubbleAsst + "display:flex;gap:5px;align-items:center;padding:12px 14px;";
    for (var i = 0; i < 3; i++) {
      var dot = document.createElement("span");
      dot.style.cssText = [
        "width:5px;height:5px;border-radius:50%;display:inline-block;",
        "background:oklch(0.82 0.13 195);",
        "animation:scdot 1.2s ease " + (i * 0.15) + "s infinite;",
      ].join("");
      bubble.appendChild(dot);
    }
    row.appendChild(bubble);
    log.appendChild(row);
    scrollBottom();
  }

  function removeTyping() {
    var t = document.getElementById("chat-typing");
    if (t) t.remove();
  }

  // ── Send with streaming ──────────────────────────────────────────────────────
  async function send(overrideText) {
    var text = (overrideText !== undefined ? overrideText : input.value).trim();
    if (!text || isTyping) return;

    isTyping = true;
    input.value = "";
    addBubble(text, true);
    showTyping();

    try {
      var r = await fetch("/api/assistant/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      if (!r.ok) throw new Error("HTTP " + r.status);

      var reader  = r.body.getReader();
      var decoder = new TextDecoder();
      var buffer  = "";
      var bubble  = null; // created on first chunk

      while (true) {
        var result = await reader.read();
        if (result.done) break;

        buffer += decoder.decode(result.value, { stream: true });

        // SSE lines are separated by double newline
        var parts = buffer.split("\n\n");
        buffer = parts.pop(); // keep any incomplete trailing chunk

        for (var i = 0; i < parts.length; i++) {
          var line = parts[i].trim();
          if (!line.startsWith("data:")) continue;

          var payload = line.slice(5).trim();
          if (payload === "[DONE]") break;

          try {
            var parsed = JSON.parse(payload);
            if (parsed.chunk) {
              if (!bubble) {
                removeTyping();
                bubble = addBubble("", false);
              }
              bubble.textContent += parsed.chunk;
              scrollBottom();
            }
          } catch (_) {}
        }
      }

      // Fallback if stream ended with no content
      if (!bubble) {
        removeTyping();
        addBubble("Sorry, I didn't get a response.", false);
      }

    } catch (_) {
      removeTyping();
      addBubble("Couldn't reach the assistant right now — try again in a moment.", false);
    } finally {
      isTyping = false;
    }
  }

  // ── Events ───────────────────────────────────────────────────────────────────
  sendBtn.addEventListener("click", function () { send(); });

  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  });

  document.querySelectorAll("[data-dc-tpl='56']").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var label = btn.querySelector(".sc-interp");
      send(label ? label.textContent.trim() : btn.textContent.trim());
    });
  });
})();
