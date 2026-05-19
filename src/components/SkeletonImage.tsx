"use client";

import { useState } from "react";
import Image, { ImageProps } from "next/image";

interface SkeletonImageProps extends ImageProps {
  skeletonClassName?: string;
}

export default function SkeletonImage({ 
  alt, 
  skeletonClassName = "bg-paper-deep/40", 
  ...props 
}: SkeletonImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <>
      {/* Skeleton overlay */}
      <span 
        className={`absolute inset-0 ${skeletonClassName} transition-opacity duration-500 pointer-events-none ${
          isLoaded ? "opacity-0" : "opacity-100 animate-pulse"
        }`} 
        aria-hidden="true" 
      />
      <Image
        {...props}
        alt={alt}
        className={`${props.className || ""} transition-opacity duration-700 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        onLoad={(e) => {
          setIsLoaded(true);
          if (props.onLoad) props.onLoad(e);
        }}
      />
    </>
  );
}
