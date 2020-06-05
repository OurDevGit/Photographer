import React, { Component } from "react";
import io from 'socket.io-client';
import { getPublicUsers, getUsers } from "../../../../util/APIUtils";
import ChatSocketServer from '../../../../util/chatSocketServer';
import ChatHttpServer from '../../../../util/chatHttpServer';
import LoadingIndicator from "../../../../common/LoadingIndicator";
import { ISOFormatDate, FormatTime } from '../../../../util/Helpers'
import {
  Row,
  Column,
  Avatar,
  Title,
  Subtitle,
  ChatList,
  ChatListItem,
} from '@livechat/ui-kit'

class ChatListComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      publicUsers: [],
      isLoading: true,
      activeChat: 0,
      chatList: []
    };
    this.selectChat = this.selectChat.bind(this);
    this.loadPublicUsers = this.loadPublicUsers.bind(this);
    this.receiveSocketMessages =  this.receiveSocketMessages.bind(this)
  }

  componentDidMount() {
    this.loadPublicUsers(0, 30);
  }

  loadPublicUsers(page, size) {
    this.setState({
      isLoading: true
    })
    getUsers(page, size)
      .then(response => {
        this.setState({
          publicUsers: response.content,
        })
        console.log(this.props.selChatId, this.props.selUserId)
        if(this.props.selChatId && this.props.selUserId){
          var toUser = response.content.find((obj) => obj.id === this.props.selUserId);
          this.selectChat(this.props.selChatId, toUser)
          // response.content.forEach(user=>{
          //   if(user.id === this.props.selUserId){
          //     this.selectChat(this.props.selChatId, user)
          //   }
          // })
        }
        ChatSocketServer.getChatList(this.props.currentUser.id);
        ChatSocketServer.eventEmitter.on('chat-list-response', this.createChatListUsers);
        ChatSocketServer.receiveMessage();
        ChatSocketServer.eventEmitter.on('add-message-response', this.receiveSocketMessages);
      })
      .catch(error => {
        console.log(error)
        this.setState({
          isLoading: false
        })
      })
  }

  componentDidUpdate(nextProps) {
  }

  componentWillUnmount() {
    // ChatSocketServer.eventEmitter.removeListener('chat-list-response', this.createChatListUsers);
  }

  createChatListUsers = (chatListResponse) => {
    if (!chatListResponse.error) {
      let chatList = this.state.chatList;
      if (chatListResponse.singleUser) {
        // if (chatList.length > 0) {
        //   chatList = chatList.filter(function (obj) {
        //     return obj.id !== chatListResponse.chatList[0].id;
        //   });
        // }
        // /* Adding new online user into chat list array */
        // chatList = [...chatList, ...chatListResponse.chatList];
      } else {
        /* Updating entire chat list if user logs in. */
        chatList = chatListResponse.chatList;
      }
      this.setState({
        chatList: chatList
      });
    } else {
      alert(`Unable to load Chat list, Redirecting to Login.`);
    }
    this.setState({
      isLoading: false
    });
  }

  selectChat(id, user) {
    this.props.selectChat(id, user)
    this.setState({
      activeChat: id
    })
  }

  receiveSocketMessages = (socketResponse) => {
    if(socketResponse){
      if(socketResponse.chat){
        ChatSocketServer.getChatList(this.props.currentUser.id);
        // this.state.chatList.forEach((chat, chatIndex)=>{
        //   if(chat._id === socketResponse.chat.chatId){
        //     this.state.chatList[chatIndex].meta={
        //       lastmessage: socketResponse.message.message,
        //       date: socketResponse.message.date
        //     }
        //     this.setState({
        //       chatList: this.state.chatList
        //     })
        //   }
        // })
      }
    }
  }

  render() {
    const chatListArr = [];
    if (this.state.isLoading) {
      return <LoadingIndicator />
    } else {
      this.state.chatList.forEach((chat, chatIndex) => {
        let toUser = {};
        chat.participants.forEach(participant => {
          if (participant !== this.props.currentUser.id) {
            toUser = this.state.publicUsers.find((obj) => obj.id === participant);
          }
        })
        let lastDate="";
        if(ISOFormatDate(new Date()) === ISOFormatDate(chat.meta.date)){
          lastDate= FormatTime(chat.meta.date)
        }else{
          lastDate = ISOFormatDate(chat.meta.date)
        }
        chatListArr.push(
          <ChatListItem id={chat._id} active={this.state.activeChat === chat._id ? true : false} onClick={()=>this.selectChat(chat._id, toUser)}>
            <Avatar imgUrl={toUser.icon ? toUser.icon : null} letter={toUser.name[0]} size="40px" />
            <Column className="UserInfo" fill>
              <Row justify>
                <Title ellipsis>{toUser.surname ? toUser.name + " " + toUser.surname : toUser.name}</Title>
                <Subtitle nowrap>{lastDate}</Subtitle>
              </Row>
              <Subtitle ellipsis>
                {chat.meta.lastmessage}
              </Subtitle>
            </Column>
          </ChatListItem>
        )
      })
    }
    return (
      <>
        <ChatList className="ChatList" style={{ minWidth: 300 }}>
          <p>
            Your contact List
          </p>
          {chatListArr}
        </ChatList>
      </>
    );
  }
}

export default ChatListComponent;
