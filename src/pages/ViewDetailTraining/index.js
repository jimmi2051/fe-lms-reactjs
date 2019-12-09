/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Header from "components/Layout/Header";
import {
  getTrainingById,
  updateActivity,
  addToMyTraining
} from "redux/action/training";
import AuthStorage from "utils/AuthStorage";
import ActivityStorage from "utils/ActivityStorage";
import _ from "lodash";
import { withRouter } from "react-router";
import TreeMenu from "react-simple-tree-menu";
import Loading from "components/Loading";
import moment from "moment";
import { ToastContainer } from "react-toastr";
import { Link } from "react-router-dom";
const REACT_APP_URL_API = process.env.REACT_APP_URL_API;

function mapStateToProps(state) {
  return {
    store: {
      training: state.training.training.data,
      loadingTraining: state.training.training.loading,
      isUpdateActivity: state.isUpdateActivity.isUpdateActivity.data
    }
  };
}

const mapDispatchToProps = dispatch => {
  return {
    action: bindActionCreators(
      {
        getTrainingById,
        updateActivity,
        addToMyTraining
      },
      dispatch
    )
  };
};
let toastr;
class TrainingDetail extends Component {
  state = {
    currentContent: {},
    currentCourse: {},
    currentModule: {},
    initiallyOpenProperties: [],
    currentActivity: {},
    isLastContent: -1,
    keyCourse: "",
    keyModule: "",
    addTraining: {},
    training: {},
    currentTraining: {},
    trainingExists: {}
  };
  componentDidMount() {
    try {
      const { currentTraining } = this.props.location.state;
      this.setState({ currentTraining });
    } catch {
      this.props.history.push("/trainings");
    }
    const { id } = this.props.match.params;
    this.handleGetTrainingById(id);
  }

  componentWillReceiveProps(nextProps) {
    const { training, loadingTraining } = nextProps.store;
    if (
      !loadingTraining &&
      (_.isEmpty(training.data.training) || _.isEmpty(training))
    ) {
      this.props.history.push("/trainings");
    }
  }

  handleGetTrainingById = id => {
    const payload = { id };
    const { getTrainingById } = this.props.action;
    getTrainingById(payload, () => {});
  };

  handleChangeContent = currentContentChoosen => {
    let { currentContent } = this.state;
    if (_.isEqual(currentContent, currentContentChoosen)) {
      this.setState({ currentContent: {} });
    } else {
      this.setState({ currentContent: currentContentChoosen });
    }
  };

  handleChangeCourse = currentCourseChoosen => {
    let { currentCourse } = this.state;
    if (_.isEqual(currentCourse, currentCourseChoosen)) {
      this.setState({ currentCourse: {} });
    } else {
      this.setState({ currentCourse: currentCourseChoosen });
    }
  };

  handleChangeModule = currentModuleChoosen => {
    let { currentModule } = this.state;
    if (_.isEqual(currentModule, currentModuleChoosen)) {
      this.setState({ currentModule: {} });
    } else {
      this.setState({ currentModule: currentModuleChoosen });
    }
  };

  processDataToListMenu = training => {
    let listMenu = [];
    training.learningpaths.map((path, index) => {
      let menuLv1 = {};
      menuLv1.key = `first-level-node-${index + 1}`;
      menuLv1.label = `${path.course.name} | Total Modules: ${path.course.relationcoursemodules.length}`;
      let tempCourse = path.course;
      tempCourse.totalMark = path.markForCourse;
      menuLv1.value = tempCourse;
      menuLv1.nodes = [];
      path.course.relationcoursemodules.map((itemCourse, indexCourse) => {
        let menuLv2 = {};
        menuLv2.key = `second-level-node-${indexCourse + 1}`;
        menuLv2.label = itemCourse.module
          ? `${itemCourse.module.name} | Total Contents: ${itemCourse.module.contents.length}`
          : "";
        menuLv2.value = itemCourse.module;
        menuLv2.nodes = [];
        itemCourse.module &&
          itemCourse.module.contents.map((itemContent, indexContent) => {
            let menuLv3 = {};
            menuLv3.key = `third-level-node-${indexContent + 1}`;
            menuLv3.label = itemContent.name;
            menuLv3.value = itemContent;
            menuLv3.nodes = [];
            menuLv2.nodes.push(menuLv3);
          });
        menuLv1.nodes.push(menuLv2);
      });
      listMenu.push(menuLv1);
    });
    return listMenu;
  };

