import { useEffect } from "react";
import { Can } from "../components/Can";
import { useAuth } from "../contexts/AuthContext";
import { useCan } from "../hooks/useCan";
import { setupAPIClient } from "../service/api";
import { api } from "../service/apiClient";
import { withSSRAuth } from "../utils/withSSRAuth";

export default function Dashboard() {
  const { user } = useAuth();

  const userCamSeeMetrics = useCan({
    roles: ["administrator", "editor"],
  });
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
      <Can permissions={["metrics.list"]}>
        <div>Métricas</div>
      </Can>
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
