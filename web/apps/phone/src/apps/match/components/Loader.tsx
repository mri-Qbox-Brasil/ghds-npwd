import React from 'react';
import { Loader2 } from 'lucide-react';

function Loader() {
  return (
    <div className="flex h-full w-full justify-center pt-24">
      <Loader2 size={60} className="text-pink-500 animate-spin opacity-80" />
    </div>
  );
}

export default Loader;
