import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import _ from "lodash";
import { getCourseByTraining, addCourseModule } from "redux/action/course";
import { getModuleByCourse } from "redux/action/module";
import { getContent, getContentByModule } from "redux/action/content";
import ListContent from "pages/NewTraining/PopupListContent";
import AuthStorage from "utils/AuthStorage";
function mapStateToProps(state) {
  return {
    store: {
      isCreatedTraining: state.isCreatedTraining.isCreatedTraining.data,
      loadingCreatedTraining: state.isCreatedTraining.isCreatedTraining.loading,
      listCourseFitler: state.listCourseFitler.listCourseFitler.data,
      loadingListCourseFilter: state.listCourseFitler.listCourseFitler.loading,
      isCreatedCourseModule: state.listCourseFitler.isCreatedCourseModule.data,
      filterModuleByCourse: state.listModule.filterModuleByCourse.data,
      loadingModuleByCourse: state.listModule.filterModuleByCourse.loading,
      listContent: state.listContent.listContent.data,
      loadingListContent: state.listContent.listContent.loading,
      listContentByModule: state.listContent.listContentByModule.data,
      loadingListContentByModule: state.listContent.listContentByModule.loading
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
        getContent,
        getContentByModule
      },
      dispatch
    )
  };
};
class Step4 extends Component {
  state = {
    currentCourse: {},
    currentModule: {},
    isShow: false
  };
  componentDidMount() {
    const { listCourseFitler, loadingListCourseFilter } = this.props.store;
    if (!loadingListCourseFilter && listCourseFitler.length > 0) {
      this.setState({ currentCourse: listCourseFitler[0] });
      this.handleGetModuleByCourse(listCourseFitler[0]._id);
    }
    this.handleGetContent();
  }
  handleGetModuleByCourse = course_id => {
    const { getModuleByCourse } = this.props.action;
    const payload = { id: course_id };
    getModuleByCourse(payload);
  };

  handleGetContent = () => {
    const { getContent } = this.props.action;
    const payload = {};
    getContent(payload, () => {});
  };

  handleGetContentByModule = module_id => {
    const { getContentByModule } = this.props.action;
    const payload = { id: module_id };
    getContentByModule(payload, () => {});
  };

  handleChangeCourse = course => {
    this.setState({ currentCourse: course });
    this.handleGetModuleByCourse(course._id);
  };

  handleShowContent = module => {
    this.handleGetContentByModule(module._id);
    this.setState({ currentModule: module });
  };

  handleShowListContent = module => {
    this.setState({ isShow: !this.state.isShow, currentModule: module });
  };

  render() {
    const {
      listCourseFitler,
      loadingListCourseFilter,
      loadingModuleByCourse,
      filterModuleByCourse,
      listContentByModule,
      loadingListContentByModule
    } = this.props.store;
    const { isShow, currentModule } = this.state;
    return (
      <div className="row">
        <ListContent
          isShow={isShow}
          currentModule={currentModule}
          handleShowListContent={this.handleShowListContent}
        />
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
              {!loadingModuleByCourse &&
                filterModuleByCourse.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td>{item.modules[0].name}</td>
                      <td>
                        <button
                          type="button"
                          onClick={() =>
                            this.handleShowContent(item.modules[0])
                          }
                          className="btn bg-root mr-3"
                        >
                          Show content choosen
                        </button>
                        <button
                          onClick={() =>
                            this.handleShowListContent(item.modules[0])
                          }
                          className="btn bg-root"
                        >
                          Add content
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
          <h4>Detail of Module</h4>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {!loadingListContentByModule &&
                listContentByModule.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td>{item.name}</td>
                      <td>
                        <button className="btn bg-root" type="button">
                          Detail
                        </button>
                      </td>
                    </tr>
                  );
                })}
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
