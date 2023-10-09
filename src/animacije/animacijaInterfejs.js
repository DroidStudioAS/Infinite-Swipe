import { gsap } from "gsap";
//Potrebni importi za piniu
import { createPinia } from "pinia"; 
import { useSkladiste } from "../stores/Skladiste";


const animacijaInterfejs = {
  
  animirajPrepreku(prepreka) {
    //definisemo skladiste
   
    gsap.to(
      prepreka, 
      {//krajnja pozicija
        sirina: prepreka.sirina,
        visina: prepreka.visina,
        xOdLevo: prepreka.xOdLevo + prepreka.deltaX,
        yOdDna: prepreka.yOdDna + prepreka.deltaY,
        //dodatna svojstva
        duration: 3,
     //   repeat: -1,
        ease:'linear'
     //   yoyo: true
      }
    );
    
    
  },
  
  animirajPreprekuJednom(prepreka, durationVreme, easeAnimacije){
  	gsap.to(prepreka, {
  		xOdLevo: prepreka.xOdLevo + prepreka.deltaX,
  		yOdDna: prepreka.yOdDna + prepreka.deltaY,
  		duration: durationVreme,
  		ease: easeAnimacije
  	});
  },
  
  
  animirajPreprekuDijagonalno(preprekica, sirinaEkrana, visinaEkrana) {
    const pocetnoX = preprekica.xOdLevo;
    const pocetnoY = preprekica.yOdDna;
    
    // generise random 1 ili -1 za smer
    const randomDirection = Math.random() < 0.5 ? -1 : 1;
    
    gsap.to(
      preprekica,
      {
        xOdLevo: 1000 * randomDirection, 
        yOdDna: -80, 
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'linear',
      }
    );
  },
  animirajLjuljanje(prepreka, sirinaEkrana) {
    //Treba da se obezbedi mehanizam za glatko pomeranje dole po y osi
    const pocetnoX = sirinaEkrana / 2; // gde ce se na x osi generisati bomba koja ljulja
    const randomYOffset = Math.random() * 700; //daje br izmedju 1 i 700, na kome ce se generisati bomba
    const pocetnoY = prepreka.yOdDna - 100 - randomYOffset;
    
    const randomSmer = Math.random() < 0.5 ? -1 : 1;
    
    gsap.fromTo(
      prepreka,
      {
        xOdLevo: pocetnoX,
        yOdDna: pocetnoY,
      },
      {
        xOdLevo: pocetnoX + 400 * randomSmer, //random smer menja da li ide levo desno ili desno levo
        yOdDna: pocetnoY,
        yoyo: true,
        repeat: -1,
        duration: 5,
        ease: 'linear',
      }
    );
  }
,  
animirajLjuljanjeNapredno(prepreka, sirinaEkrana) {
  // Početna X pozicija
  const pocetnoX = sirinaEkrana / 2;
  // Slučajan offset za Y osu
  const randomYOffset = Math.random() * 700;
  // Početna Y pozicija sa dodatnim offsetom
  const pocetnoY = prepreka.yOdDna - randomYOffset;
  // Slučajni smer (levo: -1, desno: 1)
  const randomSmer = Math.random() < 0.5 ? -1 : 1;

  // Kreiranje timeline-a
  const tl = gsap.timeline({ repeat: -1, yoyo: true, ease: 'linear' });

  // Prva animacija
  tl.to(prepreka, {
    yOdDna: pocetnoY - 10, // Pomakni se prema dole
    duration: 1,
    onUpdate: () => {
      const progress = tl.progress();
      const xDestination = pocetnoX + 200 * randomSmer;
      const yDestination = pocetnoY - 70; //pocetna vrednost - ukupno kolko se pomerio(-10-30-30)
      const currentX = pocetnoX + progress * (xDestination - pocetnoX);
      const currentY = pocetnoY + progress * (yDestination - pocetnoY);
      prepreka.xOdLevo = currentX;
      prepreka.yOdDna = currentY;
    },
  });

  // Druga animacija
  tl.to(prepreka, {
    xOdLevo: pocetnoX + 200 * -randomSmer,
    yOdDna: pocetnoY - 30, // Pomakni se još niže
    duration: 2,
  });

  // Treća animacija
  tl.to(prepreka, {
    xOdLevo: pocetnoX + 200 * randomSmer,
    yOdDna: pocetnoY - 30, // Pomakni se još niže
    duration: 2,
  });
}
,   
  randomAnimirajPrepreku(prepreka, sirinaEkrana, visinaEkrana, maksVreme, ponavljajBeskonacno){
  	gsap.fromTo(prepreka, 
  	{
  		xOdLevo: Math.random() * (sirinaEkrana - prepreka.sirina),
  		yOdDna: visinaEkrana
  	},
  	{
  		xOdLevo: Math.random() * (sirinaEkrana - prepreka.sirina),
  		yOdDna: 0,
  		duration: Math.random() * maksVreme,
  		repeat: ponavljajBeskonacno? -1 : 0,
  		ease: 'linear'
  	});
  },
  
  animirajScore(score){
  	gsap.to(score, {
  		y: 100,
  		repeat: -1,
  		duration: 1,
  		yoyo: true
  	})
  },
  animateStarToScore(prepreka) {
    const tl = gsap.timeline();
    //This is how much the star should initially grow
    prepreka.sirina *= 1.2;
    prepreka.visina *= 1.2;
    
    tl.to(prepreka, {
      xOdLevo: 0,
      yOdDna: window.innerHeight,
      sirina: prepreka.sirina,
      visina: prepreka.visina,
      duration: 0.5, // duration of the stars growth
      ease: 'linear'
    }).to(prepreka, {
      xOdLevo: 0,
      yOdDna: window.innerHeight, 
      sirina: 0,
      visina: 0,
      duration: 1, // Linear size reduction duration
      ease: 'linear'
    }, "-=0.5"); // Start the second animation half a second before the previous one ends
  },
   animateBoom(prepreka) {
    const Skladiste = useSkladiste();
    const frames = [
      '/frame_1.png',
      '/frame_2.png',
      '/frame_3.png',
      '/frame_4.png',
      '/frame_5.png',
      '/frame_6.png'
    ];
  
    const tl = gsap.timeline();
  
    prepreka.sirina *= 1.2;
    prepreka.visina *= 1.2;
    // Create a sequence of animations in the timeline
  tl.to(prepreka,{
    duration:0.85,
    deltaX: 0,
    deltaY: 0,
    xOdLevo: prepreka.xOdLevo,
    yOdDna: prepreka.yOdDna,
  })
    for (let i = 0; i < frames.length; i++) {
        tl.to(prepreka, {
        duration: 0.2,
        deltaX: 0,
        deltaY: 0,
        xOdLevo: prepreka.xOdLevo,
        yOdDna: prepreka.yOdDna,
        
        
        onComplete: () => {
          prepreka.slika = frames[i];
          prepreka.sirina=prepreka.sirina*1.2,
          prepreka.visina=prepreka.visina*1.2
        }
      });
    }
  
    // Start the timeline
    tl.play();
  },
  moveBombToYZero(prepreka) {
    gsap.to(prepreka, {
      duration: 1,
      y: 0
    });
  },
  loadPage(container) {
    const timeline = gsap.timeline();
  
    // Set the initial state of the container
    gsap.set(container, { opacity: 0, scale: 0 });
    
    // Define the animation
    timeline.to(container, {
      opacity: 1,
      scale: 1,
      duration: 1,
      ease: 'power2.out'
    });
  }
  ,

  
  //START/STOP ANIMATIONS
  pauzirajAnimacije(){
    gsap.globalTimeline.pause();
  },
  nastaviAnimacije(){
    gsap.globalTimeline.resume();
  }
  
  
};
//O BA VE ZNO
export default animacijaInterfejs;
