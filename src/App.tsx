import React from 'react';

import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";

import {Routes, Route, Navigate} from "react-router-dom";

import {getAuth} from "firebase/auth";

function App() {
  const auth = getAuth();

  return (
    <Routes>
      <Route path="/" element={auth.currentUser ? <HomePage/> : <Navigate to="/login" />} />
      <Route path="/login" element={<AuthPage children={<SignIn/>} />} />
      <Route path="/register" element={<AuthPage children={<SignUp/>} />} />
    </Routes>
  );
}

export default App;
