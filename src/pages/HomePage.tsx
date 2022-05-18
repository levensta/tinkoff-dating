import React, {useEffect} from 'react';

import {signOut} from "firebase/auth";
import {auth, db} from "firebase.config";
import Card from "components/Card";
import {fetchRecommendedProfiles} from "../store/slices/userSlice";
import {useAppDispatch, useAppSelector} from "../hooks/redux-hooks";
import Loader from "../components/Loader";
import { doc, getDoc } from 'firebase/firestore';

const HomePage = () => {
  const dispatch = useAppDispatch();
  const {isLoading, error, profiles} = useAppSelector(state => state.user.recs)
  const handleLogOut = () => {
    signOut(auth)
      .then(r => console.log(r))
      .catch(err => console.log(err));
  };

  useEffect(() => {
    if (profiles.length < 2) {
      dispatch(fetchRecommendedProfiles(10));
    }
  }, [profiles.length]);

  if (error) {
    console.log(error);
    return <p className={"max-w-sm text-red-600"}>Произошла ошибка. Попробуйте повторить позже</p>;
  }

  profiles.forEach(item => console.log(item));
  return (
    <>
      {isLoading ? <Loader/> :
        <ul className={"relative overflow-hidden w-full h-full flex justify-center items-center"}>
        {profiles.map((item, idx) => (
          <Card
          key={item.id}
          name={item.name}
          age={item.age}
          city={item.city}
          description={item.description}
          photosURLs={item.photosURLs}
          tagsInterests={item.tagsInterests}
          index={idx + 1}
          />
          ))}
        </ul>
      }
      <div className={"fixed top-0 right-0"}>
        <h1>Welcome, {auth.currentUser!.displayName}</h1>
        <button onClick={handleLogOut}>
          Log Out
        </button>
      </div>
    </>
  );
};

export default HomePage;
