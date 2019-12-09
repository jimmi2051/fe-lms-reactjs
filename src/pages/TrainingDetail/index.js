/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Header from "components/Layout/Header";
import { getTrainingById, updateActivity } from "redux/action/training";
import VideoNormal from "h5p/VideoNormal";
import TextNormal from "h5p/TextNormal";
import TextToTest from "h5p/TextToTest";
import Question from "h5p/Question";
import Slide from "h5p/Slide";
import _ from "lodash";
import { withRouter } from "react-router";
import TreeMenu from "react-simple-tree-menu";
import Loading from "components/Loading";
import moment from "moment";
import { Link } from "react-router-dom";
import { ToastContainer } from "react-toastr";
const REACT_APP_URL_API = process.env.REACT_APP_URL_API;
let toastr;
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
        updateActivity
      },
      dispatch
    )
  };
};

class TrainingDetail extends Component {
  state = {
    currentContent: {},
    currentCourse: {},
    currentModule: {},
    initiallyOpenProperties: [],
    currentActivity: {},
    isLastContent: -1,
    keyCourse: "",
    keyModule: ""
  };
  componentDidMount() {
    try {
      const { currentActivity } = this.props.location.state;
      this.setState({ currentActivity });
    } catch {
      this.props.history.push("/my-training");
    }
    const { id } = this.props.match.params;
    this.handleGetTrainingById(id);
  }

  componentWillReceiveProps(nextProps) {
    const { training, loadingTraining } = nextProps.store;
    if (!loadingTraining && training && training.status === false) {
      this.props.history.push("/my-training");
    }
  }

