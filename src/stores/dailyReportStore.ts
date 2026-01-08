import { create } from "zustand";
import {
  DailyReport,
  DrDumpster,
  DREmployee,
  DREquipment,
  DRRental,
  DRTool,
} from "../types";
import { persist } from "zustand/middleware";

type dailyReportStore = {
  dailyReportData: DailyReport;
  setDailyReportData: <K extends keyof DailyReport>(
    key: K,
    value: DailyReport[K]
  ) => void;
  setForeman: (foreman: string) => void;
  setFullDailyReportData: (data: DailyReport) => void;
  setDailyReportStores: (
    employees: DREmployee[],
    equipments: DREquipment[],
    rentals: DRRental[],
    tools: DRTool[],
    dumpsters: DrDumpster[]
  ) => void;
  reset: () => void;
};

const getTodayDate = () => {
  const date = new Date();
  const offset = date.getTimezoneOffset() * 60000;
  const localISOTime = new Date(date.getTime() - offset)
    .toISOString()
    .split("T")[0];
  return localISOTime;
};

const initialData: DailyReport = {
  dailyReportId: null,
  date: getTodayDate(),
  foreman: "",
  userName: "No User",
  description: "",
  manOther: "",
  equipmentOther: "",
  issues: "",
  employees: [],
  equipments: [],
  rentals: [],
  tools: [],
  dumpsters: [],
};

const useDailyReportStore = create<dailyReportStore>()(
  persist(
    (set) => ({
      dailyReportData: initialData,
      setDailyReportData: (key, value) =>
        set((state) => ({
          dailyReportData: {
            ...state.dailyReportData,
            [key]: value,
          },
        })),
      setForeman: (foreman) =>
        set((state) => ({
          dailyReportData: {
            ...state.dailyReportData,
            foreman: foreman,
          },
        })),
      setFullDailyReportData: (data) =>
        set({
          dailyReportData: data,
        }),
      setDailyReportStores: (
        employees,
        equipments,
        rentals,
        tools,
        dumpsters
      ) =>
        set((state) => ({
          dailyReportData: {
            ...state.dailyReportData,
            employees: employees,
            equipments: equipments,
            rentals: rentals,
            tools: tools,
            dumpsters: dumpsters,
          },
        })),

      reset: () => set({ dailyReportData: initialData }),
    }),
    {
      name: "daily-report-storage",
    }
  )
);

export default useDailyReportStore;
