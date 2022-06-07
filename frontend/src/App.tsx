import * as React from 'react';
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom"; // remember to import/change HashRouter to BrowserRouter if not gh-pages
import AppBar from './Components/AppBar';
import LandingPage from './Components/LandingPage';
import NotFound from './Components/NotFound';
import LendPage from './Components/LendPage';
import RequestPage from './Components/RequestPage';
import LoginPage from './Components/LoginPage';
import ProfilePage from './Components/ProfilePage';
import ChatPage from './Components/ChatPage';
import { AppUser, ROUTER_PATHS } from './Constants';
import "../public/lendahand.css";
import { useEffect, useState } from 'react';
import { testBackendConnection, testBackendStatus } from './services/BackendStatusService';
import { testChatConnection, testChatStatus } from './services/ChatStatusService';
import CreateLendPage from './Components/CreateLendPage';
import CreateUserPage from './Components/CreateUserPage';



function App() {

	let[userState, setUserState] = useState(AppUser.userLoggedOut)

	const loginUser = (id: number, username: string) => {
		setUserState({
			id: id, 
			loggedIn: true,
			username: username
		})
	}

	const logoutUser = () => {
		setUserState({
			id: -1,
			loggedIn: false,
			username: ''
		})
	}

	useEffect(()=> {
		console.log("AppBar first Render")
		testBackendConnection()
		testBackendStatus()
		testChatConnection()
		testChatStatus()
	},[])


	const Page = () => {
		return(
		<div>
			<AppBar userState={userState} logoutUser={logoutUser}/>
			<Outlet/>
		</div>
		);
	}

	const landingPage = <LandingPage/>
	const notFound = <NotFound/>
	const lendPage = <LendPage userState={userState}/>
	const createLendPage = <CreateLendPage/>
	const requestPage = <RequestPage userState={userState}/>
	const loginPage = <LoginPage loginUser={loginUser} userState={userState}/>
	const createUserPage = <CreateUserPage/>
	const profilePage = <ProfilePage/>
	const chatPage = <ChatPage loginUser={loginUser} userState={userState}/>

  return (
	
			<BrowserRouter >
				<Routes>

					<Route path={ROUTER_PATHS.landing} element={<Page/>}>
				
							<Route path={ROUTER_PATHS.landing} element={landingPage}/>
							<Route path={ROUTER_PATHS.lend} element={lendPage}/>
							<Route path={ROUTER_PATHS.createLendItem} element={createLendPage}/>
							<Route path={ROUTER_PATHS.request} element={requestPage}/>
							<Route path={ROUTER_PATHS.login} element={loginPage}/>
							<Route path={ROUTER_PATHS.createUser} element={createUserPage}/>
							<Route path={ROUTER_PATHS.profile} element={profilePage}/>
							<Route path={ROUTER_PATHS.chat} element={chatPage}/>

					</Route>

					<Route path={ROUTER_PATHS.error} element={notFound}/>

				</Routes>
			</BrowserRouter>
  );
}

export default App;
