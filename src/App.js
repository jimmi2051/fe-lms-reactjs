import "styles/style.scss";

import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import "whatwg-fetch";

import RootRoute from "routes";
// import Navbar from "components/Layout/Header/NavBar/index.js";

export default function App() {
  return (
    <Router>
      <>
        {/* <Navbar /> */}
        <RootRoute />
      </>
    </Router>
  );
}
