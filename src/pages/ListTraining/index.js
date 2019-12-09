import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Header from "components/Layout/Header";
import {
  getTrainingByUser,
  getAllCategory,
  deleteTraining,
  updateTraining
} from "redux/action/training";
import AuthStorage from "utils/AuthStorage";
import moment from "moment";
import { Link } from "react-router-dom";
import Pagination from "react-js-pagination";
import Loading from "components/Loading";
import { ToastContainer } from "react-toastr";
import PopupRemove from "pages/ListTraining/PopupRemove";
let toastr;

const REACT_APP_URL_API = process.env.REACT_APP_URL_API;
const ENTER_KEY = 13;
function mapStateToProps(state) {
  return {
    store: {
      listTraining: state.listTraining.listTraining.data,
      loadingListTraining: state.listTraining.listTraining.loading,
      categoryAll: state.trainingAll.categoryAll.data,
      loadingCategoryAll: state.trainingAll.categoryAll.loading
    }
  };
}

const mapDispatchToProps = dispatch => {
  return {
    action: bindActionCreators(
      {
        getTrainingByUser,
        getAllCategory,
        deleteTraining,
        updateTraining
      },
      dispatch
    )
  };
};
const maxLevel = [1, 2, 3, 4, 5];
class ListTraining extends Component {
  state = {
    totalPage: -1,
    keySearch: "",
    categoryId: "",
    activePage: 1,
    startItemPage: 0,
    itemPerPage: 4,
    isOpen: false,
    trainingId: "",
    isUpdate: false,
    nameChange: "",
    levelChange: ""
  };
  componentDidMount() {
    this.handleGetTraining(AuthStorage.userInfo._id);
    this.handleGetCategory();
    this.handleGetTotalPage(AuthStorage.userInfo._id);
  }

