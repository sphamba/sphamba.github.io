const TRANSITION_DURATION = 0.5;


class Slide {
	constructor(text, showForward=()=>0, hideForward=()=>0, showBackwards=()=>0, hideBackwards=()=>0, display=()=>0) {
		this.text = text;
		
		this.showForward = function() {  // transition in
			$("mainText").innerHTML = this.text;
			$("mainText").style.opacity = 1;
			showForward();
		};
		
		this.hideForward = function() { // transition out
			$("mainText").style.opacity = 0;
			hideForward();
		};
		
		this.showBackwards = function() {  // transition in
			$("mainText").innerHTML = this.text;
			$("mainText").style.opacity = 1;
			showBackwards();
		};
		
		this.hideBackwards = function() { // transition out
			$("mainText").style.opacity = 0;
			hideBackwards();
		};
		
		this.display = display; // continuous animation when displayed
	}
}


var transitioningSlide = false;


function transitionSlides(s1, s2, forward=true) {
	// hide s1 elements
	transitioningSlide = true;
	forward ? s1.hideForward() : s1.hideBackwards();
	
	$("mainText").ontransitionend = function() {
		// show s2 elements
		forward ? s2.showForward() : s2.showBackwards();
		
		$("mainText").ontransitionend = function() {
			$("mainText").ontransitionend = null;
			transitioningSlide = false;
			s2.display();
		};
	};
}

function transitionForward(s1, s2) {
	transitionSlides(s1, s2, true);
}

function transitionBackwards(s1, s2) {
	transitionSlides(s1, s2, false);
}


var emptySlide = new Slide("",
	()=>0,
	()=>0,
	()=>0,
	function() {
		$("diagram").style.opacity = 0;
		$("graph1").style.opacity = 0;
		$("graph2").style.opacity = 0;
		$("graph3").style.opacity = 0;
	});

var currentSlides = null;
var currentSlideId = 0;


function previousSlide() {
	if (transitioningScreen || transitioningSlide) return;
	if (currentSlideId > 0) {
		currentSlideId --;
		transitionBackwards(currentSlides[currentSlideId + 1], currentSlides[currentSlideId]);
	} else {
		showTitleScreen();
	}
}


function nextSlide() {
	if (transitioningScreen || transitioningSlide) return;
	if (currentSlideId < currentSlides.length - 1) {
		currentSlideId ++;
		transitionForward(currentSlides[currentSlideId - 1], currentSlides[currentSlideId]);
	} else {
		showTitleScreen();
	}
}

// init slides

