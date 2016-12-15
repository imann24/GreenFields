/**
 * @author: Isaiah Mann
 * @desc: A script to control a player
 * @requires: THREE.js, KeyboardState.js, PointerLockControls.js
 */

function Player (scene, camera, canvas, speed, strafeSpeed, lookSpeed) {
     this.scene = scene;
     this.camera = camera;
     this.canvas = canvas;
     this.speed = speed;
     // For sideways movement:
     this.strafeSpeed = strafeSpeed;
     this.lookSpeed = lookSpeed;
     this.xSpeed = 0;
     this.zSpeed = 0;
     this.zRotation = 0;
     this.yRotation = 0;
     this.yLook = 0;
     this.xLook = 0;
     this.setup();
}

Player.prototype = {
     // Getter var to make accessing the look rotation more concise:
     get facing () {
          return this.camera.rotation.y;
     },
     get position () {
          return ths.camera.position;
     },
}

Player.prototype.setup = function () {
     this.setupMouseLook();
}

Player.prototype.setupInventory = function () {
     this.inventory = [];
     this.equippedTool = null;
}

Player.prototype.equipTool = function (indexInInventory) {
     if (indexInInventory >= 0 && indexInInventory < inventory.length) {
          if (inventory[indexInInventory].isTool()) {
               this.equippedTool = inventory[indexInInventory];
          }
     }
}

Player.prototype.unequipTool = function () {
     this.equippedTool = null;
}

Player.prototype.hasToolEquipped = function () {
     return equippedTool != null;
}

Player.prototype.useTool = function (target) {
     if (target.respondsTo(this.equippedTool)) {
          this.equippedTool.use(target);
     }
}

Player.prototype.getMousePos = function (canvas, evt) {
      var rect = canvas.getBoundingClientRect();
      return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
      };
}

Player.prototype.setupMouseLook = function () {
    this.pointerLook = new THREE.PointerLockControls(this.camera);
    this.scene.add(this.pointerLook.getObject());
    this.pointerLook.enabled = true;
    // Accounts for the offset of adding the camera to the controls parent
    camera.position.y -= 5;
}


Player.prototype.toggleXRotationEnabled = function () {
	this.pointerLook.toggleXRotationEnabled();
}

Player.prototype.toggleYRotationEnabled = function () {
	this.pointerLook.toggleYRotationEnabled();
}

// Uses KeyboardState.js:
Player.prototype.move = function () {
     keyboard.update();
     if (keyboard.pressed("left") || keyboard.pressed("A")) {
          this.applyMove("x", -this.strafeSpeed);
     }
     if (keyboard.pressed("right") || keyboard.pressed("D")) {
          this.applyMove("x", this.strafeSpeed);
     }
     if (keyboard.pressed("down") || keyboard.pressed("S")) {
          this.applyMove("z", this.speed);
     }
     if (keyboard.pressed("up") || keyboard.pressed("W")) {
          this.applyMove("z", -this.speed);
     }
}

Player.prototype.applyMove = function (axis, velocity) {
     // Movement code adapted from: http://stackoverflow.com/questions/16201573/how-to-properly-move-the-camera-in-the-direction-its-facing
     if (axis == "z") {
          camera.position.z += Math.cos(this.facing) * velocity;
          camera.position.x += Math.sin(this.facing) * velocity;
     } else if (axis == "x") {
          camera.position.x -= Math.sin(this.facing - Math.PI / 2) * velocity;
          camera.position.z -= Math.cos(this.facing - Math.PI / 2) * velocity;
     }
}

Player.prototype.applyRotation = function (axisKey) {
     var vector = new THREE.Vector3(1, 0, 0);
     var angle;
     var axis;
     if (axisKey = "x") {
          axis = new THREE.Vector3(1, 0, 0);
          angle = this.xLook;
     } else if (axisKey == "y") {
          axis = new THREE.Vector3(0, 1, 0);
          angle = this.yLook;
     }
     vector.applyAxisAngle(axis, angle);
     this.camera.rotation.setFromVector3(vector);
}
