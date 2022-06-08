import BackendClient from "./HttpService";


export async function getLendItems(){
	let response = await BackendClient.get("/api/item")
	return response
}

export async function postLendItems(item: any){
	let response = await BackendClient.post('/api/item', item)
	return response;
}
