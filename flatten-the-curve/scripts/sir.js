var N = 1;
var timeEnd = 180;
var initialContamination = 0.01;
var contactsPerDay = 20;
var probInfection = 0.04;
var daysInfectious = 20;
var daysImmunity = Infinity;
var mortality = 0.1;

var daysBeforeHospital = 2;
var hospitalCapacity = 0;
var mortalityHospital = 0;

var isolationStart = Infinity;
var isolationDuration = Infinity;
var contactsPerDayIsolation = 0;

var vaccineDay = Infinity;


var S_tab = null;
var I_tab = null;
var H_tab = null;
var R_tab = null;
var D_tab = null;
var t_tab = null;

// new cases per day
var nI_tab = null;
var nR_tab = null;
var nD_tab = null;

// total cases
var sI_tab = null;
var sR_tab = null;
var sD_tab = null;

var tol = 1e-5; // precision for integration
var safetyFactor = 0.9;
var h_max = 20;
var h_min = 5e-2;

var derivEvalCounter = 0; // to evaluate performance


function simulate() {
	let S = N - initialContamination;
	let I = initialContamination;
	let H = 0;
	let R = 0;
	let D = 0;
	
	S_tab = [S];
	I_tab = [I];
	H_tab = [H];
	R_tab = [R];
	D_tab = [D];
	t_tab = [0];
	
	nI_tab = [getContactsPerDay() * probInfection * I / N * S];
	nR_tab = [I * (1 - mortality) / daysInfectious];
	nD_tab = [I * mortality / daysInfectious];
	
	sI_tab = [nI_tab[0]];
	sR_tab = [nR_tab[0]];
	// sD_tab = [nD_tab[0]];
	
	let t = 0;
	let h = 1;
	derivEvalCounter = 0;
	let k1 = derivative(t, [S, I, H, R, D]); // "first same as last", k4 = k1
	
	let vaccine_given = false;
	
	while (t < timeEnd) {
		let y = [S, I, H, R, D];
		
		let h_safe = h_min;
		let dy_dh;
		let k4;
		
		while (true) { // Bodacki-Shampine, order 3 and 2
			let k2 = derivative(t + 0.5  * h, array_sum(y, array_mul(k1, 0.5  * h)));
			let k3 = derivative(t + 0.75 * h, array_sum(y, array_mul(k2, 0.75 * h)));
			dy_dh = array_sum(array_mul(k1, 2/9), array_sum(array_mul(k2, 1/3), array_mul(k3, 4/9)));
			k4 = derivative(t + h, array_sum(y, array_mul(dy_dh, h)));
			
			// estimate error
			let err = array_sum(array_mul(k1, -5/72), array_sum(array_mul(k2, 1/12), array_sum(array_mul(k3, 1/9), array_mul(k4, -1/8))));
			err = h * err.reduce((max, curr) => Math.max(max, Math.abs(curr)));
			
			// estimate safe step size
			// if (err > tol) {
				// h_safe = safetyFactor * h * Math.pow(tol / err, 1 / err_order);
				h_safe = safetyFactor * h * Math.sqrt(tol / err); // because err_order = 2
			// } else { // *cumulated* error has to be < tol, but adds a lot of points...
			// 	// h_safe = safetyFactor * h * Math.pow(tol / err, 1 / (err_order - 1));
			// 	h_safe = safetyFactor * h * tol / err; // because err_order = 2
			// }
			if (h_safe < h_min) h_safe = h_min;
			
			// adjust h if too big and recompute the k
			if (h > h_safe / safetyFactor) {
				h = h_safe;
			} else {
				break;
			}
		}
		
		k1 = k4; // "first same as last"!
		
		// stop at max time
		if (t + h > timeEnd) h = timeEnd - t;

		[S, I, H, R, D] = array_sum(y, array_mul(dy_dh, h));
		
		if (!vaccine_given && t >= vaccineDay) {
			R += S;
			S = 0;
			vaccine_given = true;
		}
		if (I < 0) {
			I = 0;
			k1 = derivative(t + h, [S, I, H, R, D]);
		}
		D = N - S - I - H - R;
		t += h;
		
		S_tab.push(S);
		I_tab.push(I);
		H_tab.push(H);
		R_tab.push(R);
		D_tab.push(D);
		t_tab.push(t);
		
		nI_tab.push(getContactsPerDay(t) * probInfection * I / N * S);
		nR_tab.push((I * (1 - mortality) + H * (1 - mortalityHospital)) / daysInfectious);
		nD_tab.push((I * mortality + H * mortalityHospital) / daysInfectious);
		
		sI_tab.push(sI_tab[sI_tab.length - 1] + h * nI_tab[nI_tab.length - 1]);
		sR_tab.push(sR_tab[sR_tab.length - 1] + h * nR_tab[nR_tab.length - 1]);
		// sD_tab.push(sD_tab[sD_tab.length - 1] + h * nD_tab[nD_tab.length - 1]);
		
		
		// adjust h for next time step if h_safe > h
		h = h_safe;
		if (h > h_max) h = h_max;
		
		if (!vaccine_given && t + h >= vaccineDay) {
			h = Math.max(vaccineDay - t, h_min);
		}
	}
	
	sD_tab = D_tab;
	
	// console.log(`${t_tab.length} points, ${derivEvalCounter} derivative evaluations.`);
}

function derivative(t, y) {
	derivEvalCounter ++;
	let [S, I, H, R, D] = y;
	
	let S_to_I = getContactsPerDay(t) * probInfection * I / N * S;
	let I_to_R = I / daysInfectious * (1 - mortality);
	let I_to_D = I / daysInfectious * mortality;
	let I_to_H = I * (1 - 1 / daysInfectious) / daysBeforeHospital;
	let H_to_R = H / daysInfectious * (1 - mortalityHospital);
	let H_to_D = H / daysInfectious * mortalityHospital;
	let R_to_S = R / daysImmunity;
	
	I_to_H = Math.min(hospitalCapacity - H + H_to_R + H_to_D, I_to_H);
	
	let dS = R_to_S - S_to_I;
	let dI = S_to_I - I_to_H - I_to_R - I_to_D;
	let dH = I_to_H - H_to_R - H_to_D;
	let dR = I_to_R + H_to_R - R_to_S;
	let dD = I_to_D + H_to_D;
	
	return [dS, dI, dH, dR, dD];
}

function getContactsPerDay(t) {
	return (t >= isolationStart && t < isolationStart + isolationDuration) ? contactsPerDayIsolation : contactsPerDay;
}

function array_sum(a, b) {
	let c = [];
	for (let i in a) {
		c.push(a[i] + b[i]);
	}
	return c;
}

function array_mul(a, m) {
	let b = [];
	for (let i in a) {
		b.push(a[i] * m);
	}
	return b;
}