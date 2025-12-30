import { create } from "zustand";
import { DrDumpster } from "../types";
import { persist } from "zustand/middleware";

type DumpstersStore = {
  assignedDumpsters: DrDumpster[];
  showModalDumpster: boolean;
  tableData: any[];

  setShowModalDumpster: (show: boolean) => void;
  setTableData: (rowIndex: number, columnName: string, value: string) => void;
  getApiPayload: (data: DrDumpster[]) => void;
  fillTableFromApi: (apiData: DrDumpster[]) => void;
  reset: () => void;
};

const initialData = [
  { type: "Disposal", size: "40 yds", Concrete: 0, Metal: 0, "C&D": 0 },
  { type: "Disposal", size: "35 yds", Concrete: 0, Metal: 0, "C&D": 0 },
  { type: "Disposal", size: "30 yds", Concrete: 0, Metal: 0, "C&D": 0 },
  { type: "Disposal", size: "20 yds", Concrete: 0, Metal: 0, "C&D": 0 },
  { type: "Disposal", size: "12 yds", Concrete: 0, Metal: 0, "C&D": 0 },
  { type: "Disposal", size: "Quad", Concrete: 0, Metal: 0, "C&D": 0 },
  { type: "Disposal", size: "Semi", Concrete: 0, Metal: 0, "C&D": 0 },
  { type: "Disposal", size: "Gondola", Concrete: 0, Metal: 0, "C&D": 0 },
  { type: "External", size: "40 yds", Concrete: 0, Metal: 0, "C&D": 0 },
  { type: "External", size: "35 yds", Concrete: 0, Metal: 0, "C&D": 0 },
  { type: "External", size: "30 yds", Concrete: 0, Metal: 0, "C&D": 0 },
  { type: "External", size: "20 yds", Concrete: 0, Metal: 0, "C&D": 0 },
  { type: "External", size: "12 yds", Concrete: 0, Metal: 0, "C&D": 0 },
  { type: "External", size: "Quad", Concrete: 0, Metal: 0, "C&D": 0 },
  { type: "External", size: "Semi", Concrete: 0, Metal: 0, "C&D": 0 },
  { type: "External", size: "Gondola", Concrete: 0, Metal: 0, "C&D": 0 },
];

const useDumpsterStore = create<DumpstersStore>()(
  persist(
    (set) => ({
      assignedDumpsters: [],
      showModalDumpster: false,
      tableData: initialData,

      setShowModalDumpster: (show) => set({ showModalDumpster: show }),
      setTableData: (rowIndex, columnName, value) =>
        set((state) => {
          const numericValue = parseInt(value, 10) || 0;

          const updatedTableData = state.tableData.map((row, index) => {
            if (index === rowIndex) {
              return {
                ...row,
                [columnName]: numericValue,
              };
            }
            return row;
          });
          return { tableData: updatedTableData };
        }),

      getApiPayload: (data) =>
        set(() => ({
          assignedDumpsters: data,
        })),

      fillTableFromApi: (apiData) =>
        set(() => {
          const newTableData = initialData.map((row) => ({ ...row }));

          apiData.forEach((item) => {
            const rowIndex = newTableData.findIndex(
              (row) =>
                row.type === item.sourceDumpster &&
                row.size.replace(/\s/g, "") ===
                  item.sizeDumpster.replace(/\s/g, "")
            );

            if (rowIndex !== -1) {
              const columnName = item.typeDumpster as
                | "Concrete"
                | "Metal"
                | "C&D";
              newTableData[rowIndex][columnName] = item.quantity;
            }
          });

          return { tableData: newTableData };
        }),
      reset: () => set({ tableData: initialData, assignedDumpsters: [] }),
    }),
    {
      name: "dumpsters-storage", // Nombre único en LocalStorage
    }
  )
);

export default useDumpsterStore;
