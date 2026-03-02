import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#1C1917',
    background: '#FAFAF9',
    card: '#F5F5F4',
    border: '#E7E5E4',
    tint: '#F59E0B',
    tintDark: '#D97706',
    icon: '#78716C',
    correct: '#22C55E',
    incorrect: '#EF4444',
    tabIconDefault: '#78716C',
    tabIconSelected: '#F59E0B',
  },
  dark: {
    text: '#F5F5F4',
    background: '#1C1917',
    card: '#292524',
    border: '#44403C',
    tint: '#F59E0B',
    tintDark: '#D97706',
    icon: '#A8A29E',
    correct: '#22C55E',
    incorrect: '#EF4444',
    tabIconDefault: '#A8A29E',
    tabIconSelected: '#F59E0B',
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
