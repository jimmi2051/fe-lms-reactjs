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
        <div className="footer-widgets">
          <div className="container">
            <div className="row">
              <div className="col-12 col-md-6 col-lg-3">
                <div className="foot-about">
                  <a className="foot-logo" href="#">
                    <img src="/static/images/foot-logo.png" alt="" />
                  </a>

                  <p>
                    Excepteur sint occaecat cupidatat non proident, sunt in
                    culpa qui officia dese mollit anim id est laborum.{" "}
                  </p>

                  <p className="footer-copyright">
                    Copyright &copy;
                    <script>
                      document.write(new Date().getFullYear());
                    </script>{" "}
                    All rights reserved | This template is made with{" "}
                    <i className="fa fa-heart-o" aria-hidden="true"></i> by{" "}
                    <a href="https://colorlib.com" target="_blank">
                      Colorlib
                    </a>
                  </p>
                </div>
              </div>

              <div className="col-12 col-md-6 col-lg-3 mt-5 mt-md-0">
                <div className="foot-contact">
                  <h2>Contact Us</h2>

                  <ul>
                    <li>Email: info.deertcreative@gmail.com</li>
                    <li>Phone: (+88) 111 555 666</li>
                    <li>Address: 40 Baria Sreet 133/2 NewYork City, US</li>
                  </ul>
                </div>
              </div>

              <div className="col-12 col-md-6 col-lg-3 mt-5 mt-lg-0">
                <div className="quick-links flex flex-wrap">
                  <h2 className="w-100">Quick Links</h2>

                  <ul className="w-50">
                    <li>
                      <a href="#">About </a>
                    </li>
                    <li>
                      <a href="#">Terms of Use </a>
                    </li>
                    <li>
                      <a href="#">Privacy Policy </a>
                    </li>
                    <li>
                      <a href="#">Contact Us</a>
                    </li>
                  </ul>

                  <ul className="w-50">
                    <li>
                      <a href="#">Documentation</a>
                    </li>
                    <li>
                      <a href="#">Forums</a>
                    </li>
                    <li>
                      <a href="#">Language Packs</a>
                    </li>
                    <li>
                      <a href="#">Release Status</a>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="col-12 col-md-6 col-lg-3 mt-5 mt-lg-0">
                <div className="follow-us">
                  <h2>Follow Us</h2>

                  <ul className="follow-us flex flex-wrap align-items-center">
                    <li>
                      <a href="#">
                        <i className="fa fa-facebook"></i>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i className="fa fa-google-plus"></i>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i className="fa fa-instagram"></i>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i className="fa fa-twitter"></i>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bar">
          <div className="container">
            <div className="row flex-wrap justify-content-center justify-content-lg-between align-items-center">
              <div className="col-12 col-lg-6">
                <div className="download-apps flex flex-wrap justify-content-center justify-content-lg-start align-items-center">
                  <a href="#">
                    <img src="/static/images/app-store.png" alt="" />
                  </a>
                  <a href="#">
                    <img src="/static/images/play-store.png" alt="" />
                  </a>
                </div>
              </div>

              <div className="col-12 col-lg-6 mt-4 mt-lg-0">
                <div className="footer-bar-nav">
                  <ul className="flex flex-wrap justify-content-center justify-content-lg-end align-items-center">
                    <li>
                      <a href="#">DPA</a>
                    </li>
                    <li>
                      <a href="#">Terms of Use</a>
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Footer);
