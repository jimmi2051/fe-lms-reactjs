import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import React, { Component } from "react";

const REACT_APP_URL_API = process.env.REACT_APP_URL_API;

class Slider extends Component {
  render() {
    const { slideItem } = this.props;
    return (
      <Carousel>
        {slideItem &&
          slideItem.length > 0 &&
          slideItem.map((item, index) => {
            return (
              <div key={index}>
                <img src={`${REACT_APP_URL_API}${item.imgUrl}`} alt="" />
                <p className="legend">{item.title}</p>
                <p className="legend">{item.content}</p>
              </div>
            );
          })}
      </Carousel>
    );
  }
}
export default Slider;
