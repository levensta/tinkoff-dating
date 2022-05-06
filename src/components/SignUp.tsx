import {setUser} from "../store/slices/userSlice";
import {getAuth, createUserWithEmailAndPassword} from "firebase/auth";
import Form from "./Form";

import React from 'react';
import {useNavigate} from "react-router-dom";
import {useAppDispatch} from "../hooks/redux-hooks";

const SignUp = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate()

  const handleRegister = (email: string, password: string) => {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential: any) => {
        const { user } = userCredential;
        dispatch(setUser({
          email: user.email,
          token: user.accessToken,
          id: user.uid,
        }));
        navigate('/');
      })
      .catch();
  }

  return (
    <Form
      title={"Sign Up"}
      handleClick={handleRegister}
    />
  );
};

export default SignUp;
