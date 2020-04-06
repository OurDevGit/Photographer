import { API_BASE_URL, PHOTO_LIST_SIZE, ACCESS_TOKEN } from "../constants";
import { string } from "prop-types";

const request = options => {
  const headers = new Headers({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*"
  });
  console.log("Token", localStorage.getItem(ACCESS_TOKEN));
  if (localStorage.getItem(ACCESS_TOKEN)) {
    headers.append(
      "Authorization",
      "Bearer " + localStorage.getItem(ACCESS_TOKEN)
    );
  }
  const defaults = { headers: headers };
  options = Object.assign({}, defaults, options);
  return fetch(options.url, options).then(response =>
    response.json().then(json => {
      if (!response.ok) {
        return Promise.reject(json);
      }
      return json;
    })
  );
};

const request1 = options => {
  const headers = new Headers({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*"
    // "Content-Type": "text/plain"
  });
  if (localStorage.getItem(ACCESS_TOKEN)) {
    headers.append(
      "Authorization",
      "Bearer " + localStorage.getItem(ACCESS_TOKEN)
    );
  }
  const defaults = { headers: headers };
  options = Object.assign({}, defaults, options);
  return fetch(options.url, options).then(response => {
    return response;
  });
};

const request_text = options => {
  const headers = new Headers({
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "text/plain"
  });
  if (localStorage.getItem(ACCESS_TOKEN)) {
    headers.append(
      "Authorization",
      "Bearer " + localStorage.getItem(ACCESS_TOKEN)
    );
  }
  const defaults = { headers: headers };
  options = Object.assign({}, defaults, options);
  return fetch(options.url, options).then(response => {
    return response;
  });
};

export function getAllPhotos(page, size) {
  page = page || 0;
  size = size || PHOTO_LIST_SIZE;

  return request({
    url: API_BASE_URL + "/photos?page=" + page + "&size=" + size,
    method: "GET"
  });
}

export function getPhotoLists(page, size) {
  return request({
    url: API_BASE_URL + "/public/lists/homepage?page=" + page + "&size=" + size,
    method: "GET"
  });
}

export function getPhotoListsForSearch(page, size, Request) {
  var searchOptions = "";
  Request.forEach(t => {
    searchOptions = searchOptions + "&" + t.label + "=" + t.value;
  });
  return request({
    url:
      API_BASE_URL +
      "/public/lists/search_photos?page=" +
      page +
      "&size=" +
      size +
      searchOptions,
    method: "GET"
  });
}

export function getNotChoosenForHome(page, size) {
  return request({
    url:
      API_BASE_URL +
      "/public/lists/not_choosen_for_Home?page=" +
      page +
      "&size=" +
      size,
    method: "GET"
  });
}

export function updateChoosedForHome(Request) {
  return request1({
    url: API_BASE_URL + "/public/lists/choosedForHome",
    method: "POST",
    body: JSON.stringify(Request)
  });
}

export function getSubmitPhotos() {
  return request({
    url: API_BASE_URL + "/photo_submit/submitOperations",
    method: "GET"
  });
}

export function getAdminPublicationPhotoList(param) {
  return request({
    url: API_BASE_URL + "/admin/publication_controller/" + param,
    method: "GET"
  });
}

export function getRejectingMotives() {
  return request({
    url: API_BASE_URL + "/admin/publication_controller/list_rejecting_motives",
    method: "GET"
  });
}

export function getNumberOfPhotos() {
  return request({
    url: API_BASE_URL + "/photo_submit/numberOfPhotosUploaded",
    method: "GET"
  });
}

export function getListAuthorizationForUser() {
  return request({
    url: API_BASE_URL + "/authorization_controller/list_authorization_for_user",
    method: "POST"
  });
}

export function JoinAuthorization(JoinRequest) {
  return request({
    url: API_BASE_URL + "/authorization_controller/_join_authorization",
    method: "POST",
    body: JSON.stringify(JoinRequest)
  });
}

export function getListPhotoForAuthorizationIDs(authorizationIDs) {
  return request({
    url:
      API_BASE_URL +
      "/authorization_controller/list_photo_for_authorization_ids",
    method: "POST",
    body: JSON.stringify(authorizationIDs)
  });
}

export function getListAuthorizationForPhotoIDs(photoIDs) {
  return request({
    url:
      API_BASE_URL +
      "/authorization_controller/list_authorization_for_photo_ids",
    method: "POST",
    body: JSON.stringify(photoIDs)
  });
}

