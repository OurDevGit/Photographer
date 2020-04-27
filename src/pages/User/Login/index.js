import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import {
  Button,
  Input
} from "semantic-ui-react";
import { login, FBLogin } from "../../../util/APIUtils";
import { ACCESS_TOKEN } from "../../../constants";
import "./style.less";
import { notification } from "antd";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usernameOrEmail: {
        value: "",
      },
      password: {
        value: "",
      },
      falg: false,
      isLoading: false,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }
  handleInputChange(event) {
    const target = event.target;
    const inputName = target.name;
    const inputValue = target.value;

    this.setState({
      [inputName]: {
        value: inputValue,
      },
    });
  }

  handleSubmit(event) {
    event.preventDefault();

    const loginRequest = {
      usernameOrEmail: this.state.usernameOrEmail.value,
      password: this.state.password.value,
    };
    this.setState({ isLoading: true });
    login(loginRequest)
      .then((response) => {
        localStorage.setItem(ACCESS_TOKEN, response.accessToken);
        this.setState({ flag: true, isLoading: false });
      })
      .catch((error) => {
        this.setState({ isLoading: false });
        if (error.status === 401) {
          notification.error({
            message: "Photoing App",
            description:
              "Your Username or Password is incorrect. Please try again!",
          });
        } else {
          notification.error({
            message: "Photoing App",
            description:
              error.message || "Sorry! Something went wrong. Please try again!",
          });
        }
      });
  }

  render() {
    if (this.state.flag) {
      return <Redirect to="/" />;
    } else {
      return (
        <div>
          <Input
            fluid
            icon="user"
            iconPosition="left"
            placeholder="Username or Email address"
            name="usernameOrEmail"
            value={this.state.usernameOrEmail.value}
            onChange={this.handleInputChange}
          />
          <Input
            fluid
            icon="lock"
            iconPosition="left"
            placeholder="Password"
            type="password"
            name="password"
            value={this.state.password.value}
            onChange={this.handleInputChange}
          />
          <Button
            color="teal"
            fluid
            size="large"
            type="submit"
            className="LoginButton"
            onClick={this.handleSubmit}
            loading={this.state.isLoading}
          >
            Login
          </Button>
          <a className="forgotPass" href="/user/ForgotPass">
            Forgot Password?
          </a>
        </div>
      );
    }
  }
}

export default Login;
