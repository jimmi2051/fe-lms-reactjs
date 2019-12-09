import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Header from "components/Layout/Header";
import {
  getListCourse,
  deleteCourse,
  updateCourse,
  createCourse
} from "redux/action/course";
import { getTrainingByUser } from "redux/action/training";
import _ from "lodash";
import AuthStorage from "utils/AuthStorage";
import moment from "moment";
import { Link } from "react-router-dom";
import Pagination from "react-js-pagination";
import Loading from "components/Loading";
import { ToastContainer } from "react-toastr";
import PopupRemove from "pages/CourseManage/PopupRemove";
import { UploadFile } from "utils/UploadImage.js";
import PopupNewCourse from "pages/NewTraining/PopupNewCourse";
let toastr;

const REACT_APP_URL_API = process.env.REACT_APP_URL_API;
const ENTER_KEY = 13;
function mapStateToProps(state) {
  return {
    store: {
      listCoursePaging: state.listCoursePaging.listCoursePaging.data,
      loading: state.listCoursePaging.listCoursePaging.loading,
      listTraining: state.listTraining.listTraining.data,
      loadingListTraining: state.listTraining.listTraining.loading
    }
  };
}

const mapDispatchToProps = dispatch => {
  return {
    action: bindActionCreators(
      {
        getListCourse,
        deleteCourse,
        updateCourse,
        createCourse,
        getTrainingByUser
      },
      dispatch
    )
  };
};
class ListTraining extends Component {
  state = {
    totalPage: -1,
    keySearch: "",
    categoryId: "",
    activePage: 1,
    startItemPage: 0,
    itemPerPage: 4,
    isOpen: false,
    courseId: "",
    isUpdate: false,
    nameChange: "",
    levelChange: "",
    trainingId: ""
  };
  componentDidMount() {
    this.handleGetCourse(AuthStorage.userInfo._id);
    this.handleGetTotalPage(AuthStorage.userInfo._id);
    this.handleGetTraining(AuthStorage.userInfo._id);
  }

  //#region Handle Action Redux
  handleGetTraining = userId => {
    const payload = {
      id: userId,
      keySearch: "",
      startItemPage: 0,
      itemPerPage: 999,
      categoryId: ""
    };
    const { getTrainingByUser } = this.props.action;
    getTrainingByUser(payload);
  };

  handleCreateCourse = (name, description, thumbnail, user) => {
    const payload = { name, description, thumbnail, user };
    const { createCourse } = this.props.action;
    createCourse(payload, isCreatedCourse => {
      if (!_.isUndefined(isCreatedCourse.id)) {
        this.handleGetCourse(AuthStorage.userInfo._id);
        this.handleGetTotalPage(AuthStorage.userInfo._id);
        this.notifySuccess(
          "Nofitication",
          `Course ${isCreatedCourse.name} has been created successfully.`
        );
      } else {
        this.notifyError(
          "Nofitication",
          "Error! Something when wrong. Please wait a few minutes and try again. Thanks"
        );
      }
    });
  };

  handleDeleteCourse = id => {
    const payload = { id };
    const { deleteCourse } = this.props.action;
    deleteCourse(payload, response => {
      // console.log("response>>>", response);
      if (response._id) {
        this.handleGetCourse(AuthStorage.userInfo._id);
        this.handleGetTotalPage(AuthStorage.userInfo._id);
        this.notifySuccess(
          "Notification",
          `Remove ${response.name} successfully.`
        );
      } else {
        this.notifyError(
          "Notification",
          `Something when wrong. Please wait a few minutes and try again.`
        );
      }
    });
  };

  handleUpdateCourse = () => {
    const { courseId, nameChange } = this.state;
    const payload = {
      id: courseId,
      name: nameChange
    };
    const { updateCourse } = this.props.action;
    updateCourse(payload, response => {
      if (response._id) {
        // Refresh page
        this.handleGetCourse(AuthStorage.userInfo._id);
        this.handleGetTotalPage(AuthStorage.userInfo._id);
        // Notify
        this.notifySuccess(
          "Notification",
          `Update ${response.name} successfully.`
        );
        // Reset state
        this.setState({
          isUpdate: false,
          courseId: "",
          nameChange: ""
        });
      } else {
        this.notifyError(
          "Notification",
          `Something when wrong. Please wait a few minutes and try again.`
        );
      }
    });
  };

