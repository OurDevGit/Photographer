import React, { Component } from 'react';
import { getAllPhotos, getUserCreatedPhotos, getUserVotedPhotos, getPhotoLists, getSubmitPhotos } from '../../../util/APIUtils';
import Photo from '../Photo';
import { castVote } from '../../../util/APIUtils';
import LoadingIndicator  from '../../../common/LoadingIndicator';
import { Button, Icon, notification } from 'antd';
import { PHOTO_LIST_SIZE } from '../../../constants';
import './style.less';

const photos = [
    {
        id:1,
        
    }
];
class PhotoList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            photos: [],
            photo_list: [],
            page: 0,
            size: 10,
            totalElements: 0,
            totalPages: 0,
            last: true,
            currentVotes: [],
            isLoading: false
        };
        this.loadPhotoList = this.loadPhotoList.bind(this);
        this.handleLoadMore = this.handleLoadMore.bind(this);
    }

    loadPhotoList(page = 0, size = PHOTO_LIST_SIZE) {
        let promise;
        if(this.props.username) {
            if(this.props.type === 'USER_CREATED_PHOTOS') {
                promise = getUserCreatedPhotos(this.props.username, page, size);
            } else if (this.props.type === 'USER_VOTED_PHOTOS') {
                promise = getUserVotedPhotos(this.props.username, page, size);
            } else if(this.props.type == 'Submit_operation'){
                promise = getSubmitPhotos()
            }
        } else {
            promise = getPhotoLists(page, size);
        }

        if(!promise) {
            return;
        }

        this.setState({
            isLoading: true
        });
        if(this.props.type == 'Submit_operation')
        {
            promise            
            .then(response => {
                
                const photos = this.state.photos.slice();
                for (let i=0; i<response.photos.length; i++){
                    
                    if(response.photos[i].submitStatus == this.props.status)
                    {                       
                        photos.push(response.photos[i]);
                    }
                }
                this.setState({
                    photos: photos,
                    photo_list: photos,
                    isLoading: false
                })
                console.log("photo lists",this.props.status)
            }).catch(error => {
                this.setState({
                    isLoading: false
                })
            });  
        }else{
            promise            
            .then(response => {
                const photos = this.state.photos.slice();
                const currentVotes = this.state.currentVotes.slice();
                this.setState({
                    photos: photos.concat(response.content),
                    photo_list: photos.concat(response.content).slice(0, 5),
                    page: response.page,
                    size: response.size,
                    totalElements: response.totalElements,
                    totalPages: response.totalPages,
                    last: response.last,
                    currentVotes: currentVotes.concat(Array(response.content.length).fill(null)),
                    isLoading: false
                })
                console.log("photo lists23423",this.state.photos)
            }).catch(error => {
                this.setState({
                    isLoading: false
                })
            });  
        }
        
        
    }

    componentDidMount() {
        this.loadPhotoList();
    }

    componentDidUpdate(prevProps) {
        if(this.props.isAuthenticated !== prevProps.isAuthenticated) {
            // Reset State
            this.setState({
                photos: [],
                page: 0,
                size: 10,
                totalElements: 0,
                totalPages: 0,
                last: true,
                currentVotes: [],
                isLoading: false
            });    
            this.loadPhotoList();
        }
        if(this.props.status !== prevProps.status)
        {
            this.setState({
                photos: [],
                photo_list: [],
                page: 0,
                size: 10,
                totalElements: 0,
                totalPages: 0,
                last: true,
                currentVotes: [],
                isLoading: false
            });
            this.loadPhotoList();
            console.log("refresh",this.props.username);
            console.log("afsadfs",prevProps.status);
            
        }
    }

    handleLoadMore() {
        this.loadPhotoList(this.state.page + 1);
    }

    handleVoteChange(event, photoIndex) {
        const currentVotes = this.state.currentVotes.slice();
        currentVotes[photoIndex] = event.target.value;

        this.setState({
            currentVotes: currentVotes
        });
    }


    handleVoteSubmit(event, photoIndex) {
        event.preventDefault();
        if(!this.props.isAuthenticated) {
            this.props.history.push("/login");
            notification.info({
                message: 'Photoing App',
                description: "Please login to vote.",          
            });
            return;
        }

        const photo = this.state.photos[photoIndex];
        const selectedChoice = this.state.currentVotes[photoIndex];

        const voteData = {
            photoId: photo.id,
            choiceId: selectedChoice
        };

        castVote(voteData)
        .then(response => {
            const photos = this.state.photos.slice();
            photos[photoIndex] = response;
            this.setState({
                photos: photos
            });        
        }).catch(error => {
            if(error.status === 401) {
                this.props.handleLogout('/login', 'error', 'You have been logged out. Please login to vote');    
            } else {
                notification.error({
                    message: 'Photoing App',
                    description: error.message || 'Sorry! Something went wrong. Please try again!'
                });                
            }
        });
    }

    render() {
        const photoViews = [];
        this.state.photo_list.forEach((photo, photoIndex) => {
            photoViews.push(<Photo
                index={photo.id}
                photo={photo}
                onClick = {this.props.onClickImage}
                active = {this.props.active}
                total = {this.state.photo_list.length}
                type = {this.props.type}
                // currentVote={this.state.currentVotes[photoIndex]}
                // handleVoteChange={(event) => this.handleVoteChange(event, photoIndex)}
                // handleVoteSubmit={(event) => this.handleVoteSubmit(event, photoIndex)} 
                />)
        });
        console.log("ddd")
        return (
            <div className="photos-container">
                {photoViews}
                {
                    !this.state.isLoading && this.state.photos.length === 0 ? (
                        <div className="no-photos-found">
                            <span>No Photos Found.</span>
                        </div>    
                    ): null
                }  
                {
                    !this.state.isLoading && !this.state.last ? (
                        <div className="load-more-photos">
                            <Button type="dashed" onClick={this.handleLoadMore} disabled={this.state.isLoading}>
                                <Icon type="plus" /> Load more
                            </Button>
                        </div>): null
                }              
                {
                    this.state.isLoading ? 
                    <LoadingIndicator />: null                     
                }
            </div>
        );
    }
}

export default PhotoList;