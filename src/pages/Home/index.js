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

const Papa = require("papaparse/papaparse.min.js");

class HomePage extends Component {
  state = {
    quiz: []
  }
  componentDidMount() { }

  handleReadFileCSV = () => {

  }

  handleSelectFile = e => {
    const reader = new FileReader();
    const file = e.target.files[0];
    Papa.parse(file, {
      header: true,
      download: true,
      skipEmptyLines: true,
      // Here this is also available. So we can call our custom class method
      complete: result => {
        console.log("result>>>",result);
        this.setState({quiz: result.data});
      }
    });
    reader.readAsBinaryString(file);
    reader.onload = function () {
      console.log(reader.result);
    }
    // fetch(reader.result)
    // .then(response => {
    //  console.log("response",response);
    // })
    // .then(result => {
    //   console.log("result>>>",result);
    // })
  };

  render() {
    console.log("this",this.state)
    return (
      <>
        <Header />;
        <input type="file" onChange={this.handleSelectFile} />
        <button onClick={this.handleReadFileCSV}></button>
      </>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomePage);
