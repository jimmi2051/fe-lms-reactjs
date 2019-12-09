/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Header from "components/Layout/Header";
import {
  getAllTraining,
  getAllCategory,
  addToMyTraining,
  getTrainingToLearn
} from "redux/action/training";
import _ from "lodash";
import AuthStorage from "utils/AuthStorage";
import moment from "moment";
import { Link } from "react-router-dom";
import Loading from "components/Loading";
import Pagination from "react-js-pagination";
import { ToastContainer } from "react-toastr";
const REACT_APP_URL_API = process.env.REACT_APP_URL_API;
const ENTER_KEY = 13;
function mapStateToProps(state) {
  return {
    store: {
      trainingAll: state.trainingAll.trainingAll.data,
      loadingTrainingAll: state.trainingAll.trainingAll.loading,
      categoryAll: state.trainingAll.categoryAll.data,
      loadingCategoryAll: state.trainingAll.categoryAll.loading,
      isAddTraining: state.isAddTraining.isAddTraining.data,
      loadingAddTraining: state.isAddTraining.isAddTraining.loading,
      listTrainingLearn: state.listTrainingLearn.listTrainingLearn.data,
      loadingListTrainingLearn:
        state.listTrainingLearn.listTrainingLearn.loading
    }
  };
}

const mapDispatchToProps = dispatch => {
  return {
    action: bindActionCreators(
      {
        getAllTraining,
        getAllCategory,
        addToMyTraining,
        getTrainingToLearn
      },
      dispatch
    )
  };
};
let toastr;
class ListTraining extends Component {
  state = {
    addSuccess: false,
    trainingExists: {},
    keySearch: "",
    startItemPage: 0,
    itemPerPage: 4,
    totalPage: -1,
    activePage: 1,
    categoryId: ""
  };
  componentDidMount() {
    this.handleGetMyTraining(AuthStorage.userInfo._id);
    this.handleGetCategory();
    this.handleGetTotalPage();
  }

