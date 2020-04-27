import React, { Component } from "react";
import { Grid, Button, Form } from "semantic-ui-react";
import { update_password_end } from "../../../util/APIUtils";
import "./style.less";
import { PASSWORD_MIN_LENGTH, PASSWORD_MAX_LENGTH } from "../../../constants";
import { notification } from "antd";

class ResetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: {
        value: "",
      },
      isLoading: false,
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.ResetPassword = this.ResetPassword.bind(this);
    this.validatePassword = this.validatePassword.bind(this);
  }

  handleInputChange(event, validationFun) {
    const target = event.target;
    const inputName = target.name;
    const inputValue = target.value;

    this.setState({
      [inputName]: {
        value: inputValue,
        ...validationFun(inputValue),
      },
    });
  }

  validatePassword = (password) => {
    if (password.length < PASSWORD_MIN_LENGTH) {
      return {
        validateStatus: "error",
        errorMsg: `Password is too short (Minimum ${PASSWORD_MIN_LENGTH} characters needed.)`,
      };
    } else if (password.length > PASSWORD_MAX_LENGTH) {
      return {
        validationStatus: "error",
        errorMsg: `Password is too long (Maximum ${PASSWORD_MAX_LENGTH} characters allowed.)`,
      };
    } else {
      return {
        validateStatus: "success",
        errorMsg: null,
      };
    }
  };

  ResetPassword() {
    const passwordValue = this.state.password.value;
    const passwordValidation = this.validatePassword(passwordValue);

    if (passwordValidation.validateStatus === "error") {
      this.setState({
        password: {
          value: passwordValue,
          ...passwordValidation,
        },
      });
      return;
    }

    this.setState({
      isLoading: true,
      password: {
        value: passwordValue,
        validateStatus: "validating",
        errorMsg: null,
      },
    });
    var tmpTokenLabel = this.props.location.search.split("=")[0].substr(1);
    var tmpTokenValue = this.props.location.search.split("=")[1];
    console.log("tmpT", tmpTokenLabel);
    var ResetRequest = {
      newPassword: passwordValue,
      tmpTokenLabel: tmpTokenValue,
    };
    console.log("rese", ResetRequest);
    update_password_end(ResetRequest)
      .then((response) => {
        console.log(response);
        this.setState({
          isLoading: false,
        });
        notification.success({
          message: "Photoing App",
          description:
            "Successfully reset your password. Please Login with your new password",
        });
      })
      .catch((error) => {
        console.log(error);
        this.setState({
          isLoading: false,
        });
        notification.error({
          message: "Photoing App",
          description:
            "Sorry! There are some wrong problems. Please check your network and try again",
        });
      });
  }

  render() {
    console.log("param", this.props.location.search);
    var tmpTokenLabel = this.props.location.search.split("=")[0].substr(1);
    if (
      !this.props.location.search ||
      this.props.location.search == "" ||
      tmpTokenLabel != "tmpToken"
    ) {
      return <></>;
    }
    return (
      <Grid
        textAlign="center"
        style={{ height: "100vh" }}
        verticalAlign="middle"
        className="ResetPassPage"
      >
        <Grid.Column width="16" style={{ maxWidth: 450 }}>
          <div>
            <h4>Please enter your new password.</h4>
            <Form.Input
              fluid
              autoComplete="off"
              icon="lock"
              iconPosition="left"
              placeholder="A password between 6 to 20 characters"
              type="password"
              name="password"
              value={this.state.password.value}
              onChange={(event) =>
                this.handleInputChange(event, this.validatePassword)
              }
              error={this.state.password.errorMsg}
            />
            <Button
              color="teal"
              fluid
              size="large"
              type="submit"
              className="ResetPass"
              onClick={this.ResetPassword}
              loading={this.state.isLoading ? true : false}
            >
              Reset Password
            </Button>
            <a href="/user/LoginAndSignUp">Go to Login Page</a>
          </div>
        </Grid.Column>
      </Grid>
    );
  }
}

export default ResetPassword;
