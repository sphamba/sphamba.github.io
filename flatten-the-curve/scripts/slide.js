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
		graph1.hode();
		graph2.hode();
		graph3.hode();
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
	new Slide(`Welcome!<br>In this first chapter, we will see how to simulate the evolution of an epidemic and explain what is <i>the Curve</i> everyone is worried about.`,
		function () {
			$("mainText").style.bottom = "45%";
		},
		()=>0,
		function () {
			$("mainText").style.bottom = "45%";
		}),
	
	new Slide(`<b>WARNING</b><br><br>The presented simulations are greatly simplified compared to reality. Therefore, they are not intended to give precise and predictive numbers. The observed trends are still representative of reality.`,
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
	
	new Slide(`<span class="S">Susceptible</span> people can get <span class="I"><i>Infected</i> (I)</span>.`,
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
	
	new Slide(`And <span class="I">Infected</span> people <span class="R"><i>Recover</i> (R)</span>, acquiring an immunity to the disease.`,
		function() {
			diagram.show("R");
		},
		()=>0,
		()=>0,
		function() {
			diagram.hide("R");
			diagram.hide("I_to_R");
		}),
	
	new Slide(`This model is called the <i>SIR model</i> and is one of the simplest mathematical models capable of predicting the evolution of infectuous diseases.`,
		()=>0,
		function() {
			diagram.show("I_to_D");
		}),
	
	new Slide(`The SIR model can be extended by taking into account the people who <span class="D"><i>Died</i> (D)</span> after the <span class="I">infection</span>.`,
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
			sliders.timeEnd.update(10);
			
			initialContamination = 0.01;
			contactsPerDay = 10;
			probInfection = 0.04;
			daysInfectious = 28;
			daysImmunity = Infinity;
			mortality = 0.1;
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
	
	new Slide(`The amounts are given as percentages of the full population. Here, 1% of the population is initially <span class="I">Infected</span>.`),
	
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
	
	new Slide(`The evolution of the number of <span class="I">Infected</span> people follows what is called an <i>exponential growth</i>. It means that <u>the number of <span class="I">new cases</span> per day is proportional to the number of <span class="I">current cases</span></u>. <span class="I">Infection</span> is more likely when there are more <span class="I">Infected</span> people around.`),
	
	new Slide(`When the number of <span class="I"><i>current</i> cases</span> increases, the number of <span class="I"><i>new</i> appearing cases</span> also increases, and vice-versa. It seems like it will never stop! But let's look a bit further in time...`,
		()=>0,
		function() {
			showSliders();
			selectVisibleSliders({});
			moveSliders(70);
			
			sliders.timeEnd.animTo(45, true, true, false);
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
			sliders.timeEnd.animTo(10, true, true, false);
			sliders.timeEnd.hide();
		}),
	
	new Slide(`Thank to this, the maximum recorded number of <span class="I">Infected</span> people stays below 100%. Play with the cursor to see how the epidemic settles out.`),
	
	new Slide(`Do you see the <span class="I">red bell-shaped curve</span> on the left graph of current cases? This is <i>the Curve</i> we have to flatten! Take a look at the next chapters to learn <i>How</i> to do it and <i>Why</i> we have to.`)
];


var slidesHow = [
	new Slide(`Let's go back to our graph of current cases per day.`,
		function() {
			$("mainText").style.bottom = "5%";
			graph1.move(15, 20, 60, 60);
			
			sliders.timeEnd.             update(180);
			sliders.initialContamination.update(-2);   // 1%
			sliders.contactsPerDay.      update(10);
			sliders.probInfection.       update(0.2);   // 4%
			sliders.daysInfectious.      update(10);
			sliders.daysImmunity.        update(366);   // forever
			sliders.mortality.           update(0.316); // 10%
			
			sliders.isolationStart.         update(366);   // never
			sliders.isolationDuration.      update(366);   // forever
			sliders.contactsPerDayIsolation.update(3);
			sliders.vaccineDay.             update(731);   // never
			
			hospitalCapacity = 0;
			
			simulate();
			
			graph1.update();
			graph1.plotAll();
			graph1.show();
			
			showSliders();
			selectVisibleSliders({});
			moveSliders(70);
		}),
	
	new Slide(`We recall that our aim is to reduce the height of the <span class="I">red curve</span>, showing the number of <span class="I">Infected</span> people per day.`,
		()=>0,
		function() {
			showSliders();
			selectVisibleSliders({});
			moveSliders(70);
			graph1.move(5, 20, 60, 60);
		},
		function() {
			hideSliders();
			graph1.move(15, 20, 60, 60);
		}),
	
	new Slide(`Many parameters influence <i>the Curve</i>. Let's take a look at a first one: the average <i>infection duration</i>.`,
		function() {
			sliders.daysInfectious.show();
		},
		function() {
			sliders.daysInfectious.animTo(28);
		},
		()=>0,
		function() {
			selectVisibleSliders({});
		}),
	
	new Slide(`See how greatly the height of <i>the Curve</i> is influenced by this parameter. When the people are <span class="I">ill</span> for longer, they have a higher chance of <span class="I">spreading the disease</span>.`,
		()=>0,
		function() {
			sliders.daysInfectious.hide();
			sliders.daysInfectious.animTo(10);
		},
		function() {
			sliders.daysInfectious.show();
		},
		function() {
			sliders.daysInfectious.animTo(10);
		}),
	
	new Slide(`Another parameter can influence <i>the Curve</i>. It is the <i>duration of the immune period</i>, which is not necesarily permanent.`,
		function() {
			sliders.daysImmunity.show();
		},
		function() {
			sliders.daysImmunity.animTo(310);
		},
		()=>0,
		function() {
			sliders.daysImmunity.hide();
			sliders.daysInfectious.animTo(28);
		}),
	
	new Slide(`When the immune period is shorter, poeple who were <span class="R">Recovered</span> become <span class="S">Susceptible</span> again.`,
		()=>0,
		function() {
			sliders.daysImmunity.animTo(10);
		},
		()=>0,
		function() {
			sliders.daysInfectious.animTo(10, false);
			sliders.daysImmunity.animTo(366);
		}),
	
	new Slide(`And even shorter, the <span class="S">Susceptible</span> people become <span class="I">Infected</span> again, slowing down the decrease of <i>the Curve</i>, causing more deaths.`,
		()=>0,
		function() {
			graph1.move(25, 8, 40, 40);
			graph3.move(25, 52, 40, 40);
			sliders.daysImmunity.animTo(62);
		},
		function() {
			graph1.move(5, 20, 60, 60);
		},
		function() {
			sliders.daysImmunity.animTo(310);
		}),
	
	new Slide(`Another effect can be revealed by showing the number of total recorded cases up to a given day: people get <span class="I">ill</span> more than one time, and the number of <span class="I">total recorded infections</span> overshoots 100%! This is why we observe more <span class="D">deaths</span>.`,
		function() {
			graph3.update();
			graph3.plotAll();
			graph3.show();
		},
		function() {
			sliders.daysImmunity.animTo(180);
			sliders.daysImmunity.hide();
		},
		function() {
			sliders.daysImmunity.show();
		},
		function() {
			graph3.hide()
			sliders.daysImmunity.animTo(10);
		}),
	
	new Slide(`A third parameter is the <i>lethality</i> of the disease, distinguishing between the chances of <span class="R">recovery</span> and <span class="D">death</span> after an <span class="I">infection</span>. This parameter has a greater impact on the number of <span class="D">deaths</span> than on the height of <i>the Curve</i> itself.`,
		function() {
			sliders.mortality.show();
		},
		function() {
			sliders.mortality.animTo(0.316);
			sliders.mortality.hide();
		},
		function() {
			sliders.mortality.show();
		},
		function() {
			sliders.mortality.hide();
			sliders.mortality.animTo(0.316, false);
			sliders.daysImmunity.animTo(62);
		}),
	
	new Slide('All the parameters enumerated until then are unfortunately not easily within our grasp. Their value is more or less fixed for a given disease.',
		()=>0,
		()=>0,
		()=>0,
		()=>0,),
	
	new Slide(`There are still other parameters on which everyone can have an influence.`,
		()=>0,
		()=>0,
		()=>0),
	
	new Slide(`The <i>number of contacts per day</i> is average number of people one invidual gets in close contact with in one day (handshake, prolonged proximity, etc.).`,
		function() {
			sliders.contactsPerDay.show();
			sliders.probInfection.show();
		},
		()=>0,
		()=>0,
		function() {
			sliders.contactsPerDay.hide();
			sliders.probInfection.hide();
			sliders.contactsPerDay.animTo(10, false);
			sliders.probInfection.animTo(0.2); // 4%
		}),
	
	new Slide(`The <i>infection probability</i> is the probability that a <span class="S">Susceptible</span> person gets <span class="I">infected</span> when it gets into close contact with an <span class="I">Infected</span> person.`,
		()=>0,
		()=>0,
		()=>0,
		()=>0),
	
	new Slide(`We can define an important number called the <i>basic reproduction number</i> R<sub>0</sub>, which is the product between the number of contacts per days, the infection probability, and the infection duration.`,
		()=>0,
		function() {
			sliders.timeEnd.animTo(730);
		},
		()=>0,
		()=>0),
	
	new Slide(`<u>An epidemic outbreak is possible when R<sub>0</sub> is greater than 1</u>.<br>Here, R<sub>0</sub> = `,
		function() {
			addR0indicator();
			$("mainText").append(document.createElement("br"));
			$("mainText").append(`Play with the sliders to verify this theory!`);
		},
		function() {
			removeR0indicator();
		},
		function() {
			addR0indicator();
			$("mainText").append(document.createElement("br"));
			$("mainText").append(`Play with the sliders to verify this theory!`);
		},
		function() {
			removeR0indicator();
			sliders.timeEnd.animTo(180);
		}),
	
	new Slide(`Did you see how the total number of <span class="I">infections</span> can skyrocket? The message is simple: in case of epidemic or pandemic, <u>keep R<sub>0</sub> low</u>.`,
		()=>0,
		()=>0,
		()=>0,
		()=>0),
	
	new Slide(`Minimize the number of close contacts per day by <u>maintaining a safe distance of two meters</u> between you and the others and by staying at home.`,
		function() {
			sliders.contactsPerDay.animTo(3);
		},
		()=>0,
		()=>0,
		()=>0),
	
	new Slide(`Minimize the probability of infection by <u>coughing in your elbow</u>, <u>washing your hands</u> and <u>not touching your face</u>.`,
		function() {
			sliders.probInfection.animTo(0.022);
		},
		function() {
			sliders.contactsPerDay.hide();
			sliders.probInfection.hide();
			sliders.timeEnd.animTo(180, false);
			sliders.contactsPerDay.animTo(10, false);
			sliders.probInfection.animTo(0.2);
			
			graph3.hide();
		},
		function() {
			graph3.show();
			
			sliders.contactsPerDay.show();
			sliders.probInfection.show();
		},
		function() {
			sliders.contactsPerDay.animTo(3);
		}),
	
	new Slide(`Aside from individual efforts, <i>global initiatives</i> can also be engaged to combat the high <i>Curve</i>. `,
		function() {
			graph1.move(15, 20, 60, 60);
			sliders.isolationStart.animTo(180, false); // hidden, but prettier animations for after
		},
		function() {
			graph1.move(5, 20, 60, 60);
			sliders.isolationStart.animTo(10, false);
			sliders.isolationDuration.animTo(180, false); // hidden
			sliders.vaccineDay.animTo(180); // hidden
		},
		function() {
			graph1.move(15, 20, 60, 60);
		},
		function() {
			graph1.move(25, 8, 40, 40);
			
			sliders.timeEnd.animTo(730, false);
			sliders.probInfection.animTo(0.022);
		}),
	
	new Slide(`For example, people can be asked to <i>isolate themselves by staying at home</i> and therefore being in contact with less other persons. You can see how <i>the Curve</i> deflates starting from the first day of isolation.`,
		function() {
			selectVisibleSliders({
				isolationStart: true,
				contactsPerDayIsolation: true
			});
		},
		()=>0,
		()=>0,
		function() {
			selectVisibleSliders({});
			sliders.isolationStart.animTo(366, false);
			sliders.contactsPerDayIsolation.animTo(3);
		}),
	
	new Slide(`Of course, people cannot be asked to stay locked down at home forever, so the isolation period has to be temporary.`,
		()=>0,
		function() {
			sliders.isolationStart.animTo(10, false);
			sliders.isolationDuration.animTo(62, false);
			sliders.contactsPerDayIsolation.animTo(3);
			selectVisibleSliders({});
		},
		function() {
			selectVisibleSliders({
				isolationStart: true,
				contactsPerDayIsolation: true
			});
		},
		()=>0),
	
	new Slide(`Ouch, after the isolation period, a new outbreak appears, maybe because the population cannot build an immunity against the disease during the containment!`,
		function() {
			selectVisibleSliders({
				isolationStart: true,
				isolationDuration: true,
				contactsPerDayIsolation: true
			});
		},
		()=>0,
		()=>0,
		function() {
			selectVisibleSliders({});
			sliders.isolationStart.animTo(10, false);
			sliders.isolationDuration.animTo(180, false);
			sliders.contactsPerDayIsolation.animTo(3);
		}),
	
	new Slide(`Anyway, the isolation period can be placed to maximally flatten the bumps of <i>the Curve</i>, which is the best we can do for now.`,
		()=>0,
		function() {
			selectVisibleSliders({});
			sliders.isolationStart.animTo(180, false);
			sliders.isolationDuration.animTo(366, false);
			sliders.vaccineDay.animTo(8);
		},
		function() {
			selectVisibleSliders({
				isolationStart: true,
				isolationDuration: true,
				contactsPerDayIsolation: true
			});
		},
		function() {
			sliders.isolationStart.animTo(10, false);
			sliders.isolationDuration.animTo(62, false);
			sliders.contactsPerDayIsolation.animTo(3);
		}),
	
	new Slide(`The final <i>Curve</i> flattening global initiative presented in this chapter is the introduction of a <i>vaccine</i>, which turns all the current <span class="S">Susceptible</span> people into <span class="R">immunised</span> persons (in reality, not everyone would get vaccinated).`,
		function() {
			sliders.vaccineDay.show();
		},
		()=>0,
		()=>0,
		function() {
			sliders.vaccineDay.hide();
			sliders.isolationStart.animTo(10, false);
			sliders.isolationDuration.animTo(62, false);
			sliders.contactsPerDayIsolation.animTo(3, false);
			sliders.vaccineDay.animTo(731);
		}),
	
	new Slide(`You can see as well how <i>the Curve</i> gets flattened. Unfortunately, vaccines are generally slow to develop and to implement into the population.`,
		()=>0,
		function() {
			sliders.vaccineDay.hide();
			setTimeout(function() { moveSliders(60); }, TRANSITION_DURATION / 2);
			sliders.isolationStart.animTo(366, false);
			sliders.isolationDuration.animTo(366, false);
			sliders.vaccineDay.animTo(731);
			graph1.move(12, 8, 40, 40);
			graph3.move(12, 52, 40, 40);
		},
		function() {
			graph1.move(5, 20, 60, 60);
			graph3.move(25, 52, 40, 40);
			sliders.vaccineDay.show();
		},
		()=>0),
	
	new Slide(`This chapter ends here. You can now play with all the accessible paramaters. Do your best to flatten <i>the Curve</i>! The next chapter will explain <i>Why</i> this flattening is so important.`,
		function() {
			graph3.update();
			graph3.plotAll();
			graph3.show();
			
			selectVisibleSliders({
				timeEnd:                 true,
				contactsPerDay:          true,
				probInfection:           true,
				isolationStart:          true,
				isolationDuration:       true,
				vaccineDay:              true,
				contactsPerDayIsolation: true
			})
		},
		()=>0,
		()=>0,
		function() {
			selectVisibleSliders({});
			setTimeout(function() { moveSliders(70); }, TRANSITION_DURATION / 2);
			graph3.hide();
			
			sliders.timeEnd.animTo(180, false);
			sliders.contactsPerDay.animTo(10, false);
			sliders.probInfection.animTo(0.2, false);
			sliders.isolationStart.animTo(366, false);
			sliders.isolationDuration.animTo(366, false);
			sliders.contactsPerDayIsolation.animTo(3, false);
			sliders.vaccineDay.animTo(8);
		}),
];


var slidesWhy = [
	new Slide(`In the previous chapters, you learned what the <span class="I">Infection</span> <i>Curve</i> is and several ways to flatten it. You may be wondering <i>Why</i> this is desirable?`,
		function() {
			$("mainText").style.bottom = "45%";
			graph1.move(15, 20, 60, 60);
			
			sliders.timeEnd.             update(180);
			sliders.initialContamination.update(-2);   // 1%
			sliders.contactsPerDay.      update(10);
			sliders.probInfection.       update(0.2);   // 4%
			sliders.daysInfectious.      update(10);
			sliders.daysImmunity.        update(366);   // forever
			sliders.mortality.           update(0.316); // 10%
			
			sliders.isolationStart.         update(366);   // never
			sliders.isolationDuration.      update(366);   // forever
			sliders.contactsPerDayIsolation.update(3);
			sliders.vaccineDay.             update(731);   // never
			
			sliders.daysBeforeHospital.update(4);
			sliders.hospitalCapacity.  update(0);
			sliders.mortalityHospital. update(0.141); // 2%
			
			showSliders();
			selectVisibleSliders({});
			moveSliders(70);
		}),

	new Slide(`The answer is: <span class="H"><i>Hospitals</i></span>!<br>Let's see how they are implemented in our model.`,
		function() {
			$("mainText").style.bottom = "46%";
		},
		function() {
			diagram.reset();
			
			diagram.nodes.S.developped = 1;
			diagram.nodes.I.developped = 1;
			diagram.nodes.R.developped = 1;
			diagram.nodes.D.developped = 1;
			diagram.arrows.S_to_I.developped = 1;
			diagram.arrows.I_to_R.developped = 1;
			diagram.arrows.I_to_D.developped = 1;
			diagram.arrows.R_to_S.developped = 1;
			
			diagram.draw();
		},
		function() {
			$("mainText").style.bottom = "46%";
		},
		function() {
			$("mainText").style.bottom = "45%";
		}),
	
	new Slide(`<span class="I">Infected</span> can now be sent to the <span class="H">Hospital</span> where they are <i>separated</i> from the rest of the population, so that they do not contribute to the creation of <span class="I">new cases</span>.`,
		function () {
			$("mainText").style.bottom = "5%";
			$("diagram").style.opacity = 1;
			
			setTimeout(function() {
				diagram.show("I_to_H");
			}, TRANSITION_DURATION * 1000);
			
			setTimeout(function() {
				diagram.show("H");
			}, 2 * TRANSITION_DURATION * 1000);
		},
		function() {
			diagram.show("H_to_R");
			diagram.show("H_to_D");
		},
		()=>0,
		function() {
			diagram.hide("I_to_H");
			diagram.hide("H");
			$("diagram").style.opacity = 0;
		}),

	new Slide(`After their stay at the <span class="H">Hospital</span>, people can also <span class="R">Recover</span> or <span class="D">Die</span>, usually with a higher chance of <span class="R">recovery</span> than the <span class="I">Infected</span> people not in <span class="H">Hospital</span>.`,
		()=>0,
		function() {
			$("diagram").style.opacity = 0;
			
			simulate();
			
			graph1.move(25, 8, 40, 40);
			graph2.move(25, 52, 40, 40);
			
			graph1.update();
			graph1.plotAll();
			
			graph2.update();
			graph2.plotAll();
		},
		function() {
			$("diagram").style.opacity = 1;
		},
		function() {
			diagram.hide("H_to_R");
			diagram.hide("H_to_D");
		}),

	new Slide(`Let's show the current cases and new cases per day, with a fixed <i>Curve</i> height for the moment.`,
		function() {
			graph1.show()
			graph2.show();
		},
		function() {
			showSliders();
			selectVisibleSliders({});
			moveSliders(70);
			
			sliders.hospitalCapacity.animTo(0.2); // 4%
		},
		()=>0,
		function() {
			graph1.hide()
			graph2.hide();
		}),

	new Slide(`Now, we add the <span class="H">Hospitals</span>, which can admit up to a given percentage of the total population (the <i><span class="H">Hospital</span> capacity</i>). You can also control the <i>average number of days</i> between the start of an <span class="I">infection</span> and the admission at a <span class="H">Hospital</span>.`,
		function() {
			sliders.daysBeforeHospital.show();
			sliders.hospitalCapacity.show();
		},
		()=>0,
		()=>0,
		function() {
			sliders.daysBeforeHospital.animTo(4, false);
			sliders.hospitalCapacity.animTo(0);
			selectVisibleSliders({});
		}),

	new Slide(`The presence of <span class="H">Hospitals</span> slows down the propagation of the epdemic by separating the <span class="I">Infected</span> people from <span class="S">Susceptibles</span>, as shown by the graph of new cases per day. At least, this is the case when the <span class="H">Hospitals</span> are not full...`,
		()=>0,
		function() {
			selectVisibleSliders({});
			sliders.daysBeforeHospital.animTo(4, false);
			sliders.hospitalCapacity.animTo(0.2);
			
			graph1.move(7, 5, 55, 55);
			graph2.move(2, 63, 32, 32);
			graph3.move(35, 63, 32, 32);
		},
		function() {
			sliders.daysBeforeHospital.show();
			sliders.hospitalCapacity.show();
			graph1.move(25, 8, 40, 40);
			graph2.move(25, 52, 40, 40);
		},
		()=>0),

	new Slide(`Playing with the <span class="H">Hospital</span> capacity slider, you will understand that the <u>outbreak suddently occurs when the number of <span class="I">Infected</span> overcomes the <span class="H">Hospital</span> capacity</u>. See how the number of cases suddently change (around 5.2% capacity in this example).`,
		function() {
			sliders.hospitalCapacity.show();
			graph3.update();
			graph3.plotAll();
			graph3.show();
		},
		function() {
			sliders.hospitalCapacity.hide();
			sliders.hospitalCapacity.animTo(0.2);
		},
		()=>0,
		function() {
			sliders.hospitalCapacity.hide();
			graph3.hide();
		}),

	new Slide(`Now that we have <span class="H">Hospitals</span>, test the different actions you have learned about in the previous chapter to flatten <i>the Curve</i>. See how the <span class="D">Death</span> count is affected by the height of <i>the Curve</i> compared to the <span class="H">Hospital</span> capacity.`,
		()=>0,
		()=>0,
		()=>0,
		function() {
			sliders.hospitalCapacity.show();
		}),

	new Slide(`Start with the number of close contacts per day and the infection probability. <span class="H">Hospitals</span> are great to prevent outbreaks!<br>R<sub>0</sub> = `,
		function() {
			selectVisibleSliders({
				contactsPerDay: true,
				probInfection: true
			});
			
			addR0indicator();
		},
		function() {
			removeR0indicator();
			
			selectVisibleSliders({});
			sliders.timeEnd.animTo(365, false);
			sliders.contactsPerDay.animTo(10, false);
			sliders.probInfection.animTo(0.2, false);
			sliders.isolationStart.animTo(180, false);
			sliders.isolationDuration.animTo(62);
		},
		function() {
			selectVisibleSliders({
				contactsPerDay: true,
				probInfection: true
			});
			
			addR0indicator();
		},
		function() {
			selectVisibleSliders({});
			sliders.contactsPerDay.animTo(10, false);
			sliders.probInfection.animTo(0.2);
			
			removeR0indicator();
		}),

	new Slide(`At last, try to implement an isolation period. Be sure to minimize the number of <span class="D">Deaths</span>.`,
		function() {
			selectVisibleSliders({
				timeEnd: true,
				isolationStart: true,
				isolationDuration: true,
				contactsPerDayIsolation: true
			});
		},
		function() {
			selectVisibleSliders({});
			graph1.hide();
			graph2.hide();
			graph3.hide();
		},
		function() {
			$("mainText").style.bottom = "5%";
			
			selectVisibleSliders({
				timeEnd: true,
				isolationStart: true,
				isolationDuration: true,
				contactsPerDayIsolation: true
			});
			graph1.show();
			graph2.show();
			graph3.show();
		},
		function() {
			selectVisibleSliders({});
			sliders.timeEnd.animTo(180, false);
			sliders.isolationStart.animTo(366, false);
			sliders.isolationDuration.animTo(366, false);
			sliders.contactsPerDayIsolation.animTo(3);
		}),

	new Slide(`You have now seen the reason for flattening <i>the Curve</i>: <u>the number of <span class="I">Infected</span> people should not overcrowd the <span class="H">Hospitals</span></u>, as this results in a drastic increase of the number of further <span class="I">infections</span> and <span class="D">deaths</span>.`,
		function() {
			$("mainText").style.bottom = "43%";
		},
		()=>0,
		function() {
			$("mainText").style.bottom = "43%";
		},
		()=>0),

	new Slide(`Do not forget your individual contribution: <u>keep safe distances</u> and maintain a <u>flawless hygiene</u>.`,
		function() {
			$("mainText").style.bottom = "45%";
		},
		()=>0,
		function() {
			$("mainText").style.bottom = "45%";
		},
		()=>0),

	new Slide(`You can now head over to the <i>Playground</i> from the title page to play with the full model! Remember that this very simplified simulation is not intended to be perfectly realistic. Do not try to predic accurate numbers with it.`,
		function() {
			$("mainText").style.bottom = "44%";
		},
		()=>0,
		()=>0,
		()=>0),
];


playground = [
	new Slide(``,
		function() {
			moveSliders(70, 0);
			showSliders();
			
			sliders.timeEnd.                update(180);
			sliders.initialContamination.   update(-2);   // 1%
			sliders.contactsPerDay.         update(10);
			sliders.probInfection.          update(0.2);   // 4%
			sliders.daysBeforeHospital.     update(4);
			sliders.daysInfectious.         update(10);
			sliders.hospitalCapacity.       update(0.224); // 5%
			sliders.daysImmunity.           update(62);
			sliders.isolationStart.         update(366);   // never
			sliders.mortality.              update(0.316); // 10%
			sliders.isolationDuration.      update(366);   // forever
			sliders.mortalityHospital.      update(0.141); // 2%
			sliders.vaccineDay.             update(731);   // never
			sliders.contactsPerDayIsolation.update(3);
			
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


function addR0indicator() {
	let R0 = document.createElement("span");
	$("mainText").append(R0);
	
	let updateR0 = function() {
		R0.innerHTML = (sliders.contactsPerDay.value * sliders.probInfection.value * sliders.daysInfectious.value).toFixed(2);
	};
	
	updateR0();
	
	sliders.contactsPerDay.slider.oninput = function() {
		sliders.contactsPerDay.update();
		updateR0();
	};
	
	sliders.probInfection.slider.oninput = function() {
		sliders.probInfection.update();
		updateR0();
	};
}

function removeR0indicator() {
	sliders.contactsPerDay.slider.oninput = function() {
		sliders.contactsPerDay.update();
	};
	
	sliders.probInfection.slider.oninput = function() {
		sliders.probInfection.update();
	};
}