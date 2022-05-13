import React, {useState} from 'react';

import {createUserWithEmailAndPassword, sendEmailVerification, updateProfile} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import {auth, db} from "../firebase";

import {Link, useNavigate} from "react-router-dom";
import styles from "./elements.module.css";
import cn from "classnames";
import {useAuth} from "../hooks/useAuth";
import {SubmitHandler, useForm} from "react-hook-form";
import {IRegisterFormFields} from "../types";

const SignUp = () => {
  const navigate = useNavigate()
  const [formStep, setFormStep] = useState(0);
  const {
    register,
    formState: { errors, isValid },
    handleSubmit,
    setError
  } = useForm<IRegisterFormFields>({
    mode: 'onBlur'
  });

  const handleRegister: SubmitHandler<IRegisterFormFields> = ({email,pass, name}) => {
    createUserWithEmailAndPassword(auth, email, pass)
      .then((userCredential) => {
        const {user} = userCredential;
        sendEmailVerification(user)
          .then()
          .catch();
        updateProfile(user, {
          displayName: name, photoURL: "https://example.com/jane-q-user/profile.jpg"
        }).then()
          .catch();
        const docRef = setDoc(doc(db, "users", user.uid), {
          id: user.uid,
          photoURL: user.photoURL,
          name: name,
          age: null,
          city: null,
          description: null,
          tagsInterests: [],
          _matchedProfiles: [],
          _whoHaveLiked: [],
          isHiddenProfile: null,
          isHiddenAge: null,
        });
      })
      .catch(err => {
        switch (err.code) {
          case 'auth/email-already-in-use':
            return setError('email', { message: 'Аккаунт с такой почтой уже существует' });
          case 'auth/weak-password':
            return setError('pass', { message: 'Ненадежный пароль' });
          default:
            return setError('email', { message: err.message });
        }
      });
  }

  const renderButton = () => {
    return (
      formStep >= 1 ?
        <button
          className={cn(styles.btn, "my-3")}>
          Завершить регистрацию
        </button> :
        <button
          type="button"
          onClick={() => isValid && setFormStep(step => step + 1)}
          className={cn(styles.btn, "my-3")}>
          Продолжить
        </button>
    );
  }

  return (
    <form onSubmit={handleSubmit(handleRegister)}>
      {formStep === 0 &&
        <fieldset className={"flex flex-col items-center"}>
          <h1 className={"text-2xl font-medium"}>Регистрация</h1>
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
            {errors?.email && <span className={styles.msg_error}>{errors.email.message}</span>}
            <input
              type="password"
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
            {renderButton()}
          </div>
          {formStep === 0 &&
            <p>
              Уже есть аккаунт? <Link to="/login" className={styles.link_underlined}>Войдите</Link>
            </p>
          }
        </fieldset>
      }
      {formStep === 1 &&
        <fieldset className={"flex flex-col items-center"}>
          <h1 className={"text-2xl font-medium"}>Как вас зовут?</h1>
          <div className={"flex flex-col w-full my-3"}>
            <input
              type="text"
              {...register('name', {
                required: true,
              })}
              placeholder="Имя"
              className={cn(styles.input, "my-3")}
            />
            {renderButton()}
          </div>
        </fieldset>
      }
    </form>
  );
};

export default SignUp;
