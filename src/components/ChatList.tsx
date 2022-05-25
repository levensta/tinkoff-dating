import React, {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from "../hooks/redux-hooks";
import Loader from "./Loaders/Loader";
import ChatItem from "./ChatItem";
import {auth} from "../firebase.config";
import default_avatar from "assets/default_avatar.jpg"
import {NavLink} from "react-router-dom";
import {fetchChats, logOut} from "../store/slices/userSlice";
import ErrorMessage from "./ErrorMessage";

const ChatList: React.FC = () => {
  const dispatch = useAppDispatch();
  const {chats, isLoading, error} = useAppSelector(state => state.user.matches);
  const setActive = ({isActive}: {isActive: boolean}):string => (
    isActive ? "shadow-md border-r-8 border-amber-400"
      : 'hover:shadow-md hover:border-r-8 hover:border-amber-400 transition-all'
  );

  useEffect(() => {
    dispatch(fetchChats());
  }, []);

  return (
    <div className={"flex flex-col w-full h-full"}>
      <div className={"flex items-center justify-between p-6 bg-amber-400"}>
        <div className={"flex items-center space-x-3 p-1 rounded-full hover:bg-amber-500 transition-colors"}>
          <img
            className={"w-8 h-8 rounded-full"}
            src={auth.currentUser?.photoURL ?? default_avatar}
            alt="Your profile avatar"
          />
          <span className={"text-white font-semibold"}>
            {auth.currentUser?.displayName}
          </span>
        </div>
        <button
          onClick={() => dispatch(logOut())}
          className={"p-2 rounded-full flex hover:bg-amber-500 transition-colors"}
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
        </button>
      </div>
      {isLoading ? <Loader sizeStyle={"w-8 h-8"}/>
        : error ? <ErrorMessage error={error} />
        : chats.map(item => {
          return (
            <NavLink
              to={`/matches/${item.chatId}`}
              key={item.chatId}
              className={setActive}
            >
              <ChatItem
                avatarURL={item.avatarURL}
                name={item.name}
                lastMessage={item.lastMessage}
              />
            </NavLink>
          );
        })
      }
    </div>
  );
};

export default ChatList;
