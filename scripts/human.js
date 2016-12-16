function Limb () {}

Limb.prototype.setup (upper, lower) = function {
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

}

function Human (arms, legs) {

}
