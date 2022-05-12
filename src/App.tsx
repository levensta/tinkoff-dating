import React from 'react';

import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";

import {Routes, Route, Navigate} from "react-router-dom";
import {useAuth} from "./hooks/useAuth";
import {useAppSelector} from "./hooks/redux-hooks";
import Loader from "./components/Loader";

function App() {
  const { isLoggedIn } = useAuth();
  const {isLoading} = useAppSelector(state => state.user);


  return (
    <Routes>
      <Route path="/" element={
        isLoading ? <Loader/> :
          isLoggedIn ? <HomePage/>
          : <Navigate to='/login' />
      }/>
      <Route path="/login" element={
        isLoading ? <Loader/> :
          !isLoggedIn ? <AuthPage children={<SignIn/>} />
          : <Navigate to='/' replace />
      }/>
      <Route path="/register" element={
        isLoading ? <Loader/> :
          !isLoggedIn ? <AuthPage children={<SignUp/>} />
          : <Navigate to='/' replace />
      }/>
    </Routes>
  );
}

export default App;
