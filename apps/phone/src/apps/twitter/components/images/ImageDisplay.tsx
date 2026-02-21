import { Image as ImageType } from '@typings/twitter';
import React from 'react';
import Image from './Image';

interface ImageDisplayProps {
  visible: boolean;
  images: ImageType[];
  removeImage?: (id: string) => void;
}

export const ImageDisplay: React.FC<ImageDisplayProps> = ({ visible, images, removeImage }) => {
  if (!visible || !images || images.length === 0) return null;

  return (
    <div className="p-2 flex flex-wrap gap-2 w-full">
      {images.map((image) => (
        <Image
          key={image.id}
          link={image.link}
          handleClick={removeImage ? () => removeImage(image.id) : undefined}
        />
      ))}
    </div>
  );
};

export default ImageDisplay;
