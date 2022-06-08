import { useEffect, useState, useRef, useCallback } from "react";
import { useAppState } from '../../state';
import { addRoom, getUsers, getMessages } from "../../services/Axios-api";

export const parseRoomName = (names, username) => {
    for (let name of names) {
        if (typeof name !== 'string') {
            name = name[0];
        }
        if (name !== username) {
            return name;
        }
    }
    return names[0];
}

export const populateUsersFromLoadedMessages = async (users, dispatch, messages) => {
    const userIds = {};
    messages.forEach((message) => {
        userIds[message.from] = 1;
    });

    const ids = Object.keys(userIds).filter(
        (id) => users[id] === undefined
    );

    if (ids.length !== 0) {
        const newUsers = await getUsers(ids);
        dispatch({
            type: "append users",
            payload: newUsers
        });
    }
}

const useChatHandlers = (user) => {
    const [state, dispatch] = useAppState();
    const messageListElement = useRef(null);

    const room = state.rooms[state.currentRoom];
    const roomId = room?.id;
    const messages = room?.messages;

    const [message, setMessage] = useState("");

    const scrollToTop = useCallback(() => {
        setTimeout(() => {
            if (messageListElement.current) {
                messageListElement.current.scrollTop = 0;
            }
        }, 0);
    }, []);

    const scrollToBottom = useCallback(() => {
        if (messageListElement.current) {
            messageListElement.current.scrollTo({
                top: messageListElement.current.scrollHeight
            });
        }
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom]);

    const onFetchMessages = useCallback(
        (offset = 0, prepend = false) => {
            getMessages(roomId, offset).then(async (messages) => {
                await populateUsersFromLoadedMessages(state.users, dispatch, messages);
            
                dispatch({
                    type: prepend ? "prepend messages" : "set messages",
                    payload: { id: roomId, messages: messages }
                });
                if (prepend) {
                    setTimeout(() => {
                        scrollToTop();
                    }, 10);
                } else {
                    scrollToBottom();
                }
            });
        },
        [dispatch, roomId, scrollToBottom, scrollToTop, state.users]
    );

    useEffect(() => {
        if (roomId === undefined) {
            return;
        }
        if (messages === undefined) {
            onFetchMessages();
        }
    }, [
        messages,
        dispatch,
        roomId,
        state.users,
        state,
        scrollToBottom,
        onFetchMessages
    ]);

    useEffect(() => {
        if (messageListElement.current) {
            scrollToBottom();
        }
    }, [scrollToBottom, roomId]);

    const onUserClicked = async (userId) => {
        const targetUser = state.users[userId];
        let roomId = targetUser.room;
        if (roomId === undefined) {
            const room = await addRoom(userId, user.id);
            roomId = room.id;

            dispatch({ type: "set user", payload: { ...targetUser, room: roomId }});

            dispatch({
                type: "add room",
                payload: { id: roomId, name: parseRoomName(room.names, user.username )}
            });
        }
        dispatch({ type: "set current room", payload: roomId });
    }

    const onLoadMoreMessages = useCallback(() => {
        onFetchMessages(room.offset, true);
    }, [onFetchMessages, room]);

    return {
        onLoadMoreMessages,
        onUserClicked,
        message,
        setMessage,
        dispatch,
        room,
        rooms: state.rooms,
        currentRoom: state.currentRoom,
        messageListElement,
        roomId,
        users: state.users,
        messages
    };
};

export default useChatHandlers;

