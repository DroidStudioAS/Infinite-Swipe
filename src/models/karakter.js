import { useSkladiste } from '../stores/Skladiste';

//obavezno export
export default class Character {

	

/* xDirection +1 znaci da igrac ide u desno, -1 znaci da ide u levo. */
	
	constructor(inputObject) {
	  	this.xOdLevo = inputObject.xOdLevo;
	 	this.yOdDna = inputObject.yOdDna;
	   	this.sirina = inputObject.sirina;
	    	this.visina = inputObject.visina;
	    	this.slika  = inputObject.slika;
	    	this.relativePictureHeight = inputObject.relativePictureHeight;
	    	this.realPictureHeight = Math.floor(this.visina * this.relativePictureHeight);
	    	this.obradilacPitanja = inputObject.obradilacPitanja;
	    	this.gameOverInterfejs = inputObject.gameOverInterfejs;
		this.gAcceleration = inputObject.gAcceleration;	    	
	    	this.xDirection = inputObject.xDirection;
		

	    	/* Sledeca tri direktno odredjuju kretanje character-a po x osi. */
	    	this.xBrzinaPoSekundi = 0;
	    	this.xBrzinaPoFrejmu = 0;
	    	this.xUbrzanjePoKvadratnojSekundi = 0;
	    	
	    	this.xBrzinaPoSekundiKojuDajeStrelica = 360.0;
	    	this.xOsminaBrzinePoSekundiKojuDajeStrelica = this.xBrzinaPoSekundiKojuDajeStrelica / 8;
	    	this.xGubitakBrzinePoSekundiBezStrelice = this.xBrzinaPoSekundiKojuDajeStrelica * 0.5;

	     	this.yMovement = {
			velocity: 0,
			acceleration: 0
		}

	    	this.yBoosting = false;
	    	this.sacuvanoStanjeKretanja = null;
	    	this.mojCSS = this.css();
	    	
	    	this.scoreRef = inputObject.scoreRef;
	    	this.brojTacnoOdgovorenihPitanja = 0;
	    	this.brojNetacnoOdgovorenihPitanja = 0;
	}
  
  	obradaNakonUdareneBombe(){
  		console.log("Udarena bomba.");
		const Skladiste = useSkladiste();
		console.log("game is over:" +Skladiste.gameIsOver)
		if(Skladiste.gameIsOver){
			return;
		}

 		Skladiste.decreaseLivesRemaining();
 		if (Skladiste.livesRemaining <= 0){
			console.log('bas lose ako nas ima vise')
 			setTimeout(this.gameOverInterfejs.funkcijaGameOver(),60000);
 		};
		
		
 	}
 	
 	obradaNakonUdareneZvezde(){
		const zvuk_score_plus = new Audio('/zvuk_plus_score.wav')
		const skladiste = useSkladiste();

 		console.log("Udarena zvezda.");
 		this.scoreRef.value += 1;
		zvuk_score_plus.play();

		skladiste.incrementScore();
		//skladiste.setScore(this.scoreRef.value);
		console.log("Score iz skladista: " + skladiste.score);
		
 	}
 	
 	obradaNakonUdarenogPitanja(){
 		console.log("Udaren znak pitanja.");
 		this.obradilacPitanja.obradiPitanje();
 	}
 	
 	
  
 	 nijeIspodEkrana(){
  		return this.yOdDna + this.visina > 0;
  	}
  
  
 	css(){
 	 	const cssIgraca = {
 	 		bottom: `${this.yOdDna}px`,
 	 		left: `${this.xOdLevo}px`,
 	 		width: `${this.sirina}px`,
 	 		height: `${this.visina}px`,
 	 		transform: `scaleX(${this.xDirection})`
  		};
  		//console.log(cssIgraca);
  		return cssIgraca;
  	} 
  	
  	updejtujSvojCSS(){
  		this.mojCSS = this.css();
  	}
  	
  	
 
	sudarioSeSPreprekom(prepreka){
 		return prepreka.sudarilaSeSLikom(this.xOdLevo, this.yOdDna, this.sirina, this.realPictureHeight);
 	}
 	
 	
 	moveLeft(preprekaAdapter, sirinaProzora, visinaProzora){
 		this.xDirection = -1;
 		this.xBrzinaPoSekundi = this.xBrzinaPoSekundiKojuDajeStrelica;
 	}
 	
 	moveRight(preprekaAdapter, sirinaProzora, visinaProzora){
 		this.xDirection = 1;
 		this.xBrzinaPoSekundi = this.xBrzinaPoSekundiKojuDajeStrelica;
 	}
 	
 	stopHorizontally(){
 		this.xBrzinaPoSekundi = 0;
 		this.xBrzinaPoFrejmu = 0;
 		this.xUbrzanjePoKvadratnojSekundi = 0;
 	}
 	
