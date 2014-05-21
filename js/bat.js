// bat.js
// dependencies: none
// coded by Zach Whitman on 5/18

"use strict";
var app = app || {};

app.Bat = function(){

	// creates a new artifact based off of the cube geometry and which color it should be that is passed in
	function Bat(geometry, material, x, y, z){
		
		this.plane = new THREE.Mesh(geometry,material);
		this.plane.receiveShadow = true;
		this.plane.castShadow = true;
		
		this.plane.position.set( x, y, z);
		
		
	}; // end Artifact Constructor
	
	
	var a = Bat.prototype;
	
	// updates the cube's posistion
	a.update = function(dt) {
		this.plane.rotation.x += 0.03;
		this.plane.rotation.y += 0.1;
		this.plane.rotation.z += 0.01;
	};

	return Bat; 
	
}();
