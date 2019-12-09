import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { createContent, createData } from "redux/action/content";
import Select from "react-select";
import _ from "lodash";
import CKEditor from "components/CKEditor";
import AuthStorage from "utils/AuthStorage";
import Loading from "components/Loading";
import { UploadFile } from "utils/UploadImage.js";
import { Player } from "video-react";
const Papa = require("papaparse/papaparse.min.js");

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
    data: {},
    countTextTest: [1],
    videoSrc: "",
    slideBackground: [],
    listNameFile: [],
    errorQuestion: "",
    createdContent: false,
    questions: [
      {
        question: "",
        answers: [
          {
            anw: "",
            result: false
          }
        ]
      }
    ],
    contentToUpdate: {},
    defaultType: {},
    isLoading: false
  };

  componentDidMount() {
    const { content } = this.props;
    const idx = _.findIndex(typeContent, item => item.value === content.type);
    this.setState({ contentToUpdate: content, defaultType: typeContent[idx] });
  }

  //#region Handle Action Redux

  handleCreateData = (data, content) => {
    const { handleGetContentByUserId, notifySuccess, notifyError } = this.props;
    const payload = { data, content };
    const { createData } = this.props.action;
    createData(payload, isCreateData => {
      if (isCreateData._id) {
        handleGetContentByUserId(AuthStorage.userInfo._id);
        // this.setState({ createdContent: true });
        // this.handleResetForm();
        // this.form.reset();
        this.handleClosePopup();
        notifySuccess("Notification", "Data has been created successfully.");
      } else {
        notifyError(
          "Notification",
          "Error! Something when wrong. Please wait a few minutes and try again."
        );
      }
    });
  };
  //#endregion

  //#region Handle submit button create new content

  handleSubmitUpdate = () => {
    const { contentToUpdate } = this.state;
    if (contentToUpdate.type === "Text") {
      this.handleSubmitTextNormal(contentToUpdate);
    }
    if (contentToUpdate.type === "TextTest") {
      this.handleSubmitTextTest(contentToUpdate);
    }
    if (contentToUpdate.type === "Video") {
      this.handleSubmitVideoNormal(contentToUpdate);
    }
    if (contentToUpdate.type === "Slide") {
      this.handleSubmitSlide(contentToUpdate);
    }
    if (contentToUpdate.type === "Question") {
      this.handleSubmitQuestion(contentToUpdate);
    }
  };

  handleSubmitTextNormal = contentToUpdate => {
    const { content } = this.state;
    const { title, description } = this.refs;
    const data = {
      title: title.value,
      description: description.value,
      content
    };
    this.handleCreateData(data, contentToUpdate._id);
  };

  handleSubmitTextTest = contentToUpdate => {
    const { countTextTest } = this.state;
    const { title, description } = this.refs;
    let contents = [];
    countTextTest.map((item, index) => {
      const titleContent = this.refs[`titleContent${item}`];
      const content = this.refs[`content${item}`];
      contents.push({
        title: titleContent.value,
        content: content.value
      });
    });
    const data = {
      title: title.value,
      description: description.value,
      contents
    };
    this.handleCreateData(data, contentToUpdate._id);
  };

  handleSubmitVideoNormal = async contentToUpdate => {
    this.setState({ isLoading: true });
    const { fileToUpload } = this.state;
    const { title, description } = this.refs;
    let url = "";
    if (fileToUpload.length > 0) {
      let data = new FormData();
      data.append("files", fileToUpload[0]);
      await UploadFile(data)
        .then(res => {
          this.setState({ isLoading: false });
          return res.json();
        })
        .then(result => {
          let sliceResponse = result[0].url.split("/");
          url = `/${sliceResponse[3]}/${sliceResponse[4]}`;
        });
    }
    const data = {
      title: title.value,
      description: description.value,
      url
    };
    this.handleCreateData(data, contentToUpdate._id);
  };

  handleSubmitSlide = contentToUpdate => {
    const { countTextTest, fileToUpload } = this.state;
    const { title, description } = this.refs;
    let slideItems = [];
    countTextTest.map(async (item, index) => {
      const titleContent = this.refs[`titleSlide${item}`];
      const contentSlide = this.refs[`contentSlide${item}`];
      let url = "";
      // Catch error without upload image
      try {
        let data = new FormData();
        data.append("files", fileToUpload[index]);
        await UploadFile(data)
          .then(res => {
            return res.json();
          })
          .then(result => {
            let sliceResponse = result[0].url.split("/");
            url = `/${sliceResponse[3]}/${sliceResponse[4]}`;
          });
      } catch {
        url = "uploads/9ee513ab17ae4d2ca9a7fa3feb3b2d67.png";
      }
      // Add slideItem to list
      slideItems.push({
        title: titleContent.value,
        content: contentSlide.value,
        imgPath: url
      });
      // Process with last element in Array
      if (index === countTextTest.length - 1) {
        const data = {
          title: title.value,
          description: description.value,
          slideItems
        };
        this.handleCreateData(data, contentToUpdate._id);
      }
    });
  };

  handleSubmitQuestion = contentToUpdate => {
    const { questions } = this.state;
    const { title, description } = this.refs;
    const data = {
      title: title.value,
      description: description.value,
      questions
    };
    this.handleCreateData(data, contentToUpdate._id);
  };
  //#endregion

  //#region Helper Event DOM

  handleClosePopup = () => {
    // this.props.handleShowListContent(this.props.currentModule);
    this.props.handleCloseNewContent();
  };

  handleChangeDescription = content => {
    this.setState({ content }, () => {});
  };

  handleResetForm = () => {
    this.setState({
      description: "",
      fileToUpload: [],
      listContentSelect: [],
      currentContent: {},
      content: "",
      data: {},
      countTextTest: [1],
      videoSrc: "",
      slideBackground: [],
      listNameFile: [],
      errorQuestion: "",
      questions: [
        {
          question: "",
          answers: [
            {
              anw: "",
              result: false
            }
          ]
        }
      ]
    });
  };

  handleAddMoreContent = () => {
    let { countTextTest } = this.state;
    countTextTest.push(countTextTest[countTextTest.length - 1] + 1);
    this.setState({ countTextTest });
  };

  handleValidateQuestion = listAnswer => {
    const findIndex = _.findIndex(listAnswer, answer => answer.result === true);
    if (findIndex > -1) {
      return true;
    }
    return false;
  };
  handleResetError = () => {
    this.setState({ errorQuestion: "" });
  };

  //#endregion

  //#region Handle Upload File - Video
  videoSelectHandler = e => {
    try {
      let files = e.target.files;
      let { fileToUpload } = this.state;
      const reader = new FileReader();
      const file = files[0];
      const url = reader.readAsDataURL(file);

      reader.onloadend = function(e) {
        this.setState({
          videoSrc: [reader.result]
        });
      }.bind(this);

      fileToUpload.push(files[0]);
      this.setState({ fileToUpload: fileToUpload, nameFile: files[0].name });
    } catch {}
  };

  slideSelectHander = e => {
    try {
      let files = e.target.files;
      let {
        fileToUpload,
        slideBackground,
        countTextTest,
        listNameFile
      } = this.state;
      const reader = new FileReader();
      const file = files[0];
      const url = reader.readAsDataURL(file);
      const index = countTextTest.length - 1;
      reader.onloadend = function(e) {
        slideBackground[index] = [reader.result];
        this.setState({
          slideBackground
        });
      }.bind(this);
      fileToUpload.push(files[0]);
      listNameFile[index] = files[0].name;
      this.setState({ fileToUpload: fileToUpload, listNameFile });
    } catch {}
  };
  //#endregion

  readFileQuestion = e => {
    const file = e.target.files[0];
    try {
      Papa.parse(file, {
        header: true,
        download: true,
        skipEmptyLines: true,
        // Here this is also available. So we can call our custom class method
        complete: result => {
          let { questions } = this.state;
          questions = [];
          result.data.map((item, index) => {
            let question = {};
            question.question = item["Question"];
            question.answers = [
              {
                anw: item["Option 1"],
                result: false
              },
              {
                anw: item["Option 2"],
                result: false
              },
              {
                anw: item["Option 3"],
                result: false
              },
              {
                anw: item["Option 4"],
                result: false
              }
            ];
            const resultTrue = parseInt(item["Correct Answer"]) - 1;
            question.answers[resultTrue].result = true;
            questions.push(question);
          });
          this.setState({ questions: [...questions] });
        }
      });
    } catch {
      this.setState({
        questions: [
          {
            question: "",
            answers: [
              {
                anw: "",
                result: false
              }
            ]
          }
        ]
      });
    }
  };

  handleChangeTitleQuestion = (idxQuestion, value) => {
    let { questions } = this.state;
    questions[idxQuestion].question = value;
    this.setState({
      questions: [...questions]
    });
  };

  handleChangeAnswerQuestion = (idxQuestion, idxAnswer, event) => {
    let { questions } = this.state;
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    if (target.type === "checkbox") {
      questions[idxQuestion].answers[idxAnswer].result = value;
    } else {
      questions[idxQuestion].answers[idxAnswer].anw = value;
    }
    this.setState({
      questions: [...questions]
    });
  };

  handleAddMoreAnswer_ver2 = idxQuestion => {
    let { questions } = this.state;
    questions[idxQuestion].answers.push({
      anw: "",
      result: false
    });
    this.setState({ questions: [...questions] });
  };

  handleAddMoreQuest_ver2 = () => {
    let { questions } = this.state;
    questions.push({
      question: "",
      answers: [
        {
          anw: "",
          result: false
        }
      ]
    });
    this.setState({ questions: [...questions] });
  };

  render() {
    const { isShow } = this.props;
    const {
      countTextTest,
      videoSrc,
      listNameFile,
      slideBackground,
      errorQuestion,
      defaultType,
      contentToUpdate,
      isLoading
    } = this.state;
    const { questions } = this.state;
    return (
      <div
        className={`modal new-content bd-example-modal-lg fade ${
          isShow ? "show" : ""
        }`}
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
                Update content
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
                <form className="col-xl-12" ref={form => (this.form = form)}>
                  <div className="form-group">
                    <label>Type of Content: </label>
                    <Select
                      // value={selectedOption}
                      className="basic-single"
                      classNamePrefix="select"
                      options={typeContent}
                      defaultValue={defaultType}
                      value={defaultType}
                      isClearable={true}
                      isDisabled={true}
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
                      disabled={true}
                      value={contentToUpdate.name}
                    />
                  </div>

                  {defaultType.value === "Video" && (
                    <div className="card">
                      <div className="card-header">Data of content</div>
                      <div className="card-body">
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
                          <label>Video </label>
                          <div className="custom-file">
                            <input
                              type="file"
                              className="custom-file-input"
                              onChange={this.videoSelectHandler}
                              id="customFile"
                              lang="en"
                              accept="video/mp4,video/x-m4v,video/*"
                            />
                            <label
                              className="custom-file-label"
                              htmlFor="customFile"
                            >
                              {this.state.nameFile !== ""
                                ? this.state.nameFile
                                : "Choose file"}
                            </label>
                          </div>
                        </div>
                        {videoSrc !== "" && (
                          <Player>
                            <source src={`${videoSrc}`} />
                          </Player>
                        )}
                      </div>
                    </div>
                  )}

                  {defaultType.value === "TextTest" && (
                    <div className="card">
                      <div className="card-header">Data of content</div>
                      <div className="card-body">
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
                        <div className="card">
                          <div className="card-header">List content</div>
                          <div className="card-body">
                            {countTextTest.length > 0 &&
                              countTextTest.map((item, index) => {
                                return (
                                  <div key={index}>
                                    <div className="form-group">
                                      <label> Title for content {item}: </label>
                                      <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter title ... "
                                        ref={`titleContent${item}`}
                                      />
                                    </div>
                                    <div className="form-group">
                                      <label>Content {item}: (*)</label>
                                      <textarea
                                        className="form-control"
                                        rows="3"
                                        ref={`content${item}`}
                                      />
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                        </div>
                        <div className="form-group">
                          <small className="form-text text-muted">
                            Note: The right answers, in asterix like
                            *correctWord*.
                            <br />
                            Example: Hello, My name *is* Thanh.
                          </small>
                        </div>
                        <div className="form-group">
                          <button
                            className="btn bg-root"
                            onClick={e => {
                              e.preventDefault();
                              this.handleAddMoreContent();
                            }}
                          >
                            Add more content
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {defaultType.value === "Slide" && (
                    <div className="card">
                      <div className="card-header">Data of content</div>
                      <div className="card-body">
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
                        <div className="card">
                          <div className="card-header">List slide</div>
                          <div className="card-body">
                            {countTextTest.length > 0 &&
                              countTextTest.map((item, index) => {
                                return (
                                  <div key={index}>
                                    <div className="form-group">
                                      <label> Title for slide {item}: </label>
                                      <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter title ... "
                                        ref={`titleSlide${item}`}
                                      />
                                    </div>
                                    <div className="form-group">
                                      <label>Content {item}: (*)</label>
                                      <textarea
                                        className="form-control"
                                        rows="3"
                                        ref={`contentSlide${item}`}
                                      />
                                    </div>
                                    <div className="form-group">
                                      <label>Background Image {item}: </label>
                                      <div className="custom-file">
                                        <input
                                          type="file"
                                          className="custom-file-input"
                                          onChange={this.slideSelectHander}
                                          id="customFile"
                                          lang="en"
                                        />
                                        <label
                                          className="custom-file-label"
                                          htmlFor="customFile"
                                        >
                                          {listNameFile.length > 0
                                            ? listNameFile[index]
                                            : "Choose file"}
                                        </label>
                                      </div>
                                    </div>
                                    {slideBackground.length > 0 && (
                                      <div className="mt-3 text-center mb-3">
                                        <img
                                          src={slideBackground[index]}
                                          alt=""
                                        />
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                          </div>
                        </div>
                        <div className="form-group">
                          <button
                            className="btn bg-root"
                            type="button"
                            onClick={e => {
                              e.preventDefault();
                              this.handleAddMoreContent();
                            }}
                          >
                            Add more slide
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {defaultType.value === "Text" && (
                    <div className="card">
                      <div className="card-header">Data of content</div>
                      <div className="card-body">
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
                            defaultData="Enter data in here..."
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {defaultType.value === "Question" && (
                    <div className="card">
                      <div className="card-header">Data of content</div>
                      <div className="card-body">
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
                          <label>Import Question from File CSV</label>
                          <div className="custom-file">
                            <input
                              type="file"
                              className="custom-file-input"
                              onChange={this.readFileQuestion}
                              id="customFile"
                              lang="en"
                            />
                            <label
                              className="custom-file-label"
                              htmlFor="customFile"
                            >
                              Choose file
                            </label>
                          </div>
                        </div>
                        <div className="form-group">
                          <small className="form-text text-muted">
                            Accept file *.csv
                          </small>
                        </div>
                        <div className="card">
                          <div className="card-header">List questions</div>
                          <div className="card-body">
                            {questions.length > 0 &&
                              questions.map((item, index) => {
                                return (
                                  <div key={index}>
                                    {errorQuestion !== "" &&
                                      errorQuestion === index && (
                                        <div className="form-group">
                                          <label className="text-danger">
                                            Please choose one correct answer.
                                          </label>
                                        </div>
                                      )}
                                    <div className="form-group">
                                      <label> Question {index + 1}: </label>
                                      <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter title ... "
                                        value={item.question}
                                        onChange={e =>
                                          this.handleChangeTitleQuestion(
                                            index,
                                            e.target.value
                                          )
                                        }
                                      />
                                    </div>
                                    {item.answers.length > 0 &&
                                      item.answers.map((ans, indexAns) => {
                                        return (
                                          <>
                                            <div className="form-group">
                                              <label>
                                                Answer {indexAns + 1}: (*)
                                              </label>
                                              <textarea
                                                onChange={e =>
                                                  this.handleChangeAnswerQuestion(
                                                    index,
                                                    indexAns,
                                                    e
                                                  )
                                                }
                                                className="form-control"
                                                rows="2"
                                                value={ans.anw}
                                              />
                                            </div>
                                            <div className="form-check">
                                              <input
                                                onChange={e =>
                                                  this.handleChangeAnswerQuestion(
                                                    index,
                                                    indexAns,
                                                    e
                                                  )
                                                }
                                                onClick={this.handleResetError}
                                                type="checkbox"
                                                checked={ans.result}
                                              />
                                              <label
                                                className={`${
                                                  errorQuestion !== "" &&
                                                  errorQuestion === index
                                                    ? "text-danger"
                                                    : ""
                                                } form-check-label`}
                                              >
                                                Correct Answer
                                              </label>
                                            </div>
                                          </>
                                        );
                                      })}
                                    <div className="form-group">
                                      <button
                                        className="btn bg-root"
                                        type="button"
                                        onClick={e => {
                                          e.preventDefault();
                                          this.handleAddMoreAnswer_ver2(index);
                                        }}
                                      >
                                        Add more answer
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                        </div>
                        <div className="form-group">
                          <button
                            className="btn bg-root"
                            type="button"
                            onClick={e => {
                              e.preventDefault();
                              this.handleAddMoreQuest_ver2();
                            }}
                          >
                            Add more question
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </form>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn bg-root-active"
                onClick={this.handleSubmitUpdate}
              >
                {isLoading ? (
                  <Loading classOption="align-center-spinner" />
                ) : (
                  "Update"
                )}
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

export default connect(mapStateToProps, mapDispatchToProps)(PopupNewContent);
