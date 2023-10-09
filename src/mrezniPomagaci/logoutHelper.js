import { createPinia } from "pinia"; 
import { useSkladiste } from "../stores/Skladiste";
import { useRouter } from "vue-router";
import PitanjeInfo from "../models/pitanja/pitanjeInfo";
import axios from "axios";


const logoutHelper ={
     async logout(){
        const router = useRouter();
        const sid = localStorage.getItem('sid');
        try{
            const logoutRes = await axios.get('http://181g123.e2.mars-hosting.com/kviz-projekat/login_register_logout/logout_user',{
                params:{
                    sid:sid
                }
            })
            console.log(logoutRes.data.msg)
            router.push('/');
        }catch(err){
            console.log(err)
        }
    }
}

export default logoutHelper
