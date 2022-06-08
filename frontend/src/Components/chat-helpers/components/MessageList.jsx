import React from 'react';
import { MESSAGES_TO_LOAD } from "../../../services/Axios-api";
import { CardText } from "react-bootstrap-icons";
import moment from "moment";

//fancy way to make an outline of analog clock
const ClockIcon = () => (
    <svg
        width={12}
        height={12}
        className="prefix__MuiSvgIcon-root prefix__jss80 prefix__MuiSvgIcon-fontSizeLarge"
        viewBox="0 0 24 24"
        aria-hidden="true"
    >
        <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
        <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
    </svg>
);

const OnlineIndicator = ({ online, hide = false, width = 8, height = 8 }) => {
    return (
        <div
            className={
                online ? "rounded-circle bg-success" : "rounded-circle bg-gray"
            }
            style={{ width, height, opacity: hide ? 0 : 1 }}
        ></div>      
    );
};

 
const MessagesLoading = () => {
    return (
        <div className='no-messages flex-column d-flex flex-row justify-content-center align-items-center text-muted text-center'>
            <div className='spinner-boarder' role="status">
                <span className='visually-hidden' />
            </div>
        </div>
    );
};

const NoMessages = () => {
    return (
        <div className='no-messages flex-column d-flex flex-row justify-content-center align-items-center text-muted text-center'>
            <CardText size={96} />
            <p>No Messages...</p>
        </div>
    );
};

const InfoMessage = ({ message }) => {
    return (
        <p
            className='mb-2 fs-6 fw-light fst-italic text-black-50 text-center'
            style={{ opacity: 0.8, fontSize: 14 }}
        >
            {message}
        </p>
    );
};

const SenderMessage = ({
    user,
    message = "blank...",
    date,
    onUserClicked
}) => (
    <div className='d-flex'>
        <div style={{ width: "50% " }} className="text-left mb-4">
            <div
                className='conversation-list d-inline-block px-3 py-2'
                style={{ borderRadius: 12, backgroundColor: "rgba(85, 110, 230, 0.1" }}
            >
                <div className='ctext-wrap'>
                    {user && (
                        <div className='conversation-name text-primary d-flex align-items-center-mb-1'>
                            <div
                                className='mr-2'
                                style={{
                                    fontWeight: 600,
                                    cursors: "pointer"
                                }}
                                onClick={onUserClicked}
                            >
                                {user.username}
                            </div>
                            <OnlineIndicator width={7} height={7} online={user.online} />
                        </div>
                    )}
                    <p className='text-left'>{message}</p>
                    <p className='chat-time mb-0'>
                        <ClockIcon /> {moment.unix(date).formate("LT")}{" "}
                    </p>
                </div>
            </div>
        </div>
        <div style={{ flex: 1 }} />
    </div>
);

const RecieverMessage = ({
    username = 'user',
    message = 'Empty message...',
    date,
}) => (
    <div className='d-flex'>
        <div style={{ flex: 1 }} />
        <div style={{ width: "50% "}} className='text-right mb-4'>
            <div
                className='conversation-list d-inline-block bg-light px-3 py-2'
                style={{ borderRadius: 12 }}
            >
                <div className='ctext-wrap'>
                    <div
                        className='conversation-name text-left text-primary mb-1'
                        style={{
                            fontWeight: 600
                        }}
                    >
                        {username}
                    </div>
                    <p className='text-left'>{message}</p>
                    <p className='chat-time mb-0'>
                        <ClockIcon /> {moment.unix(date).format("LT")}{" "}
                    </p>
                </div>
            </div>
        </div>
    </div>
);

const MessageList = ({
    messageListElement,
    messages,
    room,
    onLoadMoreMessages,
    user,
    onUserClicked,
    users,
}) => (
    <div
        ref={messageListElement}
        className="chat-box-wrapper position-relative d-flex"
    >
        {messages === undefined ? (
            <MessagesLoading />
        ) : messages.length === 0 ? (
            <NoMessages />
        ) : (
            <></>
        )}
        <div className='px-4 pt-5 chat-box position-absolute'>
            {messages && messages.length !== 0 && (
                <>
                    {room.offset && room.offset >= MESSAGES_TO_LOAD ? (
                        <div className='d-flex flex-row align-items-center mb-4'>
                            <div
                                style={{ height: 1, backgroundColor: "#eee", flex: 1 }}
                            ></div>
                            <div className='mx-3'>
                                <button
                                    aria-haspopup="true"
                                    aria-expanded="true"
                                    type="button"
                                    onClick={onLoadMoreMessages}
                                    className="btn rounded-button btn-secondary nav-btn"
                                    id="__BVID__168__BV_toggle_"
                                >
                                    Load more messages
                                </button>
                            </div>
                            <div
                                style={{ height: 1, backgroundColor: "#eee", flex: 1 }}
                            ></div>
                        </div>
                    ) : (
                        <></>
                    )}
                    {messages.map((message, x) => {
                        const key = message.message + message.date + message.from + x;
                        if (message.from === "info") {
                            return <InfoMessage key={key} message={message.message} />;
                        }
                        if (+message.from !== +user.id) {
                            return (
                                <SenderMessage
                                    onUserClicked={() => onUserClicked(message.from)}
                                    key={key}
                                    message={message.message}
                                    date={message.date}
                                    user={user[message.from]}
                                />
                            );
                        }
                        return (
                            <RecieverMessage
                                username={
                                    users[message.from] ? users[message.from].username : ""
                                }
                                key={key}
                                message={message.message}
                                date={message.date}
                            />
                        );
                    })}
                </>
            )}
        </div>
    </div>
);

export default MessageList