import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Header from "components/Layout/Header";
import {
  getTrainingByUser,
  getTrainingByCategory
} from "redux/action/training";
import _ from "lodash";
import AuthStorage from "utils/AuthStorage";
import moment from "moment";
import { Link } from "react-router-dom";
const REACT_APP_URL_API = process.env.REACT_APP_URL_API;

function mapStateToProps(state) {
  return {
    store: {
      listTraining: state.listTraining.listTraining.data,
      loadingListTraining: state.listTraining.listTraining.loading,
      trainingByCat: state.trainingByCat.trainingByCat.data,
      loadingTrainingByCat: state.trainingByCat.trainingByCat.loading
    }
  };
}

const mapDispatchToProps = dispatch => {
  return {
    action: bindActionCreators(
      {
        getTrainingByUser,
        getTrainingByCategory
      },
      dispatch
    )
  };
};

class ListTraining extends Component {
  componentDidMount() {
    this.handleGetTraining(AuthStorage.userInfo._id);
    this.handleGetTrainingByCategory(AuthStorage.userInfo._id);
  }
  handleGetTraining = userId => {
    const payload = { id: userId };
    const { getTrainingByUser } = this.props.action;
    getTrainingByUser(payload);
  };
  handleGetTrainingByCategory = userId => {
    const payload = { id: userId };
    const { getTrainingByCategory } = this.props.action;
    getTrainingByCategory(payload, () => {
    });
  };
  render() {
    const {
      loadingListTraining,
      listTraining,
      trainingByCat,
      loadingTrainingByCat
    } = this.props.store;
    return (
      <div className="page-header">
        <Header titleHeader="MANAGE TRAINING" />
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="breadcrumbs">
                <ul className="flex flex-wrap align-items-center p-0 m-0">
                  <li>
                    <Link to="/">
                      <i className="fa fa-home"></i> Home
                    </Link>
                  </li>
                  <li>Training</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="row courses-wrap-custom">
            <div className="col-xl-4">
              <div className="sidebar">
                <div className="cat-links">
                  <h2>Categories</h2>

                  <ul className="p-0 m-0">
                    {!loadingTrainingByCat &&
                      trainingByCat.data.categorytrainings.map(
                        (item, index) => {
                          return (
                            <li key={index}>
                              <Link to="#">{item.name}</Link>
                              <ul>
                                {item.trainings.map(
                                  (training, indexTraining) => {
                                    return (
                                      <li key={indexTraining}>
                                        <Link
                                          to={`/admin/training/${training.id}`}
                                        >
                                          {training.name}
                                        </Link>
                                      </li>
                                    );
                                  }
                                )}
                              </ul>
                            </li>
                          );
                        }
                      )}
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-xl-8">
              <div className="featured-courses courses-wrap">
                <div className="row mx-m-25">
                  {!loadingListTraining &&
                    listTraining.map((item, index) => {
                      return (
                        <div key={index} className="col-12 col-md-6 px-25">
                          <div className="course-content">
                            <figure className="course-thumbnail">
                              <Link to={`/admin/training/${item._id}`}>
                                <img
                                  src={`${REACT_APP_URL_API}${item.thumbnail.url}`}
                                  alt=""
                                />
                              </Link>
                            </figure>

                            <div className="course-content-wrap">
                              <header className="entry-header">
                                <h2 className="entry-title">
                                  <Link to={`/admin/training/${item._id}`}>
                                    {item.name}
                                  </Link>
                                </h2>

                                <div className="entry-meta flex flex-wrap align-items-center">
                                  <div className="course-author">
                                    <a href="#">
                                      {item.users[0].firstName}{" "}
                                      {item.users[0].lastName}{" "}
                                    </a>
                                  </div>
                                  <div className="course-date">
                                    {moment(item.createdAt).format(
                                      "MMM. D, YYYY"
                                    )}
                                  </div>
                                </div>
                              </header>

                              <footer className="entry-footer flex flex-wrap justify-content-between align-items-center">
                                {/* <div className="course-cost">
                                  $45 <span className="price-drop">$68</span>
                                </div>

                                <div className="course-ratings flex justify-content-end align-items-center">
                                  <span className="fa fa-star checked"></span>
                                  <span className="fa fa-star checked"></span>
                                  <span className="fa fa-star checked"></span>
                                  <span className="fa fa-star checked"></span>
                                  <span className="fa fa-star-o"></span>

                                  <span className="course-ratings-count">
                                    (4 votes)
                                  </span>
                                </div> */}
                                <p> Comming soon !!! </p>
                              </footer>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
              <div className="row no-gutters">
                <div className="col-xl-12">
                  <Link
                    to={`/admin/new-training`}
                    className="btn btn-success text-white"
                  >
                    CREATE NEW TRAINING
                  </Link>
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
)(ListTraining);
