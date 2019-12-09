/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
function mapStateToProps(state) {
  return {
    store: {
      listUser: state.user.user.data,
      loading: state.user.user.loading
    }
  };
}

const mapDispatchToProps = dispatch => {
  return {
    action: bindActionCreators({}, dispatch)
  };
};

class Footer extends Component {
  render() {
    return (
      <footer className="site-footer">
        <div className="footer-bar">
          <div className="container">
            <div className="row flex-wrap justify-content-center justify-content-lg-between align-items-center align-mobile">
              <div className="col-12 col-lg-6">
                <p className="footer-copyright">
                  &copy; Copyright LMS-System | All rights reserved
                </p>
              </div>

              <div className="col-12 col-lg-6 mt-lg-0">
                <div className="footer-bar-nav">
                  <ul className="flex flex-wrap justify-content-center justify-content-lg-end align-items-center">
                    <li>
                      Email:{" "}
                      <a href="mail:jimmi2051@gmail.com">admin@gmail.com</a>
                    </li>
                    <li>
                      <a href="#">Privacy Policy</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Footer);
