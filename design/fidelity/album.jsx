/* Album page — continuous-scroll photo essay with parallax */
const { useEffect: useEffectA, useState: useStateA, useRef: useRefA } = React;

function Album({ albumId, onBack, onOpenAlbum }) {
  const album = window.ALBUMS.find((a) => a.id === albumId) || window.ALBUMS[0];
  const albums = window.ALBUMS;
  const idx = albums.findIndex((a) => a.id === album.id);
  const next = albums[(idx + 1) % albums.length];

  window.useReveal([albumId]);

  // Parallax: gentle translate on each photo as it crosses viewport
  useEffectA(() => {
    let raf;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        document.querySelectorAll(".px-img").forEach((el) => {
          const r = el.getBoundingClientRect();
          const vh = window.innerHeight;
          const t = (r.top + r.height / 2 - vh / 2) / vh; // -1..1ish
          el.style.transform = `translateY(${(-t * 28).toFixed(2)}px) scale(1.08)`;
        });
      });
      setTimeout(() => { raf = null; }, 16);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
    return () => window.removeEventListener("scroll", onScroll);
  }, [albumId]);

  return (
    <div className="page-enter" data-screen-label={`02 Album · ${album.title}`}>
      {/* Top bar with back */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "26px 48px 0",
          fontFamily: "var(--f-mono)",
          fontSize: 11,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "var(--ink-mute)",
        }}
      >
        <button
          onClick={onBack}
          data-cursor="back"
          style={{
            fontFamily: "var(--f-mono)",
            fontSize: 11,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "var(--ink)",
          }}
        >
          ← Folio · Index
        </button>
        <span>N° {album.no} / {albums.length.toString().padStart(2, "0")}</span>
        <span>{album.location}</span>
      </div>
      <div style={{ height: 1, background: "var(--rule)", margin: "20px 48px 0" }}></div>

      {/* Hero / title */}
      <header
        style={{
          padding: "80px 48px 60px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 60,
          alignItems: "end",
          position: "relative",
        }}
      >
        <div className="reveal">
          <div className="mono" style={{ marginBottom: 22 }}>
            Album N° <span style={{ color: "var(--rust)" }}>{album.no}</span>
            &nbsp;·&nbsp; {album.photos.length} frames &nbsp;·&nbsp; {album.rolls}
          </div>
          <h1
            style={{
              margin: 0,
              fontFamily: "var(--f-tc)",
              fontWeight: 500,
              fontSize: "clamp(64px, 9vw, 140px)",
              lineHeight: 0.96,
              letterSpacing: "-0.02em",
              color: "var(--ink)",
            }}
          >
            {album.title}
          </h1>
          <div
            style={{
              fontFamily: "var(--f-serif)",
              fontStyle: "italic",
              fontSize: "clamp(28px, 3vw, 44px)",
              color: "var(--ink-soft)",
              marginTop: 12,
            }}
          >
            “{album.titleEn}”
          </div>
        </div>

        <div className="reveal" style={{ paddingBottom: 6 }}>
          <p
            style={{
              margin: 0,
              fontFamily: "var(--f-tc)",
              fontSize: 19,
              lineHeight: 1.85,
              color: "var(--ink-soft)",
              maxWidth: 460,
            }}
          >
            {album.description}
          </p>

          <div
            style={{
              marginTop: 28,
              display: "flex",
              gap: 36,
              flexWrap: "wrap",
              fontFamily: "var(--f-mono)",
              fontSize: 11,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--ink-mute)",
            }}
          >
            <Meta label="Date"     value={album.date} />
            <Meta label="Location" value={album.location} />
            <Meta label="Stock"    value={album.rolls.split(" · ")[1] || album.rolls} />
          </div>

          <div className="hand" style={{ marginTop: 22, fontSize: 28, color: "var(--rust)" }}>
            {album.note}
          </div>
        </div>

        {/* big watermark numeral */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            right: 36,
            top: 30,
            fontFamily: "var(--f-serif)",
            fontStyle: "italic",
            fontSize: 220,
            lineHeight: 1,
            color: "var(--ink)",
            opacity: 0.06,
            letterSpacing: "-0.04em",
            pointerEvents: "none",
          }}
        >
          {album.no}
        </div>
      </header>

      {/* Photo grid — continuous, magazine-style */}
      <main style={{ padding: "0 48px 80px" }}>
        <PhotoFlow photos={album.photos} />
      </main>

      {/* End mark */}
      <section
        className="reveal"
        style={{
          margin: "40px 48px 80px",
          padding: "40px 0",
          borderTop: "1px solid var(--rule)",
          borderBottom: "1px solid var(--rule)",
          textAlign: "center",
        }}
      >
        <div className="mono" style={{ marginBottom: 12 }}>End of Roll</div>
        <div
          style={{
            fontFamily: "var(--f-serif)",
            fontStyle: "italic",
            fontSize: 32,
            color: "var(--ink-soft)",
          }}
        >
          — fin —
        </div>
        <div className="hand" style={{ marginTop: 10, fontSize: 24, color: "var(--rust)" }}>
          thank you for looking.
        </div>
      </section>

      {/* Next album */}
      <NextAlbum album={next} onOpen={onOpenAlbum} />
    </div>
  );
}

