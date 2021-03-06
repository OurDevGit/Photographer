import { API_BASE_URL, PHOTO_LIST_SIZE, ACCESS_TOKEN } from "../constants";
import { string } from "prop-types";

const request = (options) => {
  const headers = new Headers({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });
  if (localStorage.getItem(ACCESS_TOKEN)) {
    console.log(localStorage.getItem(ACCESS_TOKEN))
    headers.append(
      "Authorization",
      "Bearer " + localStorage.getItem(ACCESS_TOKEN)
    );
  }
  const defaults = { headers: headers };
  options = Object.assign({}, defaults, options);
  return fetch(options.url, options).then((response) =>
    response.json().then((json) => {
      if (!response.ok) {
        return Promise.reject(json);
      }
      return json;
    })
  );
};

const request1 = (options) => {
  const headers = new Headers({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
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
  return fetch(options.url, options).then((response) => {
    return response;
  });
};

const request_text = (options) => {
  const headers = new Headers({
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "text/plain",
  });
  if (localStorage.getItem(ACCESS_TOKEN)) {
    headers.append(
      "Authorization",
      "Bearer " + localStorage.getItem(ACCESS_TOKEN)
    );
  }
  const defaults = { headers: headers };
  options = Object.assign({}, defaults, options);
  return fetch(options.url, options).then((response) => {
    return response;
  });
};

export function getAllPhotos(page, size) {
  page = page || 0;
  size = size || PHOTO_LIST_SIZE;

  return request({
    url: API_BASE_URL + "/photos?page=" + page + "&size=" + size,
    method: "GET",
  });
}

export function getPhotoLists(page, size) {
  return request({
    url: API_BASE_URL + "/public/lists/homepage?page=" + page + "&size=" + size,
    method: "GET",
  });
}

export function getPhotoListsForSearch(page, size, Request) {
  var searchOptions = "";
  Request.forEach((t) => {
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
    method: "GET",
  });
}

export function getPhotoListsForSearchByTag(page, size, Request) {
  return request({
    url:
      API_BASE_URL +
      "/public/lists/search_photos_by_tag?page=" +
      page +
      "&size=" +
      size +
      "&tag=" +
      Request,
    method: "GET",
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
    method: "GET",
  });
}

export function updateChoosedForHome(Request) {
  return request1({
    url: API_BASE_URL + "/public/lists/choosedForHome",
    method: "POST",
    body: JSON.stringify(Request),
  });
}

export function getTrendingTags() {
  return request({
    url: API_BASE_URL + "/public/lists/trending_tags",
    method: "GET",
  });
}

export function getRecentTags() {
  return request({
    url: API_BASE_URL + "/public/lists/recent_tags",
    method: "GET",
  });
}

export function getSubmitPhotos() {
  return request({
    url: API_BASE_URL + "/photo_submit/submitOperations",
    method: "GET",
  });
}

export function getAdminPublicationPhotoList(param) {
  return request({
    url: API_BASE_URL + "/admin/publication_controller/" + param,
    method: "GET",
  });
}

export function getRejectingMotives() {
  return request({
    url: API_BASE_URL + "/admin/publication_controller/list_rejecting_motives",
    method: "GET",
  });
}

export function getNumberOfPhotos() {
  return request({
    url: API_BASE_URL + "/photo_submit/numberOfPhotosUploaded",
    method: "GET",
  });
}

export function getListAuthorizationForUser() {
  return request({
    url: API_BASE_URL + "/authorization_controller/list_authorization_for_user",
    method: "POST",
  });
}

export function JoinAuthorization(JoinRequest) {
  return request({
    url: API_BASE_URL + "/authorization_controller/_join_authorization",
    method: "POST",
    body: JSON.stringify(JoinRequest),
  });
}

export function getListPhotoForAuthorizationIDs(authorizationIDs) {
  return request({
    url:
      API_BASE_URL +
      "/authorization_controller/list_photo_for_authorization_ids",
    method: "POST",
    body: JSON.stringify(authorizationIDs),
  });
}

export function getListAuthorizationForPhotoIDs(photoIDs) {
  return request({
    url:
      API_BASE_URL +
      "/authorization_controller/list_authorization_for_photo_ids",
    method: "POST",
    body: JSON.stringify(photoIDs),
  });
}

export function addAuthorizationToPhotoIDs(addRequest) {
  return request1({
    url:
      API_BASE_URL + "/authorization_controller/add_authorization_to_photo_ids",
    method: "POST",
    body: JSON.stringify(addRequest),
  });
}

export function removeAuthorizationToPhotoIDs(removeRequest) {
  return request1({
    url:
      API_BASE_URL +
      "/authorization_controller/remove_authorization_to_photo_ids",
    method: "POST",
    body: JSON.stringify(removeRequest),
  });
}

export function updateMultiplePhoto(updateRequest) {
  return request({
    url: API_BASE_URL + "/photo_submit/updateMultiplePhoto",
    method: "POST",
    body: JSON.stringify(updateRequest),
  });
}

export function submitMultiplePhoto(submitRequest) {
  return request1({
    url: API_BASE_URL + "/photo_submit/submitMultiplePhoto",
    method: "POST",
    body: JSON.stringify(submitRequest),
  });
}

export function redeemMultiplePhoto(Request) {
  return request1({
    url: API_BASE_URL + "/photo_submit/retrieve_submit_multiplePhoto",
    method: "POST",
    body: JSON.stringify(Request),
  });
}

export function deleteMultiplePhoto(Request) {
  return request1({
    url: API_BASE_URL + "/photo_submit/deleteMultiplePhoto",
    method: "DELETE",
    body: JSON.stringify(Request),
  });
}

export function addNewTag(Request) {
  return request1({
    url: API_BASE_URL + "/photo_submit/add_new_tag",
    method: "POST",
    body: Request,
  });
}

export function adminAcceptPhoto(Request) {
  return request1({
    url: API_BASE_URL + "/admin/publication_controller/accept_and_rate_photo",
    method: "POST",
    body: JSON.stringify(Request),
  });
}

export function adminRejectPhoto(Request) {
  return request1({
    url: API_BASE_URL + "/admin/publication_controller/reject_Photo",
    method: "POST",
    body: JSON.stringify(Request),
  });
}

export function adminRedeemPhoto(Request) {
  return request1({
    url: API_BASE_URL + "/photo_submit/redeem_photos",
    method: "POST",
    body: JSON.stringify(Request),
  });
}

export function createPhoto(photoData) {
  return request({
    url: API_BASE_URL + "/photos",
    method: "POST",
    body: JSON.stringify(photoData),
  });
}

export function castVote(voteData) {
  return request({
    url: API_BASE_URL + "/photos/" + voteData.photoId + "/votes",
    method: "POST",
    body: JSON.stringify(voteData),
  });
}

export function login(loginRequest) {
  return request({
    url: API_BASE_URL + "/auth/signin",
    method: "POST",
    body: JSON.stringify(loginRequest),
  });
}

export function signup(signupRequest) {
  return request({
    url: API_BASE_URL + "/auth/signup",
    method: "POST",
    body: JSON.stringify(signupRequest),
  });
}

export function checkUsernameAvailability(username) {
  return request({
    url: API_BASE_URL + "/user/checkUsernameAvailability?username=" + username,
    method: "GET",
  });
}

export function checkEmailAvailability(email) {
  return request({
    url: API_BASE_URL + "/user/checkEmailAvailability?email=" + email,
    method: "GET",
  });
}

export function getCurrentUser() {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: API_BASE_URL + "/user/me",
    method: "GET",
  });
}

