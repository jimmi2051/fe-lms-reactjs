import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Header from "components/Layout/Header";
import { createTraining, getAllCategory } from "redux/action/training";
import { UploadFile } from "utils/UploadImage.js";
import {
  createModule,
  getModule,
  getModuleByUser
} from "redux/action/module.js";
import {
  createCourse,
  getCourse,
  getCourseByUser
} from "redux/action/course.js";
import _ from "lodash";
import Step1 from "pages/NewTraining/Step1";
import Step2 from "pages/NewTraining/Step2";
import Step3 from "pages/NewTraining/Step3";
import Step4 from "pages/NewTraining/Step4";
import AuthStorage from "utils/AuthStorage";
import { ToastContainer } from "react-toastr";
import { Link } from "react-router-dom";
let toastr;

function mapStateToProps(state) {
  return {
    store: {
      isCreatedTraining: state.isCreatedTraining.isCreatedTraining.data,
      loadingCreatedTraining: state.isCreatedTraining.isCreatedTraining.loading,
      isCreatedModule: state.isCreatedModule.isCreatedModule.data,
      loadingCreatedModule: state.isCreatedModule.isCreatedModule.loading,
      isCreatedCourse: state.isCreatedCourse.isCreatedCourse.data,
      loadingCreatedCourse: state.isCreatedCourse.isCreatedCourse.loading,
      categoryAll: state.trainingAll.categoryAll.data,
      loadingCategoryAll: state.trainingAll.categoryAll.loading
    }
  };
}

const mapDispatchToProps = dispatch => {
  return {
    action: bindActionCreators(
      {
        createTraining,
        createModule,
        getModule,
        createCourse,
        getCourse,
        getCourseByUser,
        getModuleByUser,
        getAllCategory
      },
      dispatch
    )
  };
};

class NewTraining extends Component {
  state = {
    step: 1,
    isShow: false,
    description: "",
    fileToUpload: [],
    createdModule: false,
    createdCourse: false,
    level: "3",
    trainingCreated: "",
    idxCategory: "-1"
  };
  componentDidMount() {
    this.handleGetCategory();
  }
  //#region Handle redux
  //Handle get list category
  handleGetCategory = () => {
    const payload = {};
    const { getAllCategory } = this.props.action;
    getAllCategory(payload);
  };
  //Handle get list module
  handleGetListModule = () => {
    const payload = {};
    const { getModule } = this.props.action;
    getModule(payload, () => {});
  };
  //Handle get list Course
  handleGetListCourse = () => {
    const payload = {};
    const { getCourse } = this.props.action;
    getCourse(payload, () => {});
  };

  handleGetListCourseByUser = userId => {
    const payload = { id: userId };
    const { getCourseByUser } = this.props.action;
    getCourseByUser(payload, () => {});
  };

  handleGetListModuleByUser = userId => {
    const payload = { id: userId };
    const { getModuleByUser } = this.props.action;
    getModuleByUser(payload, () => {});
  };

  //Must improve level without hardcode
  handleCreateTraining = (
    name,
    subTitle,
    level,
    description,
    thumbnail,
    users,
    categorytrainings,
    callBack
  ) => {
    const payload = {
      name,
      subTitle,
      level,
      description,
      thumbnail,
      users,
      categorytrainings
    };
    const { createTraining } = this.props.action;
    createTraining(payload, () => {
      const { isCreatedTraining } = this.props.store;
      if (!_.isUndefined(isCreatedTraining.id)) {
        this.setState({ trainingCreated: isCreatedTraining });
        this.notifySuccess(
          "Nofitication",
          `Training ${isCreatedTraining.name} has been created successfully.`
        );
        this.setState({ step: 2 });
      } else {
        this.notifyError(
          "Nofitication",
          "Error! Create training failed. Please wait a few minutes and try again. Thanks"
        );
      }
      if (typeof callBack === "function") {
        callBack();
      }
    });
  };
  //Handle create new module
  handleCreateModule = (name, description, thumbnail, users, callBack) => {
    const payload = { name, description, thumbnail, users };
    const { createModule } = this.props.action;
    createModule(payload, () => {
      const { isCreatedModule } = this.props.store;
      if (!_.isUndefined(isCreatedModule._id)) {
        this.handleGetListModuleByUser(AuthStorage.userInfo._id);
        this.notifySuccess(
          "Nofitication",
          `Module ${isCreatedModule.name} has been created successfully.`
        );
      } else {
        this.notifyError(
          "Nofitication",
          "Error! Create module failed. Please wait a few minutes and try again. Thanks"
        );
      }
      if (typeof callBack === "function") {
        callBack();
      }
    });
  };

