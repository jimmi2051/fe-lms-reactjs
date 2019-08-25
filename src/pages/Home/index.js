import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { getUsers } from "redux/action/user";
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
    action: bindActionCreators({ getUsers }, dispatch)
  };
};

class HomePage extends Component {
  componentDidMount() {
    this.handleGetUser();
  }
  handleGetUser = () => {
    const { getUsers } = this.props.action;
    const payload = {};
    getUsers(payload, () => {});
  };
  render() {
    const { loading, listUser } = this.props.store;
    if (loading) {
      return <div>Loading...</div>;
    }
    return (
      <ul>
        {listUser.map((item, index) => {
          return <li key={index}>{item.username}</li>;
        })}
      </ul>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomePage);
