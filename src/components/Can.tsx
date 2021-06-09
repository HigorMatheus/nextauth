import { ReactNode } from "react";
import { useCan } from "../hooks/useCan";

interface CamParams {
  children: ReactNode;
  permissions?: string[];
  roles?: string[];
}

export function Can({ children, permissions, roles }: CamParams) {
  const useCanSeeComponent = useCan({ permissions, roles });

  if (!useCanSeeComponent) {
    return null;
  }
  return <>{children}</>;
}
