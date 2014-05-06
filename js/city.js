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
		
		// variable properties
		renderer: undefined,
		scene: undefined,
		camera: undefined,
		myobjects: [],
		invobjects: [],
		paused: false,
		dt: 1/60,
		controls: undefined,
		
		
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
	
		// UPDATE
		this.controls.update(this.dt);
		
		// DRAW	
		this.renderer.render(this.scene, this.camera);
		
		// rotate uncollected artifacts
		for(var i = 0; i < this.myobjects.length; i++) {
			this.myobjects[i].update(this.dt);
			//this.myobjects[i].rotation.x += 0.03;
			//this.myobjects[i].rotation.y += 0.1;
			//this.myobjects[i].rotation.z += 0.01;
		}
		
		
		
	},
	
	setupThreeJS: function() {
				// scene
				this.scene = new THREE.Scene();
				//this.scene.fog = new THREE.FogExp2(0x9db3b5, 0.002);
				
				// camera
				//this.camera = new THREE.PerspectiveCamera( this.VIEW_ANGLE, this.ASPECT, this.NEAR, this.FAR );
				this.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
				this.camera.position.set( 0, 5, 0 );
				this.camera.rotation.y = Math.PI / 180;
				//this.camera.lookAt( this.scene.position );

				// renderer
				this.renderer = new THREE.WebGLRenderer({antialias: true});
				this.renderer.setSize( this.SCREEN_WIDTH, this.SCREEN_HEIGHT );
				this.renderer.shadowMapEnabled = true;
				document.body.appendChild(this.renderer.domElement );

				// controls
				this.controls = new THREE.FirstPersonControls(this.camera);
				this.controls.movementSpeed = 15;
				this.controls.lookSpeed = .75;
				this.controls.autoForward = false;
	},
			
	setupWorld: function() {
				// floor
				var floorTexture = new THREE.ImageUtils.loadTexture( 'images/WoodFloor1.jpg' );
				floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping; 
				floorTexture.repeat.set( 10, 10 );
				var floorMaterial = new THREE.MeshBasicMaterial( { map: floorTexture, side: THREE.DoubleSide } );
				var floorGeometry = new THREE.PlaneGeometry(100, 100, 10, 10);
				var floor = new THREE.Mesh(floorGeometry, floorMaterial);
				floor.position.y = 0;
				floor.rotation.x = Math.PI / 2;
				floor.receiveShadow = true;
				this.scene.add(floor);
				
				// helper axes
				var axes = new THREE.AxisHelper(100);
				this.scene.add( axes );	
				
				// add skybox
				this.drawSkyBox();
				
				// add mansion
				this.setupMansion();
				
				// add artifacts
				this.setupArtifacts();
				
				// build city and add to scene //
				// make a base cube geometry for all of the buildings
				var geometry = new THREE.CubeGeometry( 1, 1, 1 );
				// move pivot point to bottom of cube instead of center
				geometry.applyMatrix( new THREE.Matrix4().makeTranslation( 0, 0.5, 0 ) );
				
				var cityGeometry = new THREE.Geometry();
				for (var i = 0; i < 300; i++) {
					var building = new THREE.Mesh(geometry.clone());
					building.position.x = Math.floor( Math.random() * 200 - 100 ) * 4;
					building.position.z = Math.floor( Math.random() * 200 - 100 ) * 4;
					building.scale.x = Math.pow(Math.random(), 2) * 50 + 10;
					building.scale.y = Math.pow(Math.random(), 3) * building.scale.x * 8 + 8;
					building.scale.z = building.scale.x;
					// merge!
					// we have a single geometry, so it renders faster
					THREE.GeometryUtils.merge(cityGeometry, building);
				}
				
				var material = new THREE.MeshPhongMaterial({color: 0xffcccc});
				// uncomment these 2 lines for a semi-transparent city
				//material.transparent = true;
				//material.opacity = 0.8;
				
				var city = new THREE.Mesh(cityGeometry, material);
				city.castShadow = true;
				city.receiveShadow = true;
				//this.scene.add(city);			
				
				// add directional light and enable shadows //
				// the "sun"
				var light = new THREE.DirectionalLight(0xf9f1c2, 1);
				//light.position.set(850, 1200, 2450);
				light.position.set(85,120,245);
				light.castShadow = true;
				light.shadowMapWidth = 2048;
				light.shadowMapHeight = 2048;
				
				var d = 1000; // d = 'distance'
				// "near" and "far" of shadows and camera
				light.shadowCameraLeft = d;
				light.shadowCameraRight = -d;
				light.shadowCameraTop = d;
				light.shadowCameraBottom = -d;
				light.shadowCameraFar = 2500;
				this.scene.add(light);
	},
			
	setupMansion: function(){
		// walls //	
		// geometry
		var wallGeometry1 = new THREE.CubeGeometry( 20, 10, 0.5 );
		// move pivot point to bottom of cube instead of center
		wallGeometry1.applyMatrix( new THREE.Matrix4().makeTranslation( 0, 5, 0 ) );
		
		// material
		var wallTexture1 = new THREE.ImageUtils.loadTexture( 'images/Cottage_Wall_Night.jpg' );
		wallTexture1.wrapS = wallTexture1.wrapT = THREE.RepeatWrapping; 
		wallTexture1.repeat.set( 3, 1 );
		var wallMaterial1 = new THREE.MeshBasicMaterial( { map: wallTexture1, side: THREE.DoubleSide } );
		
		// setup walls
		/*
		var wall1 = new THREE.Mesh(wallGeometry1, wallMaterial1);
		var wall2 = new THREE.Mesh(wallGeometry1, wallMaterial1);
		var wall3 = new THREE.Mesh(wallGeometry1, wallMaterial1);
		var wall4 = new THREE.Mesh(wallGeometry1, wallMaterial1);
		var wall5 = new THREE.Mesh(wallGeometry1, wallMaterial1);
		var wall6 = new THREE.Mesh(wallGeometry1, wallMaterial1);
		
		wall1.receiveShadow = wall2.receiveShadow = wall3.receiveShadow = wall4.receiveShadow = wall5.receiveShadow = wall6.receiveShadow = true;
		wall1.castShadow = wall2.castShadow = wall3.castShadow = wall4.castShadow = wall5.castShadow = wall6.castShadow = true;
		
		// set positions
		wall1.position.set( 5, 0, 14.75 );
		wall2.position.set( -5, 0, 14.75 );
		wall1.rotation.y = Math.PI / 2;
		wall2.rotation.y = Math.PI / 2;
		
		
		wall3.position.set( 15, 0, 5 );
		wall4.position.set( 15, 0, -5 );
		wall5.position.set( -15, 0, 5 );
		wall6.position.set( -15, 0, -5 );
		*/
		
		var wall1 = new app.Wall(wallGeometry1, wallMaterial1, 5, 0, 14.75);
		var wall2 = new app.Wall(wallGeometry1, wallMaterial1, -5, 0, 14.75);
		wall1.cube.rotation.y = Math.PI / 2;
		wall2.cube.rotation.y = Math.PI / 2;
		var wall3 = new app.Wall(wallGeometry1, wallMaterial1, 15, 0, 5);
		var wall4 = new app.Wall(wallGeometry1, wallMaterial1, 15, 0, -5);
		var wall5 = new app.Wall(wallGeometry1, wallMaterial1, -15, 0, 5);
		var wall6 = new app.Wall(wallGeometry1, wallMaterial1, -15, 0, -5);
		
		// add walls
		this.scene.add(wall1.cube);
		this.scene.add(wall2.cube);	
		this.scene.add(wall3.cube);	
		this.scene.add(wall4.cube);	
		this.scene.add(wall5.cube);	
		this.scene.add(wall6.cube);	
		
		
		// pedestals //
		
	},
	
	setupArtifacts: function()
	{
		// define cube
		// geometry
		var cubeGeometry = new THREE.CubeGeometry( 1, 1, 1 );
		var cubeTexture1 = new THREE.ImageUtils.loadTexture( 'images/SquareRed.png' );
		var cubeTexture2 = new THREE.ImageUtils.loadTexture( 'images/SquareBlue.png' );
		var cubeTexture3 = new THREE.ImageUtils.loadTexture( 'images/SquareGreen.png' );
		var cubeMaterial1 = new THREE.MeshBasicMaterial( { map: cubeTexture1, side: THREE.DoubleSide } );
		var cubeMaterial2 = new THREE.MeshBasicMaterial( { map: cubeTexture2, side: THREE.DoubleSide } );
		var cubeMaterial3 = new THREE.MeshBasicMaterial( { map: cubeTexture3, side: THREE.DoubleSide } );
		
		// materials
		/*
		var cubeTexture1 = new THREE.ImageUtils.loadTexture( 'images/SquareRed.png' );
		var cubeMaterial1 = new THREE.MeshBasicMaterial( { map: cubeTexture1, side: THREE.DoubleSide } );
		var cubeTexture2 = new THREE.ImageUtils.loadTexture( 'images/SquareBlue.png' );
		var cubeMaterial2 = new THREE.MeshBasicMaterial( { map: cubeTexture2, side: THREE.DoubleSide } );
		var cubeTexture3 = new THREE.ImageUtils.loadTexture( 'images/SquareGreen.png' );
		var cubeMaterial3 = new THREE.MeshBasicMaterial( { map: cubeTexture3, side: THREE.DoubleSide } );
		
		
		
		// setup cubes
		var cube1 = new THREE.Mesh(cubeGeometry, cubeMaterial1);
		var cube2 = new THREE.Mesh(cubeGeometry, cubeMaterial2);
		var cube3 = new THREE.Mesh(cubeGeometry, cubeMaterial3);
		
		cube1.receiveShadow = cube1.castShadow = cube2.receiveShadow = cube2.castShadow = cube2.receiveShadow = cube2.castShadow = true;
		
		cube1.position.set( 15, 5, 0);
		cube2.position.set( -15, 5, 0);
		cube3.position.set( 0, 5, 15);
		*/
		
		var cube1 = new app.Artifact(cubeGeometry, cubeMaterial1, 15, 5, 0);
		var cube2 = new app.Artifact(cubeGeometry, cubeMaterial2, -15, 5, 0);
		var cube3 = new app.Artifact(cubeGeometry, cubeMaterial3, 0, 5, 15);
		//cube1.cube.position.set( 15, 5, 0);
		
		// add cubes
		this.scene.add(cube1.cube);
		this.scene.add(cube2.cube);
		this.scene.add(cube3.cube);
		
		this.myobjects.push(cube1);
		this.myobjects.push(cube2);
		this.myobjects.push(cube3);
	},
	
	// Interactivity
	onMouseDown: function(event) {
		event.preventDefault();
		var projector = new THREE.Projector();
		var tube;
		
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
		
		if (intersects.length > 0 && intersects[ 0 ].distance < 5) {
			// remove from scene
			this.scene.remove(intersects[0].object);
			// put artifact in inventory
			this.invobjects.push(intersects[0].object);		
			
			//intersects[ 0 ].object.material.transparent = true;
			//intersects[ 0 ].object.material.opacity = 0.3;
			
			var points = [];
			var origin = raycaster.ray.origin.clone();
			//console.log(origin);
			//points.push(new THREE.Vector3(-30, 39.8, 30));
			points.push(origin);
			points.push(intersects[0].point);
			
			var mat = new THREE.MeshBasicMaterial({color: 0xff0000, transparent: true, opacity: 0.6});
            var tubeGeometry = new THREE.TubeGeometry(new THREE.SplineCurve3(points), 60, 0.001);

            //if (tube) this.scene.remove(tube);

            //if (this.controls.showRay) {
				//tube = new THREE.Mesh(tubeGeometry, mat);
				//this.scene.add(tube);
			//}
			
			//console.log("point.x="+intersects.[0].point.x);
			//console.log("point.y="+intersects.[0].point.y);
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
	}
	
};