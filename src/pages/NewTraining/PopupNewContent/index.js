import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { createContent, createData } from "redux/action/content";
import { Link } from "react-router-dom";
import Select from "react-select";
import _ from "lodash";
import CKEditor from "components/CKEditor";
import AuthStorage from "utils/AuthStorage";
import { UploadFile } from "utils/UploadImage.js";
import { Player } from "video-react";

const REACT_APP_URL_API = process.env.REACT_APP_URL_API;

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
    countQuestion: [[1]],
    errorQuestion: "",
    createdContent: false,
  };



  componentDidMount() { }

  //#region Handle Action Redux 
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
        this.setState({ createdContent: true });
        this.handleResetForm();
        this.form.reset();
      }
    });
  };
  //#endregion
  

  //#region Handle submit button create new content

  handleSubmitCreate = () => {
    const { currentType } = this.state;
    if (currentType === "Text") {
      this.handleSubmitTextNormal();
    }
    if (currentType === "TextTest") {
      this.handleSubmitTextTest();
    }
    if (currentType === "Video") {
      this.handleSubmitVideoNormal();
    }
    if (currentType === "Slide") {
      this.handleSubmitSlide();
    }
    if (currentType === "Question") {
      this.handleSubmitQuestion();
    }
  }

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

  handleSubmitTextTest = () => {
    const { currentType, countTextTest } = this.state;
    const { name, title, description } = this.refs;
    let contents = [];
    countTextTest.map((item, index) => {
      const titleContent = this.refs[`titleContent${item}`];
      const content = this.refs[`content${item}`];
      contents.push({
        title: titleContent.value,
        content: content.value
      })
    })
    const data = {
      title: title.value,
      description: description.value,
      contents
    };
    this.setState({ data });
    this.handleCreateContent(name.value, currentType, AuthStorage.userInfo);
  };

  handleSubmitVideoNormal = async () => {
    const { currentType, fileToUpload } = this.state;
    const { name, title, description } = this.refs;
    let url = "";
    if (fileToUpload.length > 0) {
      let data = new FormData();
      data.append("files", fileToUpload[0]);
      await UploadFile(data)
        .then(res => {
          return res.json();
        })
        .then(result => {
          let sliceResponse = result[0].url.split("/");
          url = `${REACT_APP_URL_API}${sliceResponse[3]}/${sliceResponse[4]}`;
        });
    }
    const data = {
      title: title.value,
      description: description.value,
      url
    };
    this.setState({ data });
    this.handleCreateContent(name.value, currentType, AuthStorage.userInfo);
  };

  handleSubmitSlide = () => {
    const { currentType, countTextTest, fileToUpload } = this.state;
    const { name, title, description } = this.refs;
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
            url = `${REACT_APP_URL_API}${sliceResponse[3]}/${sliceResponse[4]}`;
          });
      }
      catch{
        url = "uploads/9ee513ab17ae4d2ca9a7fa3feb3b2d67.png"
      }
      // Add slideItem to list 
      slideItems.push({
        title: titleContent.value,
        content: contentSlide.value,
        imgUrl: url
      })
      // Process with last element in Array
      if (index === countTextTest.length - 1) {
        const data = {
          title: title.value,
          description: description.value,
          slideItems
        };
        this.setState({ data }, () => {
          this.handleCreateContent(name.value, currentType, AuthStorage.userInfo);
        });
      }
    })
  };

  handleSubmitQuestion = () => {
    const { currentType, countQuestion } = this.state;
    const { name, title, description } = this.refs;
    let questions = [];
    countQuestion.map((item, index) => {
      const titleQuestion = this.refs[`titleQuestion${index + 1}`];
      let answers = [];
      item.map((itemAnswer, indexAnswer) => {
        const contentAnswer = this.refs[`contentAnswer${index + 1}${itemAnswer}`];
        const resultAnswer = this.refs[`resultAnswer${index + 1}${itemAnswer}`];
        answers.push({
          anw: contentAnswer.value,
          result: resultAnswer.checked,
        })
      })
      if (this.handleValidateQuestion(answers)) {
        questions.push({
          question: titleQuestion.value,
          answers: answers
        })
      }
      else {
        let { errorQuestion } = this.state;
        errorQuestion = index;
        this.setState({ errorQuestion });
        return;
      }
    })
    const data = {
      title: title.value,
      description: description.value,
      questions
    };
    this.setState({ data });
    this.handleCreateContent(name.value, currentType, AuthStorage.userInfo);
  };
  //#endregion

  //#region Helper Event DOM

  handleClosePopup = () => {
    // this.props.handleShowListContent(this.props.currentModule);
    this.props.handleCloseNewContent();
  };

  handleChange = option => {
    if (!_.isNull(option)) {
      this.setState({ currentType: option.value });
    }
    // this.setState({ messageErr: "", messageSuc: "" });
  };

  handleChangeDescription = content => {
    this.setState({ content }, () => { });
  };

  handleResetForm = () =>{
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
      countQuestion: [[1]],
      errorQuestion: ""
    })
  }

  handleAddMoreContent = () => {
    let { countTextTest } = this.state;
    countTextTest.push(countTextTest[countTextTest.length - 1] + 1);
    this.setState({ countTextTest });
  }

  handleAddMoreQuest = () => {
    let { countQuestion } = this.state;
    countQuestion.push([1]);
    this.setState({ countQuestion });
  }

  handleAddMoreAnswer = (index) => {
    let { countQuestion } = this.state;
    countQuestion[index].push(countQuestion[index][countQuestion[index].length - 1] + 1);
    this.setState({ countQuestion });
  }

  handleValidateQuestion = (listAnswer) => {
    const findIndex = _.findIndex(listAnswer, answer => answer.result === true);
    if (findIndex > -1) {
      return true;
    }
    return false;
  }
  handleResetError = () => {
    this.setState({ errorQuestion: "" });
  }

  //#endregion

  //#region Handle Upload File - Video
  videoSelectHandler = e => {
    try {
      let files = e.target.files;
      let { fileToUpload } = this.state;
      const reader = new FileReader();
      const file = files[0];
      const url = reader.readAsDataURL(file);

      reader.onloadend = function (e) {
        this.setState({
          videoSrc: [reader.result]
        });
      }.bind(this);

      fileToUpload.push(files[0]);
      this.setState({ fileToUpload: fileToUpload, nameFile: files[0].name });
    }
    catch{ }
  };

  slideSelectHander = e => {
    try {
      let files = e.target.files;
      let { fileToUpload, slideBackground, countTextTest, listNameFile } = this.state;
      const reader = new FileReader();
      const file = files[0];
      const url = reader.readAsDataURL(file);
      const index = countTextTest.length - 1;
      reader.onloadend = function (e) {
        slideBackground[index] = [reader.result];
        this.setState({
          slideBackground
        });
      }.bind(this);
      fileToUpload.push(files[0]);
      listNameFile[index] = files[0].name
      this.setState({ fileToUpload: fileToUpload, listNameFile });
    }
    catch{ }
  }
  //#endregion

  render() {
    const { isShow } = this.props;
    const { currentType, countTextTest, videoSrc, listNameFile, slideBackground, countQuestion, errorQuestion, createdContent } = this.state;

    return (
      <div
        className={`modal new-content bd-example-modal-lg fade ${isShow ? "show" : ""}`}
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
                {createdContent && (
                  <div className="col-xl-12">
                    <h5 className="text text-success">Created successfully content</h5>
                  </div>
                )}
                
                  <form className="col-xl-12" ref={form => (this.form = form)}>
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

                    {currentType === "Video" && (
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
                              <label className="custom-file-label" htmlFor="customFile">
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

                    {currentType === "TextTest" && (
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
                              {countTextTest.length > 0 && countTextTest.map((item, index) => {
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
                                      <textarea className="form-control" rows="3" ref={`content${item}`} />
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                          <div className="form-group">
                            <small className="form-text text-muted">
                              Note: The right answers, in asterix like *correctWord*.
                                <br />
                              Example: Hello, My name *is* Thanh.
                        </small>
                          </div>
                          <div className="form-group">
                            <button className="btn bg-root" onClick={this.handleAddMoreContent}>Add more content</button>
                          </div>
                        </div>
                      </div>
                    )}

                    {currentType === "Slide" && (
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
                              {countTextTest.length > 0 && countTextTest.map((item, index) => {
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
                                      <textarea className="form-control" rows="3" ref={`contentSlide${item}`} />
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
                                        <label className="custom-file-label" htmlFor="customFile">
                                          {listNameFile.length > 0
                                            ? listNameFile[index]
                                            : "Choose file"}
                                        </label>
                                      </div>
                                    </div>
                                    {slideBackground.length > 0 && (
                                      <div className="mt-3 text-center mb-3">
                                        <img src={slideBackground[index]} alt="" />
                                      </div>
                                    )}
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                          <div className="form-group">
                            <button className="btn bg-root" onClick={this.handleAddMoreContent}>Add more slide</button>
                          </div>
                        </div>
                      </div>
                    )}

                    {currentType === "Text" && (
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

                    {currentType === "Question" && (
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
                            <div className="card-header">List questions</div>
                            <div className="card-body">
                              {countQuestion.length > 0 && countQuestion.map((item, index) => {
                                return (
                                  <div key={index}>
                                    {errorQuestion !== "" && errorQuestion === index && (
                                      <div className="form-group">
                                        <label className="text-danger">Please choose one correct answer.</label>
                                      </div>
                                    )}
                                    <div className="form-group">
                                      <label> Question {index + 1}: </label>
                                      <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter title ... "
                                        ref={`titleQuestion${index + 1}`}
                                      />
                                    </div>
                                    {
                                      item.length > 0 && item.map((ans, indexAns) => {
                                        return (
                                          <>
                                            <div className="form-group">
                                              <label>Answer {ans}: (*)</label>
                                              <textarea className="form-control" rows="2" ref={`contentAnswer${index + 1}${ans}`} />
                                            </div>
                                            <div className="form-check">
                                              <input onClick={this.handleResetError} type="checkbox" ref={`resultAnswer${index + 1}${ans}`} />
                                              <label className={`${errorQuestion !== "" && errorQuestion === index ? "text-danger" : ""} form-check-label`}>
                                                Correct Answer
                                            </label>
                                            </div>
                                          </>
                                        )
                                      })
                                    }
                                    <div className="form-group">
                                      <button className="btn bg-root" onClick={() => this.handleAddMoreAnswer(index)}>Add more answer</button>
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                          <div className="form-group">
                            <button className="btn bg-root" onClick={this.handleAddMoreQuest}>Add more question</button>
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
                className="btn bg-root"
                onClick={this.handleSubmitCreate}
              >
                Create
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PopupNewContent);
