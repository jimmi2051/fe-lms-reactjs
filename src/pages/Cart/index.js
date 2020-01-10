/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Header from "components/Layout/Header";

import { withRouter } from "react-router";

import { Link } from "react-router-dom";
import { removeCart } from "redux/action/cart";
import _ from "lodash";
const REACT_APP_URL_API = process.env.REACT_APP_URL_API;
function mapStateToProps(state) {
  return {
    store: {
      auth: state.auth,
      cart: state.cart.cart
    }
  };
}

const mapDispatchToProps = dispatch => {
  return {
    action: bindActionCreators({ removeCart }, dispatch)
  };
};

class Cart extends Component {
  state = {
    errors: {},
    loading: false
  };
  componentDidMount() { }

  componentWillReceiveProps(nextProps) { }

  handleRemoveCart = training => {
    const payload = { training };
    const { removeCart } = this.props.action;
    removeCart(payload);
  }

  render() {
    const { loading } = this.state;
    const { cart } = this.props.store;
    return (
      <div className="page-header">
        <Header titleHeader="Cart Page" />
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
                  <li>
                    <a href="">My Cart</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="row justify-content-center pb-5 pt-2">
            <div className="col-xl-12">
              <table className="table table-cart">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Thumbnail</th>
                    <th>Author</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cart &&
                    cart.length > 0 &&
                    cart.map((item, index) => {
                      return (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td className="table-td-name">{item.name}</td>
                          <td>
                            <img
                              src={
                                _.isEmpty(item.thumbnail)
                                  ? "https://be-lms.tk/uploads/9ee513ab17ae4d2ca9a7fa3feb3b2d67.png"
                                  : `${REACT_APP_URL_API}${item.thumbnail.url}`
                              }
                              alt=""
                            />
                          </td>
                          <td>
                            {item.users && item.users.length > 0 ? (
                              <a href="#">
                                {item.users[0].firstName}{" "}
                                {item.users[0].lastName}{" "}
                              </a>
                            ) : (
                                <a href="#">Unknow author</a>
                              )}
                          </td>
                          <td>
                            <button className="btn bg-root" type="button" onClick={() => { this.handleRemoveCart(item) }}>
                              {" "}
                              <i className="fa fa-remove" />{" "}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Cart));
