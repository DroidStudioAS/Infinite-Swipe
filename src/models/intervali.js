
const intervali = {
	napraviIntervale(flag, funkcijeIntervali){
		for(const fi of funkcijeIntervali){
			setInterval(() => {
				if (flag){
					fi.funkcija();
				}
			}, fi.interval);
		}
	},
	
	napraviInterval(funkcija, interval, flagoviRef){
		if (flagoviRef === undefined || flagoviRef === null || flagoviRef.length === 0){
			alert("flagRef za pauzu nije prosledjen funkciji napraviInterval");
			return;
		}
		
		return setInterval(() => {
			for (const flagRef of flagoviRef){
				if (!flagRef.value){
					return;
				}
			}
			funkcija();
			
		}, interval);
	}
};


/* Ovo je obavezno. */
export default intervali;


/*
//Ovako sam koristio u IgricaView fajlu.
  intervali.napraviIntervale(nijePauziran, [
  {
  	funkcija: () => {
  		preprekaAdapter.value.proveriSudar(igrac);
  		igrac.updejtujPolozaj(window.innerWidth, window.innerHeight, BROJ_FREJMOVA_PO_SEKUNDI);
  	}, 
  	interval: VREME_JEDNOG_FREJMA
  },
  
  {
  	funkcija: () => preprekaAdapter.value.izbaciPreprekeKojeNisuNaEkranu(window.innerWidth, window.innerHeight), 
  	interval: JEDNA_SEKUNDA
  },
  
  //dodato ogranicenje istovremenih prepreka na ekranu
  {
  	funkcija: () => {
  	// Uhvatimo length
  		brojPrepreka = preprekaAdapter.value?.prepreke.length;

  		if (brojPrepreka < 5) { // Use "<" instead of "<="
  		  	preprekaAdapter.value.napraviRendomPrepreku(window.innerWidth, window.innerHeight, sizeBombe, sizeBombe);
  		  	console.log("br: " + brojPrepreka);
 		 }
  	}, 
  	interval: 3 * JEDNA_SEKUNDA
  }]);
 */ 

