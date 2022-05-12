import {useEffect, useState} from "react";

import {onAuthStateChanged, User} from "firebase/auth";
import {auth} from "../firebase";

import {useAppDispatch} from "./redux-hooks";
import {setIsLoading} from "../store/slices/userSlice";


export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const subscriber = onAuthStateChanged(auth, (userInfo) => {
      if (userInfo) {
        setIsLoggedIn(true);
        setUser(userInfo);
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
      dispatch(setIsLoading(false));
    });
    return () => {
      subscriber();
    }
  }, []);

  return {
    user,
    isLoggedIn,
  };
}
