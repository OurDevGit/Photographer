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
  AgentBar,
  IconButton,
  RateBadIcon,
  RateGoodIcon,
  MessageList,
  MessageGroup,
  Message,
  MessageMedia,
  MessageText,
  TextComposer,
  AddIcon,
  SendButton,
  EmojiIcon,
} from '@livechat/ui-kit'
import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart'
import { Grid, Form, TextArea, Popup } from "semantic-ui-react";
import TextareaAutosize from 'react-textarea-autosize'
class Conversation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      publicUsers: [],
      isLoading: false,
      messageLoading: true,
      activeChat: 0,
      chatList: [],
      EmojiShow: false,
      message_text: "",
      isShiftKey: false,
    };
    this.receiveSocketMessages = this.receiveSocketMessages.bind(this);
    this.getMessages = this.getMessages.bind(this);
    this.handleEmoji = this.handleEmoji.bind(this);
    this.handleChangeMessageText = this.handleChangeMessageText.bind(this)
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.send = this.send.bind(this);
    this.sendAndUpdateMessages = this.sendAndUpdateMessages.bind(this);
  }

  componentDidMount() {
    ChatSocketServer.checkSocket();
    window.addEventListener("keydown", this.keydown);
    window.addEventListener("keyup", this.keyup);
    this.getMessages();
    ChatSocketServer.receiveMessage();
    ChatSocketServer.eventEmitter.on('add-message-response', this.receiveSocketMessages);
  }

  componentDidUpdate(prevProps) {
    if (this.props.selectedChat !== prevProps.selectedChat) {
      this.getMessages();
    }
  }

  componentWillUnmount() {
  }

  keydown = (e) => {
    if (e.keyCode === 16) {
      this.setState({
        isShiftKey: true,
      });
    }
  };

  keyup = (e) => {
    if (e.keyCode === 16) {
      this.setState({
        isShiftKey: false,
      });
    }
  };

  getMessages = async () => {
    try {
      const { selectedChat } = this.props;
      const messageResponse = await ChatHttpServer.getMessages(selectedChat);
      if (!messageResponse.error) {
        console.log(messageResponse)
        this.setState({
          conversations: messageResponse.messages.messages,
        });
        // this.scrollMessageContainer();
      } else {
        alert('Unable to fetch messages');
      }
      this.setState({
        messageLoading: false
      });
    } catch (error) {
      this.setState({
        messageLoading: false
      });
    }
  }

  receiveSocketMessages = (socketResponse) => {
    const { toUser } = this.props;
    if (toUser !== null && toUser.id === socketResponse.fromUserId) {
      this.setState({
        conversations: [...this.state.conversations, socketResponse]
      });
      // this.scrollMessageContainer();
    }
  }
  scrollMessageContainer() {
    if (this.messageContainer.current !== null) {
      try {
        setTimeout(() => {
          this.messageContainer.current.scrollTop = this.messageContainer.current.scrollHeight;
        }, 100);
      } catch (error) {
        console.warn(error);
      }
    }
  }

  handleChangeMessageText(e) {
    if (!this.state.send) {
      this.setState({
        message_text: e.target.value
      })
    }

  }

  handleKeyDown(e) {
    this.setState({
      send: false
    })
    if (e.keyCode === 13) {
      if (!this.state.isShiftKey) {
        this.send()
      }
    }
  }

  handleEmoji() {
    this.setState({
      EmojiShow: !this.state.EmojiShow
    })
  }

  addEmoji = e => {
    let emoji = e.native;
    this.setState({
      message_text: this.state.message_text + emoji
    });
  };

  send() {
    const { currentUser, selectedChat, toUser } = this.props;
    if (this.state.message_text !== "") {
      this.setState({
        message_text: "",
        send: true
      })
      this.sendAndUpdateMessages({
        chat:{
          chatId: selectedChat,
          messages: this.state.conversations,
        },
        message: {
          fromUserId: currentUser.id,
          message: (this.state.message_text).trim(),
          toUserId: toUser.id,
          date: new Date()
        }
      });
    }
  }

  sendAndUpdateMessages(message) {
    console.log(message)
    ChatSocketServer.checkSocket();
    try {
      
      ChatSocketServer.sendMessage(message);
      this.setState({
        conversations: [...this.state.conversations, message.message]
      });
      // this.scrollMessageContainer();
    } catch (error) {
      alert(`Can't send your message`);
    }
  }

  render() {
    ChatSocketServer.checkSocket();
    const { currentUser, toUser, selectedChat } = this.props
    const messagelist = [];
    if (this.state.messageLoading) {
      return <LoadingIndicator />
    } else {
      console.log("conver", this.state.conversations)
      // this.state.conversations.forEach(conversation => {
      //   MessageList.push(

      //   )
      // });
    }
    return (
      <>
        <AgentBar className="agentBar">
          <Avatar className="avatarsect" imgUrl={toUser.icon ? toUser.icon : null} letter={toUser.username[0]} />
          <Column fill>
            <Title ellipsis>{toUser.surname ? toUser.name + " " + toUser.surname : toUser.name}</Title>
            <Subtitle>{}</Subtitle>
          </Column>
          <Row className="rateButtons">
            <Column>
              <IconButton>
                <RateBadIcon />
              </IconButton>
            </Column>
            <Column>
              <IconButton>
                <RateGoodIcon />
              </IconButton>
            </Column>
          </Row>
        </AgentBar>
        <MessageList className="MessageList" active>
          <MessageGroup
            avatar="https://livechat.s3.amazonaws.com/default/avatars/male_8.jpg"
            onlyFirstWithMeta
          >
            <Message className="Message" date="21:38" authorName="Jon Smith">
              <MessageText className="messageText">Hi! I would like to buy those shoes</MessageText>
            </Message>
          </MessageGroup>
          <MessageGroup onlyFirstWithMeta>
            <Message className="Message" date="21:38" isOwn={true}>
              <MessageText className="messageText">
                I love them
                sooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo
                much!
                            </MessageText>
            </Message>
            <Message className="Message" date="21:38" isOwn={true}>
              <MessageText className="messageText">This helps me a lot</MessageText>
            </Message>
          </MessageGroup>
          <MessageGroup
            avatar="https://livechat.s3.amazonaws.com/default/avatars/male_8.jpg"
            onlyFirstWithMeta
          >
            <Message className="Message" authorName="Jon Smith" date="21:37">
              <MessageText className="messageText">No problem!</MessageText>
            </Message>
            <Message
              className="Message"
              authorName="Jon Smith"
              imageUrl="https://static.staging.livechatinc.com/1520/P10B78E30V/dfd1830ebb68b4eefe6432d7ac2be2be/Cat-BusinessSidekick_Wallpapers.png"
              date="21:39"
            >
              <MessageText className="messageText">
                The fastest way to help your customers - start chatting with visitors
                who need your help using a free 30-day trial.
                            </MessageText>
            </Message>
            <Message className="Message" authorName="Jon Smith" date="21:39">
              <MessageMedia>
                <img src="https://picktur.s3.eu-central-1.amazonaws.com/MR_1584240003940-ballbook878.jpg" />
              </MessageMedia>
            </Message>
          </MessageGroup>
        </MessageList>
        <TextComposer >
          <Row align="center">
            <IconButton fit>
              <AddIcon />
            </IconButton>
            {/* <TextInput onChange={this.handleChangeMessageText} fill /> */}
            <TextareaAutosize className="sendingText" maxRows="3" minRows="1" value={this.state.message_text} onChange={this.handleChangeMessageText} onKeyDown={this.handleKeyDown} />
            <IconButton fit >
              <Popup
                on='click'
                trigger={<EmojiIcon />}
                position="top right"
              >
                <span>
                  <Picker onSelect={this.addEmoji} />
                </span>
              </Popup>
            </IconButton>
            <SendButton className={this.state.message_text === "" ? "sendButton" : "sendButton active"} fit onClick={this.send} />
          </Row>
        </TextComposer>
      </>
    );
  }
}

export default Conversation;
