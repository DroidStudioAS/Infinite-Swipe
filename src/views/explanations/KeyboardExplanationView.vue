<script setup>
import ControlsExplanation from '../../components/controlsExplanation/ControlsExplanation.vue';
import { onMounted, onBeforeUnmount, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useSkladiste } from '../../stores/Skladiste';

const router = useRouter();
const TIME_THIS_WINDOW_EXISTS_IN_SECONDS = 7;
const ONE_SECOND = 1000;

const timerSecondsLeft = ref(TIME_THIS_WINDOW_EXISTS_IN_SECONDS);
let interval = null;
const Skladiste = useSkladiste();





onMounted(() => {
	changeBackground()
	window.addEventListener('keydown', spaceAndEnterHandler);
	window.addEventListener('touchend', onTouchEnd);
	interval = setInterval(() => {
		timerSecondsLeft.value -= 1;
		if (timerSecondsLeft.value <= 0){
			countdownIsOver();
		}		
	}, ONE_SECOND);
});

onBeforeUnmount(() => {
	window.removeEventListener('keydown', spaceAndEnterHandler);
	window.removeEventListener('touchend', onTouchEnd);	
});


function countdownIsOver(){
	if (interval !== null){
		clearInterval(interval);
	}
	
	router.push("igrica");
}
function changeBackground() {
  document.body.style.backgroundColor = '#3d90cd';
}

const onTouchEnd = (event) => {
	countdownIsOver();
};

const spaceAndEnterHandler = (event) => {
	if (event.key === 'Enter' || event.key === ' '){
		countdownIsOver();
	}
};



</script>



<template>
	<body>
	<div v-if="!Skladiste.isUserOnMobile" class="wrap">
		<h1>Pritisni Enter/Space da bi preskocio uputsvo</h1>
		<div style="font-size: 20px;">Preskace se automatski za : {{ timerSecondsLeft }} sekundi</div>
		<img class="keyboardExp" src="/graph_keyboard_legend.png">
	</div>
	<div v v-else-if="Skladiste.isUserOnMobile">
		<h1>Pritisni Ekran da bi preskocio uputsvo</h1>
		<div style="font-size: 20px;">Preskace se automatski za : {{ timerSecondsLeft }} sekundi</div>
		<img class="mobileExp" src="/graph_mobile_legend.png">
	</div>
</body>
	
</template>



<style scoped>
body{
	background-color: #3d90cd;
}
.mobileExp{
width: 60vw;
height: 60vh;

}
.wrap{
display: flex;
flex-flow: column nowrap;
margin-left: 20vw;
	
}
.keyboardExp{
	width: 60vw;
	height: 60vh;
}

.interval-seconds{
	font-size: 3em;
	min-height: 10em;
}

.controls-explanation-class{
	top: 5em;
	left: 10em;
}

.wrap{
	position: absolute;
	top: 10em;
}

.how-to-skip{
	font-size: 3em;
}
</style>


































