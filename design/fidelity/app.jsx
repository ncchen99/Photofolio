/* App — handles routing between home and album views */
const { useState: useStateApp, useEffect: useEffectApp } = React;

function App() {
  const [route, setRoute] = useStateApp({ name: "home", albumId: null });
  const [transitioning, setTransitioning] = useStateApp(false);

  const goTo = (next) => {
    setTransitioning(true);
    setTimeout(() => {
      setRoute(next);
      window.scrollTo(0, 0);
      setTimeout(() => setTransitioning(false), 60);
    }, 480);
  };

  // browser back support via hash
  useEffectApp(() => {
    const apply = () => {
      const h = window.location.hash.replace("#", "");
      if (h.startsWith("album/")) {
        setRoute({ name: "album", albumId: h.split("/")[1] });
      } else {
        setRoute({ name: "home", albumId: null });
      }
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", apply);
    apply();
    return () => window.removeEventListener("hashchange", apply);
  }, []);

  const openAlbum = (id) => {
    goTo({ name: "album", albumId: id });
    history.pushState(null, "", `#album/${id}`);
  };
  const backHome = () => {
    goTo({ name: "home", albumId: null });
    history.pushState(null, "", "#");
  };

  return (
    <React.Fragment>
      <Cursor />
      <Transition active={transitioning} />
      <div key={route.name + (route.albumId || "")}>
        {route.name === "home" ? (
          <Home onOpen={openAlbum} />
        ) : (
          <Album albumId={route.albumId} onBack={backHome} onOpenAlbum={openAlbum} />
        )}
      </div>
    </React.Fragment>
  );
}

/* Page transition — paper sweep with film-burn flash */
function Transition({ active }) {
  return (
    <React.Fragment>
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9990,
          background: "var(--ink)",
          transform: active ? "translateY(0)" : "translateY(100%)",
          transition: "transform .55s cubic-bezier(.78,.02,.22,1)",
          pointerEvents: "none",
        }}
      ></div>
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9991,
          background: "radial-gradient(circle at 50% 60%, rgba(255,180,80,0.55), transparent 55%)",
          opacity: active ? 0.8 : 0,
          transition: "opacity .25s ease",
          pointerEvents: "none",
          mixBlendMode: "screen",
        }}
      ></div>
      <div
        style={{
          position: "fixed",
          top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 9992,
          color: "var(--paper)",
          fontFamily: "var(--f-mono)",
          fontSize: 11,
          letterSpacing: "0.4em",
          textTransform: "uppercase",
          opacity: active ? 1 : 0,
          transition: "opacity .35s",
          pointerEvents: "none",
        }}
      >
        — turning the page —
      </div>
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