  handleGetTrainingById = id => {
    const payload = { id };
    const { getTrainingById } = this.props.action;
    getTrainingById(
      payload,
      () => {},
      errors => {}
    );
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
      menuLv1.label = `${path.course.name}`;
      let tempCourse = path.course;
      tempCourse.totalMark = path.markForCourse;
      menuLv1.value = tempCourse;
      menuLv1.nodes = [];
      path.course.relationcoursemodules.map((itemCourse, indexCourse) => {
        let menuLv2 = {};
        menuLv2.key = `second-level-node-${indexCourse + 1}`;
        menuLv2.label = itemCourse.module ? itemCourse.module.name : "";
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
        currentContent: {},
        isLastContent: -1
      });
    }
    if (item.level === 1) {
      this.setState({
        currentCourse: {},
        currentModule: item.value,
        currentContent: {},
        isLastContent: -1
      });
    }
    if (item.level === 2) {
      const listKey = item.parent.split("/");
      const keyCourse = listKey[0];
      const keyModule = listKey[1];

      const { data } = this.refs.treeMenu.props;
      const currentCourse = _.find(data, course => course.key === keyCourse);
      const currentModule = _.find(
        currentCourse.nodes,
        module => module.key === keyModule
      );
      //Process to save activity
      this.handleProcessActivity(
        currentCourse.value._id,
        currentModule.value._id,
        currentCourse.nodes,
        currentCourse
      );

      this.setState({
        currentCourse: {},
        currentModule: {},
        currentContent: item.value,
        keyCourse,
        keyModule
      });
      if (!item.value.relationData) {
        this.notifyError(
          "Notification",
          "Warning! This content is updating. Please try another content. "
        );
      }
    }
  };

  handleProcessActivity = (courseId, moduleId, listModule, currentCourse) => {
    let { currentActivity } = this.state;
    const idxCourse = _.findIndex(
      currentActivity.courses,
      course => course.id === courseId
    );
    // const totalMark = idxContent === listModule.length - 1 ? currentCourse.value.totalMark : 0;

    if (idxCourse > -1) {
      // console.log("currentActivity.courses[idxCourse].listModule", currentActivity.courses[idxCourse].listModule);
      const idxModule = _.findIndex(
        currentActivity.courses[idxCourse].modules,
        module => module === moduleId
      );
      if (idxModule === -1) {
        currentActivity.courses[idxCourse].modules.push(moduleId);
      }
      const totalMark =
        currentActivity.courses[idxCourse].modules.length === listModule.length
          ? currentCourse.value.totalMark
          : 0;
      currentActivity.totalMark += totalMark;
    } else {
      currentActivity.courses.push({
        id: courseId,
        modules: [moduleId]
      });
    }
    this.setState({ currentActivity });
  };

  resetTraining = () => {
    this.setState({
      currentCourse: {},
      currentModule: {},
      currentContent: {}
    });
  };

  handleUpdateActivity = (id, courses, totalMark) => {
    const { updateActivity } = this.props.action;
    const payload = { id, courses, totalMark };
    updateActivity(payload, () => {});
  };

  handleFinishStudying = () => {
    const { currentActivity } = this.state;
    this.handleUpdateActivity(
      currentActivity._id,
      currentActivity.courses,
      currentActivity.totalMark
    );
  };

  handleNextContent = listMenu => {
    const { currentContent, keyCourse, keyModule } = this.state;
    const idxCourse = _.findIndex(listMenu, course => course.key === keyCourse);
    const currentCourse = listMenu[idxCourse];
    const idxModule = _.findIndex(
      currentCourse.nodes,
      module => module.key === keyModule
    );
    const currentModule = currentCourse.nodes[idxModule];
    const idxContent = _.findIndex(
      currentModule.nodes,
      content => content.value._id === currentContent._id
    );
    if (idxContent === currentModule.nodes.length - 1) {
      if (idxModule === currentCourse.nodes.length - 1) {
        if (idxCourse === listMenu.length - 1) {
          // Case lastest content of course
        } else {
          if (!listMenu[idxCourse + 1].value.relationData) {
            this.notifyError(
              "Notification",
              "Warning! This content is updating. Please try another content. "
            );
          }
          this.setState({
            currentContent: {},
            currentModule: {},
            currentCourse: listMenu[idxCourse + 1].value,
            keyCourse: listMenu[idxCourse + 1].key
          });
        }
        this.handleFinishStudying();
      } else {
        this.setState({
          currentContent: {},
          currentModule: currentCourse.nodes[idxModule + 1].value,
          keyModule: currentCourse.nodes[idxModule + 1].key
        });
      }
    }
    // Case next content
    else {
      this.handleProcessActivity(
        currentCourse.value._id,
        currentModule.value._id,
        currentCourse.nodes,
        currentCourse
      );
      if (!currentModule.nodes[idxContent + 1].value.relationData) {
        this.notifyError(
          "Notification",
          "Warning! This content is updating. Please try another content. "
        );
      }
      this.setState({
        currentContent: currentModule.nodes[idxContent + 1].value
      });
    }
  };

  handleNextModule = listMenu => {
    const { keyCourse, keyModule } = this.state;
    const idxCourse = _.findIndex(listMenu, course => course.key === keyCourse);
    const currentCourse = listMenu[idxCourse];
    const idxModule = _.findIndex(
      currentCourse.nodes,
      module => module.key === keyModule
    );
    const currentModule = currentCourse.nodes[idxModule];
    if (currentModule.nodes.length > 0) {
      this.handleProcessActivity(
        currentCourse.value._id,
        currentModule.value._id,
        currentCourse.nodes,
        currentCourse
      );
      if (!currentModule.nodes[0].value.relationData) {
        this.notifyError(
          "Notification",
          "Warning! This content is updating. Please try another content. "
        );
      }
      this.setState({
        currentContent: currentModule.nodes[0].value,
        currentModule: {}
      });
    } else {
      if (idxModule === currentCourse.nodes.length - 1) {
        if (idxCourse === listMenu.length - 1) {
          this.handleFinishStudying();
        } else {
          this.setState({
            currentCourse: listMenu[idxCourse + 1].value,
            keyCourse: listMenu[idxCourse + 1].key,
            currentModule: {}
          });
        }
      } else {
        this.setState({ currentModule: currentCourse[idxModule + 1].value });
      }
    }
  };

  handleNextCourse = listMenu => {
    const { keyCourse } = this.state;
    const idxCourse = _.findIndex(listMenu, course => course.key === keyCourse);
    const currentCourse = listMenu[idxCourse];
    if (currentCourse.nodes.length > 0) {
      this.setState({
        currentModule: currentCourse.nodes[0].value,
        currentCourse: {}
      });
    } else {
      if (idxCourse === listMenu.length - 1) {
        this.handleFinishStudying();
      }
    }
  };

  notifySuccess = (title, content) => {
    toastr.success(content, title, {
      closeButton: true
    });
  };
  notifyError = (title, content) => {
    toastr.warning(content, title, {
      closeButton: true
    });
  };

  render() {
    const {
      currentContent,
      currentCourse,
      currentModule,
      keyCourse,
      keyModule
    } = this.state;

    const { training, loadingTraining } = this.props.store;

    if (loadingTraining || training.status === false) {
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
            <div className="col-xl-4">
              <div className="card mb-3">
                <div className="card-body">
                  <h5 className="card-title">Learning Path</h5>
                  {listMenu.length > 0 && (
                    <TreeMenu
                      data={listMenu}
                      // initialOpenNodes={this.state.initiallyOpenProperties}
                      hasSearch={true}
                      onClickItem={this.handeSelectMenu}
                      ref="treeMenu"
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="col-xl-8">
              <div className="featured-courses courses-wrap">
                {_.isEmpty(currentContent) &&
                  _.isEmpty(currentCourse) &&
                  _.isEmpty(currentModule) && (
                    <div className="detail-training">
                      <h4 className="t-description">Descrption: </h4>
                      <div
                        className="description pl-2"
                        dangerouslySetInnerHTML={{
                          __html: detailTraining.description
                        }}
                      />
                      <h4 className="t-level">Level: </h4>
                      <div className="level pl-2">
                        {detailTraining.level !== "" &&
                          starOfTraining.map((item, index) => {
                            return (
                              <span
                                key={index}
                                className="fa fa-star checked"
                              ></span>
                            );
                          })}
                      </div>
                      <h4 className="t-total-course">Total courses:</h4>
                      <div className="total-course pl-2">
                        {detailTraining.learningpaths.length}
                      </div>
                      <h4 className="t-created-date">Created At: </h4>
                      <div className="created-date pl-2">
                        {moment(detailTraining.createdAt).format(
                          "MMM. D, YYYY"
                        )}
                      </div>
                      <h4 className="t-author">Author: </h4>
                      <div className="author pl-2">
                        {detailTraining.users && detailTraining.users.length > 0
                          ? `${detailTraining.users[0].firstName} ${detailTraining.users[0].lastName}`
                          : "Unknown author"}
                      </div>
                    </div>
                  )}
                {!_.isEmpty(currentCourse) && (
                  <div className="detail-course">
                    <h4 className="detail-course-name">{currentCourse.name}</h4>
                    <h5>Description: </h5>
                    <div
                      className="detail-course-description"
                      dangerouslySetInnerHTML={{
                        __html: currentCourse.description
                      }}
                    />
                    {!_.isEmpty(currentCourse.thumbnail) && (
                      <img
                        src={`${REACT_APP_URL_API}${currentCourse.thumbnail.url}`}
                        alt="#"
                      />
                    )}
                    <div className="detail-course-footer pt-3 text-right">
                      {keyCourse !== "" && keyModule !== "" && (
                        <button
                          type="button"
                          onClick={() => {
                            this.handleNextCourse(listMenu);
                          }}
                          className="btn bg-root"
                        >
                          Next step <i className="fa fa-arrow-right" />
                        </button>
                      )}
                    </div>
                  </div>
                )}
                {!_.isEmpty(currentModule) && (
                  <div className="detail-module">
                    <h4 className="detail-module-name">{currentModule.name}</h4>
                    <h5>Description: </h5>
                    <div
                      className="detail-module-description"
                      dangerouslySetInnerHTML={{
                        __html: currentModule.description
                      }}
                    />
                    {!_.isEmpty(currentModule.thumbnail) && (
                      <img
                        src={`${REACT_APP_URL_API}${currentModule.thumbnail.url}`}
                        alt="#"
                      />
                    )}
                    <div className="detail-module-footer pt-3 text-right">
                      {keyCourse !== "" && keyModule !== "" && (
                        <button
                          type="button"
                          onClick={() => {
                            this.handleNextModule(listMenu);
                          }}
                          className="btn bg-root"
                        >
                          Next step <i className="fa fa-arrow-right" />
                        </button>
                      )}
                    </div>
                  </div>
                )}
                {!_.isEmpty(currentContent) && currentContent.relationData && (
                  <div className="detail-content">
                    <h4 className="detail-content-title">
                      {currentContent.relationData.data.title}
                    </h4>
                    <h5>Description: </h5>
                    <div
                      className="detail-content-description"
                      dangerouslySetInnerHTML={{
                        __html: currentContent.relationData.data.description
                      }}
                    />
                    {currentContent.type === "Video" && (
                      <VideoNormal
                        src={
                          currentContent.relationData.media
                            ? currentContent.relationData.media.url
                            : currentContent.relationData.data.url
                        }
                      />
                    )}
                    {currentContent.type === "Text" && (
                      <TextNormal
                        context={currentContent.relationData.data.content}
                      />
                    )}
                    {currentContent.type === "TextTest" && (
                      <TextToTest
                        contents={currentContent.relationData.data.contents}
                      />
                    )}
                    {currentContent.type === "Question" && (
                      <Question
                        questions={currentContent.relationData.data.questions}
                      />
                    )}
                    {currentContent.type === "Slide" && (
                      <Slide
                        slideItem={currentContent.relationData.data.slideItems}
                      />
                    )}
                    <div className="detail-content-footer pt-3 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          this.handleNextContent(listMenu);
                        }}
                        className="btn bg-root"
                      >
                        Next Content <i className="fa fa-arrow-right" />
                      </button>
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(TrainingDetail));
