import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const RequireAuth = ({ allowedRoles }) => {
  const role = useSelector((state) => state.auth.role);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles.includes(role)) {
    // console.log(role);
    return <Outlet />;
  }

  return <Navigate to="/denied" />;
};

export default RequireAuth;
