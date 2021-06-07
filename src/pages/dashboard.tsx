import Router from "next/router";
import { destroyCookie } from "nookies";
import { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../service/api";

export default function Dashboard() {
  const { user } = useAuth();

  useEffect(() => {
    api
      .get("/me")
      .then((response) => {
        const { email, permissions, roles } = response.data;
      })
      .catch((err) => console.log(err));
  }, []);
  return (
    <div>
      <h1>Dashboard {user?.email}</h1>
    </div>
  );
}
