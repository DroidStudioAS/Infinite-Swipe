<!-- -->
<script setup>
import { ref, defineProps, defineEmits, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import LeaderboardComponent from '../components/LeaderboardComponent.vue';
import pomagacLeaderboard from '../mrezniPomagaci/pomagacLeaderboard';
import { useSkladiste } from '../stores/Skladiste';
import mobileHelper from '../models/mobileHelper';


const Skladiste = useSkladiste();
const router = useRouter();



const isPhoneHorizontal = ref(mobileHelper.isMobile() && window.screen.height < window.screen.width);

/* konstante */
const brojScorovaULeaderboardu = 10;

/* kraj konstanti *********************************************************************8*/

const ucitavanjeZavrseno = ref(false);
const prikazujeSeLeaderboard = ref(false);
const userScorovi = ref([]);


const dobavljacLeaderboarda = ref({
	dobaviLeaderboard: () => pomagacLeaderboard.nabaviLeaderboardKorisnika(
	JSON.parse(localStorage.getItem("username")), brojScorovaULeaderboardu)
});


onMounted(() => onMountedFunkcija());

onBeforeUnmount(() => {
	window.removeEventListener('resize', sizeListener);
});

async function onMountedFunkcija(){
	ucitavanjeZavrseno.value = true;
	window.addEventListener('resize', sizeListener);
}

function sizeListener(){
	isPhoneHorizontal.value = mobileHelper.isMobile() && window.screen.height < window.screen.width;
}

function prestaniPrikazivanjeLeaderboarda(){
	prikazujeSeLeaderboard.value = false;
}

function prikaziLeaderboard(){
	prikazujeSeLeaderboard.value = true;
}

function naPocetniEkran(){
	router.push({name: 'pocetna'});
}

function novaIgra(){
	router.push({name: 'igrica'});
}

// Zvuk funkcija
function playWoosh() {
  const audio = new Audio('/woosh.mp3');
      audio.play();
}

</script>


<template>
	<div class="wrap">
		<div v-if="!ucitavanjeZavrseno"  class="ucitavanje">
			<label>Game over... Učitavanje...</label>
		</div>
		<div v-else-if="!prikazujeSeLeaderboard" class="glavna-klasa" 
		:class="{horizontal_phone: isPhoneHorizontal, no_horizontal_phone: !isPhoneHorizontal}">
			<div @click="novaIgra()" class="opcija" @mouseover="playWoosh">Igraj Opet</div>
			<div @click="prikaziLeaderboard()" class="opcija" @mouseover="playWoosh"> Prikaži lokalni leaderboard</div>
			<div @click="naPocetniEkran()" class="opcija" @mouseover="playWoosh">Nazad Na Glavnu Stranicu</div>
		</div>
		<div v-else>
			<button @click="prestaniPrikazivanjeLeaderboarda" class="dugme-nazad" @mouseover="playWoosh">Back</button>
			<leaderboard-component :dobavljacLeaderboarda="dobavljacLeaderboarda" class="lokalni-leaderboard"/>
		</div>
	</div>
</template>


<style scoped>
.wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  text-align: center;
}
.ucitavanje {
  text-align: center;
  padding: 2em;
  background-color: #f2f2f2;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.glavna-klasa {
  display: flex;
  
  align-items: center;
  justify-content: center;
  background-image: url('../assets/oblak.png');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;

  
  padding: 2em;
  border-radius: 10px;
  position: relative;
  overflow: hidden;
}

.horizontal_phone {
	flex-direction: row;
}

.no_horizontal_phone{
  	flex-direction: column;
	width: 70vh;
  	height: 45vh;
}

.opcija {
  padding: 1em 2em;
  font-weight: 600;
  font-size: 20px;
  letter-spacing: 1px;
  margin: 0.5em;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.opcija:hover {
  color: #2200ff;
}
.dugme-nazad {
	margin-top: 40px;
  padding: 0.5em 1em;
  background-color: rgb(255, 255, 255);
  border: 1px solid black;
  border-radius: 5px;
  color: rgb(0, 0, 0);
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
  cursor: pointer;
  transition: background-color 1.5s ease, transform 1.5s ease, color 1.5s ease;
  position: absolute;
}
.dugme-nazad:hover {
    background-color: rgb(0, 0, 0);
    color: white;
    transform: scale(1.25);
}
</style>

