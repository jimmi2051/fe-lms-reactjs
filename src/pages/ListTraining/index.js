import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Header from "components/Layout/Header";
import { getTrainingByUser } from "redux/action/training";
import _ from "lodash";
import AuthStorage from "utils/AuthStorage";
import moment from "moment";

const REACT_APP_URL_API = process.env.REACT_APP_URL_API;

function mapStateToProps(state) {
  return {
    store: {
      listTraining: state.listTraining.listTraining.data,
      loadingListTraining: state.listTraining.listTraining.loading
    }
  };
}

const mapDispatchToProps = dispatch => {
  return {
    action: bindActionCreators(
      {
        getTrainingByUser
      },
      dispatch
    )
  };
};

class ListTraining extends Component {
  componentDidMount() {
    this.handleGetTrainig(AuthStorage.userInfo._id);
  }
  handleGetTrainig = userId => {
    const payload = { id: userId };
    const { getTrainingByUser } = this.props.action;
    getTrainingByUser(payload);
  };
  render() {
    const { loadingListTraining, listTraining } = this.props.store;
    return (
      <div className="page-header">
        <Header titleHeader="Course Page" />
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="breadcrumbs">
                <ul className="flex flex-wrap align-items-center p-0 m-0">
                  <li>
                    <a href="#">
                      <i className="fa fa-home"></i> Home
                    </a>
                  </li>
                  <li>Training</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-xl-4">
              <div className="card text-white bg-primary mb-3">
                <div className="card-header">All Training</div>
                <div className="card-body">
                  <h5 className="card-title">Primary card title</h5>
                  <p className="card-text">
                    <ul>
                      <li>Item 1</li>
                      <li>Item 2</li>
                    </ul>
                  </p>
                </div>
              </div>
            </div>
            <div className="col-xl-8">
              <div className="featured-courses courses-wrap">
                <div className="row mx-m-25">
                  {!loadingListTraining &&
                    listTraining.map((item, index) => {
                      return (
                        <div key={index} className="col-12 col-md-6 px-25">
                          <div className="course-content">
                            <figure className="course-thumbnail">
                              <a href="#">
                                <img
                                  src={`${REACT_APP_URL_API}${item.thumbnail.url}`}
                                  alt=""
                                />
                              </a>
                            </figure>

                            <div className="course-content-wrap">
                              <header className="entry-header">
                                <h2 className="entry-title">
                                  <a href="#">{item.name}</a>
                                </h2>

                                <div className="entry-meta flex flex-wrap align-items-center">
                                  <div className="course-author">
                                    <a href="#">
                                      {item.users[0].firstName}{" "}
                                      {item.users[0].lastName}{" "}
                                    </a>
                                  </div>
                                  <div className="course-date">
                                    {moment(item.createdAt).format(
                                      "MMM. D, YYYY"
                                    )}
                                  </div>
                                </div>
                              </header>

                              <footer className="entry-footer flex flex-wrap justify-content-between align-items-center">
                                {/* <div className="course-cost">
                                  $45 <span className="price-drop">$68</span>
                                </div>

                                <div className="course-ratings flex justify-content-end align-items-center">
                                  <span className="fa fa-star checked"></span>
                                  <span className="fa fa-star checked"></span>
                                  <span className="fa fa-star checked"></span>
                                  <span className="fa fa-star checked"></span>
                                  <span className="fa fa-star-o"></span>

                                  <span className="course-ratings-count">
                                    (4 votes)
                                  </span>
                                </div> */}
                                <p> Comming soon !!! </p>
                              </footer>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
              <div className="row no-gutters">
                <div className="col-xl-12">
                  <button className="btn btn-success" style={{ width: "100%" }}>
                    CREATE NEW TRAINING
                  </button>
                </div>
              </div>
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
)(ListTraining);
