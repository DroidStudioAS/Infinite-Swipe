<!-- -->
<template>
    <div class="klasa-igrica">
    	<div class="animated-background">
    		<div v-for="(oblak, index) in backObjects" :key="index" class="">
      			<img :src="oblak.slika" :style="oblak.css()" class="oblak"/>
    		</div>

    	</div>
	  	<div v-for="(prepreka, index) in preprekaAdapter?.prepreke" :key="index" class="roditelj-prepreke">    
		    	<img
		      	:src="prepreka.slika"
		      	:style="prepreka.css()" 
		      	alt="prepreka"
		      	class="klasa-prepreka"
		    	/>
		</div>
	
		<img :src="igrac.slika" 
		:style = "igrac.css()"
		alt="igrac" 
		class="klasa-igrac" />
    </div>
    
    
    <div v-if="!nijePauziran">
    	<pauza-component @nastavi-igru="nastaviIgru()" @prekini-igru="pauzaPrekinulaIgru()" class="klasa-pauza" 
    	:displaySave="!Skladiste.playingCampaign" :livesRemaining="Skladiste.livesRemaining"/>
    </div> 
    <div v-else-if="isMobile  && questionIsNotBeingAsked && weAreNotInTheBeforeQuestionPhase" class="mobile_pause">
    	<button @touchend="pauzirajIgru">Pauziraj</button>
    </div> 

  <div class="scoreContainer">
    <div class="score-display" >Skor: {{ score }}</div>
  </div>

   <!-- Quiz View Overlay -->
   <question-component class="quiz-element" v-if="kvizZapocet"  @answered="questionIsOver" :pitanjeInfo="nextQuestion"/>
 
 
  <!--Ne dirajte ovo ispod. -->
  <img src="" alt="sakriven" :style="{left: sakrivenXodLevo + 'px', bottom: '20px', width: '10px', height: '10px', opacity: '0'}"/>
  
 
  </template>
  
  <script setup>
  import { onMounted, onBeforeMount, ref, reactive, computed, defineEmits, onBeforeUnmount, watch } from "vue";
  import { useRouter } from 'vue-router';
  import { gsap } from "gsap";
  import PauzaComponent from '../components/PauzaComponent.vue'
  import intervali from '../models/intervali';
  import Character from "../models/karakter";
  import QuestionComponent from '../components/QuestionComponent.vue'
  import Prepreke from '../models/preprekaRoditelj';
  import pomagacPitanja from "../mrezniPomagaci/pomagacPitanja";
  import PitanjeInfo from "../models/pitanja/pitanjeInfo";
  import mobileHelper from '../models/mobileHelper';
  import pomagacLeaderboard from '../mrezniPomagaci/pomagacLeaderboard';
  import resultHelper from '../mrezniPomagaci/resultHelper.js';
  
  import PreprekaAdapter from '../models/preprekaAdapter';
  import animacijaInterfejs from "../animacije/animacijaInterfejs";
  import { createApp } from 'vue'
  import { createPinia } from 'pinia'
  import { useSkladiste } from '../stores/Skladiste';
  import axios from "axios";

  import BackgroundTrack from "../models/BackgroundTrack";

  const Skladiste = useSkladiste();
  const router = useRouter();
  
  const isMobile = ref(mobileHelper.isMobile());
  
  let touchStartTime; 