  //Handle create new module
  handleCreateCourse = (name, description, thumbnail, user, callBack) => {
    const payload = { name, description, thumbnail, user };
    const { createCourse } = this.props.action;
    createCourse(payload, () => {
      const { isCreatedCourse } = this.props.store;
      if (!_.isUndefined(isCreatedCourse.id)) {
        this.handleGetListCourseByUser(AuthStorage.userInfo._id);
        this.notifySuccess(
          "Nofitication",
          `Course ${isCreatedCourse.name} has been created successfully.`
        );
      } else {
        this.notifyError(
          "Nofitication",
          "Error! Something when wrong. Please wait a few minutes and try again. Thanks"
        );
      }
      if (typeof callBack === "function") {
        callBack();
      }
    });
  };

  //#endregion

  //Handle selectfile
  fileSelectHandler = e => {
    let files = e.target.files;
    let { fileToUpload } = this.state;
    fileToUpload.push(files[0]);
    this.setState({ fileToUpload: fileToUpload });
  };

  //#region Helper
  handleStepOne = async (title, subTitle, callBack) => {
    const { description, fileToUpload, level, idxCategory } = this.state;
    if (idxCategory === "-1" || title === "") {
      this.notifyError(
        "Nofitication",
        "Error! Please enter full field (*). It is required."
      );
      if (typeof callBack === "function") {
        callBack();
      }
    } else {
      const { categoryAll } = this.props.store;
      const categoryCurrent = categoryAll[idxCategory];
      let thumbnail = {};
      if (fileToUpload.length > 0) {
        let data = new FormData();
        data.append("files", fileToUpload[0]);
        await UploadFile(data)
          .then(res => {
            return res.json();
          })
          .then(result => {
            thumbnail = result;
          });
      }
      this.handleCreateTraining(
        title,
        subTitle,
        level,
        description,
        thumbnail,
        AuthStorage.userInfo,
        categoryCurrent,
        callBack
      );
    }
  };

  handleStepTwo = () => {
    this.setState({ step: 3 });
  };
  handleStepThree = () => {
    this.setState({ step: 4 });
  };
  handleShowPopup = () => {
    const { isShow } = this.state;
    this.setState({ isShow: !isShow });
  };

  handleChangeDescription = data => {
    this.setState({ description: data });
  };

  handleChangeLevel = level => {
    this.setState({ level });
  };

  notifySuccess = (title, content) => {
    toastr.success(content, title, {
      closeButton: true
    });
  };
  notifyError = (title, content) => {
    toastr.error(content, title, {
      closeButton: true
    });
  };

  handleChangeCategory = idxCategory => {
    this.setState({ idxCategory });
  };

  //#endregion

  render() {
    const { categoryAll, loadingCategoryAll } = this.props.store;
    return (
      <div className="page-header new-training-page">
        <ToastContainer
          ref={ref => (toastr = ref)}
          className="toast-top-right"
        />
        <Header titleHeader="New Training Page" />
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="breadcrumbs">
                <ul className="flex flex-wrap align-items-center p-0 m-0">
                  <li>
                    <Link to="/">
                      <i className="fa fa-home"></i> Home
                    </Link>
                  </li>
                  <li>New Training</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-xl-4">
              <div className="card mb-3">
                <div className="card-header text-white  bg-root">
                  Create Training
                </div>
                <div className="card-body">
                  <h5 className="card-title">Step by step</h5>
                  <ul className="card-text">
                    <li className={`${this.state.step === 1 && "bg-root"}`}>
                      Description
                    </li>
                    <li className={`${this.state.step === 2 && "bg-root"}`}>
                      Learning Path Manage
                    </li>
                    <li className={`${this.state.step === 3 && "bg-root"}`}>
                      Manage Module of Course
                    </li>
                    <li className={`${this.state.step === 4 && "bg-root"}`}>
                      Activites
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-xl-8">
              {this.state.step === 4 && (
                <Step4
                  notifySuccess={this.notifySuccess}
                  notifyError={this.notifyError}
                />
              )}
              {this.state.step === 3 && (
                <Step3
                  handleCreateModule={this.handleCreateModule}
                  handleGetListModule={this.handleGetListModule}
                  handleGetListModuleByUser={this.handleGetListModuleByUser}
                  handleStepThree={this.handleStepThree}
                  notifySuccess={this.notifySuccess}
                  notifyError={this.notifyError}
                  trainingCreated={this.state.trainingCreated}
                />
              )}
              {this.state.step === 2 && (
                <Step2
                  handleCreateCourse={this.handleCreateCourse}
                  handleStepTwo={this.handleStepTwo}
                  handleGetListCourse={this.handleGetListCourse}
                  handleGetListCourseByUser={this.handleGetListCourseByUser}
                  notifySuccess={this.notifySuccess}
                  notifyError={this.notifyError}
                  trainingCreated={this.state.trainingCreated}
                />
              )}
              {this.state.step === 1 && (
                <Step1
                  handleChangeDescription={this.handleChangeDescription}
                  fileSelectHandler={this.fileSelectHandler}
                  handleStepOne={this.handleStepOne}
                  handleChangeLevel={this.handleChangeLevel}
                  loadingCategoryAll={loadingCategoryAll}
                  categoryAll={categoryAll}
                  idxCategory={this.state.idxCategory}
                  handleChangeCategory={this.handleChangeCategory}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewTraining);
