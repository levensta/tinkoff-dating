import React from 'react';

const ErrorMessage: React.FC<{ error: string }> = ({error}) => {
  console.log(error);
  return (
    <p className={"max-w-sm text-red-600 m-auto text-center"}>
      Произошла ошибка. Попробуйте повторить позже
    </p>
  );
};

export default ErrorMessage;
