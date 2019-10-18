import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Header from "components/Layout/Header";
import { getTrainingById } from "redux/action/training";
import VideoNormal from "h5p/VideoNormal";
import TextNormal from "h5p/TextNormal";
import TextToTest from "h5p/TextToTest";
import Question from "h5p/Question";
import Slide from "h5p/Slide";
import _ from "lodash";

const REACT_APP_URL_API = process.env.REACT_APP_URL_API;

function mapStateToProps(state) {
  return {
    store: {
      training: state.training.training.data,
      loadingTraining: state.training.training.loading
    }
  };
}

const mapDispatchToProps = dispatch => {
  return {
    action: bindActionCreators(
      {
        getTrainingById
      },
      dispatch
    )
  };
};

class TrainingDetail extends Component {
  trainingPath = {};
  processData = false;
  state = {
    currentContent: {},
    currentCourse: {},
    trainingPath: {},
    currentModule: {}
  };
  componentDidMount() {
    const { id } = this.props.match.params;
    this.handleGetTrainingById(id);
  }

  handleGetTrainingById = id => {
    const payload = { id };
    const { getTrainingById } = this.props.action;
    getTrainingById(payload, () => { });
  };

  handleChangeContent = currentContent => {
    this.setState({ currentContent, currentCourse: {}, currentModule: {} });
  };

  handleChangeCourse = currentCourse => {
    console.log("currentCourse", currentCourse)
    this.setState({ currentCourse, currentContent: {}, currentModule: {} });
  };

  handleChangeModule = currentModule => {
    console.log("currentCourse", currentModule)
    this.setState({ currentModule, currentContent: {}, currentCourse: {} });
  };

  render() {
    const { currentContent, currentCourse, currentModule } = this.state;

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
                      <a href="#">
                        <i className="fa fa-home"></i> Home
                      </a>
                    </li>
                    <li>Training</li>
                  </ul>
                </div>
              </div>
              <div className="col-12">
                <h4 className="alert bg-root">Loading...</h4>
              </div>
            </div>
          </div>
        </div>
      );
    }

    const detailTraining = training.data.training;

    return (
      <div className="page-header">
        <Header titleHeader={`Training "${detailTraining.name}" Page `} />
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
                  <li>{`Training "${detailTraining.name}"`} </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-xl-4">
              <div className="card mb-3">
                <div className="card-body">
                  <h5 className="card-title">Learning Path</h5>
                  <ul className="learning-path">
                    {detailTraining.learningpaths.map((path, index) => {
                      return (
                        <>
                          <li
                            key={index}
                            onClick={() => { this.handleChangeCourse(path.courses[0]) }}
                          >
                            {path.courses[0].name} - Mark: {path.markForCourse}
                          </li>
                          <ul style={{paddingLeft:"10px"}}>
                            {path.courses[0].relationcoursemodules &&
                              path.courses[0].relationcoursemodules.map(
                                (itemCourse, indexCourse) => {
                                  return (
                                    <>
                                      <li key={indexCourse} onClick={() => {
                                        this.handleChangeModule(itemCourse.modules[0])
                                      }}>
                                        {itemCourse.modules[0].name}
                                      </li>
                                      <ul style={{ paddingLeft: "20px" }}>
                                        {itemCourse.modules[0].contents &&
                                          itemCourse.modules[0].contents.map(
                                            (itemContent, indexContent) => {
                                              return (
                                                <li
                                                  key={indexContent}
                                                  onClick={() =>
                                                    this.handleChangeContent(
                                                      itemContent
                                                    )
                                                  }
                                                >
                                                  {itemContent.name}
                                                </li>
                                              );
                                            }
                                          )}
                                      </ul>
                                    </>
                                  );
                                }
                              )}
                          </ul>
                        </>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-xl-8">
              <div className="featured-courses courses-wrap">
                {_.isEmpty(currentContent) && _.isEmpty(currentCourse) && _.isEmpty(currentModule) && (
                  <>
                    <div
                      className="text"
                      dangerouslySetInnerHTML={{
                        __html: detailTraining.description
                      }}
                    />
                    <div className="">
                      Level of training: {detailTraining.level}
                    </div>
                    <div className="">
                      Total courses: {detailTraining.learningpaths.length}
                    </div>
                  </>
                )}
                {!_.isEmpty(currentCourse) && (
                  <div className="course-detail">
                    {currentCourse.name}
                    <div
                        className="text"
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
                    <div className="module-detail">
                      <h2>{currentModule.name}</h2>
                      <div
                        className="text"
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
                  <div>
                    <p className="text-success">
                      {currentContent.relationData.data.title}
                    </p>
                    <p className="text-success">
                      {currentContent.relationData.data.description}
                    </p>
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
                        // question={currentContent.relationData.data.question}
                        // answer={currentContent.relationData.data.answer}
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
)(TrainingDetail);
