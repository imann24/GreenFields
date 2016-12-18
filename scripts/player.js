/**
 * @author: Isaiah Mann
 * @desc: A script to control a player
 * @requires: THREE.js, KeyboardState.js, PointerLockControls.js
 */

function Player (scene, camera, glCanvas, uiCanvas, speed, strafeSpeed, lookSpeed, inventory) {
     this.scene = scene;
     this.camera = camera;
     this.glCanvas = glCanvas;
     this.uiCanvas = uiCanvas;
     this.speed = speed;
     // For sideways movement:
     this.strafeSpeed = strafeSpeed;
     this.lookSpeed = lookSpeed;
     this.inventory = inventory;
     this.xSpeed = 0;
     this.zSpeed = 0;
     this.zRotation = 0;
     this.yRotation = 0;
     this.yLook = 0;
     this.xLook = 0;
     this.equippedTool = null;
     this.setup();
}

Player.prototype = {
     // Getter var to make accessing the look rotation more concise:
     get facing () {
          return this.body.rotation.y + Math.PI;
     },
     get position () {
          return ths.body.position;
     },
}

Player.prototype.setup = function () {
     this.isWalking = false;
}

Player.prototype.setBody = function (body) {
     this.body = body;
     this.body.setId("Player");
     this.rotate(0);
}

Player.prototype.queryWalking = function () {
     return this.isWalking;
}

Player.prototype.walk = function () {
     this.body.walk();
}

Player.prototype.stop = function () {
     this.body.resetLimbs();
}

Player.prototype.equipTool = function (indexInInventory) {
     this.inventory.select(indexInInventory);
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

Player.prototype.setupMouseLook = function (target) {
    // this.pointerLook = new THREE.PointerLockControls(target);
    // this.scene.add(this.pointerLook.getObject());
    // this.pointerLook.enabled = true;
    // Accounts for the offset of adding the camera to the controls parent
    // target.position.y -= 5;
    this.leftBound = this.uiCanvas.width / 4;
    this.rightBound = 3 * this.uiCanvas.width / 4;
    this.turningLeft = false;
    this.turningRight = false;
    var player = this;
    this.uiCanvas.addEventListener('mousemove', function(event) {
      var mousePosition = Input.getMousePosition(player.uiCanvas, event);
      player.turningLeft = false;
      player.turningRight = false;
      if (mousePosition.x < player.leftBound) {
           player.turningLeft = true;
      } else if (mousePosition.x > player.rightBound) {
           player.turningRight = true;
      }
    }, false);
}

Player.prototype.rotate = function (deltaYRotation) {
     this.body.rotation.y += deltaYRotation;
     // Have to zero out the other vectors to ensure the player stays upright
     this.body.rotation.x = 0;
     this.body.rotation.z = 0;
}

Player.prototype.updateCollider = function () {
     this.body.updateCollider();
}

Player.prototype.hasCollider = function () {
     return this.body.hasCollider();
}

Player.prototype.getCollider = function () {
     return this.body.getCollider();
}

Player.prototype.isCollidingWith = function (otherObject) {
     return this.body.isCollidingWith(otherObject);
}

Player.prototype.getId = function () {
     return this.body.getId();
}

// Uses KeyboardState.js:
Player.prototype.move = function () {
     this.isWalking = false;
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
     // For debugging purposes only:
     if (godModeEnabled) {
          if (keyboard.pressed("space")) {
               this.applyMove("y", this.speed);
          }
          if (keyboard.pressed("shift")) {
               this.applyMove("y", -this.speed);
          }
     }
     if (this.turningLeft) {
          player.rotate(this.lookSpeed);
     } else if (this.turningRight) {
          player.rotate(-this.lookSpeed);
     }
}

Player.prototype.applyMove = function (axis, velocity) {
     // Movement code adapted from: http://stackoverflow.com/questions/16201573/how-to-properly-move-the-camera-in-the-direction-its-facing
     if (axis == "z") {
          this.isWalking = true;
          this.body.position.z += Math.cos(this.facing) * velocity;
          this.body.position.x += Math.sin(this.facing) * velocity;
     } else if (axis == "x") {
          this.body.position.x -= Math.sin(this.facing - Math.PI / 2) * velocity;
          this.body.position.z -= Math.cos(this.facing - Math.PI / 2) * velocity;
     } else if (axis == "y") {
          this.body.position.y += velocity;
     }
}

Player.prototype.applyRotation = function (axisKey, delta) {
     var vector = new THREE.Vector3(1, 0, 0);
     var angle;
     var axis;
     if (axisKey = "x") {
          axis = new THREE.Vector3(delta, 0, 0);
          angle = this.xLook;
     } else if (axisKey == "y") {
          axis = new THREE.Vector3(0, delta, 0);
          angle = this.yLook;
     }
     vector.applyAxisAngle(axis, angle);
     this.body.rotation.setFromVector3(vector);
}
