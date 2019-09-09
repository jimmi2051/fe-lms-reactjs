import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { getUsers } from "redux/action/user";
import Header from "components/Layout/Header";
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

class CoursePage extends Component {
  componentDidMount() {}
  render() {
    return (
      <div className="page-header">
        <Header titleHeader="Course Page" />
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="breadcrumbs">
                <ul className="flex flex-wrap align-items-center p-0 m-0">
                  <li>
                    <a href="#">
                      <i className="fa fa-home"></i> Home
                    </a>
                  </li>
                  <li>Courses</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-xl-4">
              <div className="card text-white bg-primary mb-3">
                <div className="card-header">All Training</div>
                <div className="card-body">
                  <h5 className="card-title">Primary card title</h5>
                  <p className="card-text">
                    <ul>
                      <li>Item 1</li>
                      <li>Item 2</li>
                    </ul>
                  </p>
                </div>
              </div>
            </div>
            <div className="col-xl-8">
              <div className="row no-gutters">
                <div className="col-xl-6">Training 1</div>
                <div className="col-xl-6">Training 2</div>
              </div>
              <div className="row no-gutters">
                <div className="col-xl-12">
                  <button className="btn btn-success" style={{ width: "100%" }}>
                    CREATE NEW TRAINING
                  </button>
                </div>
              </div>
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
)(CoursePage);
