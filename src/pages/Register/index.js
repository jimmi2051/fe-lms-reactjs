import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { registerUser } from "redux/action/user";
import Header from "components/Layout/Header";
import AuthStorage from "utils/AuthStorage";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";
function mapStateToProps(state) {
  return {
    store: {
      auth: state.auth,
      registerUser: state.user.registerUser.data,
      loading: state.user.registerUser.loading
    }
  };
}

const mapDispatchToProps = dispatch => {
  return {
    action: bindActionCreators({ registerUser }, dispatch)
  };
};

class Register extends Component {
  state = {
    errors: {},
    isSuccess: false
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

  handleRegister = e => {
    e.preventDefault();
    const { email, password, firstName, lastName, tel, role } = this.refs;
    if (this.handleValidation(email.value, password.value)) {
      const { registerUser } = this.props.action;
      const payload = {
        username: email.value,
        email: email.value,
        firstName: firstName.value,
        lastName: lastName.value,
        tel: tel.value,
        role: role.value,
        dateOfBirth: "1997-08-19T17:00:00.000Z",
        password: password.value
      };
      registerUser(
        payload,
        () => {
          const { registerUser } = this.props.store;
          console.log("registerUser", registerUser);
          if (registerUser && registerUser.jwt) {
            this.setState({ isSuccess: true });
          }
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
        <Header titleHeader="Register Page" />
        <div className="container">
          <div className="row justify-content-center pt-5 pb-5">
            <div className="col-xl-6">
              {this.state.isSuccess ? (
                <h4 className="alert alert-success">
                  Register success. Click <Link to="/login">here</Link> to Login
                </h4>
              ) : (
                <form onSubmit={this.handleRegister}>
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
                  <div className="form-group">
                    <label htmlFor="firstName">First Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="firstName"
                      placeholder="Enter first name"
                      ref="firstName"
                      onClick={this.handleRefeshError}
                    />
                    {this.state.errors["firstName"] && (
                      <label
                        id="id_password-error"
                        className="error"
                        htmlFor="id_password"
                      >
                        {this.state.errors["firstName"]}
                      </label>
                    )}
                  </div>
                  <div className="form-group">
                    <label htmlFor="lastName">Last Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="lastName"
                      placeholder="Enter last name"
                      ref="lastName"
                      onClick={this.handleRefeshError}
                    />
                    {this.state.errors["lastName"] && (
                      <label
                        id="id_password-error"
                        className="error"
                        htmlFor="id_password"
                      >
                        {this.state.errors["lastName"]}
                      </label>
                    )}
                  </div>
                  <div className="form-group">
                    <label htmlFor="tel">Telephone</label>
                    <input
                      type="text"
                      className="form-control"
                      id="tel"
                      placeholder="Enter your phone"
                      ref="tel"
                      onClick={this.handleRefeshError}
                    />
                    {this.state.errors["tel"] && (
                      <label
                        id="id_password-error"
                        className="error"
                        htmlFor="id_password"
                      >
                        {this.state.errors["tel"]}
                      </label>
                    )}
                  </div>
                  <div className="form-group">
                    <label htmlFor="role">Role</label>
                    <select ref="role" className="form-control" id="role">
                      <option value="-1">Select role</option>
                      <option value="5d6a13a6b51a2c3ebdb69b6e">
                        INSTRUCTOR
                      </option>
                      <option value="5d6a164cb51a2c3ebdb69bbe">STUDENT</option>
                    </select>
                    {this.state.errors["role"] && (
                      <label
                        id="id_password-error"
                        className="error"
                        htmlFor="id_password"
                      >
                        {this.state.errors["role"]}
                      </label>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ cursor: "pointer" }}
                  >
                    Register
                  </button>
                </form>
              )}
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
)(withRouter(Register));
