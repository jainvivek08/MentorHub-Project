import React from "react";
import useUserStore from "../store/user";
import { Navigate } from "react-router-dom";

const ProtectedRoute = (props) => {
  const { children, roles } = props;
  const { user } = useUserStore();

  if (!user) {
    // TODO: add redirect query
    return <Navigate to="/signin" />;
  }

  // If specific roles are required for this route (e.g. admin-only pages)
  // and the logged-in user doesn't have one of them, bounce them out.
  if (roles && roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/dashboard/overview" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
