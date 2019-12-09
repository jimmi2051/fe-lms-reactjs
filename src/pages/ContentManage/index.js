import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Header from "components/Layout/Header";
import { getListModule } from "redux/action/module";
import {
  getListContent,
  deleteContent,
  updateContentVer2,
  createContent,
  getContent
} from "redux/action/content";
import AuthStorage from "utils/AuthStorage";
import { Link } from "react-router-dom";
import Pagination from "react-js-pagination";
import Loading from "components/Loading";
import { ToastContainer } from "react-toastr";
import PopupRemove from "pages/ContentManage/PopupRemove";
import PopupNewContent from "pages/NewTraining/PopupNewContent";
import PopupDetailContent from "pages/NewTraining/PopupDetailContent";
import PopupUpdateContent from "pages/ContentManage/PopupUpdate";

let toastr;

const ENTER_KEY = 13;
function mapStateToProps(state) {
  return {
    store: {
      listModulePaging: state.listModulePaging.listModulePaging.data,
      loadingModule: state.listModulePaging.listModulePaging.loading,
      listContentPaging: state.listContentPaging.listContentPaging.data,
      loading: state.listContentPaging.listContentPaging.loading,
      listContent: state.listContent.listContent.data,
      loadingListContent: state.listContent.listContent.loading
    }
  };
}

