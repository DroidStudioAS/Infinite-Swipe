
<script setup>
import { ref } from 'vue';
import SavingLoadingGames from '../../components/savedGames/SavingLoadingGames.vue';
import { useSkladiste } from '../../stores/Skladiste.js';
import { useRouter } from 'vue-router';

const router = useRouter();

const Skladiste = useSkladiste();
const username = JSON.parse(localStorage.getItem("username"));


function loadGame(idsAndData){
	const questions_ids = idsAndData.questions_ids;
	const data = idsAndData.data;

	Skladiste.setIdKojeNecu(questions_ids);
	Skladiste.setScore(data.saved_game_score);
	Skladiste.setCurrentGameId(data.saved_game_id);	
}

function next(){
	/*if (Skladiste.currentGameId == null){
		alert("You haven't chosen a game.");
		return;
	}*/

	router.push({name: "levels"});
}

function back(){
	router.push({name: "gameMode"});
}

</script>


<template>
	<div class="wrap">
		<div class="nav">
			<button @click="back">Back</button>
			<button @click="next">Next</button>
		</div>	

		<div class="saveLoad">
			<saving-loading-games 
			:username="username"
			:score="Skladiste.score"
			:current_game_id="Skladiste.currentGameId"
			:load_possible="true"
			:save_possible="false"
			:update_possible="false"

			@loadGame="loadGame" 
			/>
		</div>
	</div>

</template>


<style scoped>
* {
	font-family: 'Times New Roman', Times, serif;
}
.nav {
	display: flex;
	align-items: center;
	justify-content: space-evenly;
	height: 15vh;
	background-color: #1450A3;
}

.nav button {
	height: 40px;
	border-radius: 50px;
	font-size: 20px;
	width: 100px;
}

.nav button:hover {
	background-color: blue;
	color: white;
}
</style>














