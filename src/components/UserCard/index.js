import React from 'react'
import { Card, Icon, Image } from 'semantic-ui-react'

const UserCard = ({user}) => (
  <Card>
    <Image src='https://react.semantic-ui.com/images/avatar/large/matthew.png' wrapped ui={false} />
    <Card.Content>
      <Card.Header>{user.name}</Card.Header>
      <Card.Meta>
        <span className='date'>Joined in {user.joinedAt}</span>
      </Card.Meta>
      <Card.Description>
      </Card.Description>
    </Card.Content>
    <Card.Content extra>
      <a>
        <Icon name='user' />
        22 Friends
      </a>
    </Card.Content>
  </Card>
)

export default UserCard