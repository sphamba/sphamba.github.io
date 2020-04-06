class Slider {
	constructor(varName, name, min, max, step, sliderValue,
		displayFunc=(x)=>x, transformFunc=(x)=>x) {
		this.varName = varName;
		this.displayFunc = displayFunc;
		this.transformFunc = transformFunc;
		this.value = 0;
		
		// create HTML slider
		this.container = document.createElement("div");
		this.container.className = "sliderContainer";
		
		let domName = document.createElement("span");
		domName.className = "sliderName";
		domName.innerHTML = name;
		
		this.slider = document.createElement("input");
		this.slider.className = "slider";
		this.slider.type = "range";
		this.slider.min = min;
		this.slider.max = max;
		this.slider.step = step;
		this.slider.value = sliderValue;
		let self = this;
		this.slider.oninput = function() { self.update(); };
		
		this.display = document.createElement("span");
		this.display.className = "sliderInfo";
		
		this.update();
		
		this.container.appendChild(domName);
		this.container.appendChild(this.slider);
		this.container.appendChild(this.display);
		$("sliders").appendChild(this.container);
	}
	
	
	get sliderValue() { return parseFloat(this.slider.value); }
	
	
	update(sliderValue, updateGraphs=true) {
		if (sliderValue !== undefined) {
			this.slider.value = sliderValue;
		}
		
		this.value = parseFloat(this.transformFunc(this.slider.value));
		this.display.innerHTML = this.displayFunc(this.value);
		window[this.varName] = this.value;
		
		if (!updateGraphs) return;
		
		simulate();
		
		if (graph1.visible) {
			graph1.update();
			graph1.plotAll();
		}
		
		if (graph2.visible) {
			graph2.update();
			graph2.plotAll();
		}
		
		if (graph3.visible) {
			graph3.update();
			graph3.plotAll();
		}
	}
	
	
	hide() {
		let c = this.container;
		c.style.opacity = 0;
		setTimeout(function() { c.style.display = "none"; }, TRANSITION_DURATION * 1000);
	}
	
	
	show() {
		let c = this.container;
		c.style.display = "inline-block";
		setTimeout(function() { c.style.opacity = 1; }, 10);
	}
	
	
	animTo(sliderValue, updateGraphs=true) { // when called multiple times at the same time, only put updateGraphs to true for one of the instances
		let initSliderValue = this.sliderValue;
		let s = this;
		
		launchAnimation(function(x) {
			s.update(ease(x, initSliderValue, sliderValue), updateGraphs);
		});
	}
}


function finePercentage(x) {
	return (x > 0.5)  ? Math.round(100   * x)       + "%" :
	       (x > 0.01) ? Math.round(1000  * x) / 10  + "%" :
	                    Math.round(10000 * x) / 100 + "%";
}

function daysMonths(x, neverWord) {
	
	
	return !isFinite(x) ? neverWord :
		(x >= 384) ? Math.round(10 * x / 365) / 10 + " years" :
		(x >= 350) ? 1 + " year" :
		(x > 61) ? Math.round(12 * x / 365) + " months" :
		(x > 1) ? x + " days" : x + " day";
}