 	stopVertically(){
 		this.yMovement.velocity = 0;
 		this.yMovement.acceleration = 0;
 	}
 	
 	stop(){
 		this.stopHorizontally();
 		this.stopVertically();
 	}
	
	
	hasFloorBelowIt(){
		return this.yOdDna <= 0; 
	}

	jump(obstacleAdapter, howMuchItJumps){
		
    		if (this.hasFloorBelowIt()) {
			/* Od ovog trenutka pocinje slobodni pad, iako imamo pocetnu brzinu ka gore. Nema minusa ispred, jer je 
			gravitaciono ubrzanje vec negativno. */
     			this.yMovement.acceleration = this.gAcceleration;
			
			/* Kod gravitacije ubrzanje je konstanta g.
			 * Ovo ubrzanje je drugi izvod vertikalnog polozaja u jedinici vremena.
			 * ubrzanje = g
			 * Ako uradimo integral dobijamo 
			 * brzina = gt + konstanta1, gde je konstanta1 pocetna brzina.
			 * Ako uradimo jos jednom integral dobijamo 
			 * polozaj = (t/2)gt + pocetnaBrzina * t + pocetniY,
			 * tj. deltaY = (t/2)gt + pocetnaBrzina * t
			 * izolujemo pocetnaBrzina na desnoj strani jednacine
			 * (deltaY - (t/2)gt) / t = pocetnaBrzina
			 * Ovde g ima negativnu vrednost jer je ubrzanje na dole.
			 * Ovu jednacinu koristimo ukoliko u ovoj funkciji izracunavamo gravitaciono ubrzanje,
			 * tj. ne mozemo da lupimo t, deltaY i g, jer t i deltaY odredjuju g.
			 * Ako ne zelimo u ovoj funkciji da odredjujemo gravitaciono ubrzanje, onda 
			 * koristimo metodu ispod za izracunavanje pocetne brzine po y osi prilikom skoka.
			 *
			 * Na drugi nacin bismo mogli da razmatramo slucaj kad igrac pada, 
			 * da preko zakona odrzanja energije kazemo da mu je brzina kad padne dole jednaka pocetnoj brzini
			 * na gore u trenutku skoka, onda bismo dobili:
			 * 
			 * - deltaY = (t/2)gt jer je pocetna brzina 0.
			 * t = koren(- 2deltaY / g), 
			 * g je opet negativan broj, jer je ubrzanje na dole.
			 *
			 * Onda imamo v = gt, izostavljam pocetnu brzinu, jer je ona 0.
			 * t = v / g
			 * zamenimo u prethodnu jednacinu i dobijamo 
			 * v / g = koren( -2deltaY / g)
			 * v = koren( -2deltaY * g)
			 * 
			 * Kako je krajnja brzina nakon pada jedanaka pocetnoj brzini prilikom skoka,
			 * pocetna brzina prilikom skoka = koren(-2deltaY * g)
			 * A ako hocemo da deltaY gledamo kao pozitivan broj, onda je pocetna brzina prilikom skoka jednaka 
			 * koren( -2deltaY * g)
			 *
			 * Mi hocemo da deltaY bude visinaProzora / 3, tako da 
			 * v = koren( -2visinaProzora * g / 3)
			 * 
			 * */

			this.yMovement.velocity += Math.sqrt( -2 * howMuchItJumps * this.gAcceleration);	
    		}
  	}


  	
  	updatePositionAndMovement(inputObject){
  		const windowWidth = inputObject.windowWidth;
  		const windowHeight = inputObject.windowHeight;
  		const framesPerSecond = inputObject.framesPerSecond;
  		this.gAcceleration = inputObject.gAcceleration;
  		
  		this.updateX(windowWidth, windowHeight, framesPerSecond);
		this.updateY(windowWidth, windowHeight, framesPerSecond);
	}

	updateY(windowWidth, windowHeight, framesPerSecond){
		this.updateYAccelerationAndVelocity(windowWidth, windowHeight, framesPerSecond);
		this.updateYcoordinate(windowWidth, windowHeight, framesPerSecond)
	}

	updateYAccelerationAndVelocity(windowWidth, windowHeight, framesPerSecond){
		if (this.yOdDna > 0){
			this.yMovement.acceleration =  this.gAcceleration;
			const velocityChangePerFrame = this.yMovement.acceleration / framesPerSecond;
			this.yMovement.velocity += velocityChangePerFrame;
		} else {
			this.yMovement.acceleration = 0;
			if (this.yMovement.velocity < 0){
				this.yMovement.velocity = 0;
			}
		}
	}

