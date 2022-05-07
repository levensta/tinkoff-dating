import React from 'react';

import {Navigate} from "react-router-dom";
import {getAuth, signOut} from "firebase/auth";

const HomePage = () => {
  const auth = getAuth();

  const handleLogOut = () => {
    signOut(auth)
      .then(r => r)
      .catch();
  };

  return auth.currentUser ? (
    <div>
      <h1>Welcome</h1>
      <button onClick={handleLogOut}>
        Log Out
      </button>
    </div>
  ) : (
    <Navigate to="/login" />
  )
};

export default HomePage;
