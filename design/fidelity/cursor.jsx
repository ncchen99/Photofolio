/* Custom cursor — small ink dot + ring with label
   Use data-cursor="view" | "back" | "open" on any hoverable */
const { useEffect, useRef } = React;

function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx, ry = my;
    let dx = mx, dy = my;
    let raf;

    const onMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
    };
    const onDown = () => ring.classList.add("down");
    const onUp = () => ring.classList.remove("down");

    const onOver = (e) => {
      const el = e.target.closest("[data-cursor]");
      ring.classList.remove("hover", "view", "back", "open");
      dot.classList.remove("hover");
      if (el) {
        const kind = el.getAttribute("data-cursor") || "view";
        ring.classList.add("hover", kind);
        dot.classList.add("hover");
      }
    };

    const tick = () => {
      // ring lags slightly
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      // dot snaps
      dx += (mx - dx) * 0.6;
      dy += (my - dy) * 0.6;
      dot.style.transform = `translate(${dx}px, ${dy}px) translate(-50%, -50%)`;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };
    tick();

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.addEventListener("mouseover", onOver);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.removeEventListener("mouseover", onOver);
    };
  }, []);

  return (
    <React.Fragment>
      <div ref={dotRef} className="cursor-dot"></div>
      <div ref={ringRef} className="cursor-ring"></div>
    </React.Fragment>
  );
}

/* Reveal-on-scroll hook */
function useReveal(deps = []) {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal:not(.in)");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
    // eslint-disable-next-line
  }, deps);
}

window.Cursor = Cursor;
window.useReveal = useReveal;
