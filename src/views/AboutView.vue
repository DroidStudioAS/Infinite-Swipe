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
      <div  @click="stopShowingLeaderboardIfActive()" class="navItem">
        O nama
      </div>
      <div @click="pushTo('GlobalLeaderboard')" class="navItem">
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
            <span @click="pushTo('gameMode')" class="navItem">
              Igraj Sad
            </span>
              <span @click="pushTo('impressions')" class="navItem">
                Recenzije
              </span>
              <span @click="stopShowingLeaderboardIfActive()" class="navItem">
                O nama
              </span>
              <span @click="pushTo('GlobalLeaderboard')" class="navItem">
                Globalni Leaderboard
              </span>
              <span @click="pushTo('ChangeUsernameEmailPassword')" class="navItem">
                Korisnička Podešavanja
              </span>
          </div>
      </nav>
      <span @click="logout()" class="logout">Izloguj se</span>
    </header>

    <!--About page-->
      <body>
    <div class="aboutContainer" v-if="!prikazujeSeLeaderboard">
        <h1>Igricu Razvili:</h1>
        <div class="creditContainer">
            <div class="credit">
                <img class="headshot" placeholder="headshot"/>
                <h2>Aleksandar Smiljanić</h2>
                <h5> <a target="blank" href="https://github.com/DroidStudioAS">Github Profil</a></h5> 
                <h5>kontakt: aleksandar.smiljanic19@gmail.com</h5>
            </div>
            <div class="credit">
                <img class="headshot" placeholder="headshot"/>
                <h2>Petar Bokalović</h2>
                <h5><a target="blank" href="https://github.com/petarxx99/">Github Profil</a></h5> 
                <h5>kontakt: petar.bokalovic@gmail.com</h5>
            </div>
            <div class="credit">
                <img class="headshot" placeholder="headshot"/>
                <h2>Stanko Risimić</h2>
               <h5><a target="blank" href="https://github.com/DroidStudioAS">GitHub Profil </a></h5> 
               <h5>kontakt: risimicstanko@gmail.com</h5>
            </div>
        </div>

    </div>
  </body>

     <!--Leaderboard-->
     <div v-if="prikazujeSeLeaderboard" class="leaderboard">
          <leaderboard-component :dobavljacLeaderboarda="dobavljacLeaderboarda" class="leaderboard" />
     </div>
</template>

<script setup>
import { ref } from 'vue';
import LeaderboardComponent from '../components/LeaderboardComponent.vue';
import pomagacLeaderboard from '../mrezniPomagaci/pomagacLeaderboard.js';
import { useLoginStore } from '../stores/login.js';
import { useRouter } from 'vue-router';

const loginStore = useLoginStore()
const router = useRouter();  
function logout(){
	loginStore.izlogujSe();
	router.push({name: "login"});
}  
function pushTo(name){
  router.push({name:name})
}
function stopShowingLeaderboardIfActive(){
  if(prikazujeSeLeaderboard){
    prekiniPrikazivanjeLeaderboarda();
  }
}
const mobileNavOpen = ref(false);

function toggleMobileNav() {
  mobileNavOpen.value = !mobileNavOpen.value;
}
const prikazujeSeLeaderboard = ref(false);

function prikaziLeaderboard(){
	prikazujeSeLeaderboard.value = true;
}

function prekiniPrikazivanjeLeaderboarda(){
	prikazujeSeLeaderboard.value = false;
}

const MAKSIMALAN_BROJ_SCOROVA_U_LEADERBOARDU = 20;

const dobavljacLeaderboarda = ref({
	dobaviLeaderboard: () => pomagacLeaderboard.nabaviGlobalniLeaderboard(20)
});
</script>


<style scoped>
* {
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
  letter-spacing: 2px;
}
body{
background-color: #3d90cd;
}
.aboutContainer{
    margin-top: 2%;
    display: flex;
    flex-flow: column wrap;
    align-items: center;
}
.creditContainer {
  margin-top: 10%;
  display: flex;
  flex-flow: row wrap;
  justify-content: space-around;
  gap: 50px;
 
}

.credit {
  background: #191D88;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  border-radius: 10%;
  box-shadow: 0px 0px 20px rgb(0, 0, 0);
  min-width: 40%; 
  max-width: 40%;
}

.credit a {
  color: white;
  text-decoration: none;
}

.headshot{
    height: 50%;
    border-radius: 50%;
}

/****************Navigation CSS****************/

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
.logout{
  letter-spacing: 1px;
  position: absolute;
  right: 5%;
}
.logout:hover {
  color: #3d90cd;
  transform: scale(1.1);
}
.leaderboard{
  background-color:#3d90cd;
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
.mobile-nav.open {
  display: block; /* Show the mobile nav when open */
  transform: translateX(0);
}
@media (max-width: 768px) {
.creditContainer {
  max-height: 75vh;
  overflow: auto;
}

.credit {
  min-width: 80%; 
  max-width: 80%;
}
 .mobile-menu-icon {
    display: flex;
    flex-flow: column nowrap;
  }

  .desktop-nav {
    display: none;
  }
}
.leaderboard{
  position: absolute;
  top: 10%;
  left: 0%;
  right: 0%;
}

.supportUs {
  font-size: 36px;
  margin-top: 50px;
}
</style>
