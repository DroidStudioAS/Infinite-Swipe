<!-- -->
<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import pomagacLeaderboard from '../mrezniPomagaci/pomagacLeaderboard';
import { useSkladiste } from '../stores/Skladiste';

const Skladiste = useSkladiste();
const router = useRouter();
let high_score = -1;
const slikeKaraktera = ref([
				{picture: "/char_spaceship.png", relativeHeight: 0.9},
				{picture: "/char_harold.png", relativeHeight: 1.0}, 
				{picture: "/char_deda_mraz_na_sankama.png", relativeHeight: 1.0},
							]);
const animalSet = ref([
			{picture: "/char_chick.png", relativeHeight: 1.0},
			{picture: "/char_elephant.png", relativeHeight: 1.0},
			{picture: "/char_monkey.png", relativeHeight: 1.0},
						])

function animalSetUnlocker(){
	for(let i = 0; i <animalSet.value.length; i++){
		slikeKaraktera.value.push({
						picture: animalSet[i].picture,
						relativeHeight: animalSet[i].relativeHeight
					   });
	}
}

const indeksIzabraneSlike = ref(0);

const izabranaSlika = computed(() => slikeKaraktera.value[indeksIzabraneSlike.value].picture);

function pokreniIgru(){
	const selectedPicture = slikeKaraktera.value[indeksIzabraneSlike.value].picture;
	const relativeHeight = slikeKaraktera.value[indeksIzabraneSlike.value].relativeHeight;
	
	Skladiste.setSlikaKaraktera(selectedPicture);
	Skladiste.setRelativePictureHeight(relativeHeight);
	
	if(Skladiste.playingCampaign){
		router.push({name:"keyboardExplanation"});
		return;
	}
	router.push({name: "SaveLoadGame"});
}

function nazadNaPocetnuStranu(){
	router.push({name: 'gameMode'});
}

function karakterLevo(){
	const brojSlika = slikeKaraktera.value.length;
	indeksIzabraneSlike.value = (indeksIzabraneSlike.value - 1 + brojSlika) % brojSlika;
	console.log(indeksIzabraneSlike.value);
}

function karakterDesno(){
	const brojSlika = slikeKaraktera.value.length;
	indeksIzabraneSlike.value = (indeksIzabraneSlike.value + 1) % brojSlika;
	console.log(indeksIzabraneSlike.value);
}

// Zvuk funkcija
function playWoosh() {
  const audio = new Audio('/woosh.mp3');
      audio.play();
}
async function getHs(){
	const username = localStorage.getItem('username').replace(/"/g, "");
	console.log(username);
	high_score = await pomagacLeaderboard.getHighScore(username);
	console.log("hs"+high_score);
	if(high_score>100){
		slikeKaraktera.value.push({picture: "/char_chick.png", relativeHeight: 1.0});
		slikeKaraktera.value.push({picture: "/char_elephant.png", relativeHeight: 1.0});
		slikeKaraktera.value.push({picture: "/char_monkey.png", relativeHeight: 1.0});
	}
	if(high_score>150){
		slikeKaraktera.value.push({picture: "/char_monster3.png", relativeHeight: 1.0});
		slikeKaraktera.value.push({picture: "/char_monster1.png", relativeHeight: 1.0});
		slikeKaraktera.value.push({picture: "/char_monster2.png", relativeHeight: 1.0});
	}
	if(high_score>200){
		slikeKaraktera.value.push({picture: "/char_samurai.png", relativeHeight: 1.0});
		slikeKaraktera.value.push({picture: "/char_viking.png", relativeHeight: 1.0});	
	}
	console.log(high_score)
	Skladiste.setHighScore(high_score)
}
onMounted(()=>{
	getHs();
})
</script>


<template>
	<body>
	<div class="wrap">
		<div class="naslov">
			<h2> Izaberi Karaktera</h2>
		</div>
		<div class="navigacija">
			<button @click="nazadNaPocetnuStranu()" @mouseover="playWoosh">Nazad</button>
			<button @click="pokreniIgru()" @mouseover="playWoosh">Započni Igru</button>
		</div>
		<div class="slika-karaktera">
			<img :src="izabranaSlika" alt="izabrana slika" class="slika"/>
		</div>
		<div class="menjanje-karaktera">
			<label class="levo" @click="karakterLevo()"> &#8592 </label>
			<label class="desno" @click="karakterDesno()"> &#8594 </label>
		</div>
	</div>
</body>
</template>


<style scoped>

body{
	background:#3d90cd ;
}
.wrap {
	margin-top: 70px;
	display: flex;
	justify-content: center;
	flex-flow: column nowrap;
}
.naslov{
	display: flex;
	justify-content: center;
	font-size: 24px;
	color: rgb(0, 0, 0);
	text-shadow: 0 0 10px white;
}
.naslov h2 {
	font-weight: 800;
}
.navigacija{
	display: flex;
	justify-content: space-evenly;
}
.menjanje-karaktera{
	display: flex;
	justify-content: center;
}
.menjanje-karaktera, .menjanje-karaktera > *{
	font-size: 2em;
}
.menjanje-karaktera > *:hover{
	cursor: pointer;
	color: gold;
}
.slika{
	max-height: 7em;
	max-width: 7em;
}
.slika-karaktera{
	display: flex;
	justify-content: center;
}
.navigacija > button{
	padding: 1em 2em;
	font-family: 'Times New Roman', Times, serif;
  	font-size: 18px;
	margin: 3%;
  	border-radius: 50px;
  	cursor: pointer;
}
.navigacija > button:hover{
	color: white;
	background-color: blue;
}
@media (max-width: 768px) {
.navigacija{
	flex-flow: column;
	justify-content: start;
}

}
</style>
