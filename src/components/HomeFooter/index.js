import React from 'react'
import { Grid, Image, Menu } from 'semantic-ui-react'

import './style.less'
import { HeartIcon, SunflowerIcon, TwitterIcon, LinkedinIcon, GithubIcon, PaperPlaneIcon, QuestionIcon } from '../../assets/icons'
import WhiteLogo from '../../assets/images/logo.PNG'

const HomeFooter = () => (
  <div className="footer">
    <Grid container>
      <Grid.Row>
        <div>
          {/* <Image src={WhiteLogo} className="logo" /> */}
          <h2 className="logo">Openshoots</h2>
        </div>
        <div>
          <Menu borderless>
            <Menu.Item as="a" href="#" target="_blank">
              Blog
            </Menu.Item>
            <Menu.Item as="a" href="#" target="_blank">
              Legal
            </Menu.Item>
            <Menu.Item as="a" href="#">
              <PaperPlaneIcon className="paper-plane-icon" />
              Contact us
            </Menu.Item>
            <Menu.Item as="a" href="#" target="_blank">
              <QuestionIcon className="question-icon" />
              Help
            </Menu.Item>
          </Menu>
        </div>
        <div className="social-icons">
          <Menu.Item as="a" href="W" target="_blank">
            <TwitterIcon />
          </Menu.Item>
          <Menu.Item as="a" href="W" target="_blank">
            <LinkedinIcon />
          </Menu.Item>
          <Menu.Item as="a" href="#" target="_blank">
            <GithubIcon />
          </Menu.Item>
        </div>
      </Grid.Row>
    </Grid>
    <div className="desc">
      <span>Made with</span>
      <HeartIcon className="heart-icon" />
      <span>by Developer Team <SunflowerIcon className="sunflower-icon" /></span>
    </div>
  </div>
)

export default HomeFooter
