import React, { useState, Children } from "react";
import CardFrame from "components/CardFrame";
import {useAppDispatch, useAppSelector} from "hooks/redux-hooks";
import {swipeProfile} from "store/slices/userSlice";

const Stack: React.FC<any> = ({ onVote, children }) => {
  const [stack, setStack] = useState(Children.toArray(children));
  const dispatch = useAppDispatch();
  const profiles = useAppSelector(state => state.user.recs.profiles);

  // return new array with last item removed
  const pop = (array: any[]) => {
    return array.filter((_, index) => {
      return index < array.length - 1;
    });
  };

  // @ts-ignore
  const handleVote = (item, vote) => {
    // update the stack
    const newStack = pop(stack);
    dispatch(swipeProfile({
      id: item.key.slice(2),
      isLike: vote
    }));
    setStack(newStack);

    // run function from onVote prop, passing the current item and value of vote
    onVote(item, vote);
  };

  return (
    <>
      <ul className={"w-full flex justify-center items-center relative"}>
        {stack.map((item, index) => {
          return (
            // @ts-ignore
            <CardFrame
              drag={index === stack.length - 1} // Only top card is draggable
              // @ts-ignore
              key={item.key ?? index}
              // @ts-ignore
              onVote={(result) => handleVote(item, result)}
            >
              {item}
            </CardFrame>
          );
        })}
      </ul>
    </>
  );
};

export default Stack;