  handleDeleteTraining = id => {
    const payload = { id };
    const { deleteTraining } = this.props.action;
    deleteTraining(payload, response => {
      // console.log("response>>>", response);
      if (response._id) {
        this.handleGetTraining(AuthStorage.userInfo._id);
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

  handleUpdateTraining = () => {
    const { trainingId, nameChange, levelChange } = this.state;
    const payload = {
      id: trainingId,
      name: nameChange,
      level: levelChange
    };
    const { updateTraining } = this.props.action;
    updateTraining(payload, response => {
      if (response._id) {
        // Refresh page
        this.handleGetTraining(AuthStorage.userInfo._id);
        this.handleGetTotalPage(AuthStorage.userInfo._id);
        // Notify
        this.notifySuccess(
          "Notification",
          `Update ${response.name} successfully.`
        );
        // Reset state
        this.setState({
          isUpdate: false,
          trainingId: "",
          nameChange: "",
          levelChange: ""
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
    const { keySearch, categoryId } = this.state;
    fetch(
      `https://be-lms.tk/trainings?${
        keySearch !== "" ? `name_contains=${keySearch}&` : ``
      }${
        categoryId !== "" ? `categorytrainings._id=${categoryId}&` : ""
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

  handleGetCategory = () => {
    const payload = {};
    const { getAllCategory } = this.props.action;
    getAllCategory(payload);
  };

  handleGetTraining = userId => {
    const { keySearch, startItemPage, itemPerPage, categoryId } = this.state;
    const payload = {
      id: userId,
      keySearch,
      startItemPage,
      itemPerPage,
      categoryId
    };
    const { getTrainingByUser } = this.props.action;
    getTrainingByUser(payload);
  };

  handleInputSearch = e => {
    this.setState({ keySearch: e.target.value });
  };

  beginSearch = e => {
    if (e.keyCode === ENTER_KEY) {
      this.setState({ startItemPage: 0, activePage: 1 }, () => {
        this.handleGetTotalPage(AuthStorage.userInfo._id);
        this.handleGetTraining(AuthStorage.userInfo._id);
      });
    }
  };

  handlePageChange(pageNumber) {
    let { startItemPage, itemPerPage } = this.state;
    startItemPage = (pageNumber - 1) * itemPerPage;
    this.setState({ activePage: pageNumber, startItemPage }, () => {
      this.handleGetTraining(AuthStorage.userInfo._id);
    });
  }

  fitlerCategory = categoryId => {
    this.setState({ categoryId, startItemPage: 0, activePage: 1 }, () => {
      this.handleGetTotalPage(AuthStorage.userInfo._id);
      this.handleGetTraining(AuthStorage.userInfo._id);
    });
  };

  handleOpenPopup = () => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  };

  handleSetTrainingId = id => {
    this.setState({ trainingId: id });
  };

  handleSubmitRemove = () => {
    const { trainingId } = this.state;
    this.handleDeleteTraining(trainingId);
    this.setState({ trainingId: "" });
    this.setState({ isOpen: false });
  };

  handleEnableUpdate = (name, level) => {
    this.setState({ isUpdate: true, nameChange: name, levelChange: level });
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
      categoryId,
      isOpen,
      isUpdate,
      nameChange,
      levelChange,
      trainingId
    } = this.state;
    const {
      loadingListTraining,
      listTraining,
      loadingCategoryAll,
      categoryAll
    } = this.props.store;
    return (
      <div className="page-header">
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
                  <li>Manage Training</li>
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
                <div className="row no-gutters mb-3">
                  <div className="col-xl-12">
                    <Link
                      to={`/admin/new-training`}
                      className="btn btn-success text-white"
                    >
                      CREATE NEW TRAINING
                    </Link>
                  </div>
                </div>
                <div className="row  ">
                  {!loadingListTraining ? (
                    listTraining.map((item, index) => {
                      let starOfTraining = [];
                      for (let i = 0; i < parseInt(item.level); i++) {
                        starOfTraining.push(i);
                      }
                      return (
                        <div key={index} className="col-12 col-md-6  ">
                          <div className="course-content">
                            <figure className="course-thumbnail">
                              {isUpdate && trainingId === item._id ? (
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
                                      this.handleUpdateTraining();
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
                                      this.handleSetTrainingId(item._id);
                                    }}
                                  >
                                    <i className="fa fa-remove"></i>
                                  </button>
                                  <button
                                    type="button"
                                    className="btn btn-update alert-info"
                                    onClick={() => {
                                      // this.handleRemoveCourseToPath_ver2(index);
                                      this.handleSetTrainingId(item._id);
                                      this.handleEnableUpdate(
                                        item.name,
                                        item.level
                                      );
                                    }}
                                  >
                                    <i className="fa fa-pencil"></i>
                                  </button>
                                </>
                              )}

                              <Link to={`/admin/training/${item._id}`}>
                                <img
                                  src={`${
                                    item.thumbnail
                                      ? `${REACT_APP_URL_API}${item.thumbnail.url}`
                                      : `https://be-lms.tk/uploads/9ee513ab17ae4d2ca9a7fa3feb3b2d67.png`
                                  }`}
                                  alt=""
                                />
                              </Link>
                            </figure>

                            <div className="course-content-wrap">
                              <header className="entry-header">
                                <h2 className="entry-title">
                                  {isUpdate && trainingId === item._id ? (
                                    <textarea
                                      value={nameChange}
                                      onChange={this.handleChangeName}
                                      className="form-control"
                                      rows="2"
                                    />
                                  ) : (
                                    <Link to={`/admin/training/${item._id}`}>
                                      {item.name}
                                    </Link>
                                  )}
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

                              <footer className="entry-footer flex flex-wrap align-items-center">
                                <h4 className="t-level mb-0">Level: </h4>
                                {isUpdate && trainingId === item._id ? (
                                  <div
                                    className="level pl-3"
                                    style={{ width: "70%" }}
                                  >
                                    <select
                                      className="form-control"
                                      value={levelChange}
                                      onChange={this.handleChangeLevel}
                                    >
                                      {maxLevel.map((item, index) => {
                                        return (
                                          <option value={item}>{item}</option>
                                        );
                                      })}
                                    </select>
                                  </div>
                                ) : (
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
                                )}
                              </footer>
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
                  {!loadingListTraining && listTraining.length === 0 && (
                    <div
                      className="col-xl-12 mt-3"
                      style={{ paddingLeft: "25px" }}
                    >
                      <p>You don't have any training yet. </p>
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
