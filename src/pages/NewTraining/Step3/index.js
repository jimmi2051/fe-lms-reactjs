import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import PopupNewModule from "pages/NewTraining/PopupNewModule";
import { UploadFile } from "utils/UploadImage.js";
import _ from "lodash";
import { getCourseByTraining, addCourseModule } from "redux/action/course";
import { getModuleByCourse, removeModuleByCourse } from "redux/action/module";
import AuthStorage from "utils/AuthStorage";
import Select from "react-select";
import moment from "moment";
import { Link } from "react-router-dom";
import PopupListModule from "pages/NewTraining/PopupListModule";

function mapStateToProps(state) {
  return {
    store: {
      isCreatedTraining: state.isCreatedTraining.isCreatedTraining.data,
      loadingCreatedTraining: state.isCreatedTraining.isCreatedTraining.loading,
      isCreatedModule: state.isCreatedModule.isCreatedModule.data,
      loadingCreatedModule: state.isCreatedModule.isCreatedModule.loading,
      listModuleByUser: state.isCreatedModule.listModuleByUser.data,
      loadingListModuleByUser: state.isCreatedModule.listModuleByUser.loading,
      listCourseFitler: state.listCourseFitler.listCourseFitler.data,
      loadingListCourseFilter: state.listCourseFitler.listCourseFitler.loading,
      isCreatedCourseModule: state.listCourseFitler.isCreatedCourseModule.data,
      filterModuleByCourse: state.listModule.filterModuleByCourse.data,
      loadingModuleByCourse: state.listModule.filterModuleByCourse.loading,
      isCreatedLearningPath: state.isCreatedLearningPath.isCreatedLearningPath.data
    }
  };
}

const mapDispatchToProps = dispatch => {
  return {
    action: bindActionCreators(
      {
        getCourseByTraining,
        addCourseModule,
        getModuleByCourse,
        removeModuleByCourse
      },
      dispatch
    )
  };
};

const REACT_APP_URL_API = process.env.REACT_APP_URL_API;

class Step3 extends Component {
  state = {
    createdModule: false,
    isShow: false,
    currentCourse: {},
    listCourse: [],
    listModuleChoosen_ver2: [],
    isShowListModule: false,
    updateCouse: false,
    currentTraining: {}
  };