export function addAuthorizationToPhotoIDs(addRequest) {
  return request1({
    url:
      API_BASE_URL + "/authorization_controller/add_authorization_to_photo_ids",
    method: "POST",
    body: JSON.stringify(addRequest)
  });
}

export function removeAuthorizationToPhotoIDs(removeRequest) {
  return request1({
    url:
      API_BASE_URL +
      "/authorization_controller/remove_authorization_to_photo_ids",
    method: "POST",
    body: JSON.stringify(removeRequest)
  });
}

export function updateMultiplePhoto(updateRequest) {
  return request({
    url: API_BASE_URL + "/photo_submit/updateMultiplePhoto",
    method: "POST",
    body: JSON.stringify(updateRequest)
  });
}

export function submitMultiplePhoto(submitRequest) {
  return request1({
    url: API_BASE_URL + "/photo_submit/submitMultiplePhoto",
    method: "POST",
    body: JSON.stringify(submitRequest)
  });
}

export function redeemMultiplePhoto(Request) {
  return request1({
    url: API_BASE_URL + "/photo_submit/retrieve_submit_multiplePhoto",
    method: "POST",
    body: JSON.stringify(Request)
  });
}

export function addNewTag(Request) {
  return request1({
    url: API_BASE_URL + "/photo_submit/add_new_tag",
    method: "POST",
    body: Request
  });
}

export function adminAcceptPhoto(Request) {
  return request1({
    url: API_BASE_URL + "/admin/publication_controller/accept_and_rate_photo",
    method: "POST",
    body: JSON.stringify(Request)
  });
}

export function adminRejectPhoto(Request) {
  return request1({
    url: API_BASE_URL + "/admin/publication_controller/reject_Photo",
    method: "POST",
    body: JSON.stringify(Request)
  });
}

export function adminRedeemPhoto(Request) {
  return request1({
    url: API_BASE_URL + "/photo_submit/redeem_photos",
    method: "POST",
    body: JSON.stringify(Request)
  });
}

export function createPhoto(photoData) {
  return request({
    url: API_BASE_URL + "/photos",
    method: "POST",
    body: JSON.stringify(photoData)
  });
}

export function castVote(voteData) {
  return request({
    url: API_BASE_URL + "/photos/" + voteData.photoId + "/votes",
    method: "POST",
    body: JSON.stringify(voteData)
  });
}

export function login(loginRequest) {
  return request({
    url: API_BASE_URL + "/auth/signin",
    method: "POST",
    body: JSON.stringify(loginRequest)
  });
}

export function signup(signupRequest) {
  return request({
    url: API_BASE_URL + "/auth/signup",
    method: "POST",
    body: JSON.stringify(signupRequest)
  });
}

export function checkUsernameAvailability(username) {
  return request({
    url: API_BASE_URL + "/user/checkUsernameAvailability?username=" + username,
    method: "GET"
  });
}

export function checkEmailAvailability(email) {
  return request({
    url: API_BASE_URL + "/user/checkEmailAvailability?email=" + email,
    method: "GET"
  });
}

export function getCurrentUser() {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: API_BASE_URL + "/user/me",
    method: "GET"
  });
}

export function getUserProfile(username) {
  return request({
    url: API_BASE_URL + "/users/" + username,
    method: "GET"
  });
}

export function getUserCreatedPhotos(username, page, size) {
  page = page || 0;
  size = size || PHOTO_LIST_SIZE;

  return request({
    url:
      API_BASE_URL +
      "/users/" +
      username +
      "/photos?page=" +
      page +
      "&size=" +
      size,
    method: "GET"
  });
}

export function getUserVotedPhotos(username, page, size) {
  page = page || 0;
  size = size || PHOTO_LIST_SIZE;

  return request({
    url:
      API_BASE_URL +
      "/users/" +
      username +
      "/votes?page=" +
      page +
      "&size=" +
      size,
    method: "GET"
  });
}

export function getAllCategories() {
  return request({
    url: API_BASE_URL + "/public/categories/getAll",
    method: "GET"
  });
}

export function getAllTags() {
  return request({
    url: API_BASE_URL + "/public/tags/getAll",
    method: "GET"
  });
}

export function getPhotoDetail(id) {
  return request({
    url: API_BASE_URL + "/photo_details_controller/photo_details/" + id,
    method: "GET"
  });
}

export function getSimilarPhotos(id) {
  return request({
    url: API_BASE_URL + "/photo_details_controller/similarPhotos/" + id,
    method: "GET"
  });
}

export function getSameCollection(id) {
  return request({
    url: API_BASE_URL + "/photo_details_controller/same_collection/" + id,
    method: "GET"
  });
}

