
<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import networkHelper from '../mrezniPomagaci/networkHelper.js';
import ImpressionsList from '../components/impressions/ImpressionsList.vue';
import { useLoginStore } from '../stores/login.js';
import pomagacLeaderboard from '../mrezniPomagaci/pomagacLeaderboard.js';
import LeaderboardComponent from '../components/LeaderboardComponent.vue';
import mobileHelper from '../models/mobileHelper.js';

const loginStore = useLoginStore();

const router = useRouter();
const title = ref("");
const impression = ref("");

const isOnPhone = ref(mobileHelper.isMobile());

const impressionMaxLength = ref(500);
const titleMaxLength = ref(100);
const numOfColumns = ref(40);

const impressionCharactersLeft = computed(() => impressionMaxLength.value - impression.value.length);
const titleCharactersLeft = computed(() => titleMaxLength.value - title.value.length);

const starSource = ref("/graph_zvezda.png");
const starsArray = ref([1,2,3,4,5]);
const rating = ref(3);



const myUsername = ref(JSON.parse(localStorage.getItem("username")));

const addImpressionKey = ref(false);

function pushTo(routeName){
	router.push({name:routeName});
}
function logout(){
	loginStore.izlogujSe();
	router.push({name: "login"});
}

const dobavljacLeaderboarda = ref({
	dobaviLeaderboard: () => pomagacLeaderboard.nabaviGlobalniLeaderboard(20)
});

//leaderboard logic
const leaderboardActive = ref(false);

function showLeaderboard(){
	leaderboardActive.value = true;
}

function stopShowingLeaderboard(){
	leaderboardActive.value = false;
}


const urlInsertSufix = "impressions/insert";
const urlQuerySufix = "impressions/query/all";
const urlUpdateSufix = "impressions/update";
const urlDeleteSufix = "impressions/delete";

async function submitImpression(){
	console.log(rating.value);
	if (title.value.trim() === ''){
		alert("Title can't be null");
		return;
	}
	if (title.value.length > titleMaxLength.value){
		alert(`Title is too long. Title must be at most ${titleMaxLength.value} characters long`);
		return;		
	}

	if (impression.value.trim() === ''){
		alert("Impression can't be null.");
		return;	
	}
	if (impression.value.length > impressionMaxLength.value){
		alert(`Impression is too long. Impression must be at most ${impressionMaxLength} characters long`);
		return;	
	}

	const serverData = await networkHelper.post(urlInsertSufix, {
		impression: impression.value,
		impression_title: title.value,
		sid: JSON.parse(localStorage.getItem("sid")),
		rating: rating.value
	});
	Object.entries(serverData).forEach(keyValue => console.log(keyValue[0] + ":" + keyValue[1]));
	clear();	

	tellChildComponentThatImpressionIsSubmited();
}	

function tellChildComponentThatImpressionIsSubmited(){
	addImpressionKey.value = !addImpressionKey.value;
}

function clear(){
	impression.value = "";
	title.value = "";
}

function selectedRating(index){
	rating.value = index + 1;
	console.log("index: " +index);
	console.log("rating: " + rating.value);
}

function goToFirstPage(){
	router.push({name: "pocetna"});
}

async function fetchImpressions(params = {}){
	const serverData = await networkHelper.get(urlQuerySufix, params);
	console.log(serverData);
	return serverData?.impressions;
}

async function editImpression(updatedImpression){
	const impression_id = updatedImpression.impression_id;
	const updated_rating = updatedImpression.updated_rating;
	const updated_impression = updatedImpression.updated_impression;
	const updated_impression_title = updatedImpression.updated_impression_title;
	
	console.log("updated_impression: " + updated_impression);
	console.log("updated_impression_title: " + updated_impression_title);
	
	const serverData = await networkHelper.post(urlUpdateSufix, {
		id_to_update: impression_id,
		updated_rating,
		updated_impression,
		updated_impression_title
	});
	console.log("edit server response: ");
	Object.entries(serverData).forEach(keyValue => console.log(keyValue[0] + ":" + keyValue[1])); 
	return serverData;
}

async function deleteImpressionById(id){
	const serverData = await networkHelper.delete(urlDeleteSufix + "/" + id);
	return serverData;
}
/***************Nav functions**************** */
const mobileNavOpen = ref(false);

function toggleMobileNav() {
  mobileNavOpen.value = !mobileNavOpen.value;
}

function stopShowingLeaderboardIfActive(){
  if(leaderboardActive){
    stopShowingLeaderboard();
  }
}


