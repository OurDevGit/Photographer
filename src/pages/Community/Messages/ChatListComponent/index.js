import React, { Component } from "react";
import { Label } from "semantic-ui-react";
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
    this.receiveSocketMessages = this.receiveSocketMessages.bind(this)
    this.receiveReadMessages = this.receiveReadMessages.bind(this)
  }

  componentDidMount() {
    this.loadPublicUsers(0, 30);
    ChatSocketServer.checkSocket();
  }

  loadPublicUsers(page, size) {
    this.setState({
      isLoading: true
    })
    getPublicUsers(page, size)
      .then(response => {
        this.setState({
          publicUsers: response.content,
        })
        if (this.props.selChatId && this.props.selUserId) {
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
        // ChatSocketServer.eventEmitter.on('add-message-response', this.receiveSocketMessages);
        // ChatSocketServer.eventEmitter.on('read-message-response', this.receiveReadMessages);
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
    ChatSocketServer.eventEmitter.removeListener('chat-list-response', this.createChatListUsers);
    // ChatSocketServer.eventEmitter.removeListener('add-message-response', this.receiveSocketMessages);
    // ChatSocketServer.eventEmitter.removeListener('read-message-response', this.receiveReadMessages);
  }

  createChatListUsers = (chatListResponse) => {
    if (!chatListResponse.error) {
      let chatList = this.state.chatList;
      if (!chatListResponse.userDisconnected) {
        if (chatListResponse.type === "list") {
          if (chatListResponse.singleUser) {
            // if (chatList.length > 0) {
            //   chatList = chatList.filter(function (obj) {
            //     return obj.id !== chatListResponse.chatList[0].id;
            //   });
            // }
            // /* Adding new online user into chat list array */
            // chatList = [...chatList, ...chatListResponse.chatList];
          }
          else {
            /* Updating entire chat list if user logs in. */
            chatList = chatListResponse.chatList;
            if (this.state.activeChat !== 0) {
              const activeChatIndex = chatList.findIndex((obj) => obj._id === this.state.activeChat)
              chatList[activeChatIndex].participants.forEach((p, pIndex) => {
                if (p.id === this.props.currentUser.id) {
                  chatList[activeChatIndex].participants[pIndex].date = new Date();
                }
              })
            }
          }
          this.setState({
            chatList: chatList
          });
        } else if (chatListResponse.type === "add") {
          ChatSocketServer.getChatList(this.props.currentUser.id);
        } else if (chatListResponse.type === "read") {
          this.receiveReadMessages(chatListResponse.data)
        }

      }

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
    if (socketResponse) {
      ChatSocketServer.getChatList(this.props.currentUser.id);
    }
  }

  receiveReadMessages = (readMessageResponse) => {
    if (this.state.activeChat === readMessageResponse._id) {
      const activeChatIndex = this.state.chatList.findIndex((obj) => obj._id === this.state.activeChat)
      this.state.chatList[activeChatIndex].participants = readMessageResponse.participants;
      this.setState({
        chatList: this.state.chatList
      })
    }
  }

  render() {
    const chatListArr = [];
    if (this.state.isLoading) {
      return <LoadingIndicator />
    } else {
      this.state.chatList.forEach((chat, chatIndex) => {
        let toUser = {};
        var readFlag = true;
        var participant = chat.participants.find((obj) => obj.id !== this.props.currentUser.id);
        var current = chat.participants.find((obj) => obj.id === this.props.currentUser.id);
        var unreadMessages = chat.messages.filter((obj) => (obj.fromUserId !== this.props.currentUser.id && new Date(obj.date) > new Date(current.date)))
        toUser = this.state.publicUsers.find((obj) => obj.id === participant.id);
        let lastDate = "";
        if (ISOFormatDate(new Date()) === ISOFormatDate(chat.meta.date)) {
          lastDate = FormatTime(chat.meta.date)
        } else {
          lastDate = ISOFormatDate(chat.meta.date)
        }
        chatListArr.push(
          <ChatListItem key={chatIndex} id={chat._id} active={this.state.activeChat === chat._id ? true : false} onClick={() => this.selectChat(chat._id, toUser)} key={chat._id}>
            <Avatar imgUrl={toUser.avatar ? toUser.avatar : null} letter={toUser.name[0]} size="40px" />
            <Column className="UserInfo" fill="true">
              <Row justify>
                <Title ellipsis>{toUser.surname ? toUser.name + " " + toUser.surname : toUser.name}</Title>
                <Subtitle nowrap>{lastDate}</Subtitle>
              </Row>
              <Row justify>
                <Title ellipsis>
                  {chat.meta.lastmessage}
                </Title>
                {this.state.activeChat !== chat._id && unreadMessages.length > 0 ?
                  <Subtitle nowrap>
                    <Label circular color="red" key="red">
                      {unreadMessages.length}
                    </Label>
                  </Subtitle> : null}

              </Row>
            </Column>
          </ChatListItem>
        )
      })
    }
    return (
      <>
        <p className="chatListLabel">
          Your contact List
        </p>
        <ChatList className="ChatList" style={{ minWidth: 300 }}>

          {chatListArr}
        </ChatList>
      </>
    );
  }
}

export default ChatListComponent;
