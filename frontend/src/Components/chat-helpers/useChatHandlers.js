import { useCallback,  useEffect, useState, useRef } from "react";
import { addRoom, getMessages } from '../services/HttpChatService';
import { useChatState } from '../services/chatState';
import { parseRoomName, populateUsersFromLoadedMessages } from "../services/utils";

const useChatHandlers = (user) => {
    const [state, dispatch] = useAppState();
    const messageListElement = useRef(null);

    const room = state.rooms[state.currentRoom];
    const roomId = room?.id;
    const messages = room?.messages;

}