export function getLikeAmount(id) {
  return request({
    url: API_BASE_URL + "/photo_details_controller/like_amount/" + id,
    method: "GET"
  });
}

export function photo_update(Request) {
  return request({
    url: API_BASE_URL + "/photo_details_controller/photo_update",
    method: "POST",
    body: JSON.stringify(Request)
  });
}

export function getDownloadAmount(id) {
  return request({
    url: API_BASE_URL + "/photo_details_controller/download_amount/" + id,
    method: "GET"
  });
}

export function getViewsAmount(id) {
  return request({
    url: API_BASE_URL + "/photo_details_controller/views_amount/" + id,
    method: "GET"
  });
}

export function getListOfBaskets() {
  return request({
    url:
      API_BASE_URL +
      "/user_actions/photo_actions_controller/list_baskets_for_user",
    method: "GET"
  });
}

export function getListBasketsContent(Request) {
  return request({
    url:
      API_BASE_URL +
      "/user_actions/photo_actions_controller/list_baskets_Content/" +
      Request,
    method: "GET"
  });
}

export function addNewBasketForUser(Request) {
  return request_text({
    url:
      API_BASE_URL +
      "/user_actions/photo_actions_controller/add_new_basket_for_user",
    method: "POST",
    body: Request
  });
}

export function addToBasketForPhoto(Request) {
  return request({
    url: API_BASE_URL + "/user_actions/photo_actions_controller/add_to_basket",
    method: "POST",
    body: JSON.stringify(Request)
  });
}

export function removeToBasketForUser(Request) {
  return request({
    url:
      API_BASE_URL +
      "/user_actions/photo_actions_controller/remove_basket_for_user/" +
      Request,
    method: "GET"
  });
}

export function is_liked(Request) {
  return request({
    url:
      API_BASE_URL +
      "/user_actions/photo_actions_controller/is_liked/" +
      Request,
    method: "GET"
  });
}

export function addToLike(Request) {
  return request1({
    url: API_BASE_URL + "/user_actions/photo_actions_controller/add_like",
    method: "POST",
    body: Request
  });
}

export function removeToLike(Request) {
  return request({
    url:
      API_BASE_URL +
      "/user_actions/photo_actions_controller/remove_like_for_user",
    method: "GET",
    body: JSON.stringify(Request)
  });
}

export function getUsers(page, size) {
  return request({
    url:
      API_BASE_URL +
      "/admin/user_controller/get_users?page=" +
      page +
      "&size=" +
      size,
    method: "GET"
  });
}

export function getUserDetail(id) {
  return request({
    url: API_BASE_URL + "/public/users/getUserDetails/" + id,
    method: "GET"
  });
}

export function update_user(Request) {
  return request1({
    url: API_BASE_URL + "/public/users/update_user",
    method: "POST",
    body: JSON.stringify(Request)
  });
}

export function update_password(Request) {
  return request1({
    url: API_BASE_URL + "/public/users/update_password",
    method: "POST",
    body: JSON.stringify(Request)
  });
}

export function update_password_end(Request) {
  return request1({
    url: API_BASE_URL + "/public/users/update_password_end",
    method: "POST",
    body: JSON.stringify(Request)
  });
}

export function request_new_password(Request) {
  return request_text({
    url: API_BASE_URL + "/public/users/request_new_password",
    method: "POST",
    body: Request
  });
}

export function getPublicUsers(page, size) {
  return request({
    url:
      API_BASE_URL + "/public/users/getUserList?page=" + page + "&size=" + size,
    method: "GET"
  });
}

export function FBLogin() {
  return request1({
    url: API_BASE_URL + "/user_social_management/fb_login",
    method: "GET"
  });
}

export function get_comments_list(param) {
  return request({
    url:
      API_BASE_URL + "/social_comments/get_comments_for_photo?photoId=" + param,
    method: "GET"
  });
}

export function add_comment(Request) {
  return request1({
    url: API_BASE_URL + "/social_comments/add_comment",
    method: "POST",
    body: JSON.stringify(Request)
  });
}

export function get_data_for_diagram(Request) {
  return request({
    url: API_BASE_URL + "/public/diagrams/get_data_for_diagram",
    method: "POST",
    body: JSON.stringify(Request)
  });
}

export function get_all_data_for_user_diagram(Request) {
  return request({
    url: API_BASE_URL + "/public/diagrams/get_all_data_for_user_diagram",
    method: "POST",
    body: JSON.stringify(Request)
  });
}
