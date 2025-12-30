import { create } from "zustand";
import { DRTool } from "../types";
import { v4 as uuidv4 } from "uuid";
import { persist } from "zustand/middleware";

type ToolStore = {
  assignedTools: DRTool[];

  showModalTool: boolean;
  modalData: DRTool;
  updatingTool: boolean;

  setShowModalTool: (show: boolean) => void;
  setModalData: <K extends keyof DRTool>(key: K, value: DRTool[K]) => void;
  resetModalData: () => void;
  setToolData: (tool: DRTool) => void;
  setUpdatingTool: (updating: boolean) => void;

  addTool: () => void;
  removeTool: (temporalId: string) => void;
  updateTool: (temporalId: string) => void;
  setFullToolData: (data: DRTool[]) => void;
  copyToolsFromApi: (data: DRTool[]) => void;
  reset: () => void;
};

const initialTool: DRTool = {
  temporalId: "",
  drToolId: null,
  dailyReportId: null,
  qty: 1,
  name: "",
  other: "",
  comments: "",
};

const useToolStore = create<ToolStore>()(
  persist(
    (set) => ({
      assignedTools: [],
      showModalTool: false,
      modalData: initialTool,
      updatingTool: false,

      setShowModalTool: (show) => set({ showModalTool: show }),
      setModalData: (key, value) =>
        set((state) => ({
          modalData: {
            ...state.modalData,
            [key]: value,
          },
        })),
      resetModalData: () => set({ modalData: initialTool }),
      setToolData: (tool) => set({ modalData: tool }),
      setUpdatingTool: (updating) => set({ updatingTool: updating }),

      addTool: () =>
        set((state) => {
          const toolToAdd = {
            ...state.modalData,
            temporalId: uuidv4(),
          };
          return {
            assignedTools: [...state.assignedTools, toolToAdd],
            modalData: initialTool,
          };
        }),
      removeTool: (temporalId) =>
        set((state) => ({
          assignedTools: state.assignedTools.filter(
            (tool) => tool.temporalId !== temporalId
          ),
          modalData: initialTool,
        })),
      updateTool: (temporalId) =>
        set((state) => {
          const updated = state.assignedTools.map((tool) =>
            tool.temporalId === temporalId ? state.modalData : tool
          );
          return {
            assignedTools: updated,
            modalData: initialTool,
          };
        }),
      setFullToolData: (data) =>
        set(() => ({
          assignedTools: data,
        })),
      copyToolsFromApi: (data) =>
        set((state) => ({
          assignedTools: [
            ...data.map((tool) => ({
              ...tool,
              drToolId: null,
              temporalId: uuidv4(),
            })),
            ...state.assignedTools,
          ],
        })),
      reset: () => set({ assignedTools: [] }),
    }),
    {
      name: "tools-storage", // Nombre único en LocalStorage
    }
  )
);

export default useToolStore;
