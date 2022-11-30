import React, { lazy } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import ROUTES from 'utils/constants/ROUTES';
const NotFound = lazy(() => import('./404/NotFound'));
const Board = lazy(() => import('./board/Board'));
const Boards = lazy(() => import('./boards/Boards'));
import Home from './home/Home';
const Settings = lazy(() => import('./settings/Settings'));
import SignIn from './registration/sign-in/SignIn';
import SignUp from './registration/sign-up/SignUp';
import { LoginRouting, PrivateRouting } from './privateRouting';
import { useAppSelector } from 'store/hooks';
import { authSelector } from 'store/authSlice';

const Routing = () => {
  const { isLogged } = useAppSelector(authSelector);
  return (
    <Routes>
      <Route path={ROUTES.home} element={<Home />} />

      <Route element={<LoginRouting isLogged={isLogged} />}>
        <Route path={ROUTES.signUp} element={<SignUp />} />
        <Route path={ROUTES.signIn} element={<SignIn />} />
      </Route>

      <Route element={<PrivateRouting isLogged={isLogged} />}>
        <Route path={ROUTES.boards} element={<Boards />} />
        <Route path={ROUTES.settings} element={<Settings />} />
        <Route path={ROUTES.board} element={<Board />} />
      </Route>

      <Route path={ROUTES.notFound} element={<NotFound />} />
      <Route path={ROUTES.default} element={<Navigate to={ROUTES.notFound} />} />
    </Routes>
  );
};

export default Routing;
