import React from 'react';
import cn from "classnames";

const Message: React.FC<{text: string, isSelf: boolean}> = ({text, isSelf}) => {
  return (
    <p className={cn("p-3 m-2 w-fit max-w-7xl rounded-2xl", isSelf ? "bg-blue-400 text-white rounded-br-lg self-end" : "bg-gray-200 rounded-bl-lg")}>
      {text}
    </p>
  );
};

export default Message;
