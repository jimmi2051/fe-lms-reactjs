/**
 * @author Thanh Ly
 * @copyright 06/06/2019 Kyanon Digital
 */

import React from "react";
import Spinner from "react-spinner-material";
const Loading = ({
  size = 20,
  color = "#333",
  classOption = "",
  text = ""
}) => {
  return (
    <div className={`loading-wrap ${classOption}`}>
      <div className="loading__text">{text}</div>
      <Spinner
        size={size}
        spinnerColor={color}
        spinnerWidth={4}
        visible={true}
      />
    </div>
  );
};

export default Loading;