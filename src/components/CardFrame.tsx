import React, {useEffect, useRef, useState} from "react";
import {motion, useAnimation, useMotionValue} from "framer-motion";

// @ts-ignore
const CardFrame = ({ children, style, onVote, id, ...props }) => {
  // motion stuff
  const cardElem = useRef(null);

  const x = useMotionValue(0);
  const controls = useAnimation();

  const [constrained, setConstrained] = useState(true);

  const [direction, setDirection] = useState();

  const [velocity, setVelocity] = useState();

  // @ts-ignore
  const getVote = (childNode, parentNode) => {
    const childRect = childNode.getBoundingClientRect();
    const parentRect = parentNode.getBoundingClientRect();
    return parentRect.left >= childRect.right
      ? false
      : parentRect.right <= childRect.left
        ? true
        : undefined;
  };

  // determine direction of swipe based on velocity
  const getDirection = () => {
    return velocity! >= 1 ? "right" : velocity! <= -1 ? "left" : undefined;
  };

  const getTrajectory = () => {
    // @ts-ignore
    setVelocity(x.getVelocity());
    // @ts-ignore
    setDirection(getDirection());
  };

  const flyAway = (min: number) => {
    const flyAwayDistance = (direction: string) => {
      // @ts-ignore
      const parentWidth = cardElem.current.parentNode.getBoundingClientRect().width;
      // @ts-ignore
      const childWidth = cardElem.current.getBoundingClientRect().width;
      return direction === "left"
        ? -parentWidth / 2 - childWidth / 2
        : parentWidth / 2 + childWidth / 2;
    };

    if (direction && Math.abs(velocity!) > min) {
      setConstrained(false);
      controls.start({
        x: flyAwayDistance(direction)
      });
    }
  };

  useEffect(() => {
    const unsubscribeX = x.onChange(() => {
      const childNode = cardElem.current;
      // @ts-ignore
      const parentNode = cardElem.current.parentNode;
      const result = getVote(childNode, parentNode);
      // console.log(result);
      result !== undefined && onVote(result);
    });

    return () => unsubscribeX();
  });

  return (
    <motion.li
      className={"absolute"}
      animate={controls}
      dragConstraints={constrained && { left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={1}
      ref={cardElem}
      style={{ x, }}
      onDrag={getTrajectory}
      onDragEnd={() => flyAway(500)}
      {...props}
    >
      {children}
    </motion.li>
  );
};

export default CardFrame;
