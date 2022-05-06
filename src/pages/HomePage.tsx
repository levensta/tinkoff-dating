import React from 'react';

import {useAuth} from "../hooks/useAuth";
import {Navigate} from "react-router-dom";
import {removeUser} from "../store/slices/userSlice";
import {useAppDispatch} from "../hooks/redux-hooks";

const HomePage = () => {
  const {isAuth, email} = useAuth();
  const dispatch = useAppDispatch();

  const handleLogOut = () => {
    dispatch(removeUser());
  }

  return isAuth ? (
    <div>
      <h1>Welcome</h1>
      <button onClick={handleLogOut}>
        Log Out from {email}
      </button>
    </div>
  ) : (
    <Navigate to="/login" />
  )
};

export default HomePage;