/* Ne dirajte ovo. */
  const sakrivenXodLevo = ref(10);
      
  const nismoJosIzgubili = ref(true);    
  const slikaBombe = "/graph_bomba.png";
  const slikaZvezde = "/graph_zvezda.png";
  const slikaPitanja = "/graph_upitnnik.png";
  let slikaIgraca = Skladiste.getCharacterImage();
  const X_DIRECTION_DESNO = 1;
  const X_DIRECTION_LEVO = -1;
  
  const sizePrepreke = Skladiste.getObstacleSize();
  const preprekaAdapter = ref(new PreprekaAdapter([], "/graph_bomba.png", "/graph_zvezda.png", "/graph_upitnnik.png"));

  const nijePauziran = ref(true);
  const weAreNotInTheBeforeQuestionPhase = ref(true);

  const emits = defineEmits(['gameOver']);
  //ZVUKOVI
  const nullAudio = new Audio('');
  const zvuk_tacan_odgovor = new Audio('/zvuk_tacan_odgovor.wav');
  const zvuk_pogresan_odgovor = new Audio('/zvuk_pogresan_odgovor.wav');
  const zvuk_timer = new Audio('/zvuk_timer.wav');
  const zvuk_skok = new Audio('/zvuk_skok.wav');

  //spring krece prvi da svira
  const backgroundSound = new BackgroundTrack('background', nullAudio);

  //QUIZ VARIJABLE
  let sirova_pitanja = [];
  const kvizZapocet = ref(false);
  const questionIsNotBeingAsked = computed(() => !kvizZapocet.value);
  let modelovana_pitanja = ref([]);
  let id_pitanja_koja_su_bila = [];
  const broj_odgovora = 3;
  
  const nextQuestion = ref(null);

  //for campaign
  let correctCount = 0;
 
 //SCORE VARIABLE 
  const score = ref(0);


  let elapsedTime=0;
  let startTime = Date.now();
  let vremeInterval = undefined;
  
  let intervalDiagonalObstacles = null;
  let intervalVerticalObstacles = null;
  
  //BACKGROUND LOGIC VARIABLES
  let seasonIndex=-1;

  let colorIndex =0;
  const backgroundColors = [
  // day
  "#3d90cd",
  // 8 gradient shades
  "#3672b6",
  "#3063a0",
  "#295589",
  "#224772",
  "#1b395b",
  "#142b44",
  // night
  "#0e1c25"
];
let isDusk = false;
  //background intervals
  let backgroundInterval = null;
  let secondBackgroundInterval = null;


 
  //KOD ZA PRALJENJE IGRACA
  const sirinaIgraca = Skladiste.getCharWidth();
  const visinaIgraca = Skladiste.getCharHeight();
  const sredinaMogucegSpanovanjaIgraca = (window.innerWidth - sirinaIgraca) / 2;

