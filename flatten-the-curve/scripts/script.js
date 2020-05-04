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
	updateDiagramCanvasSize();
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
	$(s2).style.top = "0";
	
	setTimeout(function() {
		// show s2
		$(s1).style.top = "100%";
		$(s2).style.opacity = 1;
		
		setTimeout(function() {
			transitioningScreen = false;
		}, 1000);
	}, 1000);
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
	
	updateSlideNumber();
	s.showForward();
	s.display();
	
	transitionScreens("titleScreen", "slide");
}

function showTitleScreen() {
	if (transitioningScreen || transitioningSlide) return;
	removeR0indicator();
	transitionScreens("slide", "titleScreen");
}


$("titleWhat").onclick = function() {
	$("previous").style.display = "block";
	$("next").style.display = "block";
	$("slideNumber").style.display = "block";
	showSlides(slidesWhat);
};

$("titleHow").onclick = function() {
	$("previous").style.display = "block";
	$("next").style.display = "block";
	$("slideNumber").style.display = "block";
	showSlides(slidesHow);
};

$("titleWhy").onclick = function() {
	$("previous").style.display = "block";
	$("next").style.display = "block";
	$("slideNumber").style.display = "block";
	showSlides(slidesWhy);
};

$("titlePlayground").onclick = function() {
	$("previous").style.display = "none";
	$("next").style.display = "none";
	$("slideNumber").style.display = "none";
	showSlides(playground);
};

$("home").onclick = showTitleScreen;


addEventListener("keydown", function(event) {
	if (transitioningScreen || transitioningSlide) return;
	
	switch (event.keyCode) {
		case 27: // ESC
			if ($("slide").style.opacity === "1") showTitleScreen();
			break;
			
		case 37: // feft arrow
			if ($("previous").style.display === "block") previousSlide();
			break;
		
		case 32: // spacebar
		case 39: // right arrow
			if ($("next").style.display === "block") nextSlide();
			break;
	}
});


window.onload = function() {
	$("langSelect").style.opacity = 1;
	setTimeout(function () { scrollTo(0, 0); }, 1000);
}


function requestFullscreen() {
	if (isMobileDevice()) {
		$("body").requestFullscreen();
	}
}

// document.onfullscreenchange = function() {
// 	console.log(document.fullscreenElement);
// }