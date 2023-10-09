const BASE_BACKEND_URL = "http://181g123.e2.mars-hosting.com/kviz-projekat/";
import axios from 'axios';

function addParamsToUrl(url, params){
	if (params == null){return url;}

	let result = "";
	Object.entries(params).forEach(keyValuePair => {
		const key = keyValuePair[0];
		const value = keyValuePair[1];

		if (result.trim() !== ''){
			result += "&";
		} else {
			result += "?";
		}

		result += key + "=" + value;
	});

	return url + result;
}

function getSid(){
	let sidFromLocalStorage = JSON.parse(localStorage.getItem("sid"));
	if (sidFromLocalStorage === null || sidFromLocalStorage === undefined || sidFromLocalStorage.trim() === ''){
		return "";
	} 
	return sidFromLocalStorage;
}

const networkHelper ={

    async post(urlSufix, body = {}, config = {headers: {
        'Content-Type': "application/json"}}){
		
		const sid = getSid();
		body.sid = sid;
		
		const url = BASE_BACKEND_URL + urlSufix;
		console.log("url post: " + url);
		try {
			const serverResponse = await axios.post(url, body, config);
			console.log("Post server response: " + serverResponse);
			const serverData = serverResponse.data;
			return serverData;
		} catch (error){
			console.log(error);
			return null;
		}
	},

	
    async get(urlSufix, params = {}, config = {headers: {
        'Content-Type': "application/json"}}){
        	const sid = getSid();
        	params.sid = sid;
        	
		const urlBase = BASE_BACKEND_URL + urlSufix;
		const url = addParamsToUrl(urlBase, params); 
		console.log("url get: " + url);
		try {
			const serverResponse = await axios.get(url, config);
			const serverData = serverResponse.data;
			return serverData;
		} catch (error){
			console.log(error);
			return null;
		}
	},
	
	
	async delete(urlSufix, config = {headers: {
        'Content-Type': "application/json"}}){
        	const sid = getSid();
        	
        	let url = BASE_BACKEND_URL + urlSufix;
        	if (sid.trim() !== ''){
        		url += "?sid=" + sid;
        	}
        	
        	console.log("url delete: " + url);
        	try{
        		const serverResponse = await axios.delete(url, config);
        		const serverData = serverResponse.data;
        		return serverData;
        	} catch(error){
        		console.log(error);
        		return null;
        	}
        }
}


export default networkHelper;










