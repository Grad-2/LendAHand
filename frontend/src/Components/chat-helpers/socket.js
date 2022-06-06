import io from "socket.io-client"
import HttpChatService from '../../services/HttpChatService'

let socket;
const SOCKET_URL = "http://localhost:8080"

export const initiateSocket = (channel, username) => {
}