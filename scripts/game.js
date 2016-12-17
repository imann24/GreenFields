/**
 * @author: Isaiah Mann
 * @desc: Controls the game logic
 * @requires: THREE.js, KeyboardState.js, PointerLockControls.js, player.js, random.js, tuning.js, vector.js, world.js
 */

var scene, camera, renderer; // Three.js rendering basics.
var player, keyboard;
var worldCanvas, uiCanvas; // The canvas on which the image is rendered.
var gridPositions;

// UI
var userInterface;

// World Objects
var world;
var playerIsLoaded = false;

// Arms
var upperArmLeft;
var lowerArmLeft;

var upperArmRight;
var lowerArmRight;

var rotateYSpeed = 0.02;
var farm;
var currentCollision = null;

var roughDirtTexture;
var tilledDirtTexture;
var plantTexture;
var playerWasWalking = false;

var images = {};

// Create the scene. This function is called once, as soon as the page loads.
// The renderer has already been created before this function is called.
function initWorld() {
     // These functions should be called in the following order in order to guarantee dependency initialization
     initTextures();
     initUserInterface();
     initScene();
     world = new World(scene);
     initInput();
     initCamera();
     initPlayer();
     initLights();
     initFarm();
}

function initTextures () {
     for (var i = 0; i < toolKeys.length; i++) {
          images[toolKeys[i]] = document.getElementById(toolKeys[i]);
     }
     roughDirtTexture = THREE.ImageUtils.loadTexture("img/dirt.jpg");
     tilledDirtTexture = THREE.ImageUtils.loadTexture("img/tilled-dirt.jpg");
     plantTexture = THREE.ImageUtils.loadTexture("img/plant.jpg");
}

function initScene () {
     renderer.setClearColor(0); // Set background color (0, or 0x000000, is black).
     scene = new THREE.Scene(); // Create a new scene which we can add objects to.
}

function initInput () {
     keyboard = new KeyboardState();
}

// create a camera, sitting on the positive z-axis.  The camera is not part of the scene.
function initCamera () {
     camera = new THREE.PerspectiveCamera(70, worldCanvas.width / worldCanvas.height, 1, 1000);
     camera.position.y = 1.75;
     camera.position.z = 1.5;
}

function initPlayer () {
     player = new Player(scene, camera, worldCanvas, uiCanvas,
          playerSpeed, playerStrafeSpeed, playerLookSpeed);
     var material = new THREE.MeshLambertMaterial({ map: THREE.ImageUtils.loadTexture("img/wood.jpg")});
     var loader = new THREE.JSONLoader();
     // Rest of the body loaded throw a series of callbacks (async):
     initPlayerBody(loader, material);
}

function initPlayerBody (loader, material) {
     loader.load('models/farmer-body.json',
     function(geometry) {
        var torsoModel = new THREE.Mesh(geometry, material);
        torsoModel.position.z = -5;
        torsoModel.position.y = -2.5;
        torsoModel.rotation.y = Math.PI;
        var torso = WorldObject.objectFromMesh(world, torsoModel);
        torso.setId("Player");
        torsoModel.add(camera);
        initLeftArm(loader, material, torso);
    });
}

function initLeftArm (loader, material, torso) {
     loader.load('models/farmer-upper-arm-left.json',
     function(geometry) {
        var leftArmModel = new THREE.Mesh(geometry, material);
        var leftArm = WorldObject.objectFromMesh(world, leftArmModel);
        leftArm.position.y += 3.75;
        leftArm.position.x += 0.9;
        torso.addChild(leftArm);
        loader.load('models/farmer-lower-arm-left.json',
        function(geometry) {
               var lowerLeftArmModel = new THREE.Mesh(geometry, material);
               lowerLeftArm = WorldObject.objectFromMesh(world, lowerLeftArmModel);
               leftArm.addChild(lowerLeftArm);
               lowerLeftArm.position.y -= 1;
               lowerLeftArm.position.x += 0.125;
               initRightArm(loader, material, torso, leftArm);
          });
     });
}

function initRightArm (loader, material, torso, leftArm) {
     loader.load('models/farmer-upper-arm-right.json',
     function(geometry) {
        rightArmModel = new THREE.Mesh(geometry, material);
        rightArm = WorldObject.objectFromMesh(world, rightArmModel);
        rightArm.position.y += 3.75;
        rightArm.position.x -= 0.9;
        torso.addChild(rightArm);
        loader.load('models/farmer-lower-arm-right.json',
        function(geometry) {
               var lowerRightArmModel = new THREE.Mesh(geometry, material);
               lowerRightArm = WorldObject.objectFromMesh(world, lowerRightArmModel);
               rightArm.addChild(lowerRightArm);
               lowerRightArm.position.y -= 1;
               lowerRightArm.position.x -= 0.125;
               initLeftLeg(loader, material, torso, leftArm, rightArm);
          });
     });
}

function initLeftLeg (loader, material, torso, leftArm, rightArm) {
     loader.load('models/farmer-upper-leg-left.json',
     function(geometry) {
        leftLegModel = new THREE.Mesh(geometry, material);
        leftLeg = WorldObject.objectFromMesh(world, leftLegModel);
        leftLeg.position.y += 2.0;
        leftLeg.position.x += 0.5;
        leftLeg.scale.y = 2;
        torso.addChild(leftLeg);
        loader.load('models/farmer-lower-leg-left.json',
        function(geometry) {
               var lowerLeftLegModel = new THREE.Mesh(geometry, material);
               lowerLeftLeg = WorldObject.objectFromMesh(world, lowerLeftLegModel);
               leftLeg.addChild(lowerLeftLeg);
               lowerLeftLeg.position.y -= 0.85;
               lowerLeftLeg.position.z += 0.05;
               lowerLeftLeg.position.x -= 0.1;
               initRightLeg(loader, material, torso, leftArm, rightArm, leftLeg);
          });
     });
}

