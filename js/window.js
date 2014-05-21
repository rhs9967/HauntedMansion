// window.js
// dependencies: none
// coded by Robert Schrupp on 5/18

"use strict";
var app = app || {};

app.Window = function(){

	// creates a new artifact based off of the cube geometry and which color it should be that is passed in
	function Window(geometry, material, x, y, z){
		
		this.isOpen = false;
		//this.direction = direction; // North, East, South, West : 
		
		this.cube = new THREE.Mesh(geometry,material);
		this.cube.receiveShadow = true;
		this.cube.castShadow = true;
		
		this.cube.position.set( x, y, z );	
		
		this.isWindow = true;
		
		app.city.scene.add(this.cube);
		
	}; // end Window Constructor
	
	
	var a = Window.prototype;
		
	a.update = function(dt) {
	};

	return Window; 
	
}();
