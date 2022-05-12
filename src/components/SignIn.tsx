import React from 'react';

import {signInWithEmailAndPassword } from "firebase/auth";
import {auth} from "../firebase";

import AuthForm from "./AuthForm";
import {Link, useNavigate} from "react-router-dom";
import styles from "./elements.module.css";

const SignIn = () => {
  const navigate = useNavigate()

  const handleLogin = (email: string, password: string) => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        navigate('/');
      })
      .catch(error => {
        // save error messages in state?
        switch (error.code) {
          case 'auth/invalid-email':
          case 'auth/user-disabled':
          case 'auth/user-not-found':
          case 'auth/wrong-password':
          default:
            return alert(error.message);
        }
      });
  }

  return (
    <>
      <h1 className={"text-2xl font-medium"}>Авторизуйтесь</h1>
      <AuthForm
        title={"Войти"}
        handleAuth={handleLogin}
      />
      <p>
        Нет аккаунта? <Link to="/register" className={styles.link_underlined}>Зарегистрируйтесь</Link>
      </p>
    </>
  );
};

export default SignIn;
