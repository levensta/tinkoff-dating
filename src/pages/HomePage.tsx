import React from 'react';

import {getAuth, signOut} from "firebase/auth";

const HomePage = () => {
  const auth = getAuth();

  const handleLogOut = () => {
    signOut(auth)
      .then(r => r)
      .catch();
  };

  return (
    <div>
      <h1>Welcome</h1>
      <button onClick={handleLogOut}>
        Log Out
      </button>
    </div>
  );
};

export default HomePage;
