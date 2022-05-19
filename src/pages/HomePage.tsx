import React, {useEffect} from 'react';

import {auth} from "firebase.config";
import Card from "components/Card";
import {fetchChats, fetchRecommendedProfiles} from "store/slices/userSlice";
import {useAppDispatch, useAppSelector} from "hooks/redux-hooks";
import default_avatar from "assets/default_avatar.jpg"
import Stack from "components/Stack";
import SearchLoader from "components/Loaders/SearchLoader";

const tf = () => {
  const rotation = Math.random() * (2 - -2) + -2;
  return `rotate(${rotation}deg)`;
};

const HomePage = () => {
  const dispatch = useAppDispatch();
  const {isLoading, error, profiles} = useAppSelector(state => state.user.recs);

  useEffect(() => {
    dispatch(fetchChats());
  }, []);

  useEffect(() => {
    if (!profiles.length) {
      dispatch(fetchRecommendedProfiles(5));
    }
  }, [profiles.length]);

  if (error) {
    console.log(error);
    return <p className={"max-w-sm text-red-600"}>Произошла ошибка. Попробуйте повторить позже</p>;
  }

  return (
    <>
      {isLoading || !profiles.length ? <SearchLoader avatarURL={auth.currentUser?.photoURL ?? default_avatar}/> :
        <Stack>
          {profiles.map((item, idx) => (
            <div
              className={"aspect-[2/3] flex max-w-md flex-col items-center justify-center shadow bg-gray-50 rounded-md relative"}
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
    </>
  );
};

export default HomePage;
