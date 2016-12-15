/**
 * @author: Isaiah Mann
 * @desc: Data classes for the game
 */

var unlimitedKey = "Unlimited";

function WorldObjectDescriptor () {}

WorldObjectDescriptor.prototype.setupObjectDescriptor = function (type) {
     this.type = type;
}

function ToolDescriptor () {}

ToolDescriptor.prototype = new WorldObjectDescriptor();

ToolDescriptor.prototype.setupToolDescriptor = function (type, uses) {
     this.setupObjectDescriptor(type);
     this.maxUseCount = uses;
     this.unlimitedUses = false;
     this.unlimitedUses = (this.maxUseCount == unlimitedKey);
     this.refillUses();
}

ToolDescriptor.prototype.refillUses = function () {
     this.remainingUses = this.maxUseCount;
}

ToolDescriptor.prototype.tryUse = function () {
     if (this.unlimitedUses) {
          return true;
     } else if (this.uses > 0) {
          this.uses--;
          return true;
     } else {
          return false;
     }
}

ToolDescriptor.prototype.hasUsesRemaining = function () {
     return this.unlimitedUses || this.remainingUses > 0;
}

ToolDescriptor.prototype.getRemainingUses = function () {
     return this.remainingUses;
}

function HoeDescriptor () {
     this.setupToolDescriptor(hoeKey, unlimitedKey);
}

HoeDescriptor.prototype = new ToolDescriptor();

function SeedDescriptor (uses) {
     this.setupToolDescriptor(seedsKey, uses);
}

SeedDescriptor.prototype = new ToolDescriptor();

function WateringCanDescriptor (uses) {
     this.setupToolDescriptor(wateringCanKey, uses);
}

WateringCanDescriptor.prototype = new ToolDescriptor();

function BasketDescriptor () {
     this.setupToolDescriptor(basketKey, unlimitedKey);
}

BasketDescriptor.prototype = new ToolDescriptor();
