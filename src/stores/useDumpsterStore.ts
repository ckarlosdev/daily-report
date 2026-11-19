import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DrDumpster, DumpsterRow, DumpsterSource } from "../types";
import {
  BASE_MATERIALS,
  MaterialResult,
  buildEmptyTable,
  buildPayload,
  buildTableFromApi,
  findRow,
  isBaseMaterial,
  normalizeMaterial,
} from "../utils/dumpsters";

type DumpstersStore = {
  assignedDumpsters: DrDumpster[];
  showModalDumpster: boolean;
  materials: string[];
  tableData: DumpsterRow[];

  setShowModalDumpster: (show: boolean) => void;
  setQuantity: (
    source: DumpsterSource,
    size: string,
    material: string,
    value: string,
  ) => void;
  addMaterial: (name: string) => MaterialResult;
  removeMaterial: (material: string) => void;
  fillTableFromApi: (apiData: DrDumpster[]) => void;
  reset: () => void;
};

// assignedDumpsters (lo que se guarda) siempre se recalcula desde la tabla
const withPayload = (tableData: DumpsterRow[], materials: string[]) => ({
  tableData,
  materials,
  assignedDumpsters: buildPayload(tableData, materials),
});

const useDumpsterStore = create<DumpstersStore>()(
  persist(
    (set, get) => ({
      showModalDumpster: false,
      ...withPayload(buildEmptyTable(), [...BASE_MATERIALS]),

      setShowModalDumpster: (show) => set({ showModalDumpster: show }),

      setQuantity: (source, size, material, value) =>
        set((state) => {
          const parsed = parseInt(value, 10);
          const quantity = Number.isNaN(parsed) || parsed < 0 ? 0 : parsed;

          const tableData = state.tableData.map((row) =>
            row.type === source && row.size === size
              ? { ...row, values: { ...row.values, [material]: quantity } }
              : row,
          );
          return withPayload(tableData, state.materials);
        }),

      addMaterial: (name) => {
        const { materials, tableData } = get();
        const result = normalizeMaterial(name, materials);
        if (result.ok) {
          set(withPayload(tableData, [...materials, result.name]));
        }
        return result;
      },

      removeMaterial: (material) =>
        set((state) => {
          if (isBaseMaterial(material)) return {};

          // Se quitan valores e ids: al no mandarse, el backend hace soft delete
          const tableData = state.tableData.map((row) => {
            const values = { ...row.values };
            const ids = { ...row.ids };
            delete values[material];
            delete ids[material];
            return { ...row, values, ids };
          });
          const materials = state.materials.filter((m) => m !== material);
          return withPayload(tableData, materials);
        }),

      fillTableFromApi: (apiData) =>
        set(() => {
          const { tableData, materials } = buildTableFromApi(apiData);
          return withPayload(tableData, materials);
        }),

      reset: () => set(withPayload(buildEmptyTable(), [...BASE_MATERIALS])),
    }),
    {
      name: "dumpsters-storage", // Nombre único en LocalStorage
      version: 2,
      // v1 guardaba las filas como { type, size, Concrete, Metal, "C&D" }
      migrate: (persistedState, version) => {
        const state = (persistedState ?? {}) as Record<string, unknown>;
        if (version >= 2) return state as DumpstersStore;

        const oldRows = (
          Array.isArray(state.tableData) ? state.tableData : []
        ) as Record<string, unknown>[];
        const oldAssigned = (
          Array.isArray(state.assignedDumpsters) ? state.assignedDumpsters : []
        ) as DrDumpster[];

        const tableData = buildEmptyTable();
        oldRows.forEach((old) => {
          const row = findRow(tableData, String(old?.type), String(old?.size));
          if (!row) return;
          BASE_MATERIALS.forEach((material) => {
            const qty = Number(old[material]) || 0;
            if (qty > 0) row.values[material] = qty;
          });
        });

        // Se conservan los ids que hubiera para hacer UPDATE en lugar de INSERT
        oldAssigned.forEach((item) => {
          if (item?.drDumpstersId == null) return;
          const row = findRow(tableData, item.sourceDumpster, item.sizeDumpster);
          if (row && BASE_MATERIALS.includes(item.typeDumpster)) {
            row.ids[item.typeDumpster] = item.drDumpstersId;
          }
        });

        return {
          ...state,
          ...withPayload(tableData, [...BASE_MATERIALS]),
        } as DumpstersStore;
      },
    },
  ),
);

export default useDumpsterStore;
