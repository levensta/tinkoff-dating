import React from 'react';
import {SubmitHandler, useForm} from "react-hook-form";

import styles from './elements.module.css';
import cn from 'classnames';

interface IFormFields {
  email: string,
  pass: string
}

interface IFormProps {
  title: string,
  handleAuth: (email: string, pass: string) => void,
}

const AuthForm: React.FC<IFormProps> = ({title, handleAuth}) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<IFormFields>({
    mode: 'onBlur'
  });

  const onSubmit: SubmitHandler<IFormFields> = (data) => {
    handleAuth(data.email, data.pass);
  }

  return (
    <form className={"flex flex-col w-full py-3"} onSubmit={handleSubmit(onSubmit)}>
      <input
        type="text"
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
      <button
        className={cn(styles.btn, "my-3")}
      >
        {title}
      </button>
    </form>
  );
};

export default AuthForm;
