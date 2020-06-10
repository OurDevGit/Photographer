import * as axios from 'axios';
import { CHAT_API_URL } from '../constants'
class ChatHttpServer {

    getUserId() {
        return new Promise((resolve, reject) => {
            try {
                resolve(localStorage.getItem('userid'));
            } catch (error) {
                reject(error);
            }
        });
    }

    removeLS() {
        return new Promise((resolve, reject) => {
            try {
                localStorage.removeItem('userid');
                localStorage.removeItem('username');
                resolve(true);
            } catch (error) {
                reject(error);
            }
        });
    }

    setLS(key, value) {
        return new Promise((resolve, reject) => {
            try {
                localStorage.setItem(key, value);
                resolve(true);
            } catch (error) {
                reject(error);
            }
        });
    }

    login(userCredential) {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await axios.post(CHAT_API_URL + '/login', userCredential);
                resolve(response.data);
            } catch (error) {
                reject(error);
            }
        });
    }

    checkUsernameAvailability(username) {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await axios.post(CHAT_API_URL + '/usernameAvailable', {
                    username: username
                });
                resolve(response.data);
            } catch (error) {
                reject(error);
            }
        });
    }

    register(userCredential) {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await axios.post(CHAT_API_URL + '/register', userCredential);
                resolve(response.data);
            } catch (error) {
                reject(error);
            }
        });
    }

    userSessionCheck(userId) {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await axios.post(CHAT_API_URL + '/userSessionCheck', {
                    userId: userId
                });
                resolve(response.data);
            } catch (error) {
                reject(error);
            }
        });
    }

    // getMessages(userId, toUserId) {
    //     return new Promise(async (resolve, reject) => {
    //         try {
    //             const response = await axios.post(CHAT_API_URL + '/getMessages', {
    //                 userId: userId,
    //                 toUserId: toUserId
    //             });
    //             resolve(response.data);
    //         } catch (error) {
    //             reject(error);
    //         }
    //     });
    // }

    getMessages(chatId) {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await axios.post(CHAT_API_URL + '/getMessages', {
                    id: chatId
                });
                resolve(response.data);
            } catch (error) {
                reject(error);
            }
        });
    }

    readMessages(chatInfo) {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await axios.post(CHAT_API_URL + '/readMessages', chatInfo);
                resolve(response.data);
            } catch (error) {
                reject(error);
            }
        });
    }

}

export default new ChatHttpServer();