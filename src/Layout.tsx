import React from 'react';
import {Outlet} from "react-router-dom";
import Board from 'components/Board';

const Layout = () => {
  return (
    <>
      <Board />
      <main className={"flex justify-center items-center w-screen h-screen relative overflow-hidden bg-gray-100 text-stone-900"}>
        <Outlet/>
      </main>
    </>
  );
};

export default Layout;
