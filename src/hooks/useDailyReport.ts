import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "./apiConfig";
import { DailyReport, DrTotals } from "../types";

const queryDailyReport = async (
  dailyReportId: number
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
  date: string
): Promise<DrTotals> => {
  const { data } = await api.get(
    `v1/dailyReport/totals/${jobNumber}/by-date?date=${date}`
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
  if (reportData.dailyReportId) {
    return api.put(`v1/dailyReport`, reportData);
  }
  return api.post(`v1/dailyReport/${jobId}`, reportData);
};

export function useSaveDailyReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createDailyReport,
    onSuccess: (response) => {
      const newId = response.data.dailyReportId;
      queryClient.invalidateQueries({ queryKey: ["dailyReport", newId] });
      // queryClient.invalidateQueries({ queryKey: ["dailyReports"] }); es para el listado de dailyreports
      alert("Reporte guardado con éxito");
    },
    onError: () => {
      alert("Error al guardar el reporte diario");
    },
  });
}
