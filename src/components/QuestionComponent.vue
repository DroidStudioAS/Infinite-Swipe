<script setup>
import { ref, computed, defineProps, defineEmits, onMounted, onBeforeMount, onBeforeUnmount } from 'vue';
import { useSkladiste } from '../stores/Skladiste';
import mobileHelper from '../models/mobileHelper';

const Skladiste = useSkladiste();

const props = defineProps({
    pitanjeInfo: {
        type: Object
    }
});

const emits = defineEmits(['answered']);

const isPhone = ref(mobileHelper.isMobile());
const isPhoneHorizontal = ref(mobileHelper.isMobile() && window.screen.height < window.screen.width);
const MAX_CHARACTERS_AFTER_WHICH_WE_MAKE_THE_TEXT_SMALLER = ref(50);
const CHARACTERS_PER_ANSWER_AFTER_WHICH_TEXT_IS_SMALLER = ref(18);

const maxCharactersAnswer = computed(() => {
	const maxLengthAmongWrongAnswers = Math.max(props.pitanjeInfo.pogresniOdgovor1.length,
						     props.pitanjeInfo.pogresniOdgovor2.length); 
	const maxLength = Math.max(maxLengthAmongWrongAnswers, props.pitanjeInfo.tacanOdgovor.length);
	return maxLength;
});




const questionIsActive = ref(false);
let userHasAlreadyAnswered = false;


const answersToShow = ref(['', '', '']);

const changeDirection = ref('');
const changeAmount = ref('');

const POINTS_FOR_WHICH_YOU_CAN_PASS_THE_QUESTION = props.pitanjeInfo.tezinaPitanja/2;

const ONE_SECOND = 1000;
const TWO_SECONDS = 2 * ONE_SECOND;
const TIME_IN_SECONDS_WHICH_THE_USER_HAS_TO_ANSWER_THE_QUESTION = 10;

const zvuk_tacan_odgovor = new Audio('/zvuk_tacan_odgovor.wav');
const zvuk_pogresan_odgovor = new Audio('/zvuk_pogresan_odgovor.wav');
const zvuk_timer = new Audio('/zvuk_timer.wav');


const timer = ref(TIME_IN_SECONDS_WHICH_THE_USER_HAS_TO_ANSWER_THE_QUESTION);
let timerInterval = null;




const answerInFocus = ref(0);


function passingQuestionAllowed(){
	return Skladiste.score>= POINTS_FOR_WHICH_YOU_CAN_PASS_THE_QUESTION;
}

const questionKeydown = (event) => {
	event.preventDefault();
	
	const numberOfAnswers = passingQuestionAllowed()? answersToShow.value.length + 1 : answersToShow.value.length;
	
	if (event.key === 'Enter'){
		const playerPassedTheQuestion = answerInFocus.value === answersToShow.value.length;
		if (playerPassedTheQuestion){
			userPassedTheQuestion();
		} else {
			const selectedAnswer = answersToShow.value[answerInFocus.value];
			userHasAnswered(selectedAnswer);
		}

	} else if (event.key === 'ArrowUp' || event.key === 'w') {
		answerInFocus.value = (answerInFocus.value - 1 + numberOfAnswers) % numberOfAnswers; 
	} else if (event.key === 'ArrowDown' || event.key === 's'){
		answerInFocus.value = (answerInFocus.value + 1) % numberOfAnswers;
	} 
}

onBeforeMount(() => {
	questionIsActive.value = true;
	initializeAnswers();
	startTimer();
	userHasAlreadyAnswered = false;
	window.addEventListener('keydown', questionKeydown);
});


onBeforeUnmount(() => cleanupAfterQuiz());


