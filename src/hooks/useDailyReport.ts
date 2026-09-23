import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "./apiConfig";
import { DailyReport, DrTotals } from "../types";
import { useContextStore } from "../stores/useContextStore";

const queryDailyReport = async (
  dailyReportId: number,
): Promise<DailyReport> => {
  const { data } = await api.get(`v1/dailyReport/dto/${dailyReportId}`);
  return data;
};

export function useDailyReport(dailyReportId: number) {
  return useQuery({
    queryKey: ["dailyReport", dailyReportId],
    queryFn: () => queryDailyReport(dailyReportId!),
    enabled: !!dailyReportId,
    retry: false,
  });
}

const queryDrTotals = async (
  jobNumber: string,
  date: string,
): Promise<DrTotals> => {
  const { data } = await api.get(
    `v1/dailyReport/totals/${jobNumber}/by-date?date=${date}`,
  );
  return data;
};

export function useDrTotals(jobNumber: string, date: string) {
  return useQuery({
    queryKey: ["drTotals", jobNumber, date],
    queryFn: () => queryDrTotals(jobNumber, date),
    enabled: !!jobNumber && !!date,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

const createDailyReport = async ({
  reportData,
  jobId,
}: {
  reportData: DailyReport;
  jobId: number;
}) => {
  const config = { timeout: 30000 };

  if (reportData.dailyReportId) {
    return api.put(`v1/dailyReport`, reportData, config);
  }
  return api.post(`v1/dailyReport/${jobId}`, reportData, config);
};

export function useSaveDailyReport() {
  const queryClient = useQueryClient();
  const jobId = useContextStore((s) => s.jobId);

  return useMutation({
    mutationFn: createDailyReport,
    onSuccess: async (response) => {
      const newId = response.data.dailyReportId;
      await queryClient.invalidateQueries({ queryKey: ["dailyReport", newId] });
      alert("Data saved successfully.");
      window.location.href = `https://ckarlosdev.github.io/binder-webapp/#/binder/${jobId}`;
    },
    onError: (error) => {
      console.error("Mutation Error:", error);
      if (error.message === "Network Error") {
        console.warn("Posible falso positivo por redirección");
      } else {
        alert("Error saving data.");
      }
    },
  });
}
