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
      <div @click="stopShowingLeaderboardIfActive()" class="navItem">
        Igraj Sad
    </div>
      <div @click="pushTo('impressions')" class="navItem">
        Recenzije
      </div>
      <div  @click="pushTo('aboutUs')" class="navItem">
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
            <span @click="stopShowingLeaderboardIfActive()" class="navItem">
              Igraj Sad
            </span>
              <span @click="pushTo('impressions')" class="navItem">
                Recenzije
              </span>
              <span @click="pushTo('aboutUs')" class="navItem">
                O nama
              </span>
              <span @click="prikaziLeaderboard()" class="navItem">
                Globalni Leaderboard
              </span>
              <span @click="pushTo('ChangeUsernameEmailPassword')" class="navItem">
                Korisnička Podešavanja
              </span>
          </div>
      </nav>
      <span @click="logout()" class="logout">Izloguj se</span>
</header>
<body>
   <div v-if="!prikazujeSeLeaderboard" class="mainContainer">
        <div @click="pushToArcade()" class="gameMode"> <h2>Arcade</h2><br><p class="desc">Takmiči se sa korisnicima širom<br> sveta u beskonačnoj igri</p></div>
        <div @click="pushToCampaign()" class="gameMode"><h2>Kampanja</h2><br><p class="desc">Igraj i uči o pojedinim oblastima</p></div>
   </div>

   <div v-if="prikazujeSeLeaderboard" class="leaderboard">
          <leaderboard-component :dobavljacLeaderboarda="dobavljacLeaderboarda" class="leaderboard" />
  </div>
</body>
</template>
<script setup>
/***************Imports***************/
import { ref } from 'vue';
import LeaderboardComponent from '../components/LeaderboardComponent.vue';
import pomagacLeaderboard from '../mrezniPomagaci/pomagacLeaderboard.js';
import { useLoginStore } from '../stores/login.js';
import { useRouter } from 'vue-router';
import { useSkladiste } from '../stores/Skladiste';
/****************Nav Variables and logic*****************/
const loginStore = useLoginStore();
const router = useRouter();
const MAKSIMALAN_BROJ_SCOROVA_U_LEADERBOARDU = 20;
const prikazujeSeLeaderboard = ref(false);
function prikaziLeaderboard(){
	prikazujeSeLeaderboard.value = true;
}
function prekiniPrikazivanjeLeaderboarda(){
	prikazujeSeLeaderboard.value = false;
}
const dobavljacLeaderboarda = ref({
	dobaviLeaderboard: () => pomagacLeaderboard.nabaviGlobalniLeaderboard(20)
});
function logout(){
	loginStore.izlogujSe();
	router.push({name: "login"});
}
function stopShowingLeaderboardIfActive(){
  if(prikazujeSeLeaderboard){
    prekiniPrikazivanjeLeaderboarda();
  }
}
function pushTo(name){
  router.push({name:name})
}
function pushToArcade(name){
    const Skladiste = useSkladiste();
    Skladiste.setPlayingCampaign(false);
    Skladiste.setNumOfQuestions(5);
    Skladiste.setCategories(["his","sp","sci", "mov","mus","gk"]);
    pushTo('biranjeKaraktera')
}
function pushToCampaign(name){
  const Skladiste = useSkladiste();
  Skladiste.setPlayingCampaign(true)
  Skladiste.setCurrentGameId(null);
  pushTo('levels')
}
const mobileNavOpen = ref(false);
function toggleMobileNav() {
  mobileNavOpen.value = !mobileNavOpen.value;
}
function SkladisteReseter(){
    const Skladiste = useSkladiste();
    Skladiste.setPlayingCampaign(false);

    Skladiste.setBombWeightDiagonal(3);
    Skladiste.setStarWeightDiagonal(2);
    Skladiste.setQuestionWeightDiagonal(3);
    Skladiste.setNumOfQuestions(5);
    Skladiste.setCategories(["his","sp","sci", "mov","mus","gk"]);
}


</script>
<style scoped>
* {
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
  letter-spacing: 2px;
}
body{
  background-color:#3d90cd;
}
.gameMode{
  background-color: #191D88;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 10%;
  border-radius: 10%;
  box-shadow: 0px 0px 20px rgb(0, 0, 0);
  transition: color 1s ease, transform 1.5s ease, background-color 1.5s ease;
}
.desc{
  text-align: center;
  font-size: 12px;
}

.gameMode:hover{
  background-color: rgb(156, 202, 255);
  color: #3c00ff;
	cursor: pointer;
  transform: scale(1.1);
}

.mainContainer{
    display: flex;
    flex-flow: row nowrap;
    gap: 20%;
    justify-content: center;
    margin-top: 10%;
    
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
.mobile-nav.open {
  display: block; /* Show the mobile nav when open */
  transform: translateX(0);
}
@media (max-width: 768px) {
.mobile-menu-icon {
    display: flex;
    flex-flow: column nowrap;
  }

  .desktop-nav {
    display: none;
  }
  .mainContainer{
    flex-flow: column nowrap;
    justify-content: center;
    align-content: center;
    align-items: center;
  }
  .gameMode{
    width: 50vw;
    height: 25vh;
    margin-bottom: 5%;
  }

}
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
}

.navItem {
    font-size: 1rem;  
    transition: color 0.3s ease;
    letter-spacing: 1px;
    cursor: pointer;
}
.leaderboard{
  background-color:#3d90cd;
}
.navItem:hover {
  color: #3d90cd;
  transform: scale(1.1);
}

.logout{
  letter-spacing: 1px;
  position: absolute;
  right: 5%;
}
.logout:hover {
  color: #3d90cd;
  transform: scale(1.1);
}
</style>
