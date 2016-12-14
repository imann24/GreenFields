/**
 * @author: Isaiah Mann
 * @desc: Defines the tuning variables for the game
 */

var playerSpeed = 1;
var playerStrafeSpeed = 0.5;
var playerLookSpeed = 0.01;

var godModeEnabled = true;

var cameraY = 10;
var cameraZ = 20;
var checkerBoardTexturePath = "img/checkerboard.png";
var woodTexturePath = "img/wood.jpg";
var wallpaperTexturePath = "img/wallpaper.jpg";
var ceilingTexturePath = "img/ceiling.jpg";
var octahedronScale = 1;
var octahedronHeight = 15;
var wallWidth = 200;
var wallHeight = 50;
var textureYRepeat = 5;
var textureXRepeat = 20;

// Farm grid vars:
var gridMin = -5;
var gridMax = 5;
var gridStep = 1;

// set up a few uv coordinates
var uvCoordinates = [new THREE.Vector2(0, 0),   // 0
                         new THREE.Vector2(1, 0),   // 1
                         new THREE.Vector2(1, 1),   // 2
                         new THREE.Vector2(0.5, 1), // 3
                         new THREE.Vector2(0, 1)];  // 4

var topPyramidUVSets = [
     [0, 1, 2],
     [0, 1, 2],
     [2, 4, 0],
     [0, 4, 1],
     [4, 0, 1],
     [4, 0, 2]
];

var bottomPyramidUVSets = [
     [0, 1, 2],
     [0, 1, 2],
     [4, 0, 1],
     [0, 1, 4],
     [2, 4, 0],
     [4, 0, 2],
];

var rotateSpeed = 0.01;
