import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { updateContent } from "redux/action/content";
import { Link } from "react-router-dom";
import Select from "react-select";
import _ from "lodash";

import VideoNormal from "h5p/VideoNormal";
import TextNormal from "h5p/TextNormal";
import TextToTest from "h5p/TextToTest";
import Question from "h5p/Question";
import Slide from "h5p/Slide";

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

class PopupDetailContent extends Component {
  state = {
    // description: "",
    // fileToUpload: [],
    // listContentSelect: [],
    // currentContent: {}
  };
  componentDidMount() {
    // const { listContent } = this.props.store;
    // this.handleProcessData(listContent);
  }
  handleClosePopup = () => {
    this.props.handleCloseDetailContent();
  };
  render() {
    const { isShow, currentContent } = this.props;
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
                Detail of content "{currentContent.name}"
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
                  {!_.isEmpty(currentContent) && currentContent.relationData && (
                    <div>
                      <h5>{currentContent.relationData.data.title}</h5>
                      <label>
                        {currentContent.relationData.data.description}
                      </label>
                      {currentContent.type === "Video" && (
                        <VideoNormal
                          src={
                            currentContent.relationData.media
                              ? currentContent.relationData.media.url
                              : currentContent.relationData.data.url
                          }
                          isView
                        />
                      )}
                      {currentContent.type === "Text" && (
                        <TextNormal
                          context={currentContent.relationData.data.content}
                          isView
                        />
                      )}
                      {currentContent.type === "TextTest" && (
                        <TextToTest
                          contents={currentContent.relationData.data.contents}
                          isView
                        />
                      )}
                      {currentContent.type === "Question" && (
                        <Question
                          questions={currentContent.relationData.data.questions}
                          isView
                        />
                      )}
                      {currentContent.type === "Slide" && (
                        <Slide
                          // question={currentContent.relationData.data.question}
                          // answer={currentContent.relationData.data.answer}
                          slideItem={
                            currentContent.relationData.data.slideItems
                          }
                          isView
                        />
                      )}
                    </div>
                  )}
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

export default connect(mapStateToProps, mapDispatchToProps)(PopupDetailContent);
