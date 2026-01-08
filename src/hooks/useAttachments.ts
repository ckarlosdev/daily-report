import { useQuery } from "@tanstack/react-query";
import { Attachment } from "../types";
import { api } from "./apiConfig";

const queryAttachments = (): Promise<Attachment[]> => {
  return api.get("v1/attachments").then((response) => response.data);
};

function useAttachments() {
  return useQuery({
    queryKey: ["attachments"],
    queryFn: queryAttachments,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: false,
  });
}

export default useAttachments;
