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


// $("langES").onclick = function() {
// 	lang = "es";
	
// 	$("titleWhat").innerHTML = "1 - ?";
// 	$("titleHow"). innerHTML = "2 - ?";
// 	$("titleWhy"). innerHTML = "3 - ?";
// 	$("titlePlayground"). innerHTML = "?";
	
// 	hideLangScreen();
// }