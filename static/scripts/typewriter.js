(function () {
  const phrases = [
    "AI Enthusiast.",
    "Software Engineer.",
    "Master's Student.",
    "Tech Lover.",
  ];

  const el = document.getElementById("typewriter-text");
  if (!el) return;

  const TYPE_SPEED   = 65;
  const DELETE_SPEED = 35;
  const PAUSE_END    = 1800;
  const PAUSE_START  = 400;

  let phraseIdx = 0;
  let charIdx   = 0;
  let deleting  = false;

  function tick() {
    const phrase = phrases[phraseIdx];

    if (!deleting) {
      charIdx++;
      el.textContent = phrase.slice(0, charIdx);
      if (charIdx === phrase.length) {
        deleting = true;
        setTimeout(tick, PAUSE_END);
        return;
      }
    } else {
      charIdx--;
      el.textContent = phrase.slice(0, charIdx);
      if (charIdx === 0) {
        deleting  = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        setTimeout(tick, PAUSE_START);
        return;
      }
    }

    setTimeout(tick, deleting ? DELETE_SPEED : TYPE_SPEED);
  }

  tick();
})();
