const S_COLOR = "#0c4";
const R_COLOR = "#46e";
const I_COLOR = "#d00";
const H_COLOR = "#fdd";
const D_COLOR = "#888";
const FONT_NAME = "fira_sans_condensedheavy, sans-serif";
const THRESH_MIN = 1e-5;



function updateGraphsCanvasSize() {
	for (let i = 1; i <= 3; i++) {
		$("graph" + i).width  = Math.floor(0.6 * $("screen").clientWidth)  * window.devicePixelRatio;
		$("graph" + i).height = Math.floor(0.6 * $("screen").clientHeight) * window.devicePixelRatio;
	}
}


class Graph {
	constructor(id_dom, updateFunc, name) {
		this.dom = $(id_dom);
		this.ctx = this.dom.getContext("2d");
		this.updateFunc = updateFunc;
		this.name = name;
		this.max = 1;
		
		this.values = [];
		this.colors = [];
		
		// all sizes expressed in percentages
	}
	
	// position of axes
	get left()   { return 0.15 * this.dom.width; }
	get right()  { return 0.97 * this.dom.width; }
	get top()    { return 0.05 * this.dom.height; }
	get bottom() { return 0.83 * this.dom.height; }
	get width()  { return this.right - this.left;}
	get height() { return this.bottom - this.top;}
	
	get plotLineWidth() { return 0.01 * this.dom.width }
	get axesLabelSize() { return 0.05  * this.dom.width; }
	get ticksWidth()    { return 0.005 * this.dom.width; }
	get ticksLength()   { return 0.01  * this.dom.width; }
	get ticksFontSize() { return 0.04  * this.dom.width; }
	get gridWidth() { return 0.002 * this.dom.width; }
	get textFontSize() { return 0.04  * this.dom.width; }
	
	get visible() { return this.dom.style.opacity == 1; }
	
	
	drawAxes() {
		this.ctx.clearRect(0, 0, this.dom.width, this.dom.height);
		
		this.ctx.fillStyle = "#fff";
		this.ctx.font = this.axesLabelSize + "px " + FONT_NAME;
		this.ctx.textAlign = "center";
		this.ctx.textBaseline = "middle";
		
		// xlabel
		this.ctx.fillText(
			useMonthsTicks(timeEnd) ? L({en: "months", fr: "mois", es:"meses"}) : L({en: "days", fr: "jours", es: "días"}),
			this.left + this.width / 2, this.dom.height * 0.96);
		
		// ylabel
		this.ctx.save();
		this.ctx.rotate(-Math.PI / 2);
		this.ctx.fillText(this.name + " [%]", -this.top + -this.height / 2, this.width * 0.03);
		this.ctx.restore();
		
		this.drawTicks();
	}
	
	drawTicks() {
		this.ctx.fillStyle = "#fff";
		this.ctx.strokeStyle = "#a44";
		this.ctx.font = this.ticksFontSize + "px " + FONT_NAME;
		
		// xticks
		this.ctx.textAlign = "center";
		this.ctx.textBaseline = "top";
		
		let xMax = useMonthsTicks(timeEnd) ? timeEnd / 30 : timeEnd;
		let div = findBestTickSize(xMax);
		for (let x = 0; x <= xMax; x += div) {
			let xCtx = this.left + x / xMax * this.width;
			
			this.ctx.fillRect(
				xCtx - this.ticksWidth / 2,
				this.bottom,
				this.ticksWidth,
				this.ticksLength);
			
			this.ctx.fillText(
				parseFloat(x.toPrecision(2)), // deal with floating point errors
				xCtx,
				this.bottom + 2 * this.ticksLength);
		}
		
		// yticks
		this.ctx.textAlign = "right";
		this.ctx.textBaseline = "middle";
		
		div = findBestTickSize(this.max);
		for (let y = 0; y <= this.max; y += div) {
			let yCtx = this.bottom - y / this.max * this.height;
			
			this.ctx.fillRect(
				this.left,
				yCtx - this.ticksWidth / 2,
				-this.ticksLength,
				this.ticksWidth);
			
			this.ctx.fillText(
				parseFloat((100 * y).toPrecision(2)), // deal with floating point errors
				this.left - 2 * this.ticksLength,
				yCtx);
			
			if (this instanceof GraphCurves) {
				this.ctx.lineWidth = this.gridWidth;
				this.ctx.beginPath();
				this.ctx.moveTo(this.left, yCtx);
				this.ctx.lineTo(this.right, yCtx);
				this.ctx.stroke();
			}
		}
	}
	
