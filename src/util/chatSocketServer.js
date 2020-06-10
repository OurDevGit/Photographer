import * as io from 'socket.io-client';
import {CHAT_API_URL} from '../constants'
const events = require('events');


class ChatSocketServer {
    
    socket = null
    eventEmitter = new events.EventEmitter();

    // Connecting to Socket Server
    establishSocketConnection(userId) {
        try {
            this.socket = io(CHAT_API_URL, {
                query: `userId=${userId}`
            });
        } catch (error) {
            alert(`Something went wrong; Can't connect to socket server`);
        }
    }
    checkSocket(){
        console.log("checking.......", this.socket)
    }

    getChatList(uid) {
        this.socket.emit('chat-list', {
            uid: uid
        });
        this.socket.on('chat-list-response', (data) => {
            this.eventEmitter.emit('chat-list-response', data);
        });
    }

    sendMessage(message) {
        this.socket.emit('add-message', message);
    }

    receiveMessage() {
        this.socket.on('add-message-response', (data) => {
            this.eventEmitter.emit('add-message-response', data);
        });
    }

    readMessage(chatInfo){
        this.socket.emit('read-message', chatInfo)
    }

    receiveReadMessage(){
        this.socket.on('read-message-response', (data) => {
            this.eventEmitter.emit('read-message-response', data);
        });
    }
    logout(userId) {
        this.socket.emit('logout', userId);
        this.socket.on('logout-response', (data) => {
            this.eventEmitter.emit('logout-response', data);
        });
    }

}

export default new ChatSocketServer()