import React, { Component, Input } from 'react';
import UploadPhoto from '../UploadPhoto'
import  { Redirect } from 'react-router-dom'
import './style.less'
import { uploadPhotos } from '../../../util/APIUtils';
import axios from "axios"
export default class MultipleImageUploadComponent extends Component {

    fileObj = [];
    fileArray = [];
    // file = [];
    constructor(props) {
        super(props)
        this.state = {
            files: [],
            disabled: true,
            uploadStatus: false,
            file:{}
        }
        this.uploadMultipleFiles = this.uploadMultipleFiles.bind(this)
        this.uploadFiles = this.uploadFiles.bind(this)
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

    onFileChangeHandler = (e) => {
        const formData = new FormData();
        for(let i = 0; i< e.target.files.length; i++) {
            formData.append('file', e.target.files[i])
        }
        for (var key of formData.entries()) {
            console.log(key[0] + ', ' + key[1]);
        }
        axios.post("http://198.23.255.20:5000/api/photo_submit/uploadMultipleFiles", formData)
            .then(res => {
                    console.log(res.data);
                    alert("File uploaded successfully.")
            })
            .catch(function(error){
                console.log(error.response)
            })
    };

    
     getBase64 = file => {
        return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
        });
    }
  
    handleChange = async (event) => {
        // console.log("addedFile", event.target.files[0]);
        const addedfile = event.target.files[0];
        const dataurl = await this.getBase64(addedfile);
        const file = this.state.file;
        // const fileExt = _.split(addedfile.type, '/')[1];
        // const filename = `main_${new Date().getTime()}.${fileExt}`;
        file.name = "1312.png";
        // addedfile.name = filename;
        file.file = addedfile;
        file.url = dataurl;
        this.setState({file});

        // // const filebuffer = Buffer.from(event.target.files);
        // // console.log("filebuffer", filebuffer);
        // addedfile.arrayBuffer().then(o=>{     
        //   const tags =  ExifReader.load(o);     
        // })
        // // console.log('fileBuffer', fileBuffer)
        // // const tags =  ExifReader.load(fileBuffer);
        // // console.log("exif tags", tags);
        // const reqFields = this.state.reqFields;
        // resize(addedfile, 1024, null, 'resizedx1024').then(fileObj=>{
        //   const resized1 = this.state.resized1;
        //   resized1.file = fileObj;
        //   resized1.name = 'resizedx1024';
        //   this.setState({resized1});
    
        //   resize(addedfile, 360, null, 'resizedx360').then(fileObj=>{
        //       const resized2 = this.state.resized2;
        //       resized2.file = fileObj;
        //       resized2.name = 'resizedx360';
        //       this.setState({resized2});
        //   });
        // });
        const formData = new FormData();
        
        // formData.append('file', this.state.file)
        formData.collection = "";
        formData.files = this.state.file;
        console.log(formData)
        axios.post("http://198.23.255.20:5000/api/photo_submit/uploadMultipleFiles", formData)
        .then(res => {
                console.log(res.data);
                alert("File uploaded successfully.")
        })
        // reqFields.file = true;
        // this.setState({reqFields});
        // setTimeout(() => {
        //   this.canUpload();
        // }, 300); 
      }

    uploadFiles(e) {
        // this.setState({
        //     uploadStatus: true
        // });
        const uploadRequest = {
            collection: "",
            files: this.state.files
        };
        console.log(" a ",uploadRequest);
        const aaaa = {
            collection: "",
            files: [{
                contentType: "image/png",
                name: "aaa.png"
            }]
        };
        console.log("~~~~~~~~~~~~~~~~~~~~~~~~", uploadRequest)
        uploadPhotos(aaaa)
        .then(response => {
            console.log("response")
        }).catch(error => {
            console.log(error)
        });
    }

    render() {
        if(this.state.uploadStatus){
            console.log(this.state.uploadStatus)
            return(
                <Redirect to='/submitContent' />
                // <div>
                // <UploadPhoto />
                // </div>
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
                        <input type="file" className="form-control select_files" name="file" onChange={this.onFileChangeHandler} multiple />
                    </div>
                    <button type="button" disabled={this.state.disabled} className="btn btn-danger btn-block upload_button" onClick={this.uploadFiles}>Next</button>
                </form >
            )
        }
    }
}