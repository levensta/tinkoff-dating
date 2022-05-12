import React from 'react';

import {createUserWithEmailAndPassword, sendEmailVerification} from "firebase/auth";
import {auth} from "../firebase";

import AuthForm from "./AuthForm";
import {Link, useNavigate} from "react-router-dom";
import styles from "./elements.module.css";

const SignUp = () => {
  const navigate = useNavigate()

  const handleRegister = (email: string, password: string) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        sendEmailVerification(auth.currentUser!)
          .then(r => console.log(r));
        navigate('/');
      })
      .catch(error => {
        // save error messages in state?
        switch (error.code) {
          case 'auth/email-already-in-use':
          case 'auth/weak-password':
          default:
            return alert(error.message);
        }
      });
  }

  return (
    <>
      <h1 className={"text-2xl font-medium"}>Регистрация</h1>
      <AuthForm
        title={"Продолжить"}
        handleAuth={handleRegister}
      />
      <p>
        Уже есть аккаунт? <Link to="/login" className={styles.link_underlined}>Войдите</Link>
      </p>
    </>
  );
};

export default SignUp;
