import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import ROUTES from 'utils/constants/ROUTES';

const PrivateRouting = ({ isLogged }: { isLogged: boolean }) => {
  return isLogged ? <Outlet /> : <Navigate to={ROUTES.home} />;
};

const LoginRouting = ({ isLogged }: { isLogged: boolean }) => {
  return isLogged ? <Navigate to={ROUTES.boards} /> : <Outlet />;
};

export { PrivateRouting, LoginRouting };
