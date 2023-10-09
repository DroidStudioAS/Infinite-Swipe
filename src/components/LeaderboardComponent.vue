<!-- -->
<script setup>
import { ref, defineProps, onMounted } from 'vue';
import pomagacLeaderboard from '../mrezniPomagaci/pomagacLeaderboard';
import mobileHelper from '../models/mobileHelper.js';

const props = defineProps({
	dobavljacLeaderboarda: {
		type: Object,
		required: true
	}
});

const ucitavanjeUtoku = ref(true);

const isOnPhone = ref(mobileHelper.isMobile());

const scores = ref([]);

onMounted(() => dobaviLeaderboard());

async function dobaviLeaderboard(){
	try{
	Object.entries(props.dobavljacLeaderboarda).forEach(e => console.log("key:" + e[0] + ", value: " + e[1]));
		 props.dobavljacLeaderboarda.dobaviLeaderboard().then(s => {
			scores.value = s;
			console.log("typeof(s): "  + typeof(s));
			console.log("LeaderboardComponent - scores.value: " + scores.value);
	ucitavanjeUtoku.value = false;
		});
	
	} catch(error){
		console.log(error);
	}
}


function getRowClass(index) {
    if (index === 0) {
      return 'gold';
    } else if (index === 1) {
      return 'silver';
    } else if (index === 2) {
      return 'bronze';
    } else {
      return 'normal';
    }
  }
</script>


<template>
	<div class="wrap">
	  <div v-if="ucitavanjeUtoku">
		Učitavanje.. Molimo vas, sačekajte.
	  </div>
	  <div v-else>
		<div class="kontejner" :class="[isOnPhone ? 'container_phone' : 'container_desktop']">
		  <table class="tabela">
			<thead>
			  <tr>
				<th>Mesto</th>
				<th>Rezultat</th>
				<th>Korisnik</th>
				<th class="dissaperarOnMobile">Vreme</th>
			  </tr>
			</thead>
			<tbody>
			  <tr v-for="(scoreInfo, index) in scores" :key="index" class="red-tabele" :class="getRowClass(index)">
				<td :class="{ score: true, gold: index === 0, silver: index === 1, bronze: index === 2 }">{{ index + 1 }}</td>
				<td :class="{ score: true, gold: index === 0, silver: index === 1, bronze: index === 2, twinkling: index === 0 }">{{ scoreInfo.score }}</td>
				<td :class="{ score: true, gold: index === 0, silver: index === 1, bronze: index === 2, twinkling: index === 0 }">{{ scoreInfo.username }}</td>
				<td class="dissaperarOnMobile" :class="{ score: true, gold: index === 0, silver: index === 1, bronze: index === 2 }">{{ scoreInfo.score_time }}</td>
			  </tr>
			</tbody>
		  </table>
		</div>
	  </div>
	</div>
  </template>

<style scoped>

* {
	font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
	overflow: visible;
	font-size: 18px;
}

.kontejner{
	border-bottom:1px solid black;
	max-width: 90vw;
	overflow: auto; /* Add vertical scrollbar when needed */
}

.container_desktop {
	max-height: 80vh;
}

.container_phone{
	max-height: 45vh;
}

.wrap {
  display: flex;
  justify-content: center;
  padding-top: 3em;
  height: 100vh;
}
.tabela {
  max-width: 90vw;
  border-collapse: collapse;
  border: 1px solid #000000;
}
.tabela th {
  padding: 15px;
  text-align: center;
  border-bottom: 1px solid black;
  border-top: 1px solid black;
  color: rgb(0, 0, 0);
  background-color: #f2f2f2;
  max-width: 90vw;
}
.tabela td {
  height: 10vh;
  max-width: 90vw;
  padding: 15px;
  text-align: center;
  border-bottom: 1px solid black;
  border-top: 1px solid black;
  background-color: #77efff;
}
.tabela td.gold {
  background-color: gold;
  animation: twinkling 1s alternate infinite;
}
.tabela td.twinkling {
  animation: twinkling-text 1s alternate infinite;
}
@keyframes twinkling-text {
  from {
    color: black; /* Početna boja teksta */
	font-size: small;
  }
  to {
    color: rgb(167, 167, 167); /* Krajnja boja teksta */
	font-size: large;
  }
}
.tabela td.silver {
  background-color: #C0C0C0;
}
.tabela td.bronze {
  background-color: #cd7f32; 
}
@media (max-width: 768px) {
  /* .tabela {
    position: absolute;
	top: 15%;
	left: 0%;
	right: 0%;
	bottom: 0%;
	max-width: 400px;
	overflow: auto;	
  } */
  .dissaperarOnMobile{
	display: none;
  }
  .tabela th,
  .tabela td {
    padding: 10px; /* Reduce padding for better mobile layout */
  }
}
</style>

