import React from 'react';

const NotFound: React.FC = () => {
  return (
    <div>
      <main className={"flex justify-center items-center h-screen bg-gray-100"}>
        <section className={"text-center text-stone-900 space-y-4"}>
          <h1 className={"text-9xl font-bold"} >404</h1>
          <h2 className={"text-lg"}>Такой страницы не существует</h2>
        </section>
      </main>
    </div>
  );
};

export default NotFound;
