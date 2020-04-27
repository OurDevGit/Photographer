/* eslint-disable react/no-this-in-sfc */
/* eslint-disable no-return-assign */
import React, { Component } from "react";
import {Grid } from "semantic-ui-react";
import Slider from "react-slick";

import "./style.less";

class CategoryCarousel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      categories: [],
    };
  }

  componentDidMount() {
    setTimeout(() => {
      document
        .querySelector(".category-carousel-section")
        .classList.add("animation");
      this.slider.slickPlay();
    }, 500);
  }

  afterChange = (id) => {
    if (id === this.slider.props.children.length - 1) {
      this.slider.slickPause();
      document
        .querySelector(".category-carousel-section")
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
      <section id="learn-more" className="category-carousel-section">
        <Grid container>
          <Grid.Row>
            <Grid.Column width={16}>
              <Slider {...settings} ref={(c) => (this.slider = c)}>
                {this.props.categories.map((slide, index) => (
                  <div key={index}>
                    <div className="category_content">
                      <a href="/">{slide.value}</a>
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

export default CategoryCarousel;
