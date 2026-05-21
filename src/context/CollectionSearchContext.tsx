"use client";

import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

interface CollectionSearchCtx {
  query:           string;
  setQuery:        (q: string) => void;
  /** true = big in-page search bar is visible; false = it has scrolled away */
  heroVisible:     boolean;
  setHeroVisible:  (v: boolean) => void;
}

const CollectionSearchContext = createContext<CollectionSearchCtx>({
  query:          "",
  setQuery:       () => {},
  heroVisible:    true,
  setHeroVisible: () => {},
});

export function CollectionSearchProvider({ children }: { children: ReactNode }) {
  const [query,       setQuery]       = useState("");
  const [heroVisible, setHeroVisible] = useState(true);

  return (
    <CollectionSearchContext.Provider value={{ query, setQuery, heroVisible, setHeroVisible }}>
      {children}
    </CollectionSearchContext.Provider>
  );
}

export const useCollectionSearch = () => useContext(CollectionSearchContext);