	// clear graph zone
	clear () {
		this.ctx.clearRect(this.left, this.top, this.width, this.height);
	}
	
	// plot one curve
	plot(values, color) {
		
	}
	
	plotIsolation() {
		if (isolationStart < timeEnd) {
			this.ctx.lineWidth = this.plotLineWidth / 2;
			this.ctx.strokeStyle = "rgba(255, 255, 255, 0.7)";
			this.ctx.setLineDash([5, 5]);
			
			// left side
			let x0 = this.left + isolationStart / timeEnd * this.width;
			this.ctx.beginPath();
			this.ctx.moveTo(x0, this.top);
			this.ctx.lineTo(x0, this.bottom);
			this.ctx.stroke();
			
			// right side
			let x1 = this.right;
			if (isolationStart + isolationDuration <= timeEnd) {
				x1 = this.left + (isolationStart + isolationDuration) / timeEnd * this.width;
				
				this.ctx.beginPath();
				this.ctx.moveTo(x1, this.top);
				this.ctx.lineTo(x1, this.bottom);
				this.ctx.stroke();
				
				this.ctx.setLineDash([]);
			}
			
			// fill
			this.ctx.fillStyle = "rgba(128, 128, 128, 0.2)";
			this.ctx.fillRect(x0, this.top, x1 - x0, this.height);
			
			// text
			this.ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
			this.ctx.font = this.textFontSize + "px " + FONT_NAME;
			this.ctx.textAlign = "center";
			this.ctx.textBaseline = "top";
			this.ctx.save();
			this.ctx.rotate(-Math.PI / 2);
			this.ctx.fillText(L({en: "isolation", fr: "confinement", es: "aislamiento"}),
				-this.top + -this.height / 2,
				x0 + 0.01 * this.width);
			this.ctx.restore();
		}
	}
	
	plotVaccination() {
		if (vaccineDay < timeEnd) {
			this.ctx.lineWidth = this.plotLineWidth / 2;
			this.ctx.strokeStyle = "rgba(248, 248, 255, 0.7)";
			this.ctx.setLineDash([5, 4, 2, 4]);
			
			// line
			let x0 = this.left + vaccineDay / timeEnd * this.width;
			this.ctx.beginPath();
			this.ctx.moveTo(x0, this.top);
			this.ctx.lineTo(x0, this.bottom);
			this.ctx.stroke();
			
			// text
			this.ctx.fillStyle = "rgba(248, 248, 255, 0.7)";
			this.ctx.font = this.textFontSize + "px " + FONT_NAME;
			this.ctx.textAlign = "center";
			this.ctx.textBaseline = "top";
			this.ctx.save();
			this.ctx.rotate(-Math.PI / 2);
			this.ctx.fillText(L({en: "vaccination", fr: "vaccination", es: "vacunación"}),
				-this.top + -this.height / 2,
				x0 + 0.01 * this.width);
			this.ctx.restore();
		}
	}
	
	plotAll() {
		this.drawAxes();
		
		this.ctx.beginPath();
		this.ctx.rect(this.left, this.top, this.width, this.height);
		this.ctx.save();
		this.ctx.clip();
		
		// this.clear();
		for (let i = 0; i < this.values.length; i++) {
			this.plot(this.values[i], this.colors[i]);
		}
		
		this.plotIsolation();
		this.plotVaccination();
		
		this.ctx.restore();
	}
	
	update() {
		this.values = [];
		this.colors = [];
		this.updateFunc();
	}
	
	// call to store computed values
	addPlot(valueFunc, color) {
		let values = [];
		for (let i = 0; i < t_tab.length; i++) {
			values.push(valueFunc(i));
		}
		
		this.values.push(values);
		this.colors.push(color);
	}
	
	move(top, left, width, height) { // in percents
		this.dom.style.top    = top    + "%";
		this.dom.style.left   = left   + "%";
		this.dom.style.width  = width  + "%";
		this.dom.style.height = height + "%";
	}
	
	show() {
		this.dom.style.opacity = 1;
	}
	