var slidesWhat = [
	new Slide(`Welcome!<br>In this chapter, we will see how to simulate the evolution of an epidemic and explain what is <i>the Curve</i> everyone is worried about.`,
		function () {
			$("mainText").style.bottom = "45%";
		},
		()=>0,
		function () {
			$("mainText").style.bottom = "45%";
		}),
	
	new Slide(`WARNING<br>The presented simulations are greatly simplified compared to reality. Therefore, they are not intended to give precise and predictive numbers. The observed trends are still representative of reality.`,
		function() {
			$("mainText").style.bottom = "42%";
		},
		function () {
			diagram.reset();
			diagram.draw();
		},
		function() {
			$("mainText").style.bottom = "42%";
		}),
	
	new Slide(`To simulate an epidemic, we start with a batch of healthy people, <span class="S"><i>Susceptible</i> (S)</span> to get ill.`,
		function () {
			$("mainText").style.bottom = "5%";
			$("diagram").style.opacity = 1;
			
			setTimeout(function() {
				diagram.show("S");
			}, TRANSITION_DURATION * 1000);
		},
		function() {
			diagram.show("S_to_I");
		},
		()=>0,
		function() {
			diagram.hide("S");
		}),
	
	new Slide(`Susceptible people can get <span class="I"><i>Infected</i> (I)</span>.`,
		function() {
			diagram.show("I");
		},
		function() {
			diagram.show("I_to_R");
		},
		()=>0,
		function() {
			diagram.hide("I");
			diagram.hide("S_to_I");
		}),
	
	new Slide(`And Infected people <span class="R"><i>Recover</i> (R)</span>, acquiring an immunity to the disease.`,
		function() {
			diagram.show("R");
		},
		()=>0,
		()=>0,
		function() {
			diagram.hide("R");
			diagram.hide("I_to_R");
		}),
	
	new Slide(`This model is called the SIR model and is one of the simplest mathematical models capable of predicting the evolution of infectuous diseases.`,
		()=>0,
		function() {
			diagram.show("I_to_D");
		}),
	
	new Slide(`The SIR model can be extended by taking into account the people who <span class="D"><i>Died</i> (D)</span> after the infection.`,
		function() {
			diagram.show("D");
		},
		function() {
			diagram.show("R_to_S");
		},
		()=>0,
		function() {
			diagram.hide("D");
			diagram.hide("I_to_D");
		}),
	
	new Slide(`Furthermore, if acquired immunity is not permanent, <span class="R">Recovered</span> people can become <span class="S">Susceptible</span> again.`,
		()=>0,
		function() {
			$("diagram").style.opacity = 0;
			graph1.move(15, 20, 60, 60);
		},
		function() {
			$("diagram").style.opacity = 1;
		},
		function() {
			diagram.hide("R_to_S");
		}),
	
	new Slide(`The number of people in each state can be represented in a graph for every day following the initial infection.`,
		function() {
			timeEnd = 12;
			initialContamination = 0.01;
			contactsPerDay = 10;
			probInfection = 0.04;
			daysInfectious = 28;
			daysImmunity = Infinity;
			mortality = 0.2;
			hospitalCapacity = 0;
			isolationStart = Infinity;
			vaccineDay = Infinity;
			
			simulate();
			
			graph1.update();
			graph1.plotAll();
			graph1.show();
		},
		()=>0,
		()=>0,
		function() {
			graph1.hide();
		}),
	
	new Slide(`The amounts are given as percentages of the full population.`),
	
	new Slide(`On the far right of the graph, the values for the final shown day are indicated.`,
		()=>0,
		function () {
			graph1.move(25, 8, 40, 40);
			graph2.move(25, 52, 40, 40);
		},
		function() {
			graph1.move(15, 20, 60, 60);
		},),
	
	new Slide(`Let’s also show the number of <i>new cases per day</i>. Each day, a percentage of the population gets <span class="I">infected</span>, <span class="R">recover</span>, or <span class="D">die</span>. This is a typical graph given when trying to monitor the evolution of a disease.`,
		function() {
			graph2.update();
			graph2.plotAll();
			graph2.show();
		},
		()=>0,
		()=>0,
		function() {
			graph2.hide();
		}),
	
	new Slide(`The evolution of the number of <span class="I">Infected</span> people follows what is called an <i>exponential growth</i>. It means that <u>the number of <span class="I">new cases</span> per day is proportional to the number of <span class="I">current cases</span></u>. <span class="I">Infection</span> is more likely when there are <span class="I">Infected</span> people around.`),
	
	new Slide(`When the number of <span class="I"><i>current</i> cases</span> increases, the number of <span class="I"><i>new</i> appearing cases</span> also increases, and vice-versa. It seems like it will never stop! But let's look a bit further in time...`,
		()=>0,
		function() {
			showSliders();
			selectVisibleSliders({});
			moveSliders(70);
			
			launchAnimation(function(x) {
				sliders.timeEnd.update(ease(x, 12, 45));
			}, true, true, false);
		},
		function() {
			hideSliders();
		}),
	
	new Slide(`Actually, <u>the number of <span class="I">new cases</span> is also proportional to the number of remaining <span class="S">Susceptible</span> people</u>, so it reaches a maximum value when this number gets too low (see the peak in the right graph).`,
		function() {
			selectVisibleSliders({
				timeEnd: true
			});
		},
		()=>0,
		()=>0,
		function() {
			let timeEndInit = sliders.timeEnd.sliderValue;
			launchAnimation(function(x) {
				sliders.timeEnd.update(ease(x, timeEndInit, 12));
			}, true, true, false);
			
			sliders.timeEnd.hide();
		}),
	
	new Slide(`Thank to this, the maximum recorded number of <span class="I">Infected</span> people stays below 100%. Play with the cursor to see how the epidemic settles out.`),
	
	new Slide(`Do you see the <span class="I">red bell-shaped curve</span> on the left graph of current cases? This is <i>the Curve</i> we have to flatten! Take a look at the next chapters to learn <i>How</i> to do it and <i>Why</i> we have to.`)
];


var slidesHow = [
	new Slide(`In construction...`,
		function() {
			$("mainText").style.bottom = "48%";
		})
];

// contacts per day, prob infection, R0 (basic reproductive number)
// infection duration (uncontrolled)


var slidesWhy = [
	new Slide(`In construction...`,
		function() {
			$("mainText").style.bottom = "48%";
		})
];

//


playground = [
	new Slide(``,
		function() {
			moveSliders(70, 0);
			showSliders();
			
			sliders.timeEnd.update(182);
			sliders.initialContamination.update(0.1);
			sliders.contactsPerDay.update(10);
			sliders.probInfection.update(0.2);
			sliders.daysBeforeHospital.update(4);
			sliders.daysInfectious.update(10);
			sliders.hospitalCapacity.update(0.224);
			sliders.daysImmunity.update(62);
			sliders.isolationStart.update(366);
			sliders.mortality.update(0.316);
			sliders.isolationDuration.update(366);
			sliders.mortalityHospital.update(0.141);
			sliders.vaccineDay.update(731);
			sliders.contactsPerDayIsolation.update(2);
			
			selectVisibleSliders({
				timeEnd:                 true,
				initialContamination:    true,
				contactsPerDay:          true,
				probInfection:           true,
				daysBeforeHospital:      true,
				daysInfectious:          true,
				hospitalCapacity:        true,
				daysImmunity:            true,
				isolationStart:          true,
				mortality:               true,
				isolationDuration:       true,
				mortalityHospital:       true,
				vaccineDay:              true,
				contactsPerDayIsolation: true
			});
			
			simulate();
			
			graph1.move(7, 5, 55, 55);
			graph1.update();
			graph1.plotAll();
			graph1.show();
			
			graph2.move(2, 63, 32, 32);
			graph2.update();
			graph2.plotAll();
			graph2.show();
			
			graph3.move(35, 63, 32, 32);
			graph3.update();
			graph3.plotAll();
			graph3.show();
		})
];