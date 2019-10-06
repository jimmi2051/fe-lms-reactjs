import React, { Component } from "react";
import CKEditor from "components/CKEditor";

class Step1 extends Component {
  handleSubmit = () => {
    const { title } = this.refs;
    this.props.handleStepOne(title.value);
  };
  render() {
    return (
      <div className="row no-gutters">
        <div className="col-xl-12">
          <div className="form-group">
            <label>Title (*)</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter training title here"
              ref="title"
            />
          </div>
          <div className="form-group">
            <label>Description (*)</label>
            <CKEditor
              handleChangeDescription={this.props.handleChangeDescription}
            />
          </div>
          <div className="form-group">
            <label>Image </label>
            <input
              type="file"
              className="form-control"
              placeholder="Enter training title here"
              onChange={this.props.fileSelectHandler}
            />
          </div>
          <div className="form-group">
            <label>Required Training</label>
            <input type="text" className="form-control" placeholder="" />
          </div>
        </div>
        <div className="form-group col-xl-12">
          <button
            className="btn bg-root"
            style={{ width: "100%" }}
            onClick={this.handleSubmit}
          >
            CONTINUE
          </button>
        </div>
      </div>
    );
  }
}
export default Step1;
