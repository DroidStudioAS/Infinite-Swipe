import Prepreka from '../preprekaRoditelj.js';

export default class ZnakPitanja extends Prepreka {
	constructor(xOdLevo, yOdDna, sirina, visina, slika, deltaX, deltaY){
		super(xOdLevo, yOdDna, sirina, visina, slika, deltaX, deltaY);
	}
	
	sudarSaIgracem(character){
		character.obradaNakonUdarenogPitanja();
	}
}
