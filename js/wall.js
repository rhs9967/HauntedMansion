// wall.js
// dependencies: none
// coded by Zach Whitman on 5/6

"use strict";
var app = app || {};

app.Wall = function(){

	// creates a new artifact based off of the cube geometry and which color it should be that is passed in
	function Wall(geometry, material, x, y, z){
		
		this.cube = new THREE.Mesh(geometry,material);
		this.cube.receiveShadow = true;
		this.cube.castShadow = true;
		
		this.cube.position.set( x, y, z);
		app.city.scene.add(this.cube);
		
	}; // end Wall Constructor
	
	
	var a = Wall.prototype;
		
	a.update = function(dt) {
	};
	
	


	return Wall; 
	
}();