function initializeAnswers(){
      
    let odgovoriIzPitanja = [props.pitanjeInfo.tacanOdgovor, props.pitanjeInfo.pogresniOdgovor1, props.pitanjeInfo.pogresniOdgovor2];
      
    let randomOdgovori = [];
    const brojOdgovora = 3;
      
    for (let i=0;  i<brojOdgovora;  i++){
      	const brojPreostalihOdgovora = brojOdgovora - i;
      	const randomIndeks = Math.floor(Math.random() * brojPreostalihOdgovora);
      	randomOdgovori.push(odgovoriIzPitanja[randomIndeks]);
      	odgovoriIzPitanja.splice(randomIndeks, 1);
    }
    
    for (let i=0; i<randomOdgovori.length; i++){
    	answersToShow.value[i] = randomOdgovori[i];
    }  
    
}


function startTimer() {
  zvuk_timer.play();
  timer.value = TIME_IN_SECONDS_WHICH_THE_USER_HAS_TO_ANSWER_THE_QUESTION;
  
  if (timerInterval) {
    clearInterval(timerInterval);
  }
  
  timerInterval = setInterval(() => {
    timer.value -= 1;
    if (timer.value <= 0 && questionIsActive.value) {
    	answeredIncorrectly();
    }
  }, ONE_SECOND);
}


 function showUserTheCorrectAnswer() {
  //referenca na odg polja
  const answerBoxes = document.querySelectorAll('.quiz-odgovor');
  console.log("answerBoxes.length: " + answerBoxes.length);
  const correctAnswer = props.pitanjeInfo.tacanOdgovor;
  
  //individualizacija (ne radi mi dobro bez ovog koraka iz nekog razloga)
  const polje_1 = answerBoxes[0];
  const polje_2 = answerBoxes[1];
  const polje_3 = answerBoxes[2];

  const istina = props.pitanjeInfo.tacanOdgovor;
  
  //probao sam sa foreach i for(const x of odgovori answerBoxes), ali ovo mi jedino radi kako treba
  if(polje_1.textContent == istina){
    polje_1.classList.add('correct-answer');
  }else{
    polje_1.classList.add('incorrect-answer');
  }
  if(polje_2.textContent==istina){
    polje_2.classList.add('correct-answer');
  }else{
    polje_2.classList.add('incorrect-answer');
  }
  if(polje_3.textContent==istina){
    polje_3.classList.add('correct-answer');
  }else{
    polje_3.classList.add('incorrect-answer');
  }
  //za prikaz promene rezultata
  Skladiste.promeniPrikazujeSeRez();
 
  //stopira timer
  clearInterval(timerInterval);
  //resetovanje zvuka timer-a
  zvuk_timer.pause();
  zvuk_timer.currentTime = 0;

}


function userHasAnswered(selected){
	if (userHasAlreadyAnswered){
		console.log("User has already answered the question.");	
		return;
	}
	
	userHasAlreadyAnswered = true;
	window.removeEventListener('keydown', questionKeydown);

	let stopTheQuiz = answeredIncorrectly;
	changeDirection.value = '-';
	if (selected === props.pitanjeInfo.tacanOdgovor){
		stopTheQuiz = answeredCorrectly;
		changeDirection.value = '+';
		zvuk_tacan_odgovor.play();
	} else {
		zvuk_pogresan_odgovor.play();
	}
		
 	changeAmount.value = props.pitanjeInfo.tezinaPitanja;	
 		
      	//poziva se sa timeout-om da bi korisnik stigao da vidi
      	setTimeout(stopTheQuiz, TWO_SECONDS);
      	//vazno je da oba ova intervala ostanu ista
     	setTimeout(Skladiste.promeniPrikazujeSeRez, TWO_SECONDS); //za nestanak prikaza promene rez
     	showUserTheCorrectAnswer();
}


function answeredCorrectly(){
	const scoreChange = props.pitanjeInfo.tezinaPitanja;
	cleanupAfterQuiz();
	emits('answered', scoreChange);
}

function answeredIncorrectly(){
  const scoreChange = - props.pitanjeInfo.tezinaPitanja;
	cleanupAfterQuiz();
	emits('answered', scoreChange);
}


function cleanupAfterQuiz(){
	if (timerInterval){
		clearInterval(timerInterval);
	}
	window.removeEventListener('keydown', questionKeydown);
	questionIsActive.value = false;
}

