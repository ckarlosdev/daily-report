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
  clearAuth: () => void;
}

const storedToken = localStorage.getItem("auth_token");
const storedRefreshToken = localStorage.getItem("refresh_token");

export const useAuthStore = create<AuthState>((set) => ({
  token: storedToken,
  refreshToken: storedRefreshToken,
  isAuthenticated: !!storedToken,
  user: null,

  // token:
  //   "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6WyJST0xFX0FETUlOIl0sInN1YiI6ImNyYW1pcmV6QGhtYnJhbmR0LmNvbSIsImlhdCI6MTc3NTQ5Mzk3MiwiZXhwIjoxNzc1NDk0ODcyfQ.tlvi-rd4pKTZ7sHbbSV-3MIU12_H6tkozzFv9BOfGA4",
  // refreshToken: "ec1c2dd2-f3f8-4f1f-933a-56712bb6a7d7.c7ac27f7-082c-43b4-8e47-84755c2fb3e8",
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
  clearAuth: () => set({ user: null, isAuthenticated: false }),
}));
