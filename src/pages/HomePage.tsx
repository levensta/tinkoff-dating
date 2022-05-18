import React, {useEffect} from 'react';

import {signOut} from "firebase/auth";
import {auth} from "firebase.config";
import Card from "components/Card";
import {fetchRecommendedProfiles} from "store/slices/userSlice";
import {useAppDispatch, useAppSelector} from "hooks/redux-hooks";
import Loader from "components/Loaders/Loader";
import default_avatar from "assets/default_avatar.jpg"
import Stack from "components/Stack";
import SearchLoader from "components/Loaders/SearchLoader";

const tf = () => {
  const rotation = Math.random() * (2 - -2) + -2;
  console.log(rotation);
  return `rotate(${rotation}deg)`;
};

const HomePage = () => {
  const dispatch = useAppDispatch();
  const {isLoading, error, profiles} = useAppSelector(state => state.user.recs)
  const handleLogOut = () => {
    signOut(auth)
      .then(r => console.log(r))
      .catch(err => console.log(err));
  };

  useEffect(() => {
    if (!profiles.length) {
      dispatch(fetchRecommendedProfiles(2));
    }
  }, [profiles.length]);

  if (error) {
    console.log(error);
    return <p className={"max-w-sm text-red-600"}>Произошла ошибка. Попробуйте повторить позже</p>;
  }

  return (
    <>
      {isLoading ? <Loader/> :
        !profiles.length ? <SearchLoader avatarURL={auth.currentUser?.photoURL ?? default_avatar}/> :
        <Stack onVote={(item: { props: any; }, vote: any) => console.log(vote)}>
          {profiles.map((item, idx) => (
            <div
              className={"w-[400px] aspect-[2/3] flex flex-col items-center justify-center shadow bg-gray-50 rounded-md"}
              style={{transform: `${tf()}`}}
              key={item.id}
            >
              <Card
                index={idx}
                name={item.name}
                age={item.age}
                city={item.city}
                description={item.description}
                photosURLs={item.photosURLs}
                tagsInterests={item.tagsInterests}
              />
            </div>
          ))}
        </Stack>
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
