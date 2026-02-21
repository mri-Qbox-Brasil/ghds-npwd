import React from 'react';

interface PictureThumbnailProps {
  src: string;
  alt: string;
  size?: string;
}

export const PictureThumbnail: React.FC<PictureThumbnailProps> = ({ src, alt, size = '3em' }) => (
  <img
    className="object-contain"
    style={{ width: size }}
    src={src}
    alt={alt}
  />
);
