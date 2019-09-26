import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import CKEditor from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import AuthStorage from "utils/AuthStorage";
function mapStateToProps(state) {
  return {
    store: {
      listContent: state.listContent.listContent.data,
      loadingListContent: state.listContent.listContent.loading
    }
  };
}

const mapDispatchToProps = dispatch => {
  return {
    action: bindActionCreators({}, dispatch)
  };
};

class PopupListContent extends Component {
  state = {
    description: "",
    fileToUpload: []
  };
  //   componentDidMount() {}

  //   fileSelectHandler = e => {
  //     let files = e.target.files;
  //     let { fileToUpload } = this.state;
  //     fileToUpload.push(files[0]);
  //     this.setState({ fileToUpload: fileToUpload });
  //   };

  //   handleNewCourse = async () => {
  //     const { title } = this.refs;
  //     const { description, fileToUpload } = this.state;
  //     let thumbnail = {};
  //     if (fileToUpload.length > 0) {
  //       let data = new FormData();
  //       data.append("files", fileToUpload[0]);
  //       await this.props
  //         .UploadFile(data)
  //         .then(res => {
  //           return res.json();
  //         })
  //         .then(result => {
  //           thumbnail = result;
  //         });
  //     }
  //     this.props.handleCreateCourse(
  //       title.value,
  //       description,
  //       thumbnail,
  //       AuthStorage.userInfo
  //     );
  //     this.props.handleShowPopup();
  //   };

  //   handleChangeDescription = data => {
  //     this.setState({ description: data });
  //   };
  handleUpdateContent = content => {
    console.log("this is props>>>", this.props);
    console.log("content>>>>", content);
  };
  render() {
    const { isShow } = this.props;
    const { listContent, loadingListContent } = this.props.store;
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
                List content
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
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {!loadingListContent &&
                    listContent.map((item, index) => {
                      return (
                        <tr>
                          <td>{item.name}</td>
                          <td>{item.type}</td>
                          <td>
                            <button
                              type="button"
                              onClick={() => {
                                this.handleUpdateContent(item);
                              }}
                            >
                              Choosen content
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
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
)(PopupListContent);
