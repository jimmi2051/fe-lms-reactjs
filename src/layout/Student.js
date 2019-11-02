import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router";
// import {compose} from 'redux';
// import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import AuthStorage from "utils/AuthStorage";
import { logoutRequest } from "redux/action/auth";
function mapStateToProps(state) {
  return {
    store: {
      user: state.user
    }
  };
}

const mapDispatchToProps = dispatch => {
  return {
    action: bindActionCreators(
      {
        logoutRequest
      },
      dispatch
    )
  };
};

class StudentWrap extends PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired
    // store: PropTypes.shape({
    // 	auth: PropTypes.object.isRequired
    // })
  };


  componentDidMount() {
    const { history } = this.props;
    if (!AuthStorage.loggedIn) {
      history.push("/login");
    }
    else{
      if (AuthStorage.userInfo && AuthStorage.userInfo.role.type !== "user") {
        this.props.action.logoutRequest();
        history.push("/login");
      }
    }
  }
  render() {
    const { children } = this.props;
    if (!AuthStorage.loggedIn) {
      return null;
    }
    return children;
  }
}

// export default withRouter(AuthWrap);

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(StudentWrap)
);