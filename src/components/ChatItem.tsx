import React from 'react';
import {Chat} from "types";
import default_avatar from "assets/default_avatar.jpg"

const ChatItem: React.FC<Omit<Chat, 'chatId'>> = ({avatarURL, name, lastMessage}) => {
  return (
    <div className={"flex items-center space-x-10 p-5"}>
      <img
        className={"rounded-full w-16"}
        src={avatarURL ?? default_avatar}
        alt="Matched profile avatar"
      />
      <div className={"flex flex-col"}>
        <h3 className={"font-semibold text-lg"}>{name}</h3>
        <span className={"text-stone-600"}>{lastMessage}</span>
      </div>
    </div>
  );
};

export default ChatItem;
