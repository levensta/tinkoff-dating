import React, {Suspense, lazy, useEffect} from 'react';

import {Routes, Route, Navigate, useLocation} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "./hooks/redux-hooks";
import {onAuthStateChanged} from "firebase/auth";
import {auth} from "./firebase.config";
import {setIsLoading, setIsLoggedIn} from "./store/slices/userSlice";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import AuthPage from "./pages/AuthPage";
import Layout from "./Layout";
import NotFound from "./pages/NotFound";
import ScreenLoader from "components/Loaders/ScreenLoader";
import ChatPage from "./pages/ChatPage";

const HomePage = lazy(() => import("./pages/HomePage"));

function AuthenticatedApp() {
  return (
    <Routes>
      <Route path="/" element={<Layout/>}>
        <Route index element={<HomePage/>} />
        <Route path="/matches" element={<HomePage/>} />
        <Route path="/matches/:chatId" element={<ChatPage/>} />
        <Route path="/settings" element={<></>} />
        <Route path="/profile" element={<></>} />
        <Route path="/profile/edit" element={<></>} />
      </Route>
      <Route path="*" element={<NotFound/>} />
      <Route path="/login" element={<Navigate to="/"/>} />
      <Route path="/register" element={<Navigate to="/"/>} />
    </Routes>
  );
}

function UnauthenticatedApp() {
  const location = useLocation();

  return (
    <Routes>
      <Route path="/" element={<Layout/>}>
        <Route index element={<Navigate to="/login"/>} />
        <Route path="/matches" element={<Navigate to="/login" state={{from: location.pathname}}/>} />
        <Route path="/matches/:chatId" element={<Navigate to="/login" state={{from: location.pathname}}/>} />
        <Route path="/settings" element={<Navigate to="/login" state={{from: location.pathname}}/>} />
        <Route path="/profile" element={<Navigate to="/login" state={{from: location.pathname}}/>} />
        <Route path="/profile/edit" element={<Navigate to="/login" state={{from: location.pathname}}/>} />
      </Route>
      <Route path="*" element={<NotFound/>} />
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
      console.log(1)
      if (userInfo) {
        dispatch(setIsLoggedIn(true));
      } else {
        dispatch(setIsLoggedIn(false));
      }
      dispatch(setIsLoading(false));
    });
    return subscriber();
  }, []);

  const {isLoading, isLoggedIn} = useAppSelector(state => state.user);

  return (
    isLoading ? null :
      <Suspense fallback={<ScreenLoader/>}>
        {isLoggedIn ? <AuthenticatedApp /> : <UnauthenticatedApp />}
      </Suspense>
  );
}

export default App;
