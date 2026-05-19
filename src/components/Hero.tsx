import SkeletonImage from "./SkeletonImage";
import { ArrowUpRightIcon } from "@heroicons/react/24/outline";
import type { Bio } from "@/lib/albums";
import { cdnUrl } from "@/lib/cdn";

export default function Hero({ bio }: { bio: Bio }) {
  return (
    <section className="px-6 md:px-12 pt-10 md:pt-14 pb-12 md:pb-16">
      <div className="flex flex-col sm:flex-row gap-8 sm:gap-10 sm:items-start">
        <div className="shrink-0 relative w-[120px] h-[120px] md:w-[150px] md:h-[150px]">
          <SkeletonImage
            src={cdnUrl(bio.avatar)}
            alt={bio.name}
            width={200}
            height={200}
            className="w-full h-full object-cover"
            priority
          />
        </div>

        <div className="flex-1 min-w-0 pt-1">
          <h1 className="font-serif text-[40px] md:text-[56px] leading-[1.05] tracking-[-0.01em] text-ink m-0">
            {bio.name}
          </h1>
          <div className="font-mono text-[11px] tracking-[0.22em] uppercase text-ink-mute mt-2">
            {bio.location}
          </div>
          <p className="font-serif text-base md:text-lg text-ink-soft mt-5 max-w-xl leading-relaxed">
            {bio.intro}
          </p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2 mt-5">
            {bio.social.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-mono text-[11px] tracking-[0.18em] uppercase text-ink-mute hover:text-ink transition-colors"
                >
                  {s.label}
                  <ArrowUpRightIcon className="w-3 h-3" strokeWidth={2} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
