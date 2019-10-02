import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Header from "components/Layout/Header";
import { getCourseByTraining } from "redux/action/course";
import { getModuleByCourse } from "redux/action/module";
import { getContentByModule } from "redux/action/content";
import _ from "lodash";
import AuthStorage from "utils/AuthStorage";
import moment from "moment";
import VideoNormal from "h5p/VideoNormal";
const REACT_APP_URL_API = process.env.REACT_APP_URL_API;

function mapStateToProps(state) {
  return {
    store: {
      listCourseFitler: state.listCourseFitler.listCourseFitler.data,
      loadingListCourse: state.listCourseFitler.listCourseFitler.loading,
      filterModuleByCourse:
        state.filterModuleByCourse.filterModuleByCourse.data,
      loadingListModule:
        state.filterModuleByCourse.filterModuleByCourse.loading,
      listContentByModule: state.listContentByModule.listContentByModule.data,
      loadingListContent: state.listContentByModule.listContentByModule.loading
    }
  };
}

const mapDispatchToProps = dispatch => {
  return {
    action: bindActionCreators(
      {
        getCourseByTraining,
        getModuleByCourse,
        getContentByModule
      },
      dispatch
    )
  };
};

class TrainingDetail extends Component {
  trainingPath = {};
  processData = false;
  componentDidMount() {
    // console.log("this is props>>>", this.props.match.params.id);
    const { id } = this.props.match.params;
    this.trainingPath["id"] = id;
    this.handleGetCourseByTraining(id);
  }

  handleGetCourseByTraining = trainingId => {
    this.processData = true;
    const payload = { id: trainingId };
    const { getCourseByTraining } = this.props.action;
    getCourseByTraining(payload, () => {
      let { listCourseFitler } = this.props.store;
      listCourseFitler.map((item, index) => {
        item.courses = {
          ...item.courses[0]
        };
        this.handleGetModuleByCourse(item.courses._id, item.courses);
      });
      this.trainingPath["pathCourse"] = listCourseFitler;
    });
  };

  handleGetModuleByCourse = (courseId, course) => {
    const payload = { id: courseId };
    const { getModuleByCourse } = this.props.action;
    getModuleByCourse(payload, () => {
      const { filterModuleByCourse } = this.props.store;
      filterModuleByCourse.map((itemModule, indexModule) => {
        itemModule.modules = { ...itemModule.modules[0] };
        this.handleGetContentByModule(
          itemModule.modules._id,
          itemModule.modules
        );
      });
      course["pathModule"] = filterModuleByCourse;
    });
  };

  handleGetContentByModule = (moduleId, module) => {
    const payload = { id: moduleId };
    const { getContentByModule } = this.props.action;
    getContentByModule(payload, () => {
      const { listContentByModule } = this.props.store;
      module["content"] = listContentByModule;
    });
  };

  render() {
    const {
      listCourseFitler,
      loadingListCourse,
      loadingListModule,
      filterModuleByCourse,
      loadingListContent,
      listContentByModule
    } = this.props.store;

    console.log("Render>>>", this.trainingPath);
    return (
      <div className="page-header">
        <Header titleHeader="Course Page" />
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
          </div>

          <div className="row">
            <div className="col-xl-4">
              <div className="card text-white bg-primary mb-3">
                <div className="card-header">TRAINING "NAME_TRAINING"</div>
                <div className="card-body">
                  <h5 className="card-title">Learning Path</h5>
                  <ul>
                    {!loadingListCourse &&
                      !loadingListModule &&
                      this.trainingPath &&
                      this.trainingPath.pathCourse &&
                      this.trainingPath.pathCourse.map((path, index) => {
                        return (
                          <li key={index}>
                            {path.courses.name}
                            <ul>
                              {path.courses.pathModule &&
                                path.courses.pathModule.map(
                                  (itemCourse, indexCourse) => {
                                    return (
                                      <li key={indexCourse}>
                                        {itemCourse.modules.name}
                                        <ul>
                                          {itemCourse.modules.content &&
                                            itemCourse.modules.content.map(
                                              (itemContent, indexContent) => {
                                                return (
                                                  <li key={indexContent}>
                                                    {itemContent.name}
                                                  </li>
                                                );
                                              }
                                            )}
                                        </ul>
                                      </li>
                                    );
                                  }
                                )}
                            </ul>
                          </li>
                        );
                      })}
                  </ul>
                  {/* <ul>
                    {!loadingListCourse &&
                      listCourseFitler.map((item, index) => {
                        return <li key={index}>{item.courses.name}</li>;
                      })}
                  </ul>
                  <label>Module by Course</label>
                  <ul>
                    {!loadingListModule &&
                      filterModuleByCourse.map((item, index) => {
                        return <li key={index}>{item.modules.name}</li>;
                      })}
                  </ul> */}
                </div>
              </div>
            </div>
            <div className="col-xl-8">
              <div className="featured-courses courses-wrap">
                {!loadingListContent &&
                  listContentByModule &&
                  listContentByModule[0].type === "Video" && (
                    <>
                      <p className="text-success">
                        {listContentByModule[0].relationData.data.title}
                      </p>
                      <p className="text-success">
                        {listContentByModule[0].relationData.data.description}
                      </p>
                      <VideoNormal
                        src={listContentByModule[0].relationData.media.url}
                      />
                    </>
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
