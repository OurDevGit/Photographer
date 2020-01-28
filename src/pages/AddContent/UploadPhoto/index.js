import React, {Component} from 'react';
import {Redirect} from 'react-router'
import {createPhoto} from '../../../util/APIUtils';
import {MAX_CHOICES, PHOTO_QUESTION_MAX_LENGTH, PHOTO_CHOICE_MAX_LENGTH, API_BASE_URL} from '../../../constants';
import './style.less';
import {Form, Input, Button, Icon, Select, Col, Upload, notification, message} from 'antd';
import 'antd/dist/antd.css';

const Option = Select.Option;
const FormItem = Form.Item;
const {TextArea} = Input

function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}

function beforeUpload(file) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
        message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
}

class UploadPhoto extends Component {
    constructor(props) {
        super(props);
        this.state = {
            question: {
                text: ''
            },
            choices: [{
                text: ''
            }, {
                text: ''
            }],
            photoLength: {
                days: 1,
                hours: 0
            },
            loading: false,
            file: '',
            msg: '',
            redirect: false,
            address: ''
        };
        this.addChoice = this.addChoice.bind(this);
        this.removeChoice = this.removeChoice.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleQuestionChange = this.handleQuestionChange.bind(this);
        this.handleChoiceChange = this.handleChoiceChange.bind(this);
        this.handlePhotoDaysChange = this.handlePhotoDaysChange.bind(this);
        this.handlePhotoHoursChange = this.handlePhotoHoursChange.bind(this);
        this.isFormInvalid = this.isFormInvalid.bind(this);
    }


    addChoice(event) {
        const choices = this.state.choices.slice();
        this.setState({
            choices: choices.concat([{
                text: ''
            }])
        });
    }


    removeChoice(choiceNumber) {
        const choices = this.state.choices.slice();
        this.setState({
            choices: [...choices.slice(0, choiceNumber), ...choices.slice(choiceNumber + 1)]
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        const photoData = {
            question: this.state.question.text,
            choices: this.state.choices.map(choice => {
                return {text: choice.text}
            }),
            photoLength: this.state.photoLength
        };

        createPhoto(photoData)
            .then(response => {
                this.props.history.push("/");
            }).catch(error => {
            if (error.status === 401) {
                this.props.handleLogout('/login', 'error', 'You have been logged out. Please login create photo.');
            } else {
                notification.error({
                    message: 'Photo App',
                    description: error.message || 'Sorry! Something went wrong. Please try again!'
                });
            }
        });
    }

    validateQuestion = (questionText) => {
        if (questionText.length === 0) {
            return {
                validateStatus: 'error',
                errorMsg: 'Please enter your question!'
            }
        } else if (questionText.length > PHOTO_QUESTION_MAX_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: `Question is too long (Maximum ${PHOTO_QUESTION_MAX_LENGTH} characters allowed)`
            }
        } else {
            return {
                validateStatus: 'success',
                errorMsg: null
            }
        }
    }

    handleQuestionChange(event) {
        const value = event.target.value;
        this.setState({
            question: {
                text: value,
                ...this.validateQuestion(value)
            }
        });
    }

    validateChoice = (choiceText) => {
        if (choiceText.length === 0) {
            return {
                validateStatus: 'error',
                errorMsg: 'Please enter a choice!'
            }
        } else if (choiceText.length > PHOTO_CHOICE_MAX_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: `Choice is too long (Maximum ${PHOTO_CHOICE_MAX_LENGTH} characters allowed)`
            }
        } else {
            return {
                validateStatus: 'success',
                errorMsg: null
            }
        }
    }

    handleChoiceChange(event, index) {
        const choices = this.state.choices.slice();
        const value = event.target.value;

        choices[index] = {
            text: value,
            ...this.validateChoice(value)
        }

        this.setState({
            choices: choices
        });
    }


    handlePhotoDaysChange(value) {
        const photoLength = Object.assign(this.state.photoLength, {days: value});
        this.setState({
            photoLength: photoLength
        });
    }

    handlePhotoHoursChange(value) {
        const photoLength = Object.assign(this.state.photoLength, {hours: value});
        this.setState({
            photoLength: photoLength
        });
    }

    isFormInvalid() {
        if (this.state.question.validateStatus !== 'success') {
            return true;
        }

        for (let i = 0; i < this.state.choices.length; i++) {
            const choice = this.state.choices[i];
            if (choice.validateStatus !== 'success') {
                return true;
            }
        }
    }

    // Img uploader

    handleChange = info => {
        if (info.file.status === 'uploading') {
            this.setState({loading: true});
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            getBase64(info.file.originFileObj, imageUrl =>
                this.setState({
                    imageUrl,
                    loading: false,
                    file: info.file.originFileObj
                }),
            );
            
        }
    };

