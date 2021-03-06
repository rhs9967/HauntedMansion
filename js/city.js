// city.js
"use strict";
// if app exists use the existing copy
// else create a new object literal
var app = app || {};

app.city = {
    	// CONSTANT properties
    	SCREEN_WIDTH: window.innerWidth,
		SCREEN_HEIGHT: window.innerHeight,
		VIEW_ANGLE: 75,
		ASPECT: this.SCREEN_WIDTH / this.SCREEN_HEIGHT,
		NEAR: 1,
		FAR: 20000,
		
		// Variable properties
		renderer: undefined,
		scene: undefined,
		camera: undefined,
		person: undefined,
		controls: undefined,
		flashLight: undefined,
		direction: undefined,
		myobjects: [],
		invobjects: [],
		paused: false,
		noCollision: true,
		dt: 1/60,
		movementSpeed : 0.3,
		actualMoveSpeed : (1/60) * 1.0,
		collidableMeshList : [],
		typeHit : 0,
		readiedPedestals : 0,
		bats : [],
		batFlys: undefined,
		clock: undefined,
		endTimer: 0,
		end: undefined,
		gui: undefined,
		controlz: undefined,
		gameOver: false,
		instruct: undefined,
		
		
    	init : function() {
			console.log('init called');
			
			this.setupThreeJS();
			this.setupWorld();
			this.update();
    	},
    	
    	
    update: function(){
    	// schedule next animation frame
    	app.animationID = requestAnimationFrame(this.update.bind(this));
    	
		// PAUSED?
		if (app.paused){
			this.drawPauseScreen();
			return;
		 }
		 
		 // check if pedestals are aligned correctly
		 if(this.readiedPedestals == 4){
			// END GAME //
			this.end.position = this.camera.position;
			if(this.gameOver == false) {
				this.endTimer++;
				this.gameOver = true;
			} else if (this.endTimer < 150){
				console.log(this.endTimer);
				this.end.intensity +=.5;
				this.endTimer++;
			} else {
				window.location.reload();
			}
			// DRAW	
			this.renderer.render(this.scene, this.camera);
			return;
		 }
		 
		 // check to see whether to hide/unhide the instructions
		 if(this.controls.hide == true)
		 {
			this.scene.remove(this.instruct);
			console.log("HERE");
		 }
		 else
		 {
			this.scene.add(this.instruct);
		 }
		 
		 
		// fixed player's y
		this.person.position.y = 5;
	
		// check collisions
		this.checkCollisions();
		
		// UPDATE
		//debugger;
		this.controls.update(this.dt, this.person);
		this.person.rotation = this.controls.object.rotation;
		this.bats[0].rotation = this.controls.object.rotation;
		//this.controls.update(this.dt);
		
		// update bat sprite
		var delta = this.clock.getDelta();
		this.batFlys.update(1000 * delta);
		
		// rotate uncollected artifacts
		for(var i = 0; i < this.myobjects.length; i++) {
			this.myobjects[i].update(this.dt);
		}
		
		///////////////////////////////////////////////////////////////////////////////////////////////////
		// collision detection and prevention
		// coded by Zach Whitman 
		var oldrotation = this.person.rotation;
		var tempPersonG = new THREE.CubeGeometry( .5, .5, .5 );
		var tempPerson = new THREE.Mesh(tempPersonG);
		tempPerson.position.set(this.person.position.x, this.person.position.y-4, this.person.position.z);
		tempPerson.rotation.set(oldrotation.x, oldrotation.y, oldrotation.z);
		//this.scene.add(tempPerson);
		var collided = false;
		if ( this.controls.freeze == false) {
			// move the cube up,left,down,right
			if ( this.controls.moveRight )
			{
				//this.person.position.x -= this.movementSpeed;
				tempPerson.translateX( this.movementSpeed);
				//tempPerson.translateX( this.movementSpeed);
				//oldX += this.movementSpeed;
				this.typeHit = 1;
			}
			else if ( this.controls.moveLeft )
			{
				//this.person.position.x += this.movementSpeed;
				tempPerson.translateX( -this.movementSpeed);
				//tempPerson.translateX( -this.movementSpeed);
				//oldX -= this.movementSpeed;
				this.typeHit = 2;
			}
			else if ( this.controls.moveBackward )
			{
				//this.person.position.z -= this.movementSpeed;
				tempPerson.translateZ( this.movementSpeed);
				//tempPerson.translateZ( this.movementSpeed);
				//oldZ += this.movementSpee;
				this.typeHit = 3;
			}
			else if ( this.controls.moveForward )
			{
				//this.person.position.z += this.movementSpeed;
				tempPerson.translateZ( -this.movementSpeed);
				//tempPerson.translateZ( -this.movementSpeed);
				//oldZ -= this.movementSpeed;
				this.typeHit = 4;
			}
		}
		
		var originPoint = tempPerson.position.clone();
		//var originPoint = tempPerson.position.clone();
		//clearText(originPoint);
		
		// check for collisions
		//for (var vertexIndex = 0; vertexIndex < tempPerson.geometry.vertices.length; vertexIndex++)
		for (var vertexIndex = 0; vertexIndex < tempPerson.geometry.vertices.length; vertexIndex++)
		{		
			var localVertex = tempPerson.geometry.vertices[vertexIndex].clone();
			var globalVertex = localVertex.applyMatrix4( tempPerson.matrix );
			var directionVector = globalVertex.sub( tempPerson.position );
			
			//var localVertex = tempPerson.geometry.vertices[vertexIndex].clone();
			//var globalVertex = localVertex.applyMatrix4( tempPerson.matrix );
			//var directionVector = globalVertex.sub( tempPerson.position );
			
			var ray = new THREE.Raycaster( originPoint, directionVector.clone().normalize() );
			var collisionResults = ray.intersectObjects( this.collidableMeshList );
			
			if ( collisionResults.length > 0 && collisionResults[0].distance < 2 ) 
			{
			// There was a collision so you must undo the movement
				if(this.typeHit == 1)
				{
					//this.person.position.x += this.movementSpeed;
					tempPerson.translateX( -this.movementSpeed);
					collided = true;
				}
				else if(this.typeHit == 2)
				{
					//this.person.position.x -= this.movementSpeed;
					tempPerson.translateX( this.movementSpeed);
					collided = true;
				}
				else if(this.typeHit == 3)
				{
					//this.person.position.z += this.movementSpeed;
					tempPerson.translateZ( -this.movementSpeed);
					collided = true;
				}
				else if(this.typeHit == 4)
				{
					//this.person.position.z -= this.movementSpeed;
					tempPerson.translateZ( this.movementSpeed);
					collided = true;
				}
				this.typeHit = 0;
			} // end collision hit
			
		} // end check for collision loop
		
		if(collided == false)
		{
			this.person.position = tempPerson.position;
		} else {
			//console.log("collision");
		}
		///////////////////////////////////////////////////////////////////////////////////////////////////
		this.person.position = tempPerson.position;
		this.person.position.y = 5;
		this.camera.position.set( this.person.position.x, this.person.position.y, this.person.position.z);
		

		// flashlight
		if(this.controls.lightOn) {
			this.flashLight.intensity = 2;
		} else {
			this.flashLight.intensity = 0;
		}
		
	
		// DRAW	
		this.renderer.render(this.scene, this.camera);
		
		//update the bat and make it follow the player
		this.bats[0].position.set(this.person.position.x - 5, this.person.position.y, this.person.position.z);
		
		
		
		//update properties based off of the gui
		for(var i = 0; i < app.mansion.lights.length; i++)
		{
			//app.mansion.lights[i].intensity = this.controlz.lightLevel;
		}
		
		for(var i = 0; i < this.myobjects.length; i++) {
			this.myobjects[i].rotateX = this.controlz.artifactXSpeed;
			this.myobjects[i].rotateY = this.controlz.artifactYSpeed;
			this.myobjects[i].rotateZ = this.controlz.artifactZSpeed;
		}
		
		
		// DRAW	
		this.renderer.render(this.scene, this.camera);
		
	},
	
	
	setupThreeJS: function() {
				// scene
				this.scene = new THREE.Scene();
				//this.scene.fog = new THREE.FogExp2(0x9db3b5, 0.002);
				//this.scene.fog = new THREE.Fog(0x0f0f0f, 5, 85);
				
				// camera
				//this.camera = new THREE.PerspectiveCamera( this.VIEW_ANGLE, this.ASPECT, this.NEAR, this.FAR );
				this.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
				this.camera.position.set( -45, 5, 45 );
				//this.camera.position.set( 0, 75, 0 );
				this.camera.rotation.y = Math.PI / 180;
				this.scene.add( this.camera );
				
				// set up the cube that the camera will rest on
				var cubeGeometry = new THREE.CubeGeometry( .5, 4, .5 );
				var cubeTexture = new THREE.ImageUtils.loadTexture( 'images/SquareBlue.png' );
				var cubeMaterial = new THREE.MeshBasicMaterial( { map: cubeTexture, side: THREE.DoubleSide } );
				
				this.person = new THREE.Mesh(cubeGeometry,cubeMaterial);
				this.person.receiveShadow = false;
				this.person.castShadow = false;
				
				this.person.position.set( -45, 5, 45);
				//this.person.position.set( -45, 5, 45);
				this.person.position = this.camera.position;
				//this.person.position = this.camera.position;
				//this.person.rotation = this.camera.rotation;
				this.scene.add(this.person);
				
				this.clock = new THREE.Clock();
				
				
				//this.camera.lookAt( this.scene.position );

				// renderer
				this.renderer = new THREE.WebGLRenderer({antialias: true});
				this.renderer.setSize( this.SCREEN_WIDTH, this.SCREEN_HEIGHT );
				this.renderer.shadowMapEnabled = true;
				document.body.appendChild(this.renderer.domElement );

				// controls
				this.controls = new THREE.FirstPersonControls(this.camera);
				this.controls.movementSpeed = 15;
				this.controls.lookSpeed = .5;
				this.controls.autoForward = false;
				
				// allows the gui to control different things
				this.controlz = new function()
				{
					//this.lightLevel = 2;
					this.artifactXSpeed = 0.03;
					this.artifactYSpeed = 0.1;
					this.artifactZSpeed = 0.01;
				}
				
				//adds in a new gui
				this.gui = new dat.GUI();
				//this.gui.add(this.controlz, 'lightLevel', 0, 10);
				this.gui.add(this.controlz, 'artifactXSpeed', 0, 1);
				this.gui.add(this.controlz, 'artifactYSpeed', 0, 1);
				this.gui.add(this.controlz, 'artifactZSpeed', 0, 1);
				
				app.mansion.init();
	},
	

				
	setupWorld: function() {				
				// helper axes
				var axes = new THREE.AxisHelper(100);
				//this.scene.add( axes );	
				
				// add skybox
				this.drawSkyBox();
				
				// add artifacts
				this.setupArtifacts();
				
				// add mansion
				this.setupMansion();			
				
				// add bats
				this.setUpBats();
				
				// add instructions
				this.instructions();
				
				// once done adding to myobjects, set object.id for each object
				for(var i=0; i < this.myobjects.length; i++) {
					this.myobjects[i].cube.id = i;
				}
				
				this.direction = new THREE.Vector3(0, 0, 0);
				
				// flashLight
				this.flashLight = new THREE.PointLight(0xffffff, 0, 20);
				this.flashLight.position = this.camera.position;		
				this.scene.add(this.flashLight);
				
				// add subtle ambient lighting
				var ambientLight = new THREE.AmbientLight(0x0f0f0f);//(0xffffff);
				this.scene.add(ambientLight);
				
				// end game light effect setup
				this.end = new THREE.PointLight(0xffffff, 0, 100);
				this.end.position = this.camera.position;
				this.scene.add( this.end );
	},
			
	setupMansion: function(){	
		// pedestals //
		// geometry
		var pedGeometry = new THREE.CubeGeometry( 1, 4, 1 );
		// move pivot point to bottom of cube instead of center
		pedGeometry.applyMatrix( new THREE.Matrix4().makeTranslation( 0, 2, 0 ) );
		
		// material
		var red = new THREE.MeshLambertMaterial({color: 0xA31919});
		var blue = new THREE.MeshLambertMaterial({color: 0x002EB8});
		var green = new THREE.MeshLambertMaterial({color: 0x007A29});
		var yellow = new THREE.MeshLambertMaterial({color: 0xB8B800});
		
		var pedestal1 = new app.Pedestal(pedGeometry, red, -40, 0, 30, 0);
		var pedestal2 = new app.Pedestal(pedGeometry, blue, 25, 0, 0, 1);
		var pedestal3 = new app.Pedestal(pedGeometry, green, -30, 0, -40, 2);
		var pedestal4 = new app.Pedestal(pedGeometry, yellow, 5, 0, -35, 3);
		
		// add pedestals
		this.scene.add(pedestal1.cube);
		this.scene.add(pedestal2.cube);
		this.scene.add(pedestal3.cube);
		this.scene.add(pedestal4.cube);
		
		// add to clickable objects
		this.myobjects.push(pedestal1);
		this.myobjects.push(pedestal2);
		this.myobjects.push(pedestal3);
		this.myobjects.push(pedestal4);
		
	},
	
	setupArtifacts: function()
	{
		// define cube
		// geometry
		var cubeGeometry = new THREE.CubeGeometry( 1, 1, 1 );
		
		// textures
		var cubeTexture1 = new THREE.ImageUtils.loadTexture( 'images/SquareRed.png' );
		var cubeTexture2 = new THREE.ImageUtils.loadTexture( 'images/SquareBlue.png' );
		var cubeTexture3 = new THREE.ImageUtils.loadTexture( 'images/SquareGreen.png' );
		var cubeTexture4 = new THREE.ImageUtils.loadTexture( 'images/SquareYellow.png' );
		
		// materials
		var cubeMaterial1 = new THREE.MeshBasicMaterial( { map: cubeTexture1, side: THREE.DoubleSide } );
		var cubeMaterial2 = new THREE.MeshBasicMaterial( { map: cubeTexture2, side: THREE.DoubleSide } );
		var cubeMaterial3 = new THREE.MeshBasicMaterial( { map: cubeTexture3, side: THREE.DoubleSide } );
		var cubeMaterial4 = new THREE.MeshBasicMaterial( { map: cubeTexture4, side: THREE.DoubleSide } );
		
		// creates 3 new artifacts based off imported geometry, material and position
		var cube1 = new app.Artifact(cubeGeometry, cubeMaterial1, 10, 5, -5, 0);
		var cube2 = new app.Artifact(cubeGeometry, cubeMaterial2, -15, 5, 0, 1);
		var cube3 = new app.Artifact(cubeGeometry, cubeMaterial3, 35, 5, 25, 2);
		var cube4 = new app.Artifact(cubeGeometry, cubeMaterial4, 5, 5, 35, 3);
		
		// add cubes
		this.scene.add(cube1.cube);
		this.scene.add(cube2.cube);
		this.scene.add(cube3.cube);
		this.scene.add(cube4.cube);
		
		// add to clickable objects
		this.myobjects.push(cube1);
		this.myobjects.push(cube2);
		this.myobjects.push(cube3);
		this.myobjects.push(cube4);
		
	},
	
	// collision
	checkCollisions: function() {
		var caster = new THREE.Raycaster();
		
		var rays = [
			new THREE.Vector3(0,0,-1),
			new THREE.Vector3(0,0,1),
			new THREE.Vector3(1,0,0),
			new THREE.Vector3(-1,0,0)
		/*
			new THREE.Vector3(0, 0, 1),
			new THREE.Vector3(1, 0, 1),
			new THREE.Vector3(1, 0, 0),
			new THREE.Vector3(1, 0, -1),
			new THREE.Vector3(0, 0, -1),
			new THREE.Vector3(-1, 0, -1),
			new THREE.Vector3(-1, 0, 0),
			new THREE.Vector3(-1, 0, 1)
			*/
		];
		
		var collisions;
		var distance = 0;
		
		// array of collidables
		var objectArray = [];		
		for(var i=0; i < this.myobjects.length; i++) {
			objectArray.push(this.myobjects[i].cube);
		}
		
		for(var i=0; i < app.mansion.walls.length; i++) {
			objectArray.push(app.mansion.walls[i].cube);
		}
		
		for(var i=0; i < app.mansion.windows.length; i++) {
			objectArray.push(app.mansion.windows[i]);
		}
		
		// for each ray
		for (var i = 0; i < rays.length; i++) {
		  // We reset the raycaster to this direction
		  caster.set(this.person.position, rays[i]);
		  // Test if we intersect with any obstacle mesh
		  collisions = caster.intersectObjects(objectArray);
		  // And disable that direction if we do
		  if (collisions.length > 0 && collisions[0].distance < distance) {
			  if ((i == 0 || i == 1) && this.direction.z == 1) {
				this.direction.setZ(0);
			  }
		  }
		  /*
		  if (collisions.length > 0 && collisions[0].distance <= distance) {
			// Yep, this.rays[i] gives us : 0 => up, 1 => up-left, 2 => left, ...
			if ((i === 0 || i === 1 || i === 7) && this.direction.z === 1) {
			  this.direction.setZ(0);
			} else if ((i === 3 || i === 4 || i === 5) && this.direction.z === -1) {
			  this.direction.setZ(0);
			}
			if ((i === 1 || i === 2 || i === 3) && this.direction.x === 1) {
			  this.direction.setX(0);
			} else if ((i === 5 || i === 6 || i === 7) && this.direction.x === -1) {
			  this.direction.setX(0);
			}
		  }
		  */
		}
	},
	
	// Interactivity
	onMouseDown: function(event) {
		event.preventDefault();
		var projector = new THREE.Projector();
		
		// 2D point where we clicked on the screen
		var vector = new THREE.Vector3(( event.clientX / window.innerWidth ) * 2 - 1, -( event.clientY / window.innerHeight ) * 2 + 1, 0.5);
		
		// 2D point converted to 3D point in world
		projector.unprojectVector(vector, this.camera);
		
		// cast a ray from the camera to the 3D point we clicked on
		var raycaster = new THREE.Raycaster(this.camera.position, vector.sub(this.camera.position).normalize());
		
		var objectArray = [];
		
		for(var i=0; i < this.myobjects.length; i++) {
			objectArray.push(this.myobjects[i].cube);
		}
		
		var intersects = raycaster.intersectObjects(objectArray);
		
		if (intersects.length > 0 && intersects[ 0 ].distance < 7) {
			// locate instance in myobjects array
			var obj = this.myobjects[intersects[0].object.id];
		
			// if a pedestal
			if (obj.isPedestal){
				// if there is an artifact in place
				if (obj.artifactId >= 0) {
					// ignore
					return;
					
					// remove artifact from scene
					//this.scene.remove(this.myobjects[obj.artifactId].cube);					
					// put artifact in inventory
					//this.invobjects.push(this.myobjects[obj.artifactId]);
				} else {
					// place first artifact in inventory on pedestal
					obj.artifactId = this.invobjects[0].cube.id;
					this.invobjects[0].pedestalId = obj.cube.id;
					
					// check if correct artifact
					if (this.invobjects[0].colorId == obj.colorId) {
						obj.readied = true;
						this.readiedPedestals++;
					}
					
					// set artifact's position to match pedestal's
					this.myobjects[obj.artifactId].cube.position.set(obj.cube.position.x, 5, obj.cube.position.z);
					
					// update inventory
					// splice( removes elements starting at this index, number of elements)
					// returns new array containing elements that have been removed
					this.invobjects.splice(0, 1);
					
					// add artifact to scene
					this.scene.add(this.myobjects[obj.artifactId].cube);
				}
			} 
			// else if a door
			else if (obj.isDoor){
				// close all doors
				for(var i=0; i < app.mansion.doors.length; i++) {
					// don't close doors if clicked door is already open
					if (obj != app.mansion.doors[i]){
						app.mansion.doors[i].isOpen = false;
						app.mansion.doors[i].move();
					}
					// reopen
				}
				// interact with door
				obj.isOpen = !obj.isOpen;
				obj.move();
			} else {
				// remove artifact from scene
				this.scene.remove(obj.cube);
				// put artifact in inventory
				this.invobjects.push(obj);
				
				// check if it was previously on a pedestal
				if (obj.pedestalId >= 0) {
					// disconnect the two, pedestal first since we have access to artifact locally
					this.myobjects[obj.pedestalId].artifactId = -1;
					obj.pedestalId = -1;
					if (this.myobjects[obj.pedestalId].readied) {
						this.myobjects[obj.pedestalId].readied = false;
						this.readiedPedestals--;
					}
				}
				
				// turn off lights
				for(var i=0; i < app.mansion.lights.length; i++) {
					this.scene.remove(app.mansion.lights[i]);
				}
			}		
		}
	},
	
	// Drawing //
			
	drawSkyBox: function(){		
		// skybox
		var imagePrefix = "images/grimmnight-";//"images/dawnmountain-";
		var directions  = ["xpos", "xneg", "ypos", "yneg", "zpos", "zneg"];
		var imageSuffix = ".png";
		var skyGeometry = new THREE.CubeGeometry( 5000, 5000, 5000 );	
		
		var materialArray = [];
		for (var i = 0; i < 6; i++)
			materialArray.push( new THREE.MeshBasicMaterial({
				map: THREE.ImageUtils.loadTexture( imagePrefix + directions[i] + imageSuffix ),
				side: THREE.BackSide
			}));
		var skyMaterial = new THREE.MeshFaceMaterial( materialArray );
		var skyBox = new THREE.Mesh( skyGeometry, skyMaterial );
		this.scene.add( skyBox );
	},

	
	drawPauseScreen: function(){
		// do something pause-like if you want
	},
	
	// setUpBats written by Zach W
	setUpBats: function()
	{
		//debugger;
		var planeTexture = new THREE.ImageUtils.loadTexture('images/batFly.png');
		this.batFlys = new this.textureAnimator(planeTexture, 4, 1, 4, 50);
		var planeMaterial = new THREE.MeshBasicMaterial( {map: planeTexture, side:THREE.DoubleSide } );
		var planeGeometry = new THREE.PlaneGeometry(.5,.5, 1,1);
		var bat = new THREE.Mesh(planeGeometry,planeMaterial);
		bat.position.set(-45,5,45);
		
		//this.scene.add(bat);
		this.bats.push(bat);
		
	},
	// instructions written by Zach W.
	instructions: function()
	{
		//debugger;
		var planeTexture = new THREE.ImageUtils.loadTexture('images/instructions.png');
		var planeMaterial = new THREE.MeshBasicMaterial( {map: planeTexture, side:THREE.DoubleSide } );
		var planeGeometry = new THREE.PlaneGeometry(5,3, 1,1);
		
		this.instruct = new THREE.Mesh(planeGeometry,planeMaterial);

		//plane.rotation.y += 180;
		//this.instruct.position.set(-40,7.5,40.5);
		this.instruct.position.set(-45,5,40.3);
		
		this.scene.add(this.instruct);
	},
	
	// TextureAnimator function written by Lee Stemkoski
	textureAnimator: function(texture, tilesHoriz, tilesVert, numTiles, tileDispDuration) 
	{	
		// note: texture passed by reference, will be updated by the update function.
			
		this.tilesHorizontal = tilesHoriz;
		this.tilesVertical = tilesVert;
		// how many images does this spritesheet contain?
		//  usually equals tilesHoriz * tilesVert, but not necessarily,
		//  if there at blank tiles at the bottom of the spritesheet. 
		this.numberOfTiles = numTiles;
		texture.wrapS = texture.wrapT = THREE.RepeatWrapping; 
		texture.repeat.set( 1 / this.tilesHorizontal, 1 / this.tilesVertical );

		// how long should each image be displayed?
		this.tileDisplayDuration = tileDispDuration;

		// how long has the current image been displayed?
		this.currentDisplayTime = 0;

		// which image is currently being displayed?
		this.currentTile = 0;
			
		this.update = function( milliSec )
		{
			this.currentDisplayTime += milliSec;
			while (this.currentDisplayTime > this.tileDisplayDuration)
			{
				this.currentDisplayTime -= this.tileDisplayDuration;
				this.currentTile++;
				if (this.currentTile == this.numberOfTiles)
					this.currentTile = 0;
				var currentColumn = this.currentTile % this.tilesHorizontal;
				texture.offset.x = currentColumn / this.tilesHorizontal;
				var currentRow = Math.floor( this.currentTile / this.tilesHorizontal );
				texture.offset.y = currentRow / this.tilesVertical;
			}
		};
	}, // end TextureAnimator
	

	
	
	
};