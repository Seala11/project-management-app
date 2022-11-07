import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import NotFound from './404/NotFound';
import Home from './home/Home';
import SignIn from './sign-in/SignIn';
import SignUp from './sign-up/SignUp';

const Routing = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" />} />
    </Routes>
  );
};

export default Routing;
