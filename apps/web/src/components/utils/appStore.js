import create from "zustand";
import { persist } from "zustand/middleware";

const useStore = create(
  persist((set) => ({
    email: "",
    account: "",
    role: "",
    setEmail: (email) => set({ email }),
    setAccount: (account) => set({ account }),
    setRole: (role) => set({ role }),
    removeAllState: () => set({ email: "", account: "" }),
  }))
);

export default useStore;
