import { useEffect, useRef, useState } from "react";
import  socketIOClient from "socket.io-client";
import HttpChatService from '../../services/HttpChatService'

const NEW_CHAT_MESSAGE_EVENT = "newChatMessage";
const SOCKET_SERVER_URL = "http://localhost:8080";

const useChat = (roomId) => {
    const [messages, setMessages] = useState([]);
    const socketRef = useRef();

    useEffect(() => {
        socketRef.current = socketIOClient(SOCKET_SERVER_URL, {
            query: { roomId }
        });

        socketRef.current.on(NEW_CHAT_MESAGE_EVENT, (message) => {
            const incomingMessage = {
                ...message,
                ownedByCurrentUser: message.from === socketRef.current.id
            };
            setMessages((messages) => [...messages, incomingMessages]);
        });

        return () => {
            socketRef.current.disconnect();
        };
    }, [roomId]);

    const sendMessage = (messageBody) => {
        socketRef.current.emit(NEW_CHAT_MESSAGE_EVENT, {
            body: messageBody,
            from: socketRef.current.id,
        });
    };

    return { messages, sendMessage };
};

export default useChat;