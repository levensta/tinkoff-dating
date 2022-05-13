import React from 'react';

import {signInWithEmailAndPassword } from "firebase/auth";
import {auth} from "../firebase";

import {Link, useNavigate} from "react-router-dom";
import styles from "./elements.module.css";
import {SubmitHandler, useForm} from "react-hook-form";
import {IAuthFormFields} from "../types";
import cn from "classnames";

const SignIn = () => {
  const navigate = useNavigate()
  const {
    register,
    formState: { errors },
    handleSubmit,
    setError
  } = useForm<IAuthFormFields>({
    mode: 'onBlur'
  });

  const handleLogin: SubmitHandler<IAuthFormFields> = ({email, pass}) => {
    signInWithEmailAndPassword(auth, email, pass)
      .then((userCredential) => {
        navigate('/');
      })
      .catch(err => {
        switch (err.code) {
          case 'auth/invalid-email':
            return setError('email', { message: 'Некорректный email' });
          case 'auth/user-disabled':
            return setError('email', { message: 'Аккаунт заблокирован' });
          case 'auth/user-not-found':
            return setError('email', { message: 'Аккаунт не найден' });
          case 'auth/wrong-password':
            return setError('pass', { message: 'Неверный пароль' });
          default:
            return setError('email', { message: err.message });
        }
      });
  }

  return (
    <form onSubmit={handleSubmit(handleLogin)}>
      <fieldset className={"flex flex-col items-center"}>
        <h1 className={"text-2xl font-medium"}>Авторизуйтесь</h1>
        <div className={"flex flex-col w-full my-3"}>
          <input
            type="email"
            {...register('email', {
              required: true,
              pattern: {
                value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                message: 'Некорректный email'
              }
            })}
            placeholder="Email"
            className={cn(styles.input, "my-3")}
          />
          {errors?.email && <span className={styles.msg_error} >{errors.email.message}</span>}
          <input
            type="password"
            {...register('pass', {
              required: true,
            })}
            placeholder="Пароль"
            className={cn(styles.input, "my-3")}
          />
          {errors?.pass && <span className={styles.msg_error} >{errors.pass.message}</span>}
          <button className={cn(styles.btn, "my-3")} >
            Войти
          </button>
        </div>
        <p>
          Нет аккаунта? <Link to="/register" className={styles.link_underlined}>Зарегистрируйтесь</Link>
        </p>
      </fieldset>
    </form>
  );
};

export default SignIn;
