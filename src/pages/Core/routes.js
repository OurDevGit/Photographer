import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import Home from "../Home";
import Profile from "../User/Profile";
import AddContent from "../AddContent";
import SubmitContent from "../AddContent/SubmitContent";
import Analyse from "../AddContent/Analyse";
import Admin from "../Admin";
import Photo_details from "../Photo_details";
import product_detail from "../product_detail";
import PhotoModify from "../PhotoModify";
import Follows from "../Community/Follows";
import DownloadedPhotos from "../Usage/DownloadedPhotos";
import LoginAndSignUp from "../User";
import ForgotPass from "../User/ForgotPassword";
import ResetPassword from "../User/ResetPassword";
import FBLogin from "../User/FBLogin";
import Messages from "../Community/Messages"
const routes = (
  <Switch>
    <Route path="/" exact component={Home} />
    <Route path="/user/LoginAndSignUp" exact component={LoginAndSignUp} />
    <Route path="/user/Profile/:id" exact component={Profile} />
    <Route path="/addcontent" exact component={AddContent} />
    <Route path="/submitcontent" exact component={SubmitContent} />
    <Route path="/analyse" exact component={Analyse} />
    <Route path="/admin" exact component={Admin} />
    <Route path="/Photo_details/:id" exact component={Photo_details} />
    <Route path="/product_detail/:id" exact component={product_detail} />
    <Route path="/photomodify" exact component={PhotoModify} />
    <Route path="/follows" exact component={Follows} />
    <Route path="/messages" exact component={Messages} />
    <Route path="/downloadedPhotos" exact component={DownloadedPhotos} />
    <Route path="/user/ForgotPass" exact component={ForgotPass} />
    <Route path="/confirm_new_password" exact component={ResetPassword} />
    <Route path="/fb" exact component={FBLogin} />
    {/* <Redirect path="*" to="/" /> */}
  </Switch>
);

export default routes;
