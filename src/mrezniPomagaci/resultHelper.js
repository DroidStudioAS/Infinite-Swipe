import axios from "axios";
import { parseCache } from "vue/compiler-sfc";
import { useSkladiste } from "../stores/Skladiste";

function stringToNumberArray(str, characterThatDividesElementsOfTheArray){
	const stringWithoutParenthesis = str.replace("[", "").replace("]","");

	const arrayOfNumbersAsStrings = stringWithoutParenthesis.split(characterThatDividesElementsOfTheArray);
	
	const trimmedNumbersAsStrings = arrayOfNumbersAsStrings.map(oneString => oneString.trim());
	
	const resultArray = trimmedNumbersAsStrings.map(numberAsString => parseInt(numberAsString));
	
	return resultArray;
}

function getBaseURL(){
	return "http://181g123.e2.mars-hosting.com/kviz-projekat/";
}

const resultHelper = {


    async getResults() {
        const Skladiste = useSkladiste();
        try {
            const rawUsername = localStorage.getItem("username");
            const user = rawUsername.replace(/"/g, '');
            console.log(rawUsername)
            console.log(user)
            const form = new FormData();
            form.append("user",user);
            const result = await axios.post(getBaseURL() + "campaign/returnRes",form);
            if (result.data === undefined || result.data === null){
            	console.log("resut.data doesn't exist when trying to fetch campaign results from backend.");
            	return;
            }
            const hisRes = stringToNumberArray(result.data.hisRes, ",");
            
            Skladiste.setCapmaignResultsOnMount(stringToNumberArray(result.data.gkRes, ","),0);
            Skladiste.setCapmaignResultsOnMount(stringToNumberArray(result.data.hisRes, ","),1);
            Skladiste.setCapmaignResultsOnMount(stringToNumberArray(result.data.sciRes, ","),2);
            Skladiste.setCapmaignResultsOnMount(stringToNumberArray(result.data.spRes, ","),3);
            Skladiste.setCapmaignResultsOnMount(stringToNumberArray(result.data.movRes, ","),4);
            Skladiste.setCapmaignResultsOnMount(stringToNumberArray(result.data.musRes, ","),5);

            console.log("after mutation")
            console.log(Skladiste.campaignResults)

        } catch (err) {
            console.log(err)
        } finally {
        }
    },
    
    async sendCampaignResult(){
    	const Skladiste = useSkladiste();
    	try{
    		const username = JSON.parse(localStorage.getItem("username"));
    		const url = getBaseURL() + "campaign/addScore";
    		const res = Skladiste.campaignResultsAsString();
    		
    		const body = {
    			username: username,
    			res: Skladiste.campaignResultsAsString()
    		};
    		
    		const serverResponse = await axios.post(url, body);
    		const serverData = serverResponse.data;
    	} catch (err){
    		console.log(err);
    	}
    }
    
   /* async getResults(){
    	const Skladiste = useSkladiste();
    	const url = getBaseURL() + "questions/queryByIdsGroupBy";
    	
    	const characterThatDividesIds = ",";
    	const ids = Skladiste.id_koje_necu_as_string(characterThatDividesIds);
    	const body = {
    		ids: ids
    	};
    	
    	try{
    		const serverResponse = await axios.post(url, body);
    		const serverData = serverResponse.data;
    		if (serverData === undefined || serverData === null){
    			console.log("Server data is undefined when trying to update campaign result");
    			return;
    		}
    			
    		const previousCampaignResult = Skladiste.campaignResult;
    		let everythingOK = true;
    		
    		const array = serverData.result;
    		for (const questionData of array){
    			const categoryIndex = Skladiste.mapCategoryToIndex(questionData.category);
    			const difficultyIndex = questionData.difficulty - 1;
    			const numberOfQuestions = questionData.numberOfQuestions;
    				
    			if (categoryIndex === null){
    				alert("Category from server does not correspond to categories on the frontend.");
    				everythingOK = false;
    				break;
    			}
    				
    			Skladiste.setCampaignResult(categoryIndex, difficultyIndex, numberOfQuestions);
    		}
    			
    		if (!everythingOK){
    			Skladiste.setEntireCampaignResult = previousCampaignResult;
    		}
    		
    		Skladiste.printCampaignResults();
    	}catch(err){
    		console.log(err);
    	}
    },*/
    
    
   
    
    
}
export default resultHelper
