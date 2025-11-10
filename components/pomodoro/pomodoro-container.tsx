import { PomodoroConfig } from '@/types/pomodoro';
import React from 'react';
import { PomodoroFocus } from './pomodoro-focus';
import { PomodoroSetup } from './pomodoro-setup';

type ViewState = 'setup' | 'focus';

export function PomodoroContainer() {
  const [viewState, setViewState] = React.useState<ViewState>('setup');
  const [config, setConfig] = React.useState<PomodoroConfig | null>(null);
  const [focusKey, setFocusKey] = React.useState(0);
  
  const handleStart = (newConfig: PomodoroConfig) => {
    setConfig(newConfig);
    setViewState('focus');
  };
  
  const handleBack = () => {
    setViewState('setup');
    setConfig(null);
  };
  
  const handleRestart = () => {
    setFocusKey(prev => prev + 1);
  };
  
  if (viewState === 'setup') {
    return <PomodoroSetup onStart={handleStart} />;
  }
  
  if (viewState === 'focus' && config) {
    return (
      <PomodoroFocus
        key={focusKey}
        config={config}
        onCancel={handleBack}
        onComplete={handleBack}
        onGiveUp={handleBack}
        onRestart={handleRestart}
      />
    );
  }
  
  return null;
}


