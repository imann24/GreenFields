/**
 * @author: Isaiah Mann
 * @desc: Controls the game logic
 * @requires: THREE.js, KeyboardState.js, PointerLockControls.js, player.js, random.js, tuning.js, vector.js, world.js
 */

 var scene, camera, renderer; // Three.js rendering basics.
 var player, keyboard;
 var canvas; // The canvas on which the image is rendered.

 // The rotating farmer
 var farmer;
 var rotateYSpeed = 0.02;

 // Create the scene. This function is called once, as soon as the page loads.
 // The renderer has already been created before this function is called.
 function createWorld() {

     renderer.setClearColor(0); // Set background color (0, or 0x000000, is black).
     scene = new THREE.Scene(); // Create a new scene which we can add objects to.
     keyboard = new KeyboardState();
     // create a camera, sitting on the positive z-axis.  The camera is not part of the scene.
     camera = new THREE.PerspectiveCamera(70, canvas.width/canvas.height, 1, 1000);
     camera.position.y = 1.75;
     camera.position.z = 1.5;
     player = new Player(scene, camera, canvas,
          playerSpeed, playerStrafeSpeed, playerLookSpeed);
     var light = new THREE.DirectionalLight( 0xffffff );
     light.position.set(2, 2, 2);
     scene.add(light);
     // create some lights and add them to the scene.
     var viewpointLight = new THREE.DirectionalLight( 0xffffff, 0.8 );  // a light to shine in the direction the camera faces
     viewpointLight.position.set(0,0,1);  // shines down the z-axis
     scene.add(viewpointLight)
     material = new THREE.MeshLambertMaterial({ map: THREE.ImageUtils.loadTexture("img/wood.jpg")});
     var plane = new Plane(scene, Vector3.scalar(100), "img/wood.jpg", new Vector3(3 * Math.PI / 2, 0, 0), 1, 1);
     plane.position.y -= 4;
     var loader = new THREE.JSONLoader();
     loader.load('models/farmer.json',
     function(geometry) {
        farmer = new THREE.Mesh(geometry, material);
        farmer.position.z = -5;
        farmer.position.y = -2.5;
        farmer.rotation.y = Math.PI;
        scene.add(farmer);
        camera.add(farmer);
        camera.rotation.x -= Math.PI / 4;
        farmer.rotation.x += Math.PI / 4;
        farmer.position.z -= 4;
        farmer.position.y -= 2;
     });
 }

 // Render the scene. This is called for each frame of the animation.
 function render() {
     requestAnimationFrame( render );
     player.move();
     renderer.render(scene, camera);
 }

 //----------------------------------------------------------------------------------

 // The init() function is called by the onload event when the document has loaded.
 function init() {
     try {
        canvas = document.getElementById("glcanvas");
        renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true} );
     }
     catch (e) {
        document.getElementById("canvas-holder").innerHTML = "<h3><b>WebGL is not available.</b><h3>";
        return;
     }

     // create world and render scene
     createWorld();
     render();
 }
