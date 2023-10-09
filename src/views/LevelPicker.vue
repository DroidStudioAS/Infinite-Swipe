
<template>
    <header class="navContainer">
      <!--Mobile-->
      <div class="mobile-menu-icon" @click="toggleMobileNav">
      <span class="bar"></span>
      <span class="bar"></span>
      <span class="bar"></span>
    </div>
    <!-- Navigation Drawer (Mobile) -->
    <div class="mobile-nav" :class="{ open: mobileNavOpen }">
      <div class="navItem" @click="pushTo('pocetna')">
        Glavna Stranica
      </div>
      <div @click="pushTo('gameMode')" class="navItem">
        Igraj Sad
    </div>
      <div @click="pushTo('impressions')" class="navItem">
        Recenzije
      </div>
      <div @click="pushTo('aboutUs')" class="navItem">
        O nama
      </div>
      <div @click="prikaziLeaderboard()" class="navItem">
        Globalni Leaderboard
      </div>
      <div @click="pushTo('ChangeUsernameEmailPassword')" class="navItem">
        Korisnička Podešavanja
      </div>
    </div>
      <!--desktop-->
      <nav class="desktop-nav">
          <div class="navOptions">
            <span class="navItem" @click="pushTo('pocetna')">
              Glavna Stranica
            </span>
            <span  @click="pushTo('gameMode')" class="navItem">
               Igraj Sad
            </span>
              <span @click="pushTo('impressions')" class="navItem">
                  Recenzije
              </span>
              <span @click="pushTo('aboutUs')" class="navItem">
                  O Nama
              </span>
              <span @click="prikaziLeaderboard()" class="navItem">
                  Globalni Leaderboard
              </span>
              <span @click="pushTo('ChangeUsernameEmailPassword')" class="navItem">
                Korisnička Podešavanja
              </span>
          </div>
      </nav>
      <span @click="logout()" class="logout" style="cursor: pointer;">Izloguj se</span>
  </header>


  <body v-if="!leaderboardActive">
  <div v-if="loading">
  Loading...
  </div>
  <div class="wrap" v-else> 
    <h3 style="text-align: center;" class="categories_explanation"> 
    		Morate preći sve nivoe jedne kategorije da biste otključali sledeću kategoriju. 
    </h3>
    
    <div class="all_categories" :class="{all_categories_on_phone: isOnPhone}">
  	<div v-for="(category, catIndex) in categories" :key="catIndex" :class="{category_locked: !category.levels[0].unlocked}">
  	  	<h1 style="text-align: center;">{{ category.name }}</h1>
                                 
  	    	<div class="level-map">
  		      	<div
       		v-for="(level, levelIndex) in category.levels"
          		:key="levelIndex"
          		:class="[level.unlocked ? 'cell' : 'locked']"
          		@click="selectLevel(category, levelIndex, catIndex)"
  		      	>
 	       		<div class="cell_content">
        				<div class="level-index">
        	    					Nivo {{ levelIndex + 1 }}
        	  			</div>
        	  			<div v-if="level.completed" class="stars_container">
        		    		<img  class="star" v-for="star in level.stars" :key="star" src="/graph_zvezda.png" alt="Star">
        	 			</div>
          				<div v-if="!level.completed" class="stars_container">
            				<img  class="star" v-for="star in level.stars" :key="star" src="/graph_empty_star.png" alt="Star">
          				</div>
        			</div>
        		</div>
        
      		</div>
    	</div>
    </div>
  </div>
  </body>
  <div v-if="leaderboardActive" class="leaderboard">
          <leaderboard-component :dobavljacLeaderboarda="dobavljacLeaderboarda" class="leaderboard" />
      </div>
</template>

  <script setup>
  import { onMounted, ref, onBeforeUnmount, watch } from 'vue';
  import { useSkladiste } from '../stores/Skladiste';
  import { useRouter } from 'vue-router';
  import { computed } from 'vue';
  import resultHelper from '../mrezniPomagaci/resultHelper';
  import { gsap } from 'gsap';
  import Prepreke from '../models/preprekaRoditelj';
 import { useLoginStore } from '../stores/login';
 import LeaderboardComponent from '../components/LeaderboardComponent.vue';
 import pomagacLeaderboard from '../mrezniPomagaci/pomagacLeaderboard.js';
 import mobileHelper from '../models/mobileHelper.js';
 
  const router = useRouter();
  function pushTo(name){
  	router.push({name:name})
  }
  
  const isOnPhone = ref(mobileHelper.isMobile());
  
  const Skladiste = useSkladiste();
  const resHelper = resultHelper;
  const loading = ref(true);

  let prevScore = -1;

  const mobileNavOpen = ref(false);

  function toggleMobileNav() {
  mobileNavOpen.value = !mobileNavOpen.value;
}
  
