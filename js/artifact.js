// artifact.js
// dependencies: none
// coded by Zach Whitman on 5/6

"use strict";
var app = app || {};

app.Artifact = function(){

	// creates a new artifact based off of the cube geometry and which color it should be that is passed in
	function Artifact(geometry, material, x, y, z){
		
		this.cube = new THREE.Mesh(geometry,material);
		this.cube.receiveShadow = true;
		this.cube.castShadow = true;
		
		this.cube.position.set( x, y, z);
		
	}; // end Artifact Constructor
	
	
	var a = Artifact.prototype;
	
	// updates the cube's posistion
	a.update = function(dt) {
		this.cube.rotation.x += 0.03;
		this.cube.rotation.y += 0.1;
		this.cube.rotation.z += 0.01;
	};
	
	


	return Artifact; 
	
}();