const mapDispatchToProps = dispatch => {
  return {
    action: bindActionCreators(
      {
        getListModule,
        getListContent,
        deleteContent,
        updateContentVer2,
        createContent,
        getContent
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
    itemPerPage: 10,
    isOpen: false,
    moduleId: "",
    isUpdate: false,
    nameChange: "",
    contentId: "",
    contentIdDelete: "",
    currentContent: {},
    isShowDetailContent: false,
    isUpdateContent: false
  };
  componentDidMount() {
    this.handleGetContent(AuthStorage.userInfo._id);
    this.handleGetModule(AuthStorage.userInfo._id);
  }

  //#region Handle Action Redux
  handleDeleteContent = id => {
    const payload = { id };
    const { deleteContent } = this.props.action;
    deleteContent(payload, response => {
      // console.log("response>>>", response);
      if (response._id) {
        this.handleGetContent(AuthStorage.userInfo._id);
        // this.handleGetTotalPage(AuthStorage.userInfo._id);
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

  handleUpdateContent = () => {
    const { contentId, nameChange } = this.state;
    const payload = {
      id: contentId,
      name: nameChange
    };
    const { updateContentVer2 } = this.props.action;
    updateContentVer2(payload, response => {
      if (response._id) {
        // Refresh page
        this.handleGetContent(AuthStorage.userInfo._id);
        // this.handleGetTotalPage(AuthStorage.userInfo._id);
        // Notify
        this.notifySuccess(
          "Notification",
          `Update ${response.name} successfully.`
        );
        // Reset state
        this.setState({
          contentId: "",
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

  handleGetContent = userId => {
    this.handleGetTotalPage(userId);
    const { keySearch, startItemPage, itemPerPage, moduleId } = this.state;
    const payload = {
      id: userId,
      keySearch,
      startItemPage,
      itemPerPage,
      moduleId
    };
    const { getListContent } = this.props.action;
    getListContent(payload);
  };

  handleGetModule = userId => {
    const payload = {
      id: userId,
      keySearch: "",
      startItemPage: 0,
      itemPerPage: 999,
      courseId: ""
    };
    const { getListModule } = this.props.action;
    getListModule(payload);
  };

  handleGetTotalPage = userId => {
    const { keySearch, moduleId } = this.state;
    fetch(
      `https://be-lms.tk/contents?${
        moduleId !== "" ? `modules._id=${moduleId}&` : ``
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
        this.handleGetContent(AuthStorage.userInfo._id);
        // this.handleGetTotalPage(AuthStorage.userInfo._id);
      });
    }
  };

  handlePageChange(pageNumber) {
    let { startItemPage, itemPerPage } = this.state;
    startItemPage = (pageNumber - 1) * itemPerPage;
    this.setState({ activePage: pageNumber, startItemPage }, () => {
      this.handleGetContent(AuthStorage.userInfo._id);
    });
  }

  handleOpenPopup = () => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  };

  handleSetContentId = (id, name) => {
    this.setState({ contentId: id, nameChange: name });
  };

  handleSubmitRemove = () => {
    const { contentIdDelete } = this.state;
    this.handleDeleteContent(contentIdDelete);
    this.setState({ contentIdDelete: "" });
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

  filterByModule = moduleId => {
    this.setState({ moduleId, startItemPage: 0, activePage: 1 }, () => {
      this.handleGetContent(AuthStorage.userInfo._id);
      // this.handleGetTotalPage(AuthStorage.userInfo._id);
    });
  };

  handleSetContentIdDelete = id => {
    this.setState({ contentIdDelete: id });
  };

  handleViewDetailContent = content => {
    if (!content.relationData) {
      this.notifyWarining(
        "Notification",
        "Warning! This content is updating. Please try another content."
      );
    }
    this.setState({ currentContent: content, isShowDetailContent: true });
  };

  handleCloseDetailContent = () => {
    this.setState({ isShowDetailContent: false });
  };

  handleShowPopupUpdate = () => {
    const { isUpdateContent } = this.state;
    this.setState({ isUpdateContent: !isUpdateContent });
  };

  handleSetCurrentContent = content => {
    this.setState({ currentContent: content });
  };

  //#endregion

  notifySuccess = (title, content) => {
    toastr.success(content, title, {
      closeButton: true
    });
  };

  notifyWarining = (title, content) => {
    toastr.warning(content, title, {
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
      nameChange,
      moduleId,
      isShow,
      contentId,
      currentContent,
      isShowDetailContent,
      isUpdateContent
    } = this.state;
    const {
      loading,
      listContentPaging,
      loadingModule,
      listModulePaging
    } = this.props.store;
    return (
      <div className="page-header">
        {isUpdateContent && (
          <PopupUpdateContent
            isShow={isUpdateContent}
            notifySuccess={this.notifySuccess}
            notifyError={this.notifyError}
            content={currentContent}
            handleCloseNewContent={this.handleShowPopupUpdate}
            handleGetContentByUserId={this.handleGetContent}
          />
        )}
        {!loading && (
          <PopupNewContent
            isShow={isShow}
            handleCloseNewContent={this.handleShowPopup}
            handleGetContentByUserId={this.handleGetContent}
            notifySuccess={this.notifySuccess}
            notifyError={this.notifyError}
          />
        )}
        {isOpen && (
          <PopupRemove
            isShow={isOpen}
            handleClosePopup={this.handleOpenPopup}
            handleSubmitRemove={this.handleSubmitRemove}
          />
        )}
        <PopupDetailContent
          isShow={isShowDetailContent}
          currentContent={currentContent}
          handleCloseDetailContent={this.handleCloseDetailContent}
        />
        <ToastContainer
          ref={ref => (toastr = ref)}
          className="toast-top-right"
        />
        <Header titleHeader="MANAGE CONTENT" />
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
                  <li>Manage Content</li>
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
                  <h2>Filter by module</h2>
                  <div className="form-group">
                    <input
                      value={this.state.keySearch}
                      onKeyDown={this.beginSearch}
                      className="form-control"
                      onChange={this.handleInputSearch}
                      placeholder="Search by content name."
                    />
                  </div>
                  <ul className="p-0 m-0">
                    {!loadingModule &&
                      listModulePaging.map((item, index) => {
                        return (
                          <li key={index}>
                            <Link
                              className={`${
                                moduleId === item._id ? "font-weight-bold" : ""
                              }`}
                              to="#"
                              onClick={e => {
                                e.preventDefault();
                                this.filterByModule(item._id);
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
                          moduleId === "" ? "font-weight-bold" : ""
                        }`}
                        onClick={e => {
                          e.preventDefault();
                          this.filterByModule("");
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
                      NEW CONTENT
                    </button>
                  </div>
                </div>
                <div className="row  ">
                  <div className="col-xl-12">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Name Content</th>
                          <th>Type</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {!loading ? (
                          listContentPaging.map((item, index) => {
                            return (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>
                                  {contentId !== "" &&
                                  contentId === item._id ? (
                                    <div className="table-group-management-td">
                                      <input
                                        style={{
                                          width: "100%",
                                          display: "inline-block"
                                        }}
                                        value={nameChange}
                                        onChange={this.handleChangeName}
                                        className="form-control"
                                        type="text"
                                      />
                                      <i
                                        className="fa fa-check pl-2"
                                        onClick={this.handleUpdateContent}
                                      />
                                      <i
                                        className="fa fa-times pl-2"
                                        onClick={() => {
                                          this.handleSetContentId("", "");
                                        }}
                                      />
                                    </div>
                                  ) : (
                                    <>
                                      {item.name}
                                      <i
                                        className="fa fa-pencil pl-2"
                                        onClick={() => {
                                          this.handleSetContentId(
                                            item._id,
                                            item.name
                                          );
                                        }}
                                      />
                                    </>
                                  )}
                                </td>
                                <td>{item.type}</td>
                                <td>
                                  {item.relationData ? (
                                    <button
                                      className="btn bg-root"
                                      type="button"
                                      onClick={() => {
                                        this.handleViewDetailContent(item);
                                      }}
                                    >
                                      Detail
                                    </button>
                                  ) : (
                                    <button
                                      className="btn bg-root"
                                      type="button"
                                      onClick={() => {
                                        this.handleSetCurrentContent(item);
                                        this.handleShowPopupUpdate();
                                      }}
                                    >
                                      Update
                                    </button>
                                  )}

                                  <button
                                    className="btn btn-danger ml-2"
                                    type="button"
                                    onClick={() => {
                                      // this.handleDeleteContent(item._id);
                                      this.handleOpenPopup();
                                      this.handleSetContentIdDelete(item._id);
                                    }}
                                  >
                                    Delete
                                  </button>
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan="4">
                              <div className="col-xl-12 mt-3">
                                <Loading classOption="align-center-spinner" />
                              </div>
                            </td>
                          </tr>
                        )}
                        {!loading && listContentPaging.length === 0 && (
                          <tr>
                            <td colSpan="4">You don't have any content yet.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
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
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ModuleManage);
