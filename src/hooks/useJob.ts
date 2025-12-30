import { useQuery } from "@tanstack/react-query";
import { Job } from "../types";
import { api } from "./apiConfig";

const queryJob = async (jobId: number): Promise<Job> => {
  const { data } = await api.get<Job>(`/job/${jobId}`);
  return data;
};

function useJob(jobId: number) {
  return useQuery({
    queryKey: ["job", jobId],
    queryFn: () => queryJob(jobId!),
    enabled: !!jobId,
    retry: false,
  });
}

export default useJob;
