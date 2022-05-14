import React from 'react';

import {signOut} from "firebase/auth";
import {auth} from "../firebase";

const HomePage = () => {

  const handleLogOut = () => {
    signOut(auth)
      .then(r => console.log(r))
      .catch(err => console.log(err));
  };

  return (
    <div>
      <h1>Welcome, {auth?.currentUser?.displayName}</h1>
      <button onClick={handleLogOut}>
        Log Out
      </button>
    </div>
  );
};

export default HomePage;
