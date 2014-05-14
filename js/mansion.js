// mansion.js
"use strict";
// if app exists use the existing copy
// else create a new object literal
var app = app || {};

app.mansion = {
		// Constant Properties
		LENGTH: 100,//90,
		HEIGHT: 10,
		WIDTH: 100,//90,
		NUMBER_OF_WALLS: 20,
		WALL_LENGTH: 10,//15,
		WALL_WIDTH: 0.5,
		WALL_IMAGE: 'images/Wall.jpg',
		
		// Variable Properties
		scene: undefined,
		//mansion: undefined,1
		walls: [],
		
	
		init : function() {
			this.scene = app.city.scene;
			this.createMansion();
    	},
	
	// functions //
	
	createMansion : function() {
		// add planes
		this.addPlane(this.LENGTH, 0, this.WIDTH, 'images/WoodCeiling1.jpg',-Math.PI/2); // floor
		this.addPlane(this.LENGTH, this.HEIGHT, this.WIDTH, 'images/WoodCeiling1.jpg',Math.PI/2); // ceiling 'images/Ceiling_Black.jpg'
		
		// add perimeter //
		// length
		for (var i = 0; i < this.LENGTH/this.WALL_LENGTH; i++) {
			var x = this.WIDTH/2;
			var z = (i * this.WALL_LENGTH) - this.LENGTH/2 + this.WALL_LENGTH/2;
			this.addWall(this.WALL_LENGTH, this.HEIGHT, this.WALL_WIDTH, this.WALL_IMAGE, x, 0, z, Math.PI/2);
			this.addWall(this.WALL_LENGTH, this.HEIGHT, this.WALL_WIDTH, this.WALL_IMAGE, -x, 0, z, Math.PI/2);
		}
		// width
		for (var i = 0; i < this.WIDTH/this.WALL_LENGTH; i++) {
			var x = (i * this.WALL_LENGTH) - this.WIDTH/2 + this.WALL_LENGTH/2;
			var z = this.LENGTH/2;
			this.addWall(this.WALL_LENGTH, this.HEIGHT, this.WALL_WIDTH, this.WALL_IMAGE, x, 0, z, 0);
			this.addWall(this.WALL_LENGTH, this.HEIGHT, this.WALL_WIDTH, this.WALL_IMAGE, x, 0, -z, 0);
		}
		
		// design interior //
		// first hallway
		for (var i = 0; i < (this.WIDTH/this.WALL_LENGTH)-1; i++) {
			var x = (i * this.WALL_LENGTH) - this.WIDTH/2 + this.WALL_LENGTH/2;
			this.addWall(this.WALL_LENGTH, this.HEIGHT, this.WALL_WIDTH, this.WALL_IMAGE, x, 0, 40, 0);
		}
		
		// second hallway
		for (var i = 0; i < (this.LENGTH/this.WALL_LENGTH)-1; i++) {
			// doorway
			var z = (i * this.WALL_LENGTH) - this.LENGTH/2 + this.WALL_LENGTH/2;
			this.addWall(this.WALL_LENGTH, this.HEIGHT, this.WALL_WIDTH, this.WALL_IMAGE, 40, 0, z, Math.PI/2);
			if(i == 5) i++;
		}
		
		// third hallway
		for (var i = 0; i < (this.WIDTH/this.WALL_LENGTH)-1; i++) {
			var x = (i * this.WALL_LENGTH) - this.WIDTH/2 + this.WALL_LENGTH/2;
			// North side
			this.addWall(this.WALL_LENGTH, this.HEIGHT, this.WALL_WIDTH, this.WALL_IMAGE, x, 0, 20, 0);
			
			// South side
			if(i != 0) this.addWall(this.WALL_LENGTH, this.HEIGHT, this.WALL_WIDTH, this.WALL_IMAGE, x, 0, 10, 0);
		}
		
		// sconces
		this.addsconce(50, 7, -45);
		this.addsconce(0, 7, 50);
		this.addsconce(50, 7, 45);
		
		
		this.addsconce(0, 7, -50);
	},
	
	// Add a plane to the scene
	addPlane : function(l, h, w, texturePath, rotation) {
		// texture
		var texture = new THREE.ImageUtils.loadTexture( texturePath );
		texture.wrapS = texture.wrapT = THREE.RepeatWrapping; 
		texture.repeat.set( 10, 10 );
		
		// material & geometry then mesh
		var material = new THREE.MeshLambertMaterial( { map: texture, side: THREE.FrontSide } );
		var geometry = new THREE.PlaneGeometry(l, w, 10, 10);
		var plane = new THREE.Mesh(geometry, material);
		
		// final adjustments then add to scene
		plane.position.y = h;
		plane.rotation.x = rotation;
		plane.receiveShadow = true;
		this.scene.add(plane);
	},
	
	// add a Wall
	addWall : function(l, h, w, texturePath, x, y, z, rotation) {
		// walls //	
		// geometry
		var geometry = new THREE.CubeGeometry( l, h, w );
		// move pivot point to bottom of cube instead of center
		geometry.applyMatrix( new THREE.Matrix4().makeTranslation( 0, h/2, 0 ) );
		
		// texture & material
		var texture = new THREE.ImageUtils.loadTexture( texturePath );
		//var texture = new THREE.ImageUtils.loadTexture( 'images/Cottage_Wall_Night.jpg' );
		texture.wrapS = THREE.RepeatWrapping;
		texture.repeat.set( 1, 1);
		var material = new THREE.MeshLambertMaterial( { shading: THREE.SmoothShading, map: texture, wrapAround: true } );
		
		// create and setup wall
		var wall = new app.Wall(geometry, material, x, y, z);
		//var wall = new app.Wall(geometry, material, 0, 0, 0);
		wall.cube.rotation.y = rotation;
		
		// add to wall array
		this.walls.push(wall);
	},
	
	addsconce: function(x, y, z) {
		// pointLight
		var light = new THREE.PointLight(0xffffff, 2, 25);
		light.position.set(x, y, z);
		this.scene.add( light );
	
		// object
		var pyramidGeometry = new THREE.CylinderGeometry(0, 1.5, 1.5, 4, false); 
		var pyramidMaterial = new THREE.MeshLambertMaterial();
		var pyramid = new THREE.Mesh(pyramidGeometry, pyramidMaterial);
		pyramid.receiveShadow = false;
		pyramid.castShadow = false;
		pyramid.position.set(x, y, z);
		pyramid.rotation.x=Math.PI;
		this.scene.add(pyramid);
	}
};