import React, { Component } from "react";
import { Player } from "video-react";
const REACT_APP_URL_API = process.env.REACT_APP_URL_API;
class VideoNormal extends Component {
  render() {
    return (
      <div className="content-video-normal">
        <h5 className="content-video-normal__title">Content: </h5>
        <Player playsInline src={`${REACT_APP_URL_API}${this.props.src}`} />
      </div>
    );
  }
}
export default VideoNormal;
