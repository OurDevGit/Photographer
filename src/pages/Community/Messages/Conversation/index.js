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
      participants: []
    };
    this.messageContainer = React.createRef();

    this.receiveSocketMessages = this.receiveSocketMessages.bind(this);
    this.getMessages = this.getMessages.bind(this);
    this.handleEmoji = this.handleEmoji.bind(this);
    this.handleChangeMessageText = this.handleChangeMessageText.bind(this)
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.send = this.send.bind(this);
    this.sendAndUpdateMessages = this.sendAndUpdateMessages.bind(this);
    this.receiveReadMessage = this.receiveReadMessage.bind(this)
  }

  componentDidMount() {
    window.addEventListener("keydown", this.keydown);
    window.addEventListener("keyup", this.keyup);
    this.getMessages();
    ChatSocketServer.receiveMessage();
    ChatSocketServer.eventEmitter.on('add-message-response', this.receiveSocketMessages);
    ChatSocketServer.receiveReadMessage();
    ChatSocketServer.eventEmitter.on('read-message-response', this.receiveReadMessage)
  }

  componentDidUpdate(prevProps) {
    if (this.props.selectedChat !== prevProps.selectedChat) {
      this.getMessages();
    }
  }

  componentWillUnmount() {
    ChatSocketServer.eventEmitter.removeListener('add-message-response', this.receiveSocketMessages);
    ChatSocketServer.eventEmitter.removeListener('read-message-response', this.receiveReadMessage);
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
    this.setState({
      messageLoading: true
    })
    try {
      const { currentUser, toUser, selectedChat } = this.props
      const messageResponse = await ChatHttpServer.getMessages(selectedChat);

      if (!messageResponse.error) {
        var participants = messageResponse.messages.participants;
        participants.forEach((p, pIndex) => {
          if (p.id === currentUser.id) {
            participants[pIndex].date = new Date();
          }
        })
        this.setState({
          conversations: messageResponse.messages.messages,
          participants: participants
        });

        var chatInfo = {
          _id: selectedChat,
          participants: participants,
          toUserId: toUser.id
        }
        ChatSocketServer.readMessage(chatInfo);
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

  receiveSocketMessages = async (socketResponse) => {
    const { currentUser, toUser, selectedChat } = this.props
    if (toUser !== null && toUser.id === socketResponse.fromUserId) {
      var chatInfo = {
        _id: selectedChat,
        participants: [
          { id: currentUser.id, date: new Date() },
          { id: toUser.id, date: new Date() }
        ],
        toUserId: toUser.id
      }
      ChatSocketServer.readMessage(chatInfo)
      this.setState({
        conversations: [...this.state.conversations, socketResponse]
      });
      // this.scrollMessageContainer();
    }
  }

  receiveReadMessage = async (readMessageResponse) => {
    const { currentUser, toUser, selectedChat } = this.props
    if (currentUser !== null && selectedChat === readMessageResponse._id) {
      this.setState({
        participants: readMessageResponse.participants
      })
    }
  }
  scrollMessageContainer() {
    if (this.messageContainer.current !== null) {
      try {
        setTimeout(() => {
          this.messageContainer.current.scrollToBottom();
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
      var now = new Date();
      this.state.participants.forEach((p, pIndex) => {
        if (p.id === currentUser.id) {
          this.state.participants[pIndex].date = now;
        }
      })
      this.sendAndUpdateMessages({
        chat: {
          chatId: selectedChat,
          messages: this.state.conversations,
          participants: this.state.participants
        },
        message: {
          fromUserId: currentUser.id,
          message: (this.state.message_text).trim(),
          toUserId: toUser.id,
          date: now
        }
      });
    }
  }

  sendAndUpdateMessages(message) {
    try {
      ChatSocketServer.sendMessage(message);
      this.setState({
        conversations: [...this.state.conversations, message.message]
      });
      this.scrollMessageContainer();
    } catch (error) {
      alert(`Can't send your message`);
    }
  }

  render() {
    const { currentUser, toUser, selectedChat } = this.props
    var conversationList = [];
    var conversationgroup = [];
    var readLastmsg = true;
    const toParticipant = this.state.participants.find((obj) => obj.id === toUser.id);
    if (this.state.messageLoading || !toParticipant) {
      return <LoadingIndicator />
    } else {
      var groupIndex = 0;
      conversationgroup.push({
        index: groupIndex,
        content: [this.state.conversations[0]]
      })
      for (let i = 1; i < this.state.conversations.length; i++) {
        const t1 = new Date(this.state.conversations[i - 1].date).getTime();
        const t2 = new Date(this.state.conversations[i].date).getTime();
        if (this.state.conversations[i - 1].fromUserId !== this.state.conversations[i].fromUserId || (t2 - t1) > 10 * 60 * 1000) {
          groupIndex++;
          conversationgroup.push({
            index: groupIndex,
            content: [this.state.conversations[i]]
          })
        } else {
          conversationgroup[groupIndex].content.push(this.state.conversations[i]);
        }
      }

      conversationgroup.forEach((group, groupIndex) => {
        const messageArray = [];
        let sendTime = "";
        if (ISOFormatDate(new Date()) === ISOFormatDate(group.content[0].date)) {
          sendTime = FormatTime(group.content[0].date)
        } else {
          sendTime = ISOFormatDate(group.content[0].date) + " " + FormatTime(group.content[0].date)
        }
        group.content.forEach((conv, convIndex) => {
          if (readLastmsg && new Date(conv.date) > new Date(toParticipant.date)) {
            messageArray.push(
              <>
                <Avatar className="readAvatar" imgUrl={toUser.icon ? toUser.icon : null} letter={toUser.username[0]} />
                <p style={{ height: "20px" }}>{" "}</p>
              </>
            )
            readLastmsg = false
          }
          messageArray.push(
            <Message
              key={convIndex}
              className="Message"
              date={sendTime}
              authorName={currentUser.id === conv.fromUserId ? "" : (currentUser.id !== conv.fromUserId && toUser.surname) ? toUser.name + " " + toUser.surname : toUser.name}
              isOwn={currentUser.id === conv.fromUserId}>
              <MessageText className="messageText">
                {conv.message}
              </MessageText>
            </Message>
          )
        })
        if (groupIndex === conversationgroup.length - 1 && readLastmsg) {
          messageArray.push(
            <>
              <Avatar className="readAvatar" imgUrl={toUser.icon ? toUser.icon : null} letter={toUser.username[0]} />
              <p style={{ height: "20px" }}>{" "}</p>
            </>
          )
          readLastmsg = false
        }
        conversationList.push(
          <MessageGroup
            className="messageGroup"
            key={groupIndex}
            avatar={group.content[0].fromUserId !== currentUser.id && toUser.icon ? toUser.icon : null}
            avatarLetter={group.content[0].fromUserId !== currentUser.id ? toUser.name[0] : null}
            onlyFirstWithMeta
          >
            {messageArray}
          </MessageGroup>
        )

      })
      return (
        <>
          <AgentBar className="agentBar">
            <Avatar className="avatarsect" imgUrl={toUser.icon ? toUser.icon : null} letter={toUser.username[0]} />
            <Column fill="true">
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
          <MessageList className="MessageList" active ref={this.messageContainer} >
            {conversationList}
          </MessageList>
          <TextComposer >
            <Row align="center">
              <IconButton fit>
                <AddIcon />
              </IconButton>
              {/* <TextInput onChange={this.handleChangeMessageText} fill /> */}
              <TextareaAutosize className="sendingText" maxRows={3} minRows={1} value={this.state.message_text} onChange={this.handleChangeMessageText} onKeyDown={this.handleKeyDown} />
              <IconButton fit >
                <Popup
                  on='click'
                  trigger={<EmojiIcon color="#ff9811" />}
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
}

export default Conversation;
