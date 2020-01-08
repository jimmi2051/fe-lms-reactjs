/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Header from "components/Layout/Header";
import { loginRequest } from "redux/action/auth";
import AuthStorage from "utils/AuthStorage";
import { withRouter } from "react-router";
import Loading from "components/Loading";
import { Link } from "react-router-dom";
import _ from "lodash";
const REACT_APP_URL_API = process.env.REACT_APP_URL_API;
function mapStateToProps(state) {
  return {
    store: {
      auth: state.auth,
      cart: state.cart.cart
    }
  };
}

const mapDispatchToProps = dispatch => {
  return {
    action: bindActionCreators({ loginRequest }, dispatch)
  };
};

class Cart extends Component {
  state = {
    errors: {},
    loading: false
  };
  componentDidMount() {}

  componentWillReceiveProps(nextProps) {}

  handleLogin = e => {
    this.setState({ loading: true });
    e.preventDefault();
    const { email, password } = this.refs;
    if (this.handleValidation(email.value, password.value)) {
      const { loginRequest } = this.props.action;
      const payload = {
        identifier: email.value,
        password: password.value
      };
      loginRequest(
        payload,
        () => {},
        err => {
          let errors = {};
          if (err.message) {
            errors["token"] = err.message;
            this.setState({
              errors
            });
          }
          this.setState({ loading: false });
        }
      );
    } else {
      this.setState({ loading: false });
    }
  };
  handleValidation = (username, password) => {
    let formIsValid = true;
    let errors = {};
    //Validate username
    if (!username) {
      formIsValid = false;
      errors["username"] = "This field is required";
    } else {
      if (typeof username !== "undefined") {
        let lastAtPos = username.lastIndexOf("@");
        let lastDotPos = username.lastIndexOf(".");
        if (
          !(
            lastAtPos < lastDotPos &&
            lastAtPos > 0 &&
            username.indexOf("@@") === -1 &&
            lastDotPos > 2 &&
            username.length - lastDotPos > 2
          )
        ) {
          formIsValid = false;
          errors["username"] = "Email is incorrect. ";
        }
      }
    }

    //Validate password
    if (!password) {
      formIsValid = false;
      errors["password"] = "This field is required";
    }

    this.setState({ errors: errors });
    return formIsValid;
  };
  handleRefeshError = () => {
    this.setState({ errors: {} });
  };
  render() {
    const { loading } = this.state;
    const { cart } = this.props.store;
    return (
      <div className="page-header">
        <Header titleHeader="Cart Page" />
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
                  <li>
                    <a href="">My Cart</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="row justify-content-center pt-5 pb-5">
            <div className="col-xl-12">
              <table className="table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Thumbnail</th>
                    <th>Author</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cart &&
                    cart.length > 0 &&
                    cart.map((item, index) => {
                      return (
                        <tr>
                          <td>{index}</td>
                          <td>{item.name}</td>
                          <td>
                            <img
                              src={
                                _.isEmpty(item.thumbnail)
                                  ? "https://be-lms.tk/uploads/9ee513ab17ae4d2ca9a7fa3feb3b2d67.png"
                                  : `${REACT_APP_URL_API}${item.thumbnail.url}`
                              }
                              alt=""
                            />
                            />
                          </td>
                          <td>
                            {item.users && item.users.length > 0 ? (
                              <a href="#">
                                {item.users[0].firstName}{" "}
                                {item.users[0].lastName}{" "}
                              </a>
                            ) : (
                              <a href="#">Unknow author</a>
                            )}
                          </td>
                          <td>
                            <button>
                              {" "}
                              <i className="fa fa-remove" />{" "}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Cart));
