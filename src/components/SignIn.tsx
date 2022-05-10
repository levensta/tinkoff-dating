import React from 'react';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import AuthForm from "./AuthForm";
import {Link, useNavigate} from "react-router-dom";

const SignIn = () => {
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
    <>
      <h1 className={"text-2xl font-medium"}>Авторизуйтесь</h1>
      <AuthForm
        title={"Войти"}
        handleClick={handleLogin}
      />
      <p>
        Нет аккаунта? <Link to="/register" className={"pb-1 text-blue-500 hover:text-blue-700 hover:border-b hover:border-b-blue-700 transition-all"}>Зарегистрируйтесь</Link>
      </p>
    </>
  );
};

export default SignIn;
