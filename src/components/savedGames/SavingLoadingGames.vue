 
<script setup>
import { ref, onMounted, onBeforeUnmount, defineProps, defineEmits } from 'vue';
import networkHelper from '../../mrezniPomagaci/networkHelper.js';
import SingleSavedGame from './SingleSavedGame.vue';

const emits = defineEmits(['loadGame', 'gameOverriden', 'gameInserted']);

const props = defineProps({
	username: {
		type: String,
		required: true
	},

	used_questions_ids: {
		type: Array,
	},
	score: {
		type: Number,
	},
	time_spent_playing_in_seconds: {
		type: Number,
	},
	lives_remaining: {
		type: Number,
	},
	current_game_id: {
		type: Number,
	},
	load_possible: {
		type: Boolean,
		required: true
	},
	save_possible: {
		type: Boolean,
		required: true
	},
	update_possible:{
		type: Boolean,
		required: true
	}
});

const insertSufix = "saved_games/insert";
const querySufix = "saved_games/query";
const deleteSufix = "saved_games/delete_saved_game";
const updateSufix = "saved_games/update";

const MAX_LIVES = 1;

const MAX_NUMBER_OF_SAVED_GAMES = ref(3);
const pageIsLoaded = ref(false);

/*
savedGames.value[0] izgleda ovako:
{
	questions_ids: Array,
	data: {
		saved_game_id: Number,
		saved_game_score: Number,
		saved_game_time_spent_playing_in_seconds: Number,
		saved_game_moment_of_saving: String (format izgleda ovako 2020-10-30 14:32:11),
		saved_game_lives_remaining: Number,
		username: String 
	}
} 
*/
const savedGames = ref([]);

onMounted(() => fetchSavedGames());
onBeforeUnmount(() => pageIsLoaded.value = false);

async function fetchSavedGames(){
	const serverData = await networkHelper.get(querySufix, {username: props.username});
	savedGames.value = serverData?.saved_games_array;	
	pageIsLoaded.value = true;
}

async function loadGame(id){
	const serverData = await networkHelper.get(querySufix, {saved_game_id: id});
	
	if (serverData !== null && serverData !== undefined){
		const saved_games_array = serverData.saved_games_array;
		const idsAndData = saved_games_array[0];
		emits('loadGame', idsAndData);
	}
}

async function deleteGame(id){
	await networkHelper.delete(deleteSufix + "/" + id);
	await fetchSavedGames();
}

async function overrideGame(id){
	let gameData = getGameData();
	gameData.id = id;
	console.log("id to update: " + gameData.id);
	const serverData = await networkHelper.post(updateSufix, gameData);
	if (serverData.id){
		emits('gameOverriden', serverData.id);
	}
	Object.entries(serverData).forEach(keyValue => console.log(keyValue[0] +":" + keyValue[1]));
	await fetchSavedGames();
}

async function insertNewGame(){
	const gameData = getGameData();
	const serverData = await networkHelper.post(insertSufix, gameData);
	Object.entries(serverData).forEach(keyValue => console.log(keyValue[0] +":" + keyValue[1]));
	await fetchSavedGames();
	
	const insertedGameId = serverData.saved_game_id;
	emits('gameInserted', insertedGameId);
}

async function createBlankNewGame(){
	const gameData = {
		score: 0,
		lives_remaining: MAX_LIVES,
		time_spent_playing_in_seconds: 0
	};
	const serverData = await networkHelper.post(insertSufix, gameData);
	Object.entries(serverData).forEach(keyValue => console.log(keyValue[0] +":" + keyValue[1]));
	await fetchSavedGames();
}

