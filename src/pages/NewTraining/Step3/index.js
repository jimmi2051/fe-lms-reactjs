import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import PopupNewModule from "pages/NewTraining/PopupNewModule";
import { UploadFile } from "utils/UploadImage.js";
import _ from "lodash";
import { getCourseByTraining, addCourseModule } from "redux/action/course";
import { getModuleByCourse, removeModuleByCourse } from "redux/action/module";
import AuthStorage from "utils/AuthStorage";
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
      loadingModuleByCourse: state.listModule.filterModuleByCourse.loading
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
class Step3 extends Component {
  state = {
    createdModule: false,
    isShow: false,
    moduleActived: {},
    listModuleChoosen: [],
    moduleChoosenActived: {},
    currentCourse: {},
    listModuleRemove: [],
    moduleChoosenActivedExist: {}
  };

  componentDidMount() {
    this.props.handleGetListModuleByUser(AuthStorage.userInfo._id);
    const { isCreatedTraining } = this.props.store;
    if (_.isUndefined(isCreatedTraining._id)) {
      console.log("Error>>>> your training is invalid");
      this.handleFilterListCourse("5d879c4bc077dc0017034b09");
    } else {
      //this is hardcode must to fix
      this.handleFilterListCourse(isCreatedTraining._id);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { isCreatedModule } = nextProps.store;
    if (!this.state.createdModule && !_.isUndefined(isCreatedModule._id)) {
      this.setState({ createdModule: true });
    }
  }

  handleFilterListCourse = training_id => {
    const payload = { id: training_id };
    const { getCourseByTraining } = this.props.action;
    getCourseByTraining(payload, () => {
      this.setState({
        currentCourse: this.props.store.listCourseFitler[0].courses[0]
      });
    });
  };

  handleCreateCourseModule = (courses, position, modules) => {
    const { addCourseModule } = this.props.action;
    const payload = { courses, position, modules };
    addCourseModule(payload, () => {});
  };

  handleSubmit = () => {
    const { title } = this.refs;
    this.props.handleStepTwo(title.value);
  };
  handleShowPopup = () => {
    const { isShow } = this.state;
    this.setState({ isShow: !isShow });
  };

  handleAddModuleToPath = () => {
    let { listModuleChoosen, moduleActived } = this.state;
    const { filterModuleByCourse, loadingModuleByCourse } = this.props.store;
    let indexChoosen = -2;
    if (!loadingModuleByCourse) {
      indexChoosen = _.findIndex(filterModuleByCourse, item =>
        _.isEqual(item.modules[0]._id, moduleActived._id)
      );
    }

    const index = _.findIndex(listModuleChoosen, item =>
      _.isEqual(item, moduleActived)
    );

    if (
      ((indexChoosen !== -2 && indexChoosen === -1) || indexChoosen === -2) &&
      index === -1
    ) {
      listModuleChoosen.push(moduleActived);
      this.setState({
        listModuleChoosen: listModuleChoosen,
        moduleActived: {}
      });
    }
  };

  handleGetModuleByCourse = course_id => {
    const { getModuleByCourse } = this.props.action;
    const payload = { id: course_id };
    getModuleByCourse(payload);
  };

  handleRemoveModuleToPath = () => {
    let {
      listModuleChoosen,
      moduleChoosenActived,
      moduleChoosenActivedExist
    } = this.state;
    const index = _.findIndex(listModuleChoosen, item =>
      _.isEqual(item, moduleChoosenActived)
    );
    if (index > -1) {
      listModuleChoosen.splice(index, 1);
      this.setState({
        listModuleChoosen: listModuleChoosen,
        moduleChoosenActived: {}
      });
    }
    this.handleRemoveModuleExists(moduleChoosenActivedExist);
  };

  handleActiveModule = module => {
    this.setState({ moduleActived: module });
  };

  handleActiveModuleChoosen = module => {
    this.setState({ moduleChoosenActived: module });
  };

  handleUpModule = () => {
    let { listModuleChoosen, moduleChoosenActived } = this.state;
    const index = _.findIndex(listModuleChoosen, item =>
      _.isEqual(item, moduleChoosenActived)
    );
    if (index > 0) {
      const moduleTemp = listModuleChoosen[index];
      listModuleChoosen[index] = listModuleChoosen[index - 1];
      listModuleChoosen[index - 1] = moduleTemp;
      this.setState({ listModuleChoosen: listModuleChoosen });
    }
  };

  handleDownModule = () => {
    let { listModuleChoosen, moduleChoosenActived } = this.state;
    const index = _.findIndex(listModuleChoosen, item =>
      _.isEqual(item, moduleChoosenActived)
    );
    if (index < listModuleChoosen.length - 1) {
      const moduleTemp = listModuleChoosen[index];
      listModuleChoosen[index] = listModuleChoosen[index + 1];
      listModuleChoosen[index + 1] = moduleTemp;
      this.setState({ listModuleChoosen: listModuleChoosen });
    }
  };

  handleChangeCourse = course => {
    this.handleGetModuleByCourse(course._id);

    this.setState({ currentCourse: course });
  };

  handleStepThree = () => {
    const { listModuleChoosen, currentCourse } = this.state;
    const courses = [currentCourse];
    listModuleChoosen.map((item, index) => {
      const position = index + 1;
      const modules = [item];
      this.handleCreateCourseModule(courses, position, modules);
    });
    let { listModuleRemove } = this.state;
    if (listModuleRemove.length > 0) {
      const { removeModuleByCourse } = this.props.action;
      listModuleRemove.map((item, index) => {
        const payload = { id: item._id };
        removeModuleByCourse(payload, () => {});
      });
    }
  };

  handleRemoveModuleExists = moduleByCourse => {
    console.log("debug>>>>", moduleByCourse);
    let { listModuleRemove } = this.state;
    const index = _.findIndex(listModuleRemove, item =>
      _.isEqual(item, moduleByCourse)
    );
    if (index === -1) {
      listModuleRemove.push(moduleByCourse);
    }
    this.setState({ listModuleRemove });
  };

  handleActiveModuleChoosenExist = moduleChoosenActivedExist => {
    this.setState({ moduleChoosenActivedExist });
  };

  render() {
    const {
      createdModule,
      listModuleChoosen,
      isShow,
      currentCourse,
      listModuleRemove,
      moduleChoosenActivedExist
    } = this.state;
    const {
      listModuleByUser,
      loadingListModuleByUser,
      listCourseFitler,
      loadingListCourseFilter,
      filterModuleByCourse,
      loadingModuleByCourse
    } = this.props.store;
    return (
      <div className="row">
        <PopupNewModule
          isShow={isShow}
          handleShowPopup={this.handleShowPopup}
          handleCreateModule={this.props.handleCreateModule}
          UploadFile={UploadFile}
        />
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
          {createdModule && (
            <h3 className="alert-success pl-3">MODULE HAVE BEEN CREATED</h3>
          )}
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
        <div className="col-xl-5">
          <label>List module available</label>
          <ul>
            {!loadingListModuleByUser &&
              listModuleByUser.map((item, index) => {
                return (
                  <li
                    key={index}
                    onClick={() => {
                      this.handleActiveModule(item);
                    }}
                    style={{ cursor: "pointer" }}
                    className={
                      _.isEqual(this.state.moduleActived, item)
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
            onClick={this.handleAddModuleToPath}
          >
            Add
          </button>
          <button
            className="form-control"
            type="button"
            onClick={this.handleRemoveModuleToPath}
          >
            Remove
          </button>
          <button
            className="form-control"
            type="button"
            onClick={this.handleUpModule}
          >
            Up
          </button>
          <button
            className="form-control"
            type="button"
            onClick={this.handleDownModule}
          >
            Down
          </button>
        </div>
        <div className="col-xl-5">
          {/* Must improve ->>>> if exists module will be shown in here */}
          <label>Modules of Course "{currentCourse.name}"</label>
          <ul>
            {!loadingModuleByCourse &&
              filterModuleByCourse.map((item, index) => {
                if (
                  _.findIndex(listModuleRemove, moduleRemove =>
                    _.isEqual(moduleRemove, item)
                  ) > -1
                ) {
                  return <></>;
                }
                return (
                  <li
                    key={index}
                    onClick={() => {
                      this.handleActiveModuleChoosenExist(item);
                    }}
                    className={
                      _.isEqual(this.state.moduleChoosenActivedExist, item)
                        ? "alert-success"
                        : ""
                    }
                    style={{ cursor: "pointer" }}
                  >
                    {item.modules[0].name}
                  </li>
                );
              })}
            {listModuleChoosen.length > 0 &&
              listModuleChoosen.map((item, index) => {
                return (
                  <li
                    key={index}
                    onClick={() => {
                      this.handleActiveModuleChoosen(item);
                    }}
                    className={
                      _.isEqual(this.state.moduleChoosenActived, item)
                        ? "alert-success"
                        : ""
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
            onClick={this.handleStepThree}
          >
            UPDATE
          </button>
          <button
            className="btn bg-root"
            style={{ width: "100%" }}
            onClick={this.props.handleStepThree}
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
)(Step3);

// This is for module->>>
