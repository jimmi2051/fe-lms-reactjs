import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import PopupNewCourse from "pages/NewTraining/PopupNewCourse";
import { UploadFile } from "utils/UploadImage.js";
import _ from "lodash";
import { addLearningPath } from "redux/action/training";
import AuthStorage from "utils/AuthStorage";
import { Link } from "react-router-dom"
import PopupListCourse from "pages/NewTraining/PopupListCourse";
import moment from "moment";

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
    createdCourse: false,
    isShow: false,
    courseActived: {},
    listCourseChoosen: [],
    courseChoosenActived: {},
    isShowListCourse: true,

    listCourseChoosen_ver2: []

  };
  componentDidMount() {
    // this.props.handleGetListCourse();
    this.props.handleGetListCourseByUser(AuthStorage.userInfo._id);
  }
  componentWillReceiveProps(nextProps) {
    const { isCreatedCourse } = nextProps.store;
    if (!this.state.createdCourse && !_.isUndefined(isCreatedCourse._id)) {
      this.setState({ createdCourse: true });
    }
  }

  handleAddLearningPath = (
    trainings,
    courses,
    position,
    markForCourse,
    isRequired
  ) => {
    const { addLearningPath } = this.props.action;
    const payload = { trainings, courses, position, markForCourse, isRequired };
    addLearningPath(payload, () => {
      // console.log(this.props.store);
    });
  };
  // Version 2
  handleAddCourseToPath_ver2 = (coursePicked) => {
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
        listCourseChoosen_ver2: listCourseChoosen_ver2,
      });
    }
  };

  handleRemoveCourseToPath_ver2 = (coursePicked) => {
    let { listCourseChoosen_ver2 } = this.state;
    const index = _.findIndex(listCourseChoosen_ver2, item =>
      _.isEqual(item.course, coursePicked)
    );
    if (index > -1) {
      listCourseChoosen_ver2.splice(index, 1);
      this.setState({
        listCourseChoosen_ver2: listCourseChoosen_ver2,
      });
    }
  };


  handleSubmit = () => {
    const { title } = this.refs;
    this.props.handleStepOne(title.value);
  };
  handleShowPopup = () => {
    const { isShow } = this.state;
    this.setState({ isShow: !isShow });
  };

  handleShowPopupListCourse = () => {
    const { isShowListCourse } = this.state;
    this.setState({ isShowListCourse: !isShowListCourse });
  };

  handleAddCourseToPath = () => {
    let { listCourseChoosen, courseActived } = this.state;
    const index = _.findIndex(listCourseChoosen, item =>
      _.isEqual(item.course, courseActived)
    );
    if (index === -1) {
      listCourseChoosen.push({
        course: courseActived,
        mark: 0,
        required: false
      });
      this.setState({
        listCourseChoosen: listCourseChoosen,
        courseActived: {}
      });
    }
  };

  handleRemoveCourseToPath = () => {
    let { listCourseChoosen, courseChoosenActived } = this.state;
    const index = _.findIndex(listCourseChoosen, item =>
      _.isEqual(item.course, courseChoosenActived)
    );
    if (index > -1) {
      listCourseChoosen.splice(index, 1);
      this.setState({
        listCourseChoosen: listCourseChoosen,
        courseChoosenActived: {}
      });
    }
  };

  handleActiveCourse = course => {
    this.setState({ courseActived: course });
  };

  handleActiveCourseChoosen = course => {
    this.setState({ courseChoosenActived: course });
  };

  handleUpCourse = () => {
    let { listCourseChoosen, courseChoosenActived } = this.state;
    const index = _.findIndex(listCourseChoosen, item =>
      _.isEqual(item.course, courseChoosenActived)
    );
    if (index > 0) {
      const courseTemp = listCourseChoosen[index];
      listCourseChoosen[index] = listCourseChoosen[index - 1];
      listCourseChoosen[index - 1] = courseTemp;
      this.setState({ listCourseChoosen: listCourseChoosen });
    }
  };

  handleDownCourse = () => {
    let { listCourseChoosen, courseChoosenActived } = this.state;
    const index = _.findIndex(listCourseChoosen, item =>
      _.isEqual(item.course, courseChoosenActived)
    );
    if (index < listCourseChoosen.length - 1) {
      const courseTemp = listCourseChoosen[index];
      listCourseChoosen[index] = listCourseChoosen[index + 1];
      listCourseChoosen[index + 1] = courseTemp;
      this.setState({ listCourseChoosen: listCourseChoosen });
    }
  };

  handleStepTwo = () => {
    const { listCourseChoosen } = this.state;
    const { isCreatedTraining } = this.props.store;
    if (_.isUndefined(isCreatedTraining)) {
    } else {
      const trainings = [isCreatedTraining];
      listCourseChoosen.map((item, index) => {
        const position = index + 1;
        const markForCourse = item.mark;
        const isRequired = item.required;
        const courses = [item.course];
        this.handleAddLearningPath(
          trainings,
          courses,
          position,
          markForCourse,
          isRequired
        );
        if (index === listCourseChoosen.length - 1) {
          this.props.handleStepTwo();
        }
      });
    }
  };

  handleInputMark = (index, mark) => {
    let { listCourseChoosen } = this.state;
    listCourseChoosen[index].mark = mark;
    this.setState({ listCourseChoosen: listCourseChoosen }, () => {
    });
  };

  handleCheckRequired = (index, checked) => {
    let { listCourseChoosen } = this.state;
    listCourseChoosen[index].required = checked;
    this.setState({ listCourseChoosen: listCourseChoosen }, () => {
      // console.log(listCourseChoosen);
    });
  };

  handeChangleMark = (e, index) => {
    this.handleInputMark(index, e.target.value);
  };

  handleChangeRequired = (e, index) => {
    this.handleCheckRequired(index, e.target.checked);
  };

  render() {
    const { createdCourse, listCourseChoosen, isShow, isShowListCourse, listCourseChoosen_ver2 } = this.state;
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
          <PopupListCourse isShow={isShowListCourse}
            listCourseByUser={listCourseByUser}
            handleShowPopup={this.handleShowPopupListCourse}
            handleAddCourseToPath_ver2={this.handleAddCourseToPath_ver2}
          />
        )}
        <div className="col-xl-12">
          {createdCourse && (
            <h3 className="bg-root pl-3">COURSE HAVE BEEN CREATED</h3>
          )}
          <div className="form-group" style={{ width: "30%" }}>
            <button
              type="button"
              className="form-control btn bg-root"
              onClick={this.handleShowPopup}
            >
              Add new course
            </button>
          </div>
        </div>
        {listCourseChoosen_ver2.length > 0 && (
          <div className="col-xl-12 new-training mb-4">
            <div className="featured-courses courses-wrap">
              <div className="row mx-m-25">
                {listCourseChoosen_ver2.map((item, index) => {
                  return (
                    <div className="col-12 col-md-6 px-25">
                      <div className="course-content course-content-active">
                        <figure className="course-thumbnail">
                          <button type="button" className="btn btn-remove alert-danger" onClick={() => { this.handleRemoveCourseToPath_ver2(item.course) }}><i className="fa fa-remove"></i></button>
                          <Link to={`#`}>
                            <img
                              src={_.isEmpty(item.course.thumbnail) ?
                                "https://be-lms.tk/uploads/9ee513ab17ae4d2ca9a7fa3feb3b2d67.png" :
                                `${REACT_APP_URL_API}${item.course.thumbnail.url}`}
                              alt=""
                              height="200px"
                            />
                          </Link>
                        </figure>

                        <div className="course-content-wrap">
                          <header className="entry-header">
                            <h2 className="entry-title">
                              <Link to={`#`}>
                                {item.course.name}
                              </Link>
                            </h2>

                            <div className="entry-meta flex flex-wrap align-items-center">
                              <div className="course-author">
                                <a href="#">
                                  {item.course.users[0].firstName}{" "}
                                  {item.course.users[0].lastName}{" "}
                                </a>
                              </div>
                              <div className="course-date">
                                {moment(item.course.createdAt).format(
                                  "MMM. D, YYYY"
                                )}
                              </div>
                            </div>
                            <div className="form-row">
                              <div className="form-group col-md-6">

                                <input onChange={e => this.handeChangleMark(e, index)} type="text" placeholder="Enter mark" className="form-control" />
                              </div>
                              <div className="form-group col-md-6">
                                <div className="form-check">
                                  <input className="form-check-input" type="checkbox" defaultChecked={false}
                                    onChange={e => this.handleChangeRequired(e, index)} />
                                  <label className="form-check-label" htmlFor="gridCheck">
                                    Mantory
                                </label>
                                </div>
                              </div>
                            </div>
                          </header>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}
        <div className="col-xl-12 new-training">
          <div className="featured-courses courses-wrap">
            <div className="row mx-m-25">
              <div className="col-12 col-md-6 px-25">
                <div className="course-content" onClick={this.handleShowPopupListCourse}>
                  <div className="course-content-wrap">
                    <i className="fa fa-plus"></i>
                    <h3>Add new item</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-5">
          <label>List course available</label>
          <ul>
            {!loadingListCourseUser &&
              listCourseByUser.map((item, index) => {
                return (
                  <li
                    key={index}
                    onClick={() => {
                      this.handleActiveCourse(item);
                    }}
                    style={{ cursor: "pointer" }}
                    className={
                      _.isEqual(this.state.courseActived, item)
                        ? "alert-success"
                        : ""
                    }
                  >
                    {item.name}
                  </li>
                );
              })}
          </ul>
        </div>
        <div className="form-group col-xl-2">
          <button
            className="form-control"
            type="button"
            onClick={this.handleAddCourseToPath}
          >
            Add
          </button>
          <button
            className="form-control"
            type="button"
            onClick={this.handleRemoveCourseToPath}
          >
            Remove
          </button>
          <button
            className="form-control"
            type="button"
            onClick={this.handleUpCourse}
          >
            Up
          </button>
          <button
            className="form-control"
            type="button"
            onClick={this.handleDownCourse}
          >
            Down
          </button>
        </div>
        <div className="col-xl-5">
          <label>Course choosen</label>
          <ul>
            {listCourseChoosen.length > 0 &&
              listCourseChoosen.map((item, index) => {
                return (
                  <li
                    key={index}
                    onClick={() => {
                      this.handleActiveCourseChoosen(item.course);
                    }}
                    className={
                      _.isEqual(this.state.courseChoosenActived, item.course)
                        ? "alert-success"
                        : ""
                    }
                    style={{ cursor: "pointer" }}
                  >
                    {item.course.name}
                    <input
                      placeholder="Enter mark for this course"
                      onChange={e => this.handeChangleMark(e, index)}
                    />
                    <div className="checkbox">
                      <label>
                        <input
                          type="checkbox"
                          defaultChecked={false}
                          onChange={e => this.handleChangeRequired(e, index)}
                        />
                        Required
                      </label>
                    </div>
                  </li>
                );
              })}
          </ul>
        </div>
        <div className="form-group col-xl-12">
          <button
            className="btn bg-root"
            style={{ width: "100%" }}
            onClick={this.handleStepTwo}
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
)(Step2);
