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
    const { createdCourse, listCourseChoosen, isShow, isShowListCourse } = this.state;
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
          <PopupListCourse isShow={isShowListCourse} listCourseByUser={listCourseByUser} handleShowPopup={this.handleShowPopupListCourse}/>
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
            CONTINUE
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
