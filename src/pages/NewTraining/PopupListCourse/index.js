import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { updateContent } from "redux/action/content";
import moment from "moment";
import { Link } from "react-router-dom";
import Select from 'react-select';
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
  { value: 'chocolate', label: 'First Course by Thanh Ly' },
  { value: 'strawberry', label: 'Two Course by Thanh Ly' },
  { value: 'vanilla', label: 'Three Course by Thanh Ly' },
];

class PopupListContent extends Component {
  state = {
    description: "",
    fileToUpload: [],
    selectedOption: null,
  };
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
    this.setState({ selectedOption });
    console.log(`Option selected:`, selectedOption);
  };

  render() {
    const { isShow, listCourseByUser } = this.props;
    const { listContent, loadingListContent } = this.props.store;
    const {selectedOption} = this.state;
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
                <div className="col-xl-4">
                  <Select
                    value={selectedOption}
                    onChange={this.handleChange}
                    options={options}
                  />
                </div>
                <div className="col-xl-8 popup-course">
                  <div className="featured-courses courses-wrap">
                    <div className="row mx-m-25">
                      <div className="col-12 col-md-12 px-25">
                        <div className="course-content">
                          <figure className="course-thumbnail">
                            <Link to={`/admin/training/${listCourseByUser[0]._id}`}>
                              <img
                                src={`https://be-lms.tk/uploads/7c4a819ba68f460180ebc49637e1d326.jpg`}
                                alt=""
                                height="200px"
                              />
                            </Link>
                          </figure>

                          <div className="course-content-wrap">
                            <header className="entry-header">
                              <h2 className="entry-title">
                                <Link to={`/admin/training/${listCourseByUser[0]._id}`}>
                                  {listCourseByUser[0].name}
                                </Link>
                              </h2>

                              <div className="entry-meta flex flex-wrap align-items-center">
                                <div className="course-author">
                                  <a href="#">
                                    {listCourseByUser[0].users[0].firstName}{" "}
                                    {listCourseByUser[0].users[0].lastName}{" "}
                                  </a>
                                </div>
                                <div className="course-date">
                                  {moment(listCourseByUser[0].createdAt).format(
                                    "MMM. D, YYYY"
                                  )}
                                </div>
                              </div>
                            </header>
                          </div>
                        </div>
                      </div>
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
                onClick={this.handleClosePopup}
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
