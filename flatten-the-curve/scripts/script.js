// setup page

function resize() {
	// screen size and position
	
	var screenRatio = 4 / 3;
	var screenWidthMax = 1080;
	var screenWidth = Math.min(screenWidthMax, window.innerWidth, window.innerHeight * screenRatio);
	var screenHeight = screenWidth / screenRatio;
	$("screen").style.width = screenWidth + "px";
	$("screen").style.height = screenHeight + "px";
	$("screen").style.fontSize = 0.025 * screenWidth + "px";
	
	// canvases
	let temp = $("slide").style.display;
	$("slide").style.display = "block";
	updateDiagramCanvasSize();
	$("slide").style.display = temp;
	if (!diagram) diagram = new Diagram();
	diagram.draw();
	
	updateGraphsCanvasSize();
	graph1.plotAll();
	graph2.plotAll();
	graph3.plotAll();
}

resize();
window.onresize = resize;

$("previous").onclick = previousSlide;
$("next").onclick = nextSlide;


var transitioningScreen = false;

function transitionScreens(s1, s2) {
	transitioningScreen = true;
	
	// hide s1
	$(s1).style.opacity = 0;
	$(s2).style.display = "block";
	
	$(s1).ontransitionend = function() {
		// show s2
		$(s1).style.display = "none";
		$(s1).ontransitionend = null;
		$(s2).style.opacity = 1;
		
		$(s2).ontransitionend = function() {
			transitioningScreen = false;
			$(s2).ontransitionend = null;
		}
	};
}

function showSlides(slides) {
	if (transitioningScreen || transitioningSlide) return;
	currentSlides = slides;
	currentSlideId = 0
	let s = currentSlides[currentSlideId];
	
	$("diagram").style.transitionDuration = 0;
	$("graph1").style.transitionDuration  = 0;
	$("graph2").style.transitionDuration  = 0;
	$("graph3").style.transitionDuration  = 0;
	$("diagram").style.opacity = 0;
	graph1.hide();
	graph2.hide();
	graph3.hide();
	hideSliders();
	
	s.showForward();
	s.display();
	
	transitionScreens("titleScreen", "slide");
}

function showTitleScreen() {
	if (transitioningScreen || transitioningSlide) return;
	transitionScreens("slide", "titleScreen");
}


$("titleWhat").onclick = function() {
	$("previous").style.display = "block";
	$("next").style.display = "block";
	showSlides(slidesWhat);
};

$("titleHow").onclick = function() {
	$("previous").style.display = "block";
	$("next").style.display = "block";
	showSlides(slidesHow);
};

$("titleWhy").onclick = function() {
	$("previous").style.display = "block";
	$("next").style.display = "block";
	showSlides(slidesWhy);
};

$("titlePlayground").onclick = function() {
	$("previous").style.display = "none";
	$("next").style.display = "none";
	showSlides(playground);
};

$("home").onclick = showTitleScreen;


addEventListener("keydown", function(event) {
	if (transitioningScreen || transitioningSlide) return;
	
	switch (event.keyCode) {
		case 27: // ESC
			if ($("slide").style.display === "block") showTitleScreen();
			break;
			
		case 37: // feft arrow
			if ($("slide").style.display === "block") previousSlide();
			break;
		
		case 32: // spacebar
		case 39: // right arrow
			if ($("slide").style.display === "block") nextSlide();
			break;
	}
});