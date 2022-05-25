import React from 'react';

import {signInWithEmailAndPassword, updateCurrentUser} from "firebase/auth";
import {auth} from "../firebase.config";

import {Link, useLocation, useNavigate} from "react-router-dom";
import styles from "components/elements.module.css";
import {SubmitHandler, useForm} from "react-hook-form";
import {IAuthFormFields} from "../types";
import cn from "classnames";
import {setIsLoggedIn} from "../store/slices/userSlice";
import {useAppDispatch} from "../hooks/redux-hooks";

type locationState = { from: string };

const SignIn = () => {
  const navigate = useNavigate()
  const location = useLocation();
  const fromPage = (location.state as locationState)?.from ?? '/';
  const {
    register,
    formState: { errors },
    handleSubmit,
    setError
  } = useForm<IAuthFormFields>({
    mode: 'onBlur'
  });

  const dispatch = useAppDispatch();

  const handleLogin: SubmitHandler<IAuthFormFields> = async ({email, pass}) => {
    try {
      const {user} = await signInWithEmailAndPassword(auth, email, pass);
      dispatch(setIsLoggedIn(true));
      await updateCurrentUser(auth, user);
      navigate(fromPage);
    } catch (err: any) {
      switch (err.code) {
        case 'auth/invalid-email':
          return setError('email', {message: 'Некорректный email'});
        case 'auth/user-disabled':
          return setError('email', {message: 'Аккаунт заблокирован'});
        case 'auth/user-not-found':
          return setError('email', {message: 'Аккаунт не найден'});
        case 'auth/wrong-password':
          return setError('pass', {message: 'Неверный пароль'});
        default:
          return setError('email', {message: err.message});
      }
    }
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
