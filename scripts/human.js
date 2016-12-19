/**
 * @author: Isaiah Mann
 * @desc: Controls logic for human movement
 */

function Limb () {}

Limb.prototype.setup = function  (upper, lower) {
     this.upper = upper;
     this.lower = lower;
}

function Leg (upper, lower) {
     this.setup(upper, lower);
}

Leg.prototype = new Limb();

Leg.prototype.isLeg = function () {
     return true;
}

function Arm (upper, lower) {
     this.setup(upper, lower);
}

Arm.prototype = new Limb();

Arm.prototype.isArm = function () {
     return true;
}

function LimbPair (leftLimb, rightLimb) {
     this.leftLimb = leftLimb;
     this.rightLimb = rightLimb;
     this[0] = leftLimb;
     this[1] = rightLimb;
     this.length = 2;
}

LimbPair.prototype.setMovement = function (framesPerStep, maxAngle, leftForward, isArm, isLeg) {
     this.framesPerStep = framesPerStep;
     this.maxAngle = maxAngle;
     this.currentFrameInStep = 0;
     this.leftForward = leftForward;
     this.setLimbDirection();
     for (var i = 0; i < this.length; i++) {
          this[i].isArm = isArm;
          this[i].isLeg = isLeg;
     }
}

LimbPair.prototype.setLimbDirection = function () {
     if (this.leftForward) {
          this.forwardLimb = this.leftLimb;
          this.backLimb = this.rightLimb;
     } else {
          this.forwardLimb = this.rightLimb;
          this.backLimb = this.leftLimb;
     }
}

LimbPair.prototype.beginNewStep = function () {
     this.leftForward = !this.leftForward;
     this.setLimbDirection();
}

LimbPair.prototype.updateMovement = function () {
     this.currentFrameInStep++;
     this.currentFrameInStep %= this.framesPerStep;
     if (this.currentFrameInStep == 0) {
          this.beginNewStep();
     }
     var progress = this.currentFrameInStep / this.framesPerStep;
     if (progress < 0.5) {
          this.extendMovement(progress * 2);
     } else {
          this.retractMovement((progress - 0.5) * 2);
     }
}

LimbPair.prototype.resetMovement = function () {
     if (!this.leftLimb.inUse) {
          this.leftLimb.rotation.x = 0;
          this.leftLimb.lower.rotation.x = 0;
     }
     if (!this.rightLimb.inUse) {
          this.rightLimb.rotation.x = 0;
          this.rightLimb.lower.rotation.x = 0;
     }
     this.currentFrameInStep = 0;
}

// Extend progress is half of overall progress
LimbPair.prototype.extendMovement = function (progress) {
     if (!this.forwardLimb.inUse) {
          var forwardRotation = Math.lerp(0, this.maxAngle, progress);
          this.forwardLimb.rotation.x = forwardRotation;
          if (this.forwardLimb.isArm) {
               this.forwardLimb.lower.rotation.x = -forwardRotation * 2;
          } else if (this.forwardLimb.isLeg) {
               this.forwardLimb.lower.rotation.x = forwardRotation;
          }
     }

     if (!this.backLimb.inUse) {
          var backRotation = Math.lerp(0, -this.maxAngle, progress);
          this.backLimb.rotation.x = backRotation;
          if (this.backLimb.isArm){
               this.backLimb.lower.rotation.x = backRotation * 2;
          } else if (this.backLimb.isLeg) {
               this.backLimb.lower.rotation.x = -backRotation * 2.5;
          }
     }
}

// Rectract progress is half of overall progress
LimbPair.prototype.retractMovement = function (progress) {
     if (!this.forwardLimb.inUse) {
          var forwardRotation = Math.lerp(this.maxAngle, 0, progress);
          this.forwardLimb.rotation.x = forwardRotation;
          if (this.forwardLimb.isArm) {
               this.forwardLimb.lower.rotation.x = -forwardRotation * 2
          } else if (this.forwardLimb.isLeg) {
               this.forwardLimb.lower.rotation.x = forwardRotation;
          }
     }

     if (!this.backLimb.inUse) {
          var backRotation = Math.lerp(-this.maxAngle, 0, progress);
          this.backLimb.rotation.x = backRotation;
          if (this.backLimb.isArm) {
               this.backLimb.lower.rotation.x = backRotation * 2;
          } else if (this.backLimb.isLeg) {
               this.backLimb.lower.rotation.x = -backRotation * 2.5;
          }
     }
}

function Body (torso, arms, legs) {
     this.torso = torso;
     this.arms = arms;
     this.legs = legs;
     this.useToolAnimationFrame = 0;
     this.usingTool = false;
     this.framesInToolAnimation = 48;
}

Body.prototype = {
     // The torso is the parent object of the rest of the body
     get position () {
          return this.torso.position;
     },
     get rotation () {
          return this.torso.rotation;
     },
     get scale () {
          return this.torso.scale;
     },
}

Body.prototype.walk = function () {
     this.arms.updateMovement();
     this.legs.updateMovement();
}

Body.prototype.interact = function () {
     if (this.usingTool) {
          this.updateToolMovement();
     }
}

Body.prototype.resetLimbs = function () {
     this.arms.resetMovement();
     this.legs.resetMovement();
}

Body.prototype.getCollider = function () {
     return this.torso.getCollider();
}

Body.prototype.updateCollider = function () {
     this.torso.updateCollider();
}

Body.prototype.hasCollider = function () {
     return this.torso.hasCollider();
}

Body.prototype.isCollidingWith = function (otherObject) {
     return this.torso.isCollidingWith(otherObject);
}

Body.prototype.getId = function () {
     return this.torso.getId();
}

Body.prototype.setId = function (id) {
     this.torso.setId(id);
}

Body.prototype.useTool = function () {
     this.arms.leftLimb.inUse = true;
     this.useToolAnimationFrame = 0;
     this.usingTool = true;
}

Body.prototype.updateToolMovement = function () {
     var progress = this.useToolAnimationFrame / this.framesInToolAnimation;
     this.arms.leftLimb.rotation.x = 0;
     if (progress < 0.25) {
          this.arms.leftLimb.lower.rotation.x = Math.lerp(0, -Math.PI / 2, progress * 4);
     } else if (progress >= 0.25 && progress < 0.75) {
          this.arms.leftLimb.lower.rotation.x = Math.lerp(-Math.PI / 2, Math.PI / 2, (progress - 0.25) * 2);
     } else if (progress <= 1.0) {
          this.arms.leftLimb.lower.rotation.x = Math.lerp(Math.PI / 2, 0, (progress - 0.75) * 4);
     }
     this.useToolAnimationFrame++;
     if (this.useToolAnimationFrame > this.framesInToolAnimation) {
          this.usingTool = false;
          this.arms.leftLimb.inUse = false;
     }
}