function scrollToStart(){
	const elements = document.querySelectorAll('.impressions-container');
	const element = elements[0];
	element.scrollTo({top: 0});
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
      <div @click="stopShowingLeaderboardIfActive()" class="navItem">
        Recenzije
      </div>
      <div @click="pushTo('aboutUs')" class="navItem">
        O nama
      </div>
      <div @click="showLeaderboard()" class="navItem">
        Globalni Leaderboard
      </div>
      <div @click="pushTo('ChangeUsernameEmailPassword')" class="navItem">
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
              <span @click="stopShowingLeaderboardIfActive" class="navItem">
              Recenzije
              </span>
              <span @click="pushTo('aboutUs')" class="navItem">
                O nama
              </span>
              <span @click="showLeaderboard()" class="navItem">
                  Globalni Leaderboard
              </span>
              <span @click="pushTo('ChangeUsernameEmailPassword')" class="navItem">
                Korisnička Podešavanja
              </span>
          </div>
      </nav>
      <span @click="logout()" class="logout">Izloguj se</span>

  </header>

  <body>

	<div v-if="!leaderboardActive" class="wrap">
		
		
		<div class="postImpressionContainer">
			<div class="ratingContainer">
                   		<label style="color: black;">Ocena: </label>
				<img v-for="(n, index) in starsArray" :key="index"
				:src="starSource" alt="star"
				class="star-rating"
				:class="{selected_rating: index < rating}"
				@click="selectedRating(index)">
                	</div>
			<div class="title">
				<label class="label-explanation">
Naslov (ostalo {{ titleCharactersLeft }} karaktera) : </label>
				<input type="text" v-model="title" placeholder="Naslov" :maxlength="titleMaxLength"/>
			</div>
			<div class="impression">
				<label class="label-impression">
Recenzija (ostalo {{ impressionCharactersLeft }} karaktera) : </label>
				<textarea :maxlength="impressionMaxLength" v-model="impression">
				</textarea>
			</div>
			<button @click="submitImpression"> Postavi </button>
		</div>
		
		<div :class="[isOnPhone ? 'scroll_start_phone' : 'scroll_start_desktop']">
			<button @click="scrollToStart" class="scroll_start_button">Na početak recenzija &#8593</button>
		</div>
					
		<div class="impressions-container" :class="{impressions_phone: isOnPhone, impressions_desktop: !isOnPhone}">
				
   				<h3> Recenzije </h3> 
    				<impressions-list 
    				:numOfColumns="numOfColumns" :myUsername="myUsername"   
        			:fetchImpressions="fetchImpressions" :editImpression="editImpression" 
        			:deleteImpressionById="deleteImpressionById" 
        			:titleMaxLength="titleMaxLength" :impressionMaxLength="impressionMaxLength" 
        			:addImpressionKey="addImpressionKey"/>
		</div>

	</div>
	<div v-if="leaderboardActive" class="leaderboard">
          <leaderboard-component :dobavljacLeaderboarda="dobavljacLeaderboarda" class="leaderboard" />
      </div>
</body>
</template>

<style scoped>
body{
  margin-bottom: 5em;
  background-color: #3d90cd;
}
* {
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
  letter-spacing: 2px;
}
mobile-menu-icon {
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
.wrap{
	margin-top: 10vh;
	display: flex;
	flex-flow:row nowrap;
	justify-content: center;
	align-items: flex-start;
  gap: 5%;
}
@media (max-width: 768px) {
  .wrap{
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




.impressions-container {
  
  justify-content: right;
  overflow-y: auto;
  padding: 20px; /* Add similar padding to match the style */
  border-radius: 10px; /* Add similar border radius */
  box-shadow: 0px 0px 20px rgb(0, 0, 0);
  background-color: #1450A3; /* Use a similar background color */
  color: white;
  width: 100%;
  max-width: 400px;
}



.impressions_phone{
  height: 35vh;
}

.impressions_desktop{
  height: 70vh;
}

.postImpressionContainer {
    display: flex;
    flex-direction: column;
    justify-content: left;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0px 0px 20px rgb(0, 0, 0);
    width: 400px;
    background-color: #1450A3;
    color: white;
}

.postImpressionContainer label {
    display: block;
    text-align: left;
    margin-bottom: 5px;
}

.postImpressionContainer input,
.postImpressionContainer textarea {
    width: 100%;
    padding: 8px;
    margin-bottom: 10px;
    border-radius: 10px;
    background-color: #fbe6e6;
    
}



.postImpressionContainer button {
    background-color: #f9fffd;
    color: rgb(0, 0, 0);
    border: none;
    border-radius: 5px;
    padding: 10px 15px;
    cursor: pointer;
    margin-top: 10px;
    transition: transform 0.5s ease, background-color 0.5s ease, color 0.5s ease;
}

.postImpressionContainer button:hover {
  color: white;
    background-color: #3d90cd;
    transform: scale(1.05);
}
.ratingContainer {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    margin-bottom: 10px;
	background-color: #f9fffd;
	border-radius: 5px;
	padding-left: 10px;
	padding-right: 10px;
}

/* Styles for the star images */
.star-rating {
    width: 24px;
    height: 24px;
    cursor: pointer;
    transition: transform 0.2s ease;
    opacity: 0.5;
}

.selected_rating{
	opacity: 1;
}

.star-rating:hover {
    transform: scale(1.2);
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
	 /* font-family: fantasy; */ 
   font-size: 1rem;
    transition: color 0.3s ease;
    letter-spacing: 1px;
    cursor: pointer;
}
.navItem:hover {
    color: #3d90cd;
	transform: scale(1.1);
}

.go-to-first-page {
	display: flex;
	justify-content: center;
	padding-bottom: 20px;
}
.go-to-first-page button {
	margin-top: 20px;
  padding: 0.5em 1em;
  background-color: rgb(255, 255, 255);
  border: 1px solid black;
  border-radius: 5px;
  color: rgb(0, 0, 0);
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
  cursor: pointer;
  transition: background-color 1.5s ease, transform 1.5s ease, color 1.5s ease;
  
}

.go-to-first-page button:hover {
	background-color: rgb(0, 0, 0);
    color: white;
    transform: scale(1.25);
}

.scroll_start_button{
	height: 4em;
}

.scroll_start_desktop{
	display:none;
}

.scroll_start_phone{

	position: absolute;
	top: 8vh;
	left: 35vw;
	width: 30vw;
	height: 4vh;
}


.logout{
 /* font-family: fantasy; */
  letter-spacing: 1px;
  cursor: pointer;
  position: absolute;
  right: 50px;
}
.logout:hover {
  color: #3d90cd;
  transform: scale(1.1);
}
</style>
