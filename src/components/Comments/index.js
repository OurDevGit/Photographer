
import React, {Component} from 'react';
import './style.less';
import {Comment, TextArea, Icon} from 'semantic-ui-react'
import { get_comments_list, add_comment} from '../../util/APIUtils';
import LoadingIndicator  from '../../common/LoadingIndicator';
import { AvatarDefault } from '../../assets/images/homepage'
class Comments extends Component {

    constructor(props) {
      super(props);
        this.state = {
          isLoading: false,
          comments: [],
          activeReply:"",
          replyComment:""
      }
      this.getCommentList = this.getCommentList.bind(this)
      this.handleClickReply = this.handleClickReply.bind(this)
      this.handleChangeReplyComment = this.handleChangeReplyComment.bind(this)
      this.replyToComment =  this.replyToComment.bind(this)
    }

    componentDidMount(){
      console.log("id",this.props.photoId)
      this.getCommentList(this.props.photoId)
    }
    componentDidUpdate(prevProps)
    {
      console.log(this.props.flag, prevProps.flag)
      if(this.props.flag != prevProps.flag)
      {
        this.getCommentList(this.props.photoId)
      }
    }

    getCommentList(photoId){
      this.setState({
        isLoading: true
      })
      get_comments_list(photoId)
      .then(response=>{
        this.setState({
          comments:response,
          isLoading: false
        })
        console.log("FFHSJKFHKJEHFKJEWHFK",response)
      })
      .catch(error=>{
        this.setState({
          isLoading: false
        })
        console.log(error)
      })
    }

    handleClickReply(e){
      this.setState({
        activeReply: e.target.id,
        replyComment: ""
      })
      console.log(e.target.id)
    }

    handleChangeReplyComment(e, {value})
    {
      this.setState({
        replyComment: value
      })
    }

    replyToComment(){
      var Request = {
        "content": this.state.replyComment,
        "parent" : this.state.activeReply
      }
      console.log(Request)
      this.setState({
        isSendCommentLoading: true
      })
      add_comment(Request)
      .then(response=>{
        if(response.ok)
        {
          this.setState({
            isSendCommentLoading: false,
            replyComment:"",
            activeReply:""
          })
          this.getCommentList(this.props.photoId)
        }else{
          this.setState({
            isSendCommentLoading: false
          })
        }
        console.log(response)
      })
      .catch(error=>{
        console.log(error)
        this.setState({
          isSendCommentLoading: false
        })
      })
    }
    

    render() {
      const commentslist = [];
      
      this.state.comments.forEach(comment => {
        console.log("aaaaaa", comment)
        const replies = [];
        if(comment.replies.length >0)
        {
          comment.replies.forEach(reply => {
            replies.push(
              <Comment>
                <Comment.Avatar src={reply.userIconUrl} />
                <Comment.Content>
                  <Comment.Author as='a'>{reply.userName}</Comment.Author>
                  <Comment.Metadata>
                    <div>{reply.time}</div>
                  </Comment.Metadata>
                  <Comment.Text>{reply.content}</Comment.Text>
                </Comment.Content>
              </Comment>
            )
          })
        }
        
        commentslist.push(
          <Comment>
            <Comment.Avatar src={comment.userIconUrl} />
            <Comment.Content>
              <Comment.Author as='a'>{comment.userName}</Comment.Author>
              <Comment.Metadata>
                <div>{comment.time}</div>
              </Comment.Metadata>
              <Comment.Text>{comment.content}</Comment.Text>
              <Comment.Actions>
                <Comment.Action><a id={comment.id} onClick={this.handleClickReply}>Reply</a></Comment.Action>
              </Comment.Actions>
            </Comment.Content>
            <Comment.Group className={this.state.activeReply == comment.id ?  "show" : "disable"}>
              <Comment className="commitText">
                <Comment.Avatar src={this.props.photo.ownerIcon ? this.props.photo.ownerIcon : AvatarDefault} />
                <Comment.Content>
                  <TextArea rows={1} value={this.state.replyComment} placeholder='add comments' onChange={this.handleChangeReplyComment} />
                  {
                    this.state.isSendCommentLoading ? 
                      <Icon name="spinner" className="sending" />
                    : <Icon name="send" className="sending" disabled={this.state.replyComment == "" ? true : false} onClick={this.replyToComment}/>
                  }
                </Comment.Content>
              </Comment>
            </Comment.Group>
            {
              replies.length > 0 ? 
                <Comment.Group>
                  {replies}
                </Comment.Group>
              : null
            }
            
          </Comment>
        )
      });
      return(
        <>
          {
            this.state.isLoading ?
              <LoadingIndicator />
            : <Comment.Group className="CommentList">
                {commentslist} 
              </Comment.Group> 
          }
        </> 
      )
    }
}

export default Comments;