function getGameData(){
	let gameData = {};
	if (props.current_game_id != null){
		gameData.id = props.current_game_id;
	}
	if (props.score != null){
		gameData.score = props.score;
	}
	if (props.time_spent_playing_in_seconds != null){
		gameData.time_spent_playing_in_seconds = time_spent_playing_in_seconds;
	}
	if (props.lives_remaining){
		gameData.lives_remaining = props.lives_remaining;
	}
	const used_questions_ids_STRING = arrayToString(props.used_questions_ids, ",");
	if (used_questions_ids_STRING != null){
		gameData.used_questions_ids = used_questions_ids_STRING;
	}
	
	return gameData;
}

function arrayToString(array, characterThatDividesElementsOfTheArray){
	if (array == null || array.length < 1){
		return null;
	}
	
	let resultString = "" + array[0];
	for (let i=1; i<array.length; i++){
		resultString += characterThatDividesElementsOfTheArray + array[i];
	}
	return resultString;
}

</script>




<template>
	<div class="wrap1">
		<div class="message">
			Igrač sme da ima {{ MAX_NUMBER_OF_SAVED_GAMES }} sačuvane partije. 
		</div>
		<div class="insert" v-if="props.save_possible && pageIsLoaded && (savedGames.length<MAX_NUMBER_OF_SAVED_GAMES)" >
			<button @click="insertNewGame" class="new_save_button" @touchend="insertNewGame">Napravi novi save</button>
		</div>	
		
		<div class="blankNewGame" v-if="props.load_possible && (savedGames.length<MAX_NUMBER_OF_SAVED_GAMES)">
			<button @click="createBlankNewGame">Napravi novi prazni save</button>
		</div>

		<div class="saved_games">
			<single-saved-game v-for="(game, index) in savedGames" :key="index" 
			class="small-saved-game"
			:username="game.data.username" 
			:score="game.data.saved_game_score"
			:time_spent_playing_in_seconds="game.data.time_spent_playing_in_seconds" 
			:moment_of_saving="game.data.saved_game_moment_of_saving"
			:lives_remaining="game.data.saved_game_lives_remaining"
			:used_questions_ids="game.questions_ids"
			:load_possible="props.load_possible"
			:game_id="game.data.saved_game_id"
			:thisGameIsLoaded="game.data.saved_game_id === props.current_game_id"
			:update_possible="props.update_possible"
			
			@deleteThisGame="deleteGame"
			@overrideThisGame="overrideGame"
			@loadGame="loadGame"
			/>
		</div>

	</div>
</template>




<style scoped>
.wrap1 {
	
	background-color: #7aedff;
	height: 90vh;
	width: 100%;
	overflow: auto;
	z-index: 100;
}

.insert button {
	border-radius: 50px;
}

.insert button:hover {
	background-color: blue;
		color: white;
}

.blankNewGame button {
  border-radius: 50px;
  font-size: 20px;
  background-color: #3d90cd; /* Button background color */
  color: white; /* Button text color */
  cursor: pointer;
  transition: background-color 0.3s; /* Add a transition for smooth color change */
}

.blankNewGame button:hover {
  background-color: blue; /* Change to your desired hover color */
}

.message{
	font-size: 1.5em;
	text-align: center;
	margin-top: 1%;
	margin-bottom: 1%;
}
.small-saved-game {
font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif, 'Trebuchet MS', Helvetica, sans-serif; 
 border-radius: 5%;
 width: 20vw;
  float: left;
  box-sizing: border-box;
  transition: background-color 0.3s; /* Add a transition for smooth color change */
  /* Define initial background color */
  cursor: pointer; /* Change cursor to pointer on hover */
  margin-top: 7vh;
}

/* Add styles for the "Load Game" button */
.small-saved-game .load-button {
  border: none;
  padding: 5px 10px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s; /* Add a transition for smooth color change */
}

.small-saved-game .load-button:hover,
.small-saved-game .load-button:focus { /* Add focus state for accessibility */
  background-color: blue; /* Change to your desired button hover color */
  
}

.new_save_button{
  border-radius: 8vh;
  height: 8vh;
  width: 16vh;
}

.new_save_button:hover{
  cursor: pointer;
}

</style>
















