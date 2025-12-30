import { useQuery } from "@tanstack/react-query";
import { Employee } from "../types";
import { api } from "./apiConfig";

const queryEmployees = (): Promise<Employee[]> => {
  return api.get("/employee").then((response) => response.data);
};

function useEmployees() {
  return useQuery({
    queryKey: ["employees"],
    queryFn: queryEmployees,
  });
}

export default useEmployees;
