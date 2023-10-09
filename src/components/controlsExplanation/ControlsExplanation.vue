
<script setup>
import SingleKeyboardControl from './SingleKeyboardControl.vue';


</script>


<template>
	
	<div class="wrap">
		<div class="up">
			<div class="wasd-class">
				<single-keyboard-control class="left" 
				:keyboard="'a'" :whatItDoes="'Move left.'" />

				<single-keyboard-control class="stop"
				:keyboard="'s'" :whatItDoes="'Stop horizontally.'"/>

				<single-keyboard-control class="right"
				:keyboard="'d'" :whatItDoes="'Move right'"/>
			</div>

			<div class="arrows-class">
				<single-keyboard-control class="left" 
				:keyboard="'&#8592;'" :whatItDoes="'Move left.'"/>

				<single-keyboard-control class="stop" 
				:keyboard="'&#8595;'" :whatItDoes="'Stop horizontally.'"/>

				<single-keyboard-control class="right"
				:keyboard="'&#8594;'" :whatItDoes="'Move right.'"/>
			</div>
		</div>

		<div class="down">
			<div class="jump">
				Space - jump
			</div>
		</div>
		
	</div>


</template>


<style scoped>


.wrap{
	display: flex;
	flex-direction: column;
	justify-content: space-between;
}

.up{
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-around;
}

.up > div{
	display: flex;
	flex-direction: row;
	align-items: center;
}

.arrow-class > .stop{
	top: 2em;
}



.jump{
	width: 50%;
	margin: auto;
	border-style: solid;
	border-width: 0.5em;
	border-color: black;
	
}

single-keyboard-control{
	min-height: 10em;
	min-width: 10em;
	margin-left: 1em;
	margin-right: 1em;
}

</style>


















