import { create } from "zustand";

export const useStatusStore = create((set) => ({
  statuses: [],
  addStatus: (status) =>
    set((state) => {
      const exists = state.statuses.find((s) => s.userId === status.userId);
      if (exists) {
        return {
          statuses: state.statuses.map((s) =>
            s.userId === status.userId ? { ...s, ...status } : s
          ),
        };
      } else {
        return { statuses: [status, ...state.statuses] };
      }
    }),
}));