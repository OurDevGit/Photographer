import { API_BASE_URL, PHOTO_LIST_SIZE, ACCESS_TOKEN } from '../constants';

const request = (options) => {
    const headers = new Headers({
        'Content-Type': 'application/json',
    })
    
    if(localStorage.getItem(ACCESS_TOKEN)) {
        headers.append('Authorization', 'Bearer ' + localStorage.getItem(ACCESS_TOKEN))
    }
    console.log("OPTIONSzzz",localStorage.getItem(ACCESS_TOKEN))
    const defaults = {headers: headers};
    options = Object.assign({}, defaults, options);
    console.log(options)
    return fetch(options.url, options)
    .then(response => 
        response.json().then(json => {
            if(!response.ok) {
                return Promise.reject(json);
            }
            return json;
        })
    );
};

const request1 = (options) => {
    const headers = new Headers({
        'Content-Type': 'application/json',
    })
    
    if(localStorage.getItem(ACCESS_TOKEN)) {
        headers.append('Authorization', 'Bearer ' + localStorage.getItem(ACCESS_TOKEN))
    }
    console.log("OPTIONSzzz",localStorage.getItem(ACCESS_TOKEN))
    const defaults = {headers: headers};
    options = Object.assign({}, defaults, options);
    console.log(options)
    return fetch(options.url, options)
    .then(response => {
        return response
    }
    );
};

export function getAllPhotos(page, size) {
    page = page || 0;
    size = size || PHOTO_LIST_SIZE;

    return request({
        url: API_BASE_URL + "/photos?page=" + page + "&size=" + size,
        method: 'GET'
    });
}

export function getPhotoLists() {
    return request({
        url: API_BASE_URL + "/public/lists/homepage",
        method: 'GET'
    });
}

export function getSubmitPhotos() {
    return request({
        url: API_BASE_URL + "/photo_submit/submitOperations",
        method: 'GET'
    });
}

export function getNumberOfPhotos() {
    return request({
        url: API_BASE_URL + "/photo_submit/numberOfPhotosUploaded",
        method: 'GET'
    });
}

export function getListAuthorizationForUser() {
    return request({
        url: API_BASE_URL + "/authorization_controller/list_authorization_for_user",
        method: 'POST'
    });
}

export function JoinAuthorization(JoinRequest) {
    return request({
        url: API_BASE_URL + "/authorization_controller/_join_authorization",
        method: 'POST',
        body: JSON.stringify(JoinRequest)
    });
}

export function getListPhotoForAuthorizationIDs(authorizationIDs) {
    return request({
        url: API_BASE_URL + "/authorization_controller/list_photo_for_authorization_ids",
        method: 'POST',
        body: JSON.stringify(authorizationIDs)
    });
}

export function getListAuthorizationForPhotoIDs(photoIDs) {
    return request({
        url: API_BASE_URL + "/authorization_controller/list_authorization_for_photo_ids",
        method: 'POST',
        body: JSON.stringify(photoIDs)
    });
}

export function addAuthorizationToPhotoIDs(addRequest) {
    return request1({
        url: API_BASE_URL + "/authorization_controller/add_authorization_to_photo_ids",
        method: 'POST',
        body: JSON.stringify(addRequest)
    });
}

export function removeAuthorizationToPhotoIDs(removeRequest) {
    return request1({
        url: API_BASE_URL + "/authorization_controller/remove_authorization_to_photo_ids",
        method: 'POST',
        body: JSON.stringify(removeRequest)
    });
}

export function updateMultiplePhoto(updateRequest) {
    return request({
        url: API_BASE_URL + "/photo_submit/updateMultiplePhoto",
        method: 'POST',
        body: JSON.stringify(updateRequest)
    });
}

export function submitMultiplePhoto(submitRequest) {
    return request({
        url: API_BASE_URL + "/photo_submit/submitMultiplePhoto",
        method: 'POST',
        body: JSON.stringify(submitRequest)
    });
}

export function createPhoto(photoData) {
    return request({
        url: API_BASE_URL + "/photos",
        method: 'POST',
        body: JSON.stringify(photoData)
    });
}

export function castVote(voteData) {
    return request({
        url: API_BASE_URL + "/photos/" + voteData.photoId + "/votes",
        method: 'POST',
        body: JSON.stringify(voteData)
    });
}

export function login(loginRequest) {
    return request({
        url: API_BASE_URL + "/auth/signin",
        method: 'POST',
        body: JSON.stringify(loginRequest)
    });
}

export function signup(signupRequest) {
    return request({
        url: API_BASE_URL + "/auth/signup",
        method: 'POST',
        body: JSON.stringify(signupRequest)
    });
}

export function checkUsernameAvailability(username) {
    return request({
        url: API_BASE_URL + "/user/checkUsernameAvailability?username=" + username,
        method: 'GET'
    });
}

export function checkEmailAvailability(email) {
    return request({
        url: API_BASE_URL + "/user/checkEmailAvailability?email=" + email,
        method: 'GET'
    });
}


export function getCurrentUser() {
    if(!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: API_BASE_URL + "/user/me",
        method: 'GET'
    });
}

export function getUserProfile(username) {
    return request({
        url: API_BASE_URL + "/users/" + username,
        method: 'GET'
    });
}

export function getUserCreatedPhotos(username, page, size) {
    page = page || 0;
    size = size || PHOTO_LIST_SIZE;

    return request({
        url: API_BASE_URL + "/users/" + username + "/photos?page=" + page + "&size=" + size,
        method: 'GET'
    });
}

export function getUserVotedPhotos(username, page, size) {
    page = page || 0;
    size = size || PHOTO_LIST_SIZE;

    return request({
        url: API_BASE_URL + "/users/" + username + "/votes?page=" + page + "&size=" + size,
        method: 'GET'
    });
}


export function getAllCategories() {
    return request({
        url: API_BASE_URL + "/public/categories/getAll" ,
        method: 'GET'
    });
}

export function getAllTags() {
    return request({
        url: API_BASE_URL + "/public/tags/getAll" ,
        method: 'GET'
    });
}