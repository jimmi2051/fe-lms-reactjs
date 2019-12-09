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
import PopupListModule from "pages/NewTraining/PopupListModule";
import Loading from "components/Loading";
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
      isCreatedLearningPath:
        state.isCreatedLearningPath.isCreatedLearningPath.data
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
    isShow: false,
    currentCourse: {},
    listCourse: [],
    listModuleChoosen_ver2: [],
    isShowListModule: false,
    updateCouse: false,
    currentTraining: {},
    isLoading: false
  };

  componentDidMount() {
    this.props.handleGetListModuleByUser(AuthStorage.userInfo._id);
    const { trainingCreated } = this.props;
    this.setState({ currentTraining: trainingCreated });
    if (_.isUndefined(trainingCreated._id)) {
      // this.handleFilterListCourse("5deb6cbed609e02c63dfa8fc");
    } else {
      this.handleFilterListCourse(trainingCreated._id);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { currentTraining } = this.state;
    const { isCreatedLearningPath, isCreatedCourseModule } = nextProps.store;
    if (
      !_.isEqual(isCreatedLearningPath, this.props.store.isCreatedLearningPath)
    ) {
      this.handleFilterListCourse(currentTraining._id);
    }
    if (
      !_.isEqual(
        isCreatedCourseModule,
        this.props.store.isCreatedCourseModule
      ) &&
      isCreatedCourseModule._id
    ) {
      this.handleGetModuleByCourse(isCreatedCourseModule.course._id);
    }
  }

  handleFilterListCourse = training_id => {
    const payload = { id: training_id };
    const { getCourseByTraining } = this.props.action;
    getCourseByTraining(payload, () => {
      const { listCourseFitler } = this.props.store;
      this.handleProcessData(listCourseFitler);
      //Get Module of first course if exists
      if (listCourseFitler.length > 0) {
        this.handleGetModuleByCourse(listCourseFitler[0].course._id);
      }
    });
  };

  handleProcessData = listCourseFitler => {
    let listCourse = [];
    listCourseFitler.map((item, index) => {
      listCourse.push({
        value: item.course,
        label: item.course.name
      });
    });
    this.setState({
      currentCourse: listCourse.length > 0 ? listCourseFitler[0].course : {},
      listCourse
    });
  };

  handleCreateCourseModule = (course, position, module, lastModule) => {
    const { addCourseModule } = this.props.action;
    const { currentCourse } = this.state;
    const payload = { course, position, module };
    addCourseModule(payload, response => {
      const { notifySuccess } = this.props;
      if (lastModule) {
        notifySuccess(
          "Nofitication",
          `List modules of training "${currentCourse.name}" has been updated successfully.`
        );

        this.setState({ isLoading: false });
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
    const { notifyError } = this.props;
    const { listModuleChoosen_ver2, currentCourse } = this.state;
    if (listModuleChoosen_ver2.length === 0) {
      notifyError(
        "Nofitication",
        "Error! You must add least one content to module."
      );
      return;
    }
    this.setState({ isLoading: true });
    const course = currentCourse._id;
    listModuleChoosen_ver2.map((item, index) => {
      const position = index + 1;
      const module = item._id;
      this.setState({ listModuleChoosen_ver2: [] });
      if (index === listModuleChoosen_ver2.length - 1) {
        this.handleCreateCourseModule(course, position, module, true);
      } else {
        this.handleCreateCourseModule(course, position, module, false);
      }
    });
  };

  handleChange = options => {
    if (!_.isNull(options)) {
      this.handleChangeCourse(options.value);
      this.setState({ listModuleChoosen_ver2: [] });
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
      isShow,
      currentCourse,
      listCourse,
      isShowListModule,
      listModuleChoosen_ver2,
      isLoading
    } = this.state;
    const {
      listModuleByUser,
      loadingListModuleByUser,
      filterModuleByCourse,
      loadingModuleByCourse
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
          <div className="form-group">
            <button
              type="button"
              className="form-control btn bg-root btn-add-new"
              onClick={this.handleShowPopup}
            >
              Add new module
            </button>
            <small className="form-text text-muted">
              Note: With the course already exists module, you can't edit or add
              more module for it.
            </small>
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
              <div className="row  ">
                {listModuleChoosen_ver2.map((item, index) => {
                  return (
                    <div className="col-12 col-md-6   mb-4" key={index}>
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
                          {/* <Link to={`#`}> */}
                          <img
                            src={
                              _.isEmpty(item.thumbnail)
                                ? "https://be-lms.tk/uploads/9ee513ab17ae4d2ca9a7fa3feb3b2d67.png"
                                : `${REACT_APP_URL_API}${item.thumbnail.url}`
                            }
                            alt=""
                            height="200px"
                          />
                          {/* </Link> */}
                        </figure>

                        <div className="course-content-wrap">
                          <header className="entry-header">
                            <h2 className="entry-title">
                              {item.name}
                              {/* <Link to={`#`}></Link> */}
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
        {!loadingModuleByCourse ? (
          <div className="col-xl-12 new-training">
            <div className="featured-courses courses-wrap">
              <div className="row  ">
                {filterModuleByCourse.map((item, index) => {
                  return (
                    <div className="col-12 col-md-6   mb-4" key={index}>
                      <div
                        className={`${
                          messageErr !== "" ? "border border-danger" : ""
                        } course-content course-content-active`}
                      >
                        <figure className="course-thumbnail">
                          {/* <Link to={`#`}> */}
                          <img
                            src={
                              item.module && _.isEmpty(item.module.thumbnail)
                                ? "https://be-lms.tk/uploads/9ee513ab17ae4d2ca9a7fa3feb3b2d67.png"
                                : `${REACT_APP_URL_API}${item.module.thumbnail.url}`
                            }
                            alt=""
                            height="200px"
                          />
                          {/* </Link> */}
                        </figure>

                        <div className="course-content-wrap">
                          <header className="entry-header">
                            <h2 className="entry-title">
                              {item.module.name}
                              {/* <Link to={`#`}></Link> */}
                            </h2>

                            <div className="entry-meta flex flex-wrap align-items-center">
                              <div className="course-author">
                                <label>
                                  Created date:{" "}
                                  {moment(item.module.createdAt).format(
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
              <div className="row  ">
                <div className="col-12 col-md-12  ">
                  <Loading classOption="align-center-spinner" />
                </div>
              </div>
            </div>
          </div>
        )}
        {!loadingModuleByCourse && filterModuleByCourse.length === 0 && (
          <div className="col-xl-12 new-training mb-4">
            <div className="featured-courses courses-wrap">
              <div className="row  ">
                {isLoading ? (
                  <div className="col-12 col-md-12  ">
                    <Loading classOption="align-center-spinner" />
                  </div>
                ) : (
                  <div className="col-12 col-md-6  ">
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
                )}
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
              disabled={isLoading}
            >
              {isLoading ? (
                <Loading color="#ffffff" classOption="align-center-spinner" />
              ) : (
                "SAVE"
              )}
            </button>
          )}

          <button
            className="btn bg-root"
            style={{ width: "100%" }}
            onClick={this.props.handleStepThree}
          >
            SKIP & CONTINUE
          </button>
        </div>
      </div>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Step3);

// This is for module->>>
