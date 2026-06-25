(function () {
  const SECTIONS = ["top", "about", "projects", "contact"];
  const ACTIVE_BG = "oklch(0.31 0.018 255)";
  const ACTIVE_COLOR = "oklch(0.97 0.006 255)";
  const INACTIVE_COLOR = "oklch(0.66 0.012 255)";

  function setActive(activeId) {
    document.querySelectorAll("a[href^='#']").forEach((link) => {
      const target = link.getAttribute("href").replace("#", "");
      if (!SECTIONS.includes(target)) return;
      if (target === activeId) {
        link.style.background = ACTIVE_BG;
        link.style.color = ACTIVE_COLOR;
        link.style.fontWeight = "600";
      } else {
        link.style.background = "transparent";
        link.style.color = INACTIVE_COLOR;
        link.style.fontWeight = "";
      }
    });
  }

  function onScroll() {
    const atBottom = window.innerHeight + window.scrollY >= document.body.scrollHeight - 60;
    if (atBottom) { setActive("contact"); return; }

    let active = SECTIONS[0];
    for (const id of SECTIONS) {
      const el = document.getElementById(id);
      if (el && el.getBoundingClientRect().top <= 140) active = id;
    }
    setActive(active);
  }

  // Intercept all anchor clicks to scroll without putting # in the URL
  document.addEventListener("click", function (e) {
    const link = e.target.closest("a[href^='#']");
    if (!link) return;
    const id = link.getAttribute("href").replace("#", "");
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth" });
    history.replaceState(null, "", window.location.pathname);
  });

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("DOMContentLoaded", onScroll);
  onScroll();
})();
