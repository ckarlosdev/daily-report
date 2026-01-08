import { useAuthStore } from "./authStore";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import useDailyReportStore from "../stores/dailyReportStore";
import { api } from "./apiConfig";

const queryMe = async () => {
  const { data } = await api.get("auth/me");
  return data;
};

function useUser() {
  const token = useAuthStore((state) => state.token);
  const setUser = useAuthStore((state) => state.setUser);
  const setDailyReportData = useDailyReportStore(
    (state) => state.setDailyReportData
  );

  const query = useQuery({
    queryKey: ["user", token],
    queryFn: queryMe,
    enabled: !!token,
    staleTime: 5 * 60 * 1000, 
    gcTime: 10 * 60 * 1000, 
    retry: false,
  });

  useEffect(() => {
    if (query.data) {
      setUser(query.data);
      setDailyReportData("userName", query.data.email);
    }
  }, [query.data]);

  return query;
}

export default useUser;
