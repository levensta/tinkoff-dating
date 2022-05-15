import React from 'react';
import {Outlet} from "react-router-dom";

const AuthPage: React.FC = () => {
  return (
    <main className={"flex justify-center items-center h-screen bg-gray-100"}>
      <section className={"min-w-[300px] w-full sm:w-[430px] p-10 bg-white rounded-xl shadow-gray-300"}>
        <Outlet/>
      </section>
    </main>
  );
};

export default AuthPage;
