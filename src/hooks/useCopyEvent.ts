import { useQuery } from "@tanstack/react-query";
import { DrResources } from "../types";
import { api } from "./apiConfig";

const queryDrResources = (jobNumber: string): Promise<DrResources> => {
  return api
    .get(`v1/dailyReport/resources/${jobNumber}`)
    .then((response) => response.data);
};

export default function useCopyResources(jobNumber: string) {
  return useQuery({
    queryKey: ["drResources", jobNumber],
    queryFn: () => queryDrResources(jobNumber),
    enabled: !!jobNumber,
    staleTime: 5 * 60 * 1000, 
    gcTime: 10 * 60 * 1000, 
    retry: false,
  });
}
