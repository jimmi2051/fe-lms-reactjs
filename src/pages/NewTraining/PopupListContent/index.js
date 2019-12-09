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

class PopupListContent extends Component {
  state = {
    description: "",
    fileToUpload: [],
    listContentSelect: [],
    currentContent: {}
  };
  componentDidMount() {
    const { listContent } = this.props.store;
    this.handleProcessData(listContent);
  }

  handleProcessData = listContent => {
    let listContentSelect = [];
    listContent.map((item, index) => {
      listContentSelect.push({ value: item, label: item.name });
    });
    this.setState({ listContentSelect, currentContent: listContent[0] });
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

  handleChange = option => {
    if (!_.isNull(option)) {
      this.setState({ currentContent: option.value });
    }
  };

  handleUpdateContent_ver2 = () => {
    const { notifySuccess, notifyError } = this.props;
    const { currentContent } = this.state;
    if (!this.props.handleAddContent(currentContent)) {
      notifyError("Notification", "Error: Content already exists.");
    } else {
      notifySuccess("Notification", "Add successfully content.");
    }
  };

  render() {
    const { isShow } = this.props;
    const { listContentSelect, currentContent } = this.state;
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
              <div className="row">
                <div className="col-xl-12">
                  {listContentSelect.length > 0 && (
                    <Select
                      // value={selectedOption}
                      className="basic-single"
                      classNamePrefix="select"
                      isSearchable={true}
                      onChange={this.handleChange}
                      options={listContentSelect}
                      defaultValue={listContentSelect[0]}
                      isClearable={true}
                      noOptionsMessage={inputValue => "No content found"}
                      placeholder="-- Select content --"
                    />
                  )}
                </div>
                <div className="col-xl-12 pt-4">
                  {!_.isEmpty(currentContent) && currentContent.relationData ? (
                    <div className="detail-content">
                      <h4 className="detail-content-title">
                        {currentContent.relationData.data.title}
                      </h4>
                      <h5>Description: </h5>
                      <div
                        className="detail-content-description"
                        dangerouslySetInnerHTML={{
                          __html: currentContent.relationData.data.description
                        }}
                      />
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
                  ) : (
                    <div className="text text-center">
                      <h5 className="text-warning">
                        This content is updating. Please choose another content.
                        Thanks
                      </h5>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn bg-root-active"
                onClick={this.handleUpdateContent_ver2}
              >
                Add content
              </button>
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

export default connect(mapStateToProps, mapDispatchToProps)(PopupListContent);