export function getUserProfile(username) {
  return request({
    url: API_BASE_URL + "/users/" + username,
    method: "GET",
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
    method: "GET",
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
    method: "GET",
  });
}

export function getAllCategories() {
  return request({
    url: API_BASE_URL + "/public/categories/getAll",
    method: "GET",
  });
}

export function getAllTags() {
  return request({
    url: API_BASE_URL + "/public/tags/getAll",
    method: "GET",
  });
}

export function getPhotoDetail(id) {
  return request({
    url: API_BASE_URL + "/photo_details_controller/photo_details/" + id,
    method: "GET",
  });
}

export function getSimilarPhotos(id) {
  return request({
    url: API_BASE_URL + "/photo_details_controller/similarPhotos/" + id,
    method: "GET",
  });
}

export function getPublishedPhotos(id) {
  return request({
    url: API_BASE_URL + "/photo_details_controller/user_photos_published/" + id,
    method: "GET",
  });
}

export function getDownloadedPhotos(id) {
  return request({
    url:
      API_BASE_URL + "/photo_details_controller/user_photos_downloadeded/" + id,
    method: "GET",
  });
}

export function getUserPhotos(id) {
  return request({
    url:
      API_BASE_URL + "/photo_details_controller/user_photos/" + id,
    method: "GET",
  });
}

export function getPhotoAuthDownload(id) {
  return request1({
    url: API_BASE_URL + "/photo_details_controller/photo_auth_download/" + id,
    method: "GET",
  });
}

export function getSameCollection(id) {
  return request({
    url: API_BASE_URL + "/photo_details_controller/same_collection/" + id,
    method: "GET",
  });
}

export function getLikeAmount(id) {
  return request({
    url: API_BASE_URL + "/photo_details_controller/like_amount/" + id,
    method: "GET",
  });
}

