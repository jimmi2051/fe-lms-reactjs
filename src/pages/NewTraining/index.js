import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Header from "components/Layout/Header";
import CKEditor from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import PopupNewModule from "pages/NewTraining/PopupNewModule";
function mapStateToProps(state) {
  return {
    store: {}
  };
}

const mapDispatchToProps = dispatch => {
  return {
    action: bindActionCreators({}, dispatch)
  };
};

class NewTraining extends Component {
  state = {
    step: 1,
    isShow: false
  };
  componentDidMount() {}
  handleStepOne = () => {
    this.setState({ step: 2 });
  };
  handleStepTwo = () => {
    this.setState({ step: 3 });
  };
  handleShowPopup = () => {
    const { isShow } = this.state;
    this.setState({ isShow: !isShow });
  };
  render() {
    const { isShow } = this.state;
    return (
      <div className="page-header">
        <Header titleHeader="Course Page" />
        <PopupNewModule
          isShow={isShow}
          handleShowPopup={this.handleShowPopup}
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
              <div className="card text-white bg-primary mb-3">
                <div className="card-header">Create Training</div>
                <div className="card-body">
                  <h5 className="card-title">Step by step</h5>
                  <p className="card-text">
                    <ul>
                      <li>Description</li>
                      <li>Learning Path Manage</li>
                      <li>Activities</li>
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
                        className="form-control btn btn-info"
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
                            <button className="btn btn-info mr-3">
                              Show content choosen
                            </button>
                            <button className="btn btn-info">
                              Add content
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="form-group col-xl-12">
                    <button
                      className="btn btn-success"
                      style={{ width: "100%" }}
                    >
                      DONE
                    </button>
                  </div>
                </div>
              )}
              {this.state.step === 2 && (
                <div className="row">
                  <div className="col-xl-12">
                    <div className="form-group" style={{ width: "30%" }}>
                      <button
                        type="button"
                        className="form-control btn btn-info"
                        onClick={this.handleShowPopup}
                      >
                        Add new module
                      </button>
                    </div>
                  </div>
                  <div className="col-xl-5">
                    <label>List module available</label>
                    <ul>
                      <li>Module 1</li>
                      <li>Module 2</li>
                      <li>Module 3</li>
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
                      className="btn btn-success"
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
                      />
                    </div>
                    <div className="form-group">
                      <label>Description</label>
                      <CKEditor
                        className="form-control"
                        editor={ClassicEditor}
                        data="<p>Hello from CKEditor 5!</p>"
                        onInit={editor => {
                          // You can store the "editor" and use when it is needed.
                          console.log("Editor is ready to use!", editor);
                        }}
                        onChange={(event, editor) => {
                          const data = editor.getData();
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
                      className="btn btn-success"
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
