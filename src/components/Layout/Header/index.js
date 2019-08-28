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

class Header extends Component {
  render() {
    return (
      <div className="hero-content">
        <header className="site-header">
          <div className="top-header-bar">
            <div className="container-fluid">
              <div className="row">
                <div className="col-12 col-lg-6 d-none d-md-flex flex-wrap justify-content-center justify-content-lg-start mb-3 mb-lg-0">
                  <div className="header-bar-email d-flex align-items-center">
                    <i className="fa fa-envelope"></i>
                    <a href="#">tuanna.design@gmail.com</a>
                  </div>
                  <div className="header-bar-text lg-flex align-items-center">
                    <p>
                      <i className="fa fa-phone"></i>001-1234-88888{" "}
                    </p>
                  </div>
                </div>

                <div className="col-12 col-lg-6 d-flex flex-wrap justify-content-center justify-content-lg-end align-items-center">
                  <div className="header-bar-search">
                    <form className="flex align-items-stretch">
                      <input
                        type="search"
                        placeholder="What would you like to learn?"
                      />
                      <button
                        type="submit"
                        value=""
                        className="flex justify-content-center align-items-center"
                      >
                        <i className="fa fa-search"></i>
                      </button>
                    </form>
                  </div>

                  <div className="header-bar-menu">
                    <ul className="flex justify-content-center align-items-center py-2 pt-md-0">
                      <li>
                        <a href="#">Register</a>
                      </li>
                      <li>
                        <a href="#">Login</a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="nav-bar">
            <div className="container">
              <div className="row">
                <div className="col-9 col-lg-3">
                  <div className="site-branding">
                    <h1 className="site-title">
                      <a href="index.html" rel="home">
                        Ezu<span>ca</span>
                      </a>
                    </h1>
                  </div>
                </div>

                <div className="col-3 col-lg-9 flex justify-content-end align-content-center">
                  <nav className="site-navigation flex justify-content-end align-items-center">
                    <ul className="flex flex-column flex-lg-row justify-content-lg-end align-content-center">
                      <li className="current-menu-item">
                        <a href="index.html">Home</a>
                      </li>
                      <li>
                        <a href="#">About</a>
                      </li>
                      <li>
                        <a href="#">Courses</a>
                      </li>
                      <li>
                        <a href="#">blog</a>
                      </li>
                      <li>
                        <a href="#">Contact</a>
                      </li>
                    </ul>

                    <div className="hamburger-menu d-lg-none">
                      <span></span>
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>

                    <div className="header-bar-cart">
                      <a
                        href="#"
                        className="flex justify-content-center align-items-center"
                      >
                        <span
                          aria-hidden="true"
                          className="icon_bag_alt"
                        ></span>
                      </a>
                    </div>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="hero-content-overlay">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="hero-content-wrap flex flex-column justify-content-center align-items-start">
                  <header className="entry-header">
                    <h4>Get started with online courses</h4>
                    <h1>
                      best online
                      <br />
                      Learning system
                    </h1>
                  </header>

                  <div className="entry-content">
                    <p>
                      Excepteur sint occaecat cupidatat non proident, sunt in
                      culpa qui officia deserunt mollit anim id est laborum. Sed
                      ut perspiciatis unde omnis iste natus error sit voluptatem
                      accusantium doloremque laudantium
                    </p>
                  </div>

                  <footer className="entry-footer read-more">
                    <a href="#">read more</a>
                  </footer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header);