export function photo_update(Request) {
  return request1({
    url: API_BASE_URL + "/photo_details_controller/photo_update",
    method: "POST",
    body: JSON.stringify(Request),
  });
}

export function getDownloadAmount(id) {
  return request({
    url: API_BASE_URL + "/photo_details_controller/download_amount/" + id,
    method: "GET",
  });
}

export function getViewsAmount(id) {
  return request({
    url: API_BASE_URL + "/photo_details_controller/views_amount/" + id,
    method: "GET",
  });
}

export function get_photo_links(id){
  return request({
    url: API_BASE_URL + "/photo_details_controller/get_photo_links/" + id,
    method: "GET"
  })
}

export function save_update_photo_links(Request){
  return request1({
    url: API_BASE_URL + "/photo_details_controller/save_update_photo_links",
    method: "POST",
    body: JSON.stringify(Request)
  })
}

export function getListOfBaskets() {
  return request({
    url:
      API_BASE_URL +
      "/user_actions/photo_actions_controller/list_baskets_for_user",
    method: "GET",
  });
}

export function getListBasketsContent(Request) {
  return request({
    url:
      API_BASE_URL +
      "/user_actions/photo_actions_controller/list_baskets_Content/" +
      Request,
    method: "GET",
  });
}

export function addNewBasketForUser(Request) {
  return request_text({
    url:
      API_BASE_URL +
      "/user_actions/photo_actions_controller/add_new_basket_for_user",
    method: "POST",
    body: Request,
  });
}

export function addToBasketForPhoto(Request) {
  return request1({
    url: API_BASE_URL + "/user_actions/photo_actions_controller/add_to_basket",
    method: "POST",
    body: JSON.stringify(Request),
  });
}

export function removeBasketForUser(Request) {
  return request1({
    url:
      API_BASE_URL +
      "/user_actions/photo_actions_controller/remove_basket_for_user/" +
      Request,
    method: "GET",
  });
}

export function removePhotoFromBasket(Request) {
  return request1({
    url:
      API_BASE_URL +
      "/user_actions/photo_actions_controller/remove_photo_from_basket",
    method: "POST",
    body: JSON.stringify(Request)
  });
}

export function is_liked(Request) {
  return request({
    url:
      API_BASE_URL +
      "/user_actions/photo_actions_controller/is_liked/" +
      Request,
    method: "GET",
  });
}

export function addToLike(Request) {
  return request1({
    url: API_BASE_URL + "/user_actions/photo_actions_controller/add_like",
    method: "POST",
    body: Request,
  });
}

export function removeToLike(Request) {
  return request({
    url:
      API_BASE_URL +
      "/user_actions/photo_actions_controller/remove_like_for_user",
    method: "GET",
    body: JSON.stringify(Request),
  });
}

export function download(Request) {
  return request_text({
    url: API_BASE_URL + "/user_actions/photo_actions_controller/download",
    method: "POST",
    body: Request,
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
    method: "GET",
  });
}

export function getUserDetail(id) {
  return request({
    url: API_BASE_URL + "/public/users/getUserDetails/" + id,
    method: "GET",
  });
}

export function update_user(Request) {
  return request1({
    url: API_BASE_URL + "/public/users/update_user",
    method: "POST",
    body: JSON.stringify(Request),
  });
}

export function update_password(Request) {
  return request1({
    url: API_BASE_URL + "/public/users/update_password",
    method: "POST",
    body: JSON.stringify(Request),
  });
}

export function update_password_end(Request) {
  return request1({
    url: API_BASE_URL + "/public/users/update_password_end",
    method: "POST",
    body: JSON.stringify(Request),
  });
}

export function request_new_password(Request) {
  return request_text({
    url: API_BASE_URL + "/public/users/request_new_password",
    method: "POST",
    body: Request,
  });
}

export function getPublicUsers(page, size) {
  return request({
    url:
      API_BASE_URL + "/public/users/getUserList?page=" + page + "&size=" + size,
    method: "GET",
  });
}

export function getBasketsForPhoto(id) {
  return request({
    url: API_BASE_URL + "/public/users/get_baskets_for_photo/" + id,
    method: "GET",
  });
}

export function getPhotosInCollection(id) {
  return request({
    url: API_BASE_URL + "/public/users/get_photo_in_collection/" + id,
    method: "GET",
  });
}

export function get_followers() {
  return request({
    url: API_BASE_URL + "/social/following/get_followers",
    method: "GET",
  });
}

export function get_suggested_followers() {
  return request({
    url: API_BASE_URL + "/social/following/get_suggested_followers",
    method: "GET",
  });
}

