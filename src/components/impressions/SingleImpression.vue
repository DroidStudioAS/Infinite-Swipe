
	<script setup>
	import { ref, defineProps, defineEmits } from 'vue';
	const props = defineProps({
		impression: {
			impression_title: {
				type: String,
				required: true
			},
			impression: {
				type: String,
				required: true
			},
			username: {
				type: String
			},
			impression_id: {
				type: Number,
				required: true
			},
			rating: {
				type: Number,
				required: true
			}
		},
		numOfColumns: {
			type: Number,
			required: true
		},
		isEditable: {
			type: Boolean
		},
		titleMaxLength:{
			type: Number,
			required: true
		},
		impressionMaxLength: {
			type: Number,
			required: true
		}
	});
	const starSource = ref("/graph_zvezda.png");
	const starsArray = ref([1,2,3,4,5]);

	const emits = defineEmits(['editFinished', 'deleteImpression']);

	const isEditing = ref(false);
	const editTitle = ref(props.impression.impression_title);
	const editImpression = ref(props.impression.impression); 
	const editRating = ref(props.impression.rating);



	function selectedRating(n){
		editRating.value = n;
	}

	function finishEditing(){
		isEditing.value = false;	

		const updated_impression_title = editTitle.value;
		const updated_impression = editImpression.value;
		const updated_rating = editRating.value;

		cancelEdit();
		
		emits('editFinished', {
			updated_impression_title, 
			updated_impression,
			updated_rating,
			impression_id: props.impression.impression_id
		});
	}

	function startEditing(){
		isEditing.value = true;
		editTitle.value = props.impression.impression_title;
		editImpression.value = props.impression.impression;
		editRating.value = props.impression.rating;
	}

	function deleteImpression(){
		emits("deleteImpression", props.impression.impression_id);
	}

	function cancelEdit(){
		editTitle.value = props.impression.impression_title;
		editImpression.value = props.impression.impression;
		editRating.value = props.impression.rating;
		isEditing.value = false;
	}

	</script>


	<template>
		<div class="wrap">
			<div class="display" v-if="!isEditing">
				<div class="username">
					Korinik: {{ props.impression.username }} 
				</div>
				<div class="rating">
					Ocena:
       		 		<img
         		 		v-for="n in props.impression.rating"
        		 		:key="n"
         		 		alt="star"
				 	class="star-icon"
				 	src="/graph_zvezda.png"/>
      				</div>
				<div class="title">
					<textarea :cols="props.numOfColumns" :maxlength="props.titleMaxLength" 
					:value="'Naslov: ' + props.impression.impression_title" readonly="true">
					</textarea>
				</div>
				<div class="impression-content">
					<textarea :cols="props.numOfColumns" :maxlength="props.impressionMaxLength"
					:value="'Recenzija: ' + props.impression.impression" readonly="true">			
					</textarea>
				</div>
				

				<button @click="startEditing" 
				v-if="props.isEditable">
					Izmeni
				</button>
	
				<button @click="deleteImpression" v-if="props.isEditable">
					Obriši
				</button>

			</div>

			<div class="edit-class" v-if="isEditing">
				<label>edit title: </label>
				<input type="text" v-model="editTitle" :maxlength="props.titleMaxLength"/>
				<br/>

				<label>edit impression: </label>
				<textarea :cols="props.numOfColumns" 
				v-model="editImpression" :maxlength="props.impressionMaxLength">
				</textarea>
				<br/>

				<div class="edit-rating">
					<label>edit rating: </label>
					<img v-for="(n, index) in starsArray" :key="index"
					:src="starSource" alt="star"
					class="star-rating"
					:class="{selected_rating: n <= editRating}"
					@click="selectedRating(n)">
				</div>

				<div class="buttContainer">
				<button @click="finishEditing">
					finish edit
				</button>	
				<button @click="cancelEdit">
					cancel edit
				</button>
				</div>
			</div>
		</div>
	</template>


	<style scoped>

	.buttContainer{
		display: flex;
		flex-flow: column nowrap;
	}
	button {
 	 padding: 10px;
  	border: 1px solid #ccc;
  	border-radius: 5px;
 	 margin-bottom: 10px;
 	 width: 50%;
  	box-sizing: border-box;
	}
	.star-icon{
		width: 20px; /* Adjust the size as needed */
 		height: 20px; /* Adjust the size as needed */
 		margin-right: 2px; /* Adjust the spacing between stars */
	}
	.star-rating{
		opacity: 0.5;
		width: 20px; /* Adjust the size as needed */
 		height: 20px; /* Adjust the size as needed */
 		margin-right: 2px; /* Adjust the spacing between stars */
	}

	.star-rating:hover{
		cursor: pointer;
	}

	.selected_rating{
		background: yellow;
		border-radius: 25%;
		opacity: 1;
	}
	textarea{
		width: 100%;
	}

	</style>













