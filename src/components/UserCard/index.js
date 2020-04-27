import React from 'react'
import { Button, Card, Image } from 'semantic-ui-react'
import PropTypes from 'prop-types'
import './style.less'

const cardDetail = (users, status) =>{
  var cards = [];
  console.log("ff", status)
  users.forEach(user => {
    console.log(user)
    cards.push(<Card>
                <Card.Content>
                  <Image
                    floated='right'
                    size='mini'
                    src='https://react.semantic-ui.com/images/avatar/large/steve.jpg'
                  />
                  <Card.Header>{user.fullName}</Card.Header>
                  <Card.Meta>Friends of Elliot</Card.Meta>
                  <Card.Description>
                    Steve wants to add you to the group <strong>best friends</strong>
                  </Card.Description>
                </Card.Content>
                <Card.Content extra>
                  <div className='ui two buttons'>
                    <Button inverted color='green'>
                      {status === "followed" ? "Following" : "Follow"}
                    </Button>
                    <Button inverted color='blue'>
                      View
                    </Button>
                  </div>
                </Card.Content>
              </Card>)
  });
  return cards
}

const UserCard = ({users, status}) => (
  <Card.Group>
    {cardDetail(users, status)}
  </Card.Group>
)

UserCard.propTypes = {
  users : PropTypes.object.isRequired,
  status: PropTypes.string
  
}

export default UserCard
