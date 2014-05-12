// mansion.js
"use strict";
// if app exists use the existing copy
// else create a new object literal
var app = app || {};

app.mansion = {
		// Constant Properties
		LENGTH: 90,
		HEIGHT: 10,
		WIDTH: 90,
		NUMBER_OF_WALLS: 20,
		WALL_LENGTH: 15,
		WALL_WIDTH: 0.5,
		
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
		this.addPlane(this.LENGTH, 0, this.WIDTH, 'images/WoodFloor1.jpg',-Math.PI/2); // floor
		this.addPlane(this.LENGTH, this.HEIGHT, this.WIDTH, 'images/WoodFloor1.jpg',Math.PI/2); // ceiling
			
		// create mansion //
		//var x = 20;
		//var z = 10;
		//var rot = Math.PI / 3;
		//this.makeWall(this.WALL_LENGTH, this.HEIGHT, this.WALL_WIDTH, 'images/Cottage_Wall_Night.jpg', x, 0, z, rot);
		
		// make perimeter //
		// length
		for (var i = 0; i < this.LENGTH/this.WALL_LENGTH; i++) {
			var x = this.WIDTH/2;
			var z = (i * this.WALL_LENGTH) - this.LENGTH/2 + this.WALL_LENGTH/2;
			this.makeWall(this.WALL_LENGTH, this.HEIGHT, this.WALL_WIDTH, 'images/Cottage_Wall_Night.jpg', x, 0, z, Math.PI/2);
			this.makeWall(this.WALL_LENGTH, this.HEIGHT, this.WALL_WIDTH, 'images/Cottage_Wall_Night.jpg', -x, 0, z, Math.PI/2);
		}
		// width
		for (var i = 0; i < this.WIDTH/this.WALL_LENGTH; i++) {
			var x = (i * this.WALL_LENGTH) - this.WIDTH/2 + this.WALL_LENGTH/2;
			var z = this.LENGTH/2;
			this.makeWall(this.WALL_LENGTH, this.HEIGHT, this.WALL_WIDTH, 'images/Cottage_Wall_Night.jpg', x, 0, z, 0);
			this.makeWall(this.WALL_LENGTH, this.HEIGHT, this.WALL_WIDTH, 'images/Cottage_Wall_Night.jpg', x, 0, -z, 0);
		}

		// make walls	
		for (var i = 0; i < this.NUMBER_OF_WALLS; i++) {
			var x = Math.floor(Math.random() * this.LENGTH/this.WALL_LENGTH)*this.WALL_LENGTH;
			var z = Math.floor(Math.random() * this.WIDTH/this.WALL_LENGTH)*this.WALL_LENGTH;
			x -= this.LENGTH/2;
			z -= this.WIDTH/2;
			var rot = Math.floor(Math.random()*2)*Math.PI/2; 
			this.makeWall(this.WALL_LENGTH, this.HEIGHT, this.WALL_WIDTH, 'images/Cottage_Wall_Night.jpg', x, 0, z, rot); 
		}
		
		// add walls
		//for (var i = 0; i < this.walls.length; i++) {
		//	this.scene.add(walls[i].cube);
		//}
		
		// merge all walls into a single geometry
		//var mansionGeometry = new Three.Geometry();
		//for (var i = 0; i < this.walls.length; i++) {
		//	THREE.GeometryUtils.merge(mansionGeometry, this.walls[i]);
		//}
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
	
	// Make a Wall
	makeWall : function(l, h, w, texturePath, x, y, z, rotation) {
		// walls //	
		// geometry
		var geometry = new THREE.CubeGeometry( l, h, w );
		// move pivot point to bottom of cube instead of center
		geometry.applyMatrix( new THREE.Matrix4().makeTranslation( 0, h/2, 0 ) );
		
		// texture & material
		var texture = new THREE.ImageUtils.loadTexture( texturePath );
		//var texture = new THREE.ImageUtils.loadTexture( 'images/Cottage_Wall_Night.jpg' );
		texture.wrapS = THREE.RepeatWrapping;
		texture.repeat.set( 2, 1);
		var material = new THREE.MeshLambertMaterial( { shading: THREE.SmoothShading, map: texture, wrapAround: true } );
		
		// create and setup wall
		var wall = new app.Wall(geometry, material, x, y, z);
		//var wall = new app.Wall(geometry, material, 0, 0, 0);
		wall.cube.rotation.y = rotation;
		
		// add to wall array
		this.walls.push(wall);
	}
};