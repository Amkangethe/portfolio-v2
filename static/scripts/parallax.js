(function () {
  const glow1 = document.getElementById("glow-1");
  const glow2 = document.getElementById("glow-2");
  const glow3 = document.getElementById("glow-3");

  if (!glow1 && !glow2 && !glow3) return;

  let tx = window.innerWidth  / 2;
  let ty = window.innerHeight / 2;
  let cx = tx;
  let cy = ty;

  window.addEventListener("mousemove", (e) => {
    tx = e.clientX;
    ty = e.clientY;
  });

  function tick() {
    cx += (tx - cx) * 0.05;
    cy += (ty - cy) * 0.05;

    const nx = cx / (window.innerWidth  || 1) - 0.5;
    const ny = cy / (window.innerHeight || 1) - 0.5;

    if (glow1) glow1.style.transform = `translate(${nx  * 240}px, ${ny  * 240}px)`;
    if (glow2) glow2.style.transform = `translate(${-nx * 200}px, ${-ny * 200}px)`;
    if (glow3) glow3.style.transform = `translate(${nx  * 120}px, ${-ny * 150}px)`;

    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
})();
