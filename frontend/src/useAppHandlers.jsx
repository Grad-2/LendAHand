import React, { useEffect, useCallback } from "react";
import useAppStateContext, { AppContext } from "./state";
import { useSocket, useUser } from "./ChatHooks";
import { getOnlineUsers, getRooms } from "./services/Axios-api";
import { parseRoomName } from "./Components/chat-helpers/use-chat-handlers";
import moment from "moment";

const useAppHandlers = () => {
    const [state, dispatch] = useAppStateContext();
    const onUserLoaded = useCallback(
        (user) => {
            if (user !== null) {
                if (!state.users[user.id]) {
                    dispatch({ type: "set user", payload: { ...user, online: true }});
                }
            }
        },
        [dispatch, state.users]
    );

    const { user, onLogIn, onLogOut, loading } = useUser(onUserLoaded, dispatch);
    const [socket, connected] = useSocket(user, dispatch);

    useEffect(() => {
        if (user === null) return;
        if (connected) {
            const newRooms = [];
            Object.keys(state.rooms).forEach((roomId) => {
                const room = state.rooms[roomId];
                if (room.connected) return;

                newRooms.push({ ...room, connected: true });
                socket.emit("room.join", room.id);
            });
            if (newRooms.length !== 0) {
                dispatch({ type: "set rooms", payload: newRooms })
            }
        } else {
            //set disconnect on users' rooms
            const newRooms = [];
            Object.keys(state.rooms).forEach((roomId) => {
                const room = state.rooms[roomId];
                if (!room.connected) return;
                
                newRooms.push({ ...room, connected: false }); 
            });
            if (newRooms.length !== 0) {
                dispatch({ type: "set rooms", payload: newRooms });
            } 
        }
    }, [user, connected, dispatch, socket, state.rooms, state.users]);

    //add seed data if user
    useEffect(() => {
        if (Object.values(state.rooms).length === 0 && user !== null) {
            getOnlineUsers().then((users) => {
                dispatch({
                    type: "append users",
                    payload: "users"
                });
            });
            getRooms(user.id).then((rooms) => {
                const payload = [];
                rooms.forEach(({ id, names }) => {
                    payload.push({ id, name: parseRoomName(names, user.username) });
                });
                dispatch({
                    type: "set rooms",
                    payload,
                });
                dispatch({ type: "set current room", payload: "0" });
            });
        }
    }, [dispatch, state.rooms, user]);

    const onMessageSend = useCallback(
        (message, roomId) => {
            if (typeof message !== "string" || message.trim().length ===0) return;
            if (!socket) console.log(`No socket in useAppHandlers - could not send message ${message} in ${roomId}`)
            socket.emit("message", {
                roomId: roomId,
                message,
                from: user.id,
                date: moment(new Date()).unix()
            });
        },
        [user, socket]
    );
    
    return {
        loading,
        user,
        state,
        dispatch,
        onLogIn,
        onMessageSend,
        onLogOut
    };
};

export default useAppHandlers;

