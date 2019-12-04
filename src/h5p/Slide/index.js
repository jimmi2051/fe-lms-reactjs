import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import React, { Component } from "react";

const REACT_APP_URL_API = process.env.REACT_APP_URL_API;

class Slider extends Component {
  processUrl = url => {
    let regexUrl = /^http/;
    if (regexUrl.test(url)) {
      return url;
    }
    return `${REACT_APP_URL_API}${url}`;
  };
  render() {
    const { slideItem } = this.props;
    return (
      <div className="content-slide-normal">
        <h5 className="content-slide-normal__title">Content: </h5>
        <Carousel
          useKeyboardArrows={true}
          dynamicHeight={true}
          showThumbs={false}
          showIndicators={false}
        >
          {slideItem &&
            slideItem.length > 0 &&
            slideItem.map((item, index) => {
              const url = this.processUrl(item.imgPath);
              return (
                <div
                  key={index}
                  className=""
                  // style={{
                  //   backgroundImage: `url("${REACT_APP_URL_API}${item.imgUrl}")`
                  //   /*`url(${props.backendDomain +
                  //     slide['imgBackgroundPath']['url']})`*/
                  // }}
                >
                  <img src={`${url}`} alt="#" />
                  {/* <div className="slide-item-content col-xl-10">
                    <h5 className="pt-3">{item.title}</h5>
                    <p className="">{item.content}</p>
                  </div> */}
                  <div className="legend">
                    <h5 className="pt-3">{item.title}</h5>
                    <p className="">{item.content}</p>
                  </div>
                </div>
              );
            })}
        </Carousel>
      </div>
    );
  }
}
export default Slider;
