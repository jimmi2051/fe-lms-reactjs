/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import AuthStorage from "utils/AuthStorage";
import { Link } from "react-router-dom";
import { logoutRequest } from "redux/action/auth";
import { withRouter } from "react-router";
function mapStateToProps(state) {
  return {
    store: {
      auth: state.auth
    }
  };
}

const mapDispatchToProps = dispatch => {
  return {
    action: bindActionCreators({ logoutRequest }, dispatch)
  };
};

class Navbar extends Component {
  state = {
    keySearch: "",
    isShowMobile: false
  };
  componentDidMount() {}
  logout = () => {
    this.props.action.logoutRequest();
  };
  handleChangeSearch = e => {
    this.setState({ keySearch: e.target.value });
  };
  handleShowMobile = () => {
    this.setState({ isShowMobile: !this.state.isShowMobile });
  };
  render() {
    const { pathname } = this.props.location;
    const { keySearch, isShowMobile } = this.state;
    return (
      <header className="site-header">
        <div className="top-header-bar">
          <div className="container-fluid">
            <div className="row">
              <div className="col-12 col-lg-5 d-none d-md-flex flex-wrap justify-content-center justify-content-lg-start mb-3 mb-lg-0">
                <div className="header-bar-email d-flex align-items-center">
                  <i className="fa fa-envelope"></i>
                  <a href="mailto:'admin@gmail.com'">admin@gmail.com</a>
                </div>
                <div className="header-bar-text lg-flex align-items-center">
                  <p>
                    <i className="fa fa-phone"></i>0978-956-043{" "}
                  </p>
                </div>
              </div>

              <div className="col-12 col-lg-7 d-flex flex-wrap justify-content-center justify-content-lg-end align-items-center">
                <div className="header-bar-search">
                  <form className="flex align-items-stretch">
                    <input
                      type="search"
                      placeholder="What would you like to learn?"
                      value={keySearch}
                      onChange={this.handleChangeSearch}
                    />
                    <Link
                      to={{
                        pathname: `trainings`,
                        state: {
                          keySearch
                        }
                      }}
                    >
                      <button
                        type="submit"
                        value=""
                        className="flex justify-content-center align-items-center"
                      >
                        <i className="fa fa-search"></i>
                      </button>
                    </Link>
                  </form>
                </div>

                <div className="header-bar-menu">
                  <ul className="flex justify-content-center align-items-center py-2 pt-md-0">
                    {!AuthStorage.loggedIn ? (
                      <>
                        <li>
                          <Link to="/register">Register</Link>
                        </li>
                        <li>
                          <Link to="/login">Login</Link>
                        </li>
                      </>
                    ) : (
                      <>
                        <li>
                          <Link to="/profile">
                            {AuthStorage.userInfo.username}
                          </Link>
                        </li>
                        <li>
                          <Link onClick={this.logout} to="/login">
                            Log out
                          </Link>
                        </li>
                      </>
                    )}
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
                    <Link to="/">
                      {" "}
                      L<span>MS</span>
                    </Link>
                  </h1>
                </div>
              </div>

              <div className="col-3 col-lg-9 flex justify-content-end align-content-center">
                <nav
                  className={`site-navigation flex justify-content-end align-items-center ${
                    isShowMobile ? "show" : ""
                  }`}
                  style={{ width: "100%" }}
                >
                  <ul className="flex flex-column flex-lg-row justify-content-lg-end align-content-center">
                    {AuthStorage.loggedIn &&
                      AuthStorage.userInfo.role.type === "creator" && (
                        <>
                          <li
                            className={
                              pathname === "/" ? "current-menu-item" : ""
                            }
                          >
                            <Link to="/">Home</Link>
                          </li>
                          <li
                            className={
                              pathname === "/trainings"
                                ? "current-menu-item"
                                : ""
                            }
                          >
                            <Link to="/trainings">Store Training</Link>
                          </li>
                          <li
                            className={
                              pathname === "/admin/training"
                                ? "current-menu-item"
                                : ""
                            }
                          >
                            <Link to="/admin/training">Manage Training</Link>
                          </li>
                          <li
                            className={
                              pathname === "/admin/new-training"
                                ? "current-menu-item"
                                : ""
                            }
                          >
                            <Link to="/admin/new-training">New Training</Link>
                          </li>
                          <li
                            className={`${
                              pathname === "/admin/course"
                                ? "current-menu-item"
                                : ""
                            } d-lg-none`}
                          >
                            <Link to="/admin/course">Manage Course</Link>
                          </li>
                          <li
                            className={`${
                              pathname === "/admin/module"
                                ? "current-menu-item"
                                : ""
                            } d-lg-none`}
                          >
                            <Link to="/admin/module">Manage Module</Link>
                          </li>
                          <li
                            className={`${
                              pathname === "/admin/content"
                                ? "current-menu-item"
                                : ""
                            } d-lg-none`}
                          >
                            <Link to="/admin/content">Manage Content</Link>
                          </li>
                        </>
                      )}
                    {AuthStorage.loggedIn &&
                      AuthStorage.userInfo.role.type === "user" && (
                        <>
                          <li
                            className={
                              pathname === "/" ? "current-menu-item" : ""
                            }
                          >
                            <Link to="/">Home</Link>
                          </li>
                          <li
                            className={
                              pathname === "/my-training"
                                ? "current-menu-item"
                                : ""
                            }
                          >
                            <Link to="/my-training">My Training</Link>
                          </li>
                          <li
                            className={
                              pathname === "/trainings"
                                ? "current-menu-item"
                                : ""
                            }
                          >
                            <Link to="/trainings">Store Training</Link>
                          </li>
                          <li>
                            <a href="#">blog</a>
                          </li>
                          <li>
                            <a href="#">Contact</a>
                          </li>
                        </>
                      )}
                    {!AuthStorage.loggedIn && (
                      <>
                        <li
                          className={
                            pathname === "/" ? "current-menu-item" : ""
                          }
                        >
                          <Link to="/">Home</Link>
                        </li>
                        <li>
                          <a href="#">About</a>
                        </li>
                        <li
                          className={
                            pathname === "/trainings" ? "current-menu-item" : ""
                          }
                        >
                          <Link to="/trainings">Trainings</Link>
                        </li>
                        <li>
                          <a href="#">blog</a>
                        </li>
                        <li>
                          <a href="#">Contact</a>
                        </li>
                      </>
                    )}
                  </ul>

                  <div
                    onClick={() => {
                      this.handleShowMobile();
                    }}
                    className={`hamburger-menu d-lg-none ${
                      isShowMobile ? "open" : ""
                    }`}
                  >
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  {AuthStorage.loggedIn &&
                    AuthStorage.userInfo.role.type === "creator" && (
                      <div className="header-bar-cart has-submenu d-none d-lg-block">
                        <a
                          href="#"
                          className="flex justify-content-center align-items-center has-menu"
                        >
                          <i className="fa fa-caret-down"></i>
                        </a>
                        <div className="sub-menu">
                          <Link
                            className={
                              pathname === "/admin/course"
                                ? "current-menu-item"
                                : ""
                            }
                            to="/admin/course"
                          >
                            Manage Course
                          </Link>
                          <Link
                            className={
                              pathname === "/admin/module"
                                ? "current-menu-item"
                                : ""
                            }
                            to="/admin/module"
                          >
                            Manage Module
                          </Link>
                          <Link
                            className={
                              pathname === "/admin/content"
                                ? "current-menu-item"
                                : ""
                            }
                            to="/admin/content"
                          >
                            Manage Content
                          </Link>
                        </div>
                      </div>
                    )}
                </nav>
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Navbar));
