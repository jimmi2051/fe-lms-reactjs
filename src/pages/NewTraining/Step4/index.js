import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import _ from "lodash";
import { getCourseByTraining, addCourseModule } from "redux/action/course";
import { getModuleByCourse } from "redux/action/module";
import AuthStorage from "utils/AuthStorage";
function mapStateToProps(state) {
  return {
    store: {
      isCreatedTraining: state.isCreatedTraining.isCreatedTraining.data,
      loadingCreatedTraining: state.isCreatedTraining.isCreatedTraining.loading,
      listCourseFitler: state.listCourseFitler.listCourseFitler.data,
      loadingListCourseFilter: state.listCourseFitler.listCourseFitler.loading,
      isCreatedCourseModule: state.listCourseFitler.isCreatedCourseModule.data
    }
  };
}

const mapDispatchToProps = dispatch => {
  return {
    action: bindActionCreators(
      { getCourseByTraining, addCourseModule, getModuleByCourse },
      dispatch
    )
  };
};
class Step4 extends Component {
  state = {
    currentCourse: {}
  };
  componentDidMount() {
    const { listCourseFitler, loadingListCourseFilter } = this.props.store;
    if (!loadingListCourseFilter && listCourseFitler.length > 0) {
      this.setState({ currentCourse: listCourseFitler[0] });
      this.handleGetModuleByCourse(listCourseFitler[0]._id);
    }
  }
  handleGetModuleByCourse = course_id => {
    const { getModuleByCourse } = this.props.action;
    const payload = { id: course_id };
    getModuleByCourse(payload);
  };
  render() {
    const { listCourseFitler, loadingListCourseFilter } = this.props.store;
    return (
      <div className="row">
        <div className="col-xl-12">
          <div className="form-group" style={{ width: "30%" }}>
            <button
              type="button"
              className="form-control btn bg-root"
              onClick={this.handleShowPopup}
            >
              Add new content
            </button>
          </div>
        </div>
        <div className="col-xl-12">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name Course</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {!loadingListCourseFilter &&
                listCourseFitler.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td>{item.courses[0].id}</td>
                      <td>{item.courses[0].name}</td>
                      <td>
                        <button
                          type="button"
                          onClick={() =>
                            this.handleChangeCourse(item.courses[0])
                          }
                          className="btn"
                        >
                          Detail
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
          <table className="table">
            <thead>
              <tr>
                <td>Module</td>
                <td>Action</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>TEST MODULE 1</td>
                <td>
                  <button className="btn bg-root mr-3">
                    Show content choosen
                  </button>
                  <button className="btn bg-root">Add content</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="form-group col-xl-12">
          <button className="btn bg-root" style={{ width: "100%" }}>
            DONE
          </button>
        </div>
      </div>
    );
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Step4);
