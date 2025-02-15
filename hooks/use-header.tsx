'use client';

import { createContext, ReactNode, useContext, useState } from "react";

interface HeaderContextType {
  title: ReactNode;
  setTitle: (title: ReactNode) => void;
}

const HeaderContext = createContext<HeaderContextType | undefined>(undefined);

export const HeaderProvider = ({ children }: { children: ReactNode }) => {
  const [title, setTitle] = useState<ReactNode>(null);

  return (
    <HeaderContext.Provider
      value={{ title, setTitle }}
    >
      {children}
    </HeaderContext.Provider>
  );
};

export const useHeader = () => {
  const context = useContext(HeaderContext);
  if (!context) {
    throw new Error("useHeader must be used within a HeaderProvider");
  }
  return context;
};