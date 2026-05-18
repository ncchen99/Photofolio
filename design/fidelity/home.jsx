/* Home page — Hero (bio + social) + magazine-style album list */
const { useEffect: useEffectH, useState: useStateH, useRef: useRefH } = React;

const homeStyles = {
  page: {
    minHeight: "100vh",
    padding: "0",
    position: "relative",
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "26px 48px 0",
    fontFamily: "var(--f-mono)",
    fontSize: "11px",
    letterSpacing: "0.22em",
    textTransform: "uppercase",
    color: "var(--ink-mute)",
  },
  topDivider: {
    height: 1,
    background: "var(--rule)",
    margin: "20px 48px 0",
  },
};

function Home({ onOpen }) {
  const albums = window.ALBUMS;
  const bio = window.BIO;
  const [scrollHint, setScrollHint] = useStateH(true);

  window.useReveal();

  useEffectH(() => {
    const onScroll = () => setScrollHint(window.scrollY < 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="page-enter" style={homeStyles.page} data-screen-label="01 Home">
      {/* top bar */}
      <div style={homeStyles.topBar}>
        <span>Nien-Cheng Chen · Photofolio</span>
        <span>Vol. <span style={{color:"var(--ink)"}}>VII</span> — MMXXV / MMXXVI</span>
        <span>23°N · 120°E · Tainan</span>
      </div>
      <div style={homeStyles.topDivider}></div>

      <Hero bio={bio} />

      {/* Index strip before albums */}
      <IndexStrip albums={albums} onOpen={onOpen} />

      <AlbumList albums={albums} onOpen={onOpen} />

      <Colophon />

      {/* scroll hint */}
      <div
        style={{
          position: "fixed",
          right: 28,
          bottom: 22,
          fontFamily: "var(--f-mono)",
          fontSize: 10,
          letterSpacing: "0.25em",
          color: "var(--ink-mute)",
          opacity: scrollHint ? 1 : 0,
          transition: "opacity .4s",
          textTransform: "uppercase",
          writingMode: "vertical-rl",
          transform: "rotate(180deg)",
        }}
      >
        scroll ↓
      </div>
    </div>
  );
}

/* ============== HERO ============== */
function Hero({ bio }) {
  return (
    <section style={{ padding: "60px 48px 90px", position: "relative" }}>
      {/* corner ID number */}
      <div className="mono" style={{ position: "absolute", top: 60, right: 48 }}>
        N° 001 / Folio · Cover
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.05fr 1fr", gap: 80, alignItems: "end" }}>
        {/* Left: name + intro */}
        <div className="reveal">
          <div className="mono" style={{ marginBottom: 28 }}>
            Photographer based in — {bio.location}
          </div>

          <h1
            style={{
              margin: 0,
              fontFamily: "var(--f-serif)",
              fontWeight: 400,
              fontSize: "clamp(72px, 11vw, 168px)",
              lineHeight: 0.92,
              letterSpacing: "-0.02em",
              color: "var(--ink)",
            }}
          >
            念誠
            <span
              style={{
                display: "block",
                fontStyle: "italic",
                fontSize: "0.46em",
                marginTop: 6,
                color: "var(--ink-soft)",
              }}
            >
              Nien-Cheng,
              <span className="hand" style={{ fontSize: "1.7em", marginLeft: 14, verticalAlign: "-0.18em" }}>
                {" "}with a camera.
              </span>
            </span>
          </h1>

          <div
            style={{
              marginTop: 44,
              display: "flex",
              alignItems: "center",
              gap: 18,
              flexWrap: "wrap",
            }}
          >
            {bio.tags.map((t, i) => (
              <React.Fragment key={t}>
                <span
                  style={{
                    fontFamily: "var(--f-serif)",
                    fontStyle: "italic",
                    fontSize: 22,
                    color: "var(--ink)",
                  }}
                >
                  {t}
                </span>
                {i < bio.tags.length - 1 && (
                  <span style={{ color: "var(--rust)", fontFamily: "var(--f-mono)", fontSize: 14 }}>✦</span>
                )}
              </React.Fragment>
            ))}
          </div>

          <div
            style={{
              marginTop: 38,
              maxWidth: 520,
              fontFamily: "var(--f-tc)",
              fontSize: 17,
              lineHeight: 1.85,
              color: "var(--ink-soft)",
            }}
          >
            {bio.intro.map((line, i) => (
              <p key={i} style={{ margin: "0 0 10px" }}>{line}</p>
            ))}
          </div>
        </div>

        {/* Right: avatar polaroid + stamp + social */}
        <div className="reveal" style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 36 }}>
          <Avatar />

          <SocialList items={bio.social} />
        </div>
      </div>
    </section>
  );
}

