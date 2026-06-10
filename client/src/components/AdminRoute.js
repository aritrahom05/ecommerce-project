import { Navigate } from "react-router-dom";

export default function AdminRoute({
  user,
  children,
}) {
  if (!user) {
    return <Navigate to="/admin/login" />;
  }

  if (!user.isAdmin) {
    return <Navigate to="/admin/login" />;
  }

  return children;
}
