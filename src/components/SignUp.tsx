import {getAuth, createUserWithEmailAndPassword, sendEmailVerification} from "firebase/auth";
import AuthForm from "./AuthForm";

import React from 'react';
import {Link, useNavigate} from "react-router-dom";

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
    <>
      <h1 className={"text-2xl font-medium"}>Регистрация</h1>
      <AuthForm
        title={"Продолжить"}
        handleClick={handleRegister}
      />
      <p>
        Уже есть аккаунт? <Link to="/login" className={"pb-1 text-blue-500 hover:text-blue-700 hover:border-b hover:border-b-blue-700 transition-all"}>Войдите</Link>
      </p>
    </>
  );
};

export default SignUp;
