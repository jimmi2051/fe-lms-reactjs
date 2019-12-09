import React, { Component } from "react";
import CKEditor from "components/CKEditor";
import Loading from "components/Loading";
class Step1 extends Component {
  state = {
    nameFile: "",
    imgSrc: "",
    isLoading: false
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
    const { title, subTitle } = this.refs;
    this.setState({ isLoading: true });
    this.props.handleStepOne(title.value, subTitle.value, () => {
      this.setState({ isLoading: false });
    });
  };
  render() {
    const {
      handleChangeLevel,
      categoryAll,
      loadingCategoryAll,
      idxCategory,
      handleChangeCategory
    } = this.props;
    const { isLoading } = this.state;
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
            <label>Subtitle (*)</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter training subtitle here"
              ref="subTitle"
            />
          </div>
          <div className="form-group">
            <label>Description (*)</label>
            <CKEditor
              handleChangeDescription={this.props.handleChangeDescription}
              defaultData="Enter data in here..."
            />
          </div>
          <div className="form-group">
            <label>Thumbnail </label>
            <div className="custom-file">
              <input
                type="file"
                className="custom-file-input"
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
            {this.state.imgSrc !== "" && (
              <div className="mt-3 ">
                <img src={this.state.imgSrc} alt="" />
              </div>
            )}
          </div>
          <div className="form-group">
            <label>Select level for training (*)</label>
            <select
              className="form-control"
              defaultValue="3"
              onChange={e => {
                handleChangeLevel(e.target.value);
              }}
            >
              <option value="1">1 - Basic</option>
              <option value="2">2 - Semi-medium</option>
              <option value="3">3 - Medium</option>
              <option value="4">4 - Semi-hard</option>
              <option value="5">5 - Hard</option>
            </select>
            <small className="form-text text-muted">
              (*) The difficulty increases gradually from 1 to 5.
            </small>
          </div>
          <div className="form-group">
            <label>Category (*)</label>
            <select
              className="form-control"
              value={idxCategory}
              onChange={e => {
                handleChangeCategory(e.target.value);
              }}
            >
              <option value="-1">-- Select category --</option>
              {!loadingCategoryAll &&
                categoryAll.map((item, index) => {
                  return (
                    <option key={index} value={index}>
                      {item.name}
                    </option>
                  );
                })}
            </select>
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
            disabled={isLoading}
          >
            {isLoading ? (
              <Loading color="#ffffff" classOption="align-center-spinner" />
            ) : (
              "CONTINUE"
            )}
          </button>
        </div>
      </div>
    );
  }
}
export default Step1;
