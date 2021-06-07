import axios, { AxiosError } from "axios";
import { parseCookies, setCookie } from "nookies";
import { signOut } from "../contexts/AuthContext";
let cookies = parseCookies();
let isRefresh = false;
let failedRequestQueue = [];
export const api = axios.create({
  baseURL: "http://localhost:3333",
  headers: {
    Authorization: `Bearer ${cookies["@nextAuth.token"]}`,
  },
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response.status === 401) {
      if (error.response.data?.code === "token.expired") {
        cookies = parseCookies();
        const { "@nextAuth.refreshToken": refreshToken } = cookies;
        //renovar o token
        const originalConfig = error.config;
        if (!isRefresh) {
          isRefresh = true;
          api
            .post("/refresh", {
              refreshToken,
            })
            .then((response) => {
              const { token, refreshToken: RefreshToken } = response.data;

              setCookie(undefined, "@nextAuth.token", token, {
                maxAge: 60 * 60 * 24 * 30, // 30 days
                path: "/",
              });
              setCookie(undefined, "@nextAuth.refreshToken", RefreshToken, {
                maxAge: 60 * 60 * 24 * 30, // 30 days
                path: "/",
              });
              api.defaults.headers["Authorization"] = `Bearer ${token}`;
              failedRequestQueue.forEach((request) => request.onSuccess(token));
              failedRequestQueue = [];
            })
            .catch((err) => {
              failedRequestQueue.forEach((request) => request.onFailure(err));
              failedRequestQueue = [];
            })
            .finally(() => {
              isRefresh = false;
            });
        }
        return new Promise((resolve, reject) => {
          failedRequestQueue.push({
            onSuccess: (token: string) => {
              originalConfig.headers["Authorization"] = `Bearer ${token}`;

              resolve(api(originalConfig));
            },
            onFailure: (err: AxiosError) => {
              reject(err);
            },
          });
        });
      } else {
        //deslogar o user
        signOut();
      }
    }
    return Promise.reject(error);
  }
);
