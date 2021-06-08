import { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { setupAPIClient } from "../service/api";
import { api } from "../service/apiClient";
import { withSSRAuth } from "../utils/withSSRAuth";

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

export const getServerSideProps = withSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx);
  const response = await apiClient.get("me");
  return {
    props: {},
  };
});
