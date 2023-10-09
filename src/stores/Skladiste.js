import { defineStore } from 'pinia';
import localStorageHelper from '../models/localStorageHelper.js';
import resultHelper from '../mrezniPomagaci/resultHelper.js';

const localStoragePlayingCampaignSufix = "playingCampaing";
function getPlayingCampaignKey(){
	return localStorageHelper.getPrefix() + localStoragePlayingCampaignSufix;
}

function getPlayingCampaignFromLocalStorage(){
	const key = getPlayingCampaignKey();
	const playingCampaignStringified = localStorage.getItem(key);
	
	if (playingCampaignStringified === null || playingCampaignStringified === undefined){
		return false;
	}
	
	const playingCampaign = JSON.parse(playingCampaignStringified);
	return playingCampaign === true;
}

function setPlayingCampaignInLocalStorage(trueFalse){
	const key = getPlayingCampaignKey();
	localStorage.removeItem(key);
	
	const stringified = JSON.stringify(trueFalse);
	localStorage.setItem(key, stringified);
}

function setLocalStorage(name, value){
	const key = localStorageHelper.getPrefix() + name;
	localStorage.removeItem(key);
	
	const stringified = JSON.stringify(value);
	localStorage.setItem(key, stringified);
}

function getLocalStorage(name){
	const key = localStorageHelper.getPrefix() + name;
	const stringified = localStorage.getItem(key);
	if (stringified === null || stringified === undefined){
		return null;
	}
	
	const value = JSON.parse(stringified);
	return value;
}