	hide() {
		this.dom.style.opacity = 0;
	}
}


class GraphFilled extends Graph {
	constructor(...args) {
		super(...args);
	}
	
	
	plot(values, color) {
		this.ctx.fillStyle = color;
		this.ctx.lineJoin = "round";
		
		this.ctx.beginPath();
		this.ctx.moveTo(this.left, this.bottom);
		for (let i = 0; i <= t_tab.length; i++) {
			this.ctx.lineTo(
				this.left + t_tab[i] / timeEnd * this.width,
				this.bottom - values[i] * this.height);
		}
		this.ctx.lineTo(this.right, this.bottom);
		this.ctx.fill();
	}
	
	plotBackground(color) {
		this.ctx.fillStyle = color;
		this.ctx.fillRect(this.left, this.top, this.width, this.height);
	}
	
	plotHospitalCapacity() {
		if (hospitalCapacity != 0 && isFinite(daysBeforeHospital)) {
			this.ctx.lineWidth = this.plotLineWidth / 2;
			this.ctx.strokeStyle = "#fff";
			this.ctx.setLineDash([2, 2]);
			
			this.ctx.beginPath();
			this.ctx.moveTo(this.left, this.bottom - hospitalCapacity * this.height);
			this.ctx.lineTo(this.right, this.bottom - hospitalCapacity * this.height);
			this.ctx.stroke();
			
			this.ctx.setLineDash([]);
			
			this.ctx.fillStyle = "#fff";
			this.ctx.font = this.textFontSize + "px " + FONT_NAME;
			this.ctx.textAlign = "center";
			this.ctx.textBaseline = "bottom";
			this.ctx.fillText(L({en: "hospital capacity", fr: "capacité hôpitaux", es: "capacidad hospital"}),
				this.left + this.width / 2,
				this.bottom - (hospitalCapacity + 0.01) * this.height);
		}
	}
	
	writeEndValues() {
		this.ctx.fillStyle = "#fff";
		this.ctx.font = 0.85 * this.textFontSize + "px " + FONT_NAME;
		this.ctx.textAlign = "right";
		this.ctx.textBaseline = "middle";
		
		// write D
		let D = D_tab[D_tab.length - 1];
		if (D < THRESH_MIN) D = 0;
		this.ctx.fillText(parseFloat((100 * D).toPrecision(2)) + "% " + L({en: "Deaths", fr: "Décédés", es: "Fallecidos"}),
			this.right - 0.01 * this.width,
			this.top + clamp(
				D / 2 * this.height,
				0.01 * this.height + this.textFontSize / 2,
				0.96 * this.height - this.textFontSize * 3.5));
		
		// write R
		let R = R_tab[R_tab.length - 1];
		if (R < THRESH_MIN) R = 0;
		this.ctx.fillText(parseFloat((100 * R).toPrecision(2)) + "% " + L({en: "Recovered", fr: "Rétablis", es: "Restablecidos"}),
			this.right - 0.01 * this.width,
			this.top + clamp(
				(D + R / 2) * this.height,
				0.02 * this.height + this.textFontSize * 1.5,
				0.97 * this.height - this.textFontSize * 2.5));
		
		// write S
		let S = S_tab[S_tab.length - 1];
		if (S < THRESH_MIN) S = 0;
		this.ctx.fillText(parseFloat((100 * S).toPrecision(2)) + "% " + L({en: "Susceptible", fr: "Susceptibles", es: "Susceptibles"}),
			this.right - 0.01 * this.width,
			this.top + clamp(
				(D + R + S / 2) * this.height,
				0.03 * this.height + this.textFontSize * 2.5,
				0.98 * this.height - this.textFontSize * 1.5));
		
		// write I
		let I = I_tab[I_tab.length - 1];
		if (I < THRESH_MIN) I = 0;
		this.ctx.fillText(parseFloat((100 * I).toPrecision(2)) + "% " + L({en: "Infected", fr: "Infectés", es: "Infectados"}),
			this.right - 0.01 * this.width,
			this.top + clamp(
				(D + R + S + I / 2) * this.height,
				0.04 * this.height + this.textFontSize * 3.5,
				0.99 * this.height - this.textFontSize * 0.5));
	}
	
