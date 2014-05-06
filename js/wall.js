// wall.js
// dependencies: none
// coded by Zach Whitman on 5/6

"use strict";
var app = app || {};

app.Wall = function(){

	// creates a new artifact based off of the cube geometry and which color it should be that is passed in
	function Wall(cubeGeometry, cubeMaterial, x, y, z){
		
		this.cube = new THREE.Mesh(cubeGeometry,cubeMaterial);
		this.cube.receiveShadow = true;
		this.cube.castShadow = true;
		
		this.cube.position.set( x, y, z);
		
	}; // end Wall Constructor
	
	
	var a = Wall.prototype;
		
	a.update = function(dt) {
	};
	
	


	return Wall; 
	
}();
