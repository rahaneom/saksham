import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { useToast } from "./useToast";
function RoleProtectedRoute({ children, allowedRole }) {
  const { user } = useSelector((state) => state.auth);
  const addToast = useToast();

  if (!user) {
    addToast({ message: "Please login first", type: "error" });
    return <Navigate to="/login" />;
  }

  if (user.role !== allowedRole) {
    addToast({ message: "Access denied", type: "error" });
    return <Navigate to="/resources" />;
  }

  return children;
}

export default RoleProtectedRoute;