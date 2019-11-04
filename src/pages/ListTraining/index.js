import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Header from "components/Layout/Header";
import {
  getTrainingByUser,
  getAllCategory
} from "redux/action/training";
import _ from "lodash";
import AuthStorage from "utils/AuthStorage";
import moment from "moment";
import { Link } from "react-router-dom";
import Pagination from "react-js-pagination";
import Loading from "components/Loading"
const REACT_APP_URL_API = process.env.REACT_APP_URL_API;
const ENTER_KEY = 13;
function mapStateToProps(state) {
  return {
    store: {
      listTraining: state.listTraining.listTraining.data,
      loadingListTraining: state.listTraining.listTraining.loading,
      categoryAll: state.trainingAll.categoryAll.data,
      loadingCategoryAll: state.trainingAll.categoryAll.loading,
    }
  };
}

const mapDispatchToProps = dispatch => {
  return {
    action: bindActionCreators(
      {
        getTrainingByUser,
        getAllCategory
      },
      dispatch
    )
  };
};

class ListTraining extends Component {
  state = {
    totalPage: -1,
    keySearch: "",
    categoryId: "",
    activePage: 1,
    startItemPage: 0,
    itemPerPage: 4
  }
  componentDidMount() {
    this.handleGetTraining(AuthStorage.userInfo._id);
    this.handleGetCategory();
    this.handleGetTotalPage(AuthStorage.userInfo._id)
  }

  handleGetTotalPage = (userId) => {
    const { keySearch, categoryId } = this.state;
    fetch(`https://be-lms.tk/trainings?${keySearch !== "" ? `name_contains=${keySearch}&` : ``}${categoryId !== "" ? `categorytrainings._id=${categoryId}&` : ""}users._id=${userId}`)
      .then(response => { return response.json() })
      .then(result => {
        this.setState({ totalPage: result.length })
      })
  }

  handleGetCategory = () => {
    const payload = {};
    const { getAllCategory } = this.props.action;
    getAllCategory(payload);
  };

  handleGetTraining = userId => {
    const { keySearch, startItemPage, itemPerPage, categoryId } = this.state;
    const payload = { id: userId, keySearch, startItemPage, itemPerPage, categoryId };
    const { getTrainingByUser } = this.props.action;
    getTrainingByUser(payload);
  };

  handleInputSearch = (e) => {
    this.setState({ keySearch: e.target.value });
  }

  beginSearch = e => {
    if (e.keyCode === ENTER_KEY) {
      this.setState({ startItemPage: 0 }, () => {
        this.handleGetTotalPage(AuthStorage.userInfo._id);
        this.handleGetTraining(AuthStorage.userInfo._id);
      })
    }
  };

  handlePageChange(pageNumber) {
    let { startItemPage, itemPerPage } = this.state;
    startItemPage = (pageNumber - 1) * itemPerPage;
    this.setState({ activePage: pageNumber, startItemPage }, () => {
      this.handleGetTraining(AuthStorage.userInfo._id);
    });
  }

  fitlerCategory = (categoryId) => {
    this.setState({ categoryId, startItemPage: 0 }, () => {
      this.handleGetTotalPage(AuthStorage.userInfo._id)
      this.handleGetTraining(AuthStorage.userInfo._id);
    });
  }

  render() {
    const { categoryId } = this.state;
    const {
      loadingListTraining,
      listTraining,
      loadingCategoryAll,
      categoryAll
    } = this.props.store;
    return (
      <div className="page-header">
        <Header titleHeader="MANAGE TRAINING" />
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="breadcrumbs">
                <ul className="flex flex-wrap align-items-center p-0 m-0">
                  <li>
                    <Link to="/">
                      <i className="fa fa-home"></i> Home
                    </Link>
                  </li>
                  <li>Manage Training</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="row courses-wrap-custom">
            <div className="col-xl-4">
              <div className="sidebar" style={{ height: "100%", minHeight: "600px" }}>
                <div className="cat-links">
                  <h2>Categories</h2>
                  <div className="form-group">
                    <input value={this.state.keySearch} onKeyDown={this.beginSearch} className="form-control" onChange={this.handleInputSearch} placeholder="Search by training name." />
                  </div>
                  <ul className="p-0 m-0">
                    {!loadingCategoryAll &&
                      categoryAll.map(
                        (item, index) => {
                          return (
                            <li key={index}>
                              <Link className={`${categoryId === item._id ? "font-weight-bold" : ""}`} to="#"
                                onClick={(e) => { e.preventDefault(); this.fitlerCategory(item._id) }}
                              >{item.name}</Link>
                            </li>
                          );
                        }
                      )}
                    <li>
                      <Link to="#" className={`${categoryId === "" ? "font-weight-bold" : ""}`} onClick={(e) => { e.preventDefault(); this.fitlerCategory("") }}>VIEW ALL</Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-xl-8">
              <div className="featured-courses courses-wrap">
                <div className="row no-gutters mb-3">
                  <div className="col-xl-12">
                    <Link
                      to={`/admin/new-training`}
                      className="btn btn-success text-white"
                    >
                      CREATE NEW TRAINING
                  </Link>
                  </div>
                </div>
                <div className="row mx-m-25">
                  {!loadingListTraining ?
                    listTraining.map((item, index) => {
                      let starOfTraining = [];
                      for (let i = 0; i < parseInt(item.level); i++) {
                        starOfTraining.push(i);
                      }
                      return (
                        <div key={index} className="col-12 col-md-6 px-25">
                          <div className="course-content">
                            <figure className="course-thumbnail">
                              <Link to={`/admin/training/${item._id}`}>
                                <img
                                  src={`${REACT_APP_URL_API}${item.thumbnail.url}`}
                                  alt=""
                                />
                              </Link>
                            </figure>

                            <div className="course-content-wrap">
                              <header className="entry-header">
                                <h2 className="entry-title">
                                  <Link to={`/admin/training/${item._id}`}>
                                    {item.name}
                                  </Link>
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

                              <footer className="entry-footer flex flex-wrap align-items-center">
                                <h4 className="t-level mb-0">Level: </h4>
                                <div className="level pl-3">
                                  {item.level !== "" && starOfTraining.map((item, index) => {
                                    return (
                                      <span key={index} className="fa fa-star checked"></span>
                                    )
                                  })}
                                </div>
                              </footer>
                            </div>
                          </div>
                        </div>
                      );
                    }) : (
                      <div className="col-xl-12 mt-3">
                        <Loading classOption="align-center-spinner" />
                      </div>
                    )}
                </div>
              </div>
              <div className="row">
                <div className="col-xl-12">
                  <Pagination
                    activePage={this.state.activePage}
                    itemsCountPerPage={this.state.itemPerPage}
                    totalItemsCount={this.state.totalPage}
                    pageRangeDisplayed={5}
                    onChange={this.handlePageChange.bind(this)}
                  />
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
