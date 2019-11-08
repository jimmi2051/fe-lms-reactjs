import React, { Component } from "react";
import Header from "components/Layout/Header";
import _ from "lodash";
import { Link } from "react-router-dom";

class PageNotFound extends Component {
  render() {
    return (
      <div className="page-header">
        <Header titleHeader="Page not found" />
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="breadcrumbs">
                <ul className="flex flex-wrap align-items-center p-0 m-0">
                  <li>
                    <Link to="/">
                      <i className="fa fa-home"></i> Home
                    </Link>
                  </li>
                  <li>Page Not Found</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="row courses-wrap-custom">
            <div className="col-xl-12 text-center">
              <h4>
                We're sorry, the page you requested could not be found.
                <br />
                Please go back to the homepage or contact us at{" "}
                <a href="mailto:admin@gmail.com" className="text-info">
                  admin@gmail.com
                </a>
              </h4>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default PageNotFound;
