import React, { useState } from 'react';

export const Tooltip: React.FC<{ title: React.ReactNode; children: React.ReactElement }> = ({
  title,
  children,
}) => {
  const [show, setShow] = useState(false);

  return (
    <div
      className="relative flex items-center"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && title && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black/80 text-white text-xs rounded shadow-lg whitespace-nowrap z-[3000] animate-in fade-in zoom-in-95 duration-200 pointer-events-none">
          {title}
        </div>
      )}
    </div>
  );
};
