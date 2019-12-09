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

class Header extends Component {
  render() {
    return (
      <div className="hero-content">
        <Navbar />
        <div className="page-header-overlay">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <header className="entry-header">
                  <h1>{this.props.titleHeader}</h1>
                </header>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
