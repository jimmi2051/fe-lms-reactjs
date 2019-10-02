import React, { Component } from "react";
import { Player } from "video-react";
const REACT_APP_URL_API = process.env.REACT_APP_URL_API;
class VideoNormal extends Component {
  render() {
    return (
      <Player>
        <source src={`${REACT_APP_URL_API}${this.props.src}`} />
      </Player>
    );
  }
}
export default VideoNormal;
