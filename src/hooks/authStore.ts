import { create } from "zustand";
import { User } from "../types";

interface AuthState {
  token: string | null;
  refreshToken?: string | null;
  isAuthenticated: boolean;
  user: User | null;
  login: (token: string, refreshToken: string) => void;
  logout: () => void;
  setUser: (user: User | null) => void;
}

const storedToken = localStorage.getItem("auth_token");
const storedRefreshToken = localStorage.getItem("refresh_token");

export const useAuthStore = create<AuthState>((set) => ({
  token: storedToken,
  refreshToken: storedRefreshToken,
  isAuthenticated: !!storedToken,
  user: null,

  // token:
  //   "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiJhM2EzYmI4NS04YzMzLTQ5OGYtYmI4Mi04NGI5YjA1MGExMWYiLCJlbWFpbCI6ImNyYW1pcmV6QGhtYnJhbmR0LmNvbSIsInN1YiI6ImEzYTNiYjg1LThjMzMtNDk4Zi1iYjgyLTg0YjliMDUwYTExZiIsImlhdCI6MTc3MDc0NTU5MSwiZXhwIjoxNzcwNzQ2NDkxfQ.t_pMde8BLqoWms4Lmen4zJJbYKioRd8nemJZ5E0fd3o",
  // refreshToken: "9d71e9b7-909e-46cf-83b3-72bc2cf8ce89",
  // isAuthenticated: true,


  login: (token: string, refreshToken: string) => {
    localStorage.setItem("auth_token", token);
    localStorage.setItem("refresh_token", refreshToken);
    set({ token, refreshToken, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("refresh_token");
    set({
      token: null,
      isAuthenticated: false,
      user: null,
      refreshToken: null,
    });
  },

  setUser: (user) => set({ user }),
}));
