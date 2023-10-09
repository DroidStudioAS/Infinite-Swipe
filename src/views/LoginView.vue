<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router';
import axios from 'axios';
import { useLoginStore } from '../stores/login';
import locationHelper from '../mrezniPomagaci/locationHelper';


const loginStore = useLoginStore();
const router = useRouter();

const username = ref('');
const password = ref('');

onMounted(() => {
  console.log("res za lokaciju: ", locationHelper.checkIfBrowserSupportsGeolocationApi());
  locationHelper.requestLocation();
	loginStore.izlogujSe();
});

async function login() {
if (username.value.trim() === '' || password.value.trim() === '') {
                alert('Morate uneti sve podatke!')
                return
            }
    try {
        const res = await axios.post('http://181g123.e2.mars-hosting.com/kviz-projekat/login_register_logout/login_user',  
        {username : username.value, sifra: password.value})
        if (res.data.success !== undefined) {
        const side = res.data.sid;
        if (side !== undefined && side !== null){
        	loginStore.setUlogovan();
        }
        const sidJson = JSON.stringify(side);
        localStorage.removeItem('sid');
        localStorage.setItem('sid', sidJson);
        
        const usernameJson = JSON.stringify(username.value);
        localStorage.removeItem('username');
        localStorage.setItem('username', usernameJson);
        router.push({name : 'pocetna'});
      }else if (res.data.msg === 'Error: Username/password inncorect') {
        alert("Username/password inncorect!")
      }else if (res.data.msg === 'username/sifra pogresna') {
        alert("Username/password inncorect")
      }else {
        alert("Error!")
      }
        } catch(e) {
          console.log(e);
      }
  }
  
  function play(){
  	
  }
</script>

<template>
  <div class="login-container">
      <div class="login-form">
      <h2>Login</h2>
      <form>
        <label for="username">Korisničko Ime</label>
        <div class="username_container">
          <input type="text" id="username" v-model="username" placeholder="Korisničko ime"/>
        </div>
        

        <label for="password">Šifra</label>
        <div class="password_container">
          <input type="password" id="password" v-model="password" placeholder="Šifra" />
        </div>

        <button @click.prevent="login" @mouseover="play()">Login</button>
      </form>
      <span>Nemaš nalog? <a href="/register" class="A">Registruj se ovde!</a></span>
      <span>Zaboravio Šifru? <a href="/resetPass" class="A">Resetuj ovde</a></span>
    </div>
  </div>
</template>

<style scoped>
* {
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
  letter-spacing: 2px;
}
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color:#3d90cd;
  position: relative;
}

.password_container,
.username_container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 5px;
}
.login-form {
  display: flex;
  flex-direction: column;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 0px 20px rgb(0, 0, 0);
  width: 400px;
  text-align: center;
  background-color: #1450A3;
  color: white;
}
.login-form h2 {
  margin-bottom: 20px;
}
.login-form label {
  display: flex;
  justify-content: center;
  margin-bottom: 5px;
  text-align: left;

}
.login-form input {
  width: 40%;
  padding: 8px;
  margin-bottom: 10px;
  border-radius: 10px;
}

.login-form button {
  background-color: #f9fffd;
  color: rgb(0, 0, 0);
  border: none;
  border-radius: 5px;
  padding: 10px 15px;
  cursor: pointer;
  margin-top: 10px;
  margin-bottom: 10px;
  transition: transform 0.5s ease, background-color 0.5s ease;
}
.login-form button:hover {
    transform: scale(1.25);
}
.A {
  font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
  text-decoration: none;
  color: #000000;
  transition: color 0.5s ease;
  transition: font-size 0.5s ease, color 0.5s ease;
}
.A:hover {
  color: #FFC436;
  font-size: large;
}
</style>
