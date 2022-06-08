import { useEffect, useState, useRef, useCallback } from "react";
import { useAppState } from '../../state';
import io from "socket.io-client";

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


const useChatHandlers = (user) => {
    const [state, dispatch] = useAppState();
    const messageListElement = useRef(null);
}

