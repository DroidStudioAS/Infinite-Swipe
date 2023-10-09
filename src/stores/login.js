import { defineStore } from "pinia";
import { ref } from "vue";

import localStorageHelper from '../models/localStorageHelper.js';
const weAreLoggedInSuffix = "isLoggedIn";

function loginLocalStorageKey(){
	return localStorageHelper.getPrefix() + weAreLoggedInSuffix;
}

function loggedInLocalStorage(){
	const loginKey = loginLocalStorageKey();
    	const isLoggedInStringified = localStorage.getItem(loginKey);
    	
    	if (isLoggedInStringified === null || isLoggedInStringified === undefined){
    		return false;
    	}
    	
    	const isLoggedIn = JSON.parse(isLoggedInStringified);
    	return isLoggedIn === true;	
}


export const useLoginStore = defineStore('login',() => {
    function isLoggedIn(){
    	return loggedInLocalStorage();
    }

    function changeLogin() {
        const weAreLoggedIn = loggedInLocalStorage();
        
        if (weAreLoggedIn){
        	izlogujSe();
        } else {
        	setUlogovan();
        }
    }
    
    function setUlogovan(){    	
    	const loginKey = loginLocalStorageKey();
    	localStorage.removeItem(loginKey);
    	
    	const loginStringified = JSON.stringify(true);
    	localStorage.setItem(loginKey, loginStringified);
    }
    
    function izlogujSe(){
    	const loginKey = loginLocalStorageKey();
    	localStorage.removeItem(loginKey);
    	
    	const loginStringified = JSON.stringify(false);
    	localStorage.setItem(loginKey, loginStringified);
    }
    
    
    return {
        isLoggedIn,
        changeLogin,
        setUlogovan,
        izlogujSe
    }
})
