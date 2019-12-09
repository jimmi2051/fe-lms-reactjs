import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Header from "components/Layout/Header";
import {
  getListModule,
  deleteModule,
  updateModule,
  createModule
} from "redux/action/module";
import { getListCourse } from "redux/action/course";
import _ from "lodash";
import AuthStorage from "utils/AuthStorage";
import moment from "moment";
import { Link } from "react-router-dom";
import Pagination from "react-js-pagination";
import Loading from "components/Loading";
import { ToastContainer } from "react-toastr";
import PopupRemove from "pages/ModuleManage/PopupRemove";
import { UploadFile } from "utils/UploadImage.js";
import PopupNewModule from "pages/NewTraining/PopupNewModule";
let toastr;

const REACT_APP_URL_API = process.env.REACT_APP_URL_API;
const ENTER_KEY = 13;
function mapStateToProps(state) {
  return {
    store: {
      listCoursePaging: state.listCoursePaging.listCoursePaging.data,
      loadingCourse: state.listCoursePaging.listCoursePaging.loading,
      listModulePaging: state.listModulePaging.listModulePaging.data,
      loading: state.listModulePaging.listModulePaging.loading
    }
  };
}

const mapDispatchToProps = dispatch => {
  return {
    action: bindActionCreators(
      {
        getListModule,
        deleteModule,
        updateModule,
        createModule,
        getListCourse
      },
      dispatch
    )
  };
};
class ModuleManage extends Component {
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
    trainingId: "",
    moduleId: ""
  };
  componentDidMount() {
    this.handleGetModule(AuthStorage.userInfo._id);
    this.handleGetTotalPage(AuthStorage.userInfo._id);
    this.handleGetCourse(AuthStorage.userInfo._id);
  }

  //#region Handle Action Redux

  handleCreateModule = (name, description, thumbnail, users) => {
    const payload = { name, description, thumbnail, users };
    const { createModule } = this.props.action;
    createModule(
      payload,
      isCreatedModule => {
        if (!_.isUndefined(isCreatedModule.id)) {
          this.handleGetModule(AuthStorage.userInfo._id);
          this.handleGetTotalPage(AuthStorage.userInfo._id);
          this.notifySuccess(
            "Nofitication",
            `Course ${isCreatedModule.name} has been created successfully.`
          );
        } else {
          this.notifyError(
            "Nofitication",
            "Error! Something when wrong. Please wait a few minutes and try again. Thanks"
          );
        }
      },
      err => {
        this.notifyError(
          "Nofitication",
          "Error! Something when wrong. Please wait a few minutes and try again. Thanks"
        );
      }
    );
  };

  handleDeleteModule = id => {
    const payload = { id };
    const { deleteModule } = this.props.action;
    deleteModule(payload, response => {
      if (response._id) {
        this.handleGetModule(AuthStorage.userInfo._id);
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

  handleUpdateModule = () => {
    const { moduleId, nameChange } = this.state;
    const payload = {
      id: moduleId,
      name: nameChange
    };
    const { updateModule } = this.props.action;
    updateModule(payload, response => {
      if (response._id) {
        // Refresh page
        this.handleGetModule(AuthStorage.userInfo._id);
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

  handleGetModule = userId => {
    const { keySearch, startItemPage, itemPerPage, courseId } = this.state;
    const payload = {
      id: userId,
      keySearch,
      startItemPage,
      itemPerPage,
      courseId
    };
    const { getListModule } = this.props.action;
    getListModule(payload);
  };

  handleGetCourse = userId => {
    const payload = {
      id: userId,
      keySearch: "",
      startItemPage: 0,
      itemPerPage: 999,
      trainingId: ""
    };
    const { getListCourse } = this.props.action;
    getListCourse(payload);
  };

  handleGetTotalPage = userId => {
    const { keySearch, courseId } = this.state;
    fetch(
      `https://be-lms.tk/modules?${
        courseId !== "" ? `relationcoursemodules.course=${courseId}&` : ``
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

  //#endregion

  //#region Handle DOM
  handleInputSearch = e => {
    this.setState({ keySearch: e.target.value });
  };

  beginSearch = e => {
    if (e.keyCode === ENTER_KEY) {
      this.setState({ startItemPage: 0, activePage: 1 }, () => {
        this.handleGetModule(AuthStorage.userInfo._id);
        this.handleGetTotalPage(AuthStorage.userInfo._id);
      });
    }
  };

  handleChangeName = e => {
    this.setState({ nameChange: e.target.value });
  };

  handleChangeLevel = e => {
    this.setState({ levelChange: e.target.value });
  };

  handlePageChange(pageNumber) {
    let { startItemPage, itemPerPage } = this.state;
    startItemPage = (pageNumber - 1) * itemPerPage;
    this.setState({ activePage: pageNumber, startItemPage }, () => {
      this.handleGetModule(AuthStorage.userInfo._id);
    });
  }

  handleOpenPopup = () => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  };

  handleSetModuleId = id => {
    this.setState({ moduleId: id });
  };

  handleSubmitRemove = () => {
    const { moduleId } = this.state;
    this.handleDeleteModule(moduleId);
    this.setState({ moduleId: "" });
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

  handleShowPopup = () => {
    const { isShow } = this.state;
    this.setState({ isShow: !isShow });
  };

  filterByCourse = courseId => {
    this.setState({ courseId, startItemPage: 0, activePage: 1 }, () => {
      this.handleGetModule(AuthStorage.userInfo._id);
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
      moduleId
    } = this.state;
    const {
      loading,
      listModulePaging,
      loadingCourse,
      listCoursePaging
    } = this.props.store;
    return (
      <div className="page-header">
        <PopupNewModule
          isShow={isShow}
          UploadFile={UploadFile}
          handleCreateModule={this.handleCreateModule}
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
        <Header titleHeader="MANAGE MODULE" />
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
                  <li>Manage Module</li>
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
                  <h2>Filter by course</h2>
                  <div className="form-group">
                    <input
                      value={this.state.keySearch}
                      onKeyDown={this.beginSearch}
                      className="form-control"
                      onChange={this.handleInputSearch}
                      placeholder="Search by module name."
                    />
                  </div>
                  <ul className="p-0 m-0">
                    {!loadingCourse &&
                      listCoursePaging.map((item, index) => {
                        return (
                          <li key={index}>
                            <Link
                              className={`${
                                courseId === item._id ? "font-weight-bold" : ""
                              }`}
                              to="#"
                              onClick={e => {
                                e.preventDefault();
                                this.filterByCourse(item._id);
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
                          courseId === "" ? "font-weight-bold" : ""
                        }`}
                        onClick={e => {
                          e.preventDefault();
                          this.filterByCourse("");
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
                      NEW MODULE
                    </button>
                  </div>
                </div>
                <div className="row  ">
                  {!loading ? (
                    listModulePaging.map((item, index) => {
                      return (
                        <div key={index} className="col-12 col-md-6  ">
                          <div className="course-content">
                            <figure className="course-thumbnail">
                              {isUpdate && moduleId === item._id ? (
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
                                      this.handleUpdateModule();
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
                                      this.handleSetModuleId(item._id);
                                    }}
                                  >
                                    <i className="fa fa-remove"></i>
                                  </button>
                                  <button
                                    type="button"
                                    className="btn btn-update alert-info"
                                    onClick={() => {
                                      // this.handleRemoveCourseToPath_ver2(index);
                                      this.handleSetModuleId(item._id);
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
                                  {isUpdate && moduleId === item._id ? (
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
                  {!loading && listModulePaging.length === 0 && (
                    <div
                      className="col-xl-12 mt-3"
                      style={{ paddingLeft: "25px" }}
                    >
                      <p>You don't have any module yet. </p>
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

export default connect(mapStateToProps, mapDispatchToProps)(ModuleManage);
