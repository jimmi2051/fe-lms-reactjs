/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { getUsers } from "redux/action/user";
import Header from "components/Layout/HeaderHome";
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

class HomePage extends Component {
  state = {};
  componentDidMount() {}

  render() {
    return (
      <>
        <Header />
        <div className="icon-boxes">
          <div className="container-fluid">
            <div className="flex flex-wrap align-items-stretch">
              <div className="icon-box">
                <div className="icon">
                  <span className="ti-user"></span>
                </div>

                <header className="entry-header">
                  <h2 className="entry-title">Learn From The Experts</h2>
                </header>

                <div className="entry-content">
                  <p>
                    Lorem Ipsum available, but the majority have suffered
                    alteration in some form, by injected humour.
                  </p>
                </div>

                <footer className="entry-footer read-more">
                  <a href="#">
                    read more<i className="fa fa-long-arrow-right"></i>
                  </a>
                </footer>
              </div>

              <div className="icon-box">
                <div className="icon">
                  <span className="ti-folder"></span>
                </div>

                <header className="entry-header">
                  <h2 className="entry-title">Book Library & Store</h2>
                </header>

                <div className="entry-content">
                  <p>
                    Lorem Ipsum available, but the majority have suffered
                    alteration in some form, by injected humour.
                  </p>
                </div>

                <footer className="entry-footer read-more">
                  <a href="#">
                    read more<i className="fa fa-long-arrow-right"></i>
                  </a>
                </footer>
              </div>

              <div className="icon-box">
                <div className="icon">
                  <span className="ti-book"></span>
                </div>

                <header className="entry-header">
                  <h2 className="entry-title">Best Course Online</h2>
                </header>

                <div className="entry-content">
                  <p>
                    Lorem Ipsum available, but the majority have suffered
                    alteration in some form, by injected humour.
                  </p>
                </div>

                <footer className="entry-footer read-more">
                  <a href="#">
                    read more<i className="fa fa-long-arrow-right"></i>
                  </a>
                </footer>
              </div>

              <div className="icon-box">
                <div className="icon">
                  <span className="ti-world"></span>
                </div>

                <header className="entry-header">
                  <h2 className="entry-title">Best Industry Leaders</h2>
                </header>

                <div className="entry-content">
                  <p>
                    Lorem Ipsum available, but the majority have suffered
                    alteration in some form, by injected humour.
                  </p>
                </div>

                <footer className="entry-footer read-more">
                  <a href="#">
                    read more<i className="fa fa-long-arrow-right"></i>
                  </a>
                </footer>
              </div>
            </div>
          </div>
        </div>
        <section className="featured-courses horizontal-column courses-wrap">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <header className="heading flex justify-content-between align-items-center">
                  <h2 className="entry-title">Featured Courses</h2>

                  <a className="btn mt-4 mt-sm-0" href="#">
                    view all
                  </a>
                </header>
              </div>
              <div className="col-12 col-lg-6">
                <div className="course-content flex flex-wrap justify-content-between align-content-lg-stretch">
                  <figure className="course-thumbnail">
                    <a href="#">
                      <img src="static/images/1.jpg" alt="" />
                    </a>
                  </figure>

                  <div className="course-content-wrap">
                    <header className="entry-header">
                      <div className="course-ratings flex align-items-center">
                        <span className="fa fa-star checked"></span>
                        <span className="fa fa-star checked"></span>
                        <span className="fa fa-star checked"></span>
                        <span className="fa fa-star checked"></span>
                        <span className="fa fa-star-o"></span>

                        <span className="course-ratings-count">(4 votes)</span>
                      </div>

                      <h2 className="entry-title">
                        <a href="#">The Complete Android Developer Course</a>
                      </h2>

                      <div className="entry-meta flex flex-wrap align-items-center">
                        <div className="course-author">
                          <a href="#">Ms. Lara Croft </a>
                        </div>

                        <div className="course-date">July 21, 2018</div>
                      </div>
                    </header>

                    <footer className="entry-footer flex justify-content-between align-items-center">
                      <div className="course-cost">
                        <span className="free-cost">Free</span>
                      </div>
                    </footer>
                  </div>
                </div>
              </div>

              <div className="col-12 col-lg-6">
                <div className="course-content flex flex-wrap justify-content-between align-content-lg-stretch">
                  <figure className="course-thumbnail">
                    <a href="#">
                      <img src="static/images/2.jpg" alt="" />
                    </a>
                  </figure>

                  <div className="course-content-wrap">
                    <header className="entry-header">
                      <div className="course-ratings flex align-items-center">
                        <span className="fa fa-star checked"></span>
                        <span className="fa fa-star checked"></span>
                        <span className="fa fa-star checked"></span>
                        <span className="fa fa-star checked"></span>
                        <span className="fa fa-star-o"></span>

                        <span className="course-ratings-count">(4 votes)</span>
                      </div>

                      <h2 className="entry-title">
                        <a href="#">Learn Photoshop, Web Design & Profitable</a>
                      </h2>

                      <div className="entry-meta flex flex-wrap align-items-center">
                        <div className="course-author">
                          <a href="#">Mr. John Wick</a>
                        </div>

                        <div className="course-date">Aug 21, 2018</div>
                      </div>
                    </header>

                    <footer className="entry-footer flex justify-content-between align-items-center">
                      <div className="course-cost">
                        $32 <span className="price-drop">$59</span>
                      </div>
                    </footer>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="about-section">
          <div className="container">
            <div className="row">
              <div className="col-12 col-lg-6 align-content-lg-stretch">
                <header className="heading">
                  <h2 className="entry-title">About Ezuca</h2>

                  <p>
                    Excepteur sint occaecat cupidatat non proident, sunt in
                    culpa qui officia deserunt mollit anim id est laborum. Sed
                    ut perspiciatis unde omnis iste natus error sit voluptatem
                    accusantium.
                  </p>
                </header>

                <div className="entry-content ezuca-stats">
                  <div className="stats-wrap flex flex-wrap justify-content-lg-between">
                    <div className="stats-count">
                      50<span>M+</span>
                      <p>STUDENTS LEARNING</p>
                    </div>

                    <div className="stats-count">
                      30<span>K+</span>
                      <p>ACTIVE COURSES</p>
                    </div>

                    <div className="stats-count">
                      340<span>M+</span>
                      <p>INSTRUCTORS ONLINE</p>
                    </div>

                    <div className="stats-count">
                      20<span>+</span>
                      <p>Country Reached</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12 col-lg-6 flex align-content-center mt-5 mt-lg-0">
                <div className="ezuca-video position-relative">
                  <div className="video-play-btn position-absolute">
                    <img src="static/images/video-icon.png" alt="Video Play" />
                  </div>

                  <img src="static/images/video-screenshot.png" alt="" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
