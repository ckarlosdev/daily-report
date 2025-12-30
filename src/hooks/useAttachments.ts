import { useQuery } from "@tanstack/react-query";
import { Attachment } from "../types";
import { api } from "./apiConfig";

const queryAttachments = (): Promise<Attachment[]> => {
    return api.get("/attachments").then((response) => response.data);
}

function useAttachments() {
    return useQuery({
        queryKey: ["attachments"],
        queryFn: queryAttachments,
    });
}

export default useAttachments;