/* - deltaY = (1/2) * gAcceleration * time^2 
   gAcceleration = - 2 * deltaY / time^2
  Minus stoji jer objekat pada na dole.
*/
  const jumpDeltaYRelative = 0.39;
  const timeSpentJumpingInSeconds = 0.25;
  const gAcceleration = gAccelerationBasedOnScreenHeight();
  console.log("window.screen.height: " + window.screen.height);

  const igrac = new Character({
  	xOdLevo: sredinaMogucegSpanovanjaIgraca, 
  	yOdDna: 0, sirina: sirinaIgraca, visina: visinaIgraca, 
  	slika: slikaIgraca, 
  	relativePictureHeight: Skladiste.relativePictureHeight,
  	xDirection: X_DIRECTION_DESNO, 
  	scoreRef: score, 
  	obradilacPitanja: {obradiPitanje: obradiPitanje}, 
  	gameOverInterfejs: {funkcijaGameOver: gameOver},
	gAcceleration: gAcceleration,
  });

  let brojPrepreka = 0;

  const backObjects = ref([]);
  /********************Char unlocked array*******************/
  let setsUnlocked = [false,false,false];
  
  /***********************calculating gAcceleration*******************************/
  /* - deltaY = (1/2) * gAcceleration * time^2 
   gAcceleration = - 2 * deltaY / time^2
  Minus stoji jer objekat pada na dole.
*/
  function gAccelerationBasedOnScreenHeight(){
  	
  	const jumpDeltaY = getHowMuchItJumps();
  	const gAcceleration = - 2 * jumpDeltaY / (timeSpentJumpingInSeconds * timeSpentJumpingInSeconds);
  	return gAcceleration;  
  }
  
  function getHowMuchItJumps(){
  	return window.innerHeight * jumpDeltaYRelative;
  }
  
  function updateWindowHeight(){

  }

  /***********************Funkcije pauziraj/nastavi i gameOver ********************/

  function makeIntervalsThatMakeObstacles(){
  	if (intervalDiagonalObstacles != null){
  		clearInterval(intervalDiagonalObstacles);
  	}
  	if (intervalVerticalObstacles != null){
  		clearInterval(intervalVerticalObstacles);
  	}
  	
  	 intervalDiagonalObstacles = intervali.napraviInterval(() => {
  		// Uhvatimo length
 	 	brojPrepreka = Skladiste.brojPrepreka;
 		if (Skladiste.brojPrepreka<= Skladiste.maxNumberOfObstacles) {

    /* npr. bombWeight: 3, starWeight: 1 znaci da je tri puta veca sansa da se stvori bomba nego zvezda. 
    bombWeight: 4, questionWeight: 3 bi znacilo da je odnos sanse da se stvori bomba i da se stvori pitanje 4 prema 3. Tj. 
    na svake 4 stvorene bombe se stvore 3 pitanja. */
			for(let i=0; i<Skladiste.diagonalObstaclesAtOnce; i++){
			    	preprekaAdapter.value.makeWeightedRandomObstacle({
	    			bombWeight: Skladiste.bombWeightDiagonal, 
	    			questionWeight: Skladiste.questionWeightDiagonal, 
	    			starWeight: Skladiste.starWeightDiagonal, 
    		
	    			obstacleWidth: sizePrepreke, obstacleHeight: sizePrepreke,
	    			windowWidth: window.innerWidth, windowHeight: window.innerHeight, 
	    			minPeriodInSeconds: Skladiste.diagonalMinFallPeriodInSeconds,
	    			maxPeriodInSeconds: Skladiste.diagonalMaxFallPeriodInSeconds
	   	 		});
	    		 }
    
	    		 console.log("br: " + brojPrepreka);
  		}
	}, Skladiste.diagonalObstacleSpawnIntervalInMiliseconds, 
	[nijePauziran, nismoJosIzgubili, questionIsNotBeingAsked, weAreNotInTheBeforeQuestionPhase]);  


  	intervalVerticalObstacles = intervali.napraviInterval(() => {
  		brojPrepreka = Skladiste.brojPrepreka;
   		if (Skladiste.brojPrepreka <= Skladiste.maxNumberOfObstacles) {
    			for (let i=0; i<Skladiste.verticalObstaclesAtOnce; i++){  
   
  		 		preprekaAdapter.value.makeWeightedRandomObstacleHorizontalFall({
   	 
    					bombWeight: Skladiste.bombWeightVertical, 
    					questionWeight: Skladiste.questionWeightVertical, 
    					starWeight: Skladiste.starWeightVertical,
    		 
    					obstacleWidth: sizePrepreke, obstacleHeight: sizePrepreke,
    					windowWidth: window.innerWidth, windowHeight: window.innerHeight, 
    					minPeriodInSeconds: Skladiste.minVerticalFallPeriodInSeconds,
    					maxPeriodInSeconds: Skladiste.maxVerticalFallPeriodInSeconds
    				});
    			}
    
   	 	console.log("br: " + brojPrepreka);
   		}
   	},   Skladiste.verticalObstacleSpawnIntervalInMiliseconds, 
	[nijePauziran, nismoJosIzgubili, questionIsNotBeingAsked, weAreNotInTheBeforeQuestionPhase]);  
  	
  }
  
  watch(score, (newScore, oldScore) => {
  	if (Skladiste.playCampaign){
  		return;
  	}
  	
  	const changeHappened = Skladiste.updateGameToughness();
  	if (changeHappened){
  		makeIntervalsThatMakeObstacles(); 
  	}

  });
  
  function nastaviIgru(){
    if (kvizZapocet.value){
    	return; /* Ne moze se nastaviti sa igricom ako se odgovara na pitanje. */
    }
    igrac.nastaviOdSacuvanogStanja();
    
    nijePauziran.value = true;
    animacijaInterfejs.nastaviAnimacije();
    Skladiste.setNijePauziran(nijePauziran.value);
    resumeEllapsedTime();
    backgroundSound.play();
    
  
  }

  function pauzirajIgru(){
    igrac.saveMovingStateAndStop();
    animacijaInterfejs.pauzirajAnimacije();
    nijePauziran.value = false;
    Skladiste.setNijePauziran(nijePauziran.value);
    //Important! This is so the background objects dont pile up while paused
    pauseEllapsedTime();
    backgroundSound.pause();
     
  }
  
  async function pauzaPrekinulaIgru(){
  	nastaviIgru();
  	await gameOver();
  }
  
  async function gameOver(){
    if (Skladiste.playingCampaign){
    	await levelOver();
    	return;
    }
    //OVDE KORISNIKU PRIKAZUJEMO REZ NJEGOVOG NIVOA;

    resetElapsedTime();
    nismoJosIzgubili.value = false;
    backgroundSound.pause();
    await pomagacLeaderboard.insertNoviScore(Skladiste.score, Skladiste.currentGameId);
    Skladiste.changeGameIsOver(true);
    
    console.log("localStorage.getItem('username'): " + localStorage.getItem("username"));
    console.log("Skladiste.score: " + Skladiste.score);
    console.log("game over iz gameOver" + Skladiste.gameIsOver);
    
    await Skladiste.reset();

    clearInterval(backgroundInterval);
    clearInterval(secondBackgroundInterval);
    
    router.push({name: 'krajIgre'});
  }
  
  async function levelOver(){
  	
  	resetElapsedTime();
    	nismoJosIzgubili.value = false;
    	backgroundSound.pause();
    	//await resultHelper.sendCampaignResult();
    	Skladiste.changeGameIsOver(true);
      //Skladiste.setEntireCampaignResult(Skladiste.campaignResults);
      
	clearInterval(backgroundInterval);
	clearInterval(secondBackgroundInterval); 
       	
      if(correctCount<=Skladiste.prevScore){
        console.log("score is: smaller")
        //old score larger, do nothing
                                     
        await Skladiste.reset(); 
      	router.push({name: 'levels'});
      }else{
        console.log("score is: larger")
        //new score larger then old
      	await resultHelper.sendCampaignResult();
    
    	console.log("localStorage.getItem('username'): " + localStorage.getItem("username"));
    	console.log("Skladiste.score: " + Skladiste.score);
    	console.log("game over iz gameOver" + Skladiste.gameIsOver);

   	clearInterval(backgroundInterval);
     	clearInterval(secondBackgroundInterval); 
                                      
        await Skladiste.reset();
     	router.push({name: 'levels'});
      }
  }
  
  function igrajPonovo(){
  	reset();
  	Skladiste.reset();
  	igrac.stopHorizontally();
  	nastaviIgru();
    	changeBackground();
  }
  
  function reset(){
  	sirova_pitanja = [];
  	modelovana_pitanja = [];
  	id_pitanja_koja_su_bila = [];
  	backObjects.value = [];
  	preprekaAdapter.value.izbaciSvePrepreke();
  	nijePauziran.value = true;
  	nismoJosIzgubili.value = true;
    	Skladiste.changeGameIsOver(false);
    	correctCount=0;
    	console.log("game over iz reset" + Skladiste.gameIsOver)
  }
  
  function resetAndPullDataFromStore(){
  	reset();
  	id_pitanja_koja_su_bila = Skladiste.id_koje_necu;
  	console.log("typeof(Skladiste.id_koje_necu: " + typeof(Skladiste.id_koje_necu));
  	score.value = Skladiste.score;
  	console.log("typeof(Skladiste.score): " + typeof(Skladiste.score));
  }
  /**********************************KVIZ LOGIKA (obradiPitanje() je glavno mesto desavanja)*********************************************/
 
 //CENTRALNA F-JA ZA KVIZ
  async function obradiPitanje(){

    zapocniKviz();

    //dolazimo do sirovih pitanja
    if(sirova_pitanja.length===0 || sirova_pitanja==null){
      //OVDE SE POZIVAJU PITANJA  
      if (Skladiste.playingCampaign){
        const campaignCategories = Skladiste.campaignCategories;
      	sirova_pitanja = await pomagacPitanja.dohvatiVisePitanja(Skladiste.campaignNumOfQuestions, campaignCategories);
      } else {
      	sirova_pitanja = await pomagacPitanja.dohvatiVisePitanja(5,["his","sp","sci", "mov","mus","gk"]);
      }
      modelovana_pitanja.value = pomagacPitanja.mapirajPitanja(sirova_pitanja);
      updateNextQuestion();
    }
    
    console.log("pogresan odgovor 1: " + modelovana_pitanja.value[0].pogresniOdgovor1)
    for(let y of modelovana_pitanja.value){
      console.log(y);
    }
    /******************AKTIVIRAJ KVIZ KOMPONENTU *****************/
    kvizZapocet.value = true;  
    console.log("duzina:" + sirova_pitanja.length);
    Skladiste.setIstina(modelovana_pitanja.value[0].tacanOdgovor);
 
  }


  function questionIsOver(scoreChange){
  	score.value += scoreChange;
    //this block it to count how many correct awnsers the user has
    console.log("vazno",Skladiste.playingCampaign, scoreChange)
    if(Skladiste.playingCampaign){
      if(scoreChange>0){
        correctCount+=1;
        console.log("cc", correctCount);
      }
    }
  	Skladiste.setScore(score.value);
    	console.log("score iz skladista: " + Skladiste.score);
    
    	if(modelovana_pitanja!=null){
    		if (!id_pitanja_koja_su_bila.includes(sirova_pitanja[0].id)){
    			id_pitanja_koja_su_bila.push(sirova_pitanja[0].id);
    			Skladiste.setIdKojeNecu(id_pitanja_koja_su_bila);
    		}
      		sirova_pitanja.splice(0,1);
     		modelovana_pitanja.value.splice(0,1);
     		updateNextQuestion();
      		console.log("sirovih pitanja ostalo: " + sirova_pitanja.length);
      		console.log("modela pitanja ostaloL " + modelovana_pitanja.value.length);
    	}
    	zaustaviKviz();
  }
  
  
  function zapocniKviz(){
    if(Skladiste.gameIsOver){
      return;
    }
    window.removeEventListener('keydown',keydownHandler);
    window.removeEventListener('touchstart', onTouchStart);
    window.removeEventListener('touchend', onTouchEnd);
    
    weAreNotInTheBeforeQuestionPhase.value = false;
    igrac.saveMovingStateAndStop();
    animacijaInterfejs.pauzirajAnimacije();
    
    console.log("game over: " + Skladiste.gameIsOver);
  }
  
  function zaustaviKviz(){
    weAreNotInTheBeforeQuestionPhase.value = true;
    kvizZapocet.value=false;
    
    igrac.nastaviOdSacuvanogStanja();
    animacijaInterfejs.nastaviAnimacije();

    window.addEventListener('keydown',keydownHandler);
    window.addEventListener('touchstart', onTouchStart);
    window.addEventListener('touchend', onTouchEnd);
    //THIS WILL BE THE LEVEL END
    //automatically updates the res,
    //once there are no more questions
    if(Skladiste.playingCampaign){
    /*Ovo za sada samo kao demo stoji. Ovo treba da bude u if-u kad nema vise modelovanih pitanja. */
    Skladiste.setCampaignResult(Skladiste.categoryIndex
                                    ,Skladiste.levelIndex,
                                    correctCount); 
    Skladiste.printCampaignResults();
      if(modelovana_pitanja.value.length===0)
      		levelOver();
      }
    } 
    //gameOver()
   
  

 
  
  function updateNextQuestion(){
  	if (modelovana_pitanja.value !== null && modelovana_pitanja.value !== undefined && modelovana_pitanja.value.length > 0){
  		nextQuestion.value = modelovana_pitanja.value[0];
  	}
  }
  
 /****SADA SLEDI ELAPSED INTERVAL *************************************************************************/

