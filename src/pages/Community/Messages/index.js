import React, { Component } from "react";
import { UserCard, HomeHeader } from "../../../components";
import { getPublicUsers, getCurrentUser } from "../../../util/APIUtils";
import LoadingIndicator from "../../../common/LoadingIndicator";
import { Grid, Form, TextArea, Popup } from "semantic-ui-react";
import TextareaAutosize from 'react-textarea-autosize'
import {
  ThemeProvider,
  Row,
  Column,
  Avatar,
  Title,
  Subtitle,
  ChatList,
  ChatListItem,
  AgentBar,
  IconButton,
  RateBadIcon,
  RateGoodIcon,
  MessageList,
  MessageGroup,
  Message,
  MessageMedia,
  MessageText,
  MessageTitle,
  MessageButton,
  MessageButtons,
  QuickReplies,
  TextComposer,
  AddIcon,
  SendButton,
  EmojiIcon,
  TextInput,
  FixedWrapper, darkTheme, elegantTheme, purpleTheme, defaultTheme
} from '@livechat/ui-kit'
import "./style.less";
import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart'

const theme = {
  vars: {
    'primary-color': '#427fe1',
    'secondary-color': '#fbfbfb',
    'tertiary-color': '#fff',
    'avatar-border-color': 'blue',
  },
  AgentBar: {
    Avatar: {
      size: '42px',
    },
    css: {
      backgroundColor: 'var(--secondary-color)',
      borderColor: 'var(--avatar-border-color)',
    }
  },
  Message: {
    css: {
      fontWeight: 'bold',
    },
  },
}
const themes = {
  defaultTheme: {
    FixedWrapperMaximized: {
      css: {
        boxShadow: '0 0 1em rgba(0, 0, 0, 0.1)',
      },
    },
  },
  purpleTheme: {
    ...purpleTheme,
    TextComposer: {
      ...purpleTheme.TextComposer,
      css: {
        ...purpleTheme.TextComposer.css,
        marginTop: '1em',
      },
    },
    OwnMessage: {
      ...purpleTheme.OwnMessage,
      secondaryTextColor: '#fff',
    },
  },
  elegantTheme: {
    ...elegantTheme,
    Message: {
      ...darkTheme.Message,
      secondaryTextColor: '#fff',
    },
    OwnMessage: {
      ...darkTheme.OwnMessage,
      secondaryTextColor: '#fff',
    },
  },
  darkTheme: {
    ...darkTheme,
    Message: {
      ...darkTheme.Message,
      css: {
        ...darkTheme.Message.css,
        color: '#fff',
      },
    },
    OwnMessage: {
      ...darkTheme.OwnMessage,
      secondaryTextColor: '#fff',
    },
    TitleBar: {
      ...darkTheme.TitleBar,
      css: {
        ...darkTheme.TitleBar.css,
        padding: '1em',
      },
    },
  },
}

const commonThemeButton = {
  fontSize: '16px',
  padding: '1em',
  borderRadius: '.6em',
  margin: '1em',
  cursor: 'pointer',
  outline: 'none',
  border: 0,
}

const themePurpleButton = {
  ...commonThemeButton,
  background: 'linear-gradient(to right, #6D5BBA, #8D58BF)',
  color: '#fff',
}

const themeDarkButton = {
  ...commonThemeButton,
  background: 'rgba(0, 0, 0, 0.8)',
  color: '#fff',
}

const themeDefaultButton = {
  ...commonThemeButton,
  background: '#427fe1',
  color: '#fff',
}

