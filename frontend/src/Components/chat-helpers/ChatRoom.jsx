import React from "react";
import useChat from "./useChat";


const ChatRoom = (props) => {
    const { roomIds } = props;//.match.params;
    const { messages, sendMessage } = useChat(roomIds);
    const [newMessage, setNewMessage] = React.useState("");

    const handleNewMessageChange = function(event) {
        const target = event.target;
        if (target === null) {
            throw new Error('target cannot be null');
        }
        setNewMessage(target.value);
    };

    const handleSendMessage = () => {
        sendMessage(newMessage);
        setNewMessage("");
    }

    return (
        <div className="chat-room-container">
            <h1 className="room-key">Room Ids: {roomIds}</h1>
            <div className="messages-container">
                <ol className="messages-list">
                    {messages.map((message, i) => (
                        <li
                            key={i}
                            className={`message-item ${
                                message.ownedByCurrentUser ? "my-message" : "received-message"
                            }`}
                        >
                            {message.body}
                        </li>
                    ))}
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