import React from 'react';
import {Outlet} from "react-router-dom";
import Board from './components/Board';

const Layout = () => {
  return (
    <>
      <Board />
      <main className={"flex justify-center items-center bg-gray-200"}>
        <Outlet/>
      </main>
    </>
  );
};

export default Layout;
