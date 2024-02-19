import { Outlet } from 'react-router-dom';

export default function ProtectedLayout() {
  return (
    <div>
      ddd
      <Outlet />
    </div>
  );
}