function updateElapsedTime() {
  elapsedTime = Math.floor((Date.now() - startTime) / 1000);
  console.log("elapsed time: " + elapsedTime);
  //debug interval
 // if (elapsedTime % 30 === 0) {
  //actual interval 
 if (elapsedTime % 160 === 0) {
    changeSeason()
  }
  //promena dan noc
  if(elapsedTime%10 === 0){
    changeDayNight()
  }
}
function pauseEllapsedTime(){
  clearInterval(vremeInterval);
};

function resumeEllapsedTime () {
  startTime = Date.now() - (elapsedTime * 1000);
  vremeInterval = setInterval(updateElapsedTime, 1000);
};

function resetElapsedTime(){
    clearInterval(vremeInterval);
    elapsedTime=0; 
    console.log("time played: " + elapsedTime);
}
  /******************************KRAJ KVIZ LOGIKE*******************************/
  function loggerForLevels(){
    console.log("Skladiste Level Vars")
    console.log("Bomb Weight: " + Skladiste.bombWeight + " Star Weight: " + Skladiste.starWeight +
                " Question Weight: " + Skladiste.questionWeight + " Categories: " + Skladiste.categories
                + " Num Of Questions: " + Skladiste.numOfQuestions);
  }
  /* SADA SLEDE INTERVALI **********************************************************************************************/
  /* Da bi se updejtovao template.*/
    onBeforeMount(() => gsap.to(sakrivenXodLevo, {
    value: 1,
    repeat: -1,
    duration: 10,
    yoyo: true
  }),
  );
 
  

