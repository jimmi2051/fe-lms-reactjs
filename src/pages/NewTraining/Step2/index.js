import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import PopupNewCourse from "pages/NewTraining/PopupNewCourse";
import { UploadFile } from "utils/UploadImage.js";
import _ from "lodash";
import { addLearningPath } from "redux/action/training";
import AuthStorage from "utils/AuthStorage";
import { Link } from "react-router-dom";
import PopupListCourse from "pages/NewTraining/PopupListCourse";
import moment from "moment";
import Loading from "components/Loading";
const REACT_APP_URL_API = process.env.REACT_APP_URL_API;

function mapStateToProps(state) {
  return {
    store: {
      isCreatedTraining: state.isCreatedTraining.isCreatedTraining.data,
      loadingCreatedTraining: state.isCreatedTraining.isCreatedTraining.loading,
      isCreatedCourse: state.isCreatedCourse.isCreatedCourse.data,
      loadingCreatedCourse: state.isCreatedCourse.isCreatedCourse.loading,
      listCourseByUser: state.isCreatedCourse.listCourseByUser.data,
      loadingListCourseUser: state.isCreatedCourse.listCourseByUser.loading,
      isCreatedLearningPath: state.isCreatedTraining.isCreatedLearningPath.data,
      loadingCreatedLearningPath:
        state.isCreatedTraining.isCreatedLearningPath.loading
    }
  };
}

const mapDispatchToProps = dispatch => {
  return {
    action: bindActionCreators({ addLearningPath }, dispatch)
  };
};
class Step2 extends Component {
  state = {
    isShow: false,
    isLoading: false,
    isShowListCourse: false,
    listCourseChoosen_ver2: [],
    messageErr: ""
  };
  componentDidMount() {
    this.props.handleGetListCourseByUser(AuthStorage.userInfo._id);
  }

  handleAddLearningPath = (
    training,
    course,
    position,
    markForCourse,
    isRequired,
    lastCourse
  ) => {
    const { notifySuccess, notifyError, trainingCreated } = this.props;
    const { addLearningPath } = this.props.action;
    const payload = { training, course, position, markForCourse, isRequired };
    addLearningPath(payload, response => {
      if (lastCourse) {
        this.props.handleStepTwo();
        notifySuccess(
          "Nofitication",
          `Learning path of training "${trainingCreated.name}" has been updated successfully.`
        );
      }
    });
  };
  // Version 2
  handleAddCourseToPath_ver2 = coursePicked => {
    let { listCourseChoosen_ver2 } = this.state;
    const index = _.findIndex(listCourseChoosen_ver2, item =>
      _.isEqual(item.course, coursePicked)
    );
    if (index === -1) {
      listCourseChoosen_ver2.push({
        course: coursePicked,
        mark: 0,
        required: false
      });
      this.setState({
        listCourseChoosen_ver2: listCourseChoosen_ver2
      });
    }
  };

  handleRemoveCourseToPath_ver2 = index => {
    let { listCourseChoosen_ver2 } = this.state;
    listCourseChoosen_ver2.splice(index, 1);
    this.setState({
      listCourseChoosen_ver2: listCourseChoosen_ver2
    });
  };

  handleChangePosition = (index, expectIndex) => {
    let { listCourseChoosen_ver2 } = this.state;
    const courseTemp = listCourseChoosen_ver2[index];
    listCourseChoosen_ver2[index] = listCourseChoosen_ver2[expectIndex];
    listCourseChoosen_ver2[expectIndex] = courseTemp;
    this.setState({ listCourseChoosen_ver2: listCourseChoosen_ver2 });
  };

  handleShowPopup = () => {
    this.setState({ isShow: !this.state.isShow });
  };

  handleShowPopupListCourse = () => {
    const { isShowListCourse } = this.state;
    this.setState({ isShowListCourse: !isShowListCourse });
  };

  handleStepTwo = () => {
    const { notifySuccess, notifyError } = this.props;
    const { listCourseChoosen_ver2 } = this.state;
    this.setState({ isLoading: true });
    if (listCourseChoosen_ver2.length === 0) {
      notifyError(
        "Nofitication",
        "Error! You must add least one course to training."
      );
      this.setState({ isLoading: false });
      return;
    }
    const { trainingCreated } = this.props;
    if (!trainingCreated._id) {
      notifyError(
        "Nofitication",
        "Error! Something when wrong. Please wait a few minutes and try again. Thanks"
      );
      this.setState({ isLoading: false });
      return;
    }
    const training = trainingCreated._id;
    if (this.validateCourse(listCourseChoosen_ver2)) {
      listCourseChoosen_ver2.map(async (item, index) => {
        const position = index + 1;
        const markForCourse = item.mark;
        const isRequired = item.required;
        const course = item.course._id;
        if (index === listCourseChoosen_ver2.length - 1) {
          this.handleAddLearningPath(
            training,
            course,
            position,
            markForCourse,
            isRequired,
            true
          );
        } else {
          this.handleAddLearningPath(
            training,
            course,
            position,
            markForCourse,
            isRequired,
            false
          );
        }
      });
    } else {
      this.setState({ messageErr: "Must choose one course is a mandatory." });
      this.setState({ isLoading: false });
    }
  };

