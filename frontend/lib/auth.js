import Cookies from "js-cookie";
import api from "./api";

export const login = async (email, password) => {
  const { data } = await api.post("/auth/login", { email, password });
  Cookies.set("token", data.token, {
    expires: 7,
    secure: true,
    sameSite: "None",
  });
  return data.user;
};

export const register = async (name, email, password) => {
  const { data } = await api.post("/auth/register", { name, email, password });
  Cookies.set("token", data.token, {
    expires: 7,
    secure: true,
    sameSite: "None",
  });
  return data.user;
};

export const logout = () => {
  Cookies.remove("token");
  window.location.href = "/login";
};

export const getMe = async () => {
  const { data } = await api.get("/auth/me");
  return data.user;
};

export const isLoggedIn = () => !!Cookies.get("token");
