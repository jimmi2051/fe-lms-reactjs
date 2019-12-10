import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { registerUser, getRoles } from "redux/action/user";
import Header from "components/Layout/Header";
import AuthStorage from "utils/AuthStorage";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function mapStateToProps(state) {
  return {
    store: {
      auth: state.auth,
      registerUser: state.user.registerUser.data,
      loading: state.user.registerUser.loading,
      roles: state.user.roles.data,
      loadingRoles: state.user.roles.loading
    }
  };
}

const mapDispatchToProps = dispatch => {
  return {
    action: bindActionCreators({ getRoles, registerUser }, dispatch)
  };
};

class Register extends Component {
  maxDate = new Date();
  state = {
    errors: {},
    isSuccess: false,
    date: new Date()
  };

  componentDidMount() {
    if (AuthStorage && AuthStorage.loggedIn) {
      this.props.history.push("/");
    }
    this.handleGetRoles();
  }

  componentWillReceiveProps(nextProps) {
    if (AuthStorage && AuthStorage.loggedIn) {
      this.props.history.push("/");
    }
  }

  handleGetRoles = () => {
    const payload = {};
    const { getRoles } = this.props.action;
    getRoles(payload, () => {});
  };

  handleRegister = e => {
    e.preventDefault();
    const {
      email,
      password,
      firstName,
      lastName,
      tel,
      role,
      confirmPassword
    } = this.refs;
    const { date } = this.state;
    if (
      this.handleValidation(
        email.value,
        password.value,
        confirmPassword.value,
        tel.value,
        date,
        role.value
      )
    ) {
      const { registerUser } = this.props.action;
      const payload = {
        username: email.value,
        email: email.value,
        firstName: firstName.value,
        lastName: lastName.value,
        tel: tel.value,
        role: role.value,
        dateOfBirth: date,
        password: password.value
      };
      registerUser(payload, () => {
        const { registerUser } = this.props.store;
        if (registerUser && registerUser.jwt) {
          this.setState({ isSuccess: true });
        }
        if (registerUser.message) {
          let errors = {};
          errors["token"] = registerUser.message;
          this.setState({
            errors
          });
        }
      });
    }
  };
  handleValidation = (
    username,
    password,
    confirmPassword,
    telephone,
    date,
    role
  ) => {
    let reg = /^\d+$/;
    const mediumRegex = new RegExp(
      "^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})"
    );
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
    if (!password || password === "") {
      formIsValid = false;
      errors["password"] = "This field is required";
    }
    if (!telephone || telephone === "") {
      formIsValid = false;
      errors["tel"] = "This field is required";
    }
    if (!reg.test(telephone)) {
      formIsValid = false;
      errors["tel"] = "Phone is incorrect";
    }
    if (!mediumRegex.test(password)) {
      formIsValid = false;
      errors["password"] = "The password is too simple";
    }
    if (!confirmPassword || confirmPassword === "") {
      formIsValid = false;
      errors["confirmPassword"] = "This field is required";
    }
    if (password !== confirmPassword) {
      formIsValid = false;
      errors["confirmPassword"] = "Password isn't match";
    }
    const currentDate = new Date();
    if (date > currentDate) {
      formIsValid = false;
      errors["date"] = "Birthday is invalid";
    }
    if (role === "-1") {
      formIsValid = false;
      errors["role"] = "Please choose role";
    }
    this.setState({ errors: errors });
    return formIsValid;
  };
  handleRefeshError = () => {
    this.setState({ errors: {} });
  };
  onChangeDate = date => {
    this.setState({ date });
  };
  render() {
    const { loadingRoles, roles } = this.props.store;
    return (
      <div className="page-header">
        <Header titleHeader="Register Page" />
        <div className="container login-page">
          <div className="row justify-content-center pt-5 pb-5">
            <div className="col-xl-6">
              {this.state.isSuccess ? (
                <div className="wrap-notify">
                  <h5 className="text-success mb-3">
                    Registration Successfully
                    <i className="pl-3 fa fa-check" />
                  </h5>
                  <p>Please check your email to confirm account.</p>
                  <p>
                    Click{" "}
                    <Link className="text-success" to="/login">
                      here
                    </Link>{" "}
                    to Login!
                  </p>
                </div>
              ) : (
                <form onSubmit={this.handleRegister} className="form-sign-in">
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
                        this.state.errors["username"]
                          ? "border border-danger"
                          : ""
                      } form-control`}
                      id="emailLogin"
                      placeholder="Enter email"
                      ref="email"
                      maxLength="50"
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
                        this.state.errors["password"]
                          ? "border border-danger"
                          : ""
                      } form-control`}
                      id="passwordLogin"
                      placeholder="Enter password"
                      ref="password"
                      maxLength="50"
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
                    <label htmlFor="confirmPasswordLogin">
                      Confirm password
                    </label>
                    <input
                      type="password"
                      className={`${
                        this.state.errors["confirmPassword"]
                          ? "border border-danger"
                          : ""
                      } form-control`}
                      id="confirmPasswordLogin"
                      placeholder="Enter confirm password"
                      ref="confirmPassword"
                      maxLength="50"
                      onClick={this.handleRefeshError}
                    />
                    {this.state.errors["confirmPassword"] && (
                      <label
                        id="id_password-error"
                        className="error"
                        htmlFor="id_password"
                      >
                        {this.state.errors["confirmPassword"]}
                      </label>
                    )}
                  </div>
                  <div className="form-group">
                    <label htmlFor="firstName">First Name</label>
                    <input
                      type="text"
                      className={`${
                        this.state.errors["firstName"]
                          ? "border border-danger"
                          : ""
                      } form-control`}
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
                        maxLength="100"
                      >
                        {this.state.errors["firstName"]}
                      </label>
                    )}
                  </div>
                  <div className="form-group">
                    <label htmlFor="lastName">Last Name</label>
                    <input
                      type="text"
                      className={`${
                        this.state.errors["lastName"]
                          ? "border border-danger"
                          : ""
                      } form-control`}
                      id="lastName"
                      placeholder="Enter last name"
                      ref="lastName"
                      onClick={this.handleRefeshError}
                      maxLength="100"
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
                      className={`${
                        this.state.errors["tel"] ? "border border-danger" : ""
                      } form-control`}
                      id="tel"
                      placeholder="Enter your phone"
                      ref="tel"
                      onClick={this.handleRefeshError}
                      maxLength="12"
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
                    <label>Birth date</label>
                    <DatePicker
                      onChange={date => this.onChangeDate(date)}
                      selected={this.state.date}
                      className={`${
                        this.state.errors["date"] ? "border border-danger" : ""
                      } form-control`}
                      dateFormat="dd/MM/yyyy"
                      maxDate={Date.now()}
                    />
                    {this.state.errors["date"] && (
                      <label
                        id="id_password-error"
                        className="error"
                        htmlFor="id_password"
                      >
                        {this.state.errors["date"]}
                      </label>
                    )}
                  </div>
                  <div className="form-group">
                    <label htmlFor="role">Role</label>
                    <select
                      ref="role"
                      className={`${
                        this.state.errors["role"] ? "border border-danger" : ""
                      } form-control`}
                      id="role"
                    >
                      <option value="-1">Select role</option>
                      {!loadingRoles &&
                        roles.roles.map((item, index) => {
                          return (
                            <option key={index} value={item._id}>
                              {item.name}
                            </option>
                          );
                        })}
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
                  <div className="form-group text-center">
                    <button
                      type="submit"
                      className="btn bg-root"
                      style={{ cursor: "pointer" }}
                    >
                      Register
                    </button>
                  </div>
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
