import React, { Component, Input } from 'react';
import UploadPhoto from '../UploadPhoto'
import  { Redirect } from 'react-router-dom'
import './style.less'
import { uploadPhotos } from '../../../util/APIUtils';
import axios from "axios"
export default class MultipleImageUploadComponent extends Component {

    fileObj = [];
    fileArray = [];
    file = [];
    constructor(props) {
        super(props)
        this.state = {
            files: [],
            disabled: true,
        }
        this.uploadMultipleFiles = this.uploadMultipleFiles.bind(this)
        this.uploadFiles = this.uploadFiles.bind(this)
    }

    getBase64 = file => {
        return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
        });
    }

    uploadMultipleFiles(e) {
        this.fileObj = e.target.files;
        console.log(this.fileObj)
        for (let i = 0; i < this.fileObj.length; i++) {
            this.fileArray.push(URL.createObjectURL(this.fileObj[i]));
            this.file.push(this.fileObj[i]);
        }
        this.setState({ 
                        files: this.file,
                        disabled: false,
                    })
    }
    

    uploadFiles(e) {

        const uploadRequest = {
            collection: "",
            files: this.state.files
        };
        const formData = new FormData();
        formData.append('collection', new Blob([JSON.stringify("prova_123")], {
            type: "application/json"}));
        for (let i = 0; i < this.state.files.size; i++) {
            formData.append('files', this.state.files[i]);
        }
        // formData.append('files', this.state.files);
        // formData.append("collection", "");
        // console.log(" Upload Request ",uploadRequest);
        // test example
        console.log("upload request", formData)
        uploadPhotos(formData)
        .then(response => {
            console.log(response)
            this.setState({
                uploadStatus: true
            });
        }).catch(error => {
            console.log(error)
        });
    }

    render() {
        if(this.state.uploadStatus){
            console.log(this.state.uploadStatus)
            return(
                <Redirect to='/submitContent' />
            )
        }else{
            return (
                <form encType='multipart/form-data'>
                    <div className="form-group multi-preview">
                        {(this.fileArray || []).map(url => (
                            <img src={url} alt="..." />
                        ))}
                    </div>

                    <div className="form-group">
                        <input type="file" className="form-control select_files" name="file" onChange={this.uploadMultipleFiles} multiple />
                    </div>
                    <button type="button" disabled={this.state.disabled} className="btn btn-danger btn-block upload_button" onClick={this.uploadFiles}>Next</button>
                </form >
            )
        }
    }
}

// files: [
//     {
//         name: "1.png",
//         size: 1392192,
//         type: "image/png"
//     }
// ]