export function add_follower(Request) {
  return request_text({
    url: API_BASE_URL + "/social/following/add_follower",
    method: "POST",
    body: Request,
  });
}

export function remove_follower(Request) {
  return request_text({
    url: API_BASE_URL + "/social/following/remove_follower",
    method: "POST",
    body: Request,
  });
}

export function FBLogin() {
  return request1({
    url: API_BASE_URL + "/user_social_management/fb_login",
    method: "GET",
  });
}

export function get_comments_list(param) {
  return request({
    url:
      API_BASE_URL + "/social_comments/get_comments_for_photo?photoId=" + param,
    method: "GET",
  });
}

export function add_comment(Request) {
  return request1({
    url: API_BASE_URL + "/social_comments/add_comment",
    method: "POST",
    body: JSON.stringify(Request),
  });
}

export function get_data_for_foto_diagram(Request) {
  return request({
    url: API_BASE_URL + "/public/diagrams/get_data_for_foto_diagram",
    method: "POST",
    body: JSON.stringify(Request),
  });
}

export function get_data_for_user_diagram(Request) {
  return request({
    url: API_BASE_URL + "/public/diagrams/get_data_for_user_diagram",
    method: "POST",
    body: JSON.stringify(Request),
  });
}

export function getCollections() {
  return request({
    url: API_BASE_URL + "/photo_collection_controller/get_collections",
    method: "GET",
  });
}

export function update_collection_name(Request) {
  return request({
    url: API_BASE_URL + "/photo_collection_controller/update_collection_name",
    method: "POST",
    body: JSON.stringify(Request),
  });
}

export function change_collection_forPhoto(Request) {
  return request({
    url:
      API_BASE_URL + "/photo_collection_controller/change_collection_forPhoto",
    method: "POST",
    body: JSON.stringify(Request),
  });
}

export function add_collection(Request) {
  return request({
    url: API_BASE_URL + "/photo_collection_controller/add_collection",
    method: "POST",
    body: JSON.stringify(Request),
  });
}

export function uploadBanner(Request) {
  return request({
    url: API_BASE_URL + "/banners/uploadBanner",
    method: "POST",
    body: JSON.stringify(Request),
  });
}

export function get_banners() {
  return request({
    url: API_BASE_URL + "/banners/get_banners",
    method: "GET"
  });
}

export function get_banners_for_homepage() {
  return request({
    url: API_BASE_URL + "/banners/get_banners_for_homepage",
    method: "GET"
  });
}

export function get_banners_for_admin() {
  return request({
    url: API_BASE_URL + "/banners/get_banners_for_admin",
    method: "GET"
  });
}

export function deactivate_banner(Request) {
  return request_text({
    url: API_BASE_URL + "/banners/deactivate_banner",
    method: "DELETE",
    body: Request,
  });
}

export function activate_banner(Request) {
  return request_text({
    url: API_BASE_URL + "/banners/activate_banner",
    method: "DELETE",
    body: Request,
  });
}

export function add_geo_tag(Request) {
  return request1({
    url: API_BASE_URL + "/geolocation/add_geo_tag",
    method: "POST",
    body: JSON.stringify(Request),
  });
}

export function get_product_items_for_user(userId) {
  return request({
    url: API_BASE_URL + "/public/marketplace/get_items_for_user/" + userId,
    method: "GET"
  });
}
export function get_product_item(itemId) {
  return request({
    url: API_BASE_URL + "/public/marketplace/get_item/" + itemId,
    method: "GET"
  });
}

export function remove_product_item(Request) {
  return request_text({
    url: API_BASE_URL + "/public/marketplace/remove_item",
    method: "DELETE",
    body: Request,
  });
}

export function get_keywords_for_marketpalce() {
  return request({
    url: API_BASE_URL + "/public/marketplace/get_keywords",
    method: "GET"
  });
}

export function get_serviceType_for_marketpalce() {
  return request({
    url: API_BASE_URL + "/public/marketplace/get_service_type",
    method: "GET"
  });
}

export function get_platform_for_marketpalce() {
  return request({
    url: API_BASE_URL + "/public/marketplace/get_platform",
    method: "GET"
  });
}

export function add_keyword_for_marketplace(Request) {
  return request1({
    url: API_BASE_URL + "/public/marketplace/add_keyword",
    method: "POST",
    body: Request,
  });
}

export function add_platform_for_marketplace(Request) {
  return request1({
    url: API_BASE_URL + "/public/marketplace/add_platform",
    method: "POST",
    body: Request,
  });
}

export function add_serviceType_for_marketplace(Request) {
  return request1({
    url: API_BASE_URL + "/public/marketplace/add_service_type",
    method: "POST",
    body: Request,
  });
}