const loginStore = useLoginStore();
function logout(){
	loginStore.izlogujSe();
	router.push({name: "login"});
}

const leaderboardActive = ref(false);

function prikaziLeaderboard(){
	leaderboardActive.value = true;
}

function prekiniPrikazivanjeLeaderboarda(){
	leaderboardActive.value = false;
}

const MAKSIMALAN_BROJ_SCOROVA_U_LEADERBOARDU = 20;

const dobavljacLeaderboarda = ref({
	dobaviLeaderboard: () => pomagacLeaderboard.nabaviGlobalniLeaderboard(20)
});
  
  const categories = ref([

    //forma params objekta
    //params: [bombWeight,starWeight,QuestionWeight, numOfQuestions, difficulty, Categories]

    //outer array
    {//ineer array
      //iz opsteg znanja nisu uradjena pitanja, pa cu dok se ne dodaju staviti za kateforiju, HIS
      name: 'Opšte Znanje',
      levels: [
        { unlocked: true,  completed: false, stars:3, params:[1,  0, 1, 20, 1, ['gk']]}, 
        { unlocked: false, completed: false,  stars:3, params:[2, 0, 1, 20, 2, ['gk']]},
        { unlocked: false, completed: false, stars:3, params:[2,  0, 1, 20, 3, ['gk']]},
        { unlocked: false, completed: false, stars:3, params:[3,  0, 1, 20, 4, ['gk']]},
        { unlocked: false, completed: false, stars:3,  params:[3, 0, 3, 20, 5, ['gk']]},
    ]
    },
    {
      name:'Istorija',
      levels:[
        { unlocked: false, completed: false,  stars:3, params:[1, 0, 1, 20, 1, ['his']]}, 
        { unlocked: false, completed: false,  stars:3, params:[2, 0, 1, 20, 2, ['his']]},
        { unlocked: false, completed: false,  stars:3, params:[2, 0, 1, 20, 3, ['his']]},
        { unlocked: false, completed: false,  stars:3, params:[3, 0, 1, 20, 4, ['his']]},
        { unlocked: false, completed: false,  stars:3, params:[3, 0, 1, 20, 5, ['his']]},
      ]
    },
    {
      name:"Nauka i Priroda",
      levels:[
        { unlocked: false, completed: false,  stars:3, params:[1, 0, 1, 20, 1, ['sci']]}, 
        { unlocked: false, completed: false,  stars:3, params:[2, 0, 1, 20, 2, ['sci']]},
        { unlocked: false, completed: false,  stars:3, params:[2, 0, 1, 20, 3, ['sci']]},
        { unlocked: false, completed: false,  stars:3, params:[3, 0, 1, 20, 4, ['sci']]},
        { unlocked: false, completed: false,  stars:3, params:[3, 0, 1, 20, 5, ['sci']]},
      ]
    },
    {
      name:"Sport",
      levels:[
         { unlocked: false, completed: false,  stars:3, params:[1, 0, 1, 20, 1, ['sp']]}, 
         { unlocked: false, completed: false,  stars:3, params:[2, 0, 1, 20, 2, ['sp']]},
         { unlocked: false, completed: false,  stars:3, params:[2, 0, 1, 20, 3, ['sp']]},
         { unlocked: false, completed: false,  stars:3, params:[3, 0, 1, 20, 4, ['sp']]},
         { unlocked: false, completed: false,  stars:3, params:[3, 0, 1, 20, 5, ['sp']]},
        ]
    },
    {
      name:"Filmovi i Zabava",
      levels:[
        { unlocked: false, completed: false,  stars:3, params:[1, 0, 1, 20, 1, ['mov']]}, 
        { unlocked: false, completed: false,  stars:3, params:[2, 0, 1, 20, 2, ['mov']]},
        { unlocked: false, completed: false,  stars:3, params:[2, 0, 1, 20, 3, ['mov']]},
        { unlocked: false, completed: false,  stars:3, params:[3, 0, 1, 20, 4, ['mov']]},
        { unlocked: false, completed: false,  stars:3, params:[3, 0, 1, 20, 5, ['mov']]},
        ]
    },
    {
      name:"Muzika",
      levels:[
        { unlocked: false, completed: false,  stars:3, params:[1, 0, 1, 20, 1, ['mus']]}, 
        { unlocked: false, completed: false,  stars:3, params:[2, 0, 1, 20, 2, ['mus']]},
        { unlocked: false, completed: false,  stars:3, params:[2, 0, 1, 20, 3, ['mus']]},
        { unlocked: false, completed: false,  stars:3, params:[3, 0, 1, 20, 4, ['mus']]},
        { unlocked: false, completed: false,  stars:3, params:[3, 0, 1, 20, 5, ['mus']]},
        ]
    }
  ]);
 
  //ovde cemo stavljati koliko ima tacnih odgovora u kom nivou
  function paramMapper(levelIndex){
    const selectedLevel = category.levels[levelIndex];
    console.log(selectedLevel)
  }
  //za centralizovano rukovanje skladistem iz level picker-a
  function SkladisteSetter(bomb_weight,star_weight,question_weight,num_of_questions,difficulty,categories){
    const Skladiste = useSkladiste();
    Skladiste.setCampaignBombWeightDiagonal(bomb_weight);
    Skladiste.setCampaignBombWeightVertical(bomb_weight);
    Skladiste.setCampaignStarWeightDiagonal(star_weight);
    Skladiste.setCampaignStarWeightVertical(star_weight);
    Skladiste.setCampaignQuestionWeightDiagonal(question_weight);
    Skladiste.setCampaignQuestionWeightVertical(question_weight);
    Skladiste.setCampaignNumOfQuestions(num_of_questions);
    Skladiste.setCampaignDifficulty(difficulty);
    Skladiste.setCampaignCategories(categories);
    
    Skladiste.setDefaultObstacleParamsForCampaign();

    console.log(Skladiste.bombWeight,Skladiste.starWeight,Skladiste.questionWeight,Skladiste.numOfQuestions,Skladiste.campaignDifficulty,Skladiste.categories)
  }
  const isLevelUnlocked = (category, levelIndex) => {
    // Your logic to determine if a level is unlocked based on completed levels
    // Use the user's progress to decide if a level should be unlocked
  };
  function selectLevel(category, levelIndex, catIndex) {
    const selectedLevel = category.levels[levelIndex];
    console.log("indeksi pre", catIndex,levelIndex)
   
      // Start the game for the selected level
      console.log('Starting level', category.name, levelIndex + 1)
      //mapiranje parametara
      let bomb_weight = selectedLevel.params[0]
      let star_weight = selectedLevel.params[1]
      let question_weight = selectedLevel.params[2]

      let num_of_questions = selectedLevel.params[3];
      let difficulty = selectedLevel.params[4];
      let categories = [];
      categories[0] = selectedLevel.params[5][0];
        
    //postavljanje parametara u skladiste
    //ova dva loga treba da budu uvek
      console.log(bomb_weight,star_weight,question_weight, num_of_questions,difficulty,categories)
      SkladisteSetter(bomb_weight,star_weight,question_weight,num_of_questions,difficulty,categories);
      const Skladiste = useSkladiste();
      Skladiste.setCategoryIndex(catIndex);
      Skladiste.setLevelIndex(levelIndex);
      console.log("indeksi posle", Skladiste.categoryIndex, Skladiste.levelIndex);
      //grab a reference to the previous result
      prevScore=Skladiste.campaignResults[catIndex][levelIndex];
      Skladiste.setPrevScore(prevScore)
      //push to level
     setTimeout(pushTo('biranjeKaraktera'), 1500); 
  }
  function changeStarCount(i,j,numOfStars){
    categories.value[i].levels[j].stars===numOfStars;
  }


  function levellocker(){
 
  //  const categoriesArray = categories.value; // Access the value of the ref
    for(let i = 0; i < Skladiste.campaignResults.length; i++){
      for (let j = 0; j < Skladiste.campaignResults[i].length; j++){
        if(Skladiste.campaignResults[i][j]<11){
          categories.value[i].levels[j].unlocked=false
          if(i===0 && j === 0){
            categories.value[i].levels[j].unlocked=true
          }
        }else if(Skladiste.campaignResults[i][j]>=11){
          categories.value[i].levels[j].completed=true
         // console.log(categories.value[i].levels[j+1].unlocked)
         
        }
 }
}

  }
  function levelUnlocker(){
   
  //  const categoriesArray = categories.value; // Access the value of the ref
    for(let i = 0; i < Skladiste.campaignResults.length; i++){
      for (let j = 0; j < Skladiste.campaignResults[i].length; j++){
        console.log("hey", categories.value[i].levels[j].completed)
        if(categories.value[i].levels[j].completed===true){
          if(j!=4){
            //ostali nivoi niza
          categories.value[i].levels[j +1].unlocked=true
          console.log("ok")
          }else{
            if (i != 5){
            categories.value[i+1].levels[0].unlocked=true;
            }
          }
        }
      }
  }
}
  function starAdder(){
    for (let i =0; i <Skladiste.campaignResults.length; i++){
      for(let j =0; j<Skladiste.campaignResults[i].length; j++){
        let levelToManipulate = categories.value[i].levels[j];
        const level_score = Skladiste.campaignResults[i][j]
        if(level_score>=11 && level_score<14){
          console.log("one star")
          categories.value[i].levels[j].stars=1;
          console.log(levelToManipulate)
        }else if(level_score>=14 && level_score<18){
          console.log('two star')
          levelToManipulate.stars=2
          console.log(levelToManipulate)
        }else if(level_score>=18 && level_score<=20){
          console.log("3 star")
          levelToManipulate.stars=3
          console.log(levelToManipulate)

        }
      }
    }
  }
  


  
  watch(loading, (newValue, oldValue) => {
  	if (newValue === false){
  		levellocker();
  		levelUnlocker();
      starAdder();
  	}
  });


  onMounted(() => load());
  
  async function load(){
  	await resHelper.getResults();
  	loading.value = false;
  }
  
  onBeforeUnmount(() => {
  	loading.value = true;
  });




  </script>
  
 
  
  <style scoped>
  body{
    background-color:#3d90cd;
  }

  .wrap {
    max-height: 100vh; /* Set a maximum height for the container */
    overflow-y: auto; /* Enable vertical scrolling when content overflows */
  }
  
  .all_categories{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    overflow-y: auto;
    margin-top: 5vh;
    margin-bottom: 10vh;
  }
  
  .all_categories_on_phone{
  	max-height: 50vh;
  }
  
  .category_locked{
  	opacity: 0.35;
  }
  
  .categories_explanation{
  	text-align: center;
  	margin-top: 3vh;
  }
  
  .level-map {
    display: grid;  
    grid-template-columns: repeat(1, 100px);
    gap: 50px;
    justify-content: center;
  }
  
  .cell {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background-color: #e0e0e0;
    font-size: 24px;
    cursor: pointer;
    user-select: none;
    transition: background-color 0.3s ease;
  }
  .cell-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.level-index {
  display: flex;
  position: sticky;
  justify-content: center;
  align-items: center;
  font-size: 24px;
}

