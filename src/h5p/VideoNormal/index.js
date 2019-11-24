import React, { Component } from "react";
import { Player } from "video-react";
const REACT_APP_URL_API = process.env.REACT_APP_URL_API;
class VideoNormal extends Component {
  processUrl = url => {
    let regexUrl = /^http/
    if (regexUrl.test(url)) {
      return url;
    }
    return `${REACT_APP_URL_API}${url}`;
  }
  render() {
    const currentUrl = this.processUrl(this.props.src)
    return (
      <div className="content-video-normal">
        <h5 className="content-video-normal__title">Content: </h5>
        <Player playsInline src={currentUrl} />
      </div>
    );
  }
}
export default VideoNormal;
