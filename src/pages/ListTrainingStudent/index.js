import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Header from "components/Layout/Header";
import {
  getAllTraining,
  getAllCategory,
  addToMyTraining
} from "redux/action/training";
import _ from "lodash";
import AuthStorage from "utils/AuthStorage";
import moment from "moment";
import { Link } from "react-router-dom";
import Loading from "components/Loading";
import PopupSuccess from "pages/ListTrainingStudent/PopupSuccess"
import Pagination from "react-js-pagination";
const REACT_APP_URL_API = process.env.REACT_APP_URL_API;
const ENTER_KEY = 13;
function mapStateToProps(state) {
  return {
    store: {
      trainingAll: state.trainingAll.trainingAll.data,
      loadingTrainingAll: state.trainingAll.trainingAll.loading,
      categoryAll: state.trainingAll.categoryAll.data,
      loadingCategoryAll: state.trainingAll.categoryAll.loading,
      isAddTraining: state.isAddTraining.isAddTraining.data,
      loadingAddTraining: state.isAddTraining.isAddTraining.loading,
    }
  };
}

const mapDispatchToProps = dispatch => {
  return {
    action: bindActionCreators(
      {
        getAllTraining,
        getAllCategory,
        addToMyTraining
      },
      dispatch
    )
  };
};

class ListTraining extends Component {
  state = {
    addSuccess: false,
    trainingExists: {},
    keySearch: "",
    startItemPage: 0,
    itemPerPage: 3,
    totalPage: -1,
    activePage: 1
  }
  componentDidMount() {
    this.handleGetTraining();
    this.handleGetCategory();
    fetch("https://be-lms.tk/trainings/count")
      .then(response => { return response.json() })
      .then(result => {
        this.setState({ totalPage: result })
      })
  }

  handleGetTraining = () => {
    const { keySearch, startItemPage, itemPerPage } = this.state;
    const payload = { keySearch, startItemPage, itemPerPage };
    const { getAllTraining } = this.props.action;
    getAllTraining(payload, () => {
      const { trainingAll } = this.props.store;
    });
  };

  handleGetCategory = () => {
    const payload = {};
    const { getAllCategory } = this.props.action;
    getAllCategory(payload);
  };

  handleAddToMyTraining = (training) => {
    this.setState({ trainingExists: {} });
    if (this.checkTrainingExists(training._id)) {
      this.setState({ trainingExists: training });
    }
    else {
      const user = AuthStorage.userInfo;
      const { addToMyTraining } = this.props.action;
      const payload = {
        training,
        user,
      }
      addToMyTraining(payload, () => {
        const { isAddTraining } = this.props.store;
        if (isAddTraining._id) {
          this.setState({ addSuccess: true })
          let nextAuthStorage = AuthStorage.value;
          let tempActivity = isAddTraining;
          tempActivity.trainings[0] = tempActivity.trainings[0]._id;
          tempActivity.users[0] = tempActivity.users[0]._id;
          nextAuthStorage.user.activityusers.push(tempActivity);
          AuthStorage.value = nextAuthStorage;
        }
      });
    }
  }

  processDataToListCat = (categories) => {
    let listMenu = [];
    categories.map((category, index) => {
      let menuLv1 = {}
      menuLv1.key = `first-level-node-${index + 1}`;
      menuLv1.label = `${category.name}`;
      menuLv1.value = category;
      menuLv1.nodes = [];
      category.trainings.map((training, indexTraining) => {
        let menuLv2 = {}
        menuLv2.key = `second-level-node-${indexTraining + 1}`;
        menuLv2.label = training.name
        menuLv2.value = training
        menuLv2.nodes = addToMyTraining
        menuLv1.nodes.push(menuLv2);
      })
      listMenu.push(menuLv1);
    })
    return listMenu;
  }

  handleClosePopup = () => {
    this.setState({ addSuccess: false });
  }

  checkTrainingExists = (trainingId) => {
    const idx = _.findIndex(AuthStorage.userInfo.activityusers, activity => activity.trainings[0] === trainingId)
    if (idx > -1) {
      return true;
    }
    return false;
  }

