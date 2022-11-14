import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import ROUTES from 'utils/constants/ROUTES';
import NotFound from './404/NotFound';
import Board from './board/Board';
import Boards from './boards/Boards';
import Home from './home/Home';
import Settings from './settings/Settings';
import SignIn from './registration/sign-in/SignIn';
import SignUp from './registration/sign-up/SignUp';

const Routing = () => {
  return (
    <Routes>
      <Route path={ROUTES.home} element={<Home />} />
      <Route path={ROUTES.signIn} element={<SignIn />} />
      <Route path={ROUTES.signUp} element={<SignUp />} />
      <Route path={ROUTES.settings} element={<Settings />} />
      <Route path={ROUTES.boards} element={<Boards />} />
      <Route path={ROUTES.board} element={<Board />} />
      <Route path={ROUTES.notFound} element={<NotFound />} />
      <Route path={ROUTES.default} element={<Navigate to={ROUTES.notFound} />} />
    </Routes>
  );
};

export default Routing;
