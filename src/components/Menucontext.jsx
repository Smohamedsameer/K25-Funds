import { createContext, useContext, useState } from "react";

const MenuContext = createContext(null);

export function MenuProvider({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <MenuContext.Provider value={{ menuOpen, setMenuOpen }}>
      {children}
    </MenuContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useMenu() {
  const ctx = useContext(MenuContext);
  if (!ctx) throw new Error("useMenu must be used inside <MenuProvider>");
  return ctx;
}