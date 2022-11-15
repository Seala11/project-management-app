import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { authSelector } from 'store/authSlice';
import { useAppSelector } from 'store/hooks';

const PrivateRouting = () => {
  const { isLogged } = useAppSelector(authSelector);
  return isLogged ? <Outlet /> : <Navigate to="/" />;
};

export { PrivateRouting };