function Avatar() {
  return (
    <div
      style={{
        position: "relative",
        background: "var(--paper-soft)",
        padding: "16px 16px 56px",
        boxShadow: "0 18px 30px -20px rgba(40,30,20,0.45), 0 1px 0 rgba(255,255,255,0.6) inset",
        transform: "rotate(2.4deg)",
        width: 280,
      }}
    >
      <div
        style={{
          width: "100%",
          aspectRatio: "1 / 1.18",
          overflow: "hidden",
          position: "relative",
          background: "#3a2e22",
          animation: "slowZoom 14s ease-out both",
        }}
      >
        <img
          src="https://images.unsplash.com/photo-1502323777036-f29e3972d82f?w=900&q=80"
          alt="陳念誠"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "sepia(0.18) contrast(0.96) saturate(0.92)",
          }}
        />
        {/* subtle film overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg, rgba(255,200,140,0.10), transparent 30%, rgba(60,30,10,0.16) 100%)",
            pointerEvents: "none",
          }}
        ></div>
      </div>
      <div
        className="hand"
        style={{
          position: "absolute",
          bottom: 12,
          left: 22,
          fontSize: 28,
          color: "var(--ink-soft)",
          transform: "rotate(-2deg)",
        }}
      >
        — N.C., self portrait '24
      </div>
      <div
        className="stamp"
        style={{
          position: "absolute",
          top: -16,
          right: -22,
          background: "var(--paper-soft)",
        }}
      >
        Roll 028 · Frame 14
      </div>
    </div>
  );
}

function SocialList({ items }) {
  return (
    <div style={{ width: "min(380px, 100%)" }}>
      <div className="mono" style={{ marginBottom: 14 }}>Find me elsewhere</div>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, borderTop: "1px solid var(--rule)" }}>
        {items.map((s) => (
          <li key={s.label} style={{ borderBottom: "1px solid var(--rule)" }}>
            <a
              href={s.href}
              data-cursor="open"
              className="social-row"
              style={{
                display: "flex",
                alignItems: "baseline",
                justifyContent: "space-between",
                padding: "14px 4px",
                fontFamily: "var(--f-serif)",
                fontSize: 19,
                color: "var(--ink)",
                position: "relative",
              }}
            >
              <span>{s.label}</span>
              <span style={{ fontFamily: "var(--f-mono)", fontSize: 12, color: "var(--ink-mute)", letterSpacing: "0.06em" }}>
                {s.handle} ↗
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ============== INDEX STRIP ============== */
function IndexStrip({ albums, onOpen }) {
  return (
    <section style={{ padding: "0 48px", marginBottom: 80 }} className="reveal">
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          borderTop: "1px solid var(--rule)",
          borderBottom: "1px solid var(--rule)",
          padding: "22px 0 24px",
        }}
      >
        <div>
          <div className="mono" style={{ marginBottom: 6 }}>Section II</div>
          <div
            style={{
              fontFamily: "var(--f-serif)",
              fontSize: 44,
              fontStyle: "italic",
              lineHeight: 1,
              color: "var(--ink)",
            }}
          >
            Selected Works,
            <span className="hand" style={{ marginLeft: 12, fontSize: 36, color: "var(--rust)" }}>
              twenty-three onwards.
            </span>
          </div>
        </div>
        <div
          className="mono"
          style={{
            textAlign: "right",
            color: "var(--ink-mute)",
            lineHeight: 1.7,
          }}
        >
          <div>{albums.length.toString().padStart(2, "0")} albums</div>
          <div>{albums.reduce((n, a) => n + a.photos.length, 0)} frames</div>
          <div>2023 — 2025</div>
        </div>
      </div>

      {/* horizontal index list */}
      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: "18px 0 0",
          display: "grid",
          gridTemplateColumns: `repeat(${albums.length}, 1fr)`,
          gap: 0,
          borderBottom: "1px solid var(--rule)",
        }}
      >
        {albums.map((a) => (
          <li key={a.id}>
            <button
              onClick={() => onOpen(a.id)}
              data-cursor="view"
              style={{
                width: "100%",
                textAlign: "left",
                padding: "14px 14px 16px",
                display: "block",
                borderRight: "1px solid var(--rule)",
              }}
              className="index-row"
            >
              <div className="mono" style={{ marginBottom: 6 }}>N°{a.no}</div>
              <div
                style={{
                  fontFamily: "var(--f-tc)",
                  fontSize: 15,
                  color: "var(--ink)",
                  lineHeight: 1.3,
                }}
              >
                {a.title}
              </div>
              <div
                style={{
                  fontFamily: "var(--f-serif)",
                  fontStyle: "italic",
                  fontSize: 13,
                  color: "var(--ink-mute)",
                  marginTop: 2,
                }}
              >
                {a.titleEn}
              </div>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ============== ALBUM LIST ============== */
function AlbumList({ albums, onOpen }) {
  return (
    <section style={{ padding: "0 48px 120px" }}>
      {albums.map((a, i) => (
        <AlbumRow key={a.id} album={a} index={i} onOpen={onOpen} />
      ))}
    </section>
  );
}

function AlbumRow({ album, index, onOpen }) {
  // Magazine-style: alternate large image side, plus a small secondary photo offset
  const flip = index % 2 === 1;
  const secondPhoto = album.photos[1]?.src || album.photos[0].src;

  return (
    <article
      className="reveal album-row"
      style={{
        display: "grid",
        gridTemplateColumns: flip ? "1fr 1.4fr" : "1.4fr 1fr",
        gap: 56,
        padding: "120px 0",
        borderTop: index === 0 ? "none" : "1px solid var(--rule)",
        alignItems: "center",
      }}
    >
      {/* Cover side */}
      <div style={{ order: flip ? 2 : 1, position: "relative" }}>
        <button
          onClick={() => onOpen(album.id)}
          data-cursor="view"
          style={{ display: "block", width: "100%" }}
          className="cover-button"
        >
          <div className="cover-frame" style={{ position: "relative", overflow: "hidden" }}>
            <img
              src={album.cover}
              alt={album.title}
              className="cover-img"
              style={{
                width: "100%",
                aspectRatio: "4 / 5",
                objectFit: "cover",
                filter: "sepia(0.1) saturate(0.92) contrast(0.98)",
                transition: "transform 1.4s cubic-bezier(.2,.7,.2,1), filter .6s",
              }}
            />
            {/* film border */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                boxShadow: "inset 0 0 0 1px rgba(40,30,20,0.18), inset 0 0 60px rgba(40,20,10,0.18)",
              }}
            ></div>
            {/* frame number bottom-left */}
            <div
              className="mono"
              style={{
                position: "absolute",
                left: 14,
                bottom: 12,
                color: "var(--paper)",
                textShadow: "0 1px 0 rgba(0,0,0,0.4)",
                fontSize: 10,
              }}
            >
              {album.no} / Frame {(album.photos.length).toString().padStart(2, "0")}A
            </div>
          </div>
        </button>

        {/* small secondary photo, offset */}
        <div
          className="album-thumb"
          style={{
            position: "absolute",
            width: "30%",
            aspectRatio: "3/4",
            [flip ? "right" : "left"]: "-6%",
            bottom: "-9%",
            background: "var(--paper-soft)",
            padding: 8,
            transform: `rotate(${flip ? 3.5 : -3.5}deg)`,
            boxShadow: "0 16px 28px -18px rgba(40,30,20,0.5)",
          }}
        >
          <img
            src={secondPhoto}
            alt=""
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "sepia(0.15) saturate(0.9)",
            }}
          />
        </div>
      </div>

      {/* Text side */}
      <div style={{ order: flip ? 1 : 2, position: "relative" }}>
        <div
          className="mono"
          style={{ marginBottom: 18, display: "flex", justifyContent: "space-between" }}
        >
          <span>N° {album.no} —— {album.location}</span>
          <span>{album.date}</span>
        </div>

        <h2
          style={{
            margin: "0 0 8px",
            fontFamily: "var(--f-tc)",
            fontWeight: 500,
            fontSize: "clamp(40px, 5vw, 72px)",
            lineHeight: 1.05,
            color: "var(--ink)",
            letterSpacing: "-0.01em",
          }}
        >
          {album.title}
        </h2>
        <div
          style={{
            fontFamily: "var(--f-serif)",
            fontStyle: "italic",
            fontSize: 26,
            color: "var(--ink-soft)",
            marginBottom: 22,
          }}
        >
          “{album.titleEn}”
        </div>

        <p
          style={{
            margin: "0 0 28px",
            maxWidth: 460,
            fontFamily: "var(--f-tc)",
            fontSize: 17,
            lineHeight: 1.8,
            color: "var(--ink-soft)",
          }}
        >
          {album.description}
        </p>

        {/* Palette swatches */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 26 }}>
          <span className="mono">Palette</span>
          <div style={{ display: "flex", gap: 5 }}>
            {album.palette.map((c) => (
              <span
                key={c}
                style={{
                  width: 18,
                  height: 18,
                  background: c,
                  borderRadius: 999,
                  boxShadow: "0 0 0 1px rgba(40,30,20,0.18)",
                }}
              ></span>
            ))}
          </div>
          <span className="mono" style={{ marginLeft: 16 }}>{album.rolls}</span>
        </div>

        <button
          onClick={() => onOpen(album.id)}
          data-cursor="open"
          className="open-btn"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 14,
            padding: "14px 20px 14px 22px",
            border: "1px solid var(--ink)",
            color: "var(--ink)",
            fontFamily: "var(--f-mono)",
            fontSize: 11,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            borderRadius: 999,
            position: "relative",
            transition: "background .35s, color .35s",
          }}
        >
          Open the album
          <span style={{ fontSize: 16 }}>→</span>
        </button>

        {/* hand note — anchored to bottom-right, well clear of the meta header */}
        <div
          className="hand"
          style={{
            position: "absolute",
            right: 0,
            bottom: -6,
            fontSize: 26,
            color: "var(--rust)",
            transform: "rotate(-3deg)",
            pointerEvents: "none",
            whiteSpace: "nowrap",
          }}
        >
          {album.note}
        </div>
      </div>
    </article>
  );
}

