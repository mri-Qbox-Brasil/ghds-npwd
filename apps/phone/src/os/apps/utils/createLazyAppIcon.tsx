import React, { Suspense } from 'react';
import { LayoutGrid } from 'lucide-react';

export const createLazyAppIcon =
  (Icon: React.LazyExoticComponent<React.ComponentType<any>>): React.FC<any> =>
    (props: any) => {
      return (
        <Suspense fallback={<LayoutGrid {...props} />}>
          <Icon {...props} />
        </Suspense>
      );
    };
