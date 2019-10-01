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
  componentDidMount() {
    // console.log("this is props>>>", this.props.match.params.id);
    const { id } = this.props.match.params;
    this.handleGetCourseByTraining(id);
  }

  handleGetCourseByTraining = trainingId => {
    const payload = { id: trainingId };
    const { getCourseByTraining } = this.props.action;
    getCourseByTraining(payload, () => {
      const { listCourseFitler } = this.props.store;
      if (listCourseFitler.length > 0) {
        this.handleGetModuleByCourse(listCourseFitler[0].courses[0]._id);
      }
    });
  };

  handleGetModuleByCourse = courseId => {
    const payload = { id: courseId };
    const { getModuleByCourse } = this.props.action;
    getModuleByCourse(payload, () => {
      const { filterModuleByCourse } = this.props.store;
      if (filterModuleByCourse.length > 0) {
        this.handleGetContentByModule(filterModuleByCourse[0].modules[0]._id);
      }
    });
  };

  handleGetContentByModule = moduleId => {
    const payload = { id: moduleId };
    const { getContentByModule } = this.props.action;
    getContentByModule(payload);
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

    console.log(listContentByModule);
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
                  <p className="card-text">
                    <ul>
                      {!loadingListCourse &&
                        listCourseFitler.map((item, index) => {
                          return <li>{item.courses[0].name}</li>;
                        })}
                    </ul>
                    <label>Module by Course</label>
                    <ul>
                      {!loadingListModule &&
                        filterModuleByCourse.map((item, index) => {
                          return <li>{item.modules[0].name}</li>;
                        })}
                    </ul>
                  </p>
                </div>
              </div>
            </div>
            <div className="col-xl-8">
              <div className="featured-courses courses-wrap">
                {!loadingListContent && listContentByModule && (
                  <iframe
                    width="560"
                    height="315"
                    src={`${listContentByModule[0].relationData.data.url}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
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
