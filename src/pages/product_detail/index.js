import React, { Component } from "react";
import { Grid, Button, Icon, Table, Header, Image } from "semantic-ui-react";
import MetaTags from "react-meta-tags";
import { getCurrentUser, getPhotoDetail } from "../../util/APIUtils";
import { ACCESS_TOKEN } from "../../constants";
import { HomeHeader } from "../../components";
import "./style.less";
import { notification } from "antd";
import LoadingIndicator from "../../common/LoadingIndicator";
class product_detail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: null,
      isAuthenticated: false,
      isLoading: false,
      categories: [],
      ImageShow: false,
      similarPhotos: [],
      likes: 0,
      downloads: 0,
      views: 0,
      likeFlag: false,
      BucketShow: false,
      isFollower: false,
      followerUrl: "https://www.instagram.com/plutus_in_fabula/",
      commentContent: "",
      commitFlag: false,
      isCtrlKey: false,
      sameCollectionPhotos: [],
      opne: false,
      ImageShow: false,
      modalImageDetail: {},
    };
    this.handleLogout = this.handleLogout.bind(this);
    this.loadCurrentUser = this.loadCurrentUser.bind(this);
    this.loadPhotoDetail = this.loadPhotoDetail.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.goBack = this.goBack.bind(this);
    this.handleSearchTag = this.handleSearchTag.bind(this);
    this.clickSearch = this.clickSearch.bind(this);
    this.showUserServiceDetail = this.showUserServiceDetail.bind(this);
  }

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

  loadPhotoDetail(id) {
    this.setState({
      isLoading: true,
    });
    getPhotoDetail(id)
      .then((response) => {
        window.scrollTo(0, 0);
        this.setState({
          selImage: response.photoDto,
          similarPhotos: response.similarPhotos.content,
          likes: response.photoDto.likes,
          downloads: response.photoDto.downloads,
          views: response.photoDto.viewed,
        });
      })
      .catch((error) => {
        console.log("error", error);
        this.setState({
          isLoading: false,
        });
      });
  }

  componentDidMount() {
    this.loadCurrentUser();
    this.loadPhotoDetail(this.props.match.params.id);
    window.addEventListener("keydown", this.keydown);
    window.addEventListener("keyup", this.keyup);
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.params.id != prevProps.match.params.id) {
      this.is_like_photo(this.props.match.params.id);
      this.loadPhotoDetail(this.props.match.params.id);
      this.setState({
        selImage: undefined,
        commentContent: "",
      });
    }
  }

  keydown = (e) => {
    if (e.keyCode == 17) {
      this.setState({
        isCtrlKey: true,
      });
    }
  };

  keyup = (e) => {
    if (e.keyCode == 17) {
      this.setState({
        isCtrlKey: false,
      });
    }
  };

  handleLogout(
    redirectTo = "/",
    notificationType = "success",
    description = "You're successfully logged out."
  ) {
    localStorage.removeItem(ACCESS_TOKEN);
    this.setState({
      currentUser: null,
      isAuthenticated: false,
    });

    this.props.history.push(redirectTo);

    notification[notificationType]({
      message: "Photoing App",
      description: description,
    });
  }

  handleLogin() {
    notification.success({
      message: "Photoing App",
      description: "You're successfully logged in.",
    });
    this.loadCurrentUser();
    this.props.history.push("/");
  }

  goBack() {
    this.props.history.goBack();
  }

  handleSearchTag(e) {
    this.props.history.push("/?tag=" + e);
  }

  clickSearch(e) {
    this.props.history.push("/?key=" + e);
  }

  showUserServiceDetail() {
    this.props.history.push("/product_detail/1302804");
  }

  render() {
    const { selImage, similarPhotos } = this.state;
    const keywords = [];
    var url = "";
    var downloadUrl = "";
    if (selImage && selImage.tags) {
      for (let i = 0; i < selImage.tags.length; i++) {
        keywords.push(
          <button onClick={this.sameTagPhotos} id={selImage.tags[i].value}>
            {selImage.tags[i].value}
          </button>
        );
      }
      url = selImage.url_fr + "";
      downloadUrl = selImage.url_hr + "";
    }

    if (!selImage) {
      return <LoadingIndicator />;
    } else {
      return (
        <>
          <MetaTags>
            <title>Openshoot</title>
          </MetaTags>
          <HomeHeader
            isAuthenticated={this.state.isAuthenticated}
            currentUser={this.state.currentUser}
            onLogout={this.handleLogout}
            Back={this.goBack}
            clickSearch={this.clickSearch}
            handleSearchTag={this.handleSearchTag}
          />
          <Grid className="product_details" verticalAlign="">
            <Grid.Row only="computer" className="photo_details_row">
              <Grid.Column width={6}>
                <img src="https://picktur.s3.eu-central-1.amazonaws.com/HR_1584239946119-balintathlete453k.jpg" />
                <div className="keywords">
                  <p>Keywords:</p>
                  {keywords}
                </div>
                <div className="keywords">
                  <p>Exclusions:</p>
                  {keywords}
                </div>
              </Grid.Column>
              <Grid.Column width={10}>
                <div className="photoDetail">
                  <h2>Product Placement with one Model, exclusive shooting</h2>
                  <h3 className="shared">
                    <span className="social">
                      <Icon name="youtube official" />
                    </span>
                    <span className="social">
                      <Icon name="facebook official" />
                    </span>
                    <span className="social">
                      <Icon name="instagram official" />
                    </span>
                    <span>Shared on:</span>
                  </h3>

                  <h3>
                    The Product placement will be set in a photoshooting
                    exclusively realized for the customer in a beach environment
                    in Mexico, with one caucasian and one black model wearing
                    swimming suite. Bla bla, blabla bla blablabla, bla, blabla
                    bla blablabla, bla, blabla bla blablabla, bla, blabla bla
                    blablabla, bla, blabla bla blablabla, bla, blabla bla
                    blablabla, bla, blabla bla blablabla, bla, blabla bla
                    blablabla, bla, blabla bla blablabla, bla, blabla bla
                    blablabla, bla, blabla bla blablabla, bla, blabla bla
                    blablabla, bla, blabla bla blablabla, bla, blabla bla
                    blablabla, bla, blabla bla blablabla, bla, blabla bla
                    blablabla, bla, blabla bla blablabla, bla, blabla bla
                    blablabla, bla, blabla bla blablabla, bla, blabla bla
                    blablabla, bla, blabla bla blablabla, bla, blabla bla
                    blablabla, bla, blabla bla blablabla, bla, blabla bla
                    blablabla, bla, blabla bla blablabla, bla, blabla bla
                    blablabla, bla, blabla bla blablabla, bla, blabla bla
                    blablabla, bla, blabla bla blablabla, bla, blabla bla
                    blablabla, bla, blabla bla blablabla, bla, blabla bla
                    blablabla, bla, blabla bla blablabla, bla, blabla bla
                    blablabla, bla, blabla bla blablabla, bla, blabla bla
                    blablabla, bla.
                  </h3>
                  <p className="Tax">
                    <span> 1.000 $(Incl. Tax)</span>
                    <span className="fee">
                      <b>Fee: </b>
                    </span>
                  </p>
                  <p className="Tax">
                    <span> Available from firm</span>
                    <span>
                      <b>Invoice: </b>
                    </span>
                  </p>
                  <div className="paymentButtons">
                    <Button size="massive" color="blue">
                      Reserve with Escrow
                    </Button>
                    <Button size="massive" color="blue">
                      Contact the Seller
                    </Button>
                  </div>
                </div>
              </Grid.Column>
            </Grid.Row>

            <Grid.Row only="mobile tablet" className="photo_details_row">
              <Grid.Column width={16}>
                <img src="https://picktur.s3.eu-central-1.amazonaws.com/HR_1584239946119-balintathlete453k.jpg" />
                <div className="keywords">
                  <p>Keywords</p>
                  {keywords}
                </div>
              </Grid.Column>

              <Grid.Column width={16}>
                <div className="photoDetail">
                  <h3>Product Placement with one Model, exclusive shooting</h3>
                  <h3 className="shared">
                    <span className="social">
                      <Icon name="youtube official" />
                    </span>
                    <span className="social">
                      <Icon name="facebook official" />
                    </span>
                    <span className="social">
                      <Icon name="instagram official" />
                    </span>
                    <span>Shared on:</span>
                  </h3>
                  <h3>
                    The Product placement will be set in a photoshooting
                    exclusively realized for the customer in a beach environment
                    in Mexico, with one caucasian and one black model wearing
                    swimming suite. Bla bla, blabla bla blablabla, bla, blabla
                    bla blablabla, bla, blabla bla blablabla, bla, blabla bla
                    blablabla, bla, blabla bla blablabla, bla, blabla bla
                    blablabla, bla, blabla bla blablabla, bla, blabla bla
                    blablabla, bla, blabla bla blablabla, bla, blabla bla
                    blablabla, bla, blabla bla blablabla, bla, blabla bla
                    blablabla, bla, blabla bla blablabla, bla, blabla bla
                    blablabla, bla, blabla bla blablabla, bla, blabla bla
                    blablabla, bla, blabla bla blablabla, bla, blabla bla
                    blablabla, bla, blabla bla blablabla, bla, blabla bla
                    blablabla, bla, blabla bla blablabla, bla, blabla bla
                    blablabla, bla, blabla bla blablabla, bla, blabla bla
                    blablabla, bla, blabla bla blablabla, bla, blabla bla
                    blablabla, bla, blabla bla blablabla, bla, blabla bla
                    blablabla, bla, blabla bla blablabla, bla, blabla bla
                    blablabla, bla, blabla bla blablabla, bla, blabla bla
                    blablabla, bla, blabla bla blablabla, bla, blabla bla
                    blablabla, bla, blabla bla blablabla, bla, blabla bla
                    blablabla, bla.
                  </h3>
                  <p className="Tax">
                    <span> 1.000 $(Incl. Tax)</span>
                    <span className="fee">
                      <b>Fee: </b>
                    </span>
                  </p>
                  <p className="Tax">
                    <span> Available from firm</span>
                    <span>
                      <b>Invoice: </b>
                    </span>
                  </p>
                  <div className="paymentButtons">
                    <Button size="huge" color="blue">
                      Reserve with Escrow
                    </Button>
                    <Button size="huge" color="blue">
                      Contact the Seller
                    </Button>
                  </div>
                </div>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row className="ProductServiceGrid">
              <h3>The User offers this services</h3>
              <div className="userServiceTable">
                <Table basic="very" selectable>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell></Table.HeaderCell>
                      <Table.HeaderCell>Service:</Table.HeaderCell>
                      <Table.HeaderCell>Platforms shared</Table.HeaderCell>
                      <Table.HeaderCell>Price</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>

                  <Table.Body>
                    <Table.Row onClick={this.showUserServiceDetail}>
                      <Table.Cell>
                        <Image
                          src="https://picktur.s3.eu-central-1.amazonaws.com/HR_1584239946119-balintathlete453k.jpg"
                          rounded
                          size="tiny"
                        />
                      </Table.Cell>
                      <Table.Cell>
                        <Header as="h4">
                          <Header.Content>
                            Dedicated Photoshoots with one Model
                          </Header.Content>
                        </Header>
                      </Table.Cell>
                      <Table.Cell></Table.Cell>
                      <Table.Cell>1.000 $</Table.Cell>
                    </Table.Row>
                    <Table.Row onClick={this.showUserServiceDetail}>
                      <Table.Cell>
                        <Image
                          src="https://picktur.s3.eu-central-1.amazonaws.com/HR_1584239946119-balintathlete453k.jpg"
                          rounded
                          size="tiny"
                        />
                      </Table.Cell>
                      <Table.Cell>
                        <Header as="h4">
                          <Header.Content>
                            Dedicated Photoshoots with two Models
                          </Header.Content>
                        </Header>
                      </Table.Cell>
                      <Table.Cell></Table.Cell>
                      <Table.Cell>2.000 $</Table.Cell>
                    </Table.Row>
                    <Table.Row onClick={this.showUserServiceDetail}>
                      <Table.Cell>
                        <Image
                          src="https://picktur.s3.eu-central-1.amazonaws.com/HR_1584239946119-balintathlete453k.jpg"
                          rounded
                          size="tiny"
                        />
                      </Table.Cell>
                      <Table.Cell>
                        <Header as="h4">
                          <Header.Content>
                            Product Placement with one Model, exclusive shooting
                          </Header.Content>
                        </Header>
                      </Table.Cell>
                      <Table.Cell>
                        <span className="social">
                          <Icon name="youtube official" />
                        </span>
                        <span className="social">
                          <Icon name="facebook official" />
                        </span>
                        <span className="social">
                          <Icon name="instagram official" />
                        </span>
                      </Table.Cell>
                      <Table.Cell>1.000 $</Table.Cell>
                    </Table.Row>
                    <Table.Row onClick={this.showUserServiceDetail}>
                      <Table.Cell>
                        <Image
                          src="https://picktur.s3.eu-central-1.amazonaws.com/HR_1584239946119-balintathlete453k.jpg"
                          rounded
                          size="tiny"
                        />
                      </Table.Cell>
                      <Table.Cell>
                        <Header as="h4">
                          <Header.Content>
                            Product Placement with one Model, SHared shooting
                          </Header.Content>
                        </Header>
                      </Table.Cell>
                      <Table.Cell>
                        <span className="social">
                          <Icon name="youtube official" />
                        </span>
                        <span className="social">
                          <Icon name="facebook official" />
                        </span>
                        <span className="social">
                          <Icon name="instagram official" />
                        </span>
                      </Table.Cell>
                      <Table.Cell>500 $</Table.Cell>
                    </Table.Row>
                  </Table.Body>
                </Table>
              </div>
            </Grid.Row>
          </Grid>
        </>
      );
    }
  }
}
export default product_detail;
