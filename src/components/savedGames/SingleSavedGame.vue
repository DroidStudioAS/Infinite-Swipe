
<script setup>
import { ref, defineProps, defineEmits } from 'vue';

const props = defineProps({
	username: {
		type: String,
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
	moment_of_saving: {
		type: String
	},
	game_id: {
		type: Number,
	},
	load_possible: {
		type: Boolean,
		required: true
	},
	update_possible: {
		type: Boolean,
		required: true
	},
	thisGameIsLoaded: {
		type: Boolean
	}
});

const emits = defineEmits(['deleteThisGame', 'overrideThisGame', 'loadGame']);

async function deleteThisGame(){
	await emits('deleteThisGame', props.game_id);
}

async function overrideThisGame(){
	console.log("Id from single saved game: " + props.game_id);
	await emits('overrideThisGame', props.game_id);
}

async function loadGame(){
	await emits('loadGame', props.game_id);
}

</script>



<template>
	<div class="wrap" :class="{loaded_game: props.thisGameIsLoaded}">
		<div class="display_info">
			<label>Korisnik: {{ props.username }} </label><br/>
			<label>Skor: {{ props.score }} </label><br/>
			<label>Sačuvano: {{ props.moment_of_saving }} </label><br/>
			<label>Igra traje {{ props.time_spent_playing_in_seconds }} sekundi </label> <br/>
			<label>Postavljeno {{ props.used_questions_ids.length }} pitanja </label><br/>
		</div>
		<div class="buttons">
			<button class="nav-button" @click="deleteThisGame" @touchend="deleteThisGame">Obriši</button>
			<button class="nav-button" v-if="props.update_possible" 
			@click="overrideThisGame" @touchend="overrideThisGame">Pregazi</button>
			<button class="nav-button" v-if="load_possible" @click="loadGame" @touchend="loadGame">Učitaj Partiju</button>
		</div>
	</div>
</template>



<style scoped>

.display_info{
	display: flex;
	flex-flow: column nowrap;
}
.wrap {
	display: flex;
	flex-flow: column nowrap;
	justify-content: center;
	max-height: 120vh;
	max-width: 100vw;
	margin: 2em;
	position: relative;
	top: 5%;	
}
@media(max-width:768px){
	.wrap{
	max-height: 50vh;
	max-width: 15vw;
	}
	.wrap nav-button{
		height: 20px;
		width:20px;
	}
}
.loaded_game{
	background: #1d70ad;
}
.buttons{
	display: flex;
	
	flex-flow: row nowrap;
	justify-content: space-between;
}
.nav {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  height: 15vh;
  background-color: #1450A3;
}

.nav-button {
  height: 50px;
  border-radius: 50px;

  width: 100px;
  background-color: #3d90cd; /* Button background color */
  color: white; /* Button text color */
  cursor: pointer;
  transition: background-color 0.3s; /* Add a transition for smooth color change */
}

.nav-button:hover {
  background-color: blue; /* Change to your desired hover color */
}
</style>






















