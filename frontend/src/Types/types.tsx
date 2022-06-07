export interface UserType {
	username: string,
	password: string
}

export interface ItemType  {
	id: number,
	name: string,
	is_lent_item: boolean,
	img_uri: string,
	lend_start: string,
	lend_end: string
}


export interface logState {
	id: number, 
	loggedIn: boolean,
	username: string
}