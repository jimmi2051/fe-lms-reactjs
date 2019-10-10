import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { updateContent } from "redux/action/content";
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
    action: bindActionCreators({ updateContent }, dispatch)
  };
};

class PopupListContent extends Component {
  state = {
    description: "",
    fileToUpload: []
  };
  handleUpdateContent = content => {
    const { currentModule } = this.props;
    let modules = content.modules;
    modules.push(currentModule);
    const payload = {
      id: content._id,
      modules: modules
    };
    const { updateContent } = this.props.action;
    updateContent(payload);
  };

  handleClosePopup = () => {
    this.props.handleShowListContent(this.props.currentModule);
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
                onClick={this.handleClosePopup}
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
                        <tr key={index}>
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
)(PopupListContent);
