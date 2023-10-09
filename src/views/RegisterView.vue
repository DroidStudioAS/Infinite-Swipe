<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();

const mail = ref('');
const username = ref('');
const password = ref('');
const security_awnser = ref('')



function checkEmailFormat(email) {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return emailRegex.test(email);
}

async function register() {
  console.log(security_awnser.value);
  if (username.value.trim() === '' || password.value.trim() === '' || security_awnser.value.trim()==='') {
    alert('Morate uneti sve podatke!')
    return
  }
  if (!checkEmailFormat(mail.value)) {
    alert('Molimo vas unesite ispravan format email adrese!');
    return;
  }
  try {
       const formData = new FormData();
       formData.append("mail", mail.value);
       formData.append("username", username.value);
       formData.append("sifra",  password.value);
       formData.append("security_awnser", security_awnser.value );
        const res = await axios.post('http://181g123.e2.mars-hosting.com/kviz-projekat/login_register_logout/registracija_user',formData) 
       

        if(res.data.msg === 'User registrovan') {
        alert("Uspesno si se registrovao!")
        router.push({ name : 'login' })
      }else if(res.data.msg === 'Korisnicko ime zauzeto') {
        alert("Korisnicko ime zauzeto!")
      }else if(res.data.msg === 'Error: Email vec u upotrebi') {
        alert("Email vec u upotrebi!")
      }else {
        alert("Doslo je do greske!")
      }
    } catch(error) {
        console.log(error);
    } 
}


</script>

<template>
    <div class="registration-container">
      <div class="registration-form">
        <h2>Registracija</h2>
        <form>
          <label for="username">Korisničko Ime</label>
          <div class="username_container">
            <input type="text" id="username" v-model="username" placeholder="Korisničko ime" />
          </div>

          <label for="email">E-mail adresa</label>
          <div class="email_container">
            <input type="email" id="email" v-model="mail" placeholder="E-mail Adresa" />
          </div>
  
          <label for="password">Šifra</label>
          <div class="password_container">
            <input type="password" id="password" v-model="password" placeholder="Šifra" />
          </div>

          <label for="security_awnser">Koji ti je nadimak iz detinjstva?</label>
          <div class="password_container">
            <input type="text" id="security" v-model="security_awnser" placeholder="Zapamti me" />
          </div>
  
          <button @click.prevent="register">Registruj se</button>
        </form>
        <a href="/" class="A">Nazad na login</a>
      </div>
    </div>
  </template>

<style scoped>
* {
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
  letter-spacing: 2px;
}
.registration-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #3d90cd;
  position: relative;
}
.email_container,
.password_container,
.username_container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 5px;
}
.registration-form {
  background-color: #1450A3;
  color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 0px 20px rgb(0, 0, 0);
  width: 400px;
  text-align: center;
}
.registration-form h2 {
  margin-bottom: 20px;
}
.registration-form label {
  display: flex;
  justify-content: center;
  margin-bottom: 5px;
  text-align: left;
}
.registration-form input {
  width: 40%;
  padding: 8px;
  margin-bottom: 10px;
  border-radius: 10px;
  background-color: #fbe6e6;
  transition: width 2s ease,  background-color 2s ease;
}

.registration-form input:focus {
  width: 95%;
  background-color: #a09cff86;
}
.registration-form button {
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
.registration-form button:hover {
    transform: scale(1.25);
}
.A {
  font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
  text-decoration: none;
  color: aliceblue;
  transition: color 0.5s ease;
  transition: font-size 0.5s ease, color 0.5s ease;
}
.A:hover {
  color: black;
  font-size: large;
}
</style>