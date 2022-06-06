import axios from "axios";

const ChatService = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-type": "application/json"
  }
});

export default ChatService;