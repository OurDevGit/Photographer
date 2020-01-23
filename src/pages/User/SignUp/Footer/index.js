import React from 'react'
import { Button, Image } from 'semantic-ui-react'
import { NavLink } from 'react-router-dom'

import {
  TriaRect,
  TriaRectSmall
} from '../../../../../assets/images/homepage'
import { HomeFooter } from '../../../../../components'
import './style.less'

const Footer = () => (
  <footer>
    <Image src={TriaRect} className="footer-bg-1" />
    <Image src={TriaRectSmall} className="footer-bg-2" />
    <div className="contact-us">
      <span className="sub-title">Register as a company</span>
      <span className="title">Interested in launching a Continuous Security Offering for your company? Contact us.</span>
      <span className="desc">As a founder, a board member, you have the opportunity today, to turn your customers, your stakeholders into your investors. Let's build a stakeholder-centric model together.</span>
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
