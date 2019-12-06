import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Header from "components/Layout/Header";
import { resetPassword, requestForgotPassword } from "redux/action/user";
import AuthStorage from "utils/AuthStorage";
import { withRouter } from "react-router";
import { ToastContainer } from "react-toastr";
import _ from "lodash"
import Loading from "components/Loading";
let toastr;

function mapStateToProps(state) {
  return {
    store: {
      auth: state.auth
    }
  };
}

const mapDispatchToProps = dispatch => {
  return {
    action: bindActionCreators({ requestForgotPassword, resetPassword }, dispatch)
  };
};

class ForgotPassword extends Component {
  state = {
    errors: {},
    isRequestSuccess: false,
    isConfirmCode: false,
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

  handleSubmitRequest = () => {
    this.setState({ loading: true })
    const { email, } = this.refs;
    if (this.handleValidation(email.value)) {
      this.handleRequestForgotPassword(email.value);
    }
    else {
      this.setState({ loading: false })
    }
  };

  handleRequestForgotPassword = (email) => {
    const { requestForgotPassword } = this.props.action;
    const payload = { email }
    requestForgotPassword(payload, (response) => {
      if (response && response.ok) {
        this.setState({ isRequestSuccess: true })
        this.notifySuccess("Notification", "Request successfully, please check your email. Thanks")
      }
      else {
        this.notifyError(response.error, response.message)
      }
      this.setState({ loading: false })
    })
  }

  handleValidation = (username) => {
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
    this.setState({ errors: errors });
    return formIsValid;
  };

  handleSubmitReset = () => {
    this.setState({ loading: true })
    const { code, password, confirmPassword } = this.refs;
    if (this.handleValidationReset(code.value, password.value, confirmPassword.value)) {
      this.handleResetPassword(code.value, password.value, confirmPassword.value);
    }
    else {
      this.setState({ loading: false })
    }
  }

  handleResetPassword = (code, password, passwordConfirmation) => {
    const payload = { code, password, passwordConfirmation }
    const { resetPassword } = this.props.action;
    resetPassword(payload, response => {
      if (response && response.jwt) {
        this.notifySuccess("Notification", "Reset password successfully.")
        this.setState({ isRequestSuccess: false })
      }
      else {
        this.notifyError(response.error, response.message)
      }
      this.setState({ loading: false })
    })
  }

  handleValidationReset = (code, password, confirmPassword) => {
    let formIsValid = true;
    let errors = {};
    if (!code || code === "") {
      formIsValid = false;
      errors["code"] = "This field is required";
    }

    if (!password || password === "") {
      formIsValid = false;
      errors["password"] = "This field is required";
    }

    if (!confirmPassword || confirmPassword === "") {
      formIsValid = false;
      errors["confirmPassword"] = "This field is required";
    }

    if (password !== confirmPassword) {
      formIsValid = false;
      errors["confirmPassword"] = "Password isn't match";
    }
    this.setState({ errors: errors });
    return formIsValid;
  }

  handleRefeshError = () => {
    this.setState({ errors: {} });
  };

  notifySuccess = (title, content) => {
    toastr.success(content, title, {
      closeButton: true
    });
  };

  notifyError = (title, content) => {
    toastr.error(content, title, {
      closeButton: true
    });
  };

  render() {
    const { isRequestSuccess, loading } = this.state;
    return (
      <div className="page-header">
        <ToastContainer
          ref={ref => (toastr = ref)}
          className="toast-top-right"
        />
        <Header titleHeader="Forgot Password Page" />
        <div className="container login-page">
          {isRequestSuccess ? (<div className="row justify-content-center pt-5 pb-5">
            <div className="col-xl-6">
              <div className="form-group">
                <label htmlFor="codeVerify">Code</label>
                <input
                  type="text"
                  className={`${this.state.errors["code"] ? "border border-danger" : ""} form-control`}
                  id="codeVerify"
                  placeholder="Enter your code"
                  ref="code"
                  defaultValue=""
                  onClick={this.handleRefeshError}
                />
                <small className="form-text text-muted">
                  (*) Please check your email to get code and enter it here.
                </small>
                {this.state.errors["code"] && (
                  <label
                    className="error"
                    htmlFor="id_password"
                  >
                    {this.state.errors["code"]}
                  </label>
                )}
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  className={`${this.state.errors["password"] ? "border border-danger" : ""} form-control`}
                  placeholder="Enter password"
                  ref="password"
                  maxLength="50"
                  onClick={this.handleRefeshError}
                />
                {this.state.errors["password"] && (
                  <label
                    className="error"
                    htmlFor="id_password"
                  >
                    {this.state.errors["password"]}
                  </label>
                )}
              </div>
              <div className="form-group">
                <label>Confirm password</label>
                <input
                  type="password"
                  className={`${this.state.errors["confirmPassword"] ? "border border-danger" : ""} form-control`}
                  placeholder="Enter confirm password"
                  ref="confirmPassword"
                  maxLength="50"
                  onClick={this.handleRefeshError}
                />
                {this.state.errors["confirmPassword"] && (
                  <label
                    className="error"
                    htmlFor="id_password"
                  >
                    {this.state.errors["confirmPassword"]}
                  </label>
                )}
              </div>
              <div className="form-group text-center">
                <button
                  type="submit"
                  className="btn bg-root"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    this.handleSubmitReset();
                  }}
                >
                  {loading ? <Loading color="#ffffff" classOption="align-center-spinner" /> : "Reset password"}
                </button>
              </div>
            </div>
          </div>) :
            (<div className="row justify-content-center pt-5 pb-5">
              <div className="col-xl-6">
                <div className="form-group">
                  <label htmlFor="emailLogin">Email address</label>
                  <input
                    type="text"
                    className={`${this.state.errors["username"] ? "border border-danger" : ""} form-control`}
                    id="emailLogin"
                    placeholder="Enter your email"
                    ref="email"
                    onClick={this.handleRefeshError}
                  />
                  {this.state.errors["username"] && (
                    <label
                      className="error"
                      htmlFor="id_password"
                    >
                      {this.state.errors["username"]}
                    </label>
                  )}
                </div>
                <div className="form-group text-center">
                  <button
                    type="submit"
                    className="btn bg-root"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      this.handleSubmitRequest();
                    }}
                  >
                    {loading ? <Loading color="#ffffff" classOption="align-center-spinner" /> : "Send email"}
                  </button>
                </div>
              </div>
            </div>)
          }
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ForgotPassword));
