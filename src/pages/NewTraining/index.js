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
import _ from "lodash";
function mapStateToProps(state) {
  return {
    store: {
      isCreatedTraining: state.isCreatedTraining.isCreatedTraining.data,
      loadingCreatedTraining: state.isCreatedTraining.isCreatedTraining.loading,
      isCreatedModule: state.isCreatedModule.isCreatedModule.data,
      loadingCreatedModule: state.isCreatedModule.isCreatedModule.loading,
      listModule: state.isCreatedModule.listModule.data,
      loadingListModule: state.isCreatedModule.listModule.loading
    }
  };
}

const mapDispatchToProps = dispatch => {
  return {
    action: bindActionCreators(
      { createTraining, createModule, getModule },
      dispatch
    )
  };
};

class NewTraining extends Component {
  state = {
    step: 2,
    isShow: false,
    description: "",
    fileToUpload: [],
    createdModule: false
  };
  componentDidMount() {
    this.handleGetListModule();
  }
  //Handle get list module
  handleGetListModule = () => {
    const payload = {};
    const { getModule } = this.props.action;
    getModule(payload, () => {});
  };
  //Handle selectfile
  fileSelectHandler = e => {
    let files = e.target.files;
    let { fileToUpload } = this.state;
    fileToUpload.push(files[0]);
    this.setState({ fileToUpload: fileToUpload });
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

  handleStepOne = async () => {
    const { title } = this.refs;
    const { description, fileToUpload } = this.state;
    let thumbnail = {};
    let data = new FormData();
    data.append("files", fileToUpload[0]);
    await UploadFile(data)
      .then(res => {
        return res.json();
      })
      .then(result => {
        thumbnail = result;
      });
    this.handleCreateTraining(title.value, "1", description, thumbnail);
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

  render() {
    const { isShow, createdModule } = this.state;
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
                  <p className="card-text">
                    <ul>
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
                  </p>
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
                <div className="row">
                  <div className="col-xl-12">
                    {!createdModule && (
                      <h3 className="alert-success">
                        MODULE HAVE BEEN CREATED
                      </h3>
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
                      {!loadingListModule &&
                        listModule.map((item, index) => {
                          return (
                            <li key={index} value={item.id}>
                              {item.name}
                            </li>
                          );
                        })}
                    </ul>
                  </div>
                  <div className="form-group col-xl-2">
                    <button className="form-control">Add</button>
                    <button className="form-control">Remove</button>
                    <button className="form-control">Up</button>
                    <button className="form-control">Down</button>
                  </div>
                  <div className="col-xl-5">
                    <label>Module choosen</label>
                    <ul>
                      <li>Module 1</li>
                      <li>Module 2</li>
                      <li>Module 3</li>
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
              )}
              {this.state.step === 1 && (
                <div className="row no-gutters">
                  <div className="col-xl-12">
                    <div className="form-group">
                      <label>Title (*)</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter training title here"
                        ref="title"
                      />
                    </div>
                    <div className="form-group">
                      <label>Description</label>
                      <CKEditor
                        className="form-control"
                        editor={ClassicEditor}
                        data="<p>Hello from CKEditor 5!</p>"
                        ref="description"
                        onInit={editor => {
                          // You can store the "editor" and use when it is needed.
                          console.log("Editor is ready to use!", editor);
                        }}
                        onChange={(event, editor) => {
                          const data = editor.getData();
                          this.handleChangeDescription(data);
                          console.log({ event, editor, data });
                        }}
                        onBlur={(event, editor) => {
                          console.log("Blur.", editor);
                        }}
                        onFocus={(event, editor) => {
                          console.log("Focus.", editor);
                        }}
                      />
                    </div>
                    <div className="form-group">
                      <label>Image </label>
                      <input
                        type="file"
                        className="form-control"
                        placeholder="Enter training title here"
                        onChange={this.fileSelectHandler}
                      />
                    </div>
                    <div className="form-group">
                      <label>Required Training</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder=""
                      />
                    </div>
                  </div>
                  <div className="form-group col-xl-12">
                    <button
                      className="btn bg-root"
                      style={{ width: "100%" }}
                      onClick={this.handleStepOne}
                    >
                      CONTINUE
                    </button>
                  </div>
                </div>
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
