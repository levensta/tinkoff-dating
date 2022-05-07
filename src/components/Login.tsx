import React from 'react';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import Form from "./Form";
import {useNavigate} from "react-router-dom";

const Login = () => {
  const navigate = useNavigate()

  const handleLogin = (email: string, password: string) => {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        navigate('/');
      })
      .catch();
  }

  return (
    <div>
      <Form
        title={"Sign In"}
        handleClick={handleLogin}
      />
    </div>
  );
};

export default Login;
