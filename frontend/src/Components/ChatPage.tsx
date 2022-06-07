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
//Join PM Room

//Chat Room
	//Output
	//Input

//Chat handlers
	//useChat
interface LoginProps {
	loginUser: (id: number, username: string) => void
	userState: logState
}

const ChatPage = (props: LoginProps) => {

	useEffect(() => {
		addResponseMessage('You can direct message lenders and borrowers here !');
		console.log('user: ' + props.loginUser);
		console.log('state: ' + props.userState);
	  }, [props.loginUser, props.userState]);

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
			</Box>

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