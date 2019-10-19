import React, { Component } from "react";

class TextNormal extends Component {
  render() {
    return (
      <div className="content-text-normal">
        <h5 className="content-text-normal__title">Content: </h5>
        <div
          className="content-text-normal__description"
          dangerouslySetInnerHTML={{
            __html: this.props.context
          }}
        />
      </div>
    );
  }
}
export default TextNormal;
