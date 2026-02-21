import React, { useEffect, useRef } from 'react';
import { LikeorDislikeDraggableElement } from '../utils/drag';

interface IProps {
  id: string;
  children: JSX.Element | JSX.Element[];
  onDrag: (deltaX: number) => void;
  onDrop: () => void;
}

const MAX_ROTATION_DEG = 15;

function Draggable({ id, children, onDrag, onDrop }: IProps) {
  const elementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (elementRef.current) {
      const drag = new LikeorDislikeDraggableElement(elementRef, MAX_ROTATION_DEG, onDrag, onDrop);
      return () => drag.cleanup();
    }
  }, [id, onDrag, onDrop]);

  return (
    <div className="absolute inset-0 h-full w-full">
      <div
        ref={elementRef}
        id={id}
        className="h-full w-full transition-transform duration-150 ease-out preserve-3d"
      >
        {children}
      </div>
    </div>
  );
}

export default Draggable;