	updateYcoordinate(windowWidth, windowHeight, framesPerSecond){
		const velocityPerFrame = this.yMovement.velocity / framesPerSecond;
		const potentialNextCoord = this.yOdDna + velocityPerFrame;
		let nextYcoord = potentialNextCoord;

		const playerAboveTheScreen = potentialNextCoord + this.visina >= windowHeight;
		const playerBelowTheScreen = potentialNextCoord <= 0;

		if (playerAboveTheScreen){
			this.yMovement.velocity *= -1;

			/* Promeni smer kretanja, zadrzi momentum. */
			nextYcoord = this.yOdDna - velocityPerFrame;	
		}
		if (playerBelowTheScreen){
			this.yMovement.velocity = (this.yMovement.velocity < 0)? 0 : this.yMovement.velocity;
			nextYcoord = 0;
		}

		this.yOdDna = nextYcoord;
	}

	updateX(windowWidth, windowHeight, framesPerSecond){
		this.updejtujXBrzinuIubrzanje(framesPerSecond);
  		this.updejtujXPolozaj(windowWidth, windowHeight, framesPerSecond);
	}
  	
  	
  	updejtujXBrzinuIubrzanje(brojFrejmovaPoSekundi){
  	
  		if (this.xBrzinaPoSekundi <= this.xOsminaBrzinePoSekundiKojuDajeStrelica){
  			this.xBrzinaPoSekundi = 0;
  			this.xBrzinaPoFrejmu = 0;
	    		this.xUbrzanjePoKvadratnojSekundi = 0;
  		} else {
  			
  			this.xUbrzanjePoKvadratnojSekundi = this.xGubitakBrzinePoSekundiBezStrelice;
  			
  			this.xBrzinaPoFrejmu = (this.xBrzinaPoSekundi - this.xUbrzanjePoKvadratnojSekundi /brojFrejmovaPoSekundi)/
  			brojFrejmovaPoSekundi;
  			
  			this.xBrzinaPoSekundi = this.xBrzinaPoFrejmu * brojFrejmovaPoSekundi;
  		}
  	}
 
 	
 	updejtujXPolozaj(sirinaProzora, visinaProzora, brojFrejmovaPoSekundi){

 		const pomeranjePoXosi = this.xBrzinaPoFrejmu * this.xDirection;
 		
 		let novaXkoordinata = this.xOdLevo + pomeranjePoXosi;
 		
 		const igracJeLevoVanEkrana = (novaXkoordinata <= 0);
 		const igracJeDesnoVanEkrana = (novaXkoordinata >= sirinaProzora - this.sirina);
 		const igracJeVanEkrana = igracJeLevoVanEkrana || igracJeDesnoVanEkrana;
 		
 		if (igracJeVanEkrana){
 			this.xDirection = -this.xDirection;
 			novaXkoordinata = this.xOdLevo - pomeranjePoXosi;
 		}
 		
 		this.xOdLevo = novaXkoordinata;
 	}
 
 	stani(){
 		this.xBrzinaPoFrejmu = 0;
 		this.xBrzinaPoSekundi = 0;
 		this.xUbrzanjePoKvadratnojSekundi = 0;
 	}
 	
 	sacuvajStanje(){
 		const ovajObjekat = this;
 		this.sacuvanoStanjeKretanja = {
 			xBrzinaPoSekundi: this.xBrzinaPoSekundi,
 			xBrzinaPoFrejmu: this.xBrzinaPoFrejmu,
 			xUbrzanjePoKvadratnojSekundi: this.xUbrzanjePoKvadratnojSekundi,
 			yBoosting: this.yBoosting,
 			yMovement: {
 				velocity: this.yMovement.velocity,
 				acceleration: this.yMovement.acceleration
 			}
 		};
 	}
 	
 	saveMovingStateAndStop(){
 		this.sacuvajStanje();
 		this.stop();
 	}
 	
 
 	
 	nastaviOdSacuvanogStanja(){
 		if (this.sacuvanoStanjeKretanja === null || this.sacuvanoStanjeKretanja === undefined){
 			alert("Sacuvano stanje kretanja nije definisano.");
 			return;
 		}
 		
 		const sacuvanoStanje = this.sacuvanoStanjeKretanja;
 		
 		this.xBrzinaPoSekundi = sacuvanoStanje.xBrzinaPoSekundi;
 		this.xBrzinaPoFrejmu = sacuvanoStanje.xBrzinaPoFrejmu;
 		this.xUbrzanjePoKvadratnojSekundi = sacuvanoStanje.xUbrzanjePoKvadratnojSekundi;
 		this.yBoosting = sacuvanoStanje.yBoosting;
 		
 		this.yMovement = sacuvanoStanje.yMovement;
 		Object.entries(sacuvanoStanje).forEach(s => console.log(s));
 		
 	}
 	
 	
 	 
}
  