onMounted(() => onMountedFunction());

async function onMountedFunction(){
	console.log("\nStart game\n");
	
	await Skladiste.resetIfCurrentGameIdIsNull();
	resetAndPullDataFromStore();
	animacijaInterfejs.nastaviAnimacije(); /* Za slucaj da smo izasli iz igrice dok su bile pauzirane animacije. */  
	
	if (Skladiste.livesRemaining <= 0){
  		gameOver();
  	}
  	
  //hvatanje pocetnog vremena igranja
	const startTime = Date.now();
	vremeInterval=setInterval(updateElapsedTime,JEDNA_SEKUNDA);
	Skladiste.updateGameToughness();
	makeIntervalsThatMakeObstacles();
  
  	console.log('hs: ' + Skladiste.highScore)
	changeSeason();
  	changeDayNight();
	setInterval(() => cutBackgroundObjects(), JEDNA_SEKUNDA);
  	charSetSetter()
  	loggerForLevels();
}

  
  const JEDNA_SEKUNDA = 1000;
  const BROJ_FREJMOVA_PO_SEKUNDI = 60;
  const VREME_JEDNOG_FREJMA = JEDNA_SEKUNDA / BROJ_FREJMOVA_PO_SEKUNDI;
  const DVE_SEKUNDE = 2000;

