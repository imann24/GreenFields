function Limb () {}

Limb.prototype.setup = function  (upper, lower) {
     this.upper = upper;
     this.lower = lower;
}

function Leg (upper, lower) {
     this.setup(upper, lower);
}

Leg.prototype = new Limb();

function Arm (upper, lower) {
     this.setup(upper, lower);
}

Arm.prototype = new Limb();

function LimbPair (leftLimb, rightLimb) {
     this.leftLimb = leftLimb;
     this.rightLimb = rightLimb;
}

LimbPair.prototype.setMovement = function (framesPerStep, maxAngle, leftForward) {
     this.framesPerStep = framesPerStep;
     this.maxAngle = maxAngle;
     this.currentFrameInStep = 0;
     this.leftForward = leftForward;
     this.setLimbDirection();
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
     this.leftLimb.rotation.x = 0;
     this.rightLimb.rotation.x = 0;
     this.currentFrameInStep = 0;
}

// Extend progress is half of overall progress
LimbPair.prototype.extendMovement = function (progress) {
     this.forwardLimb.rotation.x = Math.lerp(0, this.maxAngle, progress);
     this.backLimb.rotation.x = Math.lerp(0, -this.maxAngle, progress);
}

// Rectract progress is half of overall progress
LimbPair.prototype.retractMovement = function (progress) {
     this.forwardLimb.rotation.x = Math.lerp(this.maxAngle, 0, progress);
     this.backLimb.rotation.x = Math.lerp(-this.maxAngle, 0, progress);
}

function Body (arms, legs) {
     this.arms = arms;
     this.legs = legs;
}

Body.prototype.walk = function () {
     this.arms.updateMovement();
     this.legs.updateMovement();
}

Body.prototype.resetLimbs = function () {
     this.arms.resetMovement();
     this.legs.resetMovement();
}