    uploadFileData = (event) => {
        
        event.preventDefault();
        this.setState({msg: ''});
        
        let data = new FormData();
        data.append('user', 'name');
        data.append('file', this.state.file);
        console.log("dddddddddddddddddddddddddddddd", data);
        fetch(API_BASE_URL + '/photos/uploadMultipleFiles/', {
            method: 'POST',
            body: data,
            //file: this.state.file
        }).then(response => {
            this.setState({
                msg: "File successfully uploaded",
                redirect: true,
                address: response.valueOf("fileName")
            });
            console.log(response);
        }).catch(err => {
            this.setState({error: err});
        });

    }

    render() {

        const redirect = this.state.redirect;
        console.log(redirect);

        if (redirect) {
            return <Redirect to={{
                pathname: '/photo/Photo', address: this.state.address

            }}/>;
        }

        const uploadButton = (
            <div>
                <Icon type={this.state.loading ? 'loading' : 'plus'}/>
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        const {imageUrl} = this.state;

        const choiceViews = [];
        this.state.choices.forEach((choice, index) => {
            choiceViews.push(<PhotoChoice key={index} choice={choice} choiceNumber={index}
                                          removeChoice={this.removeChoice}
                                          handleChoiceChange={this.handleChoiceChange}/>);
        });

        return (
            <div className="new-photo-container">
                <h1 className="page-title">Add Photo</h1>
                <div className="new-photo-content">
                    <Upload
                        name="avatar"
                        listType="picture-card"
                        className="avatar-uploader"
                        showUploadList={false}
                        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                        beforeUpload={beforeUpload}
                        onChange={this.handleChange}
                    >
                        {imageUrl ? <img src={imageUrl} alt="avatar" style={{width: '100%'}}/> : uploadButton}
                    </Upload>

                    <Form onSubmit={this.handleSubmit} className="create-photo-form">


                        <FormItem validateStatus={this.state.question.validateStatus}
                                  help={this.state.question.errorMsg} className="photo-form-row">
                            <TextArea
                                placeholder="Enter your question"
                                style={{fontSize: '16px'}}
                                autosize={{minRows: 3, maxRows: 6}}
                                name="question"
                                value={this.state.question.text}
                                onChange={this.handleQuestionChange}/>
                        </FormItem>
                        {choiceViews}
                        <FormItem className="photo-form-row">
                            <Button type="dashed" onClick={this.addChoice}
                                    disabled={this.state.choices.length === MAX_CHOICES}>
                                <Icon type="plus"/> Add a choice
                            </Button>
                        </FormItem>
                        <FormItem className="photo-form-row">
                            <Col xs={24} sm={4}>
                                Photo length:
                            </Col>
                            <Col xs={24} sm={20}>    
                                <span style={{marginRight: '18px'}}>
                                    <Select
                                        name="days"
                                        defaultValue="1"
                                        onChange={this.handlePhotoDaysChange}
                                        value={this.state.photoLength.days}
                                        style={{width: 60}}>
                                        {
                                            Array.from(Array(8).keys()).map(i =>
                                                <Option key={i}>{i}</Option>
                                            )
                                        }
                                    </Select> &nbsp;Days
                                </span>
                                <span>
                                    <Select
                                        name="hours"
                                        defaultValue="0"
                                        onChange={this.handlePhotoHoursChange}
                                        value={this.state.photoLength.hours}
                                        style={{width: 60}}>
                                        {
                                            Array.from(Array(24).keys()).map(i =>
                                                <Option key={i}>{i}</Option>
                                            )
                                        }
                                    </Select> &nbsp;Hours
                                </span>
                            </Col>
                        </FormItem>
                        <FormItem className="photo-form-row">
                            <Button type="primary"
                                    htmlType="submit"
                                    size="large"
                                    disabled={this.isFormInvalid()}
                                    className="create-photo-form-button">Create Photo</Button>
                        </FormItem>

                        <FormItem>

                        </FormItem>
                        <FormItem>
                            <button disabled={!this.state.file} onClick={this.uploadFileData}>Save</button>
                        </FormItem>
                    </Form>
                </div>
            </div>
        );
    }
}

function PhotoChoice(props) {
    return (
        <FormItem validateStatus={props.choice.validateStatus}
                  help={props.choice.errorMsg} className="photo-form-row">
            <Input
                placeholder={'Choice ' + (props.choiceNumber + 1)}
                size="large"
                value={props.choice.text}
                className={props.choiceNumber > 1 ? "optional-choice" : null}
                onChange={(event) => props.handleChoiceChange(event, props.choiceNumber)}/>

            {
                props.choiceNumber > 1 ? (
                    <Icon
                        className="dynamic-delete-button"
                        type="close"
                        disabled={props.choiceNumber <= 1}
                        onClick={() => props.removeChoice(props.choiceNumber)}
                    />) : null
            }
        </FormItem>
    );
}


export default UploadPhoto;