import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import PopupNewModule from "pages/NewTraining/PopupNewModule";
import { UploadFile } from "utils/UploadImage.js";
import _ from "lodash";
import { getCourseByTraining, addCourseModule } from "redux/action/course";
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
      isCreatedCourseModule: state.listCourseFitler.isCreatedCourseModule.data
    }
  };
}

const mapDispatchToProps = dispatch => {
  return {
    action: bindActionCreators(
      { getCourseByTraining, addCourseModule },
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
    currentCourse: {}
  };

  componentDidMount() {
    this.props.handleGetListModuleByUser(AuthStorage.userInfo._id);
    const { isCreatedTraining } = this.props.store;
    if (_.isUndefined(isCreatedTraining)) {
      console.log("Error>>>> your training is invalid");
    } else {
      //this is hardcode must to fix
      this.handleFilterListCourse(isCreatedTraining.id);
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
    const index = _.findIndex(listModuleChoosen, item =>
      _.isEqual(item, moduleActived)
    );
    if (index === -1) {
      listModuleChoosen.push(moduleActived);
      this.setState({
        listModuleChoosen: listModuleChoosen,
        moduleActived: {}
      });
    }
  };

  handleRemoveModuleToPath = () => {
    let { listModuleChoosen, moduleChoosenActived } = this.state;
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
  };

  render() {
    const {
      createdModule,
      listModuleChoosen,
      isShow,
      currentCourse
    } = this.state;
    const {
      listModuleByUser,
      loadingListModuleByUser,
      listCourseFitler,
      loadingListCourseFilter
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
