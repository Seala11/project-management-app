import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import ROUTES from 'utils/constants/ROUTES';

const PrivateRouting = ({ isLogged }: { isLogged: boolean | null }) => {
  if (isLogged === null) return null;
  if (isLogged === false) return <Navigate to={ROUTES.home} />;
  return <Outlet />;
};

const LoginRouting = ({ isLogged }: { isLogged: boolean | null }) => {
  if (isLogged === null) return <Outlet />;
  if (isLogged === false) return <Outlet />;
  return <Navigate to={ROUTES.boards} />;
};

export { PrivateRouting, LoginRouting };
