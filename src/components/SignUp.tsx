import React from 'react';

import {createUserWithEmailAndPassword, sendEmailVerification, updateProfile, updateCurrentUser} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import {auth, db} from "firebase.config";

import {Link} from "react-router-dom";
import styles from "components/elements.module.css";
import cn from "classnames";
import {SubmitHandler, useForm} from "react-hook-form";
import {IRegisterFormFields} from "../types";
import {setIsLoggedIn} from "../store/slices/userSlice";
import {useAppDispatch} from "../hooks/redux-hooks";

const SignUp = () => {
  const dispatch = useAppDispatch();
  const {
    register,
    formState: { errors },
    handleSubmit,
    setError
  } = useForm<IRegisterFormFields>({
    mode: 'onBlur'
  });

  const handleRegister: SubmitHandler<IRegisterFormFields> = async ({email, pass, name}) => {
    try {
      const {user} = await createUserWithEmailAndPassword(auth, email, pass);
      await sendEmailVerification(user);
      await updateProfile(user, {
        displayName: name
      });
      await updateCurrentUser(auth, user);
      setDoc(doc(db, 'users', user.uid), {
        id: user.uid,
        avatarURL: user.photoURL,
        name: name,
        age: null,
        city: null,
        description: null,
        photosURLs: [],
        tagsInterests: [],
        _likedProfiles: [],
        _watchedProfiles: [user.uid],
        isHiddenProfile: true,
        isHiddenAge: false,
      }).then(() => dispatch(setIsLoggedIn(true)));
    } catch (err: any) {
      switch (err.code) {
        case 'auth/email-already-in-use':
          return setError('email', { message: 'Аккаунт с такой почтой уже существует' });
        case 'auth/weak-password':
          return setError('pass', { message: 'Ненадежный пароль' });
        default:
          return setError('email', { message: err.message });
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(handleRegister)}>
      <fieldset className={"flex flex-col items-center"}>
        <h1 className={"text-2xl font-medium"}>Регистрация</h1>
        <div className={"flex flex-col w-full my-3"}>
          <input
            type="text"
            {...register('name', {
              required: true,
            })}
            placeholder="Имя"
            className={cn(styles.input, "my-3")}
          />
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
          {errors?.email && <span className={styles.msg_error}>{errors.email.message}</span>}
          <input
            type="password"
            pattern="^(?=.*\d)(?=.*[a-z]).{8,}$"
            {...register('pass', {
              required: true,
              pattern: {
                value: /^(?=.*\d)(?=.*[a-z]).{8,}$/,
                message: 'Пароль должен состоять не менее из 8 символов, включая буквы и цифры'
              }
            })}
            placeholder="Пароль"
            className={cn(styles.input, "my-3")}
          />
          {errors?.pass && <span className={styles.msg_error}>{errors.pass.message}</span>}
          <button className={cn(styles.btn, "my-3")}>
            Продолжить
          </button>
        </div>
        <p>
          Уже есть аккаунт? <Link to="/login" className={styles.link_underlined}>Войдите</Link>
        </p>
      </fieldset>
    </form>
  );
};

export default SignUp;