  handeSelectMenu = item => {
    if (item.level === 0) {
      this.setState({
        currentCourse: item.value,
        currentModule: {},
        currentContent: {}
      });
    }
    if (item.level === 1) {
      this.setState({
        currentCourse: {},
        currentModule: item.value,
        currentContent: {}
      });
    }
    if (item.level === 2) {
      this.setState({
        currentCourse: {},
        currentModule: {},
        currentContent: item.value
      });
    }
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
        training: training._id,
        user: user._id
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
    const { training, loadingTraining } = this.props.store;

    if (loadingTraining) {
      return (
        <div className="page-header">
          <Header titleHeader="Training Detail Page" />
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
              <div className="col-12">
                <Loading classOption="align-center-spinner" />
              </div>
            </div>
          </div>
        </div>
      );
    }
    const detailTraining = training.data.training;

    if (_.isEmpty(detailTraining) || detailTraining.length === 0) {
      return <></>;
    }

    const listMenu = this.processDataToListMenu(detailTraining);
    let starOfTraining = [];
    for (let i = 0; i < parseInt(detailTraining.level); i++) {
      starOfTraining.push(i);
    }
    return (
      <div className="page-header">
        <ToastContainer
          ref={ref => (toastr = ref)}
          className="toast-top-right"
        />
        <Header titleHeader={`Training "${detailTraining.name}" Detail `} />
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
                  <li>
                    <a
                      href=""
                      onClick={e => {
                        e.preventDefault();
                        this.resetTraining();
                      }}
                    >{`Training "${detailTraining.name}"`}</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-12 offset-lg-1 col-lg-1">
              <div className="post-share">
                <h3>share</h3>

                <ul className="flex flex-wrap align-items-center p-0 m-0">
                  <li>
                    <a href="#">
                      <i className="fa fa-facebook"></i>
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <i className="fa fa-twitter"></i>
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <i className="fa fa-google-plus"></i>
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <i className="fa fa-instagram"></i>
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="col-12 col-lg-10">
              <div className="single-course-wrap">
                <div className="course-info flex flex-wrap align-items-center">
                  <div className="course-author flex flex-wrap align-items-center mt-3">
                    <img
                      src="https://be-lms.tk/uploads/6a8cd6609b024ee5b3a7239eae0d3111.png"
                      alt=""
                    />

                    <div className="author-wrap">
                      <label className="m-0">Teacher</label>
                      <div className="author-name">
                        <a href="#">
                          {detailTraining.users &&
                          detailTraining.users.length > 0
                            ? `${detailTraining.users[0].firstName} ${detailTraining.users[0].lastName}`
                            : "Unknown author"}
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="course-cats mt-3">
                    <label className="m-0">Categories</label>
                    <div className="author-name">
                      <a href="#">
                        {detailTraining.categorytrainings &&
                          detailTraining.categorytrainings.length > 0 &&
                          detailTraining.categorytrainings[0].name}
                      </a>
                    </div>
                  </div>

                  <div className="course-students mt-3">
                    <label className="m-0">Student</label>
                    <div className="author-name">
                      <a href="#">
                        {detailTraining.activityusers.length} (REGISTERED)
                      </a>
                    </div>
                  </div>
                  {AuthStorage.loggedIn &&
                  AuthStorage.userInfo.role.type === "creator" ? (
                    <></>
                  ) : (
                    <div className="buy-course mt-3">
                      <a
                        className="btn"
                        href="#"
                        onClick={e => {
                          e.preventDefault();
                          this.handleAddToMyTraining(
                            this.state.currentTraining
                          );
                        }}
                      >
                        ADD to cart
                      </a>
                    </div>
                  )}
                </div>
              </div>
              <div className="single-course-cont-section">
                <h2>Descrption: </h2>
                <div
                  className="description"
                  dangerouslySetInnerHTML={{
                    __html: detailTraining.description
                  }}
                />
                <img
                  src={`${REACT_APP_URL_API}${detailTraining.thumbnail.url}`}
                  alt="#"
                />
                <h4 className="t-level">Level: </h4>
                <div className="level">
                  {detailTraining.level !== "" &&
                    starOfTraining.map((item, index) => {
                      return (
                        <span key={index} className="fa fa-star checked"></span>
                      );
                    })}
                  <h4 className="t-created-date">Created At: </h4>
                  <div className="created-date">
                    {moment(detailTraining.createdAt).format("MMM. D, YYYY")}
                  </div>
                </div>
              </div>
              <div className="single-course-accordion-cont mt-1">
                <header className="entry-header flex flex-wrap justify-content-between align-items-center">
                  <h2>Curriculum For This Course</h2>

                  <div className="number-of-lectures">
                    {detailTraining.learningpaths.length} Lectures
                  </div>

                  <div className="total-lectures-time">###</div>
                </header>
                <div className="entry-contents">
                  {listMenu.length > 0 && (
                    <TreeMenu
                      data={listMenu}
                      // initialOpenNodes={this.state.initiallyOpenProperties}
                      hasSearch={false}
                      onClickItem={this.handeSelectMenu}
                      ref="treeMenu"
                    />
                  )}
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
)(withRouter(TrainingDetail));
