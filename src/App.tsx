import React, {Suspense, lazy, useEffect} from 'react';

import {Routes, Route, Navigate} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "./hooks/redux-hooks";
import Loader from "./components/Loader";
import {onAuthStateChanged} from "firebase/auth";
import {auth} from "./firebase";
import {setIsLoading, setIsLoggedIn} from "./store/slices/userSlice";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import AuthPage from "./pages/AuthPage";
// import {db} from "./firebase";
// import { collection, getDoc, getDocs, doc, updateDoc, query, where, limit } from "firebase/firestore";

const HomePage = lazy(() => import("./pages/HomePage"));

function AuthenticatedApp() {
  return (
    <Routes>
      <Route index element={<HomePage/>}/>
      <Route path="/login" element={<Navigate to="/"/>} />
      <Route path="/register" element={<Navigate to="/"/>} />
    </Routes>
  );
}

function UnauthenticatedApp() {
  return (
    <Routes>
      <Route index element={<Navigate to="/login"/>}/>
      <Route path="/" element={<AuthPage/>}>
        <Route path="/login" element={<SignIn/>}/>
        <Route path="/register" element={<SignUp/>}/>
      </Route>
    </Routes>
  );
}

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const subscriber = onAuthStateChanged(auth, (userInfo) => {
      if (userInfo) {
        dispatch(setIsLoggedIn(true));
      } else {
        dispatch(setIsLoggedIn(false));
      }
      dispatch(setIsLoading(false));
    });
    return () => {
      subscriber();
    }
  }, []);

  const {isLoading, isLoggedIn} = useAppSelector(state => state.user);

  return (
    isLoading ? <Loader/> :
      <Suspense fallback={<Loader/>}>
        {isLoggedIn ? <AuthenticatedApp /> : <UnauthenticatedApp />}
      </Suspense>
  );
}

export default App;