  handleInputSearch = (e) => {
    this.setState({ keySearch: e.target.value });
  }

  beginSearch = e => {
    if (e.keyCode === ENTER_KEY) {
      this.setState({ startItemPage: 0, itemPerPage: 3 }, () => {
        this.handleGetTraining();
      })
    }
  };

  handlePageChange(pageNumber) {
    let { startItemPage, itemPerPage } = this.state;
    startItemPage = (pageNumber - 1) * itemPerPage;
    this.setState({ startItemPage }, () => {
      this.handleGetTraining();
    });
  }

  render() {
    const {
      loadingTrainingAll,
      trainingAll,
      loadingCategoryAll,
      categoryAll
    } = this.props.store;
    const { addSuccess, trainingExists, keySearch } = this.state;

    if (loadingCategoryAll) {
      return (<div className="page-header">
        <Header titleHeader="LIST TRAINING" />
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
                  <li>Training</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="row courses-wrap-custom">
            <div className="col-xl-12">
              <Loading classOption="align-center-spinner" />
            </div>
          </div>
        </div>
      </div>
      )
    }

    const listMenu = this.processDataToListCat(categoryAll);

    return (
      <div className="page-header">
        <PopupSuccess isShow={addSuccess} handleClosePopup={this.handleClosePopup} />
        <Header titleHeader="LIST TRAINING" />
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
                  <li>Training</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="row courses-wrap-custom">
            <div className="col-xl-4">
              <div className="sidebar" style={{ height: "100%" }}>
                <div className="cat-links">
                  <h2>Categories</h2>
                  <div className="form-group">
                    <input onKeyDown={this.beginSearch} className="form-control" onChange={this.handleInputSearch} placeholder="Search by training name." />
                  </div>
                  <ul className="p-0 m-0">
                    {!loadingCategoryAll &&
                      categoryAll.map(
                        (item, index) => {
                          return (
                            <li key={index}>
                              <Link to="#">{item.name}</Link>
                            </li>
                          );
                        }
                      )}
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-xl-8">
              <div className="featured-courses courses-wrap">
                <div className="row mx-m-25">
                  {!loadingTrainingAll ?
                    trainingAll.map((item, index) => {
                      return (
                        <div key={index} className="col-12 col-md-6 px-25">
                          <div className="course-content">
                            <figure className="course-thumbnail">
                              <Link to={`/admin/training/${item._id}`}>
                                <img
                                  src={
                                    _.isEmpty(item.thumbnail)
                                      ? "https://be-lms.tk/uploads/9ee513ab17ae4d2ca9a7fa3feb3b2d67.png"
                                      : `${REACT_APP_URL_API}${item.thumbnail.url}`
                                  }
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
                                    {item.users && item.users.length > 0 ? (
                                      <a href="#">
                                        {item.users[0].firstName}{" "}
                                        {item.users[0].lastName}{" "}
                                      </a>
                                    ) : <a href="#">Unknow author</a>}

                                  </div>
                                  <div className="course-date">
                                    {moment(item.createdAt).format(
                                      "MMM. D, YYYY"
                                    )}
                                  </div>
                                  {trainingExists === item && (
                                    <div className="text-left">
                                      <label className="text-danger mb-0">This training have already in your list. </label>
                                    </div>
                                  )}
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
                                <button type="button" onClick={() => { this.handleAddToMyTraining(item) }} className="btn bg-root">Add to my training</button>
                              </footer>
                            </div>
                          </div>
                        </div>
                      );
                    }) : (
                      <div className="col-xl-12">
                        <Loading classOption="align-center-spinner" />
                      </div>
                    )}

                </div>
                <div className="row">
                  <div className="col-xl-12">
                    {keySearch === "" && (
                      <Pagination
                        activePage={this.state.activePage}
                        itemsCountPerPage={this.state.itemPerPage}
                        totalItemsCount={this.state.totalPage}
                        pageRangeDisplayed={5}
                        onChange={this.handlePageChange.bind(this)}
                      />
                    )}

                  </div>
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
