import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import CKEditor from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
function mapStateToProps(state) {
  return {
    store: {
      isCreatedModule: state.isCreatedModule.isCreatedModule.data,
      loadingCreatedModule: state.isCreatedModule.isCreatedModule.loading
    }
  };
}

const mapDispatchToProps = dispatch => {
  return {
    action: bindActionCreators({}, dispatch)
  };
};

class PopupNewModule extends Component {
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

  handleNewModule = async () => {
    const { title } = this.refs;
    const { description, fileToUpload } = this.state;
    let thumbnail = {};
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
    this.props.handleCreateModule(title.value, description, thumbnail);
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
                Add new module
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
                  placeholder="Enter module title here"
                  ref="title"
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
                <button
                  type="button"
                  className="btn btn-info form-control"
                  onClick={this.handleNewModule}
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
)(PopupNewModule);
