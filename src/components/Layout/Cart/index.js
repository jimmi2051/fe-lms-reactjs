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

class Cart extends Component {
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
    return <div className="cart"></div>;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Cart));