var sliders = {
	timeEnd: new Slider("timeEnd", "Simulation duration",
		7, 730, 1, 182,
		(x)=>daysMonths(x),
		function(x) { // had to put this somewhere...
			if (graph1.visible) graph1.drawAxes();
			if (graph2.visible) graph2.drawAxes();
			if (graph3.visible) graph3.drawAxes();
			return x;
		}),
	
	initialContamination: new Slider("initialContamination", "Initial contamination",
		0, 1, 0.001, 0.1,
		finePercentage,
		(x)=>x*x),
	
	contactsPerDay: new Slider("contactsPerDay", "Contacts per day",
		0, 50, 0.1, 10),
	
	probInfection: new Slider("probInfection", "Infection probability",
		0, 1, 0.001, 0.2,
		finePercentage,
		(x)=>x*x),
	
	daysBeforeHospital: new Slider("daysBeforeHospital", "Days to hospital",
		0.1, 7.1, 0.1, 4,
		(x)=>daysMonths(x, "never"),
		function (x) {
			return (x == 7.1) ? Infinity : x;
		}),
	
	daysInfectious: new Slider("daysInfectious", "Infection duration",
		1, 29, 0.1, 10,
		(x)=>daysMonths(x, "permanent"),
		function(x) {
			return (x == 29) ? Infinity : x;
		}),
	
	hospitalCapacity: new Slider("hospitalCapacity", "Hospital capacity",
		0, 1, 0.001, 0.224,
		finePercentage,
		(x)=>x*x),
	
	daysImmunity: new Slider("daysImmunity", "Immunity duration",
		1, 366, 0.1, 62,
		(x)=>daysMonths(x, "permanent"),
		function(x) {
			return (x == 366) ? Infinity : x;
		}),
	
	isolationStart: new Slider("isolationStart", "Isolation start",
		0, 366, 1, 366,
		(x)=>daysMonths(x, "never"),
		function(x) {
			return (x == 366) ? Infinity : x;
		}),
	
	mortality: new Slider("mortality", "Lethality",
		0, 1, 0.001, 0.316,
		finePercentage,
		(x)=>x*x),
	
	isolationDuration: new Slider("isolationDuration", "Isolation duration",
		1, 366, 1, 366,
		(x)=>daysMonths(x, "forever"),
		function(x) {
			return (x == 366) ? Infinity : x;
		}),
	
	mortalityHospital: new Slider("mortalityHospital", "Lethality in hospital",
		0, 1, 0.001, 0.141,
		finePercentage,
		(x)=>x*x),
	
	contactsPerDayIsolation: new Slider("contactsPerDayIsolation", "Contacts/day isolation",
		0, 10, 0.1, 3),
	
	vaccineDay: new Slider("vaccineDay", "Vaccination day",
		0, 731, 1, 731,
		(x)=>daysMonths(x, "never"),
		function(x) {
			return (x == 731) ? Infinity : x;
		}),
};


function showSliders() {
	$("sliders").style.display = "block";
}

function hideSliders() {
	$("sliders").style.display = "none";
}

function moveSliders(top, left=0) {
	$("sliders").style.top = top + "%";
	$("sliders").style.left = left + "%";
}

function selectVisibleSliders(sel) {
	sel.timeEnd                 ? sliders.timeEnd                .show() : sliders.timeEnd                .hide();
	sel.initialContamination    ? sliders.initialContamination   .show() : sliders.initialContamination   .hide();
	sel.contactsPerDay          ? sliders.contactsPerDay         .show() : sliders.contactsPerDay         .hide();
	sel.probInfection           ? sliders.probInfection          .show() : sliders.probInfection          .hide();
	sel.daysBeforeHospital      ? sliders.daysBeforeHospital     .show() : sliders.daysBeforeHospital     .hide();
	sel.daysInfectious          ? sliders.daysInfectious         .show() : sliders.daysInfectious         .hide();
	sel.hospitalCapacity        ? sliders.hospitalCapacity       .show() : sliders.hospitalCapacity       .hide();
	sel.daysImmunity            ? sliders.daysImmunity           .show() : sliders.daysImmunity           .hide();
	sel.isolationStart          ? sliders.isolationStart         .show() : sliders.isolationStart         .hide();
	sel.mortality               ? sliders.mortality              .show() : sliders.mortality              .hide();
	sel.isolationDuration       ? sliders.isolationDuration      .show() : sliders.isolationDuration      .hide();
	sel.mortalityHospital       ? sliders.mortalityHospital      .show() : sliders.mortalityHospital      .hide();
	sel.vaccineDay              ? sliders.vaccineDay             .show() : sliders.vaccineDay             .hide();
	sel.contactsPerDayIsolation ? sliders.contactsPerDayIsolation.show() : sliders.contactsPerDayIsolation.hide();
}