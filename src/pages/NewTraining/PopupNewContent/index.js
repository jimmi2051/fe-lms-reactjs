import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { createContent, createData } from "redux/action/content";
import { Link } from "react-router-dom";
import Select from "react-select";
import _ from "lodash";
import CKEditor from "components/CKEditor";
import AuthStorage from "utils/AuthStorage";
function mapStateToProps(state) {
  return {
    store: {
      isCreateContent: state.isCreateContent.isCreateContent.data,
      isCreateData: state.isCreateContent.isCreateData.data
    }
  };
}

const mapDispatchToProps = dispatch => {
  return {
    action: bindActionCreators({ createContent, createData }, dispatch)
  };
};

const typeContent = [
  {
    value: "Text",
    label: "Text Normal"
  },
  {
    value: "TextTest",
    label: "Text To Test"
  },
  {
    value: "Slide",
    label: "Slide"
  },
  {
    value: "Question",
    label: "Question"
  },
  {
    value: "Video",
    label: "Video Normal"
  }
];

class PopupNewContent extends Component {
  state = {
    description: "",
    fileToUpload: [],
    listContentSelect: [],
    currentContent: {},
    currentType: "Text",
    content: "",
    data: {}
  };
  componentDidMount() {}

  handleClosePopup = () => {
    this.props.handleShowListContent(this.props.currentModule);
  };

  handleChange = option => {
    if (!_.isNull(option)) {
      this.setState({ currentType: option.value });
    }
    // this.setState({ messageErr: "", messageSuc: "" });
  };

  handleChangeDescription = content => {
    this.setState({ content }, () => {});
  };

  handleCreateContent = (name, type, user) => {
    const payload = {
      name,
      type,
      user
    };
    const { createContent } = this.props.action;
    createContent(payload, () => {
      const { isCreateContent } = this.props.store;
      const { data } = this.state;
      if (isCreateContent._id) {
        this.handleCreateData(data, isCreateContent._id);
      }
    });
  };

  handleCreateData = (data, content) => {
    const payload = { data, content };
    const { createData } = this.props.action;
    createData(payload, () => {
      const { isCreateData } = this.props.store;
      if (isCreateData._id) {
        console.log("CREATE SUCCESS>>>>>>>", isCreateData);
      }
    });
  };

  handleSubmitTextNormal = () => {
    const { currentType, content } = this.state;
    const { name, title, description } = this.refs;
    const data = {
      title: title.value,
      description: description.value,
      content
    };
    this.setState({ data });
    this.handleCreateContent(name.value, currentType, AuthStorage.userInfo);
  };

  render() {
    const { isShow } = this.props;
    const { currentType } = this.state;
    return (
      <div
        className={`modal bd-example-modal-lg fade ${isShow ? "show" : ""}`}
        id="exampleModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
        style={
          isShow
            ? {
                display: "block",
                paddingRight: "15px"
              }
            : {}
        }
      >
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Create new content
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
                onClick={this.handleClosePopup}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-xl-12">
                  <div className="form-group">
                    <label>Type of Content: </label>
                    <Select
                      // value={selectedOption}
                      className="basic-single"
                      classNamePrefix="select"
                      isSearchable={true}
                      onChange={this.handleChange}
                      options={typeContent}
                      defaultValue={typeContent[0]}
                      isClearable={true}
                      noOptionsMessage={inputValue => "No content found"}
                      placeholder="-- Select content --"
                    />
                  </div>
                  <div className="form-group">
                    <label>Name of content (*)</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter name of content "
                      ref="name"
                    />
                  </div>
                  {currentType === "Text" && (
                    <div class="card">
                      <div class="card-header">Data of content</div>
                      <div class="card-body">
                        <div className="form-group">
                          <label>Title: (*)</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Enter title ... "
                            ref="title"
                          />
                        </div>
                        <div className="form-group">
                          <label>Description: (*)</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Enter description ... "
                            ref="description"
                          />
                        </div>
                        <div className="form-group">
                          <label>Content: (*)</label>
                          <CKEditor
                            handleChangeDescription={
                              this.handleChangeDescription
                            }
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="col-xl-12">
                  <div className="form-group">
                    {currentType === "Text" && (
                      <button
                        type="button"
                        className="btn bg-root"
                        onClick={this.handleSubmitTextNormal}
                      >
                        Create
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
                onClick={this.handleClosePopup}
              >
                Close
              </button>
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
)(PopupNewContent);
