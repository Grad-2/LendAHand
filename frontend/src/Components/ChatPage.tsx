import { Typography, Box, Paper } from "@mui/material";
import { CHAT } from '../Constants'
// import { Router, Switch, Route } from "react-router-dom"
// import ChatRoom from './chat-helpers/ChatRoom';
import JoinPMRoom from './chat-helpers/JoinPMRoom';
import useChat from './chat-helpers/useChat';
import { ChatMock } from '../MockChatData'
import { useEffect, useState } from 'react';
import { logState, UserType } from "../Types/types";
import { Widget, addResponseMessage } from "react-chat-widget";
import 'react-chat-widget/lib/styles.css';
import ChatRoom from './chat-helpers/ChatRoom';
import { Link } from "react-router-dom";

//Join PM Room

//Chat Room
	//Output
	//Input

//Chat handlers
	//useChat
interface LoginProps {
	loginUser: (id: number, username: string) => void,
	userState: logState
}

const ChatPage = (props: LoginProps) => {
	const userId = props.userState.id;
	const username = props.userState.username;

	const [roomName, setRoomName] = useState("");

	const handleRoomNameChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
		setRoomName(event.target.value);
	};
	
	useEffect(() => {
		addResponseMessage('You can direct message lenders and borrowers here !');
		console.log('username: ', username);
		console.log('id: ', userId);
	  }, [userId, username]);

	const handleNewUserMessage = (newMessage: any) => {
		console.log(`New message - ${newMessage}`);
		//send via socket to backend
	};

	return(
		<>
			<Box mt={15} display='flex' justifyContent='center'>
				<Typography variant='h3'>
					{CHAT.welcome}
				</Typography>
				{/* <ChatRoom loginUser={props.loginUser} userState={props.userState}/> */}
			</Box>

			<div className="home-container">
				<input
					type="text"
					placeholder="Room"
					value={roomName}
					onChange={handleRoomNameChange}
					className="text-input-field"
				/>
				<Link to={'/chat-room'} className="enter-room-button">
					Private Message
				</Link>
			</div>

			<Box mt={15} display='flex' justifyContent='center'>
				<Typography variant='h3'>
					Private Message
				</Typography>
				<Widget 
					handleNewUserMessage={handleNewUserMessage}
					title="Private Message"
					subtitle="Chat"
				/>
			</Box>

			<Box mt={5} display='flex' justifyContent='center'>
				<Paper elevation={10}>
					<Box sx={{p:2}} display='flex' justifyContent='center'>
						<Typography variant='h5'>
							CURRENTLY UNDER CONSTRUCTION
						</Typography>
					</Box>
					<Box sx={{p:2}} display='flex' justifyContent='center'>
						<Typography variant='subtitle1'>
							Thank for understanding!
						</Typography>
					</Box>
				</Paper>
			</Box>
		</>
	);
}


export default ChatPage;