function Meta({ label, value }) {
  return (
    <div>
      <div style={{ color: "var(--ink-mute)" }}>{label}</div>
      <div style={{ color: "var(--ink)", marginTop: 4, letterSpacing: "0.1em" }}>{value}</div>
    </div>
  );
}

/* ============== PhotoFlow — varied layouts ============== */
function PhotoFlow({ photos }) {
  // Build a sequence of layout "rows" with varying compositions
  const layouts = buildLayouts(photos);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 120 }}>
      {layouts.map((row, i) => (
        <PhotoRow key={i} row={row} idx={i} />
      ))}
    </div>
  );
}

function buildLayouts(photos) {
  // Strategy: walk through photos, group into rows by aspect.
  // Patterns: hero (1 photo full), pair (2 photos), single-offset, triple
  const rows = [];
  let i = 0;
  let pattern = 0;
  const patterns = ["heroLeft", "pair", "singleRight", "heroFull", "pair", "singleLeft"];
  while (i < photos.length) {
    const p = patterns[pattern % patterns.length];
    pattern++;
    if (p === "heroFull" || p === "heroLeft") {
      const ph = photos[i];
      if (!ph) break;
      rows.push({ type: p, photos: [ph], startIdx: i });
      i += 1;
    } else if (p === "pair") {
      const a = photos[i], b = photos[i + 1];
      if (!a) break;
      if (!b) {
        rows.push({ type: "singleRight", photos: [a], startIdx: i });
        i += 1;
      } else {
        rows.push({ type: "pair", photos: [a, b], startIdx: i });
        i += 2;
      }
    } else if (p === "singleLeft" || p === "singleRight") {
      const ph = photos[i];
      if (!ph) break;
      rows.push({ type: p, photos: [ph], startIdx: i });
      i += 1;
    }
  }
  return rows;
}

function PhotoRow({ row, idx }) {
  if (row.type === "heroFull") return <HeroFull photo={row.photos[0]} idx={row.startIdx} />;
  if (row.type === "heroLeft") return <HeroLeft photo={row.photos[0]} idx={row.startIdx} />;
  if (row.type === "pair") return <Pair photos={row.photos} idx={row.startIdx} />;
  if (row.type === "singleLeft") return <Single photo={row.photos[0]} idx={row.startIdx} side="left" />;
  return <Single photo={row.photos[0]} idx={row.startIdx} side="right" />;
}

function FrameNum({ idx, suffix }) {
  return (
    <div className="mono" style={{ color: "var(--ink-mute)", marginTop: 12, display: "flex", justifyContent: "space-between" }}>
      <span>Frame {(idx + 1).toString().padStart(3, "0")}{suffix || ""}</span>
      <span>—</span>
    </div>
  );
}

function PhotoCard({ photo, idx, ratio, withCaption = true, captionAlign = "left" }) {
  return (
    <figure className="reveal" style={{ margin: 0 }}>
      <div
        className="photo-frame"
        data-cursor="view"
        style={{
          position: "relative",
          overflow: "hidden",
          aspectRatio: ratio || `${photo.w} / ${photo.h}`,
          background: "#1a1410",
        }}
      >
        <img
          className="px-img"
          src={photo.src}
          alt={photo.caption || ""}
          loading="lazy"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "sepia(0.1) saturate(0.94) contrast(0.98)",
            transition: "filter .6s",
            willChange: "transform",
          }}
        />
        <div
          style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            boxShadow: "inset 0 0 0 1px rgba(40,30,20,0.18), inset 0 0 80px rgba(40,20,10,0.20)",
          }}
        ></div>
      </div>
      {withCaption && (
        <figcaption
          style={{
            display: "flex",
            justifyContent: captionAlign === "right" ? "flex-end" : "space-between",
            alignItems: "baseline",
            gap: 24,
            marginTop: 12,
          }}
        >
          {captionAlign === "left" && (
            <span className="mono" style={{ color: "var(--ink-mute)" }}>
              FRAME · {(idx + 1).toString().padStart(3, "0")}
            </span>
          )}
          <span
            style={{
              fontFamily: "var(--f-tc)",
              fontStyle: "italic",
              fontSize: 15,
              color: "var(--ink-soft)",
              textAlign: captionAlign,
              maxWidth: 440,
            }}
          >
            {photo.caption || <span style={{ color: "var(--ink-mute)", fontStyle: "normal" }}>—</span>}
          </span>
          {captionAlign === "right" && (
            <span className="mono" style={{ color: "var(--ink-mute)" }}>
              FRAME · {(idx + 1).toString().padStart(3, "0")}
            </span>
          )}
        </figcaption>
      )}
    </figure>
  );
}