	plotAll() {
		this.drawAxes();
		
		this.ctx.beginPath();
		this.ctx.rect(this.left, this.top, this.width, this.height);
		this.ctx.save();
		this.ctx.clip();
		
		// this.clear();
		this.plotBackground(this.colors[-1]);
		for (let i = 0; i < this.values.length; i++) {
			this.plot(this.values[i], this.colors[i]);
		}
		
		this.plotIsolation();
		this.plotHospitalCapacity();
		this.plotVaccination();
		this.writeEndValues();
		
		this.ctx.restore();
	}
	
	addPlotBackground(color) {
		this.colors[-1] = color;
	}
}


class GraphCurves extends Graph {
	constructor(...args) {
		super(...args);
	}
	
	
	plot(values, color) {
		this.ctx.strokeStyle = color;
		this.ctx.lineWidth = this.plotLineWidth;
		
		this.ctx.beginPath();
		for (let i = 0; i <= t_tab.length; i++) {
			this.ctx.lineTo(
				this.left + t_tab[i] / timeEnd * this.width,
				this.bottom - values[i] * this.height / this.max);
		}
		this.ctx.stroke();
	}
	
	update() {
		super.update();
		
		// find max for y scaling
		let maxes = [];
		for (let values of this.values) {
			maxes.push(Math.max(...values));
		}
		this.max = Math.max(...maxes) * 1.05;
		if (this.max <= THRESH_MIN) this.max = 1;
	}
}



var graph1 = new GraphFilled("graph1", function() {
	this.addPlotBackground(D_COLOR);                     // D
	this.addPlot(i => N - D_tab[i],            R_COLOR); // R
	this.addPlot(i => N - D_tab[i] - R_tab[i], S_COLOR); // S
	this.addPlot(i => I_tab[i] + H_tab[i],     I_COLOR); // I
	this.addPlot(i => H_tab[i],                H_COLOR); // H
}, L({en: "current cases", fr: "cas présents", es: "casos actuales"}));

var graph2 = new GraphCurves("graph2", function() {
	this.addPlot(i => nI_tab[i], I_COLOR);
	this.addPlot(i => nR_tab[i], R_COLOR);
	this.addPlot(i => nD_tab[i], D_COLOR);
}, L({en: "new cases per day", fr: "nouveaux cas par jour", es: "nuevos casos diarios"}));

var graph3 = new GraphCurves("graph3", function() {
	this.addPlot(i => sI_tab[i], I_COLOR);
	this.addPlot(i => sR_tab[i], R_COLOR);
	this.addPlot(i => sD_tab[i], D_COLOR);
}, L({en: "total cases", fr: "total des cas", es: "total casos"}));



// animations

var slideAnimFrame = 0;
var slideAnimFrameMax = 45;

function launchAnimation(updateParamFunc, updateGraph1=false, updateGraph2=false, updateGraph3=false) {
	slideAnimFrame = 0;
	
	function updateAnimation() {
		updateParamFunc(++slideAnimFrame / slideAnimFrameMax);
		// simulate();
		// if (updateGraph1) {
		// 	graph1.update();
		// 	graph1.plotAll();
		// }
		// if (updateGraph2) {
		// 	graph2.update();
		// 	graph2.plotAll();
		// }
		// if (updateGraph3) {
		// 	graph3.update();
		// 	graph3.plotAll();
		// }
		
		if (slideAnimFrame <= slideAnimFrameMax) { // overshot for rounding errors
			requestAnimationFrame(updateAnimation);
		} else { // update graphs at the end to be sure
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
	}
	
	updateAnimation();
}

function ease(x, min, max) { // x from 0 to 1
	x = (x > 1) ? 1 : x;
	return min + (max - min) * (-2 * x*x*x + 3 * x*x);
}


var MAX_TICKS = 8;

function findBestTickSize(max) {
	let div = max / MAX_TICKS;
	let div10 = Math.pow(10, Math.ceil(Math.log10(div)));
	let div5  = Math.pow(10, Math.ceil(Math.log10(div / 5))) * 5;
	let div2  = Math.pow(10, Math.ceil(Math.log10(div / 2))) * 2;
	return Math.min(div10, div5, div2);
}

function useMonthsTicks(max) {
	return max / MAX_TICKS > 20; // Use months when ticks become large
}

