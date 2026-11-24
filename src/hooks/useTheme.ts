import { useCallback, useEffect, useState } from 'react';

export type ThemeMode = 'light' | 'dark';

const STORAGE_KEY = 'discoveryrmm-color-scheme';

function getSystemTheme(): ThemeMode {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return 'light';
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getStoredTheme(): ThemeMode | null {
  if (typeof window === 'undefined') {
    return null;
  }
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return value === 'light' || value === 'dark' ? value : null;
  } catch {
    return null;
  }
}

function syncDocumentTheme(override: ThemeMode | null) {
  if (typeof document === 'undefined') {
    return;
  }
  const meta = document.querySelector('meta[name="color-scheme"]');
  if (override) {
    meta?.setAttribute('content', override);
    document.documentElement.dataset.theme = override;
  } else {
    meta?.setAttribute('content', 'light dark');
    delete document.documentElement.dataset.theme;
  }
}

export function useTheme() {
  const [override, setOverride] = useState<ThemeMode | null>(getStoredTheme);
  const [systemTheme, setSystemTheme] = useState<ThemeMode>(getSystemTheme);

  const resolvedTheme: ThemeMode = override ?? systemTheme;

  useEffect(() => {
    syncDocumentTheme(override);
  }, [override]);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return undefined;
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleMediaChange = (event: MediaQueryListEvent) => {
      setSystemTheme(event.matches ? 'dark' : 'light');
    };

    setSystemTheme(mediaQuery.matches ? 'dark' : 'light');
    mediaQuery.addEventListener('change', handleMediaChange);

    const handleStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) {
        const next = event.newValue === 'light' || event.newValue === 'dark' ? event.newValue : null;
        setOverride(next);
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => {
      mediaQuery.removeEventListener('change', handleMediaChange);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const toggleTheme = useCallback(() => {
    const currentResolved: ThemeMode = override ?? systemTheme;
    const target: ThemeMode = currentResolved === 'dark' ? 'light' : 'dark';

    if (target === systemTheme) {
      setOverride(null);
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch {
        // Ignore storage restrictions.
      }
    } else {
      setOverride(target);
      try {
        window.localStorage.setItem(STORAGE_KEY, target);
      } catch {
        // Ignore storage restrictions.
      }
    }
  }, [override, systemTheme]);

  return {
    resolvedTheme,
    isOverride: override !== null,
    toggleTheme,
  };
}
