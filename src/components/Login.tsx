import React from 'react';
import {setUser} from "../store/slices/userSlice";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import Form from "./Form";
import {useNavigate} from "react-router-dom";
import {useAppDispatch} from "../hooks/redux-hooks";

const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate()

  const handleLogin = (email: string, password: string) => {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
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
    <div>
      <Form
        title={"Sign In"}
        handleClick={handleLogin}
      />
    </div>
  );
};

export default Login;