function userPassedTheQuestion(){
  if (userHasAlreadyAnswered){
	console.log("User has already answered the question.");	
	return;
  }
	
  userHasAlreadyAnswered = true;
  
  window.removeEventListener('keydown', questionKeydown);
  
  if(timerInterval){
  	clearInterval(timerInterval)
  }
  zvuk_timer.pause();
  zvuk_timer.currentTime=0

  const scoreChange = - POINTS_FOR_WHICH_YOU_CAN_PASS_THE_QUESTION
  cleanupAfterQuiz();
  emits('answered', scoreChange);
}
</script>


<template>
<div class="quiz-wrapper">
    <div class="quiz-kontejner" :class="{quiz_phone_horizontal: isPhoneHorizontal}">
      	<div class="quiz-timer">{{ timer }}</div>
      	<div class="quiz-naslov" :class="{small_characters: isPhoneHorizontal && 
      	props.pitanjeInfo.pitanje.length >= MAX_CHARACTERS_AFTER_WHICH_WE_MAKE_THE_TEXT_SMALLER}">
      		{{ props.pitanjeInfo.pitanje }}
      	</div>
      	<div class="quiz-odgovori" 
      	:class="{quiz_answer_smaller_letters: isPhoneHorizontal && 
       	 	maxCharactersAnswer > CHARACTERS_PER_ANSWER_AFTER_WHICH_TEXT_IS_SMALLER,
       	 	answers_on_desktop: !isPhone}"
       >
       	
       	 <div v-for="(answer, index) in answersToShow" :key="index" 
       	 @touchend="userHasAnswered(answer)" @click="userHasAnswered(answer)" 
       	 	class="quiz-odgovor stylish-answer" :class="{answer_in_focus: index === answerInFocus}">{{ answer }}
       	 </div>
       	 		
       	 <div v-if="passingQuestionAllowed()"
        	  @touchend="userPassedTheQuestion()"
      		   @click="userPassedTheQuestion" class="quiz-odgovor stylish-answer" 
      		   :class="{answer_in_focus: answersToShow.length === answerInFocus}">Preskoci pitanje (-{{ POINTS_FOR_WHICH_YOU_CAN_PASS_THE_QUESTION }} )
          	</div>
     	</div>
      	<div v-if="Skladiste.prikazujeSeRez" class="rezPromena stylish-score">
       	Score {{ changeDirection }} <span class="promena">{{ changeAmount }}</span>
      	</div>
    </div>
</div>
</template>


<style scoped>
  /* Quiz View Overlay stilovi */
  .quiz-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.quiz-kontejner {
  background-color: white;
  color: #ffffff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  text-align: center;
  z-index: 7;
  min-width: 50%;
  max-width: 50%;
}

.quiz_phone_horizontal{
	display: flex;
	flex-direction: row;
}

.quiz-timer {
  font-size: 24px;
  margin-bottom: 10px;
  color:  #2a2a2a;
}

.quiz-naslov {
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 20px;
  color:  #2a2a2a
}

.quiz-odgovor {
  background-color: #4caf50;
  color: #ffffff;
  padding: 10px 20px;
  margin: 10px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;
}

.quiz_answer_smaller_letters{
	font-size: 0.5em;
}

@media(max-width:768px){
  .quiz-naslov{
    font-size: 24px;
  }
}

.small_characters{
  font-size: 18px;
}

.rezPromena {
  font-size: 20px;
  margin-top: 20px;
}

.stylish-answer {
  background-color: #007bff;
}

.stylish-score {
  color: #ffc107;
}

  
::-webkit-scrollbar{
  width: 0.5em;
}

.correct-answer {
  background-color: green;
}

.incorrect-answer {
  background-color: red;
}

.answers_on_desktop > *{
	border-style: solid;
	border-width: 1vh;
	border-color: white;
}

.answers_on_desktop > .answer_in_focus{
	border-color: yellow;
}

</style>
