import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { authSelector } from 'store/authSlice';
import { useAppSelector } from 'store/hooks';
import ROUTES from 'utils/constants/ROUTES';

const PrivateRouting = () => {
  const { isLogged } = useAppSelector(authSelector);
  return isLogged ? <Outlet /> : <Navigate to={ROUTES.home} />;
};

const LoginRouting = () => {
  const { isLogged } = useAppSelector(authSelector);
  // if (isLogged) {
  //   return <Navigate to={ROUTES.boards} />;
  // } else return <Outlet />;
  return isLogged ? <Navigate to={ROUTES.boards} /> : <Outlet />;
};

export { PrivateRouting, LoginRouting };
