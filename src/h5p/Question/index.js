import React, { Component } from "react";
import _ from "lodash";
class Question extends Component {
  state = {
    listAnswer: [],
    currentQuestion: 0,
    countCorrect: 0,
    submitAnswer: false,
    percentResult: 0,
    comment: "",
    missAns: false
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
    this.setState({ listAnswer, missAns: false });
  };

  handleSubmit = () => {
    const { listAnswer, currentQuestion } = this.state;
    const { questions } = this.props;
    // Check exists answer
    if (_.isEmpty(listAnswer[currentQuestion])) {
      this.setState({ missAns: true });
      return;
    }

    let countCorrect = 0;
    listAnswer.map((item, index) => {
      if (item.answer.result) {
        countCorrect += 1;
      }
    });
    const percentResult = (countCorrect / questions.length) * 100;
    let comment = "";
    if (percentResult <= 50) {
      comment = "You must study harder!";
    }
    if (percentResult > 50 && percentResult <= 80) {
      comment = "Good job! You are learning fast.";
    }
    if (percentResult > 80) {
      comment = "Excellent! You are so good.";
    }
    this.setState({
      countCorrect,
      submitAnswer: true,
      percentResult,
      comment
    });
  };

  handleNextQuestion = () => {
    let { currentQuestion, listAnswer } = this.state;
    const { questions } = this.props;
    // Check exists answer
    if (_.isEmpty(listAnswer[currentQuestion])) {
      this.setState({ missAns: true });
    } else {
      if (currentQuestion < questions.length) {
        this.setState({ currentQuestion: currentQuestion + 1 });
      }
    }
  };

  handleReset = () => {
    this.setState({
      listAnswer: [],
      currentQuestion: 0,
      countCorrect: 0,
      submitAnswer: false,
      percentResult: 0,
      comment: "",
      missAns: false
    });
  };

  render() {
    const {
      listAnswer,
      currentQuestion,
      submitAnswer,
      countCorrect,
      percentResult,
      comment,
      missAns
    } = this.state;
    const { questions } = this.props;
    if (submitAnswer) {
      return (
        <div className="content-question">
          <div className="content-question__warp-result">
            <h5 className="title text-center">Your result: </h5>
            <p className="text-center font-weight-bold">
              {countCorrect} of {questions.length} | {percentResult} %
            </p>
            <p className="text-center text-success font-weight-bold">
              {comment}
            </p>
          </div>
          <h5 className="">Check your answer</h5>
          {questions &&
            questions.map((item, index) => {
              return (
                <div className="content-question__question">
                  <p className="content-question__t-question">
                    Question: {index + 1}: {item.question}
                  </p>
                  <div className="row">
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
                            className={`content-question__t-answer col-xl-6`}
                            key={indexAnswer}
                            // onClick={() => this.handleChooseAnswer(item, answer)}
                          >
                            <div
                              className={`warp-answer ${
                                answer.result ? "warp-answer-active" : ""
                              }
                            ${
                              check && !answer.result ? "warp-answer-wrong" : ""
                            }
                          `}
                            >
                              {answer.result && (
                                <i className="fa fa-check-circle-o pr-2" />
                              )}
                              {check && !answer.result && (
                                <i className="fa fa-times-circle-o pr-2" />
                              )}
                              {answer.anw}
                            </div>
                          </div>
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
      <div className="content-question">
        <h5 className="content-question__title">
          Question: {currentQuestion + 1} of {questions.length}
        </h5>
        {currentQuestion < questions.length && (
          <div className="content-question__question">
            <p className="content-question__t-question">
              {questions[currentQuestion].question}
            </p>
            {missAns && (
              <p className="text-danger">You must choose one answer.</p>
            )}
            <div className="row">
              {questions[currentQuestion].answers &&
                questions[currentQuestion].answers.map(
                  (answer, indexAnswer) => {
                    const findIndex = _.findIndex(
                      listAnswer,
                      itemAnswer =>
                        _.isEqual(itemAnswer.answer, answer) &&
                        _.isEqual(
                          itemAnswer.question,
                          questions[currentQuestion]
                        )
                    );
                    let check;
                    if (findIndex > -1) {
                      check =
                        listAnswer[findIndex].answer === answer &&
                        listAnswer[findIndex].question ===
                          questions[currentQuestion]
                          ? true
                          : false;
                    } else {
                      check = false;
                    }
                    return (
                      <div
                        className={`content-question__t-answer col-xl-6`}
                        key={indexAnswer}
                        onClick={() =>
                          this.handleChooseAnswer(
                            questions[currentQuestion],
                            answer
                          )
                        }
                      >
                        <div
                          className={`warp-answer ${
                            check ? "warp-answer-active" : ""
                          }`}
                        >
                          {answer.anw}
                        </div>
                      </div>
                    );
                  }
                )}
            </div>
            <div className="content-question__t-submit text-right">
              {currentQuestion !== questions.length - 1 ? (
                <button
                  type="button"
                  onClick={() => {
                    this.handleNextQuestion();
                  }}
                  className="btn bg-root"
                >
                  Next >
                </button>
              ) : (
                <button
                  type="button"
                  onClick={this.handleSubmit}
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
export default Question;
