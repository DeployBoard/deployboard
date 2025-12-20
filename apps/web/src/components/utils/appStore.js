import { create } from "zustand";
import { persist } from "zustand/middleware";

const useStore = create(
  persist((set) => ({
    email: "",
    account: "",
    role: "",
    navOpen: true,
    theme: "",
    setEmail: (email) => set({ email }),
    setAccount: (account) => set({ account }),
    setRole: (role) => set({ role }),
    setNavOpen: (navOpen) => set({ navOpen }),
    setTheme: (theme) => set({ theme }),
    removeAllState: () => set({ email: "", account: "" }),
  }))
);

export default useStore;
