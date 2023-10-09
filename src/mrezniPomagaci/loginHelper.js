import baseBackendURL from './baseBackendURL.js';
const sufix = "login_register_logout/login_user";
import networkHelper from './networkHelper';

const loginHelper = {
	async login(username, password){

		const serverData = await networkHelper.post(sufix, {username, sifra: password});
		if (serverData.sid){
			const sidJson = JSON.stringify(serverData.sid);
      	 		localStorage.removeItem('sid');
        		localStorage.setItem('sid', sidJson);
        		
        		localStorage.removeItem('username');
        		localStorage.setItem("username", JSON.stringify(username));
		} 
		
		return serverData;
	}
};







export default loginHelper;









