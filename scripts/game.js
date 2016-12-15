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
var farmer;
var rotateYSpeed = 0.02;
var farm;
var currentCollision = null;

var roughDirtTexture;
var tilledDirtTexture;
var plantTexture;

// Create the scene. This function is called once, as soon as the page loads.
// The renderer has already been created before this function is called.
function initWorld() {
     // These functions should be called in the following order in order to guarantee dependency initialization
     initTextures();
     initScene();
     world = new World(scene);
     initInput();
     initCamera();
     initPlayer();
     initLights();
     initFarm();
}

function initTextures () {
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
     player = new Player(scene, camera, worldCanvas,
          playerSpeed, playerStrafeSpeed, playerLookSpeed);
     // Turn of the xRotation of the camera:
     player.toggleXRotationEnabled();
     var material = new THREE.MeshLambertMaterial({ map: THREE.ImageUtils.loadTexture("img/wood.jpg")});
     var loader = new THREE.JSONLoader();
     loader.load('models/farmer.json',
     function(geometry) {
        var farmerModel = new THREE.Mesh(geometry, material);
        farmerModel.position.z = -5;
        farmerModel.position.y = -2.5;
        farmerModel.rotation.y = Math.PI;
        farmer = WorldObject.objectFromMesh(world, farmerModel);
        farmer.addCollider();
        farmer.setId("Player");
        camera.add(farmerModel);
        camera.rotation.x -= Math.PI / 4;
        farmerModel.rotation.x += Math.PI / 4;
        farmerModel.position.z -= 4;
        farmerModel.position.y -= 2;
     });
}

function createPlant (position) {
     var loader = new THREE.JSONLoader();
     var material = new THREE.MeshLambertMaterial({ map: plantTexture});
     loader.load('models/sprout.json',
     function(geometry) {
        var sprout = new THREE.Mesh(geometry, material);
        // sprout.scale.x = 0.5;
        sprout.scale.y = 0.25;
        // sprout.scale.z = 0.5;
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
     userInterface = new UserInterface(uicanvas);
     uiCanvas = document.getElementById("uicanvas");
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

 // Render the scene. This is called for each frame of the animation.
function update() {
     requestAnimationFrame(update);
     updatePhysics();
     updateInput();
     updateRenderer();
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
     // Farmer needs a few extra frames to load (async)
     if (farmer) {
          farmer.updateCollider();
          var collisionsWithPlayer = world.getCollisionsWithObject(farmer);
          // Just pick the first collision in the list:
          currentCollision = collisionsWithPlayer[0];
     }
}

function updateRenderer () {
     renderer.render(scene, camera);
}

 //----------------------------------------------------------------------------------

 // The init() function is called by the onload event when the document has loaded.
function init() {
     if (tryInitWebGL()) {
          // create world and render scene
          initWorld();
          initUserInterface();
          // Must be called once from init to begin render loop:
          update();
     }
}
