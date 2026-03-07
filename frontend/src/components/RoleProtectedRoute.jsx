import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { showToast } from "../util/toast";
function RoleProtectedRoute({ children, allowedRole }) {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    showToast.error("Please login first");
    return <Navigate to="/login" />;
  }

  if (user.role !== allowedRole) {
    showToast.error("Access denied");
    return <Navigate to="/resources" />;
  }

  return children;
}

export default RoleProtectedRoute;