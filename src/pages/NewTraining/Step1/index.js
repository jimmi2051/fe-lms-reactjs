import React, { Component } from "react";
import CKEditor from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
// import Base64UploadAdapter from "@ckeditor/ckeditor5-upload/src/adapters/base64uploadadapter";
const API_URL = process.env.REACT_APP_URL_API;
class MyUploadAdapter {
  constructor(loader) {
    // The file loader instance to use during the upload.
    this.loader = loader;
  }

  // Starts the upload process.
  upload() {
    return this.loader.file.then(
      file =>
        new Promise((resolve, reject) => {
          this._initRequest();
          this._initListeners(resolve, reject, file);
          this._sendRequest(file);
        })
    );
  }

  // Aborts the upload process.
  abort() {
    if (this.xhr) {
      this.xhr.abort();
    }
  }

  // Initializes the XMLHttpRequest object using the URL passed to the constructor.
  _initRequest() {
    const xhr = (this.xhr = new XMLHttpRequest());

    // Note that your request may look different. It is up to you and your editor
    // integration to choose the right communication channel. This example uses
    // a POST request with JSON as a data structure but your configuration
    // could be different.
    xhr.open("POST", `${API_URL}upload`, true);
    xhr.responseType = "json";
  }

  // Initializes XMLHttpRequest listeners.
  _initListeners(resolve, reject, file) {
    const xhr = this.xhr;
    const loader = this.loader;
    const genericErrorText = `Couldn't upload file: ${file.name}.`;

    xhr.addEventListener("error", () => reject(genericErrorText));
    xhr.addEventListener("abort", () => reject());
    xhr.addEventListener("load", () => {
      const response = xhr.response;

      // This example assumes the XHR server's "response" object will come with
      // an "error" which has its own "message" that can be passed to reject()
      // in the upload promise.
      //
      // Your integration may handle upload errors in a different way so make sure
      // it is done properly. The reject() function must be called when the upload fails.
      if (!response || response.error) {
        return reject(
          response && response.error ? response.error.message : genericErrorText
        );
      }

      // If the upload is successful, resolve the upload promise with an object containing
      // at least the "default" URL, pointing to the image on the server.
      // This URL will be used to display the image in the content. Learn more in the
      // UploadAdapter#upload documentation.
      let sliceResponse = response[0].url.split("/");
      console.log("sliceResponse", sliceResponse);
      const url = `${API_URL}${sliceResponse[3]}/${sliceResponse[4]}`;
      resolve({
        default: url
      });
    });

    // Upload progress when it is supported. The file loader has the #uploadTotal and #uploaded
    // properties which are used e.g. to display the upload progress bar in the editor
    // user interface.
    if (xhr.upload) {
      xhr.upload.addEventListener("progress", evt => {
        if (evt.lengthComputable) {
          loader.uploadTotal = evt.total;
          loader.uploaded = evt.loaded;
        }
      });
    }
  }

  // Prepares the data and sends the request.
  _sendRequest(file) {
    // Prepare the form data.
    const data = new FormData();

    data.append("files", file);

    // Important note: This is the right place to implement security mechanisms
    // like authentication and CSRF protection. For instance, you can use
    // XMLHttpRequest.setRequestHeader() to set the request headers containing
    // the CSRF token generated earlier by your application.

    // Send the request.
    this.xhr.send(data);
  }
}

class Step1 extends Component {
  handleSubmit = () => {
    const { title } = this.refs;
    this.props.handleStepOne(title.value);
  };
  render() {
    return (
      <div className="row no-gutters">
        <div className="col-xl-12">
          <div className="form-group">
            <label>Title (*)</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter training title here"
              ref="title"
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <CKEditor
              className="form-control"
              editor={ClassicEditor}
              data="<p>Hello from CKEditor 5!</p>"
              ref="description"
              // config={{
              //   ckfinder: {
              //     // Upload the images to the server using the CKFinder QuickUpload command.
              //     // uploadUrl: "http://35.224.2.121:8080/uploads"
              //   }
              // }}
              onInit={editor => {
                console.log("editor>>>", editor);
                editor.plugins.get(
                  "FileRepository"
                ).createUploadAdapter = loader => {
                  return new MyUploadAdapter(loader);
                };
              }}
              onChange={(event, editor) => {
                const data = editor.getData();
                console.log("data>>>>>", data);
                this.props.handleChangeDescription(data);
              }}
            />
          </div>
          <div className="form-group">
            <label>Image </label>
            <input
              type="file"
              className="form-control"
              placeholder="Enter training title here"
              onChange={this.props.fileSelectHandler}
            />
          </div>
          <div className="form-group">
            <label>Required Training</label>
            <input type="text" className="form-control" placeholder="" />
          </div>
        </div>
        <div className="form-group col-xl-12">
          <button
            className="btn bg-root"
            style={{ width: "100%" }}
            onClick={this.handleSubmit}
          >
            CONTINUE
          </button>
        </div>
      </div>
    );
  }
}
export default Step1;
