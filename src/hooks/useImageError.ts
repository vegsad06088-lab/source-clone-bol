import { useCallback } from 'react';

export function useImageError(imageName: string) {
  return useCallback(
    (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      const img = e.currentTarget;
      console.error(
        `Image failed to load: ${imageName}`,
        `URL: ${img.src}`,
        `Status: ${img.complete}`,
        `Natural dimensions: ${img.naturalWidth}x${img.naturalHeight}`
      );
      // Hide broken image
      img.style.display = 'none';
    },
    [imageName]
  );
}

