/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Header from "components/Layout/Header";
import {
  getAllTraining,
  getAllCategory,
  addToMyTraining
} from "redux/action/training";
import _ from "lodash";
import AuthStorage from "utils/AuthStorage";
import ActivityStorage from "utils/ActivityStorage";
import moment from "moment";
import { Link } from "react-router-dom";
import Loading from "components/Loading";
import Pagination from "react-js-pagination";
import { withRouter } from "react-router";
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
      loadingAddTraining: state.isAddTraining.isAddTraining.loading
    }
  };
}

const mapDispatchToProps = dispatch => {
  return {
    action: bindActionCreators(
      {
        getAllTraining,
        getAllCategory,
        addToMyTraining
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
    try {
      const { keySearch } = this.props.location.state;
      this.setState({ keySearch });
    } catch {}
    this.handleGetTraining();
    this.handleGetCategory();
    this.handleGetTotalPage();
  }

  handleGetTotalPage = () => {
    const { keySearch, categoryId } = this.state;
    fetch(
      `https://be-lms.tk/trainings?${
        keySearch !== "" ? `name_contains=${keySearch}&` : ``
      }${categoryId !== "" ? `categorytrainings._id=${categoryId}&` : ""}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
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

  handleGetTraining = () => {
    const { keySearch, startItemPage, itemPerPage, categoryId } = this.state;
    const payload = { keySearch, startItemPage, itemPerPage, categoryId };
    const { getAllTraining } = this.props.action;
    getAllTraining(payload, () => {});
  };

  handleGetCategory = () => {
    const payload = {};
    const { getAllCategory } = this.props.action;
    getAllCategory(payload);
  };

  handleAddToMyTraining = training => {
    if (!AuthStorage.loggedIn) {
      this.props.history.push("/login");
      return;
    }
    if (this.checkTrainingExists(training._id)) {
      this.notifyError(
        "Notification",
        "This training already exists in your list."
      );
    } else {
      const user = AuthStorage.userInfo;
      const { addToMyTraining } = this.props.action;
      const payload = {
        training,
        user
      };
      addToMyTraining(payload, response => {
        if (response._id) {
          let nextActivityStorage = ActivityStorage.value;
          let tempActivity = response;
          tempActivity.training = tempActivity.training._id;
          tempActivity.user = tempActivity.user._id;
          nextActivityStorage.activityusers.push(tempActivity);
          ActivityStorage.value = nextActivityStorage;
          this.notifySuccess(
            "Notification",
            "Add training to store successfully."
          );
        } else {
          this.notifyError(
            "Notification",
            "Something when wrong. Please wait a few minutes and try again. Thanks."
          );
        }
      });
    }
  };

  handleClosePopup = () => {
    this.setState({ addSuccess: false });
  };

  checkTrainingExists = trainingId => {
    const idx = _.findIndex(
      ActivityStorage.activityUsers,
      activity => activity.training === trainingId
    );
    if (idx > -1) {
      return true;
    }
    return false;
  };

  handleInputSearch = e => {
    this.setState({ keySearch: e.target.value });
  };

  beginSearch = e => {
    if (e.keyCode === ENTER_KEY) {
      this.setState({ startItemPage: 0, activePage: 1 }, () => {
        this.handleGetTotalPage();
        this.handleGetTraining();
      });
    }
  };

  handlePageChange(pageNumber) {
    let { startItemPage, itemPerPage } = this.state;
    startItemPage = (pageNumber - 1) * itemPerPage;
    this.setState({ startItemPage, activePage: pageNumber }, () => {
      this.handleGetTraining();
    });
  }

  fitlerCategory = categoryId => {
    this.setState({ categoryId, startItemPage: 0, activePage: 1 }, () => {
      this.handleGetTotalPage();
      this.handleGetTraining();
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
      loadingTrainingAll,
      trainingAll,
      loadingCategoryAll,
      categoryAll
    } = this.props.store;
    const { categoryId } = this.state;

    if (loadingCategoryAll) {
      return (
        <div className="page-header">
          <Header titleHeader="TRAINING LIST" />
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
        <Header titleHeader="TRAINING LIST" />
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
              <div
                className="sidebar"
                style={{ height: "100%", minHeight: "600px" }}
              >
                <div className="cat-links">
                  <h2>Categories</h2>
                  <div className="form-group">
                    <input
                      value={this.state.keySearch}
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
                  {!loadingTrainingAll ? (
                    trainingAll.map((item, index) => {
                      let starOfTraining = [];
                      for (let i = 0; i < parseInt(item.level); i++) {
                        starOfTraining.push(i);
                      }
                      return (
                        <div key={index} className="col-12 col-md-6  ">
                          <div className="course-content">
                            <figure className="course-thumbnail">
                              <Link
                                to={{
                                  pathname: `/view-training/${item._id}`,
                                  state: {
                                    currentTraining: item
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
                                    to={`/view-training/${item._id}`}
                                    target="_blank"
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
                                </div>
                              </header>

                              <footer className="entry-footer flex flex-wrap align-items-center">
                                <h4 className="t-level mb-0">Level: </h4>
                                <div className="level pl-3">
                                  {item.level !== "" &&
                                    starOfTraining.map((item, index) => {
                                      return (
                                        <span
                                          key={index}
                                          className="fa fa-star checked"
                                        ></span>
                                      );
                                    })}
                                </div>
                                {AuthStorage.loggedIn &&
                                AuthStorage.userInfo.role.type === "creator" ? (
                                  <></>
                                ) : (
                                  <div className="col-xl-12 pr-0 pt-3 text-right">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        this.handleAddToMyTraining(item);
                                      }}
                                      className="btn bg-root"
                                    >
                                      Add to my training
                                    </button>
                                  </div>
                                )}
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
                </div>
                <div className="row">
                  <div className="col-xl-12">
                    <Pagination
                      activePage={this.state.activePage}
                      itemsCountPerPage={this.state.itemPerPage}
                      totalItemsCount={this.state.totalPage}
                      pageRangeDisplayed={5}
                      onChange={this.handlePageChange.bind(this)}
                    />
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ListTraining));
