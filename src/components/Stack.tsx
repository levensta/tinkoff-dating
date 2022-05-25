import React, {useState, Children, ReactElement} from "react";
import CardFrame from "components/CardFrame";
import {useAppDispatch} from "hooks/redux-hooks";
import {swipeProfile} from "store/slices/userSlice";

const Stack: React.FC<{children: ReactElement[]}> = ({children}) => {
  const [stack, setStack] = useState(Children.toArray(children));
  const dispatch = useAppDispatch();

  // return new array with last item removed
  const pop = (array: any[]) => {
    return array.filter((_, index) => {
      return index < array.length - 1;
    });
  };

  const handleVote = (item: ReactElement, vote: boolean) => {
    // update the stack
    const newStack = pop(stack);
    dispatch(swipeProfile({
      uid: (item.key as string).slice(2),
      isLike: vote
    }));
    setStack(newStack);
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
