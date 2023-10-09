<!-- -->
<script setup>
import NavigationComponent from '../components/navigation/NavigationComponent.vue';
import LeaderboardComponent from '../components/LeaderboardComponent.vue';
import pomagacLeaderboard from '../mrezniPomagaci/pomagacLeaderboard.js';
import { ref } from 'vue';

const MAKSIMALAN_BROJ_SCOROVA_U_LEADERBOARDU = 20;

const dobavljacLeaderboarda = ref({
	dobaviLeaderboard: () => pomagacLeaderboard.nabaviGlobalniLeaderboard(MAKSIMALAN_BROJ_SCOROVA_U_LEADERBOARDU)
});

</script>



<template>
	<div class="wrap">
		<navigation-component/>
		
		 <leaderboard-component :dobavljacLeaderboarda="dobavljacLeaderboarda" class="my_leaderboard" />
	</div>

</template>



<style scoped>

.wrap{
	background-color: #3d90cd;
	height: 100vh;
	width: 100vw;
}

.my_leaderboard{
	
	bottom: 30vh;
	height: 55vh;
}

</style>
