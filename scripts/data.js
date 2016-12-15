/**
 * @author: Isaiah Mann
 * @desc: Data classes for the game
 */

function WorldObjectDescriptor () {}

WorldObjectDescriptor.prototype.setupObjectDescriptor = function (type) {
     this.type = type;
}

function ToolDescriptor () {}

ToolDescriptor.prototype = new WorldObjectDescriptor();

ToolDescriptor.prototype.setupToolDescriptor = function (type) {
     this.setupObjectDescriptor(type);
}

function HoeDescriptor () {
     this.setupToolDescriptor(hoeKey);
}

HoeDescriptor.prototype = new ToolDescriptor();

function SeedDescriptor () {
     this.setupToolDescriptor(seedsKey);
}

SeedDescriptor.prototype = new ToolDescriptor();

function WateringCanDescriptor () {
     this.setupToolDescriptor(wateringCanKey);
}

WateringCanDescriptor.prototype = new ToolDescriptor();

function BasketDescriptor () {
     this.setupToolDescriptor(basketKey);
}

BasketDescriptor.prototype = new ToolDescriptor();
