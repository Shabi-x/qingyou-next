/**
 * 番茄钟容器组件 - 管理设置页和专注页的导航
 */

import { PomodoroConfig } from '@/types/pomodoro';
import React from 'react';
import { PomodoroFocus } from './pomodoro-focus';
import { PomodoroSetup } from './pomodoro-setup';

type ViewState = 'setup' | 'focus';

export function PomodoroContainer() {
  const [viewState, setViewState] = React.useState<ViewState>('setup');
  const [config, setConfig] = React.useState<PomodoroConfig | null>(null);
  const [focusKey, setFocusKey] = React.useState(0);
  
  // 开始专注
  const handleStart = (newConfig: PomodoroConfig) => {
    setConfig(newConfig);
    setViewState('focus');
  };
  
  // 取消/完成/放弃 - 返回设置页
  const handleBack = () => {
    setViewState('setup');
    setConfig(null);
  };
  
  // 重新开始 - 使用相同配置重新开始
  const handleRestart = () => {
    setFocusKey(prev => prev + 1); // 强制重新渲染
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
