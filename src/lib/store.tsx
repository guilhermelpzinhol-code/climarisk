import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import type { Profile, Property } from './types';
import { seedProperties } from './data';
import { supabase } from './supabase';

interface Store {
  // Auth
  session: Session | null;
  authReady: boolean;
  profile: Profile | null;
  userName: string;
  email: string;
  signOut: () => Promise<void>;
  // Splash de boas-vindas
  welcome: boolean;
  triggerWelcome: () => void;
  clearWelcome: () => void;
  // Propriedades (mock/local)
  properties: Property[];
  addProperty: (p: Omit<Property, 'id'>) => void;
}

const StoreContext = createContext<Store | null>(null);

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
  const [session, setSession] = useState<Session | null>(null);
  const [authReady, setAuthReady] = useState(!supabase); // sem supabase, "pronto" imediatamente
  const [welcome, setWelcome] = useState(false);
  const [properties, setProperties] = useState<Property[]>(() => load<Property[]>(LS_PROPS, seedProperties));

  useEffect(() => {
    localStorage.setItem(LS_PROPS, JSON.stringify(properties));
  }, [properties]);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setAuthReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setAuthReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const user = session?.user;
  const meta = (user?.user_metadata ?? {}) as { name?: string; profile?: Profile };

  const value = useMemo<Store>(
    () => ({
      session,
      authReady,
      profile: meta.profile ?? null,
      userName: meta.name ?? (user?.email ? user.email.split('@')[0] : ''),
      email: user?.email ?? '',
      signOut: async () => {
        await supabase?.auth.signOut();
        setSession(null);
      },
      welcome,
      triggerWelcome: () => setWelcome(true),
      clearWelcome: () => setWelcome(false),
      properties,
      addProperty: (p) =>
        setProperties((prev) => {
          const seq = String(prev.length + 1).padStart(3, '0');
          return [{ ...p, id: `PR-${seq}` }, ...prev];
        }),
    }),
    [session, authReady, welcome, properties, meta.profile, meta.name, user?.email]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useStore(): Store {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
