<template>
    <div class="login-container">
      <div v-if="showFirstForm" class="login-form">
        <label for="username">Korisniško Ime</label>
        <div class="username_container">
          <input type="text" id="username" v-model="username" placeholder="Koriničko Ime"/>
        </div>
  
        <label for="security">Koji ti je nadimak iz Detinjstva</label>
        <div class="username_container">
          <input type="text" id="security" v-model="security" placeholder="?"/>
        </div>
        <div>
          <button @click="checkAwnser">Potvrdi</button>
        </div>
        <a href="/" class="A">Nazad na login</a>
       
      </div>
  
      <!-- Conditional password change form -->
      <div v-else class="login-form">
        Dobrodošli:  {{ username }}
        <label for="password">Nova Šifra:</label>
        <div class="password_container">
          <input type="password" id="password" v-model="newPassword" placeholder="New Password" />
        </div>
  
        <label for="confirmPassword">Potvrdi Novu Šifru</label>
        <div class="password_container">
          <input type="password" id="confirmPassword" v-model="confirmNewPassword" placeholder="Confirm New Password" />
        </div>
  
        <button @click="changePassword">Promeni Šifru</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import axios from 'axios';
  
  const router = useRouter();
  
  const username = ref('');
  const security = ref('');
  
  const newPassword = ref('');
  const confirmNewPassword = ref('');
  
  const showFirstForm = ref(true);
  
  async function checkAwnser() {
      try {
          const rez = await axios.get('http://181g123.e2.mars-hosting.com/kviz-projekat/login_register_logout/is_security_awnser_correct', {
              params: {
                  username: username.value,
                  security: security.value
              }
          });
          if (rez.data.msg === 'correct') {
              showFirstForm.value = false; // Hide first form
          } else {
              alert('Incorrect security answer.');
          }
      } catch (error) {
          console.error(error);
      }
  }
  
  async function changePassword() {
      if (newPassword.value.trim() === "" || confirmNewPassword.value.trim() === "") {
          alert('Fill in the new passwords');
      }
  
      try {
          const rez = await axios.get('http://181g123.e2.mars-hosting.com/kviz-projekat/login_register_logout/reset_pass', {
              params: {
                  username: username.value,
                  new_pass: newPassword.value,
                  confirmed: confirmNewPassword.value
              }
          });
          
          if (rez.data.msg === "success") {
              router.push({ name: 'login' }); // Use the router to navigate
          }
      } catch (error) {
          console.error(error);
      } finally {
          // ...
      }
  }
  </script>
  
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
    background-color: #3d90cd;
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
    background-color: #fbe6e6;
    transition: width 2s ease,  background-color 2s ease;
  }
  .login-form input:focus {
    width: 95%;
    background-color: #a09cff86;
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
    color: aliceblue;
    transition: color 0.5s ease;
    transition: font-size 0.5s ease, color 0.5s ease;
  }
  .A:hover {
    color: black;
    font-size: large;
  }
  </style>
  