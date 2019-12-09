import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Header from "components/Layout/Header";
import { loginRequest } from "redux/action/auth";
import AuthStorage from "utils/AuthStorage";
import { withRouter } from "react-router";
import Loading from "components/Loading";
import { Link } from "react-router-dom";
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
    errors: {},
    loading: false
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
    return (
      <div className="page-header">
        <Header titleHeader="Login Page" />
        <div className="container login-page">
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
                    className={`${
                      this.state.errors["username"] ||
                      this.state.errors["token"]
                        ? "border border-danger"
                        : ""
                    } form-control`}
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
                    className={`${
                      this.state.errors["password"] ||
                      this.state.errors["token"]
                        ? "border border-danger"
                        : ""
                    } form-control`}
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
                <div className="form-group text-center">
                  <button
                    type="submit"
                    className="btn bg-root"
                    style={{ cursor: "pointer" }}
                    disabled={loading}
                  >
                    {loading ? (
                      <Loading
                        color="#ffffff"
                        classOption="align-center-spinner"
                      />
                    ) : (
                      "Login"
                    )}
                  </button>
                </div>
                <div className="form-group text-center">
                  <Link to="/forgot-password">Forgot password. </Link>
                </div>
                <div className="form-group text-center">
                  Don't have an account? <Link to="/register">Register</Link>{" "}
                  here.
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Login));