  handleGetTotalPage = () => {
    const { keySearch, categoryId } = this.state;
    fetch(
      `https://be-lms.tk/trainings?${
        keySearch !== "" ? `name_contains=${keySearch}&` : ``
      }${
        categoryId !== "" ? `categorytrainings._id=${categoryId}&` : ""
      }activityusers.user._id=${AuthStorage.userInfo._id}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${AuthStorage.token}`
        }
      }
    )
      .then(response => {
        return response.json();
      })
      .then(result => {
        this.setState({ totalPage: result.length });
      });
  };

  handleGetMyTraining = userId => {
    const { keySearch, startItemPage, itemPerPage, categoryId } = this.state;
    const payload = {
      keySearch,
      startItemPage,
      itemPerPage,
      userId,
      categoryId
    };
    const { getTrainingToLearn } = this.props.action;
    getTrainingToLearn(payload, response => {});
  };

  handleGetCategory = () => {
    const payload = {};
    const { getAllCategory } = this.props.action;
    getAllCategory(payload);
  };

  handleClosePopup = () => {
    this.setState({ addSuccess: false });
  };

  handleInputSearch = e => {
    this.setState({ keySearch: e.target.value });
  };

  beginSearch = e => {
    if (e.keyCode === ENTER_KEY) {
      this.setState({ startItemPage: 0 }, () => {
        this.handleGetTotalPage();
        this.handleGetMyTraining(AuthStorage.userInfo._id);
      });
    }
  };

  handlePageChange(pageNumber) {
    let { startItemPage, itemPerPage } = this.state;
    startItemPage = (pageNumber - 1) * itemPerPage;
    this.setState({ activePage: pageNumber, startItemPage }, () => {
      this.handleGetMyTraining(AuthStorage.userInfo._id);
    });
  }

  fitlerCategory = categoryId => {
    this.setState({ categoryId, startItemPage: 0 }, () => {
      this.handleGetTotalPage();
      this.handleGetMyTraining(AuthStorage.userInfo._id);
    });
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
    const {
      loadingCategoryAll,
      categoryAll,
      listTrainingLearn,
      loadingListTrainingLearn
    } = this.props.store;
    const { categoryId } = this.state;

    if (loadingCategoryAll || loadingListTrainingLearn) {
      return (
        <div className="page-header">
          <Header titleHeader="MY TRAINING" />
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
                    <li>My Training</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="row courses-wrap-custom">
              <div className="col-xl-12">
                <Loading classOption="align-center-spinner" />
              </div>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="page-header">
        <ToastContainer
          ref={ref => (toastr = ref)}
          className="toast-top-right"
        />
        <Header titleHeader="MY TRAINING" />
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
                  <li>My Training</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="row courses-wrap-custom">
            <div className="col-xl-4">
              <div
                className="sidebar"
                style={{ height: "100%", minHeight: "600px" }}
              >
                <div className="cat-links">
                  <h2>Categories</h2>
                  <div className="form-group">
                    <input
                      onKeyDown={this.beginSearch}
                      className="form-control"
                      onChange={this.handleInputSearch}
                      placeholder="Search by training name."
                    />
                  </div>
                  <ul className="p-0 m-0">
                    {!loadingCategoryAll &&
                      categoryAll.map((item, index) => {
                        return (
                          <li key={index}>
                            <Link
                              className={`${
                                categoryId === item._id
                                  ? "font-weight-bold"
                                  : ""
                              }`}
                              to="#"
                              onClick={e => {
                                e.preventDefault();
                                this.fitlerCategory(item._id);
                              }}
                            >
                              {item.name}
                            </Link>
                          </li>
                        );
                      })}
                    <li>
                      <Link
                        to="#"
                        className={`${
                          categoryId === "" ? "font-weight-bold" : ""
                        }`}
                        onClick={e => {
                          e.preventDefault();
                          this.fitlerCategory("");
                        }}
                      >
                        VIEW ALL
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-xl-8">
              <div className="featured-courses courses-wrap">
                <div className="row  ">
                  {!loadingListTrainingLearn &&
                  listTrainingLearn.data &&
                  _.isArray(listTrainingLearn.data.trainings) ? (
                    listTrainingLearn.data.trainings.map((item, index) => {
                      const idx = _.findIndex(
                        item.activityusers,
                        activity =>
                          activity.user &&
                          activity.user._id === AuthStorage.userInfo._id
                      );
                      const activityOfTraining = item.activityusers[idx];
                      let percent = 0;
                      if (
                        !_.isEmpty(activityOfTraining) &&
                        !_.isEmpty(activityOfTraining.courses)
                      ) {
                        percent =
                          (activityOfTraining.courses.length /
                            item.learningpaths.length) *
                          100;
                      }
                      return (
                        <div key={index} className="col-12 col-md-6  ">
                          <div className="course-content">
                            <figure className="course-thumbnail">
                              <Link
                                to={{
                                  pathname: `training/${item._id}`,
                                  state: {
                                    currentActivity: activityOfTraining
                                  }
                                }}
                              >
                                <img
                                  src={
                                    _.isEmpty(item.thumbnail)
                                      ? "https://be-lms.tk/uploads/9ee513ab17ae4d2ca9a7fa3feb3b2d67.png"
                                      : `${REACT_APP_URL_API}${item.thumbnail.url}`
                                  }
                                  alt=""
                                />
                              </Link>
                            </figure>

                            <div className="course-content-wrap">
                              <header className="entry-header">
                                <h2 className="entry-title">
                                  <Link
                                    to={{
                                      pathname: `training/${item._id}`,
                                      state: {
                                        currentActivity: activityOfTraining
                                      }
                                    }}
                                  >
                                    {item.name}
                                  </Link>
                                </h2>

                                <div className="entry-meta flex flex-wrap align-items-center">
                                  <div className="course-author">
                                    {item.users && item.users.length > 0 ? (
                                      <a href="#">
                                        {item.users[0].firstName}{" "}
                                        {item.users[0].lastName}{" "}
                                      </a>
                                    ) : (
                                      <a href="#">Unknow author</a>
                                    )}
                                  </div>
                                  <div className="course-date">
                                    {moment(item.createdAt).format(
                                      "MMM. D, YYYY"
                                    )}
                                  </div>
                                  <div className="course-cost">
                                    Scores earned:{" "}
                                    {activityOfTraining.totalMark}
                                  </div>
                                </div>
                              </header>

                              <footer className="entry-footer flex flex-wrap justify-content-between align-items-center">
                                <div className="pb-3" style={{ width: "100%" }}>
                                  <div className="progress">
                                    <div
                                      className="progress-bar bg-root"
                                      role="progressbar"
                                      style={{ width: `${percent}%` }}
                                      aria-valuenow="25"
                                      aria-valuemin="0"
                                      aria-valuemax="100"
                                    >
                                      {percent} %
                                    </div>
                                  </div>
                                </div>
                                <Link
                                  to={{
                                    pathname: `training/${item._id}`,
                                    state: {
                                      currentActivity: activityOfTraining
                                    }
                                  }}
                                >
                                  <button
                                    style={{ cursor: "pointer" }}
                                    type="button"
                                    className="btn bg-root"
                                  >
                                    Continue learning
                                  </button>
                                </Link>
                              </footer>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="col-xl-12">
                      <Loading classOption="align-center-spinner" />
                    </div>
                  )}
                  {this.state.totalPage === 0 && (
                    <h5 className="col-xl-12 text-success">
                      No training found. Please go to store training to add more
                      training.
                    </h5>
                  )}
                </div>
                <div className="row">
                  <div className="col-xl-12">
                    {this.state.totalPage > 0 && (
                      <Pagination
                        activePage={this.state.activePage}
                        itemsCountPerPage={this.state.itemPerPage}
                        totalItemsCount={this.state.totalPage}
                        pageRangeDisplayed={5}
                        onChange={this.handlePageChange.bind(this)}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ListTraining);