// Definišemo Pinia skladište koristeći defineStore funkciju.
export const useSkladiste = defineStore('skladiste', {
  // Stanje skladišta - ovde se definišu podaci koji će se čuvati.
  state: () => ({
    nijePauziran: true, // Početno stanje - igra nije pauzirana.
    brojPrepreka: 0, // Početno stanje - broj prepreka.
    id_koje_necu:[],
    score:0,
    startNumberOfLivesRemaining: 1,
    livesRemaining: 1,
    istina:null,
    prikazujeSeRez:false,
    slikaKaraktera: "/char_harold.png",
    relativePictureHeight: 1.0,
    gameIsOver:false,
    currentGameId:null,
    highScore:0,
    /************Vars for mobile vs pc**************/
    isUserOnMobile:false,
    obstacleSize:100,
    charHeight:100,
    charWidth:100,
    /**********Level Vars**************************************************************************************************/
    previousToughnessLevel: -1,
    previousDiagonalObstaclesAtOnce: -1,
    scoreWhenDiagonalObstaclesStart: 10,
    scoreIntervalAfterWhichWeMakeTheGameHarder: 12,
    basicMaxNumberOfObstacles: 5,
    
    basicBombWeightDiagonal:7,
    basicStarWeightDiagonal:9,
    basicQuestionWeightDiagonal:6,
    basicDiagonalObstaclesAtOnce: 1,
    basicDiagonalObstacleSpawnIntervalInMiliseconds: 3000,
    basicDiagonalMinFallPeriodInSeconds: 2,
    basicDiagonalMaxFallPeriodInSeconds: 5,
    
    basicBombWeightVertical: 4,
    basicStarWeightVertical: 3,
    basicQuestionWeightVertical: 3,
    basicVerticalObstaclesAtOnce: 1,
    basicVerticalObstacleSpawnIntervalInMiliseconds: 2000,
    basicMinVerticalFallPeriodInSeconds: 3,
    basicMaxVerticalFallPeriodInSeconds: 6,
    
    
    maxNumberOfObstacles: 5,
    
    calculatedVerticalObstacleSpawnIntervalInMiliseconds: 2000,
    
    campaignBombWeightVertical: 3,
    campaignBombWeightHorizontal: 3,
    campaignStarWeightVertical: 0,
    campaignStarWeightDiagonal: 0,
    campaignQuestionWeightVertical: 3,
    campaignQuestionWeightHorizontal: 3,
    campaignCategories: ['mus'],
    campaignNumOfQuestions: 20,
    
    playingCampaign:true,
    bombWeightDiagonal:6,
    starWeightDiagonal:9,
    questionWeightDiagonal:6,
    diagonalObstaclesAtOnce: 1,
    diagonalObstacleSpawnIntervalInMiliseconds: 3000,
    diagonalMinFallPeriodInSeconds: 1,
    diagonalMaxFallPeriodInSeconds: 4,
    
    bombWeightVertical: 4,
    starWeightVertical: 3,
    questionWeightVertical: 3,
    verticalObstaclesAtOnce: 1,
    verticalObstacleSpawnIntervalInMiliseconds: 2000,
    minVerticalFallPeriodInSeconds: 3,
    maxVerticalFallPeriodInSeconds: 6,

    numOfQuestions:5,
    campaignDifficulty:1,
    categories:["his","sp","sci", "mov","mus","gk"],

    categoryIndex:-1,
    levelIndex:-1,
    prevScore:-1,
    campaignResults:[
      [-1,-1,-1,-1,-1],
      [-1,-1,-1,-1,-1],
      [-1,-1,-1,-1,-1],
      [-1,-1,-1,-1,-1],
      [-1,-1,-1,-1,-1],
      [-1,-1,-1,-1,-1],
    ]

    }),
  // Akcije omogućavaju manipulaciju stanjem skladišta.
  actions: {
    // Metoda setNijePauziran menja vrednost atributa nijePauziran u skladištu.
    setNijePauziran(status) {
      this.nijePauziran = status; // Postavljamo vrednost atributa nijePauziran na novu vrednost.
    },
    // Metoda setBrojPrepreka menja vrednost atributa brojPrepreka u skladištu.
    setBrojPrepreka(vrednost) {
      this.brojPrepreka = vrednost; // Postavljamo vrednost atributa brojPrepreka na novu vrednost.
    },
    setIdKojeNecu(niz){
      this.id_koje_necu=niz;
    },
    setScore(rez){
      this.score=rez;
    },
    setLivesRemaining(value){
    	if (typeof(value) !== 'number' && typeof(value) !== 'Number'){
    		alert("Lives remaining koji se stavlja u skladiste nije tip Number.");
    	}
    	this.livesRemaining = value;
    },
    decreaseLivesRemaining(){
    	this.livesRemaining -= 1;
    },
    incrementScore(){
      this.score=this.score+1;
    },
    setRelativePictureHeight(value){
    	this.relativePictureHeight = value;
    },
    /**************Desktop vs mobile manipulators*****************/
    setIsUserOnMobileToTrue(){
      this.isUserOnMobile=true;
      setLocalStorage('isUserOnMobile', true);
    },
    setIsUserOnMobileToFalse(){
      this.isUserOnMobile=false;
      setLocalStorage('isUserOnMobile', false);
    },
    setObstacleSize(val){
      this.obstacleSize=val;
      setLocalStorage('obstacleSize', val);
    },
    getObstacleSize(){
    	return getLocalStorage('obstacleSize');
    },
    setCharHeight(val){
      this.charHeight=val;
      setLocalStorage('charHeight', val);
    },
    getCharHeight(){
    	return getLocalStorage('charHeight');
    },
    setCharWidth(val){
      this.charWidth=val;
      setLocalStorage('charWidth', val);
    },
    getCharWidth(){
    	return getLocalStorage('charWidth');
    },
     /**************End of Desktop vs mobile manipulators*****************/
    async reset(){
    	this.score = 0;
    	this.id_koje_necu = [];
    	this.brojPrepreka = 0;
    	this.currentGameId = null;
    	this.livesRemaining = this.startNumberOfLivesRemaining;
    	this.previousToughnessLevel = -1;
    	this.previousDiagonalObstaclesAtOnce = -1;
    	
    	this.playingCampaign = getPlayingCampaignFromLocalStorage();
    	if (this.playingCampaign){
    		this.setDefaultObstacleParamsForCampaign();
    		this.pullCampaignDataFromLocalStorage();
    		resultHelper.getResults();
    	}
    	this.resetSizes();
    	
    },
    async resetIfCurrentGameIdIsNull(){
    	if(this.currentGameId == null){
    		await this.reset();
    	} else {
    		this.resetSizes();
    	}
    },
    
    resetSizes(){
    	const onPhone = getLocalStorage('isUserOnMobile');
    	if (onPhone != null){
    		this.isUserOnMobile = onPhone;
    	}
    	const oSize = getLocalStorage('obstacleSize');
    	if (oSize != null){
    		this.obstacleSize = oSize;
    	}
    	const cWidth = getLocalStorage('charWidth');
    	if (cWidth != null){
    		this.charWidth = cWidth;
    	}
    	const cHeight = getLocalStorage('charHeight');
    	if (cHeight != null){
    		this.charHeight = cHeight;
    	}
    },
    
    pullCampaignDataFromLocalStorage(){
    	const bwd = getLocalStorage('campaignBombWeightDiagonal');
    	if (bwd != null){
    		this.campaignBombWeightDiagonal = bwd;
    	}
    	const bwv = getLocalStorage('campaignBombWeightVertical');
    	if (bwv != null){
    		this.campaignBombWeightVertical = bwv;
    	}
    	const qwd = getLocalStorage('campaignQuestionWeightDiagonal');
    	if (qwd != null){
    		this.campaignQuestionWeightDiagonal = qwd;
    	}
    	const qwv = getLocalStorage('campaignQuestionWeightVertical');
    	if (qwv != null){
    		this.campaignQuestionWeightVertical = qwv;
    	}
    	const swd = getLocalStorage('campaignStarWeightDiagonal');
    	if (swd != null){
    		this.campaignStarWeightDiagonal = swd;
    	}
    	const swv = getLocalStorage('campaignStarWeightVertical');
    	if (swv != null){
    		this.campaignStarWeightVertical = swv;
    	}
    	const numOfQ = getLocalStorage('campaignNumOfQuestions');
    	if (numOfQ != null){
    		this.campaignNumOfQuestions = numOfQ;
    	}
    	const campaignCategories = getLocalStorage('campaignCategories');
    	if (campaignCategories != null){
    		this.campaignCategories = campaignCategories;
    	}
    	const campaignDifficulty = getLocalStorage('campaignDifficulty');
    	if (campaignDifficulty != null){
    		this.campaignDifficulty = campaignDifficulty;
    	}
    	
    	const previousScore = getLocalStorage('prevScore');
    	if (previousScore != null){
    		this.prevScore = previousScore;
    	}
    	const characterImage = getLocalStorage('slikaKaraktera');
    	if (characterImage != null){
    		this.slikaKaraktera = characterImage;
    	}
    	const gameOver = getLocalStorage('gameIsOver');
    	if (gameOver != null){
    		this.gameIsOver = gameOver;
    	}
    	
    },
    getCharacterImage(){
    	const characterImage = getLocalStorage('slikaKaraktera');
    	if (characterImage != null){
    		return characterImage;
    	}
    	return this.slikaKaraktera;
    },
    setIstina(val){
      this.istina=val;
    },
    promeniPrikazujeSeRez(){
      this.prikazujeSeRez=!this.prikazujeSeRez;
    },
    setSlikaKaraktera(urlSlike){
    	this.slikaKaraktera = urlSlike;
    	setLocalStorage('slikaKaraktera', urlSlike);
    },
    changeGameIsOver(value){
      this.gameIsOver=value;
      setLocalStorage('gameIsOver', value);
    },
    setCurrentGameId(value){
      this.currentGameId = value;
    },
    setHighScore(value){
      this.highScore = value;
    },
    /******************Level Manipulators*********************/
    setPlayingCampaign(value){
      this.playingCampaign=value;
      setPlayingCampaignInLocalStorage(value);
    },
    
    
    
    setMaxNumberOfObstacles(value){
    	this.maxNumberOfObstacles = value;
    },
    incrementMaxNumberOfObstacles(value){
    	const newNumberOfObstacles = this.maxNumberOfObstacles + value;
    	if (newNumberOfObstacles >= 0){
    		this.maxNumberOfObstacles = newNumberOfObstacles;
    	}
    },
    
    setBombWeightDiagonal(value){
      this.bombWeightDiagonal=value;
    },
    setStarWeightDiagonal(value){
      this.starWeightDiagonal=value;
    },
    setQuestionWeightDiagonal(value){
      this.questionWeightDiagonal=value;
    },
    setDiagonalObstacleSpawnIntervalInMiliseconds(value){
    	this.diagonalObstacleSpawnIntervalInMiliseconds = value;
    },
    setDiagonalObstaclesAtOnce(value){
    	this.diagonalObstaclesAtOnce = value
    },
    
    setDiagonalMinFallPeriodInSeconds(value){
    	this.diagonalMinFallPeriodInSeconds = value;
    },
    setDiagonalMaxFallPeriodInSeconds(value){
    	this.diagonalMaxFallPeriodInSeconds = value;
    },
    multiplyDiagonalFallPeriodInSeconds(additionalSeconds){
    	this.diagonalMinFallPeriodInSeconds += additionalSeconds;
    	this.diagonalMaxFallPeriodInSeconds += additionalSeconds;
    },
    
    
    setBombWeightVertical(value){
    	this.bombWeightVertical = value;
    },
    setStarWeightVertical(value){
    	this.starWeightVertical = value;
    },
    setQuestionWeightVertical(value){
    	this.questionWeightVertical = value;
    },
    setVerticalObstacleSpawnIntervalInMiliseconds(value){
    	this.verticalObstacleSpawnIntervalInMiliseconds = value;
    },
    setVerticalObstaclesAtOnce(value){
    	this.verticalObstaclesAtOnce = value
    },
    
    setMinVerticalFallPeriodInSeconds(value){
    	this.minVerticalFallPeriodInSeconds = value;
    },
    setMaxVerticalFallPeriodInSeconds(value){
    	this.maxVerticalFallPeriodInSeconds = value;
    },
    multiplyVerticalFallPeriodInSeconds(additionalSeconds){
    	this.minVerticalFallPeriodInSeconds += additionalSeconds;
    	this.maxVerticalFallPeriodInSeconds += additionalSeconds;
    },
    
    setDefaultObstacleTiming(){
    	this.minVerticalFallPeriodInSeconds = this.basicMinVerticalFallPeriodInSeconds;
    	this.maxVerticalFallPeriodInSeconds = this.basicMaxVerticalFallPeriodInSeconds;
    	
    	this.diagonalMinFallPeriodInSeconds = this.basicDiagonalMinFallPeriodInSeconds;
    	this.diagonalMaxFallPeriodInSeconds = this.basicDiagonalMaxFallPeriodInSeconds;
    	
    	this.diagonalObstacleSpawnIntervalInMiliseconds = this.basicDiagonalObstacleSpawnIntervalInMiliseconds;
    	this.verticalObstacleSpawnIntervalInMiliseconds = this.basicVerticalObstacleSpawnIntervalInMiliseconds;
    	
    },
    
    setNumOfQuestions(value){
      this.numOfQuestions=value
    },
    setCampaignDifficulty(value){
      this.campaignDifficulty=value;
      setLocalStorage('campaignDifficulty', value);
    },
    setCategories(categorieArr){
      this.categories=categorieArr;
    },
    setCategoryIndex(val){
      this.categoryIndex=val
    },
    setLevelIndex(val){
      this.levelIndex=val;
    },
    //category indexes
    /*0 GK
    1 HIS
    2 SCI
    3 SP
    4 MOV
    5 MUS
    **/
   
    setCampaignResult(categoryIndex, levelIndex, score){
      //dolazak do kategorije
      this.campaignResults[categoryIndex][levelIndex]=score
      console.log(this.campaignResults[categoryIndex][levelIndex]);
      for (const x of this.campaignResults){
        console.log(x)
      }
    },
    setCapmaignResultsOnMount(array, index){
      this.campaignResults[index]=array;
      console.log("here ", this.campaignResults[index]);
    },
    setEntireCampaignResult(newCampaignResult){
    	this.campaignResult = newCampaignResult;
    },
    setPrevScore(val){
      this.prevScore=val;
      setLocalStorage('prevScore', val);
     },
     
    setCampaignBombWeightDiagonal(value){
    	this.campaignBombWeightDiagonal = value;
    	setLocalStorage('campaignBombWeightDiagonal', value);
    }, 
    setCampaignBombWeightVertical(value){
    	this.campaignBombWeightVertical = value;
    	setLocalStorage('campaignBombWeightVertical', value);
    },
    setCampaignStarWeightVertical(value){
    	this.campaignStarWeightVertical = value;
    	setLocalStorage('campaignStarWeightVertical', value);
    },
    
    setCampaignStarWeightDiagonal(value){
    	this.campaignStarWeightDiagonal = value;
    	setLocalStorage('campaignStarWeightDiagonal', value);
    },
    
    
    setCampaignQuestionWeightDiagonal(value){
    	this.campaignQuestionWeightDiagonal = value;
    	setLocalStorage('campaignQuestionWeightDiagonal', value);
    },
    setCampaignQuestionWeightVertical(value){
    	this.campaignQuestionWeightVertical = value;
    	setLocalStorage('campaignQuestionWeightVertical',value);
    },
    
    setCampaignNumOfQuestions(value){
    	this.campaignNumOfQuestions = value;
    	setLocalStorage('campaignNumOfQuestions', value);
    },
    
    setCampaignCategories(value){
    	this.campaignCategories = value;
    	setLocalStorage('campaignCategories', value);
    },

    printCampaignResults(){
    	console.log("campaign results: ");
    	for(let i=0; i<this.campaignResults.length; i++){
    		console.log(this.campaignResults[i]);
    	}
    },
    campaignResultsAsString(){
    	const characterThatDividesOuterArrayElements = "|";
    	const characterThatDividesInnerArrayElements = ",";
    	const indexOfLastArray = this.campaignResults.length - 1;
    	
    	let result = "";
    	
    	for(let i=0; i<this.campaignResults.length; i++){
    		result += "[" + this.campaignResults[i][0];
    		
    		for(let j=1; j<this.campaignResults[i].length; j++){
    			result += characterThatDividesInnerArrayElements + this.campaignResults[i][j];
    		}
    		
    		result += "]";
    		
    		if (i !== indexOfLastArray){
    			result += characterThatDividesOuterArrayElements;
    		}
    	}
    	
    	
    	return result;
    },
    
    
     
  id_koje_necu_as_string(characterThatDividesIds){
  	if (characterThatDividesIds == undefined){
  		alert("Character that divides strings argument in Skladiste.id_koje_necu_as_string is undefined.");
  		return "";
  	}
  
  	let result = "";
  	if (this.id_koje_necu.length > 0){
  		result += "" + this.id_koje_necu[0];
  	}
  	
  	for(let i=1; i<this.id_koje_necu.length; i++){
  		result += characterThatDividesIds + this.id_koje_necu[i];
  	}
  	
  	return result;
  },
  
  mapCategoryToIndex(category){
  	switch(category){
  		case "gk": return 0
  		case "his": return 1
  		case "sci": return 2
  		case "sp": return 3
  		case "mov": return 4
  		case "mus": return 5
  		default: return null  
  	}
  },
  /*
  setObstacleWeightBasedOnScore(score){
    bombWeightDiagonal = 3;
    starWeightDiagonal = 2;
    questionWeightDiagonal = 3;
    diagonalObstaclesAtOnce = 1;
    diagonalObstacleSpawnIntervalInMiliseconds = 3000;
    diagonalMinFallPeriodInSeconds = 1;
    diagonalMaxFallPeriodInSeconds = 4;
    
    bombWeightVertical = 4;
    starWeightVertical = 3;
    questionWeightVertical = 3;
    verticalObstaclesAtOnce = 1;
    verticalObstacleSpawnIntervalInMiliseconds = 2000;
    minVerticalFallPeriodInSeconds = 3;
    maxVerticalFallPeriodInSeconds = 6;
  },*/
  obstacleReseter(){
	
    this.maxNumberOfObstacles = this.basicMaxNumberOfObstacles;
    
    this.bombWeightDiagonal = this.basicBombWeightDiagonal;
    this.starWeightDiagonal = this.basicStarWeightDiagonal;
    this.questionWeightDiagonal = this.basicQuestionWeightDiagonal;
    this.diagonalObstaclesAtOnce = this.basicDiagonalObstaclesAtOnce;
    this.diagonalObstacleSpawnIntervalInMiliseconds = this.basicDiagonalObstacleSpawnIntervalInMiliseconds;
    this.diagonalMinFallPeriodInSeconds = this.basicDiagonalMinFallPeriodInSeconds;
    this.diagonalMaxFallPeriodInSeconds = this.basicDiagonalMaxFallPeriodInSeconds ;
    
    this.bombWeightVertical = this.basicBombWeightVertical;
    this.starWeightVertical = this.basicStarWeightVertical;
    this.questionWeightVertical = this.basicQuestionWeightVertical;
    this.verticalObstaclesAtOnce = this.basicVerticalObstaclesAtOnce;
    this.verticalObstacleSpawnIntervalInMiliseconds = this.basicVerticalObstacleSpawnIntervalInMiliseconds;
    this.minVerticalFallPeriodInSeconds = this.basicMinVerticalFallPeriodInSeconds;
    this.maxVerticalFallPeriodInSeconds = this.basicMaxVerticalFallPeriodInSeconds;
    
    this.calculatedVerticalObstacleSpawnIntervalInMiliseconds = this.basicVerticalObstacleSpawnIntervalInMiliseconds;
  }, 
  
  setObstacleWeightsToBeCampaignWeights(){
  	this.bombWeightDiagonal = this.campaignBombWeightDiagonal;
  	this.bombWeightVertical = this.campaignBombWeightVertical;
  	this.starWeightDiagonal = this.campaignStarWeightDiagonal;
  	this.starWeightVertical = this.campaignStarWeightVertical;
  	this.questionWeightDiagonal = this.campaignQuestionWeightDiagonal;
  	this.questionWeightVertical = this.campaignQuestionWeightVertical;
  },
  
  updateGameToughness(){
  	if (this.playingCampaign){
  		this.setObstacleWeightsToBeCampaignWeights();
  		this.printObstacleWeights();
  		return false;
  	} 
  	const toughnessLevel = (this.score == undefined)? 0 : Math.floor(this.score / this.scoreIntervalAfterWhichWeMakeTheGameHarder);
  	
  	let verticalFallPeriodFactor = 1;
  	let diagonalFallPeriodFactor = 1;
  	let verticalObstacleSpawnFactor = 1;
  	let diagonalObstacleSpawnFactor = 1;
  		
  	if (toughnessLevel >= 1){
  		
  		verticalFallPeriodFactor = Math.pow(0.95, toughnessLevel);
  		diagonalFallPeriodFactor = Math.pow(0.99, toughnessLevel);
  		verticalObstacleSpawnFactor = Math.pow(0.85, toughnessLevel);
  		diagonalObstacleSpawnFactor = Math.pow(0.85, toughnessLevel);
  	}
  		
  	this.updateObstacleWeightsForArcade(toughnessLevel);
  		
  	this.diagonalMinFallPeriodInSeconds = diagonalFallPeriodFactor * this.basicDiagonalMinFallPeriodInSeconds;
  	this.diagonalMaxFallPeriodInSeconds = diagonalFallPeriodFactor * this.basicDiagonalMaxFallPeriodInSeconds;
  		
  	this.minVerticalFallPeriodInSeconds = verticalFallPeriodFactor * this.basicMinVerticalFallPeriodInSeconds;
  	this.maxVerticalFallPeriodInSeconds = verticalFallPeriodFactor * this.basicMaxVerticalFallPeriodInSeconds;
  		
  	this.calculatedVerticalObstacleSpawnIntervalInMiliseconds = 
  		verticalObstacleSpawnFactor * this.basicVerticalObstacleSpawnIntervalInMiliseconds;
  	this.verticalObstacleSpawnIntervalInMiliseconds = this.calculatedVerticalObstacleSpawnIntervalInMiliseconds;
  		
  	this.diagonalObstacleSpawnIntervalInMiliseconds = diagonalObstacleSpawnFactor * 	
  	this.basicDiagonalObstacleSpawnIntervalInMiliseconds;	
  		
	this.maxNumberOfObstacles = this.basicMaxNumberOfObstacles + toughnessLevel * 2;
	  		
 	
	if (this.score >= this.scoreWhenDiagonalObstaclesStart){
  		this.diagonalObstaclesAtOnce = 1;	
  	} else {
  		this.diagonalObstaclesAtOnce = 0;
  			 
 /* Posto nema dijagonalnih prepreka bilo bi dosta manje prepreka na ekranu ako ne dodam vise vertikalnih prepreka.
 Zelim da frekvencija kreiranja prepreki ostane ista. x predstavlja koliko treba da se doda na interval kreiranja vertikalnih prepreki 
 da bi frekvencija kreiranja prepreki bila ista kao i da se kreiraju dijagonalne prepreke. T1 i T2 predstavljaju period kreiranja 
 vertikalnih i dijagonalnih prepreki ukoliko se i jedne i druge prepreke kreiraju.
 1/(T1 + x) = 1/T1 + 1/T2
 1/(T1 + x) = (T2 + T1) / (T1 * T2)
 T1 + x = (T1 * T2) / (T1 + T2)
 x = (T1 * T2) / (T1 + T2) - T1
 x = (T1 * T2 - T1 * T2 - T1 * T1) / (T1 + T2)
 x = (- T1 * T1) / (T1 + T2)
 amountToLowerVerticalSpawnPeriod = -x
 */
 		const amountToLowerVerticalSpawnPeriod = (Math.pow(this.calculatedVerticalObstacleSpawnIntervalInMiliseconds, 2) / 
 			(this.calculatedVerticalObstacleSpawnIntervalInMiliseconds + this.diagonalObstacleSpawnIntervalInMiliseconds));
 			
 		this.verticalObstacleSpawnIntervalInMiliseconds = this.calculatedVerticalObstacleSpawnIntervalInMiliseconds - 
 		amountToLowerVerticalSpawnPeriod;
  	}
	
	this.printObstacleWeights();
	
	const changeHappened = this.previousToughnessLevel != toughnessLevel || 
				this.previousDiagonalObstaclesAtOnce != this.diagonalObstaclesAtOnce;
	
	this.previousDiagonalObstaclesAtOnce = this.diagonalObstaclesAtOnce;
	this.previousToughnessLevel = toughnessLevel;
	return changeHappened;
	
  },
  printObstacleWeights(){
  	console.log("max number of obstacles: " + this.maxNumberOfObstacles);
  	console.log("min vertical fall period: " + this.minVerticalFallPeriodInSeconds);
  	console.log("max vertical fall period: " + this.maxVerticalFallPeriodInSeconds);
  	console.log("vertical bomb weight: " + this.bombWeightVertical);
  	console.log("vertical star weight: " + this.starWeightVertical);
  	console.log("vertical question weight: " + this.questionWeightVertical);
  	console.log("vertical obstacle spawn interval in miliseconds: " + this.verticalObstacleSpawnIntervalInMiliseconds);
  	
  	console.log("\nmin diagonal fall period " + this.diagonalMinFallPeriodInSeconds);
  	console.log("max diagonal fall period " + this.diagonalMaxFallPeriodInSeconds);
  	console.log("diagonal bomb weight: " + this.bombWeightDiagonal);
  	console.log("diagonal star weight: " + this.starWeightDiagonal);
  	console.log("diagonal question weight: " + this.questionWeightDiagonal);
  	console.log("diagonal obstacle spawn interval in miliseconds: " + this.diagonalObstacleSpawnIntervalInMiliseconds);
  	console.log("Skladiste.score: " + this.score);
  },
  updateObstacleWeightsForArcade(toughnessLevel){
  	this.bombWeightVertical = this.basicBombWeightVertical + toughnessLevel;
  	this.bombWeightDiagonal = this.basicBombWeightDiagonal + toughnessLevel;
  	this.starWeightVertical = this.basicStarWeightVertical;
  	this.starWeightDiagonal = this.basicStarWeightDiagonal;
  	this.questionWeightDiagonal = this.basicQuestionWeightDiagonal;
  	this.questionWeightVertical = this.basicQuestionWeightVertical;
  },
  setDefaultObstacleParamsForCampaign(){
  	this.verticalObstaclesAtOnce = 1;
  	this.diagonalObstaclesAtOnce = 1;
  	this.setDefaultObstacleTiming();
  	this.maxNumberOfObstacles = this.basicMaxNumberOfObstacles;
  }
 },

     
});

