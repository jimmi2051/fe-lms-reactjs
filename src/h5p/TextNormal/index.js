import React, { Component } from "react";

class TextNormal extends Component {
  render() {
    return (
      <div
        className="text"
        dangerouslySetInnerHTML={{
          __html: this.props.context
        }}
      />
    );
  }
}
export default TextNormal;
