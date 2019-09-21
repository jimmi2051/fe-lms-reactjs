import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Header from "components/Layout/Header";
import CKEditor from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import PopupNewModule from "pages/NewTraining/PopupNewModule";
import { createTraining } from "redux/action/training";
import { UploadFile } from "utils/UploadImage.js";
import { createModule, getModule } from "redux/action/module.js";
import { createCourse, getCourse } from "redux/action/course.js";
import _ from "lodash";
import Step1 from "pages/NewTraining/Step1";
import Step2 from "pages/NewTraining/Step2";
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
    action: bindActionCreators(
      { createTraining, createModule, getModule, createCourse, getCourse },
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
    listModuleChoosen: [],
    moduleActived: {},
    moduleChoosenActived: {},
    createdCourse: false
  };
  componentDidMount() {
    this.handleGetListModule();
  }
  //#region Handle redux
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

  //Must improve level without hardcode
  handleCreateTraining = (name, level, description, thumbnail) => {
    const payload = { name, level, description, thumbnail };
    const { createTraining } = this.props.action;
    createTraining(payload, () => {
      const { isCreatedTraining } = this.props.store;
      if (!_.isUndefined(isCreatedTraining.id)) {
        this.setState({ step: 2 });
      }
    });
  };
  //Handle create new module
  handleCreateModule = (name, description, thumbnail) => {
    const payload = { name, description, thumbnail };
    const { createModule } = this.props.action;
    createModule(payload, () => {
      const { isCreatedModule } = this.props.store;
      if (!_.isUndefined(isCreatedModule.id)) {
        this.handleGetListModule();
        this.setState({ createdModule: true });
      }
    });
  };

  //Handle create new module
  handleCreateCourse = (name, description, thumbnail) => {
    const payload = { name, description, thumbnail };
    const { createCourse } = this.props.action;
    createCourse(payload, () => {
      const { isCreatedCourse } = this.props.store;
      if (!_.isUndefined(isCreatedCourse.id)) {
        this.handleGetListCourse();
        this.setState({ createdCourse: true });
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
  handleStepOne = async title => {
    const { description, fileToUpload } = this.state;
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
    this.handleCreateTraining(title, "1", description, thumbnail);
  };

  handleStepTwo = () => {
    this.setState({ step: 3 });
  };
  handleShowPopup = () => {
    const { isShow } = this.state;
    this.setState({ isShow: !isShow });
  };

  handleChangeDescription = data => {
    this.setState({ description: data });
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
  //#endregion

  render() {
    const { isShow, createdModule, listModuleChoosen } = this.state;
    const { listModule, loadingListModule } = this.props.store;

    return (
      <div className="page-header">
        <Header titleHeader="Course Page" />
        <PopupNewModule
          isShow={isShow}
          handleShowPopup={this.handleShowPopup}
          handleCreateModule={this.handleCreateModule}
          UploadFile={UploadFile}
        />
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="breadcrumbs">
                <ul className="flex flex-wrap align-items-center p-0 m-0">
                  <li>
                    <a href="#">
                      <i className="fa fa-home"></i> Home
                    </a>
                  </li>
                  <li>Courses</li>
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
                  {/* <p className="card-text"> */}
                  <ul className="card-text">
                    <li className={`${this.state.step === 1 && "bg-root"}`}>
                      Description
                    </li>
                    <li className={`${this.state.step === 2 && "bg-root"}`}>
                      Learning Path Manage
                    </li>
                    <li className={`${this.state.step === 3 && "bg-root"}`}>
                      Activities
                    </li>
                  </ul>
                  {/* </p> */}
                </div>
              </div>
            </div>
            <div className="col-xl-8">
              {this.state.step === 3 && (
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
              )}
              {this.state.step === 2 && (
                <Step2 />
                // This is for module->>>
                // <div className="row">
                //   <div className="col-xl-12">
                //     {createdModule && (
                //       <h3 className="alert-success pl-3">
                //         MODULE HAVE BEEN CREATED
                //       </h3>
                //     )}
                //     <div className="form-group" style={{ width: "30%" }}>
                //       <button
                //         type="button"
                //         className="form-control btn bg-root"
                //         onClick={this.handleShowPopup}
                //       >
                //         Add new module
                //       </button>
                //     </div>
                //   </div>
                //   <div className="col-xl-5">
                //     <label>List module available</label>
                //     <ul>
                //       {!loadingListModule &&
                //         listModule.map((item, index) => {
                //           return (
                //             <li
                //               key={index}
                //               onClick={() => {
                //                 this.handleActiveModule(item);
                //               }}
                //               style={{ cursor: "pointer" }}
                //               className={
                //                 _.isEqual(this.state.moduleActived, item) &&
                //                 "alert-success"
                //               }
                //             >
                //               {item.name}
                //             </li>
                //           );
                //         })}
                //     </ul>
                //   </div>
                //   <div className="form-group col-xl-2">
                //     <button
                //       className="form-control"
                //       type="button"
                //       onClick={this.handleAddModuleToPath}
                //     >
                //       Add
                //     </button>
                //     <button
                //       className="form-control"
                //       type="button"
                //       onClick={this.handleRemoveModuleToPath}
                //     >
                //       Remove
                //     </button>
                //     <button
                //       className="form-control"
                //       type="button"
                //       onClick={this.handleUpModule}
                //     >
                //       Up
                //     </button>
                //     <button
                //       className="form-control"
                //       type="button"
                //       onClick={this.handleDownModule}
                //     >
                //       Down
                //     </button>
                //   </div>
                //   <div className="col-xl-5">
                //     <label>Module choosen</label>
                //     <ul>
                //       {listModuleChoosen.length > 0 &&
                //         listModuleChoosen.map((item, index) => {
                //           return (
                //             <li
                //               key={index}
                //               onClick={() => {
                //                 this.handleActiveModuleChoosen(item);
                //               }}
                //               className={
                //                 _.isEqual(
                //                   this.state.moduleChoosenActived,
                //                   item
                //                 ) && "alert-success"
                //               }
                //               style={{ cursor: "pointer" }}
                //             >
                //               {item.name}
                //             </li>
                //           );
                //         })}
                //     </ul>
                //   </div>
                //   <div className="form-group col-xl-12">
                //     <button
                //       className="btn bg-root"
                //       style={{ width: "100%" }}
                //       onClick={this.handleStepTwo}
                //     >
                //       CONTINUE
                //     </button>
                //   </div>
                // </div>
              )}
              {this.state.step === 1 && (
                <Step1
                  handleChangeDescription={this.handleChangeDescription}
                  fileSelectHandler={this.fileSelectHandler}
                  handleStepOne={this.handleStepOne}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewTraining);
