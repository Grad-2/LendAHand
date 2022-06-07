import { Typography, Box, Paper } from "@mui/material";
import { CHAT } from '../Constants'
// import { Router, Switch, Route } from "react-router-dom"
// import ChatRoom from './chat-helpers/ChatRoom';
import JoinPMRoom from './chat-helpers/JoinPMRoom';
import useChat from './chat-helpers/useChat';
import { ChatMock } from '../MockChatData'

//Join PM Room

//Chat Room
	//Output
	//Input

//Chat handlers
	//useChat

const ChatPage = () => {

	return(
		<>
			<Box mt={15} display='flex' justifyContent='center'>
				<Typography variant='h3'>
					{CHAT.welcome}
				</Typography>
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