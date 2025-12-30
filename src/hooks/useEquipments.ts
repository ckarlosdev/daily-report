import { useQuery } from "@tanstack/react-query";
import { Equipment } from "../types";
import { api } from "./apiConfig";

const queryEquipments = (): Promise<Equipment[]> => {
  return api.get("/equipments").then((response) => response.data);
};

function useEquipments() {
  return useQuery({
    queryKey: ["equipments"],
    queryFn: queryEquipments,
  });
}

export default useEquipments;
