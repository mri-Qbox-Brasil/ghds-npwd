import React, { useState } from 'react';
import DialGrid from '../DialPadGrid';
import { DialerDisplay, DialerControls } from '../DialerInput';
import { DialInputCtx } from '../../context/InputContext';
import { useQueryParams } from '@common/hooks/useQueryParams';

const DialPage: React.FC = () => {
  const query = useQueryParams();
  const queryNumber = query.number;
  const [inputVal, setInputVal] = useState(queryNumber || '');

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-300 pt-[80px]">
      <DialInputCtx.Provider
        value={{
          inputVal,
          add: (val: string) => setInputVal(inputVal + val),
          removeOne: () => setInputVal(inputVal.slice(0, -1)),
          clear: () => setInputVal(''),
          set: (val: string) => setInputVal(val),
        }}
      >
        <div className="flex-1 flex flex-col justify-between max-w-sm mx-auto w-full px-6 overflow-hidden">
          <div className="flex flex-col items-center">
            <DialerDisplay />
          </div>

          <div className="flex-1 flex flex-col justify-center py-2">
            <DialGrid />
            <DialerControls />
          </div>
        </div>
      </DialInputCtx.Provider>
    </div>
  );
};

export default DialPage;
