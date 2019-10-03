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
    this.processData(this.props.content);
  }
  processData = content => {
    let listWord = content.split(" ");
    let result = [];
    let contentProcessed = [];
    listWord.map((item, index) => {
      if (item[0] === "*" && item[item.length - 1] === "*") {
        item = item.slice(1, item.length - 1);
        result.push(item);
        contentProcessed.push(item);
      } else {
        contentProcessed.push(item);
      }
    });
    this.setState({ result, content: contentProcessed });
  };
  onChooseWord = word => {
    let { choosen } = this.state;
    const indexWord = _.findIndex(choosen, item => item === word);
    if (indexWord > -1) {
      choosen.splice(indexWord, 1);
    } else {
      choosen.push(word);
    }
    this.setState({ choosen });
  };

  onSubmit = () => {
    const { result, choosen } = this.state;
    let mark = 0;
    let wrong = [];
    choosen.map((item, index) => {
      const indexChoosen = _.findIndex(
        result,
        itemResult => itemResult === item
      );
      if (indexChoosen > -1) {
        mark++;
      } else {
        wrong.push(item);
      }
    });
    this.setState({ mark, isSubmit: true, wrong });
  };

  render() {
    const { content, isSubmit, mark, result, choosen, wrong } = this.state;
    return (
      <div className="">
        {isSubmit && (
          <div>
            <p>
              Result: <br />
              True: {mark}/{choosen.length}
              <br /> False: {wrong.length}/{choosen.length}
            </p>
          </div>
        )}
        {content.map((item, index) => {
          const findIndex = _.findIndex(choosen, word => word === item);
          const findIndexWrong = _.findIndex(wrong, word => word === item);
          return (
            <span>
              {" "}
              <span
                onClick={() => {
                  this.onChooseWord(item);
                }}
                style={{ cursor: "pointer" }}
                className={`${findIndex > -1 ? "bg-root" : ""} ${
                  findIndexWrong > -1 ? "bg-danger" : ""
                }`}
              >
                {item}
              </span>{" "}
            </span>
          );
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
