import React, {Suspense, lazy} from 'react';

import {Routes, Route, Navigate} from "react-router-dom";
import {useAuth} from "./hooks/useAuth";
import {useAppSelector} from "./hooks/redux-hooks";
import Loader from "./components/Loader";
// import {db} from "./firebase";
// import { collection, getDoc, getDocs, doc, updateDoc, query, where, limit } from "firebase/firestore";

const HomePage = lazy(() => import("./pages/HomePage"));
const AuthPage = lazy(() => import("./pages/AuthPage"));
const SignIn = lazy(() => import("./components/SignIn"));
const SignUp = lazy(() => import("./components/SignUp"));

function AuthenticatedApp() {
  return (
    <Routes>
      <Route path="/" element={<HomePage/>}/>
      <Route path="/login" element={<Navigate to="/"/>} />
      <Route path="/register" element={<Navigate to="/"/>} />
    </Routes>
  );
}

function UnauthenticatedApp() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login"/>}/>
      <Route path="/login" element={
        <AuthPage children={<SignIn/>} />
      }/>
      <Route path="/register" element={
        <AuthPage children={<SignUp/>} />
      }/>
    </Routes>
  );
}

function App() {
  const { isLoggedIn } = useAuth();
  const {isLoading} = useAppSelector(state => state.user);

  return (
    isLoading ? <Loader/> :
      <Suspense fallback={<Loader/>}>
        {isLoggedIn ? <AuthenticatedApp /> : <UnauthenticatedApp />}
      </Suspense>
  );
}

export default App;
