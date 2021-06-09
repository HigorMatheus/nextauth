import { useAuth } from "../contexts/AuthContext";
import { validateUserPermissions } from "../utils/validateUserPermissions";

type UseCamParams = {
  permissions?: string[];
  roles?: string[];
};

export function useCan({ permissions, roles }: UseCamParams) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return false;
  }

  const userHasValidatePermissions = validateUserPermissions({
    user,
    permissions,
    roles,
  });

  return userHasValidatePermissions;
}
