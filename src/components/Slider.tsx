import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import {images} from "./image-data";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import "./styles.css";
import default_avatar from "../assets/default_avatar.jpg";

// import required modules
import {Pagination, Navigation } from "swiper";

const Slider: React.FC<{ imgLinks: Array<string> }> = ({imgLinks}) => {
  return (
    <Swiper
      pagination={{
        type: "progressbar",
      }}
      loop={true}
      navigation={true}
      modules={[Pagination, Navigation]}
      className="mySwiper"
    >
      {imgLinks?.length ?
        imgLinks.map(item => {
          return (
            <SwiperSlide key={item}>
              <img src={item} alt="person"/>
            </SwiperSlide>
          );
        })
        :
        <SwiperSlide>
          <img src={default_avatar} alt="person"/>
        </SwiperSlide>
      }
    </Swiper>
  );
}

export default Slider;
