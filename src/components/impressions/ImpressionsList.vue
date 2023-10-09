
<script setup>
import { ref, defineProps, onMounted, watch } from 'vue';
import SingleImpression from './SingleImpression.vue';
import mobileHelper from '../../models/mobileHelper.js';

const props = defineProps({
	numOfColumns: {
		type: Number,
		required: true
	},
	myUsername: {
		type: String,
		required: true
	},
	fetchImpressions: {
		type: Function,
		required: true
	},
	editImpression: {
		type: Function,
		required: true
	},
	deleteImpressionById: {
		type: Function,
		required: true
	},
	titleMaxLength: {
		type: Number,
		required: true
	},
	impressionMaxLength: {
		type: Number,
		required: true
	},
	addImpressionKey: {
		type: Boolean,
		required: true
	}	
	
});

watch(() => props.addImpressionKey, async (newKey, oldKey) => {
	await fetchImpressions();
});

const isOnPhone = ref(mobileHelper.isMobile());

/* za query parametre pretrage impression-a **************************************************************************/

const choosingImpressionsQuery = ref(false);
function chooseImpressionsQuery(){
	choosingImpressionsQuery.value = true;
}


const queryByUsername = ref("");
const queryByImpression = ref("");
const queryByImpressionTitle = ref("");

const startDate = ref(null);
const startTime = ref(null);
const minimumRating = ref(1);


const finishDate = ref(null);
const finishTime = ref(null);
const maximumRating = ref(5);

const weQueryByUsername = ref(false);
const weQueryByImpression = ref(false);
const weQueryByImpressionTitle = ref(false);
const weQueryByEarliestTime = ref(false);
const weQueryByLatestTime = ref(false);
const weQueryByMaximumRating = ref(false);
const weQueryByMinimumRating = ref(false);


function resetCustomQuery(){
	weQueryByUsername.value = false;
	weQueryByImpression.value = false;
	weQueryByImpressionTitle.value = false;
	weQueryByEarliestTime.value = false;
	weQueryByLatestTime.value = false;
	weQueryByMinimumRating.value = false;
	weQueryByMaximumRating.value = false;
	
	minimumRating.value = worstPossibleRating;
	maximumRating.value = bestPossibleRating;
	
	finishTime.value = null;
	finishDate.value = null;
	startTime.value = null;
	startDate.value = null;
	
	queryByUsername.value = "";
	queryByImpression.value = "";
	queryByImpressionTitle.value = "";
}

function cancelCustomQuery(){
	resetCustomQuery();
	choosingImpressionsQuery.value = false;
}

async function createCustomQuery(){
	let customQuery = {};
	
	if (weQueryByMaximumRating.value === true){
		customQuery.maximum_rating = maximumRating.value;
	}
	
	if (weQueryByMinimumRating.value === true){
		customQuery.minimum_rating = minimumRating.value;
	}

	if (weQueryByUsername.value === true){
		customQuery.username = queryByUsername.value;
	}
	if (weQueryByImpression.value === true){
		customQuery.impression = queryByImpression.value;
	}
	if (weQueryByImpressionTitle.value === true){
		customQuery.impression_title = queryByImpressionTitle.value;
	}
	
	if (weQueryByEarliestTime.value === true){
		if (startDate.value == null || startTime.value == null){
			alert("You haven't entered start datetime, yet you checked it. \r\n Either uncheck it or add it.");
			return;
		}
		customQuery.minimum_time_of_posting = createDateTime(startDate.value, startTime.value);
	}
	
	if (weQueryByLatestTime.value === true){
		if (finishDate.value == null || finishTime.value == null){
			alert("You haven't entered finish datetime, yet you checked it.\r\n Either uncheck it or add it.");
			return;
		}
		customQuery.maximum_time_of_posting = createDateTime(finishDate.value, finishTime.value);
	}
	
	choosingImpressionsQuery.value = false;
	let s = "";
	Object.entries(customQuery).forEach(keyValue => s+="  " + keyValue[0] + ":" + keyValue[1]);
	
	resetCustomQuery();
	await fetchImpressions(customQuery);
}

function createDateTime(dateString, timeString){
	return dateString + " " + timeString + ":00";
}

/* Kraj promenljivih i funkcija koje se odnose na parametre za query impression-a. ********************************************/

const bestPossibleRating = ref(5);
const worstPossibleRating = ref(1);

const impressions = ref([]);

async function reload(){
	await fetchImpressions();
}

onMounted(() => fetchImpressions());

async function fetchImpressions(inputQueryParams = {}){
	if (inputQueryParams == null){
		inputQueryParams = {};
	}
	impressions.value = await props.fetchImpressions(inputQueryParams);
}

async function deleteImpression(id){
	await props.deleteImpressionById(id);
	await fetchImpressions();
}

async function editImpression(updatedImpression){
	const updated_impression = updatedImpression.updated_impression;
	const updated_impression_title = updatedImpression.updated_impression_title;
	const updated_rating = updatedImpression.updated_rating;
	const impression_id = updatedImpression.impression_id;

	if (updated_impression.trim().length < 0){
		alert("Impression can't be empty");
		return;
	}

	if (updated_impression.length > props.impressionMaxLength) {
		alert(`Impression is too long. Impression can be at most ${props.impressionMaxLength} characters long.`);
		return;
	}

	if (updated_impression_title.trim().length < 0){
		alert("Impression title can't be empty.");
		return;
	}

	if (updated_impression_title.length > props.titleMaxLength){
		alert(`Impression title is too long. Impression title can be at most ${props.titleMaxLength} characters long.`);
		return;
	}

	await props.editImpression({
		updated_impression: updated_impression,
		updated_impression_title: updated_impression_title,
		updated_rating: updated_rating,
		impression_id: impression_id
	});		
	await fetchImpressions();
}
const impressionsRef = ref(null);

