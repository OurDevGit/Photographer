import React, { Component } from 'react';
import  { Redirect } from 'react-router-dom'
import {Input} from 'semantic-ui-react'
import './style.less'
import { API_BASE_URL, ACCESS_TOKEN } from '../../../constants';
import LoadingIndicator  from '../../../common/LoadingIndicator';
import {Progress} from 'semantic-ui-react'
import {notification} from 'antd'

export default class MultipleImageUploadComponent extends Component {
    fileObj = [];
    fileArray = [];
    file = [];
    constructor(props) {
        super(props)
        this.state = {
            files: [],
            Collection: '',
            disabled: true,
            isLoading: false,
            uploadedFileNumber:0,
            uploadFailedNumber:0,
            uploadingProgress:0
        }
        this.uploadMultipleFiles = this.uploadMultipleFiles.bind(this)
        this.uploadFiles = this.uploadFiles.bind(this)
        this.goSubmitContent = this.goSubmitContent.bind(this)
        this.handleSetCollection = this.handleSetCollection.bind(this)
        this.handleClickUpload = this.handleClickUpload.bind(this)
    }

    getBase64 = file => {
        return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
        });
    }

    onDrop(e){
        console.log(e)
    }

    handleSetCollection(e){
        console.log(e.target.value)
        this.setState({
            Collection: e.target.value
        })
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
    

    uploadFiles(fileNo, len) {

        var myHeaders = new Headers({})
        if(localStorage.getItem(ACCESS_TOKEN)) {
            myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem(ACCESS_TOKEN))
        }
        console.log("File",this.state.files[fileNo])
        const formData = new FormData();
        formData.append('collection', this.state.Collection);
        formData.append('files', this.state.files[fileNo]);
        // for (let i = 0; i < this.state.files.length; i++) {
        //     formData.append('files', this.state.files[i]);
        //     console.log("afdfsadfsdafsadfsdf",this.state.files[i]);
        // }
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: formData,
            redirect: 'follow'
          };
          this.setState({
            isLoading: true
          });
          fetch(API_BASE_URL + "/photo_submit/uploadMultipleFiles", requestOptions)
          .then(response => {
              if(response.ok){
                  this.state.uploadedFileNumber =  this.state.uploadedFileNumber + 1;
                  this.state.uploadingProgress  =  Math.floor(this.state.uploadedFileNumber * 100/len);
                  if(this.state.uploadedFileNumber == len){
                    this.setState({
                        isLoading: false,
                        uploadStatus: true
                      })
                  }
                  this.setState({
                      uploadedFileNumber: this.state.uploadedFileNumber,
                      uploadingProgress : this.state.uploadingProgress
                  })
              }else{

                this.state.uploadedFileNumber =  this.state.uploadedFileNumber + 1;
                this.state.uploadFailedNumber =  this.state.uploadFailedNumber + 1;
                this.state.uploadingProgress  =  Math.floor(this.state.uploadedFileNumber * 100/len);
                if(this.state.uploadedFileNumber == len){
                    this.setState({
                        isLoading: false,
                        uploadStatus: true
                        })
                }
                this.setState({
                    uploadedFileNumber: this.state.uploadedFileNumber,
                    uploadFailedNumber: this.state.uploadFailedNumber,
                    uploadingProgress : this.state.uploadingProgress
                })
                //   this.setState({
                //       isLoading: false,
                //   })
                  console.log("error_resp", response)
              }
          })
          .catch(error => {
                this.state.uploadedFileNumber =  this.state.uploadedFileNumber + 1;
                this.state.uploadFailedNumber =  this.state.uploadFailedNumber + 1;
                this.state.uploadingProgress  =  Math.floor(this.state.uploadedFileNumber * 100/len);
                if(this.state.uploadedFileNumber == len){
                    this.setState({
                        isLoading: false,
                        uploadStatus: true
                        })
                }
                this.setState({
                    uploadedFileNumber: this.state.uploadedFileNumber,
                    uploadFailedNumber: this.state.uploadFailedNumber,
                    uploadingProgress : this.state.uploadingProgress
                })
                console.log('error', error)
            //   this.setState({
            //     isLoading: false
            //   });
            });
    }

    handleClickUpload(){
        for (let i = 0; i < this.state.files.length; i++) {
            this.uploadFiles(i, this.state.files.length);
        }
    }

    goSubmitContent(){
        this.setState({
            uploadStatus: true
        })
    }

    render() {
        console.log("fsdafsd", this.state.uploadingProgress)
        if(this.state.isLoading){
            return (
                // <LoadingIndicator />
                <Progress percent={this.state.uploadingProgress} indicating progress/>
            )
        }else{
            if(this.state.uploadStatus){
                console.log("^^^^^^^^^^^^^^^^^^^^^^^", this.state.uploadFailedNumber)
                if(this.state.uploadFailedNumber == 0){
                    notification.success({
                        message: 'Photoing App',
                        description: "Success" + this.state.uploadedFileNumber + 'files uploaded!'
                    });     
                }else{
                    notification.error({
                        message: 'Photoing App',
                        description: 'Sorry!' + this.state.uploadFailedNumber + 'files uploading are failed. Please try again!'
                    });  
                }
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
                        {/* <ReactDropzone
                        // onDrop={this.onDrop}
                        >
                        Drop your best gator GIFs here!!
                        </ReactDropzone> */}
                        <input type="file" accept="image/*" className="dragImage" name="file" onChange={this.uploadMultipleFiles} multiple />
                        {/* <div className="form-group"> */}
                            <span className="select_files_label">Drag and Drop Image or Click this area to upload photo</span>
                            {/* <input type="file" accept="image/*" className="form-control select_files" name="file" onChange={this.uploadMultipleFiles} multiple /> */}
                        {/* </div> */}
                        {/* <button type="button" disabled={this.state.disabled} className="btn btn-danger btn-block upload_button" onClick={this.uploadFiles}>Next</button> */}
                        <button type="button" disabled={this.state.disabled} class="ui icon right btn btn-danger labeled button goSubmitButton" onClick={this.handleClickUpload}>
                            <i aria-hidden="true" class="right arrow icon"></i>
                            Upload Photo
                        </button>
                        <div className='collection'>
                            {/* <b>Collection: </b> <Select placeholder='Collection' options={this.state.categories} name="Collection" onChange={this.handleSetCollection}/> */}
                            <b>Collection: </b> <Input placeholder='Collection' value={this.state.Collection} name="Collection" onChange={this.handleSetCollection}/>
                        </div>
                    </form >
                )
            }
        }
    }
}
