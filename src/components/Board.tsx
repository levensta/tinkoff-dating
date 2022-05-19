import React from 'react';
import {useLocation} from "react-router-dom";
import ChatList from "./ChatList";

const Board = () => {
  const location = useLocation();

  const renderBoard = () => {
    switch (location.pathname) {
      case '/matches':
        return <ChatList/>
      case '/settings':
        return <h1>settings</h1>
      default:
        return <ChatList/>
    }
  }

  return (
    <aside className={"w-full h-full sm:w-96 bg-white shadow-xl text-stone-900"}>
      {renderBoard()}
    </aside>
  );
};

export default Board;
