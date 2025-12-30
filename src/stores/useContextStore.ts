import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AppContext {
  jobId: number | null;
  dailyReportId: number | null;
  isLoaded: boolean;
  showModalCopy: boolean;
  copySelections: {
    manPower: boolean;
    equipment: boolean;
    tool: boolean;
  };
  setIds: (jobId: number | null, reportId: number | null) => void;
  setIsLoaded: (loaded: boolean) => void;
  setShowModalCopy: (show: boolean) => void;
  setCopySelections: (id: string) => void;
  resetCopySelections: () => void;
}

export const useContextStore = create<AppContext>()(
  persist(
    (set) => ({
      jobId: null,
      dailyReportId: null,
      isLoaded: false,
      showModalCopy: false,
      copySelections: {
        manPower: false,
        equipment: false,
        tool: false,
      },
      setIds: (jobId, reportId) => set({ jobId, dailyReportId: reportId }),
      setIsLoaded: (loaded) => set({ isLoaded: loaded }),
      setShowModalCopy: (show) => set({ showModalCopy: show }),
      setCopySelections: (id) =>
        set((state) => ({
          copySelections: {
            ...state.copySelections,
            [id]: !state.copySelections[
              id as keyof typeof state.copySelections
            ],
          },
        })),
      resetCopySelections: () =>
        set({
          copySelections: { manPower: false, equipment: false, tool: false },
        }),
    }),
    { name: "app-context-storage" }
  )
);
