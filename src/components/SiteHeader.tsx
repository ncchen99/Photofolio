import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function SiteHeader({ back = false }: { back?: boolean }) {
  return (
    <header className="flex items-center justify-between px-6 md:px-12 pt-7">
      <Link
        href="/"
        className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.22em] uppercase text-ink-mute hover:text-ink transition-colors"
      >
        {back ? (
          <>
            <ArrowLeftIcon className="w-3.5 h-3.5" strokeWidth={2} />
            Index
          </>
        ) : (
          "horseface · Photofolio"
        )}
      </Link>
      <span className="font-mono text-[11px] tracking-[0.22em] uppercase text-ink-mute">
        Tanaka
      </span>
    </header>
  );
}