  validateCourse = listCourse => {
    let isValidate = false;
    const findIndex = _.findIndex(listCourse, item => item.required === true);
    if (findIndex > -1) {
      isValidate = true;
    }
    return isValidate;
  };

  handleInputMark = (index, mark) => {
    let { listCourseChoosen_ver2 } = this.state;
    listCourseChoosen_ver2[index].mark = mark;
    this.setState({ listCourseChoosen_ver2: listCourseChoosen_ver2 }, () => {});
  };

  handleCheckRequired = (index, checked) => {
    let { listCourseChoosen_ver2 } = this.state;
    listCourseChoosen_ver2[index].required = checked;
    this.setState({ listCourseChoosen_ver2: listCourseChoosen_ver2 });
  };

  handeChangleMark = (e, index) => {
    this.handleInputMark(index, e.target.value);
  };

  handleChangeRequired = (e, index) => {
    this.setState({ messageErr: "" });
    this.handleCheckRequired(index, e.target.checked);
  };

  render() {
    const {
      isShow,
      isShowListCourse,
      listCourseChoosen_ver2,
      messageErr,
      isLoading
    } = this.state;
    const { listCourseByUser, loadingListCourseUser } = this.props.store;
    return (
      <div className="row">
        <PopupNewCourse
          isShow={isShow}
          UploadFile={UploadFile}
          handleCreateCourse={this.props.handleCreateCourse}
          handleShowPopup={this.handleShowPopup}
        />
        {!loadingListCourseUser && (
          <PopupListCourse
            isShow={isShowListCourse}
            listCourseByUser={listCourseByUser}
            handleShowPopup={this.handleShowPopupListCourse}
            handleAddCourseToPath_ver2={this.handleAddCourseToPath_ver2}
          />
        )}
        <div className="col-xl-12">
          <div className="form-group">
            <button
              type="button"
              className="form-control btn bg-root btn-add-new"
              onClick={this.handleShowPopup}
            >
              Add new course
            </button>
          </div>
        </div>
        {messageErr !== "" && (
          <div className="col-xl-12">
            <h5 className="text-danger">{messageErr}</h5>
          </div>
        )}

        {listCourseChoosen_ver2.length > 0 && (
          <div className="col-xl-12 new-training">
            <div className="featured-courses courses-wrap">
              <div className="row  ">
                {listCourseChoosen_ver2.map((item, index) => {
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
                              this.handleRemoveCourseToPath_ver2(index);
                            }}
                          >
                            <i className="fa fa-remove"></i>
                          </button>
                          {/* <Link to={`#`}> */}
                          <img
                            src={
                              _.isEmpty(item.course.thumbnail)
                                ? "https://be-lms.tk/uploads/9ee513ab17ae4d2ca9a7fa3feb3b2d67.png"
                                : `${REACT_APP_URL_API}${item.course.thumbnail.url}`
                            }
                            alt=""
                            height="200px"
                          />
                          {/* </Link> */}
                        </figure>

                        <div className="course-content-wrap">
                          <header className="entry-header">
                            <h2 className="entry-title">{item.course.name}</h2>

                            <div className="entry-meta flex flex-wrap align-items-center">
                              <div className="course-author">
                                <label>
                                  Created date:{" "}
                                  {moment(item.course.createdAt).format(
                                    "DD/MM/YYYY"
                                  )}
                                </label>
                              </div>
                            </div>
                            <div className="form-row">
                              <div className="form-group col-md-6">
                                <input
                                  onChange={e =>
                                    this.handeChangleMark(e, index)
                                  }
                                  type="text"
                                  placeholder="Enter mark"
                                  className="form-control"
                                />
                              </div>
                              <div className="form-group col-md-6">
                                <div className="form-check">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    defaultChecked={false}
                                    onChange={e =>
                                      this.handleChangeRequired(e, index)
                                    }
                                  />
                                  <label
                                    className={`${
                                      messageErr !== "" ? "text-danger" : ""
                                    } form-check-label`}
                                    htmlFor="gridCheck"
                                  >
                                    Mandatory
                                  </label>
                                </div>
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
                                {listCourseChoosen_ver2.map(
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
                                (*) Course order in the training
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
        <div className="col-xl-12 new-training mb-4">
          <div className="featured-courses courses-wrap">
            <div className="row  ">
              <div className="col-12 col-md-6  ">
                <div
                  className="course-content"
                  onClick={this.handleShowPopupListCourse}
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
        <div className="form-group col-xl-12">
          <button
            className="btn bg-root"
            style={{ width: "100%" }}
            onClick={this.handleStepTwo}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loading color="#ffffff" classOption="align-center-spinner" />
            ) : (
              "SAVE & CONTINUE"
            )}
          </button>
        </div>
      </div>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Step2);
