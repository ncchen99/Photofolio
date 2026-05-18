"use client";

import { useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Keyboard, Navigation } from "swiper/modules";
import type { Swiper as SwiperClass } from "swiper";
import Image from "next/image";
import {
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import type { Photo } from "@/lib/albums";
import { cdnUrl } from "@/lib/cdn";

import "swiper/css";
import "swiper/css/navigation";

type Props = {
  photos: Photo[];
  index: number;
  onClose: () => void;
  onIndexChange: (i: number) => void;
};

export default function Lightbox({ photos, index, onClose, onIndexChange }: Props) {
  const swiperRef = useRef<SwiperClass | null>(null);
  const prevRef = useRef<HTMLButtonElement | null>(null);
  const nextRef = useRef<HTMLButtonElement | null>(null);

  // Lock body scroll while open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // Keep external `index` in sync with the swiper
  useEffect(() => {
    const s = swiperRef.current;
    if (s && s.activeIndex !== index) s.slideTo(index, 0);
  }, [index]);

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
    >
      {/* close */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute top-4 right-4 md:top-6 md:right-6 z-20 w-11 h-11 flex items-center justify-center rounded-full text-white/85 hover:text-white hover:bg-white/10 transition-colors"
      >
        <XMarkIcon className="w-7 h-7" strokeWidth={1.8} />
      </button>

      {/* prev / next — desktop only */}
      <button
        ref={prevRef}
        type="button"
        aria-label="Previous"
        className="hidden md:flex absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 items-center justify-center rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
      >
        <ChevronLeftIcon className="w-8 h-8" strokeWidth={1.8} />
      </button>
      <button
        ref={nextRef}
        type="button"
        aria-label="Next"
        className="hidden md:flex absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 items-center justify-center rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
      >
        <ChevronRightIcon className="w-8 h-8" strokeWidth={1.8} />
      </button>

      <Swiper
        modules={[Keyboard, Navigation]}
        initialSlide={index}
        spaceBetween={0}
        slidesPerView={1}
        keyboard={{ enabled: true }}
        navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
        onBeforeInit={(swiper) => {
          // Fix navigation refs across React render order
          if (typeof swiper.params.navigation === "object" && swiper.params.navigation) {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
          }
        }}
        onSwiper={(s) => {
          swiperRef.current = s;
        }}
        onSlideChange={(s) => onIndexChange(s.activeIndex)}
        className="w-full h-full"
      >
        {photos.map((p, i) => (
          <SwiperSlide key={p.src} className="flex items-center justify-center">
            <div className="w-full h-full flex items-center justify-center p-4 md:p-12">
              <Image
                src={cdnUrl(p.src)}
                alt=""
                width={p.width}
                height={p.height}
                sizes="100vw"
                priority={Math.abs(i - index) <= 1}
                className="max-w-full max-h-full w-auto h-auto object-contain select-none"
                draggable={false}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* counter */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 font-mono text-[11px] tracking-[0.22em] uppercase text-white/70">
        {index + 1} / {photos.length}
      </div>
    </div>
  );
}
