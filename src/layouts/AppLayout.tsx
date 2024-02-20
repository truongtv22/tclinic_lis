import { Outlet } from "react-router-dom";

export const AppLayout = () => {
  return (
    <div className="container h-[100vh] p-6 mx-auto">
      <Outlet />
    </div>
  );
};
