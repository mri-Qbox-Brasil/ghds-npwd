import { RefreshCw } from 'lucide-react';
import React from 'react';
import { TFunction } from 'react-i18next';

interface ExternalAppBoundaryProps {
  children: React.ReactNode;
  color: string;
  background: string;
  t: TFunction;
}

export class ExternalAppBoundary extends React.Component<ExternalAppBoundaryProps> {
  state = {
    hasError: false,
    errorMsg: '',
  };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, errorMsg: error.message };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="flex-1 flex flex-col items-center justify-center max-h-full"
          style={{
            background: this.props.background ?? '#222',
            color: this.props.color ?? '#fff'
          }}
        >
          <div className="flex flex-col items-center gap-4 mt-[15%] text-center">
            <div className="p-4">
              <h5 className="text-xl font-medium m-0 pb-1">{String(this.props.t('MISC.APP_CRASHED_TITLE'))}</h5>
              <span className="text-xs opacity-80">{String(this.props.t('MISC.APP_CRASHED_MSG'))}</span>
            </div>

            <button
              className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium transition-colors bg-white/10 rounded-md hover:bg-white/20 active:bg-white/30 cursor-pointer border-none text-inherit"
              onClick={() => this.setState({ hasError: false })}
            >
              <RefreshCw size={18} />
              {String(this.props.t('MISC.APP_CRASHED_ACTION'))}
            </button>
          </div>

          <code className="text-[#f32d2d] p-6 text-[0.8rem] bg-black/50 mt-auto w-full break-words box-border">
            {this.state.errorMsg}
          </code>
        </div>
      );
    }

    return this.props.children;
  }
}
