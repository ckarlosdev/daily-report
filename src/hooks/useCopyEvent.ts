import { useQuery } from "@tanstack/react-query";
import { DrResources } from "../types";
import { api } from "./apiConfig";

const queryDrResources = (jobNumber: string): Promise<DrResources> => {
  return api
    .get(`/dailyReport/resources/${jobNumber}`)
    .then((response) => response.data);
};

export default function useCopyResources(jobNumber: string) {
  return useQuery({
    queryKey: ["drResources", jobNumber],
    queryFn: () => queryDrResources(jobNumber),
    enabled: !!jobNumber,
    retry: false,
  });
}
