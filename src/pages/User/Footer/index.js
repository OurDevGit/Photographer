import React from 'react'
import { Button, Image } from 'semantic-ui-react'
import { NavLink } from 'react-router-dom'

import {
  TriaRect,
  TriaRectSmall
} from '../../../assets/images/homepage'
import { HomeFooter } from '../../../components'
import './style.less'

const Footer = () => (
  <footer>
    <Image src={TriaRect} className="footer-bg-1" />
    <Image src={TriaRectSmall} className="footer-bg-2" />
    <div className="contact-us">
      <span className="sub-title">Register as a Photographer</span>
      <span className="title">Interested in uploading and sharing for your great pictures? Contact us.</span>
      <span className="desc"></span>
      <NavLink to="/founders">
        <Button primary basic>
          I am interested
        </Button>
      </NavLink>
    </div>
    <HomeFooter />
  </footer>
)

export default Footer
