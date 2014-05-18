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
		DOOR_IMAGE: 'images/Door1.jpg',
		SCONCE_IMAGE: 'images/Sconce.jpg',
		
		// Variable Properties
		scene: undefined,
		//mansion: undefined,1
		walls: [],
		lights: [],
		
	
		init : function() {
			this.scene = app.city.scene;
			this.createMansion();
    	},
	
	// functions //
	
	createMansion : function() {
		// add planes
		this.addPlane(this.LENGTH, 0, this.WIDTH, 'images/WoodCeiling1.jpg',-Math.PI/2); // floor
		this.addPlane(this.LENGTH, this.HEIGHT, this.WIDTH, 'images/WoodCeiling1.jpg',Math.PI/2); // ceiling 'images/Ceiling_Black.jpg'
		
		var rowMax = this.LENGTH/this.WALL_LENGTH;
		var colMax = this.WIDTH/this.WALL_LENGTH;		
		/*
		// setup grid //
		// North to South
		for (var i = 0; i <= rowMax; i++){
			var x = (i * this.WALL_LENGTH) - this.WIDTH/2;
			// West to East
			for(var j = 0; j < colMax; j++){
				if(i == 1){
					if(j > 0){
					
					} else {
					var z = (j * this.WALL_LENGTH) - this.LENGTH/2;
					this.addWall(this.WALL_LENGTH, this.HEIGHT, this.WALL_WIDTH, this.WALL_IMAGE, x, 0, z, Math.PI/2);
				}
				} else {
					var z = (j * this.WALL_LENGTH) - this.LENGTH/2;
					this.addWall(this.WALL_LENGTH, this.HEIGHT, this.WALL_WIDTH, this.WALL_IMAGE, x, 0, z, Math.PI/2);
				}
			}
		}
		
		// West to East
		for (var i = 0; i <= colMax; i++){
			var z = (i * this.WALL_LENGTH) - this.LENGTH/2;
			// North to South
			for(var j = 1; j <= rowMax; j++){
				if(i == 25 && j == 25){
				} else {
					var x = (j * this.WALL_LENGTH) - this.WIDTH/2;
					this.addWall(this.WALL_LENGTH, this.HEIGHT, this.WALL_WIDTH, this.WALL_IMAGE, x, 0, z, 0);
				}
			}
		}
		
		*/
		
		// OLD //
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
			if(i != 6 && i != 1) {
				this.addWall(this.WALL_LENGTH, this.HEIGHT, this.WALL_WIDTH, this.WALL_IMAGE, 40, 0, z, Math.PI/2);
			} else {
				this.addDoor(this.WALL_LENGTH, this.HEIGHT, this.WALL_WIDTH, this.DOOR_IMAGE, 40, 0, z-(this.WALL_LENGTH/2), 3);
			}
		}
		
		// third hallway
		for (var i = 0; i < (this.WIDTH/this.WALL_LENGTH)-1; i++) {
			var x = (i * this.WALL_LENGTH) - this.WIDTH/2 + this.WALL_LENGTH/2;
			// North side
			if(i != (this.WIDTH/this.WALL_LENGTH)-3 && i != 3 && i!= 4) this.addWall(this.WALL_LENGTH, this.HEIGHT, this.WALL_WIDTH, this.WALL_IMAGE, x, 0, 20, 0);
			else{// if ( i != (this.WIDTH/this.WALL_LENGTH)-3){
				this.addDoor(this.WALL_LENGTH, this.HEIGHT, this.WALL_WIDTH, this.DOOR_IMAGE, x+(this.WALL_LENGTH/2), 0, 20, 0);
			}
			
			// South side
			if(i != 1) {
				this.addWall(this.WALL_LENGTH, this.HEIGHT, this.WALL_WIDTH, this.WALL_IMAGE, x, 0, 10, 0);
			} else {
				this.addDoor(this.WALL_LENGTH, this.HEIGHT, this.WALL_WIDTH, this.DOOR_IMAGE, x+(this.WALL_LENGTH/2), 0, 10, 2);
			}
		}
		
		// eastern interior walls
		for (var i = 0; i < (this.WIDTH/this.WALL_LENGTH)-1; i++) {
			var z = (i * this.WALL_LENGTH) - this.LENGTH/2 + this.WALL_LENGTH/2;
			this.addWall(this.WALL_LENGTH, this.HEIGHT, this.WALL_WIDTH, this.WALL_IMAGE, -10, 0, z, Math.PI/2);
			if(i == 5) i++;
		}
		
		// western interior walls
		for (var i = 0; i < (this.WIDTH/this.WALL_LENGTH)-1; i++) {
			var z = (i * this.WALL_LENGTH) - this.LENGTH/2 + this.WALL_LENGTH/2;			
			if(i == 7 || i == 8) this.addWall(this.WALL_LENGTH, this.HEIGHT, this.WALL_WIDTH, this.WALL_IMAGE, 10, 0, z, Math.PI/2);
		}
		
		// sconces
		this.addsconce(50, 7, -45, this.SCONCE_IMAGE);
		this.addsconce(0, 7, 50, this.SCONCE_IMAGE);
		this.addsconce(50, 7, 45, this.SCONCE_IMAGE);		
		
		this.addsconce(0, 7, -50, this.SCONCE_IMAGE);
		
		// paintings
		this.addPainting(4, 3, .1, 'images/painting1.jpg', -25, 6.5, 49.4, 0);
		this.addPainting(5, 3, .1, 'images/painting2.jpg', 25, 6.5, 40.6, 0);
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
		// geometry
		var geometry = new THREE.CubeGeometry( l, h, w );
		// move pivot point to bottom of cube instead of center
		geometry.applyMatrix( new THREE.Matrix4().makeTranslation( 0, h/2, 0 ) );//( 0, h/2, 0 ) );
		
		// texture & material
		var texture = new THREE.ImageUtils.loadTexture( texturePath );
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
	
	addDoor : function(l, h, w, texturePath, x, y, z, direction) {
		// geometry
		var geometry = new THREE.CubeGeometry( l-.01, h, w+.1 );
		// move pivot point to bottom of cube instead of center
		geometry.applyMatrix( new THREE.Matrix4().makeTranslation( -l/2, h/2, 0 ) );
		
		// texture & material
		var texture = new THREE.ImageUtils.loadTexture( texturePath );
		texture.wrapS = THREE.RepeatWrapping;
		texture.repeat.set( 1, 1);
		var material = new THREE.MeshLambertMaterial( { shading: THREE.SmoothShading, map: texture, wrapAround: true } );
		
		// create and setup door
		var door = new app.Door(geometry, material, x, y, z, direction);
		door.move();
		
		// add door to targetable objects
		app.city.myobjects.push(door);
	},
	
	addsconce: function(x, y, z, texturePath) {
		// pointLight
		var light = new THREE.PointLight(0xffffff, 2, 25);
		light.position.set(x, y, z);
		this.scene.add( light );
		
		// add to light array
		this.lights.push(light);
	
		// sconce
		var geometry = new THREE.CylinderGeometry(0, 1.5, 1.5, 4, false); 
		var texture = new THREE.ImageUtils.loadTexture( texturePath );
		var material = new THREE.MeshLambertMaterial( { shading: THREE.SmoothShading, map: texture, wrapAround: true } );
		var pyramid = new THREE.Mesh(geometry, material);
		pyramid.receiveShadow = false;
		pyramid.castShadow = false;
		pyramid.position.set(x, y, z);
		pyramid.rotation.x=Math.PI;
		this.scene.add(pyramid);
	},
	
	addPainting: function(l, h, w, texturePath, x, y, z, rotation) {
		// paiting
		var geometry = new THREE.CubeGeometry( l, h, w ); 
		var texture = new THREE.ImageUtils.loadTexture( texturePath );
		var material = new THREE.MeshLambertMaterial( { map: texture } );
		var painting = new THREE.Mesh(geometry, material);
		painting.receiveShadow = true;
		painting.castShadow = false;
		painting.position.set(x, y, z);
		painting.rotation.y=rotation;
		this.scene.add(painting);
	}
};