import SiteHeader from "@/components/SiteHeader";
import Hero from "@/components/Hero";
import AlbumGrid from "@/components/AlbumGrid";
import { getAllAlbums, getBio } from "@/lib/albums";

export const dynamic = "force-static";
export const revalidate = false;

export default function HomePage() {
  const bio = getBio();
  const albums = getAllAlbums();

  return (
    <div>
      <SiteHeader />
      <Hero bio={bio} />

      <div className="mx-6 md:mx-12 h-px bg-ink/15" />

      <main className="px-6 md:px-12 py-12">
        <AlbumGrid albums={albums} />
      </main>

      <footer className="px-6 md:px-12 py-10 font-mono text-[11px] tracking-[0.22em] uppercase text-ink-mute">
        © {new Date().getFullYear()} horseface
      </footer>
    </div>
  );
}
