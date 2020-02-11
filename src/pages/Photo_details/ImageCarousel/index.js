/* eslint-disable react/no-this-in-sfc */
/* eslint-disable no-return-assign */
import React, { Component } from 'react'
import { Image, Header, Grid, Icon } from 'semantic-ui-react'
import Slider from 'react-slick'
import { getCurrentUser, getAllCategories } from '../../../util/APIUtils';
import {Photo} from '../../../components'

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

class ImageCarousel extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      categories:[]
    }
  }

  componentDidMount() {
    setTimeout(() => {
      document.querySelector('.image-carousel-section').classList.add('animation')
      this.slider.slickPlay()
    }, 500)
  }

  afterChange = (id) => {
    if (id === this.slider.props.children.length - 1) {
      this.slider.slickPause()
      document.querySelector('.image-carousel-section').classList.remove('animation')
    }
  }

  render() {
    console.log(this.props.categories)
    const settings = {
      dots           : false,
      infinite       : true,
      speed          : 500,
      slidesToShow   : 5,
      slidesToScroll : 1,
      autoplay       : true,
      autoplaySpeed  : 8000,
      pauseOnHover   : false,
      afterChange: this.afterChange
    }
    return (
      <section id="learn-more" className="image-carousel-section">
        <Grid>
          <Grid.Row>
            <Grid.Column width={16}>
              <Slider {...settings} ref={c => (this.slider = c)}>
                {this.props.photo.map((slide, index) => (
                  <div key={index}>
                    <div className="category_content">
                      {/* <img src='https://picktur.s3.eu-central-1.amazonaws.com/FR_1581394475419-B_HR.jpg' /> */}
                      <Photo
                        // index={photoIndex}
                        photo={slide}
                        // onClick = {this.props.onClickImage}
                        // active = {this.props.active}
                        // total = {this.state.photo_list.length}
                        // type = {this.props.type}
                        // addToBucket = {this.props.addToBucket}
                        // action = {this.props.action}
                        // publish = {this.props.publish}
                        // status = {this.props.status}
                        // currentVote={this.state.currentVotes[photoIndex]}
                        // handleVoteChange={(event) => this.handleVoteChange(event, photoIndex)}
                        // handleVoteSubmit={(event) => this.handleVoteSubmit(event, photoIndex)} 
                        />
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

export default ImageCarousel
