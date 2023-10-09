
/* import Prepreka from './preprekaRoditelj';
import Bomba from './preprekaRoditelj';
import ZnakPitanja from './preprekaRoditelj';
import Zvezda from './preprekaRoditelj'; */
import Prepreke from './preprekaRoditelj';
import animacijaInterfejs from '../animacije/animacijaInterfejs';
import { createPinia } from "pinia"; 
import { useSkladiste } from '../stores/Skladiste';



export default class PreprekaAdapter{


	constructor(prepreke, slikaBombe, slikaZvezde, slikaPitanja){
		this.prepreke = prepreke;
		this.slikaBombe = slikaBombe;
		this.slikaZvezde = slikaZvezde;
		this.slikaPitanja = slikaPitanja;
	}
	
	izbaciPreprekeKojeNisuNaEkranu(sirinaProzora, visinaProzora){
		const skladiste = useSkladiste();
		const poslednjiIndeks = this.prepreke.length - 1;
		
		let i = poslednjiIndeks;
		while (i >= 0){
			const prepreka = this.prepreke[i]
			//modifikovan uslov da izbacuje sve sto nije na ekranu
			if (
				prepreka.xOdLevo + prepreka.sirina <= 0 || //prepreka je u krajnjem levom
				prepreka.xOdLevo >= sirinaProzora || //prepreka je skroz desno
				prepreka.yOdDna + prepreka.visina <= 0 || //prepreka je ispod ivice
				prepreka.yOdDna >= visinaProzora //prepreka je iznad ivice
			  ) {
				this.prepreke.splice(i, 1);
				console.log("element izbacen");
				skladiste.setBrojPrepreka(skladiste.brojPrepreka-1);

			  }
			
			i--;
		}
	}
	
	izbaciSvePrepreke(){
		this.prepreke = [];
	}
	
	push(prepreka){
		const Skladiste = useSkladiste();
		const brojPrepreka = this.prepreke.push(prepreka);
		Skladiste.setBrojPrepreka(brojPrepreka);
		return brojPrepreka;
	}
	
	pushVratiReferencuUbacenePrepreke(prepreka){
		const Skladiste = useSkladiste();
		const brojPrepreka = this.prepreke.push(prepreka);
		const indeksPrepreke = brojPrepreka - 1;
		const ubacenaPrepreka = this.prepreke[indeksPrepreke];
		Skladiste.setBrojPrepreka(brojPrepreka);
		
		return ubacenaPrepreka;
	}
	
	pushIAnimirajLjujanjeNapredno(prepreka, sirinaProzora, visinaProzora){
		const referencaUbacenePrepreke = this.pushVratiReferencuUbacenePrepreke(prepreka);
		referencaUbacenePrepreke.jeAnimirana = true;
		animacijaInterfejs.animirajLjujanjeNapredno(referencaUbacenePrepreke, sirinaProzora);
	}
	
	pushIAnimirajPrepreku(prepreka, sirinaProzora, visinaProzora){
		const referencaUbacenePrepreke = this.pushVratiReferencuUbacenePrepreke(prepreka);
		referencaUbacenePrepreke.jeAnimirana = true;
		animacijaInterfejs.animirajPrepreku(referencaUbacenePrepreke);
	}
	
	pushIAnimirajPreprekuJednom(prepreka, sirinaProzora, visinaProzora, duration){
		const referencaUbacenePrepreke = this.pushVratiReferencuUbacenePrepreke(prepreka);
		referencaUbacenePrepreke.jeAnimirana = true;
		animacijaInterfejs.animirajPreprekuJednom(referencaUbacenePrepreke, duration, 'linear');
	}

	
	getPrepreka(indeks){
		return this.prepreke[indeks];
	}
	
	length(){
		return this.prepreke.length;
	}
	
	
	proveriSudar(character){
		let sudarSeDesio = false;
		let sudarenaPrepreka = null;
		
		const poslednjiIndeks = this.prepreke.length - 1;
		
		for(let i = poslednjiIndeks; i >= 0; i--){
			if (this.prepreke[i].udaren) {continue;}
			
			if (character.sudarioSeSPreprekom(this.prepreke[i])){
				//menja udarenost na true (na frontu ce postati nevidljiva)
				this.prepreke[i].udaren=true;
				sudarSeDesio = true;
				sudarenaPrepreka = this.prepreke[i];
				break;
			} 
		}
		
		sudarenaPrepreka?.sudarSaIgracem(character);
		return sudarSeDesio;
	}
	
	

