import type { ImgHTMLAttributes } from "react";

type MediaImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  /** Eager + high fetch priority for LCP/hero images only. */
  priority?: boolean;
};

/** Shared image defaults for faster initial load and deferred below-fold fetches. */
export function MediaImage({ priority = false, alt = "", className, ...props }: MediaImageProps) {
  return (
    <img
      alt={alt}
      className={className}
      decoding="async"
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "low"}
      {...props}
    />
  );
}
