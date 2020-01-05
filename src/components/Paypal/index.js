/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import _ from "lodash";
import { withRouter } from "react-router";
import { PayPalButton } from "react-paypal-button-v2";
function mapStateToProps(state) {
  return {
    store: {}
  };
}

const mapDispatchToProps = dispatch => {
  return {
    action: bindActionCreators({}, dispatch)
  };
};
class Paypal extends Component {
  render() {
    return (
      <PayPalButton
        amount="0.01"
        // shippingPreference="NO_SHIPPING" // default is "GET_FROM_FILE"
        onSuccess={(details, data) => {
          alert("Transaction completed by " + details.payer.name.given_name);

          // OPTIONAL: Call your server to save the transaction
          return fetch("/paypal-transaction-complete", {
            method: "post",
            body: JSON.stringify({
              orderID: data.orderID
            })
          });
        }}
        options={{
          clientId:
            "ARPijDeMkFlplChs0NzgdcNduxr1P4_VDV-zqIoICmbd6pWp-cpMvCk5gVY5O4fGxM82GBTwUMTisN3t"
        }}
      />
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Paypal));
