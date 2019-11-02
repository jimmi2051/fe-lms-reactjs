import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Header from "components/Layout/Header";
import { loginRequest } from "redux/action/auth";
import AuthStorage from "utils/AuthStorage";
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
    action: bindActionCreators({ loginRequest }, dispatch)
  };
};

class Login extends Component {
  state = {
    errors: {}
  };
  componentDidMount() {
    if (AuthStorage && AuthStorage.loggedIn) {
      this.props.history.push("/");
    }
  }

  componentWillReceiveProps(nextProps) {
    if (AuthStorage && AuthStorage.loggedIn) {
      this.props.history.push("/");
    }
  }

  handleLogin = e => {
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
        () => {
          const { auth } = this.props.store;
        },
        err => {
          let errors = {};
          if (err.message) {
            errors["token"] = err.message;
            this.setState({
              errors
            });
          }
        }
      );
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
    return (
      <div className="page-header">
        <Header titleHeader="Login Page" />
        <div className="container">
          <div className="row justify-content-center pt-5 pb-5">
            <div className="col-xl-6">
              <form onSubmit={this.handleLogin}>
                {this.state.errors["token"] && (
                  <label
                    id="id_password-error"
                    className="error"
                    htmlFor="id_password"
                  >
                    {this.state.errors["token"]}
                  </label>
                )}
                <div className="form-group">
                  <label htmlFor="emailLogin">Email address</label>
                  <input
                    type="text"
                    className="form-control"
                    id="emailLogin"
                    placeholder="Enter email"
                    ref="email"
                    onClick={this.handleRefeshError}
                  />
                  {this.state.errors["username"] && (
                    <label
                      id="id_password-error"
                      className="error"
                      htmlFor="id_password"
                    >
                      {this.state.errors["username"]}
                    </label>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="passwordLogin">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="passwordLogin"
                    placeholder="Password"
                    ref="password"
                    onClick={this.handleRefeshError}
                  />
                  {this.state.errors["password"] && (
                    <label
                      id="id_password-error"
                      className="error"
                      htmlFor="id_password"
                    >
                      {this.state.errors["password"]}
                    </label>
                  )}
                </div>
                <button
                  type="submit"
                  className="btn bg-root"
                  style={{ cursor: "pointer" }}
                >
                  Login
                </button>
              </form>
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
)(withRouter(Login));
