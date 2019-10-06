import React, { Component } from "react";
import _ from "lodash";
class TextToTest extends Component {
  state = {
    result: [],
    content: [],
    choosen: [],
    wrong: [],
    mark: 0,
    isSubmit: false
  };
  componentDidMount() {
    this.processData(this.props.contents);
  }
  processData = contents => {
    let result = [];
    let contentProcessed = [];
    contents.map((content, indexContent) => {
      result[indexContent] = [];
      contentProcessed[indexContent] = []
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
    })
    this.setState({ result, content: contentProcessed });
  };
  onChooseWord = (indexQuestion, word) => {
    let { choosen } = this.state;
    const indexWord = _.findIndex(choosen[indexQuestion], item => item === word);
    if (indexWord > -1) {
      choosen[indexQuestion].splice(indexWord, 1);
    } else {
      if (!_.isArray(choosen[indexQuestion])) {
        choosen[indexQuestion] = []
      }
      choosen[indexQuestion].push(word);
    }
    this.setState({ choosen,isSubmit: false, wrong: [] });
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
            wrong[index] = []
          }
          wrong[index].push(choose);
        }
      });
    })
    this.setState({ mark, isSubmit: true, wrong });
  };

  render() {
    const { content, isSubmit, mark, result, choosen, wrong } = this.state;
    return (
      <div className="">
        {isSubmit && (
          <div>
             <label>
             Result: <br />
             </label>
              {choosen.map((item, index) => {
                return (
                  <div key={index}>
                    <p>True: {mark[index]}/{item?item.length:"0"}
                      <br />
                      False: {wrong[index]?wrong[index].length:"0"}/{item?item.length:"0"}
                      </p>
                  </div>
                )
              })}
          </div>
        )}
        {content.map((item, index) => {
          return (
            <div key={index}>
              {
                item.map((itemWord, indexWord) => {
                  const findIndex = _.findIndex(choosen[index], word => word === itemWord);
                  const findIndexWrong = _.findIndex(wrong[index], word => word === itemWord);
                  return (
                    <span key={indexWord}>
                      {" "}
                      <span
                        onClick={() => {
                          this.onChooseWord(index, itemWord);
                        }}
                        style={{ cursor: "pointer" }}
                        className={`${findIndex > -1 ? "bg-root" : ""} ${
                          findIndexWrong > -1 ? "bg-danger" : ""
                          }`}
                      >
                        {itemWord}
                      </span>{" "}
                    </span>
                  );
                })
              }
            </div>
          )
        })}
        <button
          type="button"
          onClick={() => this.onSubmit()}
          className="btn btn-success"
        >
          Submit
        </button>
      </div>
    );
  }
}
export default TextToTest;
