<!-- -->
<script setup>


import { ref, onMounted, computed, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import animacijaInterfejs from '../animacije/animacijaInterfejs';
import LeaderboardComponent from '../components/LeaderboardComponent.vue';
import pomagacLeaderboard from '../mrezniPomagaci/pomagacLeaderboard.js';
import { useLoginStore } from '../stores/login.js';
import { useSkladiste } from '../stores/Skladiste';
import mobileHelper from '../models/mobileHelper';


const loginStore = useLoginStore();
const router = useRouter();

const isPhone = ref(mobileHelper.isMobile());
const isPhoneHorizontal = ref(mobileHelper.isMobile() && screenIsHorizontal());
const isPhoneVertical = ref(mobileHelper.isMobile() && !screenIsHorizontal());
const horizontalScreen = ref(screenIsHorizontal());

function screenIsHorizontal(){
	return window.screen.height < window.screen.width;
}

function watchResize(){
	isPhoneHorizontal.value = mobileHelper.isMobile() && screenIsHorizontal();
	isPhoneVertical.value = mobileHelper.isMobile() && !screenIsHorizontal();
	horizontalScreen.value = screenIsHorizontal();
}

function pushTo(name){
  router.push({name:name})
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

function pocniNovuIgru(){
	router.push({name: 'biranjeKaraktera'});
}

function logout(){
	loginStore.izlogujSe();
	router.push({name: "login"});
}

// Zvuk funkcija
function playWoosh() {
  const audio = new Audio('/woosh.mp3');
    audio.play();
}

function goToImpressions(){
	router.push({name: "impressions"});
}

function goToChangeUsernameEmailPassword(){
	router.push({name: "ChangeUsernameEmailPassword"});
}
function isUserOnMobileOrPc(){
	const width = window.innerWidth;
	const widthBelow768 = width <= 768;
	
	const userIsOnPhone = mobileHelper.isMobile();
  	const Skladiste = useSkladiste();
	if(userIsOnPhone){
    //user using phone
		Skladiste.setIsUserOnMobileToTrue();
     /*************Adapt size off the charachter for dekstop vs mobile***************/
    		Skladiste.setCharHeight(80);
    		Skladiste.setCharWidth(80);
    		Skladiste.setObstacleSize(50);
	}else{
    //user using pc
		Skladiste.setIsUserOnMobileToFalse();
    		Skladiste.setCharHeight(100);
    		Skladiste.setCharWidth(100);
    		Skladiste.setObstacleSize(100);
	}
	console.log("user on mobile: ", Skladiste.isUserOnMobile)
	console.log(width)
}
onMounted(()=>{
  window.addEventListener('resize', watchResize);
  const container = document.querySelector('.layout-container');
  const mobContainer = document.querySelector('.mobileLayoutContainer')
  animacijaInterfejs.loadPage(container);
  animacijaInterfejs.loadPage(mobContainer)
  isUserOnMobileOrPc();
})

onBeforeUnmount(() => {
	window.removeEventListener('resize', watchResize);
});

const mobileNavOpen = ref(false);

function toggleMobileNav() {
  mobileNavOpen.value = !mobileNavOpen.value;
}


</script>


<template>
<div class="wrap">
  <header class="navContainer" :class="{mobileNavContainerVertical: isPhoneVertical, 
  mobileNavContainerHorizontal: isPhoneHorizontal,
  navContainerDesktop: !isPhone}">
      <!--Mobile-->
      <div class="mobile-menu-icon" @click="toggleMobileNav">
      <span class="bar"></span>
      <span class="bar"></span>
      <span class="bar"></span>
    </div>
    <!-- Navigation Drawer (Mobile) -->
    <div class="mobile-nav" :class="{ open: mobileNavOpen }">
      <div class="navItem" @click="prekiniPrikazivanjeLeaderboarda">
        Glavna Stranica
      </div>
      <div @click="pushTo('gameMode')" class="navItem">
        Igraj Sad
    </div>
      <div @click="goToImpressions()" class="navItem">
        Recenzije
      </div>
      <div @click="pushTo('aboutUs')" class="navItem">
        O nama
      </div>
      <div @click="pushTo('GlobalLeaderboard')" class="navItem">
        Globalni Leaderboard
      </div>
      <div @click="goToChangeUsernameEmailPassword()" class="navItem">
        Korisnička Podešavanja
      </div>
    </div>
      <!--desktop-->
      <nav class="desktop-nav" v-if="!isPhone">
          <div class="navOptions">
            <span class="navItem" @click="prekiniPrikazivanjeLeaderboarda">
              Glavna Stranica
            </span>
            <span  @click="pushTo('gameMode')" class="navItem">
               Igraj Sad
            </span>
              <span @click="goToImpressions()" class="navItem">
                  Recenzije
              </span>
              <span @click="pushTo('aboutUs')" class="navItem">
                  O Nama
              </span>
              <span @click="pushTo('GlobalLeaderboard')" class="navItem">
                  Globalni Leaderboard
              </span>
              <span @click="goToChangeUsernameEmailPassword()" class="navItem">
                Korisnička Podešavanja
              </span>
          </div>
      </nav>
      <span @click="logout()" class="logout" style="cursor: pointer;">Izloguj se</span>
  </header>
  
  <div v-if="!prikazujeSeLeaderboard && !isPhone" class="layout-container">
    <img @click="pushTo('aboutUs')" @mouseover="playWoosh()" class="corner-img top-left" src="/graph_menu_about.png" alt="Top Left Image"> 
    <img @click="pushTo('GlobalLeaderboard')"  @mouseover="playWoosh()" class="corner-img top-right" src="/graph_menu_leaderboard.png" alt="Top Right Image" />
    <img @click="goToChangeUsernameEmailPassword()"  @mouseover="playWoosh()" class="corner-img bottom-left" src="/graph_menu_user_dash.png" alt="Bottom Left Image" />
    <img @click="goToImpressions()"  @mouseover="playWoosh()" class="corner-img bottom-right" src="/graph_menu_reviews.png"  alt="Bottom Right Image" />    
    <img @click="pushTo('gameMode')" @mouseover="playWoosh()" class="center-img" src="/graph_landingpage_centerpiece.png" alt="Center Image" />
  </div>
  
  
  <div v-else-if="!prikazujeSeLeaderboard" class="mobileLayoutContainer" 
  :class="{mobile_layout_vertical: isPhoneVertical,
  	mobile_layout_horizontal: isPhoneHorizontal}">
  	
    <img class="mobileImage" @click="pushTo('aboutUs')" @mouseover="playWoosh()" src="/graph_menu_about.png" alt="Top Left Image"/>
    	
    <img class="mobileImage" @click="pushTo('GlobalLeaderboard')"  @mouseover="playWoosh()" src="/graph_menu_leaderboard.png" alt="Top Right Image" />
    
   <img class="mobileImage_play" @click="pushTo('gameMode')" @mouseover="playWoosh()" src="/graph_landingpage_centerpiece.png" alt="start game image"/>	
        
    <img class="mobileImage" @click="goToChangeUsernameEmailPassword()"  @mouseover="playWoosh()" src="/graph_menu_user_dash.png" alt="Bottom Left Image" />
    <img class="mobileImage" @click="goToImpressions()"  @mouseover="playWoosh()" src="/graph_menu_reviews.png"  alt="Bottom Right Image" />    
  </div>
  <div v-if="prikazujeSeLeaderboard" class="leaderboard">
          <leaderboard-component :dobavljacLeaderboarda="dobavljacLeaderboarda" class="leaderboard" />
  </div>
  
 
  
