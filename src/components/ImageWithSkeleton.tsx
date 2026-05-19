import { useState } from "react";
import Image, { ImageProps } from "next/image";

export default function ImageWithSkeleton({
  className = "",
  alt,
  ...props
}: ImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Skeleton Background */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-paper-deep/40 animate-pulse" />
      )}
      <Image
        {...props}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-500 ${
          isLoaded ? "opacity-100" : "opacity-0"
        } ${className}`}
        onLoad={(e) => {
          setIsLoaded(true);
          if (props.onLoad) props.onLoad(e);
        }}
      />
    </div>
  );
}
