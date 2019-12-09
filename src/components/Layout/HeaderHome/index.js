/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Navbar from "components/Layout/Navbar";
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
    action: bindActionCreators({}, dispatch)
  };
};

class HeaderHome extends Component {
  render() {
    return (
      <div className="hero-content">
        <Navbar />
        <div className="hero-content-overlay">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="hero-content-wrap flex flex-column justify-content-center align-items-start">
                  <header className="entry-header">
                    <h4>Get started with online courses</h4>
                    <h1>
                      best online
                      <br />
                      Learning system
                    </h1>
                  </header>

                  <div className="entry-content">
                    <p>
                      Excepteur sint occaecat cupidatat non proident, sunt in
                      culpa qui officia deserunt mollit anim id est laborum. Sed
                      ut perspiciatis unde omnis iste natus error sit voluptatem
                      accusantium doloremque laudantium
                    </p>
                  </div>

                  <footer className="entry-footer read-more">
                    <a href="#">read more</a>
                  </footer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HeaderHome);
