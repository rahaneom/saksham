import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { showToast } from "../util/toast";
function RoleProtectedRoute({ children, allowedRole }) {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!user) {
    showToast.error("Please login first");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user.role !== allowedRole) {
    showToast.error("Access denied");
    return <Navigate to="/resources" replace />;
  }

  return children;
}

export default RoleProtectedRoute;