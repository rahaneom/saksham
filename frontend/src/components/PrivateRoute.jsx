import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { useToast } from "./useToast";

function PrivateRoute({ children }) {
  const { token } = useSelector((state) => state.auth);
  const location = useLocation();
  const addToast = useToast();

  if (!token) {
    addToast({ message: "Please login to continue", type: "error" });
    return <Navigate to="/login" state={{ from: location }} />;
  }

  return children;
}

export default PrivateRoute;