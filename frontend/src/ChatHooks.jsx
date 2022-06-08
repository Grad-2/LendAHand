import { useEffect, useRef, useState } from 'react';
import { getMe, login, logOut } from "./services/Axios-api";
import io from "socket.io-client";
import { parseRoomName } from './Components/chat-helpers/use-chat-handlers';

const updateUser = (newUser, dispatch, infoMessage) => {
    dispatch({ type: "set user", paylod: newUser });
    if (infoMessage !== undefined) {
        dispatch({
            type: "append message",
            payload: {
                id: "0",
                message: {
                    date: Math.floor(Date.now()/1000),
                    from: "info",
                    message: infoMessage
                },
            },
        });
    }
};

const useSocket = (user, dispatch) => {
    const [connected, setConnected] = useState(false);
    const socketRef = useRef(null);
    const socket = socketRef.current;

    useEffect(() => {
        if (user === null) {
            if (socket !== null) {
                socket.disconnect();
            }
            setConnected(false);
        } else {
            if (socket !== null) {
                socket.connect();
            } else {
                socketRef.current = io();
            }
            setConnected(true);
        }
    }, [user, socket]);

    useEffect(() => {
        if (connected && user) {
            socket.on("user.connected", newUser => {
                updateUser(newUser, dispatch, `{newUser.username} has left`)
            });
            socket.on("user.disconnected", (newUser) => {
                updateUser(newUser, dispatch, `${newUser.username} has left`)
            });
            socket.on("show.room", (room) => {
                console.log({ user });
                dispatch({
                    type: "add room",
                    payload: {
                        id: room.id,
                        name: parseRoomName(room.names, user.username)
                    }
                });
                socket.on("message", (message) => {
                    dispatch({
                        type: "make user online",
                        payload: message.from
                    });
                    dispatch({
                        type: "append message",
                        payload: { id: message.roomId === undefined ? "0" : message.roomId, message}
                    });
                });
            })
        } else {
            if (socket) {
                socket.off("user.connected");
                socket.off("user.disconnected");
                socket.off("user.room");
                socket.off("message");
            }
        }
    }, [connected, user, dispatch, socket]);
    
    return [socket, connected];
}

const useUser = (onUserLoaded = (user) => { }, dispatch) => {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    const onLogin = (
        username = "",
        onError = (val = null) => { },
        onLoading = (loading = false) => { }
    ) => {
        onError(null);
        onLoading(true);
        login(username).then((x) => {
            setUser(x);
        })
        .catch((e) => onError(e.message))
        .finally(() => onLoading(false));
    };

    const onLogOut = async () => {
        logOut().then(() => {
            setUser(null);
            dispatch({ type: "clear "});
            setLoading(true);
        })
    };
    
    useEffect(() => {
        if (!loading) {
            return;
        }
        getMe().then((user) => {
            setUser(user);
            setLoading(false);
            onUserLoaded(user);
        });
    }, [onUserLoaded, loading]);
    
    return { user, onLogin, onLogOut, loading };

}


export {
    updateUser,
    useSocket,
    useUser
}