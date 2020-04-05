var dom = {};

function $(id) {
	// store dom elements for 20% better performances!
	return dom[id] || (dom[id] = document.getElementById(id));
}

function clamp(x, min, max) {
	return (x > max) ? max : (x < min) ? min : x;
}