function HeroFull({ photo, idx }) {
  return (
    <div style={{ width: "100%" }}>
      <PhotoCard photo={photo} idx={idx} ratio="16 / 9" />
    </div>
  );
}

function HeroLeft({ photo, idx }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 60, alignItems: "center" }}>
      <PhotoCard photo={photo} idx={idx} />
      <div className="reveal" style={{ paddingLeft: 8 }}>
        <div className="mono" style={{ marginBottom: 18, color: "var(--rust)" }}>
          ✦ Frame {(idx + 1).toString().padStart(3, "0")}
        </div>
        <div
          style={{
            fontFamily: "var(--f-serif)",
            fontStyle: "italic",
            fontSize: 32,
            lineHeight: 1.35,
            color: "var(--ink)",
            maxWidth: 340,
          }}
        >
          {photo.caption || <span style={{ color: "var(--ink-mute)" }}>無題</span>}
        </div>
        <div
          className="hand"
          style={{ marginTop: 22, fontSize: 22, color: "var(--ink-soft)", transform: "rotate(-1.5deg)", display: "inline-block" }}
        >
          ·  ·  ·
        </div>
      </div>
    </div>
  );
}

function Pair({ photos, idx }) {
  const [a, b] = photos;
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "start" }}>
      <div style={{ paddingTop: 0 }}>
        <PhotoCard photo={a} idx={idx} />
      </div>
      <div style={{ paddingTop: 80 }}>
        <PhotoCard photo={b} idx={idx + 1} captionAlign="right" />
      </div>
    </div>
  );
}

function Single({ photo, idx, side }) {
  // narrow image, offset to one side, with a thin caption note on the other
  const isLeft = side === "left";
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 32, alignItems: "start" }}>
      <div style={{ gridColumn: isLeft ? "1 / 3" : "2 / 4" }}>
        <PhotoCard photo={photo} idx={idx} />
      </div>
      {!isLeft && (
        <div style={{ gridColumn: "1 / 2", paddingTop: 40, textAlign: "right" }}></div>
      )}
    </div>
  );
}

/* ============== Next Album ============== */
function NextAlbum({ album, onOpen }) {
  return (
    <section
      className="reveal next-album"
      onClick={() => onOpen(album.id)}
      data-cursor="open"
      style={{
        margin: "0 48px 80px",
        padding: "60px 40px",
        background: "var(--paper-deep)",
        position: "relative",
        overflow: "hidden",
        cursor: "none",
      }}
    >
      <div className="mono" style={{ marginBottom: 10, color: "var(--ink-mute)" }}>
        Up next, in this folio
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "center" }}>
        <div>
          <div className="mono" style={{ marginBottom: 6, color: "var(--rust)" }}>
            N° {album.no} &nbsp;·&nbsp; {album.location}
          </div>
          <h3
            style={{
              margin: 0,
              fontFamily: "var(--f-tc)",
              fontWeight: 500,
              fontSize: "clamp(48px, 6vw, 88px)",
              lineHeight: 1.0,
              color: "var(--ink)",
            }}
          >
            {album.title} <span style={{ color: "var(--rust)" }}>→</span>
          </h3>
          <div
            style={{
              marginTop: 6,
              fontFamily: "var(--f-serif)",
              fontStyle: "italic",
              fontSize: 26,
              color: "var(--ink-soft)",
            }}
          >
            “{album.titleEn}”
          </div>
        </div>
        <div style={{ aspectRatio: "16 / 9", overflow: "hidden", position: "relative" }}>
          <img
            src={album.cover}
            alt=""
            className="next-cover"
            style={{
              width: "100%", height: "100%", objectFit: "cover",
              filter: "sepia(0.12) saturate(0.92) contrast(0.98)",
              transition: "transform 1.2s cubic-bezier(.2,.7,.2,1)",
            }}
          />
          <div
            style={{
              position: "absolute", inset: 0, pointerEvents: "none",
              boxShadow: "inset 0 0 0 1px rgba(40,30,20,0.18), inset 0 0 60px rgba(40,20,10,0.20)",
            }}
          ></div>
        </div>
      </div>
    </section>
  );
}

window.Album = Album;
