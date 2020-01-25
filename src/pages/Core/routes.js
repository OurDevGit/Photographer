import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import Home from '../Home'
import Login from '../User/Login'
import SignUp from '../User/SignUp'
import Profile from '../User/Profile'
import AddContent from '../AddContent'
import SubmitContent from '../AddContent/SubmitContent'
const routes = (
  <Switch>
    <Route path="/" exact component={Home} />
    <Route path="/user/Login" exact component={Login} />
    <Route path="/user/SignUp" exact component={SignUp} />
    <Route path="/user/Profile" exact component={Profile} />
    <Route path="/addcontent" exact component={AddContent} />
    <Route path="/submitcontent" exact component={SubmitContent} />
    <Redirect path="*" to="/" />
  </Switch>
)

export default routes
