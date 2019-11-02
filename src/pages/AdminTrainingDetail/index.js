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
const REACT_APP_URL_API = process.env.REACT_APP_URL_API;

function mapStateToProps(state) {
  return {
    store: {
      training: state.training.training.data,
      loadingTraining: state.training.training.loading,
      isUpdateActivity: state.isUpdateActivity.isUpdateActivity.data,
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
    isFinishStudying: false,
    keyCourse: "",
    keyModule: "",
  };
  componentDidMount() {
    const { id } = this.props.match.params;
    this.handleGetTrainingById(id);
  }

  componentWillReceiveProps(nextProps) {
    const { training, loadingTraining } = nextProps.store;
    if (!loadingTraining && (_.isEmpty(training.data.training) || _.isEmpty(training))) {
      this.props.history.push("/my-training")
    }
  }

  handleGetTrainingById = id => {
    const payload = { id };
    const { getTrainingById } = this.props.action;
    getTrainingById(payload, () => { });
  };

  handleChangeContent = currentContentChoosen => {
    let { currentContent } = this.state;
    if (_.isEqual(currentContent, currentContentChoosen)) {
      this.setState({ currentContent: {} })
    }
    else {
      this.setState({ currentContent: currentContentChoosen });
    }
  };

  handleChangeCourse = currentCourseChoosen => {
    let { currentCourse } = this.state;
    if (_.isEqual(currentCourse, currentCourseChoosen)) {
      this.setState({ currentCourse: {} })
    }
    else {
      this.setState({ currentCourse: currentCourseChoosen });
    }
  };

  handleChangeModule = currentModuleChoosen => {
    let { currentModule } = this.state;
    if (_.isEqual(currentModule, currentModuleChoosen)) {
      this.setState({ currentModule: {} })
    }
    else {
      this.setState({ currentModule: currentModuleChoosen });
    }
  };

  processDataToListMenu = (training) => {
    let listMenu = [];
    training.learningpaths.map((path, index) => {
      let menuLv1 = {}
      menuLv1.key = `first-level-node-${index + 1}`;
      menuLv1.label = `${path.courses[0].name}`;
      let tempCourse = path.courses[0];
      tempCourse.totalMark = path.markForCourse;
      menuLv1.value = tempCourse;
      menuLv1.nodes = [];
      path.courses[0].relationcoursemodules.map((itemCourse, indexCourse) => {
        let menuLv2 = {}
        menuLv2.key = `second-level-node-${indexCourse + 1}`;
        menuLv2.label = itemCourse.modules[0].name
        menuLv2.value = itemCourse.modules[0];
        menuLv2.nodes = []
        itemCourse.modules[0].contents.map((itemContent, indexContent) => {
          let menuLv3 = {}
          menuLv3.key = `third-level-node-${indexContent + 1}`;
          menuLv3.label = itemContent.name;
          menuLv3.value = itemContent
          menuLv3.nodes = []
          menuLv2.nodes.push(menuLv3);
        })
        menuLv1.nodes.push(menuLv2);
      })
      listMenu.push(menuLv1);
    })
    return listMenu;
  }

  handeSelectMenu = (item) => {
    this.setState({ isFinishStudying: false });
    if (item.level === 0) {
      this.setState({ currentCourse: item.value, currentModule: {}, currentContent: {} })
    }
    if (item.level === 1) {
      this.setState({ currentCourse: {}, currentModule: item.value, currentContent: {} })
    }
    if (item.level === 2) {
      this.setState({ currentCourse: {}, currentModule: {}, currentContent: item.value })
    }
  }

  resetTraining = () => {
    this.setState({
      currentCourse: {}, currentModule: {}, currentContent: {}
    })
  }

  render() {
    const { currentContent, currentCourse, currentModule, isFinishStudying, keyCourse, keyModule } = this.state;

    const { training, loadingTraining, isUpdateActivity } = this.props.store;

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
                      <a href="#">
                        <i className="fa fa-home"></i> Home
                    </a>
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
      return (<></>)
    }

    const listMenu = this.processDataToListMenu(detailTraining);
    let starOfTraining = [];
    for (let i = 0; i < parseInt(detailTraining.level); i++) {
      starOfTraining.push(i);
    }
    return (
      <div className="page-header">
        <Header titleHeader={`Training "${detailTraining.name}" Detail `} />
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
                  <li>
                    <a href="#" onClick={(e) => { e.preventDefault(); this.resetTraining(); }}>{`Training "${detailTraining.name}"`}</a>
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
                  {listMenu.length > 0 && (<TreeMenu
                    data={listMenu}
                    // initialOpenNodes={this.state.initiallyOpenProperties}
                    hasSearch={true}
                    onClickItem={this.handeSelectMenu}
                    ref="treeMenu"
                  />)}
                </div>
              </div>
            </div>
            <div className="col-xl-8">
              <div className="featured-courses courses-wrap">

                {_.isEmpty(currentContent) && _.isEmpty(currentCourse) && _.isEmpty(currentModule) && (
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
                      {detailTraining.level !== "" && starOfTraining.map((item, index) => {
                        return (
                          <span className="fa fa-star checked"></span>
                        )
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
                      <img src={`${REACT_APP_URL_API}${currentCourse.thumbnail.url}`} alt="#" />
                    )}

                  </div>
                )}
                {
                  !_.isEmpty(currentModule) && (
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
                        <img src={`${REACT_APP_URL_API}${currentModule.thumbnail.url}`} alt="#" />
                      )}

                    </div>
                  )
                }
                {!_.isEmpty(currentContent) && (
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
