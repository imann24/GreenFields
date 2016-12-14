/**
 * @author: Isaiah Mann
 * @desc: Random range code
 */

function Random (min, max) {
     this.min = min;
     this.max = max;
}

Random.prototype.generate = function () {
     return Math.random() * (this.max - this.min) + this.min;
}