/* ============== COLOPHON ============== */
function Colophon() {
  return (
    <footer
      className="reveal"
      style={{
        margin: "0 48px",
        padding: "60px 0 50px",
        borderTop: "1px solid var(--rule)",
        display: "grid",
        gridTemplateColumns: "1.4fr 1fr 1fr",
        gap: 48,
        alignItems: "start",
      }}
    >
      <div>
        <div className="mono" style={{ marginBottom: 10 }}>Colophon</div>
        <p style={{ margin: 0, fontFamily: "var(--f-serif)", fontStyle: "italic", fontSize: 22, lineHeight: 1.45, color: "var(--ink-soft)" }}>
          Set in EB Garamond &amp; Noto Serif. Photographed on 35mm film, scanned at home.
          Brewed slowly on a cream-paper afternoon in Tainan.
        </p>
      </div>
      <div>
        <div className="mono" style={{ marginBottom: 10 }}>Studio</div>
        <div style={{ fontFamily: "var(--f-tc)", lineHeight: 1.7 }}>
          台南市中西區<br/>
          神農街附近的某間舊公寓二樓<br/>
          By appointment only.
        </div>
      </div>
      <div style={{ textAlign: "right" }}>
        <div className="mono" style={{ marginBottom: 10 }}>© 2026</div>
        <div style={{ fontFamily: "var(--f-serif)", fontStyle: "italic", fontSize: 18 }}>
          All images © Nien-Cheng Chen.<br/>
          Please ask before re-using.
        </div>
        <div className="hand" style={{ fontSize: 26, marginTop: 14, color: "var(--rust)" }}>
          謝謝你來看 ✷
        </div>
      </div>
    </footer>
  );
}

window.Home = Home;
