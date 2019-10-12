import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import _ from "lodash";
import { getCourseByTraining, addCourseModule } from "redux/action/course";
import { getModuleByCourse } from "redux/action/module";
import { getContent, getContentByModule, updateContent } from "redux/action/content";
import ListContent from "pages/NewTraining/PopupListContent";
import AuthStorage from "utils/AuthStorage";
import Select from "react-select";
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
        getContentByModule,
        updateContent
      },
      dispatch
    )
  };
};
class Step4 extends Component {
  state = {
    currentCourse: {},
    currentModule: {},
    isShow: false,
    listCourse: [],
    listModule: [],
    isFetchContent: false,
    listContentChoosen: [],
    isUpdateContent: false,
  };
  componentDidMount() {
    const { listCourseFitler, loadingListCourseFilter } = this.props.store;
    if (!loadingListCourseFilter && listCourseFitler.length > 0) {
      this.handleProcessData(listCourseFitler);
      this.handleGetModuleByCourse(listCourseFitler[0].courses[0]._id);
    }
    //Get All Content
    this.handleGetContentByUserId(AuthStorage.userInfo._id);
  }

  handleGetModuleByCourse = course_id => {
    const { getModuleByCourse } = this.props.action;
    const payload = { id: course_id };
    getModuleByCourse(payload, () => {
      const { filterModuleByCourse } = this.props.store;
      let listModule = [];
      filterModuleByCourse.map((item, index) => {
        listModule.push({ value: item.modules[0], label: item.modules[0].name });
      })
      const { isFetchContent } = this.state;
      if (!isFetchContent) {
        this.handleGetContentByModule(filterModuleByCourse[0].modules[0]._id);
        this.setState({ isFetchContent: true })
      }
      this.setState({ listModule: listModule })
    });
  };

  handleGetContentByUserId = (id) => {
    const { getContent } = this.props.action;
    const payload = { id };
    getContent(payload, () => { });
  };

  handleGetContentByModule = module_id => {
    const { getContentByModule } = this.props.action;
    const payload = { id: module_id };
    getContentByModule(payload, () => { });
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

  handleProcessData = (listCourseFitler) => {
    let listCourse = [];
    listCourseFitler.map((item, index) => {
      listCourse.push({
        value: item.courses[0],
        label: item.courses[0].name
      });
    });
    this.setState({
      currentCourse: listCourseFitler[0].courses[0],
      listCourse
    });
  }

  handleChangeCourse_ver2 = options => {
    if (!_.isNull(options)) {
      this.handleGetModuleByCourse(options.value._id);
      this.setState({ currentCourse: options.value, isUpdateContent: false });
    }
  };

  handleShowContent_ver2 = options => {
    this.handleGetContentByModule(options.value._id);
    this.setState({ currentModule: options.value, isUpdateContent: false });
  };

  handleShowListContent_ver2 = () => {
    this.setState({ isShow: !this.state.isShow });
  };

  handleAddContent = (content) => {
    let { listContentChoosen } = this.state;
    const index = _.findIndex(listContentChoosen, item =>
      _.isEqual(item, content)
    );
    if (index === -1) {
      listContentChoosen.push(content);
      this.setState({
        listContentChoosen: listContentChoosen
      });
      return true
    }
    else {
      return false
    }
  }

  handleUpdateContentForModule = () => {
    const { listContentChoosen } = this.state;
    listContentChoosen.map( async (item, index) => {
      this.handleUpdateContent(item);
      if (index === listContentChoosen.length - 1) {
        const { currentModule } = this.state;
        await this.handleGetContentByModule(currentModule._id);
        this.setState({ isUpdateContent: true, listContentChoosen: [] })
      }
    })
  }

  handleUpdateContent = content => {
    const { currentModule } = this.state;
    let modules = content.modules;
    modules.push(currentModule);
    const payload = {
      id: content._id,
      modules: modules
    };
    const { updateContent } = this.props.action;
    updateContent(payload);
  };

  handleRemoveContent = (index) => {
    let { listContentChoosen } = this.state;
    listContentChoosen.splice(index, 1);
    this.setState({ listContentChoosen });
  }

  render() {
    const {
      listContentByModule,
      loadingListContentByModule,
      loadingListContent
    } = this.props.store;
    const { isShow, currentModule, listCourse, listModule, listContentChoosen, isUpdateContent } = this.state;
    return (
      <div className="row">
        {!loadingListContent && <ListContent
          isShow={isShow}
          currentModule={currentModule}
          handleShowListContent={this.handleShowListContent_ver2}
          handleAddContent={this.handleAddContent}
        />}

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
        {listCourse.length > 0 && (
          <div className="col-xl-6 list-course mb-3">
            <Select
              className="basic-single"
              classNamePrefix="select"
              isSearchable={true}
              onChange={this.handleChangeCourse_ver2}
              options={listCourse}
              defaultValue={listCourse[0]}
              isClearable={true}
              noOptionsMessage={inputValue => "No course found"}
              placeholder="-- Select course --"
            />
          </div>
        )}
        {listModule.length > 0 && (
          <div className="col-xl-6 list-course mb-3">
            <Select
              className="basic-single"
              classNamePrefix="select"
              isSearchable={true}
              onChange={this.handleShowContent_ver2}
              options={listModule}
              defaultValue={listModule[0]}
              isClearable={true}
              noOptionsMessage={inputValue => "No module found"}
              placeholder="-- Select module --"
            />
          </div>
        )}
        {isUpdateContent && (
          <div className="col-xl-12">
            <label className="text-success">Update successfully content</label>
          </div>
        )}
        <div className="col-xl-12">
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name Course</th>
                <th>Type</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {listContentChoosen.length > 0 && listContentChoosen.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.name}</td>
                    <td>{item.type}</td>
                    <td>
                      <button className="btn bg-root" type="button">
                        Detail
                      </button>
                      <button className="btn btn-danger ml-3" type="button" onClick={() => this.handleRemoveContent(index)}>Remove</button>
                    </td>
                  </tr>
                )
              })}
              {!loadingListContentByModule && listContentByModule.length > 0 ?
                listContentByModule.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.name}</td>
                      <td>{item.type}</td>
                      <td>
                        <button className="btn bg-root" type="button">
                          Detail
                        </button>
                      </td>
                    </tr>
                  )
                }) : (
                  <tr>
                    <td colSpan="3">
                      <button
                        onClick={() =>
                          this.handleShowListContent_ver2()
                        }
                        className="btn bg-root"
                      >
                        Add content
                        </button>
                    </td>
                  </tr>
                )}
            </tbody>
          </table>
        </div>
        {listContentByModule.length === 0 && (
          <div className="form-group col-xl-12">
            <button className="btn bg-root" type="button" onClick={this.handleUpdateContentForModule} style={{ width: "100%" }}>
              UPDATE CONTENT FOR MODULE
          </button>
          </div>
        )}
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
