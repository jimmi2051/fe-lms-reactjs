import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { updateContent } from "redux/action/content";
import moment from "moment";
import { Link } from "react-router-dom";
import Select from "react-select";
import _ from "lodash";

const REACT_APP_URL_API = process.env.REACT_APP_URL_API;

function mapStateToProps(state) {
  return {
    store: {
      listContent: state.listContent.listContent.data,
      loadingListContent: state.listContent.listContent.loading
    }
  };
}

const mapDispatchToProps = dispatch => {
  return {
    action: bindActionCreators({ updateContent }, dispatch)
  };
};

let options = [];

class PopupListContent extends Component {
  state = {
    description: "",
    selectedOption: null,
    moduleSelected: {}
  };

  componentDidMount() {
    const { listModuleByUser } = this.props;
    this.processData(listModuleByUser);
  }

  processData = listModuleByUser => {
    options = [];
    listModuleByUser.map((item, index) => {
      options.push({ value: item, label: item.name });
    });
    // this.setState({ moduleSelected: options[0].value });
  };

  handleClosePopup = () => {
    this.props.handleShowPopup();
  };

  handleChange = selectedOption => {
    if (!_.isNull(selectedOption)) {
      this.setState({ selectedOption, moduleSelected: selectedOption.value });
    }
  };

  handleSubmit = () => {
    const { handleAddModuleToCourse_ver2 } = this.props;
    handleAddModuleToCourse_ver2(this.state.moduleSelected);
    this.setState({ moduleSelected: {}, selectedOption: null });
    this.props.handleShowPopup();
  };

  render() {
    const { isShow } = this.props;
    const { moduleSelected, selectedOption } = this.state;
    return (
      <div
        className={`modal bd-example-modal-lg fade ${isShow ? "show" : ""}`}
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
                List course
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
                <div className="col-xl-12">
                  {options.length > 0 && (
                    <Select
                      value={selectedOption}
                      className="basic-single"
                      classNamePrefix="select"
                      isSearchable={true}
                      onChange={this.handleChange}
                      options={options}
                      // defaultValue={options[0]}
                      isClearable={true}
                      noOptionsMessage={inputValue => "No module found"}
                      placeholder="-- Search by module name --"
                    />
                  )}
                </div>
                <div className="col-xl-12 popup-course mt-4">
                  <div className="featured-courses courses-wrap">
                    <div className="row  ">
                      {!_.isEmpty(moduleSelected) && (
                        <div className="col-12 col-md-12  ">
                          <div className="course-content">
                            <figure className="course-thumbnail">
                              {/* <Link
                                to={`/admin/training/${moduleSelected._id}`}
                              > */}
                              <img
                                src={
                                  _.isEmpty(moduleSelected.thumbnail)
                                    ? "https://be-lms.tk/uploads/9ee513ab17ae4d2ca9a7fa3feb3b2d67.png"
                                    : `${REACT_APP_URL_API}${moduleSelected.thumbnail.url}`
                                }
                                alt=""
                                height="200px"
                              />
                              {/* </Link> */}
                            </figure>

                            <div className="course-content-wrap">
                              <header className="entry-header">
                                <h2 className="entry-title">
                                  {/* <Link
                                    to={`/admin/training/${moduleSelected._id}`}
                                  > */}
                                  {moduleSelected.name}
                                  {/* </Link> */}
                                </h2>

                                <div className="entry-meta flex flex-wrap align-items-center">
                                  <div className="course-author">
                                    <label>
                                      Created date:{" "}
                                      {moment(moduleSelected.createdAt).format(
                                        "DD/MM/YYYY"
                                      )}
                                    </label>
                                  </div>
                                </div>
                              </header>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn bg-root"
                data-dismiss="modal"
                onClick={this.handleSubmit}
                disabled={_.isEmpty(moduleSelected)}
              >
                Add
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

export default connect(mapStateToProps, mapDispatchToProps)(PopupListContent);
