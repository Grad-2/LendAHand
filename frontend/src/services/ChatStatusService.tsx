// import ChatService from "./HttpChatService";
import axios from "axios";
axios.defaults.withCredentials = true;

const ChatService = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
	"withCredentials": true
  }
});

export async function testChatStatus() {
	console.log(">>>>> Attempting to check chat status.")
		ChatService.get("/status")
	.then((response) => {
		console.log("----- GET /Status Response: ",response.status);
		if(response.status === 200){
			console.log("Status obtained.")
			console.log("Payload: ",response.data)
		} else {
			console.log("Chat status test failed.")
		}
	})
	.catch((error) => {
		console.log("ERROR: ", error)
		console.log("Chat status test failed.")
	})
	.finally(() => {
		console.log("<<<<< Atempt to check chat status complete.")
	})
}


export async function testChatConnection() {
	console.log(">>>>> Attempting to connect to the chat backend.")
	ChatService.get("/")
		.then((response) => {
			console.log("----- GET / Response: ",response.status);
			if(response.status === 200){
				console.log("Successful connection")
				console.log("Payload: ",response.data)
			} else {
				console.log("Chat connection test failed.")
			}
		})
		.catch((error) => {
			console.log("ERROR: ",error)
			console.log("Backend chat test failed.")
		})
		.finally(() => {
			console.log("<<<<< Attempt to connect to the chat backend complete.")
		})
}