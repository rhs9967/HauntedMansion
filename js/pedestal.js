// pedestal.js
// dependencies: none
// coded by Robert Schrupp on 5/6
// code from artifact.js and wall.js borrowed from Zach Whitman

"use strict";
var app = app || {};

app.Pedestal = function(){

	// creates a new artifact based off of the cube geometry and which color it should be that is passed in
	function Pedestal(geometry, material, x, y, z, id){
		
		this.cube = new THREE.Mesh(geometry,material);
		this.cube.receiveShadow = true;
		this.cube.castShadow = true;
		
		this.cube.position.set( x, y, z);
		
		this.artifactId = -1;
		this.colorId = id;
		this.readied = false;
		this.isPedestal = true;
		
	}; // end Pedestal Constructor
	
	
	var a = Pedestal.prototype;
		
	a.update = function(dt) {
	};
	
	


	return Pedestal; 
	
}();