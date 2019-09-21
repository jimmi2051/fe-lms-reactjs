import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import _ from "lodash";
function mapStateToProps(state) {
  return {
    store: {
      isCreatedTraining: state.isCreatedTraining.isCreatedTraining.data,
      loadingCreatedTraining: state.isCreatedTraining.isCreatedTraining.loading,
      isCreatedModule: state.isCreatedModule.isCreatedModule.data,
      loadingCreatedModule: state.isCreatedModule.isCreatedModule.loading,
      listModule: state.isCreatedModule.listModule.data,
      loadingListModule: state.isCreatedModule.listModule.loading,
      isCreatedCourse: state.isCreatedCourse.isCreatedCourse.data,
      loadingCreatedCourse: state.isCreatedCourse.isCreatedCourse.loading,
      listCourse: state.isCreatedCourse.listCourse.data,
      loadingListCourse: state.isCreatedCourse.listCourse.loading
    }
  };
}

const mapDispatchToProps = dispatch => {
  return {
    action: bindActionCreators({}, dispatch)
  };
};
class Step2 extends Component {
  state = {
    createdCourse: false,
    isShow: false,
    courseActived: {},
    listCourseChoosen: [],
    courseChoosenActived: {}
  };
  componentWillReceiveProps(nextProps) {
    const { isCreatedCourse } = nextProps.store;
    if (!this.state.createdCourse && !_.isUndefined(isCreatedCourse.id)) {
      this.setState({ createdCourse: true });
    }
  }
  handleSubmit = () => {
    const { title } = this.refs;
    this.props.handleStepOne(title.value);
  };
  handleShowPopup = () => {
    const { isShow } = this.state;
    this.setState({ isShow: !isShow });
  };

  handleAddCourseToPath = () => {
    let { listCourseChoosen, courseActived } = this.state;
    const index = _.findIndex(listCourseChoosen, item =>
      _.isEqual(item, courseActived)
    );
    if (index === -1) {
      listCourseChoosen.push(courseActived);
      this.setState({
        listCourseChoosen: listCourseChoosen,
        courseActived: {}
      });
    }
  };

  handleRemoveCourseToPath = () => {
    let { listCourseChoosen, courseChoosenActived } = this.state;
    const index = _.findIndex(listCourseChoosen, item =>
      _.isEqual(item, courseChoosenActived)
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
      _.isEqual(item, courseChoosenActived)
    );
    if (index > 0) {
      const courseTemp = listCourseChoosen[index];
      listCourseChoosen[index] = listCourseChoosen[index - 1];
      listCourseChoosen[index - 1] = courseTemp;
      this.setState({ listCourseChoosen: listCourseChoosen });
    }
  };

  handleDownModule = () => {
    let { listCourseChoosen, courseChoosenActived } = this.state;
    const index = _.findIndex(listCourseChoosen, item =>
      _.isEqual(item, courseChoosenActived)
    );
    if (index < listCourseChoosen.length - 1) {
      const courseTemp = listCourseChoosen[index];
      listCourseChoosen[index] = listCourseChoosen[index + 1];
      listCourseChoosen[index + 1] = courseTemp;
      this.setState({ listCourseChoosen: listCourseChoosen });
    }
  };
  render() {
    const { createdCourse, listCourseChoosen } = this.state;
    const { listCourse, loadingListCourse } = this.props.store;
    return (
      <div className="row">
        <div className="col-xl-12">
          {createdCourse && (
            <h3 className="alert-success pl-3">COURSE HAVE BEEN CREATED</h3>
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
        <div className="col-xl-5">
          <label>List course available</label>
          <ul>
            {!loadingListCourse &&
              listCourse.map((item, index) => {
                return (
                  <li
                    key={index}
                    onClick={() => {
                      this.handleActiveCourse(item);
                    }}
                    style={{ cursor: "pointer" }}
                    className={
                      _.isEqual(this.state.courseActived, item) &&
                      "alert-success"
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
                      this.handleActiveCourseChoosen(item);
                    }}
                    className={
                      _.isEqual(this.state.courseChoosenActived, item) &&
                      "alert-success"
                    }
                    style={{ cursor: "pointer" }}
                  >
                    {item.name}
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
