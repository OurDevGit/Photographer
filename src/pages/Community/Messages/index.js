import React, { Component } from "react";
import { HomeHeader } from "../../../components";
import { getPublicUsers, getCurrentUser } from "../../../util/APIUtils";
import LoadingIndicator from "../../../common/LoadingIndicator";
import { Grid } from "semantic-ui-react";
import ChatListComponent from './ChatListComponent'
import Conversation from './Conversation'
import ChatSocketServer from '../../../util/chatSocketServer';
import {
  ThemeProvider,
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
      activeChat: -1,
      toUser: null
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
    if(this.props.location.search){
      this.setState({
        selChatId: this.props.location.search.split("&")[0].split("=")[1],
        selUserId: this.props.location.search.split("&")[1].split("=")[1]
      })
    }
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
        ChatSocketServer.establishSocketConnection(response.id);
      })
      .catch((error) => {
        this.setState({
          isLoading: false,
        });
      });
  }

  handleSearchTag(e) {
    this.props.history.push("/?tag=" + e);
  }

  clickSearch(e) {
    this.props.history.push("/?key=" + e);
  }

  handleThemeChange = ({ target }) => {
    this.setState({
      theme: target.name + 'Theme',
    })
  }

  selectChat(id, toUser) {
    this.setState({
      activeChat: id,
      toUser: toUser
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
    if (this.state.isLoading) {
      return <LoadingIndicator />
    }
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
                      <ChatListComponent currentUser={this.state.currentUser} selectChat={this.selectChat} selChatId={this.state.selChatId} selUserId={this.state.selUserId} />
                    </Grid.Column>
                    <Grid.Column width="12">

                      {
                        this.state.activeChat !== -1 ?
                          <Conversation currentUser={this.state.currentUser} selectedChat={this.state.activeChat} toUser={this.state.toUser} />
                          : <p className="nocontact">Please select Chat on left side bar.</p>
                      }

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