function scrollToStart(){
	impressionsRef.value?.scrollTo({top: 0});
}

</script>


<template>

	<div class="impressions-query" v-if="choosingImpressionsQuery" 
	:class="[isOnPhone? 'impressions_query_mobile' : 'impressions_query_desktop']">
		<div class="explanation-for-query">
			Izaberite filtere koje želite da primenite. Morate da štiklirate polja po kojima želite da se radi pretraga.
		</div>
		
		<div class="finish-impressions-query">
			<button @click="createCustomQuery">Pretraži</button>
			<button @click="resetCustomQuery">Poništi filtere</button>
			<button @click="cancelCustomQuery">Nazad</button>
		</div>
		
		<div class="create-custom-query">
			<div class="username-query" :class="{selected_query_parameter: weQueryByUsername}">
				<label>Korisničko ime: </label>
				<input type="text" v-model="queryByUsername" placeholder="Korisničko ime"/>
				<input type="checkbox" v-model="weQueryByUsername"/>
			</div>
		
			<div class="impression-query" :class="{selected_query_parameter: weQueryByImpression}">
				<label>Sadržaj Recenzije: </label>
				<textarea v-model="queryByImpression"></textarea>
				<input type="checkbox" v-model="weQueryByImpression"/>
			</div>
		
			<div class="impression-title-query" :class="{selected_query_parameter: weQueryByImpressionTitle}">
				<label> Naslov Sadrži: </label>
				<input type="text" v-model="queryByImpressionTitle"/>
				<input type="checkbox" v-model="weQueryByImpressionTitle"/>
			</div>
			
			<div class="rating-query">
				<div class="minimum-rating-query" :class="{selected_query_parameter: weQueryByMaximumRating}">
					<label>Maksimalna Ocena({{ worstPossibleRating }} - {{bestPossibleRating }}): </label>
					<input type="number" v-model="maximumRating"
					step="1"	:min="worstPossibleRating" :max="bestPossibleRating"/>
					<input type="checkbox" v-model="weQueryByMaximumRating"/>
				</div>
			
				<div class="maximum-rating-query" :class="{selected_query_parameter: weQueryByMinimumRating}">
					<label>Minimalna Ocena ({{ worstPossibleRating }} - {{ bestPossibleRating }}): </label>
					<input type="number" v-model="minimumRating" step="1" 
					:min="worstPossibleRating" :max="bestPossibleRating"/>
					<input type="checkbox" v-model="weQueryByMinimumRating"/>
				</div>
			</div>
		
			<div class="time-of-posting-query">
				<div class="start-datetime-query" :class="{selected_query_parameter: weQueryByEarliestTime}">
					<label>Od: </label>
					<input type="date" v-model="startDate"/>
					<input type="time" v-model="startTime"/>
					<input type="checkbox" v-model="weQueryByEarliestTime"/>
				</div>
				
				<div class="finish-datetime-query" :class="{selected_query_parameter: weQueryByLatestTime}">
					<label>Do: </label>
					<input type="date" v-model="finishDate"/>
					<input type="time" v-model="finishTime"/>
					<input type="checkbox" v-model="weQueryByLatestTime"/>
				</div>
			</div>
		
		</div>
	</div>	
	<div class="display-impressions" v-else>
		<button @click="chooseImpressionsQuery">Prikaži Filtere</button>
		<div class="impressions_container" 
		:class="[isOnPhone ? 'impressions_container_mobile' : 'impressions_container_desktop']">
			<div class="impressions" v-for="(impression, index) in impressions" :key="index">
				<single-impression 
:impression="impression" :numOfColumns="numOfColumns" :isEditable="impression.username === props.myUsername" 
:titleMaxLength="props.titleMaxLength" :impressionMaxLength="props.impressionMaxLength" 
@editFinished="editImpression" @deleteImpression="deleteImpression" 
				class="single_impression"/>
				<div class="impressions_divider"></div>
			</div>
		</div>
	</div>

</template>







<style scoped>
/* Style for the inputs */
input[type="text"],
input[type="number"],
textarea,
button {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 10px;
  width: 100%;
  box-sizing: border-box;
}

/* Style for the checkboxes */
input[type="checkbox"] {
  margin-right: 5px;
}
.time-of-posting-query{
	display: flex;
	flex-flow: column nowrap;
	margin-bottom: 5em;
}

/* Style for the buttons */
button {
  background-color: #fbe6e6;;
  color: black;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #fbe6e6;;
}

/* Style for the error messages */
.error-message {
  color: red;
  margin-top: 5px;
}

/* Additional styling specific to your component */
.explanation-for-query {
  border-radius: 25%;
  font-size: large;
  color: white;
}


.impressions_container_desktop{
	margin-bottom: 7vh;
}

.impressions_container_mobile{
	margin-bottom: 30vh;
}



.impressions_query_mobile{
	margin-bottom: 20vh;
}


.create-custom-query > *{
	margin-bottom: 5vh;
}

.maximum-rating-query{
	margin-top: 5vh;
}

.single_impression{
	margin-bottom: 6vh;
}

.selected_query_parameter{
	background: yellow;
}

.selected_query_parameter > label{
	color: black;
}



</style>










