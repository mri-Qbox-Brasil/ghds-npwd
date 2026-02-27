import React from 'react';
import { Button } from './ui/button';
import { Typography } from './ui/typography';
import { Flex } from './ui/flex';
import { useTranslation } from 'react-i18next';
import { captureException } from '@sentry/react';

interface TopLevelErrorCompProps {
  hasError: boolean;
  errorMsg: string;
}

interface ErrorDialogCompProps {
  isOpen: boolean;
  errorMsg: string;
}

const ErrorDialogComp: React.FC<ErrorDialogCompProps> = ({ isOpen, errorMsg }) => {
  const [t] = useTranslation();

  const handleReloadClick = () => window.location.reload();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-background p-6 shadow-2xl border border-border">
        <Typography variant="h6" className="mb-2">
          {t('MISC.TOP_LEVEL_ERR_TITLE') as unknown as string}
        </Typography>
        <div className="mb-6 space-y-4">
          <Typography variant="body1" color="muted">
            {t('MISC.TOP_LEVEL_ERR_MSG') as unknown as string}
          </Typography>
          <code className="block w-full overflow-auto rounded bg-red-950/20 p-3 text-red-500 text-sm border border-red-500/20">
            {errorMsg}
          </code>
        </div>
        <Flex justify="end">
          <Button onClick={handleReloadClick}>
            {t('MISC.TOP_LEVEL_ERR_ACTION') as unknown as string}
          </Button>
        </Flex>
      </div>
    </div>
  );
};

export class TopLevelErrorComponent extends React.Component<any, TopLevelErrorCompProps> {
  public state = {
    hasError: false,
    errorMsg: '',
  };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, errorMsg: error.message };
  }

  componentDidCatch(error: Error, { componentStack }: React.ErrorInfo) {
    captureException(error, { contexts: { react: { componentStack } } });
  }

  render() {
    if (this.state.hasError) {
      return <ErrorDialogComp isOpen={this.state.hasError} errorMsg={this.state.errorMsg} />;
    }

    return this.props.children;
  }
}
