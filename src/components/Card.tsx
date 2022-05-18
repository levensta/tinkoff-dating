import React, {useRef} from 'react';
import {auth} from "firebase.config";
import {motion, useMotionValue, useTransform, useMotionTemplate, useAnimation} from 'framer-motion';
import Slider from "components/Slider";
import {Profile} from "types";

interface ICard extends Omit<Profile, 'id' | '_likedProfiles' | '_watchedProfiles'> {
  index: number
}

const Card: React.FC<ICard> = ({name, age, city, description, photosURLs, tagsInterests, index}) => {
  const mv = useMotionValue(0);
  const animControls = useAnimation();
  const rotateMv = useTransform(mv, [-200, 200], [-50, 50]);
  const opacityMv = useTransform(mv, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);

  const swipeLeft = () => {
    animControls.start({ x: -200 });
  };

  const swipeRight = () => {
    animControls.start({ x: 200 });
  };

  return (
    <motion.li
      className="flex flex-col aspect-[2/3] max-w-md bg-white rounded-lg border border-gray-200 shadow-md absolute"
      drag={"x"}
      dragConstraints={{ left: -200, right: 200 }}
      style={{ x: mv, opacity: opacityMv, rotate: rotateMv }}
      initial={{ x: 0 }}
      animate={animControls}
      onDragEnd={function (_, i) {
        console.log(i.offset.x);
        if (Math.abs(i.offset.x) < 200) {
          animControls.start({ x: 0 });
        } else {
          if (Math.sign(i.offset.x) === -1) {
            swipeLeft();
            console.log("left");
          } else {
            swipeRight();
            console.log("right");
          }
        }
      }}
    >
      <Slider imgLinks={photosURLs} />
      <div className={"p-5 absolute bottom-0 bg-gradient-to-t from-stone-900"} style={{zIndex: index}}>
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-white">
          {name} {age}
        </h5>
        <p className="font-normal text-white">
          Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.
        </p>
        <div className={"flex justify-center my-3 space-x-4"}>
          <button onClick={() => swipeLeft()} className={"w-16 h-16 p-3 rounded-full border-2 text-red-500 border-red-500 hover:bg-red-500 hover:text-white transition-all"}>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" /></svg>
          </button>
          <button onClick={() => swipeRight()} className={"w-16 h-16 p-3 rounded-full border-2 text-green-500 border-green-500 hover:bg-green-500 hover:text-white transition-all"}>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" /></svg>
          </button>
        </div>
      </div>
    </motion.li>
  );
};

export default Card;
