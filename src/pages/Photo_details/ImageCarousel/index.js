import React, { Component } from "react";
import { Image, Header, Grid, Icon } from "semantic-ui-react";
import Slider from "react-slick";
import { Photo } from "../../../components";
import "./style.less";

class ImageCarousel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
    };
  }

  componentDidMount() {
    setTimeout(() => {
      document
        .querySelector(".image-carousel-section")
        .classList.add("animation");
      this.slider.slickPlay();
    }, 500);
  }

  afterChange = (id) => {
    if (id === this.slider.props.children.length - 1) {
      this.slider.slickPause();
      document
        .querySelector(".image-carousel-section")
        .classList.remove("animation");
    }
  };

  render() {
    const settings = {
      dots: false,
      infinite: true,
      speed: 500,
      slidesToShow: 5,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 8000,
      pauseOnHover: false,
      afterChange: this.afterChange,
    };
    return (
      <section id="learn-more" className="image-carousel-section">
        <Grid>
          <Grid.Row>
            <Grid.Column width={16}>
              <Slider {...settings} ref={(c) => (this.slider = c)}>
                {this.props.photo.map((photo, index) => (
                  <div key={index}>
                    <div className="category_content">
                      <a href={"/Photo_details/" + photo.id}>
                        <Photo photo={photo} />
                      </a>
                    </div>
                  </div>
                ))}
              </Slider>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </section>
    );
  }
}

export default ImageCarousel;
