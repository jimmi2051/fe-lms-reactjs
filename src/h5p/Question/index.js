import React, { Component } from "react";
import _ from "lodash";
class Question extends Component {
  state = {
    result: "",
    status: -1,
    listAnswer: []
  };
  handleChooseAnswer = (question, answer) => {
    let { listAnswer } = this.state;
    const findIndex = _.findIndex(listAnswer, item =>
      _.isEqual(item.question, question)
    );
    if (findIndex > -1) {
      listAnswer[findIndex].answer = answer;
    } else {
      let objQuestion = {
        question,
        answer
      };
      listAnswer.push(objQuestion);
    }
    this.setState({ listAnswer, status: -1 });
  };
  handleSubmit = () => {
    const { listAnswer } = this.state;
    let check = true;
    listAnswer.map((item, index) => {
      if (!item.answer.result) {
        this.setState({ result: "You're wrong.", status: 0 });
        check = false;
      }
    });
    if (check) {
      this.setState({ result: "You're correct.", status: 1 });
    }
  };
  render() {
    const { result, status, listAnswer } = this.state;
    const { questions } = this.props;
    return (
      <div>
        {status !== -1 && (
          <label className={`${status === 0 ? "text-danger" : "text-success"}`}>
            {result}
          </label>
        )}
        <br />
        {questions &&
          questions.map((item, index) => {
            return (
              <div key={index}>
                <label>
                  Question {index + 1}: {item.question}
                </label>
                {item.answers &&
                  item.answers.map((answer, indexAnswer) => {
                    const findIndex = _.findIndex(
                      listAnswer,
                      itemAnswer =>
                        _.isEqual(itemAnswer.answer, answer) &&
                        _.isEqual(itemAnswer.question, item)
                    );
                    let check;
                    if (findIndex > -1) {
                      check =
                        listAnswer[findIndex].answer === answer &&
                          listAnswer[findIndex].question === item
                          ? true
                          : false;
                    } else {
                      check = false;
                    }
                    return (
                      <div
                        className={` ${
                          status === 0 && check ? "bg-danger" : ""
                          } ${check ? "bg-root" : ""}`}
                        key={indexAnswer}
                        onClick={() => this.handleChooseAnswer(item, answer)}
                        style={{ cursor: "pointer" }}
                      >
                        Answer {indexAnswer + 1}: {answer.anw}
                      </div>
                    );
                  })}
              </div>
            );
          })}
        {!this.props.isView && (<button
          type="button"
          onClick={this.handleSubmit}
          className="btn btn-success"
        >
          Submit
        </button>)}

      </div>
    );
  }
}
export default Question;
