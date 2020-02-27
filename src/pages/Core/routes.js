import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import Home from '../Home'
import Login from '../User/Login'
import SignUp from '../User/SignUp'
import Profile from '../User/Profile'
import AddContent from '../AddContent'
import SubmitContent from '../AddContent/SubmitContent'
import Admin from '../Admin'
import Photo_details from '../Photo_details'
import LoginAndSignUp from '../User'
const routes = (
  <Switch>
    <Route path="/" exact component={Home} />
    <Route path="/user/LoginAndSignUp" exact component={LoginAndSignUp} />
    <Route path="/user/Login" exact component={Login} />
    <Route path="/user/SignUp" exact component={SignUp} />
    <Route path="/user/Profile/:id" exact component={Profile} />
    <Route path="/addcontent" exact component={AddContent} />
    <Route path="/submitcontent" exact component={SubmitContent} />
    <Route path="/admin" exact component={Admin} />
    <Route path="/Photo_details/:id" exact component={Photo_details}/>
    {/* <Redirect path="*" to="/" /> */}
  </Switch>
)

export default routes