setInterval(planeAnimator,JEDNA_SEKUNDA);
  
  intervali.napraviInterval(() => {
  	preprekaAdapter.value.proveriSudar(igrac);
  }, VREME_JEDNOG_FREJMA, [nijePauziran, nismoJosIzgubili, questionIsNotBeingAsked, weAreNotInTheBeforeQuestionPhase]); 
 

   intervali.napraviInterval(() => {
   	igrac.updatePositionAndMovement({
   		windowWidth: window.innerWidth, 
   		windowHeight: window.innerHeight, 
   		framesPerSecond: BROJ_FREJMOVA_PO_SEKUNDI,
   		gAcceleration: gAccelerationBasedOnScreenHeight()
   	});
   }, VREME_JEDNOG_FREJMA, [nijePauziran, nismoJosIzgubili, questionIsNotBeingAsked, weAreNotInTheBeforeQuestionPhase]);
  

  intervali.napraviInterval(() => preprekaAdapter.value.izbaciPreprekeKojeNisuNaEkranu(window.innerWidth, window.innerHeight), 
  JEDNA_SEKUNDA, [nijePauziran, nismoJosIzgubili, questionIsNotBeingAsked, weAreNotInTheBeforeQuestionPhase]);
   
 
  
/* EVENT ************************************************************************************************************** */
const keydownHandler = (event) => {
  if (kvizZapocet.value === true || !nijePauziran.value === true) {
    return;
  }
  
  if (event.key === 'ArrowLeft' || event.key === 'a') {
    event.preventDefault();
    igrac.moveLeft(preprekaAdapter.value, window.innerWidth, window.innerHeight);
  } else if (event.key === 'ArrowRight' || event.key === 'd') {
    event.preventDefault();
    igrac.moveRight(preprekaAdapter.value, window.innerWidth, window.innerHeight);
  } else if (event.key === ' ') {
    event.preventDefault();
    zvuk_skok.play();
    igrac.jump(preprekaAdapter.value, getHowMuchItJumps());
  } else if (event.key === 'ArrowDown' || event.key === 's') {
    event.preventDefault();
    igrac.stopHorizontally();
  } else if (event.key === 'p' || event.key === 'Escape') {
    if (nijePauziran.value) {
      pauzirajIgru();
    } else {
      nastaviIgru();
    }
  }
};
let startY = 0;
//touch screen handlers
const onTouchStart = (event) => {
  event.preventDefault();
   if (kvizZapocet.value === true || !nijePauziran.value === true) {
    return;
  }

  // Record the timestamp when touch starts
  touchStartTime = Date.now();
  startY = event.touches[0].clientY;
};

const onTouchEnd = (event) => {
  event.preventDefault();
   if (kvizZapocet.value === true || pauzirajIgru.value === true) {
    return;
  }

  const touchX = event.changedTouches[0].clientX;
  const touchY = event.changedTouches[0].clientY;

  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  const middleX = screenWidth / 2;

  // Calculate the time difference between touchstart and touchend
  const touchDuration = Date.now() - touchStartTime;
  
  
  const minWindowSize = Math.min(window.innerWidth, window.innerHeight);
  const minDistanceToTriggerJump = minWindowSize / 10;
  const minDistanceToTriggerStop = minWindowSize / 10;

  // Calculate the vertical distance of the swipe
  const swipeDistanceY = startY - touchY;
  console.log(swipeDistanceY)
  if (swipeDistanceY > minDistanceToTriggerJump) {
    // Trigger jump on a quick swipe up
    console.log("Jump detected");
    zvuk_skok.play(); // Ensure this works as intended
    igrac.jump(preprekaAdapter.value, getHowMuchItJumps());
  } else if (swipeDistanceY < -minDistanceToTriggerStop) {
    // Trigger stop horizontally on a swipe down
    console.log("Swipe down detected");
    event.preventDefault(); // Only prevent default if necessary
    igrac.stopHorizontally();
  } else if (touchX < middleX) {
    console.log("Swipe left detected");
    igrac.moveLeft(preprekaAdapter.value, screenWidth, screenHeight);
  } else {
    console.log("Swipe right detected");
    igrac.moveRight(preprekaAdapter.value, screenWidth, screenHeight);
  }
};

window.addEventListener('keydown', keydownHandler);
//Touch screen listeners
window.addEventListener('touchstart', onTouchStart);
window.addEventListener('touchend', onTouchEnd);
window.addEventListener('resize', updateWindowHeight);
console.log('taptap');

