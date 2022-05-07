import {getAuth, createUserWithEmailAndPassword, sendEmailVerification} from "firebase/auth";
import Form from "./Form";

import React from 'react';
import {useNavigate} from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate()

  const handleRegister = (email: string, password: string) => {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        sendEmailVerification(auth.currentUser!)
          .then(r => console.log(r));
        navigate('/');
      })
      .catch();
  }

  return (
    <Form
      title={"Sign Up"}
      handleClick={handleRegister}
    />
  );
};

export default SignUp;
