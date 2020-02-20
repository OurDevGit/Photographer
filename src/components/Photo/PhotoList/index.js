import React, { Component } from 'react';
import { getAllPhotos, getUserCreatedPhotos, getUserVotedPhotos, getPhotoLists, getSubmitPhotos, getAdminPublicationPhotoList } from '../../../util/APIUtils';
import Photo from '../Photo';
import { castVote } from '../../../util/APIUtils';
import LoadingIndicator  from '../../../common/LoadingIndicator';
import { Button, Icon, notification } from 'antd';
import { PHOTO_LIST_SIZE } from '../../../constants';
import InfiniteScroll from 'react-infinite-scroller'
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
            hasMore:true,
            isLoading: false
        };
        this.loadPhotoList = this.loadPhotoList.bind(this);
        this.handleLoadMore = this.handleLoadMore.bind(this);
        this.loadFunc =  this.loadFunc.bind(this)
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
            } else if(this.props.type == 'admin_photolist'){
                promise = getAdminPublicationPhotoList(this.props.status)
            }
        } else {
            console.log(page, size)
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
            }).catch(error => {
                this.setState({
                    isLoading: false
                })
            });  
        }else if(this.props.type == 'admin_photolist'){
            promise
            .then(response => {
                this.setState({
                    photos: response,
                    photo_list: response,
                    isLoading: false
                })
            })
            .catch(error => {
                this.setState({
                    isLoading: false
                })
            });  
        }
        else{
            promise            
            .then(response => {
                console.log(response)
                const photos = this.state.photos.slice();
                const currentVotes = this.state.currentVotes.slice();
                this.setState({
                    photos: photos.concat(response.content),
                    photo_list: photos.concat(response.content),
                    // page: response.page,
                    size: response.size,
                    totalElements: response.totalElements,
                    totalPages: response.totalPages,
                    last: response.last,
                    currentVotes: currentVotes.concat(Array(response.content.length).fill(null)),
                    isLoading: false
                })
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
        // console.log(this.props.publish, prevProps.publish)
        console.log(this.props.deleteAction)
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
        if(this.props.status !== prevProps.status || this.props.delete)
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
            this.props.deleteFun();
        }
        if(this.props.publish != prevProps.publish)
        {   
            this.state.photo_list.splice(this.props.active,1)
            
            this.setState({
                photo_list: this.state.photo_list
            })
            
        }
        if(this.props.activePage != prevProps.activePage){
            this.setState({
                photos: [],
                page: 0,
                totalElements: 0,
                last: true,
                currentVotes: [],
                isLoading: false
            });  
            this.loadPhotoList(this.props.activePage -1, PHOTO_LIST_SIZE);
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

    loadFunc(page){
        console.log("++++++++++++++++++++++++++++++++++++++++", page)
        // this.state.page = this.state.page + 1;
        this.setState({
            page: this.state.page,
        })
        console.log("===================================",this.props.totalPages)
        if(page == this.props.totalPages)
        {
            this.setState({
                hasMore: false
            })
        }
        this.loadPhotoList(page, PHOTO_LIST_SIZE)
    }

    render() {
        console.log("photo_list", this.props.totalPages)
        console.log(this.props.type)
        const photoViews = [];
        this.state.photo_list.forEach((photo, photoIndex) => {
            photoViews.push(<Photo
                index={photoIndex}
                photo={photo}
                onClick = {this.props.onClickImage}
                active = {this.props.active}
                total = {this.state.photo_list.length}
                type = {this.props.type}
                addToBucket = {this.props.addToBucket}
                action = {this.props.action}
                publish = {this.props.publish}
                status = {this.props.status}
                quickView =  {this.props.quickView}
                // currentVote={this.state.currentVotes[photoIndex]}
                // handleVoteChange={(event) => this.handleVoteChange(event, photoIndex)}
                // handleVoteSubmit={(event) => this.handleVoteSubmit(event, photoIndex)} 
                />)
        });

        var items = [];
        this.state.photo_list.map((track, i) => {
            items.push(
                <div className="track" key={i}>
                    <a href={track.url_fr} target="_blank">
                        <img src={track.url_fr} width="150" height="150" />
                    </a>
                </div>
            );
        });
        return (
            <div className="photos-container">
                {/* {photoViews} */}
                {
                    this.props.type == 'home_list' && this.props.totalPages > 0 ?(
                        <div className="infiniteScroll">
                            <InfiniteScroll
                                pageStart={0}
                                loadMore={this.loadFunc}
                                hasMore={this.state.hasMore}
                                loader={<div className="loader" key={0}>Loading ...</div>}
                                // useWindow={false}
                            >
                                {photoViews}
                            </InfiniteScroll>
                        </div>
                    )
                        
                    :   photoViews
                }
                
                {
                    !this.state.isLoading && this.state.photos.length === 0 ? (
                        <div className="no-photos-found">
                            <span>No Photos Found.</span>
                        </div>    
                    ): null
                }  
                {/* {
                    !this.state.isLoading && !this.state.last ? (
                        <div className="load-more-photos">
                            <Button type="dashed" onClick={this.handleLoadMore} disabled={this.state.isLoading}>
                                <Icon type="plus" /> Load more
                            </Button>
                        </div>): null
                }               */}
                {
                    this.state.isLoading ? 
                    <LoadingIndicator />: null                     
                }
            </div>
        );
    }
}

export default PhotoList;