onBeforeUnmount(()=> {
    window.removeEventListener('keydown',keydownHandler);
    window.removeEventListener('touchstart', onTouchStart);
    window.removeEventListener('touchend', onTouchEnd);
    window.removeEventListener('resize', updateWindowHeight);
    if (intervalDiagonalObstacles !== null){
    	clearInterval(intervalDiagonalObstacles);
    }
    if (intervalVerticalObstacles !== null){
    	clearInterval(intervalVerticalObstacles);
    }
});



  /****************************KOD ZA GENERISANJE POZADINE*******************************/

function cutBackgroundObjects() {
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  for (let i = backObjects.value.length - 1; i >= 0; i--) {
    const backgroundObject = backObjects.value[i];

    if (backgroundObject.isOutsideOfTheScreenBackground(screenWidth, screenHeight)){
    	console.log('Object left the screen:', backgroundObject);
        backObjects.value.splice(i, 1);
    }
  }
}



const generateBackgroundObjects = (source, numOfObjects, min_height, min_width, direction = 0) => {
  if(Skladiste.nijePauziran!=true){
    return;
  }
  console.log("ALOOOOOOOO");
  for (let i = 0; i < numOfObjects; i++) {
    backObjects.value.push(backgroundObjectFactory(source, min_height, min_width, direction));
  }
};

const backgroundObjectFactory = (source, minHeight, minWidth, direction = 0) => {
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const objectWidth = minWidth;
  const objectHeight = minHeight;
  const duration = 5 + Math.random() * 5;

  const backgroundObject = Prepreke.newPrepreka(0, 0, objectWidth, objectHeight, source, 0, 0);

  if (direction === -1) {
    const spawnSide = Math.random() < 0.5 ? 'left' : 'right';
    if (spawnSide === 'left') {
      backgroundObject.xOdLevo = -objectWidth;
    } else {
      backgroundObject.xOdLevo = screenWidth;
    }
    backgroundObject.yOdDna = Math.random() * (screenHeight - backgroundObject.visina);
    
    gsap.to(backgroundObject, {
      xOdLevo: spawnSide === 'left' ? screenWidth : -objectWidth,
      duration: duration,
      ease: 'linear'
    });
  } else {
    backgroundObject.randomizujPrepreku(screenWidth, screenHeight);

    gsap.to(backgroundObject, {
      yOdDna: -backgroundObject.visina,
      xOdLevo: backgroundObject.xOdLevo,
      duration: duration,
      ease: 'linear'
    });
  }

  return backgroundObject;
};

function changeDayNight() {

  console.log("our index: " + colorIndex + " Colors Length: " + backgroundColors.length);
  document.body.style.backgroundColor = backgroundColors[colorIndex];
  if(colorIndex===8){
      isDusk=true;
      console.log("is dusk" + isDusk)
    }
  if(colorIndex===0){
    isDusk=false;
      console.log("is dusk" + isDusk)
  }

  if(!isDusk){
    colorIndex+=1;
  }else{
    colorIndex-=1;
  }

}



