/*
loader.js
variable app is in global scope - i.e. a property of window.
app is our single global object literal - all other functions and properties of 
the bubbles game will be properties of app.
*/
"use strict";

// if app exists use the existing copy
// else create a new object literal
var app = app || {};

// CONSTANTS of app
app.KEYBOARD = {
	"KEY_LEFT": 37, 
	"KEY_UP": 38, 
	"KEY_RIGHT": 39, 
	"KEY_DOWN": 40,
	"KEY_SPACE": 32
};

// properties of app
app.animationID = undefined;
app.paused = false;

// key daemon array
app.keydown = [];

// mouse bool
//app.isMouseDown = false;

(function(){
	var queue = new createjs.LoadQueue(false);
	queue.on("fileload", handleFileLoad, this);
	queue.on("complete", complete, this);
	queue.loadFile("js/lib/dat.gui.js");
	queue.loadFile("js/lib/three.min.js");
	queue.loadFile("js/lib/FirstPersonControls.js");
	queue.loadFile("js/city.js");
	queue.loadFile("js/artifact.js");
	queue.loadFile("js/wall.js");
	queue.loadFile("js/pedestal.js");
	queue.loadFile("js/mansion.js");
	queue.loadFile("js/door.js");
	queue.loadFile("js/window.js");
	queue.loadFile("js/bat.js");
	
	// skybox files
	queue.loadFile("js/Detector.js");
	queue.loadFile("js/Stats.js");
	queue.loadFile("js/OrbitControls.js");
	queue.loadFile("js/THREEx.KeyboardState.js");
	queue.loadFile("js/THREEx.FullScreen.js");
	queue.loadFile("js/THREEx.WindowResize.js");
	
	// additional files
	queue.loadFile("js/jquery-1.9.1.js");
	queue.loadFile("js/jquery-ui.js");
	
	function handleFileLoad(e){
		console.log(e + " loaded");
	}
	
	function handleComplete(e){
		app.city.init();
	}
	
	function mouseDown(e){
		//console.log("mousedown");
		app.city.onMouseDown(e);
	}
	
	// when the loading is complete, this function will be called
		 function complete(){
			
			// set up event handlers
			window.onblur = function(){
				app.paused = true;
				cancelAnimationFrame(app.animationID);
				app.keydown = []; // clear key daemon
				// call update() so that our paused screen gets drawn
				app.city.update();
			};
			
			window.onfocus = function(){
				app.paused = false;
				cancelAnimationFrame(app.animationID);
				// start the animation back up
				app.city.update();
			};
			
			// event listeners
			window.addEventListener("keydown",function(e){
				//console.log("keydown=" + e.keyCode);
				app.keydown[e.keyCode] = true;
			});
				
			window.addEventListener("keyup",function(e){
				//console.log("keyup=" + e.keyCode);
				app.keydown[e.keyCode] = false;
			});
			
			// start game
			app.city.init();
		} // end complete

}());



		
		
		

