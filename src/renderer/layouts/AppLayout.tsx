import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

import { selectIsAuth } from "renderer/store/app/selectors";

export const AppLayout = () => {
  const isAuth = useSelector(selectIsAuth);
  if (isAuth) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="container h-[100vh] p-6 mx-auto">
      <Outlet />
    </div>
  );
};
