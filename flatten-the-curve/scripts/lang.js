var lang = "en";


class TextTranslated {
	constructor(text) {
		this.text = text;
	}
	
	toString() {
		return this.text[lang] || this.text.en; // dynamic!!
	}
}


function L(text) {
	return new TextTranslated(text);
}


function hideLangScreen() {
	requestFullscreen();
	updateSliderNames();
	transitionScreens("langSelect", "titleScreen");
}


$("langEN").onclick = function() {
	lang = "en";
	hideLangScreen();
}


$("langFR").onclick = function() {
	lang = "fr";
	
	// $("title").    innerHTML = "APLATIR LA COURBE?";
	$("titleWhat").innerHTML = "1 - QUOI";
	$("titleHow"). innerHTML = "2 - COMMENT";
	$("titleWhy"). innerHTML = "3 - POURQUOI";
	$("titlePlayground"). innerHTML = "Bac à sable";
	
	hideLangScreen();
}


$("langES").onclick = function() {
	lang = "es";
	
	// $("title").    innerHTML = "APLANAR LA CURVA";
	$("titleWhat").innerHTML = "1 - ¿QUÉ?";
	$("titleHow"). innerHTML = "2 - ¿CÓMO?";
	$("titleWhy"). innerHTML = "3 - ¿PORQUÉ?";
	$("titlePlayground"). innerHTML = "Área de prueba";
	
	hideLangScreen();
}