import React, { Component } from "react";
import { Grid, Button, Form } from "semantic-ui-react";
import {
  checkEmailAvailability,
  request_new_password,
} from "../../../util/APIUtils";
import "./style.less";
import { notification } from "antd";

class ForgotPass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: {
        value: "",
      },
      isLoading: false,
    };
    this.validateEmail = this.validateEmail.bind(this);
    this.validateEmailAvailability = this.validateEmailAvailability.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
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

  validateEmail = (email) => {
    if (!email) {
      return {
        validateStatus: "error",
        errorMsg: "Email may not be empty",
      };
    }

    const EMAIL_REGEX = RegExp("[^@ ]+@[^@ ]+\\.[^@ ]+");
    if (!EMAIL_REGEX.test(email)) {
      return {
        validateStatus: "error",
        errorMsg: "Email not valid",
      };
    }

    return {
      validateStatus: null,
      errorMsg: null,
    };
  };

  validateEmailAvailability() {
    // First check for client side errors in email
    const emailValue = this.state.email.value;
    const emailValidation = this.validateEmail(emailValue);

    if (emailValidation.validateStatus === "error") {
      this.setState({
        email: {
          value: emailValue,
          ...emailValidation,
        },
      });
      return;
    }

    this.setState({
      isLoading: true,
      email: {
        value: emailValue,
        validateStatus: "validating",
        errorMsg: null,
      },
    });

    checkEmailAvailability(emailValue)
      .then((response) => {
        console.log(response);
        if (response.available) {
          this.setState({
            email: {
              value: emailValue,
              validateStatus: "error",
              errorMsg:
                "we can't find your accouont associated with " + emailValue,
            },
            isLoading: false,
          });
        } else {
          this.setState({
            email: {
              value: emailValue,
              validateStatus: "success",
              errorMsg: null,
            },
          });
          request_new_password(emailValue)
            .then((response) => {
              console.log("request", response);
              this.setState({
                isLoading: false,
              });
              notification.success({
                message: "Photoing App",
                description:
                  "Thank you! We sent link to your email. Please check your email",
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
                  "Sorry. There is some wrong problems. Please check your network status and try again",
              });
            });
        }
      })
      .catch((error) => {
        // Marking validateStatus as success, Form will be recchecked at server
        this.setState({
          email: {
            value: emailValue,
            validateStatus: "success1111",
            errorMsg: null,
          },
          isLoading: false,
        });
      });
  }

  render() {
    return (
      <Grid
        textAlign="center"
        style={{ height: "100vh" }}
        verticalAlign="middle"
        className="ForgotPassPage"
      >
        <Grid.Column width="16" style={{ maxWidth: 450 }}>
          <div>
            <h4>Please enter your email address.</h4>
            <Form.Input
              fluid
              icon="mail"
              autoComplete="off"
              iconPosition="left"
              placeholder="E-mail address"
              name="email"
              value={this.state.email.value}
              // onBlur={this.validateEmailAvailability}
              onChange={(event) =>
                this.handleInputChange(event, this.validateEmail)
              }
              error={this.state.email.errorMsg}
              disabled={this.state.isLoading ? true : false}
            />
            <Button
              color="teal"
              fluid
              size="large"
              type="submit"
              className="SendEmail"
              onClick={this.validateEmailAvailability}
              loading={this.state.isLoading ? true : false}
            >
              Send
            </Button>
          </div>
        </Grid.Column>
      </Grid>
    );
  }
}

export default ForgotPass;
