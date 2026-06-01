import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { ThemeProvider as SCThemeProvider } from 'styled-components';

const STORAGE_KEY = 'md2pdf-theme';
const MODES = ['system', 'light', 'dark'];

export const lightTheme = {
  mode: 'light',
  colors: {
    appBg: '#ffffff',
    appText: '#24292e',
    headerBg: '#f6f8fa',
    headerText: '#1f2328',
    headerBorder: '#d0d7de',
    buttonBg: '#ffffff',
    buttonText: '#1f2328',
    buttonBorder: '#d0d7de',
    buttonHoverBg: '#f6f8fa',
    buttonHoverBorder: '#afb8c1',
    versionChip: '#656d76',
    previewBg: '#ffffff',
    previewText: '#24292e',
    mermaidLoadingBg: '#f6f8fa',
    mermaidLoadingText: '#6a737d',
    dragBarIdle: 'rgb(233,233,233)',
    dragBarActive: '#0984e3',
    tabBarBg: 'rgb(233, 233, 233)',
    tabBarBorder: 'rgba(0, 0, 0, 0.1)',
    tabActiveBg: '#0984e3',
    tabActiveText: '#fff',
    tabInactiveText: '#333',
    tabInactiveHoverBg: 'rgba(0,0,0,0.06)',
    accent: 'rgb(53, 123, 253)',
  },
};

export const darkTheme = {
  mode: 'dark',
  colors: {
    appBg: '#0d1117',
    appText: '#e6edf3',
    headerBg: '#161b22',
    headerText: '#e6edf3',
    headerBorder: '#30363d',
    buttonBg: '#21262d',
    buttonText: '#e6edf3',
    buttonBorder: '#30363d',
    buttonHoverBg: '#30363d',
    buttonHoverBorder: '#6e7681',
    versionChip: '#8b949e',
    previewBg: '#0d1117',
    previewText: '#e6edf3',
    mermaidLoadingBg: '#161b22',
    mermaidLoadingText: '#8b949e',
    dragBarIdle: '#30363d',
    dragBarActive: '#1f6feb',
    tabBarBg: '#161b22',
    tabBarBorder: 'rgba(255, 255, 255, 0.1)',
    tabActiveBg: '#1f6feb',
    tabActiveText: '#ffffff',
    tabInactiveText: '#c9d1d9',
    tabInactiveHoverBg: 'rgba(255,255,255,0.06)',
    accent: 'rgb(88, 166, 255)',
  },
};

const ThemeModeContext = createContext({
  mode: 'system',
  resolved: 'light',
  setMode: () => {},
  cycleMode: () => {},
});

const readStoredMode = () => {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return MODES.includes(value) ? value : 'system';
  } catch {
    return 'system';
  }
};

const systemPrefersDark = () => {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

export const ThemeProvider = ({ children }) => {
  const [mode, setModeState] = useState(readStoredMode);
  const [systemDark, setSystemDark] = useState(systemPrefersDark);

  useEffect(() => {
    if (!window.matchMedia) return undefined;
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = (e) => setSystemDark(e.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  const setMode = useCallback((next) => {
    if (!MODES.includes(next)) return;
    setModeState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  const cycleMode = useCallback(() => {
    setModeState((prev) => {
      const idx = MODES.indexOf(prev);
      const next = MODES[(idx + 1) % MODES.length];
      try {
        window.localStorage.setItem(STORAGE_KEY, next);
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const resolved = mode === 'system' ? (systemDark ? 'dark' : 'light') : mode;
  const theme = resolved === 'dark' ? darkTheme : lightTheme;

  const ctx = useMemo(
    () => ({ mode, resolved, setMode, cycleMode }),
    [mode, resolved, setMode, cycleMode],
  );

  return (
    <ThemeModeContext.Provider value={ctx}>
      <SCThemeProvider theme={theme}>{children}</SCThemeProvider>
    </ThemeModeContext.Provider>
  );
};

export const useThemeMode = () => useContext(ThemeModeContext);
