import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { updateContent } from "redux/action/content";
import moment from "moment";
import { Link } from "react-router-dom";
import Select from 'react-select';
import _ from "lodash"

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

const options = [
];

class PopupListContent extends Component {
  state = {
    description: "",
    selectedOption: null,
    courseSelected: {},
  };

  componentDidMount() {
    const { listCourseByUser } = this.props;
    this.processData(listCourseByUser)
  }

  processData = (listCourseByUser) => {
    listCourseByUser.map((item, index) => {
      options.push({ value: item, label: item.name })
    })
    this.setState({ courseSelected: options[0].value })
  }

  handleUpdateContent = content => {
    const { currentModule } = this.props;
    let modules = content.modules;
    modules.push(currentModule);
    const payload = {
      id: content._id,
      modules: modules
    };
    const { updateContent } = this.props.action;
    updateContent(payload);
  };

  handleClosePopup = () => {
    this.props.handleShowPopup();
  };

  handleChange = selectedOption => {
    if (!_.isNull(selectedOption)) {
      this.setState({ selectedOption, courseSelected: selectedOption.value });
      console.log(`Option selected:`, selectedOption);
    }
  };

  handleSubmit = () => {
    const { handleAddCourseToPath_ver2 } = this.props;
    handleAddCourseToPath_ver2(this.state.courseSelected);
    this.props.handleShowPopup();
  }

  render() {
    const { isShow, listCourseByUser } = this.props;
    const { listContent, loadingListContent } = this.props.store;
    const { selectedOption, courseSelected } = this.state;
    console.log("courseSelected", courseSelected)
    console.log(this.props);
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
                      // value={selectedOption}
                      className="basic-single"
                      classNamePrefix="select"
                      isSearchable={true}
                      onChange={this.handleChange}
                      options={options}
                      defaultValue={options[0]}
                      isClearable={true}
                      noOptionsMessage={inputValue => "No course found"}
                      placeholder="-- Select course --"
                    />
                  )}

                </div>
                <div className="col-xl-12 popup-course mt-4">
                  <div className="featured-courses courses-wrap">
                    <div className="row mx-m-25">
                      {!_.isEmpty(courseSelected) && (<div className="col-12 col-md-12 px-25">
                        <div className="course-content">
                          <figure className="course-thumbnail">
                            <Link to={`/admin/training/${courseSelected._id}`}>
                              <img
                                src={_.isEmpty(courseSelected.thumbnail) ?
                                  "https://be-lms.tk/uploads/9ee513ab17ae4d2ca9a7fa3feb3b2d67.png" :
                                  `${REACT_APP_URL_API}${courseSelected.thumbnail.url}`}
                                alt=""
                                height="200px"
                              />
                            </Link>
                          </figure>

                          <div className="course-content-wrap">
                            <header className="entry-header">
                              <h2 className="entry-title">
                                <Link to={`/admin/training/${courseSelected._id}`}>
                                  {courseSelected.name}
                                </Link>
                              </h2>

                              <div className="entry-meta flex flex-wrap align-items-center">
                                <div className="course-author">
                                  <a href="#">
                                    {courseSelected.users[0].firstName}{" "}
                                    {courseSelected.users[0].lastName}{" "}
                                  </a>
                                </div>
                                <div className="course-date">
                                  {moment(courseSelected.createdAt).format(
                                    "MMM. D, YYYY"
                                  )}
                                </div>
                              </div>
                            </header>
                          </div>
                        </div>
                      </div>)}
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
              >
                OK
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
)(PopupListContent);
