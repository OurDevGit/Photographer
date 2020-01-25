import React, { Component, Input } from 'react';
import UploadPhoto from '../UploadPhoto'
import  { Redirect } from 'react-router-dom'
import './style.less'
export default class MultipleImageUploadComponent extends Component {

    fileObj = [];
    fileArray = [];

    constructor(props) {
        super(props)
        this.state = {
            file: [null],
            disabled: true,
            uploadStatus: false
        }
        this.uploadMultipleFiles = this.uploadMultipleFiles.bind(this)
        this.uploadFiles = this.uploadFiles.bind(this)
    }

    uploadMultipleFiles(e) {
        this.fileObj = e.target.files;
        console.log(this.fileObj)
        for (let i = 0; i < this.fileObj.length; i++) {
            this.fileArray.push(URL.createObjectURL(this.fileObj[i]))
        }
        this.setState({ file: this.fileArray,
                        disabled: false })
        console.log(this.fileArray)
    }

    uploadFiles(e) {
        this.setState({
            uploadStatus: true
        });
    }

    render() {
    if(this.state.uploadStatus){
        // this.setState({
        //     uploadStatus: false
        // });
        return(
            // <Redirect to='/submitContent' />
            <div>
            <UploadPhoto />
            </div>
          )
    }else{
        return (
            <form>
                <div className="form-group multi-preview">
                    {(this.fileArray || []).map(url => (
                        <img src={url} alt="..." />
                    ))}
                </div>

                <div className="form-group">
                    <input type="file" className="form-control select_files" onChange={this.uploadMultipleFiles} multiple />
                </div>
                <button type="button" disabled={this.state.disabled} className="btn btn-danger btn-block upload_button" onClick={this.uploadFiles}>Next</button>
            </form >
        )
    }
        
    }
}