import axios, { AxiosError } from "axios";
import { parseCookies, setCookie } from "nookies";
let cookies = parseCookies();
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
          });
      } else {
        //deslogar o user
      }
    }
  }
);