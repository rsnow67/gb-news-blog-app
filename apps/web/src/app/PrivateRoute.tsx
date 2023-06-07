import { Navigate, Route, RouteProps } from "react-router-dom";

interface Props {
  isAuthorized: boolean;
}

const PrivateRoute: React.FC<Props & RouteProps> = ({
  isAuthorized,
  ...routeProps
}) => {
  if (!isAuthorized) {
    return <Navigate to="/login"></Navigate>;
  }

  return <Route {...routeProps} />;
};

export default PrivateRoute;
