import React, { Component } from "react";
import _ from "lodash";
class TextToTest extends Component {
  state = {
    result: [],
    content: [],
    choosen: [],
    wrong: [],
    mark: [],
    isSubmit: false,
    currentContent: 0
  };
  componentDidMount() {
    this.processData(this.props.contents);
  }
  processData = contents => {
    let result = [];
    let contentProcessed = [];
    contents.map((content, indexContent) => {
      result[indexContent] = [];
      contentProcessed[indexContent] = [];
      let listWord = content.content.split(" ");
      listWord.map((word, indexWord) => {
        if (word[0] === "*" && word[word.length - 1] === "*") {
          word = word.slice(1, word.length - 1);
          result[indexContent].push(word);
          contentProcessed[indexContent].push(word);
        } else {
          contentProcessed[indexContent].push(word);
        }
      });
    });
    this.setState({ result, content: contentProcessed });
  };
  onChooseWord = (indexQuestion, word) => {
    let { choosen } = this.state;
    const indexWord = _.findIndex(
      choosen[indexQuestion],
      item => item === word
    );
    if (indexWord > -1) {
      choosen[indexQuestion].splice(indexWord, 1);
    } else {
      if (!_.isArray(choosen[indexQuestion])) {
        choosen[indexQuestion] = [];
      }
      choosen[indexQuestion].push(word);
    }
    this.setState({ choosen, isSubmit: false, wrong: [] });
  };

  onSubmit = () => {
    const { result, choosen } = this.state;
    let mark = [];
    let wrong = [];
    choosen.map((item, index) => {
      mark[index] = 0;
      item.map((choose, indexChoose) => {
        const indexChoosen = _.findIndex(
          result[index],
          itemResult => itemResult === choose
        );
        if (indexChoosen > -1) {
          mark[index]++;
        } else {
          if (!_.isArray(wrong[index])) {
            wrong[index] = [];
          }
          wrong[index].push(choose);
        }
      });
    });
    this.setState({ mark, isSubmit: true, wrong });
  };

  handleNextParagraph = () => {
    let { currentContent, content } = this.state;
    if (currentContent < content.length) {
      this.setState({ currentContent: currentContent + 1 });
    }
  };

  handleReset = () => {
    this.setState({
      mark: [],
      choosen: [],
      wrong: [],
      currentContent: 0,
      isSubmit: false
    });
  };

  render() {
    const {
      content,
      isSubmit,
      mark,
      choosen,
      wrong,
      currentContent
    } = this.state;
    const { contents } = this.props;
    if (isSubmit) {
      return (
        <div className="content-text-test">
          <h5 className="content-text-test__title">Result: </h5>
          {content &&
            content.map((item, index) => {
              return (
                <div className="content-text-test__result">
                  <p>
                    {contents[index].title} | Total correct answers:{" "}
                    {mark[index]}/{choosen[index] ? choosen[index].length : "0"}{" "}
                  </p>
                  <div className="content-text-test__warp-context mb-4">
                    {item.map((itemWord, indexWord) => {
                      const findIndex = _.findIndex(
                        choosen[index],
                        word => word === itemWord
                      );
                      const findIndexWrong = _.findIndex(
                        wrong[index],
                        word => word === itemWord
                      );
                      return (
                        <span key={indexWord}>
                          {" "}
                          <span
                            className={`tag-word ${
                              findIndex > -1 ? "tag-word-active" : ""
                            } 
                            ${findIndexWrong > -1 ? "tag-word-wrong" : ""}`}
                            style={{ cursor: "pointer" }}
                          >
                            {itemWord}
                            {findIndexWrong > -1 && (
                              <i className="fa fa-times-circle-o" />
                            )}
                            {findIndex > -1 && findIndexWrong === -1 && (
                              <i className="fa fa-check-circle-o" />
                            )}
                          </span>{" "}
                        </span>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          <div className="text-right">
            <button
              className="btn bg-root"
              style={{ cursor: "pointer" }}
              type="button"
              onClick={this.handleReset}
            >
              Try again.
            </button>
          </div>
        </div>
      );
    }
    return (
      <div className="content-text-test">
        <h5 className="content-text-test__title">
          Paragraph: {currentContent + 1} of {content.length}
        </h5>
        {currentContent < content.length && (
          <div className="">
            <p>{contents[currentContent].title}</p>
            <div className="content-text-test__warp-context mb-4">
              {content[currentContent].map((itemWord, indexWord) => {
                const findIndex = _.findIndex(
                  choosen[currentContent],
                  word => word === itemWord
                );
                const findIndexWrong = _.findIndex(
                  wrong[currentContent],
                  word => word === itemWord
                );
                return (
                  <span key={indexWord}>
                    {" "}
                    <span
                      onClick={() => {
                        this.onChooseWord(currentContent, itemWord);
                      }}
                      style={{ cursor: "pointer" }}
                      className={`tag-word ${
                        findIndex > -1 ? "tag-word-active" : ""
                      } ${findIndexWrong > -1 ? "tag-word-wrong" : ""}`}
                    >
                      {itemWord}
                    </span>{" "}
                  </span>
                );
              })}
            </div>
            <div className="content-text-test__submit text-right">
              {currentContent !== content.length - 1 ? (
                <button
                  className="btn bg-root"
                  type="button"
                  onClick={this.handleNextParagraph}
                >
                  Next >{" "}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => this.onSubmit()}
                  className="btn bg-root"
                  disabled={this.props.isView}
                >
                  Submit
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
}
export default TextToTest;
