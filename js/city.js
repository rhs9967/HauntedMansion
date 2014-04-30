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
		
	},
	
	setupThreeJS: function() {
				// scene
				this.scene = new THREE.Scene();
				//this.scene.fog = new THREE.FogExp2(0x9db3b5, 0.002);
				
				// camera
				//this.camera = new THREE.PerspectiveCamera( this.VIEW_ANGLE, this.ASPECT, this.NEAR, this.FAR );
				this.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
				this.camera.position.set( 5, 5, 0 );
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
				var geo = new THREE.PlaneGeometry(2000, 2000, 40, 40);
				var mat = new THREE.MeshPhongMaterial({color: 0x9db3b5, overdraw: true});
				var floor = new THREE.Mesh(geo, mat);
				floor.rotation.x = -0.5 * Math.PI;
				floor.receiveShadow = true;
				//this.scene.add(floor);
				
				// add skybox
				this.drawSkyBox();
				
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
				light.position.set(850, 1200, 2450);
				light.castShadow = true;
				light.shadowMapWidth = 2048;
				light.shadowMapHeight = 2048;
				
				var d = 1000; // d = 'distance'
				// "near" and "far" of shadows and camera
				light.shadowCameraLeft = d;
				light.shadowCameraRight = -3;
				light.shadowCameraTop = d;
				light.shadowCameraBottom = -d;
				light.shadowCameraFar = 2500;
				this.scene.add(light);
			},
			
	drawSkyBox: function(){
		// FLOOR
		var floorTexture = new THREE.ImageUtils.loadTexture( 'images/checkerboard.jpg' );
		floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping; 
		floorTexture.repeat.set( 10, 10 );
		var floorMaterial = new THREE.MeshBasicMaterial( { map: floorTexture, side: THREE.DoubleSide } );
		var floorGeometry = new THREE.PlaneGeometry(100, 100, 10, 10);
		var floor = new THREE.Mesh(floorGeometry, floorMaterial);
		floor.position.y = -0.5;
		floor.rotation.x = Math.PI / 2;
		this.scene.add(floor);
		
		// helper axes
		var axes = new THREE.AxisHelper(100);
		this.scene.add( axes );		
		
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