  componentDidMount() {
    this.props.handleGetListModuleByUser(AuthStorage.userInfo._id);
    const { trainingCreated } = this.props;
    this.setState({ currentTraining: trainingCreated });
    if (_.isUndefined(trainingCreated._id)) {
      this.handleFilterListCourse("5d9a0516fa842c10ba72c543");
    } else {
      //this is hardcode must to fix
      this.handleFilterListCourse(trainingCreated._id);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { currentTraining } = this.state;
    const { isCreatedLearningPath } = nextProps.store;
    if (!_.isEqual(isCreatedLearningPath, this.props.store.isCreatedLearningPath)) {
      this.handleFilterListCourse(currentTraining._id);
    }
  }

  handleFilterListCourse = training_id => {
    const payload = { id: training_id };
    const { getCourseByTraining } = this.props.action;
    getCourseByTraining(payload, () => {
      const { listCourseFitler } = this.props.store;
      this.handleProcessData(listCourseFitler);
      //Get Module of first course if exists
      this.handleGetModuleByCourse(listCourseFitler[0].courses[0]._id);
    });
  };

  handleProcessData = listCourseFitler => {
    let listCourse = [];
    listCourseFitler.map((item, index) => {
      listCourse.push({
        value: item.courses[0],
        label: item.courses[0].name
      });
    });
    this.setState({
      currentCourse: listCourse.length > 0 ? listCourseFitler[0].courses[0] : {},
      listCourse
    });
  };

  handleCreateCourseModule = (courses, position, modules, lastIndex) => {
    const { addCourseModule } = this.props.action;
    const payload = { courses, position, modules };
    addCourseModule(payload, () => {
      if (lastIndex) {
        const { currentCourse } = this.state;
        this.handleGetModuleByCourse(currentCourse._id);
      }
    });
  };

  handleSubmit = () => {
    const { title } = this.refs;
    this.props.handleStepTwo(title.value);
  };

  handleShowPopup = () => {
    const { isShow } = this.state;
    this.setState({ isShow: !isShow });
  };

  handleGetModuleByCourse = course_id => {
    const { getModuleByCourse } = this.props.action;
    const payload = { id: course_id };
    getModuleByCourse(payload);
  };

  handleChangeCourse = course => {
    this.handleGetModuleByCourse(course._id);
    this.setState({ currentCourse: course });
  };

  handleStepThree = () => {
    const { notifySuccess, notifyError } = this.props;
    const { listModuleChoosen_ver2, currentCourse } = this.state;
    const courses = [currentCourse];
    listModuleChoosen_ver2.map((item, index) => {
      const position = index + 1;
      const modules = [item];
      if (index === listModuleChoosen_ver2.length - 1) {
        notifySuccess("Nofitication", `List modules of training "${currentCourse.name}" has been updated successfully.`)
        this.setState({ listModuleChoosen_ver2: [] });
        this.handleCreateCourseModule(courses, position, modules, true);
      } else {
        this.handleCreateCourseModule(courses, position, modules, false);
      }
    });
  };

  handleChange = options => {
    if (!_.isNull(options)) {
      this.handleChangeCourse(options.value);
    }
  };

  handleAddModuleToCourse_ver2 = modulePicked => {
    let { listModuleChoosen_ver2 } = this.state;
    const index = _.findIndex(listModuleChoosen_ver2, item =>
      _.isEqual(item, modulePicked)
    );
    if (index === -1) {
      listModuleChoosen_ver2.push(modulePicked);
      this.setState({
        listModuleChoosen_ver2: listModuleChoosen_ver2
      });
    }
  };

  handleShowPopupListModule = () => {
    const { isShowListModule } = this.state;
    this.setState({ isShowListModule: !isShowListModule });
  };

  handleChangePosition = (index, expectIndex) => {
    let { listModuleChoosen_ver2 } = this.state;
    const courseTemp = listModuleChoosen_ver2[index];
    listModuleChoosen_ver2[index] = listModuleChoosen_ver2[expectIndex];
    listModuleChoosen_ver2[expectIndex] = courseTemp;
    this.setState({ listModuleChoosen_ver2: listModuleChoosen_ver2 });
  };

  handleRemoveModule = index => {
    let { listModuleChoosen_ver2 } = this.state;
    listModuleChoosen_ver2.splice(index, 1);
    this.setState({ listModuleChoosen_ver2: listModuleChoosen_ver2 });
  };

  render() {
    const messageErr = "";
    const {
      createdModule,
      isShow,
      currentCourse,
      listCourse,
      isShowListModule,
      listModuleChoosen_ver2,
    } = this.state;
    const {
      listModuleByUser,
      loadingListModuleByUser,
      filterModuleByCourse
    } = this.props.store;
    return (
      <div className="row new-training-step3">
        <PopupNewModule
          isShow={isShow}
          handleShowPopup={this.handleShowPopup}
          handleCreateModule={this.props.handleCreateModule}
          UploadFile={UploadFile}
        />
        {!loadingListModuleByUser && (
          <PopupListModule
            isShow={isShowListModule}
            listModuleByUser={listModuleByUser}
            handleShowPopup={this.handleShowPopupListModule}
            handleAddModuleToCourse_ver2={this.handleAddModuleToCourse_ver2}
          />
        )}
        <div className="col-xl-12">
          {createdModule && (
            <h3 className="text-success pl-3">MODULE HAVE BEEN CREATED</h3>
          )}{" "}
          <div className="form-group" style={{ width: "30%" }}>
            <button
              type="button"
              className="form-control btn bg-root"
              onClick={this.handleShowPopup}
            >
              Add new module
            </button>
          </div>
        </div>
        {listCourse.length > 0 && (
          <div className="col-xl-12 list-course mb-3">
            <Select
              className="basic-single"
              classNamePrefix="select"
              isSearchable={true}
              onChange={this.handleChange}
              options={listCourse}
              defaultValue={listCourse[0]}
              isClearable={true}
              noOptionsMessage={inputValue => "No course found"}
              placeholder="-- Select course --"
            />
          </div>
        )}
        <div className="col-xl-12 mb-3">
          <h6>Modules of Course "{currentCourse.name}"</h6>
        </div>
        {listModuleChoosen_ver2.length > 0 && (
          <div className="col-xl-12 new-training">
            <div className="featured-courses courses-wrap">
              <div className="row mx-m-25">
                {listModuleChoosen_ver2.map((item, index) => {
                  return (
                    <div className="col-12 col-md-6 px-25 mb-4" key={index}>
                      <div
                        className={`${
                          messageErr !== "" ? "border border-danger" : ""
                          } course-content course-content-active`}
                      >
                        <figure className="course-thumbnail">
                          <button
                            type="button"
                            className="btn btn-remove alert-danger"
                            onClick={() => {
                              this.handleRemoveModule(index);
                            }}
                          >
                            <i className="fa fa-remove"></i>
                          </button>
                          <Link to={`#`}>
                            <img
                              src={
                                _.isEmpty(item.thumbnail)
                                  ? "https://be-lms.tk/uploads/9ee513ab17ae4d2ca9a7fa3feb3b2d67.png"
                                  : `${REACT_APP_URL_API}${item.thumbnail.url}`
                              }
                              alt=""
                              height="200px"
                            />
                          </Link>
                        </figure>

                        <div className="course-content-wrap">
                          <header className="entry-header">
                            <h2 className="entry-title">
                              <Link to={`#`}>{item.name}</Link>
                            </h2>

                            <div className="entry-meta flex flex-wrap align-items-center">
                              <div className="course-author">
                                <label>
                                  Created date:{" "}
                                  {moment(item.createdAt).format("DD/MM/YYYY")}
                                </label>
                              </div>
                            </div>
                            <div className="form-group row">
                              <label className="col-sm-4 col-form-label">
                                Position
                              </label>
                              <select
                                className="form-control col-sm-8"
                                onChange={e =>
                                  this.handleChangePosition(
                                    index,
                                    e.target.value
                                  )
                                }
                                value={index}
                              >
                                {listModuleChoosen_ver2.map(
                                  (count, indexCount) => {
                                    return (
                                      <option
                                        key={indexCount}
                                        value={indexCount}
                                        disabled={indexCount === index}
                                      >
                                        {indexCount + 1}
                                      </option>
                                    );
                                  }
                                )}
                              </select>
                              <small className="form-text text-muted col-sm-12">
                                (*) Module order in the course
                              </small>
                            </div>
                          </header>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
        {filterModuleByCourse.length > 0 ? (
          <div className="col-xl-12 new-training">
            <div className="featured-courses courses-wrap">
              <div className="row mx-m-25">
                {filterModuleByCourse.map((item, index) => {
                  return (
                    <div className="col-12 col-md-6 px-25 mb-4" key={index}>
                      <div
                        className={`${
                          messageErr !== "" ? "border border-danger" : ""
                          } course-content course-content-active`}
                      >
                        <figure className="course-thumbnail">
                          <Link to={`#`}>
                            <img
                              src={
                                _.isEmpty(item.modules[0].thumbnail)
                                  ? "https://be-lms.tk/uploads/9ee513ab17ae4d2ca9a7fa3feb3b2d67.png"
                                  : `${REACT_APP_URL_API}${item.modules[0].thumbnail.url}`
                              }
                              alt=""
                              height="200px"
                            />
                          </Link>
                        </figure>

                        <div className="course-content-wrap">
                          <header className="entry-header">
                            <h2 className="entry-title">
                              <Link to={`#`}>{item.modules[0].name}</Link>
                            </h2>

                            <div className="entry-meta flex flex-wrap align-items-center">
                              <div className="course-author">
                                <label>
                                  Created date:{" "}
                                  {moment(item.modules[0].createdAt).format(
                                    "DD/MM/YYYY"
                                  )}
                                </label>
                              </div>
                            </div>
                            <div className="form-group row text-left">
                              <label className="col-sm-12 col-form-label">
                                Position: <b>{item.position}</b>
                              </label>
                            </div>
                          </header>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
            <div className="col-xl-12 new-training mb-4">
              <div className="featured-courses courses-wrap">
                <div className="row mx-m-25">
                  <div className="col-12 col-md-6 px-25">
                    <div
                      className="course-content"
                      onClick={this.handleShowPopupListModule}
                    >
                      <div className="course-content-wrap">
                        <i className="fa fa-plus"></i>
                        <h3>Add new item</h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        <div className="form-group col-xl-12">
          {filterModuleByCourse.length === 0 && (
            <button
              className="btn bg-root-active mb-3"
              style={{ width: "100%" }}
              onClick={this.handleStepThree}
            >
              UPDATE COURSE
            </button>
          )}

          <button
            className="btn bg-root"
            style={{ width: "100%" }}
            onClick={this.props.handleStepThree}
          >
            SAVE & CONTINUE
          </button>
        </div>
      </div>
    );
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Step3);

// This is for module->>>
