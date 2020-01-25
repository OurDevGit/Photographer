import React from 'react'
import { Image } from 'semantic-ui-react'
import './style.less'

const AvatarImage = ({url, name}) => (
  <div className="avatarSection">
    <Image src={url} className="avatar" avatar />
      <span>{name}</span>
  </div>
)

export default AvatarImage