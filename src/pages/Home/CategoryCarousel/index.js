/* eslint-disable react/no-this-in-sfc */
/* eslint-disable no-return-assign */
import React, { Component } from 'react'
import { Image, Header, Grid } from 'semantic-ui-react'
import Slider from 'react-slick'

import {
  S1, S2, S3, S4, S5, SupportBg
} from '../../../assets/images/homepage'
import './style.less'

const slides = [
  {
    id    : 1,
    title : 'woman',
    desc  : 'include woman'
  },
  {
    id    : 2,
    title : 'man',
    desc  : 'include man'
  },
  {
    id    : 3,
    title : 'Why to invest',
    desc  : 'Now that you\'ve learned your way around the dashboard, you can do some research: read about the founding team, the company\'s story, and decide if you want to support their mission.',
    image : S3
  },
  {
    id    : 4,
    title : 'Consult financial data',
    desc  : 'Whether you\'re a professional investor or not, you get the answers you need. See clear financial data, key metrics on the company\'s top line results, how things are changing.',
    image : S4
  },
  {
    id    : 5,
    title : 'Invest',
    desc  : 'With your investment plan in mind, whether once or on a recurring basis, start investing with as little as $50/company - and become an insider earning returns if the company succeeds.',
    image : S5
  },
  {
    id    : 6,
    title : 'afas',
    desc  : 'With your investment plan in mind, whether once or on a recurring basis, start investing with as little as $50/company - and become an insider earning returns if the company succeeds.',
    image : S5
  },
  {
    id    : 7,
    title : 'red',
    desc  : 'With your investment plan in mind, whether once or on a recurring basis, start investing with as little as $50/company - and become an insider earning returns if the company succeeds.',
    image : S5
  },
  {
    id    : 8,
    title : 'blue',
    desc  : 'With your investment plan in mind, whether once or on a recurring basis, start investing with as little as $50/company - and become an insider earning returns if the company succeeds.',
    image : S5
  },
]

class CategoryCarousel extends Component {
  componentDidMount() {
    setTimeout(() => {
      document.querySelector('.category-carousel-section').classList.add('animation')
      this.slider.slickPlay()
    }, 500)
  }

  afterChange = (id) => {
    if (id === this.slider.props.children.length - 1) {
      this.slider.slickPause()
      document.querySelector('.category-carousel-section').classList.remove('animation')
    }
  }

  render() {
    const settings = {
      dots           :false,
      infinite       : false,
      speed          : 1500,
      slidesToShow   : 5,
      slidesToScroll : 1,
      autoplay       : true,
      autoplaySpeed  : 8000,
      pauseOnHover   : false,
      afterChange: this.afterChange
    }
    return (
      <section id="learn-more" className="category-carousel-section">
        <Grid container>
          <Grid.Row>
            <Grid.Column width={16}>
              <Slider {...settings} ref={c => (this.slider = c)}>
                {slides.map((slide, index) => (
                  <div key={index}>
                    <div className="category_content">
                      <a href='/'>{slide.title}</a>
                    </div>
                  </div>
                ))}
              </Slider>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </section>
    )
  }
}

export default CategoryCarousel
