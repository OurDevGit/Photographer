import * as io from 'socket.io-client';
const events = require('events');


class ChatSocketServer {
    
    socket = null
    eventEmitter = new events.EventEmitter();

    // Connecting to Socket Server
    establishSocketConnection(userId) {
        try {
            this.socket = io(`http://localhost:4000`, {
                query: `userId=${userId}`
            });
            console.log(this.socket)
        } catch (error) {
            alert(`Something went wrong; Can't connect to socket server`);
        }
    }
    checkSocket(){
        console.log("checking.......", this.socket)
    }

    getChatList(uid) {
        console.log("123", this.socket)
        this.socket.emit('chat-list', {
            uid: uid
        });
        this.socket.on('chat-list-response', (data) => {
            this.eventEmitter.emit('chat-list-response', data);
        });
    }

    sendMessage(message) {
        console.log("send",message)
        this.socket.emit('add-message', message);
    }

    receiveMessage() {
        this.socket.on('add-message-response', (data) => {
            this.eventEmitter.emit('add-message-response', data);
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