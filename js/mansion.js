// mansion.js
"use strict";
// if app exists use the existing copy
// else create a new object literal
var app = app || {};

app.mansion = {
		// Constant Properties
		LENGTH = 100;
		HEIGHT = 10;
		WIDTH = 100;
		
		// Variable Properties
		scene = app.city.scene;
	
		init : function() {
			createMansion();
    	},
	
	// functions //
	
	createMansion : function() {
		// floor
			var floorTexture = new THREE.ImageUtils.loadTexture( 'images/WoodFloor1.jpg' );
			floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping; 
			floorTexture.repeat.set( 10, 10 );
			var floorMaterial = new THREE.MeshLambertMaterial( { map: floorTexture, side: THREE.FrontSide } );
			var floorGeometry = new THREE.PlaneGeometry(LENGTH, WIDTH, 10, 10);
			var floor = new THREE.Mesh(floorGeometry, floorMaterial);
			floor.position.y = 0;
			floor.rotation.x = -Math.PI / 2;
			floor.receiveShadow = true;
			this.scene.add(floor);
			
			// ceiling
			var ceilingTexture = new THREE.ImageUtils.loadTexture( 'images/WoodFloor1.jpg' );
			ceilingTexture.wrapS = ceilingTexture.wrapT = THREE.RepeatWrapping; 
			ceilingTexture.repeat.set( 10, 10 );
			var ceilingMaterial = new THREE.MeshLambertMaterial( { map: ceilingTexture, side: THREE.FrontSide } );
			var ceilingGeometry = new THREE.PlaneGeometry(LENGTH, WIDTH, 10, 10);
			var ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
			ceiling.position.y = HEIGHT;
			ceiling.rotation.x = Math.PI / 2;
			ceiling.receiveShadow = true;
			this.scene.add(ceiling);
			
			// generate interior
			
	},
	
	// Add Wall
	addWall : function(l, h, w, texturePath, x, y, z, rotation) {
		// walls //	
		// geometry
		var wallGeometry = new THREE.CubeGeometry( l, h, w );
		// move pivot point to bottom of cube instead of center
		wallGeometry.applyMatrix( new THREE.Matrix4().makeTranslation( 0, h/2, 0 ) );
		
		// material
		var wallTexture = new THREE.ImageUtils.loadTexture( texturePath );
		wallTexture.wrapS = THREE.RepeatWrapping;
		var wallMaterial = new THREE.MeshLambertMaterial( { shading: THREE.SmoothShading, map: wallTexture, wrapAround: true } );
		
		var wall = new app.Wall(wallGeometry, wallMaterial, x, y, z);
		wall.cube.rotation.y = rotation;
		
		// add walls
		this.scene.add(wall.cube);
	}
};