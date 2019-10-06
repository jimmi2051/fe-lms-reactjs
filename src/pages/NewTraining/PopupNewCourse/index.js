import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import CKEditor from "components/CKEditor";
import AuthStorage from "utils/AuthStorage";
function mapStateToProps(state) {
  return {
    store: {
      isCreatedCourse: state.isCreatedCourse.isCreatedCourse.data,
      loadingCreatedCourse: state.isCreatedCourse.isCreatedCourse.loading
    }
  };
}

const mapDispatchToProps = dispatch => {
  return {
    action: bindActionCreators({}, dispatch)
  };
};

class PopupNewCourse extends Component {
  state = {
    description: "",
    fileToUpload: []
  };
  componentDidMount() {}

  fileSelectHandler = e => {
    let files = e.target.files;
    let { fileToUpload } = this.state;
    fileToUpload.push(files[0]);
    this.setState({ fileToUpload: fileToUpload });
  };

  handleNewCourse = async () => {
    const { title } = this.refs;
    const { description, fileToUpload } = this.state;
    let thumbnail = {};
    if (fileToUpload.length > 0) {
      let data = new FormData();
      data.append("files", fileToUpload[0]);
      await this.props
        .UploadFile(data)
        .then(res => {
          return res.json();
        })
        .then(result => {
          thumbnail = result;
        });
    }
    this.props.handleCreateCourse(
      title.value,
      description,
      thumbnail,
      AuthStorage.userInfo
    );
    this.props.handleShowPopup();
  };

  handleChangeDescription = data => {
    this.setState({ description: data });
  };

  render() {
    const { isShow } = this.props;
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
                Add new Course
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Title (*)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Course title here"
                  ref="title"
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <CKEditor
                  handleChangeDescription={this.handleChangeDescription}
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
                <button
                  type="button"
                  className="btn btn-info form-control"
                  onClick={this.handleNewCourse}
                >
                  Add
                </button>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
                onClick={this.props.handleShowPopup}
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
)(PopupNewCourse);
