import animacijaInterfejs from "../animacije/animacijaInterfejs";
import { useSkladiste } from "../stores/Skladiste";
import PreprekaAdapter from "./preprekaAdapter";


//obavezno export
class Prepreka {

  constructor(xOdLevo, yOdDna, sirina, visina, slika, deltaX, deltaY) {
    this.xOdLevo = xOdLevo;
    this.yOdDna = yOdDna;
    this.sirina = sirina;
    this.visina = visina;
    this.slika  = slika;
    this.deltaX = deltaX;
    this.deltaY = deltaY;
    //Flag koji ukazuje da li je objekat do sad bio u koliziji
   this.udaren = false;
   this.jeAnimirana = false;
  }
  
  static new(xOdLevo, yOdDna, sirina, visina, slika, deltaX, deltaY){return new Prepreka(xOdLevo, yOdDna, sirina, visina, slika, deltaX, deltaY);}
  
  animirajSeJednomLinearno(animacijaInterfejs, duration){
  	this.jeAnimirana = true;
  	animacijaInterfejs.animirajPreprekuJednom(this, duration, 'linear');
  }
  
  
  nijeIspodEkrana(){
  	return this.yOdDna + this.visina > 0;
  }
  
  jeIspodEkrana(){
  	return !this.nijeIspodEkrana();
  }
  
  isOutsideOfTheScreen(windowWidth, windowHeight){
  	return (
  				this.xOdLevo + this.sirina <= 0 || //prepreka je u krajnjem levom
				this.xOdLevo >= windowWidth || //prepreka je skroz desno
				this.yOdDna + this.visina <= 0 || //prepreka je ispod ivice
				this.yOdDna >= windowHeight //prepreka je iznad ivice
  	);
  }
  isOutsideOfTheScreenBackground(windowWidth, windowHeight){
	return (
			this.xOdLevo + this.sirina <= 0 || //prepreka je u krajnjem levom
			this.xOdLevo >= windowWidth || //prepreka je skroz desno
			this.yOdDna + this.visina <= 0  //prepreka je ispod ivice
			 );
		}
  
  
  css(){
  	return {
  		bottom: `${this.yOdDna}px`,
  		left: `${this.xOdLevo}px`,
  		width: `${this.sirina}px`,
  		height: `${this.visina}px`,
  		opacity: `${this.udaren? 0 : 1}`
  	};
  }

  
  // Metoda za proveru sudara sa likom
  sudarilaSeSLikom(likX, likYodDna, likSirina, likVisina) {
    const skladiste = useSkladiste();
    const likPravougaonik = {
      levo: likX,
      desno: likX + likSirina,
      gore: likYodDna + likVisina,
      dole: likYodDna 
    };
    
    const heightBy10 = this.visina / 10;
    
    
    const preprekaPravougaonik = {
      levo: this.xOdLevo,
      desno: this.xOdLevo + this.sirina,
      gore: this.yOdDna + this.visina - heightBy10,
      dole: this.yOdDna,
    };


    // Provera da li se lik sudara sa preprekom
    /* likPravougaonik.gore > preprekaPravougaonik.dole zato sto gore i dole predstavljaju udaljenost od poda, a ne od vrha. */
    const collision =
      likPravougaonik.levo < preprekaPravougaonik.desno &&
      likPravougaonik.desno > preprekaPravougaonik.levo &&
      likPravougaonik.gore > preprekaPravougaonik.dole &&
      likPravougaonik.dole < preprekaPravougaonik.gore;

    // Ako se sudar desio, ispisuje poruku u konzoli
    //dodao drugi uslov (da prepreka nije udarena);
    
    if (collision && !this.udaren) {
      this.udaren=true;
      console.log("Došlo je do sudara sa Preprekom!");
      skladiste.setBrojPrepreka(skladiste.brojPrepreka-1);

      
    }

    return collision;
  }
  
	
	
	randomizujPrepreku(sirinaProzora, visinaProzora){
			
			const xOdLevo = Math.random() * (sirinaProzora - this.sirina);
			const yOdDna = visinaProzora;
			const deltaX = Math.random() * sirinaProzora - xOdLevo;

               	/* -1 da bi bilo ispod dna */
			const deltaY = -visinaProzora - this.visina - 1;
			
			this.xOdLevo = xOdLevo;
			this.yOdDna = yOdDna;
			this.deltaX = deltaX;
			this.deltaY = deltaY;
	}
	
	/* Ovu metodu ce da implementiraju klase bomba, zvezda i pitanje. */
	sudarSaIgracem(character){console.log("Prepreka parent klasa je pozvana. Treba da se pozove metoda child klasa.");}
  
}


class Bomba extends Prepreka {
	constructor(xOdLevo, yOdDna, sirina, visina, slika, deltaX, deltaY){
		super(xOdLevo, yOdDna, sirina, visina, slika, deltaX, deltaY);
	}

	css(){
		return {
			bottom: `${this.yOdDna}px`,
			left: `${this.xOdLevo}px`,
			width: `${this.sirina}px`,
			height: `${this.visina}px`,
		};
	}
	
	
	static new(xOdLevo, yOdDna, sirina, visina, slika, deltaX, deltaY){return new Bomba(xOdLevo, yOdDna, sirina, visina, slika, deltaX, deltaY);}
	
	sudarSaIgracem = (character) => {
		
		const zvuk_eksplozija = new Audio('/zvuk_eksplozija.wav');
		zvuk_eksplozija.play();
		
		animacijaInterfejs.animateBoom(this);
	  
		// Call the function after a 3-second delay
		setTimeout(() => {
		  character.obradaNakonUdareneBombe();
		}, 2100);
		
	
	  };
	 

	static defaultBomba(){
		return new Bomba(0,0,50,50,"",0,0);
	}
}



class ZnakPitanja extends Prepreka {
	constructor(xOdLevo, yOdDna, sirina, visina, slika, deltaX, deltaY){
		super(xOdLevo, yOdDna, sirina, visina, slika, deltaX, deltaY);
	}
	
	static new(xOdLevo, yOdDna, sirina, visina, slika, deltaX, deltaY){return new ZnakPitanja(xOdLevo, yOdDna, sirina, visina, slika, deltaX, deltaY);}
	
	sudarSaIgracem(character){
		character.obradaNakonUdarenogPitanja();
	}
}




class Zvezda extends Prepreka {
	constructor(xOdLevo, yOdDna, sirina, visina, slika, deltaX, deltaY){
		super(xOdLevo, yOdDna, sirina, visina, slika, deltaX, deltaY);
	}
	
	static new(xOdLevo, yOdDna, sirina, visina, slika, deltaX, deltaY){return new Zvezda(xOdLevo, yOdDna, sirina, visina, slika, deltaX, deltaY);}
	
	css(){
		return {
			bottom: `${this.yOdDna}px`,
			left: `${this.xOdLevo}px`,
			width: `${this.sirina}px`,
			height: `${this.visina}px`,
		};
	}

	sudarSaIgracem(character){
		character.obradaNakonUdareneZvezde();
		animacijaInterfejs.animateStarToScore(this);

	}
	
	static defaultZvezda(){
		return new Zvezda(0,0,50,50,"",0,0);
	}
}


const Prepreke = {
newPrepreka: Prepreka.new, 
newBomba: Bomba.new,
newZnakPitanja: ZnakPitanja.new,
newZvezda: Zvezda.new
};

export default Prepreke;