</div>
</template>

<style scoped>

* {
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif, 'Trebuchet MS', Helvetica, sans-serif; 
  
  letter-spacing: 2px;
}
.mobileLayoutContainer{
  display: none;
}

.wrap{
	background-color: #3d90cd;
	position: absolute;
	height: 100vh;
	width: 100vw;
	top: 0px;
	left: 0px;
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
  .layout-container {
    display: none; /* Hide the desktop layout */
  }

  .mobileLayoutContainer {
    position: absolute;
    
    left: 0%;
    right: 0%;
    display: flex; /* Show the mobile layout */
    align-items: center;
    justify-content: center;
    justify-self: center;
  }
  
  .mobile_layout_vertical{
  	flex-direction: column;
  	max-width: 100%;
  	top:10vh;
  }
  
  .mobile_layout_horizontal{
  	flex-direction: row;
  	max-height: 100%;
  	top:12vh;
  }

  .mobile_layout_vertical > .mobileImage {
    display: block;
    min-width: 60vw;
    max-width: 100vw;
    min-height: 12vh;
    max-height: 15vh;
  }
  .mobile_layout_vertical > .mobileImage_play {
    display: block;
    min-width: 40vw;
    max-width: 60vw;
    min-height: 12vh;
    max-height: 15vh;
  }
  
  .mobile_layout_horizontal > .mobileImage {
    display: block;
    max-width: 18vw;
    max-height: 80vh;
  }
  
  .center-img{
    display: none;
  }
  .corner-img {
  display: none;
  }
  .top-left{
    margin-top: -8%;
  }
  .top-right{
    margin-top: 20%;
  }
  .bottom-left{
    margin-bottom:18%;
  }
  .bottom-right {
   margin-bottom: -5%;
  }
  .mobile-menu-icon {
    display: flex;
    flex-flow: column nowrap;
  }

  .desktop-nav {
    display: none;
  }
}

.layout-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-content: center;
  height: 100vh;
  background-color: #3d90cd;
  
}

.corner-img {
  position: absolute;
  width: 350px;
  height: 210px;
  transition: transform 1.5s ease; /* Add transition property */
  z-index: 1;
}

img:hover {
  transform: scale(1.5); /* Scale up on hover */
}
.top-left {
  top: 30px;
  left: 100px;
}
.logout{
  letter-spacing: 1px;
  justify-content: right;
}
.logout:hover {
  color: #3d90cd;
  transform: scale(1.1);
}
.top-right {
  top: 30px;
  right: 100px;
}

.bottom-left {
  bottom: 100px;
  left: 100px;
}

.bottom-right {
  bottom: 100px;
  right: 100px;
}

.center-img {
  transition: transform 1.5s ease; /* Add transition property */
  max-width: 100%;
  max-height: 100%;
  z-index: 0;
}
.navContainer {
    width: 100vw;
    background-color: #1450A3;
    color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 5%;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
}

.navContainerDesktop{
    height: 50px;
}

.mobileNavContainerVertical{
   height: 7vh;
}

.mobileNavContainerHorizontal{
   height: 12vh;
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
.leaderboard{
  background-color:#3d90cd;
}

.navItem:hover {
    color: #3d90cd;
    transform: scale(1.1);
}



</style>
