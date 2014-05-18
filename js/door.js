// door.js
// dependencies: none
// coded by Robert Schrupp on 5/18

"use strict";
var app = app || {};

app.Door = function(){

	// creates a new artifact based off of the cube geometry and which color it should be that is passed in
	function Door(geometry, material, x, y, z, direction){
		
		this.isOpen = false;
		this.direction = direction; // North, East, South, West : 
		
		this.cube = new THREE.Mesh(geometry,material);
		this.cube.receiveShadow = true;
		this.cube.castShadow = true;
		
		this.cube.position.set( x, y, z);	
		
		this.isDoor = true;
		
		app.city.scene.add(this.cube);
		
	}; // end Door Constructor
	
	
	var a = Door.prototype;
		
	a.update = function(dt) {
	};
	
	a.move = function() {
		// check if door is open
		if (this.isOpen){
			// if so, close it				
				switch(this.direction) {
				case 0: // North
					this.cube.rotation.y = Math.PI/2;
					break;
				case 1: // East
					this.cube.rotation.y = 0;
					break;
				case 2: // South
					this.cube.rotation.y = -Math.PI/2;
					break;
				default: // West
					this.cube.rotation.y = 0;
				}
		} else {
			// else, open it
			switch(this.direction) {
				case 0: // North
					this.cube.rotation.y = 0;
					break;
				case 1: // East
					this.cube.rotation.y = Math.PI/2;
					break;
				case 2: // South
					this.cube.rotation.y = 0;
					break;
				default: // West
					this.cube.rotation.y = Math.PI/2;
				}
		}
	};
	
	


	return Door; 
	
}();
