import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Profile, Property } from './types';
import { seedProperties } from './data';

interface Store {
  profile: Profile | null;
  userName: string;
  login: (profile: Profile, name: string) => void;
  logout: () => void;
  properties: Property[];
  addProperty: (p: Omit<Property, 'id'>) => void;
  welcome: boolean;
  clearWelcome: () => void;
}

const StoreContext = createContext<Store | null>(null);

const LS_PROFILE = 'climarisk:profile';
const LS_NAME = 'climarisk:name';
const LS_PROPS = 'climarisk:properties';

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(() => load<Profile | null>(LS_PROFILE, null));
  const [userName, setUserName] = useState<string>(() => load<string>(LS_NAME, ''));
  const [properties, setProperties] = useState<Property[]>(() => load<Property[]>(LS_PROPS, seedProperties));
  const [welcome, setWelcome] = useState(false);

  useEffect(() => {
    localStorage.setItem(LS_PROPS, JSON.stringify(properties));
  }, [properties]);

  const value = useMemo<Store>(
    () => ({
      profile,
      userName,
      login: (p, name) => {
        setProfile(p);
        setUserName(name);
        setWelcome(true);
        localStorage.setItem(LS_PROFILE, JSON.stringify(p));
        localStorage.setItem(LS_NAME, JSON.stringify(name));
      },
      logout: () => {
        setProfile(null);
        setUserName('');
        localStorage.removeItem(LS_PROFILE);
        localStorage.removeItem(LS_NAME);
      },
      properties,
      addProperty: (p) =>
        setProperties((prev) => {
          const seq = String(prev.length + 1).padStart(3, '0');
          return [{ ...p, id: `PR-${seq}` }, ...prev];
        }),
      welcome,
      clearWelcome: () => setWelcome(false),
    }),
    [profile, userName, properties, welcome]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useStore(): Store {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
