import React from 'react';
import {Chat} from "types";
import default_avatar from "assets/default_avatar.jpg"

const ChatItem: React.FC<Omit<Chat, 'chatId'>> = ({avatarURL, name, lastMessage}) => {
  return (
    <div className={"max-h-24 flex items-center space-x-10 p-6 overflow-hidden"}>
      <img
        className={"rounded-full w-16"}
        src={avatarURL ?? default_avatar}
        alt="Matched profile avatar"
      />
      <div className={"flex flex-col overflow-hidden"}>
        <h3 className={"font-semibold text-lg"}>{name}</h3>
        <span className={"text-stone-600 truncate"}>{lastMessage}</span>
      </div>
    </div>
  );
};

export default ChatItem;