function initRightLeg (loader, material, torso, leftArm, rightArm, leftLeg) {
     loader.load('models/farmer-upper-leg-right.json',
     function(geometry) {
        rightLegModel = new THREE.Mesh(geometry, material);
        rightLeg = WorldObject.objectFromMesh(world, rightLegModel);
        rightLeg.position.y += 2.0;
        rightLeg.position.x -= 0.5;
        rightLeg.scale.y = 2;
        torso.addChild(rightLeg);
        loader.load('models/farmer-lower-leg-right.json',
        function(geometry) {
               var lowerRightLegModel = new THREE.Mesh(geometry, material);
               lowerRightLeg = WorldObject.objectFromMesh(world, lowerRightLegModel);
               rightLeg.addChild(lowerRightLeg);
               lowerRightLeg.position.y -= 0.85;
               lowerRightLeg.position.z += 0.05;
               lowerRightLeg.position.x += 0.125;
               initPlayerFinal(torso, leftArm, rightArm, leftLeg, rightLeg);
               initGame();
          });
     });
}

function initPlayerFinal (torso, leftArm, rightArm, leftLeg, rightLeg) {
     // camera.rotation.x -= Math.PI / 4;
     camera.position.z -= 7.5;
     camera.position.y += 4;
     torso.rotation.x += Math.PI / 4;
     torso.position.z -= 4;
     // camera.rotation.z += Math.PI;
     camera.rotation.y += Math.PI;
     camera.rotation.x += Math.PI / 8;
     var arms = new LimbPair(leftArm, rightArm);
     arms.setMovement(framesPerStep, maxArmAngle, leftArmStartForward);
     var legs = new LimbPair(leftLeg, rightLeg);
     legs.setMovement(framesPerStep, maxLegAngle, leftLegStartForward);
     var body = new Body(torso, arms, legs);
     player.setBody(body);
     player.setupMouseLook(torso.mesh);
     body.position.y -= 0.25;
     torso.addCollider();
}

function createPlant (position) {
     var loader = new THREE.JSONLoader();
     var material = new THREE.MeshLambertMaterial({ map: plantTexture});
     loader.load('models/sprout.json',
     function(geometry) {
        var sprout = new THREE.Mesh(geometry, material);
        sprout.scale.y = 0.25;
        sprout.position.y -= 4;
        sprout.position.x = position.x;
        sprout.position.z = position.z;
        scene.add(sprout);
     });
}

function initLights () {
     // create some lights and add them to the scene.
     var viewpointLight = new THREE.DirectionalLight( 0xffffff, 0.8 );  // a light to shine in the direction the camera faces
     viewpointLight.position.set(0,0,1);  // shines down the z-axis
     scene.add(viewpointLight)

     var light = new THREE.DirectionalLight( 0xffffff );
     light.position.set(2, 2, 2);
     scene.add(light);
}

function initFarm () {
     gridPositions = new Vector3.grid(gridMin, gridMax, 0, gridStep);
     var farm = Plane.createGrid(
          world,
          gridPositions,
          Vector3.scalar(gridStep * 1),
          "img/dirt.jpg",
          new Vector3(3 * Math.PI / 2, 0, 0));
     farm.position.y -= 4;
     scene.add(farm);
}

function initUserInterface () {
     uiCanvas = document.getElementById("uicanvas");
     userInterface = new UserInterface(uicanvas, uiCanvas.getContext("2d"));
     userInterface.add(new InventoryPanel(userInterface, new Vector2(0, 500), new Vector2(800, 100), images));
}

function tryInitWebGL () {
     try {
        worldCanvas = document.getElementById("glcanvas");
        renderer = new THREE.WebGLRenderer( { canvas: worldCanvas, antialias: true} );
        return true;
     }
     catch (e) {
        document.getElementById("canvas-holder").innerHTML = "<h3><b>WebGL is not available.</b><h3>";
        return false;
     }
}

function initGame () {
     initUpdateLoop();
}

function initUpdateLoop () {
     update();
}

 // Render the scene. This is called for each frame of the animation.
function update() {
     requestAnimationFrame(update);
     updatePhysics();
     updateInput();
     updateRenderer();
     updateUserInterface();
}

function updateInput () {
     player.move();
     if (keyboard.down("F") && currentCollision) {
          currentCollision.mesh.material.map = tilledDirtTexture;
          currentCollision.mesh.material.needsUpdate = true;
          createPlant(currentCollision.position);
     }
}

function updatePhysics () {
     player.updateCollider();
     var collisionsWithPlayer = world.getCollisionsWithObject(player);
     // Just pick the first collision in the list:
     currentCollision = collisionsWithPlayer[0];
}

function updateRenderer () {
     renderer.render(scene, camera);
     if (player.queryWalking()) {
          player.walk();
          playerWasWalking = true;
     } else if (playerWasWalking) {
          player.stop();
          playerWasWalking = false;
     }
}

function updateUserInterface () {
     userInterface.draw();
}
 //----------------------------------------------------------------------------------

 // The init() function is called by the onload event when the document has loaded.
function init() {
     if (tryInitWebGL()) {
          // create world and render scene
          initWorld();
          // Must be called once from init to begin render loop:
     }
}
