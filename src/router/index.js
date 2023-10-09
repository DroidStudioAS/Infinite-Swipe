import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import IgricaView from '../views/IgricaView.vue'
import RegisterView from '../views/RegisterView.vue'
import PocetnaView from '../views/PocetnaView.vue'
import KrajIgre from '../views/KrajIgre.vue'
import BiranjeKaraktera from '../views/BiranjeKaraktera.vue'
import GameModeSelecter from '../views/GameModeSelecter.vue'
import AboutView from '../views/AboutView.vue'
import ResetPasswordView from "../views/ResetPasswordView.vue"
import { useLoginStore } from '../stores/login'
import KeyboardExplanationView from '../views/explanations/KeyboardExplanationView.vue'
import ImpressionsView from '../views/ImpressionsView.vue';
import LevelPicker from '../views/LevelPicker.vue'
import LevelOver from '../views/LevelPicker.vue'
import ChangeUsernameEmailPassword from '../views/accountSettings/ChangeUsernameEmailPassword.vue';
import SavingLoadingView from '../views/savedGame/SavingLoadingView.vue';
import SavingLoadingCampaign from "../views/campaign/SavingLoadingCampaign.vue";
import GlobalLeaderboard from '../views/GlobalLeaderboard.vue';



const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView
    },
    {
      path: '/about',
      name: 'aboutUs',
      component: AboutView
    },
    
    {
      path: '/register',
      name: 'register',
      component: RegisterView
    },
    {
      path: '/resetPass',
      name: 'resetPass',
      component: ResetPasswordView
    },
    {
    	path: '/pocetna',
    	name: 'pocetna',
    	component: PocetnaView,
      	meta: {
      		requiresLogin: true
      	}
    },
    {
    	path: '/keyboard-explanation',
	name: 'keyboardExplanation',
	component: KeyboardExplanationView,
	meta: {
		requiresLogin: true
	}
    },
    {
	path: '/save-load-games',
	name: 'SaveLoadGame',
	component: SavingLoadingView,
	meta: {
		requiresLogin: true
	}
    }, 
   {
    path: '/global-leaderboard',
    name: 'GlobalLeaderboard',
    component: GlobalLeaderboard,
    meta: {
    	requiresLogin: true
    }
   },
   {
    path: '/LevelPicker',
    name: 'levels',
    component: LevelPicker,
    meta: {
      requiresLogin: true
      }
   },
   {
     path: '/level-over',
     name: "LevelOver",
     component: LevelOver,
     meta: {
     	requiresLogin: true
     }
   },
   {
     path: '/saving-loading-arcade',
     name: "SavingLoadingCampaign",
     component: SavingLoadingCampaign,
     meta: {
     	requiresLogin: true
     }
   },
    
    {
    	path: '/kraj-igre',
    	name: 'krajIgre',
    	component: KrajIgre,
      	meta: {
      		requiresLogin: true
      	}
    },
    {
    	path: '/gameModeSelector',
    	name: 'gameMode',
    	component: GameModeSelecter,
      	meta: {
      		requiresLogin: true
      	}
    },
    {
    	path: '/biranje-karaktera',
    	name: 'biranjeKaraktera',
    	component: BiranjeKaraktera,
      	meta: {
      		requiresLogin: true
      	}
    },
    {
      path: '/igrica',
      name: 'igrica',
      component: IgricaView,
      meta: {
      	requiresLogin: true
      }
    },
    {
    	path: '/impressions',
    	name: 'impressions',
    	component: ImpressionsView,
    	meta: {
    		requiresLogin: true
    	}
    },
    {
    	path: '/change-username-email-password',
    	name: 'ChangeUsernameEmailPassword',
    	component: ChangeUsernameEmailPassword,
    	meta: {
    		requiresLogin: true
    	}
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresLogin) {
    const loginStore = useLoginStore();
    const weAreLoggedIn = loginStore.isLoggedIn();
    if (!weAreLoggedIn) {
      next('/')
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
