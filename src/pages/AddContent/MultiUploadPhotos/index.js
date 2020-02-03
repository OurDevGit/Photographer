import React, { Component, Input } from 'react';
import UploadPhoto from '../UploadPhoto'
import  { Redirect } from 'react-router-dom'
import './style.less'
import { uploadPhotos } from '../../../util/APIUtils';
import axios from "axios"
import { API_BASE_URL, PHOTO_LIST_SIZE, ACCESS_TOKEN } from '../../../constants';
import LoadingIndicator  from '../../../common/LoadingIndicator';
export default class MultipleImageUploadComponent extends Component {

    fileObj = [];
    fileArray = [];
    file = [];
    constructor(props) {
        super(props)
        this.state = {
            files: [],
            disabled: true,
            isLoading: false,
        }
        this.uploadMultipleFiles = this.uploadMultipleFiles.bind(this)
        this.uploadFiles = this.uploadFiles.bind(this)
        this.goSubmitContent = this.goSubmitContent.bind(this)
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
        this.setState({
            isLoading: true
          });
        var myHeaders = new Headers({})

        if(localStorage.getItem(ACCESS_TOKEN)) {
            myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem(ACCESS_TOKEN))
        }
        console.log(localStorage.getItem(ACCESS_TOKEN))
        console.log("headers",myHeaders)

        const formData = new FormData();
        formData.append('collection', 'Prova_123');
        for (let i = 0; i < this.state.files.length; i++) {
            formData.append('files', this.state.files[i]);
            console.log("afdfsadfsdafsadfsdf",this.state.files[i]);
        }
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: formData,
            redirect: 'follow'
          };
          fetch(API_BASE_URL + "/photo_submit/uploadMultipleFiles", requestOptions)
          .then(response => {
              if(response.ok){
                  this.setState({
                      uploadStatus: true,
                      isLoading: false
                  })
              }
          })
          .catch(error => {
              console.log('error', error)
              this.setState({
                isLoading: false
              });
            });
    }

    goSubmitContent(){
        this.setState({
            uploadStatus: true
        })
    }

    render() {
        if(this.state.isLoading){
            return (
                <LoadingIndicator />
            )
        }else{
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
                            <input type="file" accept="image/*" className="form-control select_files" name="file" onChange={this.uploadMultipleFiles} multiple />
                        </div>
                        <button type="button" disabled={this.state.disabled} className="btn btn-danger btn-block upload_button" onClick={this.uploadFiles}>Next</button>
                        <button class="ui icon right labeled button goSubmitButton" onClick={this.goSubmitContent}>
                            <i aria-hidden="true" class="right arrow icon"></i>
                            Go submitContent
                        </button>
                    </form >
                )
            }
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