function changeSeason(){
  const sound_spring = new Audio('/sound_spring.mp3');
  const sound_rain = new Audio  ('/zvuk_rain.wav');
  const sound_waves = new Audio ('/sound_waves.wav');
  const sound_snow = new Audio  ('/sound_snowflakes.wav');
  if(seasonIndex<3){   
    clearInterval(backgroundInterval);
    clearInterval(secondBackgroundInterval);
    //spring
    if(seasonIndex ===-1){
      backgroundInterval = setInterval(() => {
        generateBackgroundObjects('/back_cloud_1.png', 4, 200, 300);
        generateBackgroundObjects('/back_thunder_cloud.png', 1, 100, 100);
       },10000);
       secondBackgroundInterval = setInterval(()=>{
        generateBackgroundObjects('/back_cloud_2.png', 4, 250, 350);
     },6000);
    //BACKGROUND TRACK
    backgroundSound.changeSource(sound_spring);
    }else if(seasonIndex===0){
     /*summer*/
     backgroundInterval = setInterval(() => {
      generateBackgroundObjects('/back_kite.png', 2, 100, 100);
      generateBackgroundObjects('/back_skydiver.png', 1, 100, 100);
     },10000);
     secondBackgroundInterval = setInterval(()=>{
      generateBackgroundObjects('/back_birds.png', 1, 150, 200,-1);
     },6000);
    //BACKGROUND TRACK
     backgroundSound.changeSource(sound_waves);
    }else if(seasonIndex===1){
      /*Autumn*/
      backgroundInterval = setInterval(() => {
      generateBackgroundObjects('/back_leaf_1.png', 1, 150, 200);
      generateBackgroundObjects('/back_leaf_2.png', 1, 100, 100);
      generateBackgroundObjects('/back_rainy_cloud.png', 2, 100, 100);
    },13000);
    secondBackgroundInterval = setInterval(()=>{
      generateBackgroundObjects('/back_rain_03.png', 1, window.innerHeight, window.innerWidth);
     },10000);
    //BACKGROUND TRACK
     backgroundSound.changeSource(sound_rain);
    }else if(seasonIndex===2){
      backgroundInterval = setInterval(() => {
      generateBackgroundObjects('/back_snowflake_1.png', 5, 130, 130);
      generateBackgroundObjects('/back_snowflake_2.png', 5, 100, 100);
    },7000);
    secondBackgroundInterval = setInterval(()=>{
      generateBackgroundObjects('/back_santa.png', 1, 150, 200,-1);
     },14000);
    //BACKGROUND TRACK
     backgroundSound.changeSource(sound_snow)

    }
    //change the background
    seasonIndex+=1 
  }
  if(seasonIndex===3){
    seasonIndex=-1;
  }
}
function planeAnimator(){
  console.log('okinuto')
  if(setsUnlocked[0]===false){
    if(Skladiste.score>=100 && Skladiste.score<150){
      animateCharPlane('/back_char_unlocked.png');
      setsUnlocked[0]=true
    }
  }else if(setsUnlocked[1]===false){
    if(Skladiste.score>=150 && Skladiste.score<200){
      animateCharPlane('/back_char_unlocked.png');
      setsUnlocked[1]=true
    }
  }else if(setsUnlocked[2]===false){
    if(Skladiste.score>=200){
      animateCharPlane('/back_char_unlocked.png');
      setsUnlocked[2]=true
    }
  }

  setLogger();
  
}

const animateCharPlane = (source) => {
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  const objectWidth = 300; // Adjust the object width as needed
  const objectHeight = 200; // Adjust the object height as needed

  const duration = 5 + Math.random() * 5;

  const charPlane = document.createElement('img');
  charPlane.src = source;
  charPlane.style.position = 'absolute';
  charPlane.style.width = `${objectWidth}px`;
  charPlane.style.height = `${objectHeight}px`;

  document.body.appendChild(charPlane);

  const initialX = screenWidth;
  const initialY = Math.random() * (screenHeight - objectHeight);

  gsap.fromTo(
    charPlane,
    { x: initialX, y: initialY },
    {
      x: -objectWidth,
      duration: duration,
      ease: 'linear',
      onComplete: () => {
        document.body.removeChild(charPlane);
        
      }
    }
  );
};

function  charSetSetter(){
  if(Skladiste.highScore>=100 && Skladiste.highScore<150){
    setsUnlocked[0]=true;
  }else if( Skladiste.highScore>=150 && Skladiste.highScore<200) {
    setsUnlocked[0]=true;
    setsUnlocked[1]=true;
  }else if(Skladiste.highScore>=200){
    setsUnlocked[0]=true;
    setsUnlocked[1]=true;
    setsUnlocked[2]=true;
  }
  for(let x of setsUnlocked){
    console.log(x)
  }
}
function setLogger (){
  for(let x of setsUnlocked){
    console.log(x)
  }
}

 /****************************KOD ZA GENERISANJE POZADINE KRAJ*******************************/


  </script>
  
  
  <style>
 
  body{
    overflow: hidden;
  }
  ::-webkit-scrollbar{
    width: 0.5em;
  }

  .oblak{
  	position: absolute;
  	z-index: 0;
  }

  .oblak  img {
  max-width: 100%;
  height: auto;
}
  .klasa-igrica{
  	z-index: 0;
  }
  
  .klasa-prepreka{
  	position: absolute;
  }
  .klasa-igrac{
  	position: absolute;
  }
  
  .klasa-pauziran{
  	position: absolute;
  	z-index: 4;
  	margin: auto;
  	min-width: 300px;
  	min-height: 200px; 
  }
  .scoreContainer {
    position: absolute;
    top: 10px;
    left: 10px; 
    background-color: rgba(0, 0, 0, 0.5); 
    padding: 5px 10px; 
    border-radius: 5px; 
    z-index: 2; 
  }
  .score-display {
    color: white;
    font-size: 16px;
    margin: 0; 
  }


.stylish-score {
  color: #ffc107;
}

  
::-webkit-scrollbar{
  width: 0.5em;
}

.mobile_pause{
	position: absolute;
	right: 10px;
	top: 10px;
}
  </style>
  