.stars_container {
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center; 
}

.star {
  width: 30px;
  height: 30px;
}
  .locked {
    display: none;
    align-items: center;
    justify-content: center;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background-color: red;
    font-size: 24px;
    cursor: pointer;
    user-select: none;
    transition: background-color 0.3s ease;  }
    .navContainer {
  height: 7vh;
    width: 100vw;
    background-color: #1450A3;
    color: white;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 0 5%;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
}
.navOptions {
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 10px;
}

.navItem {
    font-size: 1rem;
    transition: color 0.3s ease;
    letter-spacing: 1px;
    cursor: pointer;
}
.navItem:hover {
    color: #3d90cd;
    transform: scale(1.1);
}
.mobile-menu-icon {
  display: none; /* Hide on desktop */
  cursor: pointer;
  padding: 10px;
  margin-right: 10%;
}
.mobile-menu-icon .bar {
  display: block;
  width: 25px;
  height: 3px;
  margin: 5px auto;
  background-color: #333;
}
.mobile-nav {
  display: none;
  position: fixed;
  top: 6.2vh;
  left: 0;
  height: 100%;
  background-color:#1450A3;
  transition: transform 0.3s ease;
  z-index: 1000;
}
.mobile-nav .navItem{
  padding-top: 5%;
  padding-bottom: 5%;
  padding-left: 5%;
  font-size: 24px;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2); /* Add box shadow */
}
.logout{
  letter-spacing: 1px;
  position: absolute;
  right: 5%;
}
.mobile-nav.open {
  display: block; /* Show the mobile nav when open */
  transform: translateX(0);
}
@media (max-width: 768px) {
  .level-map{
    margin-bottom: 5em;
  }
  .mobile-menu-icon {
    display: flex;
    flex-flow: column nowrap;
  }

  .desktop-nav {
    display: none;
  }
}
  </style>
  
