import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { getUsers } from "redux/action/user";
import Header from "components/Layout/Header";
function mapStateToProps(state) {
  return {
    store: {
      listUser: state.user.user.data,
      loading: state.user.user.loading
    }
  };
}

const mapDispatchToProps = dispatch => {
  return {
    action: bindActionCreators({ getUsers }, dispatch)
  };
};

class CoursePage extends Component {
  componentDidMount() {}
  render() {
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
                  <li>Courses</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-12 col-lg-8">
              <div className="featured-courses courses-wrap">
                <div className="row  ">
                  <div className="col-12 col-md-6  ">
                    <div className="course-content">
                      <figure className="course-thumbnail">
                        <a href="#">
                          <img src="/static/images/1.jpg" alt="" />
                        </a>
                      </figure>

                      <div className="course-content-wrap">
                        <header className="entry-header">
                          <h2 className="entry-title">
                            <a href="#">
                              The Complete Android Developer Course
                            </a>
                          </h2>

                          <div className="entry-meta flex flex-wrap align-items-center">
                            <div className="course-author">
                              <a href="#">Ms. Lara Croft </a>
                            </div>

                            <div className="course-date">July 21, 2018</div>
                          </div>
                        </header>

                        <footer className="entry-footer flex flex-wrap justify-content-between align-items-center">
                          <div className="course-cost">
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
                          </div>
                        </footer>
                      </div>
                    </div>
                  </div>

                  <div className="col-12 col-md-6  ">
                    <div className="course-content">
                      <figure className="course-thumbnail">
                        <a href="#">
                          <img src="/static/images/2.jpg" alt="" />
                        </a>
                      </figure>

                      <div className="course-content-wrap">
                        <header className="entry-header">
                          <h2 className="entry-title">
                            <a href="#">
                              The Ultimate Drawing Course Beginner to Advanced
                            </a>
                          </h2>

                          <div className="entry-meta flex flex-wrap align-items-center">
                            <div className="course-author">
                              <a href="#">Michelle Golden</a>
                            </div>

                            <div className="course-date">Mar 14, 2018</div>
                          </div>
                        </header>

                        <footer className="entry-footer flex flex-wrap justify-content-between align-items-center">
                          <div className="course-cost">
                            <span className="free-cost">Free</span>
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
                          </div>
                        </footer>
                      </div>
                    </div>
                  </div>

                  <div className="col-12 col-md-6  ">
                    <div className="course-content">
                      <figure className="course-thumbnail">
                        <a href="#">
                          <img src="/static/images/3.jpg" alt="" />
                        </a>
                      </figure>

                      <div className="course-content-wrap">
                        <header className="entry-header">
                          <h2 className="entry-title">
                            <a href="#">
                              The Complete Digital Marketing Course
                            </a>
                          </h2>

                          <div className="entry-meta flex flex-wrap align-items-center">
                            <div className="course-author">
                              <a href="#">Ms. Lucius</a>
                            </div>

                            <div className="course-date">Dec 18, 2018</div>
                          </div>
                        </header>

                        <footer className="entry-footer flex flex-wrap justify-content-between align-items-center">
                          <div className="course-cost">
                            $55 <span className="price-drop">$78</span>
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
                          </div>
                        </footer>
                      </div>
                    </div>
                  </div>

                  <div className="col-12 col-md-6  ">
                    <div className="course-content">
                      <figure className="course-thumbnail">
                        <a href="#">
                          <img src="/static/images/4.jpg" alt="" />
                        </a>
                      </figure>

                      <div className="course-content-wrap">
                        <header className="entry-header">
                          <h2 className="entry-title">
                            <a href="#">The Unreal Engine Developer Course</a>
                          </h2>

                          <div className="entry-meta flex flex-wrap align-items-center">
                            <div className="course-author">
                              <a href="#">Mr. John Wick</a>
                            </div>

                            <div className="course-date">Otc 17, 2018</div>
                          </div>
                        </header>

                        <footer className="entry-footer flex flex-wrap justify-content-between align-items-center">
                          <div className="course-cost">
                            <span className="free-cost">Free</span>
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
                          </div>
                        </footer>
                      </div>
                    </div>
                  </div>

                  <div className="col-12 col-md-6  ">
                    <div className="course-content">
                      <figure className="course-thumbnail">
                        <a href="#">
                          <img src="/static/images/5.jpg" alt="" />
                        </a>
                      </figure>

                      <div className="course-content-wrap">
                        <header className="entry-header">
                          <h2 className="entry-title">
                            <a href="#">
                              Progressive Web Apps (PWA) - The Complete Guide
                            </a>
                          </h2>

                          <div className="entry-meta flex flex-wrap align-items-center">
                            <div className="course-author">
                              <a href="#">Mr. Tom Redder</a>
                            </div>

                            <div className="course-date">Sep 14, 2018</div>
                          </div>
                        </header>

                        <footer className="entry-footer flex flex-wrap justify-content-between align-items-center">
                          <div className="course-cost">
                            $38 <span className="price-drop">$48</span>
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
                          </div>
                        </footer>
                      </div>
                    </div>
                  </div>

                  <div className="col-12 col-md-6  ">
                    <div className="course-content">
                      <figure className="course-thumbnail">
                        <a href="#">
                          <img src="/static/images/6.jpg" alt="" />
                        </a>
                      </figure>

                      <div className="course-content-wrap">
                        <header className="entry-header">
                          <h2 className="entry-title">
                            <a href="#">
                              Cryptocurrency Investment Course 2018
                            </a>
                          </h2>

                          <div className="entry-meta flex flex-wrap align-items-center">
                            <div className="course-author">
                              <a href="#">Russell Stephens</a>
                            </div>

                            <div className="course-date">Nov 06, 2018</div>
                          </div>
                        </header>

                        <footer className="entry-footer flex flex-wrap justify-content-between align-items-center">
                          <div className="course-cost">
                            <span className="free-cost">Free</span>
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
                          </div>
                        </footer>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pagination flex flex-wrap justify-content-between align-items-center">
                <div className="col-12 col-lg-4 order-2 order-lg-1 mt-3 mt-lg-0">
                  <ul className="flex flex-wrap align-items-center order-2 order-lg-1 p-0 m-0">
                    <li className="active">
                      <a href="#">1</a>
                    </li>
                    <li>
                      <a href="#">2</a>
                    </li>
                    <li>
                      <a href="#">3</a>
                    </li>
                    <li>
                      <a href="#">
                        <i className="fa fa-angle-right"></i>
                      </a>
                    </li>
                  </ul>
                </div>

                <div className="col-12 flex justify-content-start justify-content-lg-end col-lg-8 order-1 order-lg-2">
                  <div className="pagination-results flex flex-wrap align-items-center">
                    <p className="m-0">Showing 1â€“3 of 12 results</p>

                    <form>
                      <select>
                        <option>Show: 06</option>
                        <option>Show: 12</option>
                        <option>Show: 18</option>
                        <option>Show: 24</option>
                      </select>
                    </form>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-lg-4">
              <div className="sidebar">
                <div className="search-widget">
                  <form className="flex flex-wrap align-items-center">
                    <input type="search" placeholder="Search..." />
                    <button
                      type="submit"
                      className="flex justify-content-center align-items-center"
                    >
                      <i className="fa fa-search"></i>
                    </button>
                  </form>
                </div>

                <div className="cat-links">
                  <h2>Categories</h2>

                  <ul className="p-0 m-0">
                    <li>
                      <a href="#">Business</a>
                    </li>
                    <li>
                      <a href="#">Design</a>
                    </li>
                    <li>
                      <a href="#">Marketing</a>
                    </li>
                    <li>
                      <a href="#">MBA Courses</a>
                    </li>
                    <li>
                      <a href="#">Technology</a>
                    </li>
                    <li>
                      <a href="#">Web Development</a>
                    </li>
                  </ul>
                </div>

                <div className="latest-courses">
                  <h2>Latest Courses</h2>

                  <ul className="p-0 m-0">
                    <li className="flex flex-wrap justify-content-between align-items-center">
                      <img src="/static/images/t-1.jpg" alt="" />

                      <div className="content-wrap">
                        <h3>
                          <a href="#">
                            The Complete Financial Analyst Training
                          </a>
                        </h3>

                        <div className="course-cost free-cost">Free</div>
                      </div>
                    </li>

                    <li className="flex flex-wrap justify-content-between align-items-center">
                      <img src="/static/images/t-2.jpg" alt="" />

                      <div className="content-wrap">
                        <h3>
                          <a href="#">Complete Java MasterclassName</a>
                        </h3>

                        <div className="course-cost free-cost">Free</div>
                      </div>
                    </li>

                    <li className="flex flex-wrap justify-content-between align-items-center">
                      <img src="/static/images/t-3.jpg" alt="" />>
                      <div className="content-wrap">
                        <h3>
                          <a href="#">The Complete Digital Marketing Course</a>
                        </h3>

                        <div className="course-cost">$24</div>
                      </div>
                    </li>

                    <li className="flex flex-wrap justify-content-between align-items-center">
                      <img src="/static/images/t-4.jpg" alt="" />

                      <div className="content-wrap">
                        <h3>
                          <a href="#">Photoshop CC 2018 MasterclassName</a>
                        </h3>

                        <div className="course-cost">$18</div>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="ads">
                  <img src="/static/images/ads.jpg" alt="" />
                </div>

                <div className="popular-tags">
                  <h2>Popular Tags</h2>

                  <ul className="flex flex-wrap align-items-center p-0 m-0">
                    <li>
                      <a href="#">Creative</a>
                    </li>
                    <li>
                      <a href="#">Unique</a>
                    </li>
                    <li>
                      <a href="#">Photography</a>
                    </li>
                    <li>
                      <a href="#">ideas</a>
                    </li>
                    <li>
                      <a href="#">Wordpress Template</a>
                    </li>
                    <li>
                      <a href="#">startup</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="clients-logo">
          <div className="container">
            <div className="row">
              <div className="col-12 flex flex-wrap justify-content-center justify-content-lg-between align-items-center">
                <div className="logo-wrap">
                  <img src="/static/images/logo-1.png" alt="" />
                </div>

                <div className="logo-wrap">
                  <img src="/static/images/logo-2.png" alt="" />
                </div>

                <div className="logo-wrap">
                  <img src="/static/images/logo-3.png" alt="" />
                </div>

                <div className="logo-wrap">
                  <img src="/static/images/logo-4.png" alt="" />
                </div>

                <div className="logo-wrap">
                  <img src="/static/images/logo-5.png" alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CoursePage);
