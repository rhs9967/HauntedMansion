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
		myobjects: [],
		invobjects: [],
		paused: false,
		dt: 1/60,
		
		
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
		}
		
		// set person to camera's coords
		this.person.position.x = this.camera.position.x;
		this.person.position.y = this.camera.position.y;
		this.person.position.z = this.camera.position.z;	
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
				
				// set up the cube that the camera will rest on
				var cubeGeometry = new THREE.CubeGeometry( .5, .5, .5 );
				var cubeTexture = new THREE.ImageUtils.loadTexture( 'images/SquareBlue.png' );
				var cubeMaterial = new THREE.MeshBasicMaterial( { map: cubeTexture, side: THREE.DoubleSide } );
				this.person = new THREE.Mesh(cubeGeometry,cubeMaterial);
				this.person.receiveShadow = false;
				this.person.castShadow = false;
				
				this.person.position.set( 0, 5, 0);
				this.scene.add(this.person);
				
				
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
				
				app.mansion.init();
	},
			
	setupWorld: function() {				
				// helper axes
				var axes = new THREE.AxisHelper(100);
				//this.scene.add( axes );	
				
				// add skybox
				this.drawSkyBox();
				
				// add mansion
				this.setupMansion();
				
				// add artifacts
				this.setupArtifacts();
				
				// once done adding to myobjects, set object.id for each object
				for(var i=0; i < this.myobjects.length; i++) {
					this.myobjects[i].cube.id = i;
				}
				
				// add subtle ambient lighting
				var ambientLight = new THREE.AmbientLight(0x0f0f0f);//(0xffffff);
				this.scene.add(ambientLight);
	},
			
	setupMansion: function(){	
		// pedestals //
		// geometry
		var pedGeometry = new THREE.CubeGeometry( 1, 4, 1 );
		// move pivot point to bottom of cube instead of center
		pedGeometry.applyMatrix( new THREE.Matrix4().makeTranslation( 0, 2, 0 ) );
		
		// material
		var pedMaterial = new THREE.MeshLambertMaterial({color: 0x8B4513});
		
		var pedestal1 = new app.Pedestal(pedGeometry, pedMaterial, -40, 0, 30);
		var pedestal2 = new app.Pedestal(pedGeometry, pedMaterial, 25, 0, 0);
		var pedestal3 = new app.Pedestal(pedGeometry, pedMaterial, -30, 0, -40);
		var pedestal4 = new app.Pedestal(pedGeometry, pedMaterial, 5, 0, -35);
		
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
		var cube1 = new app.Artifact(cubeGeometry, cubeMaterial1, 10, 5, -5);
		var cube2 = new app.Artifact(cubeGeometry, cubeMaterial2, -15, 5, 0);
		var cube3 = new app.Artifact(cubeGeometry, cubeMaterial3, 35, 5, 25);
		var cube4 = new app.Artifact(cubeGeometry, cubeMaterial4, 5, 5, 35);
		
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
				}
			}		
			/*
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
			*/
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