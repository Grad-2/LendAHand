import React from "react";
import useChat from "./useChat";
import { useEffect, useState } from 'react';
import { logState, UserType } from "../../Types/types";

interface LoginProps {
	loginUser: (id: number, username: string) => void,
	userState: logState
}

const ChatRoom = (props: LoginProps) => {
    // const roomIds = props.userState.id;
    // const username = props.userState.username;
    // const { messages, sendMessage } = useChat(roomIds);
    const [newMessage, setNewMessage] = React.useState("");
    
    const handleNewMessageChange = function(event: any) {
        const target = event.target;
        if (target === null) {
            throw new Error('target cannot be null');
        }
        setNewMessage(target.value);
    };

    const handleSendMessage = () => {
        // sendMessage(newMessage);
        setNewMessage("");
    }

    return (
        <div className="chat-room-container">
            <h1 className="room-key">Room Ids: </h1>
            <h1 className="username">Username: </h1>
            <div className="messages-container">
                <ol className="messages-list">
                    {/* {messages.map((message, i) => (
                        <li
                            key={i}
                            className={`message-item` //${
                               // message.ownedByCurrentUser ? "my-message" : "received-message"
                            //}`
                            }
                        >
                            if (message)
                                {message}
                        </li>
                    ))} */}
                </ol>
            </div>
            <textarea
                value={newMessage}
                onChange={handleNewMessageChange}
                placeholder="Type message here..."
                className="new-message-input-field"
            />
            <button onClick={handleSendMessage} className="send-message-button">
                Send
            </button>
        </div>
    );
};

export default ChatRoom