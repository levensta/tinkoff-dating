import React from 'react';

interface IAuthProps {
  children: React.ReactNode
}

const AuthPage: React.FC<IAuthProps> = ({children}) => {
  return (
    <main className={"flex justify-center items-center h-screen bg-gray-100"}>
      <section className={"min-w-[300px] w-full sm:w-[430px] p-10 bg-white rounded-xl shadow-gray-300"}>
        {children}
      </section>
    </main>
  );
};

export default AuthPage;
