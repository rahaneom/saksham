import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { showToast } from "../util/toast";

function PrivateRoute({ children }) {
  const { token } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!token) {
    showToast.error("Please login to continue");
    return <Navigate to="/login" state={{ from: location }} />;
  }

  return children;
}

export default PrivateRoute;