  handleGetTotalPage = userId => {
    const { keySearch, trainingId } = this.state;
    fetch(
      `https://be-lms.tk/courses?${
        trainingId !== "" ? `learningpaths.training=${trainingId}&` : ``
      }${
        keySearch !== "" ? `name_contains=${keySearch}&` : ``
      }users._id=${userId}`,
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

  handleGetCourse = userId => {
    const { keySearch, startItemPage, itemPerPage, trainingId } = this.state;
    const payload = {
      id: userId,
      keySearch,
      startItemPage,
      itemPerPage,
      trainingId
    };
    const { getListCourse } = this.props.action;
    getListCourse(payload);
  };
  //#endregion

  //#region Handle DOM
  handleInputSearch = e => {
    this.setState({ keySearch: e.target.value });
  };

  beginSearch = e => {
    if (e.keyCode === ENTER_KEY) {
      this.setState({ startItemPage: 0, activePage: 1 }, () => {
        this.handleGetCourse(AuthStorage.userInfo._id);
        this.handleGetTotalPage(AuthStorage.userInfo._id);
      });
    }
  };

  handlePageChange(pageNumber) {
    let { startItemPage, itemPerPage } = this.state;
    startItemPage = (pageNumber - 1) * itemPerPage;
    this.setState({ activePage: pageNumber, startItemPage }, () => {
      this.handleGetCourse(AuthStorage.userInfo._id);
    });
  }

  fitlerCategory = categoryId => {
    this.setState({ categoryId, startItemPage: 0, activePage: 1 }, () => {
      this.handleGetCourse(AuthStorage.userInfo._id);
      this.handleGetTotalPage(AuthStorage.userInfo._id);
    });
  };

  handleOpenPopup = () => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  };

  handleSetCourseId = id => {
    this.setState({ courseId: id });
  };

  handleSubmitRemove = () => {
    const { courseId } = this.state;
    this.handleDeleteCourse(courseId);
    this.setState({ courseId: "" });
    this.setState({ isOpen: false });
  };

  handleEnableUpdate = name => {
    this.setState({ isUpdate: true, nameChange: name });
  };

  handleSubmitUpdate = () => {
    this.setState({ isUpdate: false });
  };

  handleCancelUpdate = () => {
    this.setState({ isUpdate: false });
  };

  handleChangeName = e => {
    this.setState({ nameChange: e.target.value });
  };

  handleChangeLevel = e => {
    this.setState({ levelChange: e.target.value });
  };
  handleShowPopup = () => {
    const { isShow } = this.state;
    this.setState({ isShow: !isShow });
  };

  fitlerTrainingId = trainingId => {
    this.setState({ trainingId, startItemPage: 0, activePage: 1 }, () => {
      this.handleGetCourse(AuthStorage.userInfo._id);
      this.handleGetTotalPage(AuthStorage.userInfo._id);
    });
  };
  //#endregion

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
      isOpen,
      isUpdate,
      nameChange,
      courseId,
      isShow,
      trainingId
    } = this.state;
    const {
      loading,
      listCoursePaging,
      loadingListTraining,
      listTraining
    } = this.props.store;
    return (
      <div className="page-header">
        <PopupNewCourse
          isShow={isShow}
          UploadFile={UploadFile}
          handleCreateCourse={this.handleCreateCourse}
          handleShowPopup={this.handleShowPopup}
        />
        {isOpen && (
          <PopupRemove
            isShow={isOpen}
            handleClosePopup={this.handleOpenPopup}
            handleSubmitRemove={this.handleSubmitRemove}
          />
        )}
        <ToastContainer
          ref={ref => (toastr = ref)}
          className="toast-top-right"
        />
        <Header titleHeader="MANAGE COURSE" />
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
                  <li>Manage Course</li>
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
                  <h2>Filter by training</h2>
                  <div className="form-group">
                    <input
                      value={this.state.keySearch}
                      onKeyDown={this.beginSearch}
                      className="form-control"
                      onChange={this.handleInputSearch}
                      placeholder="Search by course name."
                    />
                  </div>
                  <ul className="p-0 m-0">
                    {!loadingListTraining &&
                      listTraining.map((item, index) => {
                        return (
                          <li key={index}>
                            <Link
                              className={`${
                                trainingId === item._id
                                  ? "font-weight-bold"
                                  : ""
                              }`}
                              to="#"
                              onClick={e => {
                                e.preventDefault();
                                this.fitlerTrainingId(item._id);
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
                          trainingId === "" ? "font-weight-bold" : ""
                        }`}
                        onClick={e => {
                          e.preventDefault();
                          this.fitlerTrainingId("");
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
                <div className="row no-gutters mb-3">
                  <div className="col-xl-12">
                    <button
                      className="btn btn-success text-white new-item"
                      onClick={this.handleShowPopup}
                      type="button"
                    >
                      NEW COURSE
                    </button>
                  </div>
                </div>
                <div className="row  ">
                  {!loading ? (
                    listCoursePaging.map((item, index) => {
                      return (
                        <div key={index} className="col-12 col-md-6  ">
                          <div className="course-content">
                            <figure className="course-thumbnail">
                              {isUpdate && courseId === item._id ? (
                                <>
                                  <button
                                    type="button"
                                    className="btn btn-remove alert-danger"
                                    onClick={() => {
                                      this.handleCancelUpdate();
                                    }}
                                  >
                                    <i className="fa fa-remove"></i>
                                  </button>
                                  <button
                                    type="button"
                                    className="btn btn-update alert-info"
                                    onClick={() => {
                                      this.handleUpdateCourse();
                                    }}
                                  >
                                    <i className="fa fa-save"></i>
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    type="button"
                                    className="btn btn-remove alert-danger"
                                    onClick={() => {
                                      this.handleOpenPopup();
                                      this.handleSetCourseId(item._id);
                                    }}
                                  >
                                    <i className="fa fa-remove"></i>
                                  </button>
                                  <button
                                    type="button"
                                    className="btn btn-update alert-info"
                                    onClick={() => {
                                      // this.handleRemoveCourseToPath_ver2(index);
                                      this.handleSetCourseId(item._id);
                                      this.handleEnableUpdate(item.name);
                                    }}
                                  >
                                    <i className="fa fa-pencil"></i>
                                  </button>
                                </>
                              )}

                              <img
                                src={`${
                                  item.thumbnail
                                    ? `${REACT_APP_URL_API}${item.thumbnail.url}`
                                    : `https://be-lms.tk/uploads/9ee513ab17ae4d2ca9a7fa3feb3b2d67.png`
                                }`}
                                alt=""
                              />
                            </figure>

                            <div className="course-content-wrap">
                              <header className="entry-header">
                                <h2 className="entry-title">
                                  {isUpdate && courseId === item._id ? (
                                    <textarea
                                      value={nameChange}
                                      onChange={this.handleChangeName}
                                      className="form-control"
                                      rows="2"
                                    />
                                  ) : (
                                    <label>{item.name}</label>
                                  )}
                                </h2>

                                <div className="entry-meta flex flex-wrap align-items-center">
                                  <div className="course-author">
                                    <a
                                      href="#"
                                      onClick={e => e.preventDefault()}
                                    >
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
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="col-xl-12 mt-3">
                      <Loading classOption="align-center-spinner" />
                    </div>
                  )}
                  {!loading && listCoursePaging.length === 0 && (
                    <div
                      className="col-xl-12 mt-3"
                      style={{ paddingLeft: "25px" }}
                    >
                      <p>You don't have any course yet. </p>
                    </div>
                  )}
                </div>
              </div>
              {this.state.totalPage > 0 && (
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
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ListTraining);
