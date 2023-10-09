
<script setup>
import SavingLoadingGames from '../../components/savedGames/SavingLoadingGames.vue';
import { useSkladiste } from '../../stores/Skladiste.js';
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import mobileHelper from '../../models/mobileHelper.js';

const route = useRoute();
const router = useRouter();
const Skladiste = useSkladiste();

const isOnPhone = ref(mobileHelper.isMobile());

const username = ref(JSON.parse(localStorage.getItem("username")));

function loadGame(idsAndData){
	const questions_ids = idsAndData.questions_ids;
	const data = idsAndData.data;
	Object.entries(idsAndData).forEach(keyValue => console.log(keyValue[0] + ":" + keyValue[1]));

	Skladiste.setIdKojeNecu(questions_ids);
	Skladiste.setScore(data.saved_game_score);
	Skladiste.setCurrentGameId(data.saved_game_id);
	Skladiste.setLivesRemaining(data.saved_game_lives_remaining);
	console.log("currentGameId: " + Skladiste.currentGameId);
}

function goBack(){
	const BACK_1_PAGE = -1;
	router.go(BACK_1_PAGE);
}

function startGame(){
	router.push({name: "keyboardExplanation"});
}

function gameOverriden(id){
	Skladiste.setCurrentGameId(id);
}
</script>


<template>
<div class="wrap" :class="[isOnPhone ? 'phone_wrap' : 'desktop_wrap']">
	<div class="nav">
		<button class="nav-button" @click="goBack">Nazad</button>
		<button class="nav-button" @click="startGame">Igraj</button>
	</div>	
	<SavingLoadingGames  	class="games" :class="{games_phone: isOnPhone}"
	  	:username="username"  
	  	:used_questions_ids="Skladiste.id_koje_necu" 
	  	:score="Skladiste.score" 
	  	:current_game_id="Skladiste.currentGameId"
	  	:load_possible="true"
	  	:save_possible="false"
	  	:update_possible="false"
	
		@loadGame="loadGame"	
		@gameOverriden="gameOverriden"
	/>
</div>
</template>



<style scoped>
* {
	font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif, 'Trebuchet MS', Helvetica, Ubuntu;
}

.wrap{
	background: #7aedff;
	height: 100vh;
	width: 100vw;
}

.nav {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  background-color: #1450A3;
}

.phone_wrap .nav{
  height: 10vh;
}

.desktop_wrap .nav{
  height: 15vh;
}

.nav-button {
  height: 8vh;
  border-radius: 20vh;
  min-width: 16vh;
  font-size: 1.25em;
  background-color: #3d90cd; /* Button background color */
  color: white; /* Button text color */
  cursor: pointer;
  transition: background-color 0.3s; /* Add a transition for smooth color change */
}

.nav-button:hover {
  background-color: blue; /* Change to your desired hover color */
}

.games{
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: center;
	overflow: auto;
}

.games_phone{
	max-height: 50vh;
}

</style>




