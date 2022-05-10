import React from 'react';

interface AuthProps {
  children: React.ReactNode
}

const AuthPage: React.FC<AuthProps> = ({children}) => {
  return (
    <main className={"flex flex-col h-screen bg-gray-100"}>
      <section className={"flex flex-col items-center m-auto p-10 bg-white rounded-xl shadow-gray-300"}>
        {children}
      </section>
    </main>
  );
};

export default AuthPage;
