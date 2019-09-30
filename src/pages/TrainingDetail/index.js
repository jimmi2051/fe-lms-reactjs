import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Header from "components/Layout/Header";
import { getTrainingByUser } from "redux/action/training";
import _ from "lodash";
import AuthStorage from "utils/AuthStorage";
import moment from "moment";

const REACT_APP_URL_API = process.env.REACT_APP_URL_API;

function mapStateToProps(state) {
  return {
    store: {
      listTraining: state.listTraining.listTraining.data,
      loadingListTraining: state.listTraining.listTraining.loading
    }
  };
}

const mapDispatchToProps = dispatch => {
  return {
    action: bindActionCreators(
      {
        getTrainingByUser
      },
      dispatch
    )
  };
};

class TrainingDetail extends Component {
  componentDidMount() {
    console.log("this is props>>>", this.props);
  }
  handleGetTrainig = userId => {
    const payload = { id: userId };
    const { getTrainingByUser } = this.props.action;
    getTrainingByUser(payload);
  };
  render() {
    const { loadingListTraining, listTraining } = this.props.store;
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
                  <li>Training</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-xl-4">
              <div className="card text-white bg-primary mb-3">
                <div className="card-header">TRAINING "NAME_TRAINING"</div>
                <div className="card-body">
                  <h5 className="card-title">Learning Path</h5>
                  <p className="card-text">
                    <ul>
                      <li>Course 1</li>
                      <li>Course 2</li>
                    </ul>
                  </p>
                </div>
              </div>
            </div>
            <div className="col-xl-8">
              <div className="featured-courses courses-wrap">
                <iframe
                  width="560"
                  height="315"
                  src="https://www.youtube.com/embed/PkZNo7MFNFg"
                  frameborder="0"
                  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen
                ></iframe>
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
)(TrainingDetail);
