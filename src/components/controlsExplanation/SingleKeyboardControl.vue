<script setup>
import { ref, defineProps } from 'vue';

const props = defineProps({
	keyboard: {
		type: String,
		required: true
	},
	whatItDoes: {
		type: String,
		required: true
	}
});

</script>	


<template>
	<div class="wrap">
		<div class="keyboard"> {{ props.keyboard }}  </div>
		<div class="what-it-does"> {{ props.whatItDoes }} </div>
	</div>

</template>

<style scoped>
.wrap{
	display: flex;
	flex-direction: column;
	align-items: center;
	border-style: solid;
	border-width: 0.25em;
	border-color: black;
	
	min-width: 10em;
	min-height: 10em;
}

.wrap .keyboard{
	flex: 3;
	font-weight: bold;
	font-size: 2em;
}

.wrap .what-it-does{
	flex: 1;
}
</style>























