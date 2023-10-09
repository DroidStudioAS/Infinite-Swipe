import axios from 'axios';

const osnovniUrl = "http://181g123.e2.mars-hosting.com/kviz-projekat";

const pomagacLeaderboard = {
	
	
	async nabaviLeaderboardKorisnika(username, brojScorova){
		let scores = null;
		const url = osnovniUrl + "/leaderboard/querybyusername?username=" + username + "&broj_scorova=" + brojScorova;
		
		try{
			const odgovorServera = await axios.get(url);
			const odgovorData = odgovorServera.data;
			Object.entries(odgovorData).forEach(odg => console.log(odg));
			
			const scoresSaServera = odgovorData.scores;
			if (scoresSaServera === null || scoresSaServera === undefined){
				console.log("Nema scores sa servera koji odgovaraju username-u " + username);
				return null;
			}
			
			scores = [];
			for(let i=0; i<scoresSaServera.length; i++){
				scores[i] = scoresSaServera[i];
				scores[i].username = username;
				console.log(i + ": score = " + scores[i].score);
			}
		}catch(error){
			console.log(error);
		}

		return scores;
	},
	async getHighScore(username){
		const url = osnovniUrl + "/leaderboard/getHighScore"
		try{
			const res = await axios.get(url,{
				params:{
					username:username
				}
			})
			return res.data.msg;
		}catch(err){
			console.log(err)
		}
	},
	async nabaviGlobalniLeaderboard(brojScorova){
		let scores = null;
		const url = osnovniUrl + "/leaderboard/queryglobalno?broj_scorova=" + brojScorova;
		
		try{
			const odgovorServera = await axios.get(url);
			const odgovorData = odgovorServera.data;
			const scoresSaServera = odgovorData.scores;
			
			scores = [];
			for(let i=0; i<scoresSaServera.length; i++){
				scores[i] = scoresSaServera[i];
			}
			
		}catch(error){
			console.log(error);
		}
		

		return scores;
	},
	
	
	
	async insertNoviScore(score, savedGameId = null){
		const url = osnovniUrl + "/leaderboard/insert";
		
		const username = JSON.parse(localStorage.getItem("username"));
		if (username === null || username === undefined){
			alert("Nema usernem-a u local storage-u.");
			return;
		}
		
		const sid = JSON.parse(localStorage.getItem("sid"));
		if (sid === null || sid === undefined){
			alert("Niste ulogovani.");
			return;
		} 
		let body = {username: username, sid: sid, score: score};
		if (savedGameId != null){
			body.saved_game_id = savedGameId;
		}

		try{
			const odgovorServera = await axios.post(url, body);
			const odgovorData = odgovorServera.data;

		}catch(error){
			console.log(error);
		}
	}
};


export default pomagacLeaderboard;