const themeElegantButton = {
  ...commonThemeButton,
  background: '#000',
  color: '#D9A646',
}
class Messages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: null,
      isAuthenticated: false,
      user: null,
      isLoading: true,
      followUsers: [],
      EmojiShow: false,
      message_text: "",
      isShiftKey: false,
      activeChat: 0
    };
    this.loadCurrentUser = this.loadCurrentUser.bind(this);
    this.handleSearchTag = this.handleSearchTag.bind(this);
    this.clickSearch = this.clickSearch.bind(this);
    this.handleEmoji = this.handleEmoji.bind(this);
    this.handleChangeMessageText = this.handleChangeMessageText.bind(this)
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.send = this.send.bind(this);
    this.selectChat = this.selectChat.bind(this);
  }

  componentDidMount() {
    this.loadCurrentUser();
    window.addEventListener("keydown", this.keydown);
    window.addEventListener("keyup", this.keyup);
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

  componentDidUpdate(nextProps) { }

  loadCurrentUser() {
    this.setState({
      isLoading: true,
    });
    getCurrentUser()
      .then((response) => {
        this.setState({
          currentUser: response,
          isAuthenticated: true,
          isLoading: false,
        });
      })
      .catch((error) => {
        this.setState({
          isLoading: false,
        });
      });
  }

  handleSearchTag(e) {
    console.log(e);
    this.props.history.push("/?tag=" + e);
  }

  clickSearch(e) {
    this.props.history.push("/?key=" + e);
  }

  handleThemeChange = ({ target }) => {
    console.log('target.name', target.name)
    this.setState({
      theme: target.name + 'Theme',
    })
  }

  selectChat(e){
    this.setState({
      activeChat: e.currentTarget.id
    })
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
    if (this.state.message_text !== "") {
      alert(this.state.message_text)
      this.setState({
        message_text: "",
        send: true
      })
    }
  }

  render() {
    return (
      <>
        <Grid>
          <Grid.Row>
            <Grid.Column width="16">
              <HomeHeader
                isAuthenticated={this.state.isAuthenticated}
                currentUser={this.state.currentUser}
                onLogout={this.handleLogout}
                clickSearch={this.clickSearch}
                handleSearchTag={this.handleSearchTag}
              />
              <ThemeProvider theme={themes['purpleTheme']}>
                <Grid className="MessagePage">
                  <Grid.Row>
                    <Grid.Column width="4">
                      <ChatList style={{ minWidth: 300 }}>
                        <ChatListItem id="1" active={this.state.activeChat === "1" ? true : false} onClick={this.selectChat}>
                          <Avatar letter="K" />
                          <Column fill>
                            <Row justify>
                              <Title ellipsis>{'Konrad'}</Title>
                              <Subtitle nowrap>{'14:31 PM'}</Subtitle>
                            </Row>
                            <Subtitle ellipsis>
                              {'Hello, how can I help you? We have a lot to talk about'}
                            </Subtitle>
                          </Column>
                        </ChatListItem>
                        <ChatListItem id="4" active={this.state.activeChat === "4" ? true : false} onClick={this.selectChat}>
                          <Avatar letter="J" />
                          <Column fill>
                            <Row justify>
                              <Title ellipsis>{'Andrew'}</Title>
                              <Subtitle nowrap>{'14:31 PM'}</Subtitle>
                            </Row>
                            <Subtitle ellipsis>{'actually I just emailed you back'}</Subtitle>
                          </Column>
                        </ChatListItem>
                        <ChatListItem id="3" active={this.state.activeChat === "3" ? true : false} onClick={this.selectChat}>
                          <Avatar imgUrl="https://livechat.s3.amazonaws.com/default/avatars/male_8.jpg" />
                          <Column fill>
                            <Row justify>
                              <Title ellipsis>{'Michael'}</Title>
                              <Subtitle nowrap>{'14:31 PM'}</Subtitle>
                            </Row>
                            <Subtitle ellipsis>
                              {"Ok, thanks for the details, I'll get back to you tomorrow."}
                            </Subtitle>
                          </Column>
                        </ChatListItem>
                      </ChatList>
                    </Grid.Column>
                    <Grid.Column width="12">
                      <AgentBar>
                        <Avatar imgUrl="https://livechat.s3.amazonaws.com/default/avatars/male_8.jpg" />
                        <Column fill>
                          <Title>{'Jon Snow'}</Title>
                          <Subtitle>{'Support hero'}</Subtitle>
                        </Column>
                        <Row>
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
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </ThemeProvider>

            </Grid.Column>
          </Grid.Row>
        </Grid>
      </>
    );
  }
}

export default Messages;
