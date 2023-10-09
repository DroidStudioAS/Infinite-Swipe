
<template>
	<div class="wrap">
			<div class="pause_text">
				<p>Pauza</p>
			</div>
		  <div class="inside_wrap">
			  <div class="saving" v-if="saveScreenIsOn">
				  <button @click="removeSavingScreen" @touchend="removeSavingScreen" class="back-button">
				  	Back
				  </button>

				  <saving-loading-games  class="save-load-games"
				  :username="username"  
				  :used_questions_ids="Skladiste.id_koje_necu" 
				  :score="Skladiste.score" 
				  :current_game_id="Skladiste.currentGameId"
				  :lives_remaining="props.livesRemaining"
				  :load_possible="false"
				  :save_possible="true"
				  :update_possible="true"
				  @gameOverriden="gameOverriden"
				  @gameInserted="gameInserted"
				  />

			</div> 
			<div class="opcije" v-else>
				<div
				  v-for="(opcija, indeks) in opcije" 
				  :key="indeks"
				  class="jedna-opcija"
				  :class="{ izabranaopcija: indeks === indeksIzabraneOpcije,
				  dontDisplay: !opcija.display }"
				  @click="opcija.funkcija()"
				  @touchend="opcija.funkcija()"
				>
					  <label>{{ opcija.tekst }}</label>
				</div>
			  </div>
		  </div>
	</div>
	  </template>
	  
	  <script setup>
	  import { ref, defineEmits, defineProps, onBeforeMount, onBeforeUnmount } from 'vue';
	  import { useRouter } from 'vue-router';
	  import SavingLoadingGames from '../components/savedGames/SavingLoadingGames.vue';
	  import { useSkladiste } from '../stores/Skladiste.js';
	  
	  const Skladiste = useSkladiste();
	  const emits = defineEmits(['nastavi-igru', 'prekini-igru']);
	  const props = defineProps({
	  	displaySave: {
	  		type: Boolean
	  	},
	  	livesRemaining: {
	  		type: Number,
	  		required: true
	  	}
	  });
	  const router = useRouter();
	  
	  const saveScreenIsOn = ref(false);
	  
	  const username = ref(JSON.parse(localStorage.getItem("username")));
	  const load_possible = ref(false);
	  
	  const opcije = ref([
		{
		  tekst: 'Nastavite igricu',
		  funkcija: () => emits('nastavi-igru'),
		  display: true,
		},
		{
		  tekst: 'Prekinite igricu',
		  funkcija: () => emits('prekini-igru'),
		  display: true,
		},
		{
		  tekst: 'Save',
		  funkcija: () => goToSaveLoad(),
		  display: props.displaySave
		},
	  ]);
	  
	  function goToSaveLoad(){
		  saveScreenIsOn.value = true;
	  }
	  
	  function removeSavingScreen(){
		  saveScreenIsOn.value = false;
	  }
	  
	  function gameOverriden(id){
		  Skladiste.setCurrentGameId(id);
	  }
	  
	  function gameInserted(id){
	  	  Skladiste.setCurrentGameId(id);
	  }
	  
	  const indeksIzabraneOpcije = ref(0);
	  const handler = (event) => {
	  if (event.key === 'Enter' || event.key === ' ') {
		event.preventDefault();
		opcije.value[indeksIzabraneOpcije.value].funkcija();
	  } else if (event.key === 'ArrowDown' || event.key === 's') {
		event.preventDefault();
		indeksIzabraneOpcije.value = (indeksIzabraneOpcije.value + 1) % opcije.value.length;
	  } else if (event.key === 'ArrowUp' || event.key === 'w') {
		event.preventDefault();
		indeksIzabraneOpcije.value = (indeksIzabraneOpcije.value + opcije.value.length - 1) % opcije.value.length;
	  } else if (event.key === 'p' || event.key === 'Escape'){
	  	event.preventDefault();
	  	emits('nastavi-igru');
	  }
	};
	window.addEventListener('keydown', handler)
	
	onBeforeUnmount(()=>{
		window.removeEventListener('keydown',handler);
	})
	  </script>
	  
	  <style scoped>

	  .pause_text {
		position: absolute;
		top: 100px;
		font-size: 48px;
		font-family: fantasy;
		color: red;
		text-shadow: 0 0 20px rgb(0, 0, 0);
	  }
	.wrap {
		position: absolute;
		top: 0;
		left: 0px;
		border: 1px solid black;
	  display: flex;
	  justify-content: center;
	  align-items: center;
	  height: 100vh;
	  width: 100vw;
	  background-color: #7aedff;
	  z-index: 99;
	}
	
	
	
	.inside_wrap button:hover {
		background-color: blue;
		color: white;
	}

	.inside_wrap {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 18em;
		width: 16em;
		border: 1px solid black;
		z-index: 99;
		border-radius: 50px;
		background-color: rgb(68, 0, 255);
		box-shadow: 0 0 20px black;
	}


	.opcije {
	  display: flex;
	  flex-direction: column;
	  align-items: center;
	  font-size: 24px;
	  box-shadow: 0 0 10px rgb(255, 255, 255);
	}
	.jedna-opcija {
	  padding: 10px 20px;
	  margin: 5px;
	  border-radius: 5px;
	  cursor: pointer;
	  transition: background-color 0.3s, color 0.3s;
	}
	.jedna-opcija:hover {
	  background-color: #3498db;
	  color: white;
	}
	
	.saving{
		overflow: auto-enabled;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}
	
	.inside_wrap button {
		border-radius: 50px;
		width: 70px;
		height: 40px;
	}
	
	.save-load-games{
		overflow: auto-enabled;
		display: flex;
		justify-content: center;
		flex-flow: row wrap;
		margin-bottom: 20vh;
		height: 70vh;
	}
	
	.dontDisplay{
		display: none;
	}
	
	
	</style>
	
	
