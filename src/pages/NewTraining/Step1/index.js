import React, { Component } from "react";
import CKEditor from "components/CKEditor";

class Step1 extends Component {
  state = {
    nameFile: "",
    imgSrc: ""
  };
  handleSelectFile = e => {
    const reader = new FileReader();
    const file = e.target.files[0];
    const url = reader.readAsDataURL(file);

    reader.onloadend = function(e) {
      this.setState({
        imgSrc: [reader.result]
      });
    }.bind(this);

    this.props.fileSelectHandler(e);
    this.setState({ nameFile: e.target.files[0].name });
  };
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
            <label>Thumbnail </label>
            <div className="custom-file">
              <input
                type="file"
                class="custom-file-input"
                onChange={this.handleSelectFile}
                id="customFile"
                lang="en"
              />
              <label className="custom-file-label" htmlFor="customFile">
                {this.state.nameFile !== ""
                  ? this.state.nameFile
                  : "Choose file"}
              </label>
            </div>
            {/* <input
              type="file"
              className="form-control-file"
              placeholder="Enter training title here"
              
            /> */}
            {this.state.imgSrc !== "" && (
              <div className="mt-3 ">
                <img src={this.state.imgSrc} alt="" />
              </div>
            )}
          </div>
          <div className="form-group">
            <label>Required Training</label>
            <input
              disabled
              type="text"
              className="form-control"
              placeholder="Feature will coming soon. "
            />
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
