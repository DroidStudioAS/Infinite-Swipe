<script setup>
import { ref, computed, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import networkHelper from '../../mrezniPomagaci/networkHelper.js';
import loginHelper from '../../mrezniPomagaci/loginHelper.js';
import {useLoginStore} from '../../stores/login.js';
import pomagacLeaderboard from '../../mrezniPomagaci/pomagacLeaderboard';
import LeaderboardComponent from "../../components/LeaderboardComponent.vue";
import mobileHelper from '../../models/mobileHelper.js';


const loginStore = useLoginStore();
const router = useRouter();

const userIsOnPhone = ref(mobileHelper.isMobile());


const oldPassword = ref("");
const newPassword1 = ref("");
const newPassword2 = ref("");


const newEmail1 = ref("");
const newEmail2 = ref("");

const newUsername1 = ref("");
const newUsername2 = ref("");


const maxUsernameCharacters = ref(40);
const maxEmailCharacters = ref(70);
const maxPasswordCharacters = ref(60);

const baseSufix = "login_register_logout/change/";
const changePasswordSufix = baseSufix + "change_password";
const changeEmailSufix = baseSufix + "change_email";
const changeUsernameSufix = baseSufix + "change_username";
const loginSufix = "login_register_logout/login_user";

//leaderboard logic
const leaderboardActive=ref(false);

const dobavljacLeaderboarda = ref({
	dobaviLeaderboard: () => pomagacLeaderboard.nabaviGlobalniLeaderboard(20)
});
function showLeaderboard(){
	leaderboardActive.value = true;
}

function stopShowingLeaderboard(){
	leaderboardActive.value = false;
}


const currentUsername = () => JSON.parse(localStorage.getItem("username"))

onBeforeUnmount(() => {
	clearAll();
});



function clearAll(){
	oldPassword.value = "";
	newPassword1.value = "";
	newPassword2.value = "";
	newEmail1.value = "";
	newEmail2.value = "";
	newUsername1.value = "";
	newUsername2.value = "";	
}

function refIsOK(ref, maxNumberOfCharacters){
	if (ref.value.trim() === '' || ref.value === null || ref.value === undefined){
		return false;
	}

	return ref.value.length < maxNumberOfCharacters;	
}

async function submitNewPassword(){
	if (newPassword1.value !== newPassword2.value){
		alert("You haven't entered the same new password twice.");
		return;
	}

	if (!refIsOK(oldPassword, maxPasswordCharacters.value)){
		alert("You didn't enter good old password.");
		return;
	}

	if (!refIsOK(newPassword2, maxPasswordCharacters.value)){
		alert("You haven't entered a valid correct new password");
	}
	
	const usersOldPassword = oldPassword.value;
	const usersNewPassword = newPassword1.value;
	const usersUsername = JSON.parse(localStorage.getItem("username"));

	const serverData = await networkHelper.post(changePasswordSufix, {
		old_password: usersOldPassword,
		new_password: usersNewPassword,
		username: usersUsername
	});
	clearAll();
	
	if (serverData == null){
		alert("Nema odgovora servera.");
		return;
	}
	
	if (serverData.success){
		alert("Gotovo. Uspešno urađeno.");
	} else if (serverData.msg){
		alert(serverData.msg);
	}
}

async function submitNewUsername(){
	if (!refIsOK(oldPassword, maxPasswordCharacters.value)){
		alert("You didn't enter good old password.");
		return;
	}	

	if (newUsername1.value !== newUsername2.value){
		alert("You haven't entered the same username twice.");
		return;
	}

	if (!refIsOK(newUsername1, maxUsernameCharacters.value)){
		alert(`You haven't entered a valid username.\r\n Username must be ${maxUsernameCharacters.value} characters long or less.`);
		return;
	}	
	
	const usersNewUsername = newUsername1.value;
	const oldUsername = JSON.parse(localStorage.getItem("username"));
	const currentPassword = oldPassword.value;
	
	const serverData = await networkHelper.post(changeUsernameSufix, {
		old_username: oldUsername,
		password: currentPassword,
		new_username: usersNewUsername
	});
	clearAll();
	
	if (serverData == null){
		alert("Nema odgovora servera na ovaj zahtev.");
		return;
	}
	
	if (serverData.success){
		const loginData = await loginHelper.login(usersNewUsername, currentPassword);
		
		if (loginData == null){
			alert("Promena username-a uradjena, ali neuspesni login sa novim useranme-om. ");
			return;
		}
		
		if (loginData.success){
			alert("Gotovo. Uspešno urađeno.");
		} else {
			alert("Promena username-a uradjena, ali neuspesni login sa novim useranme-om. ");
		}
		
	} else if (serverData.msg){
		alert(serverData.msg);
	}
		
}

async function submitNewEmail(){
	if (!refIsOK(oldPassword, maxPasswordCharacters.value)){
		alert("You didn't enter good old password");
		return;
	}

	if (newEmail1.value !== newEmail2.value){
		alert("You didn't enter the same new email twice.");
		return;
	}

	if (!refIsOK(newEmail1, maxEmailCharacters.value)){
		alert(`You didn't enter ok email. Email needs to be less than ${maxEmailCharacters.value} characters long.`);
		return;
	}
	
	
	const usersOldPassword = oldPassword.value;
	const usersNewEmail = newEmail1.value;

	const serverData = await networkHelper.post(changeEmailSufix, {
		password: usersOldPassword,
		new_email: usersNewEmail,
	});
	clearAll();
	
	
	if (serverData == null){
		alert("Nema odgovora servera.");
		return;
	}

	if (serverData.success){
		alert("Gotovo. Uspešno urađeno.");
	} else if (serverData.msg){
		alert(serverData.msg);
	}
}


function goToFirstPage(){
	router.push({name: "pocetna"});
}

const mobileNavOpen = ref(false);

function toggleMobileNav() {
  mobileNavOpen.value = !mobileNavOpen.value;
}
function pushTo(routeName){
	router.push({name:routeName});
}
function logout(){
	loginStore.izlogujSe();
	router.push({name: "login"});
}
function stopShowingLeaderboardIfActive(){
  if(leaderboardActive){
    stopShowingLeaderboard();
  }
}


</script>

<template>

  <header class="navContainer">
      <!--Mobile-->
      <div class="mobile-menu-icon" @click="toggleMobileNav()">
      <span class="bar"></span>
      <span class="bar"></span>
      <span class="bar"></span>
    </div>
    <!-- Navigation Drawer (Mobile) -->
    <div class="mobile-nav" :class="{ open: mobileNavOpen }">
	<div @click="pushTo('pocetna')" class="navItem">
		Glavna Stranica
    </div>
    <div @click="pushTo('gameMode')" class="navItem">
		Igraj Sad
    </div>
      <div @click="pushTo('impressions')" class="navItem">
        Recenzije
      </div>
      <div @click="pushTo('aboutUs')" class="navItem">
        O nama
      </div>
      <div @click="showLeaderboard()" class="navItem">
        Globalni Leaderboard
      </div>
      <div @click="stopShowingLeaderboardIfActive()" class="navItem">
        Korisnička Podešavanja
      </div>
    </div>
      <!--desktop-->
      <nav class="desktop-nav">
          <div class="navOptions">
            <span  @click="pushTo('pocetna')" class="navItem">
				Glavna Stranica
            </span>
            <span @click="pushTo('gameMode')" class="navItem">
				Igraj Sad
            </span>
              <span @click="pushTo('impressions')" class="navItem">
				Recenzije
              </span>
              <span @click="pushTo('aboutUs')" class="navItem">
				O nama
              </span>
              <span @click="showLeaderboard()" class="navItem">
				Globalni Leaderboard
              </span>
              <span @click="stopShowingLeaderboardIfActive()" class="navItem">
				Korisnička Podešavanja
              </span>
          </div>
      </nav>
      <span @click="logout()" class="logout">Izloguj se</span>
  </header>
	<body>
	  <div v-if="!leaderboardActive">
	  <div class="formContainer">
		<div class="old-password">
			<h2>Morate uneti aktuelnu šifru da biste promenili podatke:</h2>
		  <label class="label">Šifra:</label>
		  <input type="password" v-model="oldPassword" placeholder="Aktuelna Šifra" />
		</div>
  
		<div class="changeContainer" :class="{on_mobile: userIsOnPhone}">
		  <div class="change-form change-password">
			<label class="label">Nova Šifra:</label>
			<input type="password" v-model="newPassword1" placeholder="Nova Šifra" />
  
			<label class="label">Ponovi Novu Šifru:</label>
			<input type="password" v-model="newPassword2" placeholder="Ponovi Novu Šifru" />
  
			<button class="submit-button" @click="submitNewPassword">Potvrdi</button>
		  </div>
  
		  <div class="change-form change-email">
			<label class="label">Novi email:</label>
			<input type="email" v-model="newEmail1" placeholder="Novi email" />
  
			<label class="label">Ponovi novi email:</label>
			<input type="email" v-model="newEmail2" placeholder="Ponovi novi email" />
  
			<button class="submit-button" @click="submitNewEmail">Potvrdi</button>
		  </div>
  
		  <div class="change-form change-username">
			<label class="label">Novo Korisničko ime:</label>
			<input type="text" v-model="newUsername1" placeholder="Novi username" />
  
			<label class="label">Ponovi Novo Korisničko Ime:</label>
			<input type="text" v-model="newUsername2" placeholder="Ponovi Novi username" />
  
			<button class="submit-button" @click="submitNewUsername">Potvrdi</button>
		  </div>
		</div>
	  </div>
	</div>

	  <div v-if="leaderboardActive" class="leaderboard">
          <leaderboard-component :dobavljacLeaderboarda="dobavljacLeaderboarda" class="leaderboard" />
      </div>
	</body>

  </template>
  
  <style scoped>
  * {
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
  letter-spacing: 2px;
}
.mobile-menu-icon {
  display: none; /* Hide on desktop */
  cursor: pointer;
  padding: 10px;
  margin-right: 10%;
}
.mobile-menu-icon .bar {
  display: no;
  width: 25px;
  height: 3px;
  margin: 5px auto;
  background-color: #333;
}
.mobile-nav {
  display: none;
  position: fixed;
  top: 6.2vh;
  left: 0;
  height: 100%;
  background-color:#1450A3;
  transition: transform 0.3s ease;
  z-index: 1000;
}
.mobile-nav .navItem{
  padding-top: 5%;
  padding-bottom: 5%;
  padding-left: 5%;
  font-size: 24px;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2); /* Add box shadow */
}
.mobile-nav.open {
  display: block; /* Show the mobile nav when open */
  transform: translateX(0);
}
@media (max-width: 768px) {
	.changeContainer{
		display: flex;
		flex-flow: column nowrap;
	}
	.mobile-menu-icon {
    display: flex;
    flex-flow: column nowrap;
  }

  .desktop-nav {
    display: none;
  }
}
  body {
	background: #3d90cd;
  }
  
  .label {
	color: #f9fffd;
	font-weight: bold;
  }

  .old-password{
	justify-content: center;
	text-align: center;
  }
  .old-password label {
	display: flex;
	justify-content: center;
	margin-bottom: 5px;
	text-align: left;
	color: #f9fffd;  }
  .old-password input {
	width: 40%;
	padding: 8px;
	margin-bottom: 10px;
	border-radius: 10px;
	background-color: #fbe6e6;
	transition: width 2s ease, background-color 2s ease;
  }
  .old-password h2{
	color: #f9fffd;
  }
  
  .changeContainer {
	display: flex;
	flex-direction: row;
	justify-content: space-evenly;
	margin-top: 2em;
  }
  
  .change-form {
	display: flex;
	flex-direction: column;
	padding: 20px;
	border-radius: 10px;
	box-shadow: 0px 0px 20px rgb(0, 0, 0);
	width: 400px;
	text-align: center;
	align-items: center;
	background-color: #1450A3;
  }
  
  .change-form label {
	display: flex;
	justify-content: center;
	margin-bottom: 5px;
	text-align: left;
	color: #f9fffd;
  }
  
  .change-form input {
	width: 40%;
	padding: 8px;
	margin-bottom: 10px;
	border-radius: 10px;
  }
  
  .on_mobile input {
  	transition: width 2s ease;
  }
  
  .on_mobile input:focus {
	width: 95%;
  }
  
  .submit-button {
	background-color: #f9fffd;
	color: rgb(0, 0, 0);
	border: none;
	border-radius: 5px;
	padding: 10px 15px;
	cursor: pointer;
	margin-top: 10px;
	margin-bottom: 10px;
	transition: transform 0.5s ease, background-color 0.5s ease;
  }
  
  .submit-button:hover {
	background-color: #3d90cd;
	transform: scale(1.25);
  }
  .navContainer {
  height: 7vh;
    width: 100vw;
    background-color: #1450A3;
    color: white;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 0 5%;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
}
.navOptions {
	display: flex;
    align-items: center;
    gap: 20px;
    padding: 10px;
}
.navItem {
	font-size: 1rem;
    transition: color 0.3s ease;
    letter-spacing: 1px;
    cursor: pointer;
}
.navItem:hover {
	color: #3d90cd;
    transform: scale(1.1);
}

.logout{
  letter-spacing: 1px;
  position: absolute;
  right: 5%;
}
.logout:hover {
  color: #3d90cd;
  transform: scale(1.1);
}
  </style>
	