	napraviRendomPreprekuTest(sirinaProzora, visinaProzora, sirinaPrepreke, visinaPrepreke){
		const Skladiste = useSkladiste();
		if(Skladiste.nijePauziran){
			
			
			const xOdLevo = Math.random() * (sirinaProzora - sirinaPrepreke);
			const yOdDna = visinaProzora;
			const deltaX = Math.random() * sirinaProzora - xOdLevo;

               	/* -1 da bi bilo ispod dna */
			const deltaY = -visinaProzora - visinaPrepreke - 1;
		
			const novaPrepreka = new Prepreka(xOdLevo, yOdDna, sirinaPrepreke, visinaPrepreke, this.slikaBombe, deltaX, deltaY);
		
			/* push vraca length niza. */
			const lenght = this.push(novaPrepreka);
		
			const indeksNovePrepreke = lenght - 1;
			/********************POZIV NA ANIMACIJU************************/
			animacijaInterfejs.animirajPrepreku(this.prepreke[indeksNovePrepreke]);
			//animacijaInterfejs.animirajLjuljanjeNapredno(this.prepreke[indeksNovePrepreke], sirinaProzora);
			//animacijaInterfejs.animirajPreprekuDijagonalno(this.prepreke[indeksNovePrepreke],sirinaProzora,visinaProzora);
		}
	}
	
	napraviRendomPrepreku(sirinaProzora, visinaProzora, sirinaPrepreke, visinaPrepreke){
		let prepreka = null;
		const kojuCemoPrepreku = Math.random() * 3;
		if (kojuCemoPrepreku <= 1){
			prepreka = Prepreke.newBomba(0,0, sirinaPrepreke, visinaPrepreke, this.slikaBombe, 0, 0);
		} else if (kojuCemoPrepreku <= 2){
			prepreka = Prepreke.newZvezda(0,0, sirinaPrepreke, visinaPrepreke, this.slikaZvezde, 0, 0);
		} else {
			prepreka = Prepreke.newZnakPitanja(0,0, sirinaPrepreke, visinaPrepreke, this.slikaPitanja, 0, 0);
		}
		
		prepreka.randomizujPrepreku(sirinaProzora, visinaProzora);
		
		const duration = 1 + Math.random() * 3;
		this.pushIAnimirajPreprekuJednom(prepreka, sirinaProzora, visinaProzora, duration);
	}
	
	makeWeightedRandomObstacle(inputObject){
		const obstacle = this.getBombStarOrQuestion({
			bombWeight: inputObject.bombWeight,
			starWeight: inputObject.starWeight,
			questionWeight: inputObject.questionWeight,
			
			obstacleWidth: inputObject.obstacleWidth,
			obstacleHeight: inputObject.obstacleHeight,
			
		});
		
		obstacle.randomizujPrepreku(
		inputObject.windowWidth, 
		inputObject.windowHeight);
		
		const duration = inputObject.minPeriodInSeconds + 
		Math.random() * (inputObject.maxPeriodInSeconds - inputObject.minPeriodInSeconds);
		
		this.pushIAnimirajPreprekuJednom(obstacle, inputObject.windowWidth, inputObject.windowHeight, duration);
	}

	makeWeightedRandomObstacleHorizontalFall(inputObject){
		const obstacle = this.getBombStarOrQuestion({
			bombWeight: inputObject.bombWeight,
			starWeight: inputObject.starWeight,
			questionWeight: inputObject.questionWeight,
			
			obstacleWidth: inputObject.obstacleWidth,
			obstacleHeight: inputObject.obstacleHeight,
			
		});
		
		obstacle.randomizujPrepreku(
		inputObject.windowWidth, 
		inputObject.windowHeight);
		
		obstacle.deltaX = 0;

		const duration = inputObject.minPeriodInSeconds + 
		Math.random() * (inputObject.maxPeriodInSeconds - inputObject.minPeriodInSeconds);
		
		this.pushIAnimirajPreprekuJednom(obstacle, inputObject.windowWidth, inputObject.windowHeight, duration);
	}
	
	
	getBombStarOrQuestion(inputObject){
		const totalWeight = inputObject.bombWeight + inputObject.starWeight + inputObject.questionWeight;
		
		const bombProbability = 100 * inputObject.bombWeight / totalWeight;
		const starProbability = 100 * inputObject.starWeight / totalWeight;
		const questionProbability = 100 * inputObject.questionWeight / totalWeight;
		
		let obstacle = null;
		const randomFrom0to100 = Math.random() * 100;
		if (randomFrom0to100 <= bombProbability){
			obstacle = Prepreke.newBomba(0,0, inputObject.obstacleWidth, inputObject.obstacleHeight, this.slikaBombe, 0,0);
		} else if (randomFrom0to100 <= bombProbability + starProbability){
			obstacle = Prepreke.newZvezda(0,0, inputObject.obstacleWidth, inputObject.obstacleHeight, this.slikaZvezde, 0,0);
		} else {
			obstacle = Prepreke.newZnakPitanja(0,0, inputObject.obstacleWidth, inputObject.obstacleHeight, this.slikaPitanja, 0, 0);			
		}
		
		return obstacle;
	}
	
	
	
}
