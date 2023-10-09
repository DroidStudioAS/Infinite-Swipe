<!-- -->
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
      <div  @click="pushTo('aboutUs')" class="navItem">
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
              <span @click="pushTo('aboutUs')" class="navItem">
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

  
</template>

<script setup>
import { ref } from 'vue';
import LeaderboardComponent from '../LeaderboardComponent.vue';
import pomagacLeaderboard from '../../mrezniPomagaci/pomagacLeaderboard.js';
import { useLoginStore } from '../../stores/login.js';
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

const mobileNavOpen = ref(false);

function toggleMobileNav() {
  mobileNavOpen.value = !mobileNavOpen.value;
}


</script>


<style scoped>
* {
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
  letter-spacing: 2px;
}
body{
background-color: #3d90cd;
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
  cursor: pointer;
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
