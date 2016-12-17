/**
 * @author: Isaiah Mann
 * @desc: Manages the user interface of the game
 */

function UserInterface (canvas, graphics) {
     this.canvas = canvas;
     this.graphics = graphics;
     this.elements = [];
}

UserInterface.prototype.add = function (element) {
     this.elements.push(element);
}

UserInterface.prototype.draw = function () {
     var e = this.elements;
     for (var i = 0; i < e.length; i++) {
          e[i].draw(this.graphics);
     }
}

function UIElement (controller, origin, size) {
     this.setup(controller, origin, size);
}

UIElement.prototype.setup = function (controller, origin, size) {
     this.controller = controller;
     this.origin = origin;
     this.size = size;
}

UIElement.prototype.drawElement = function (graphics) {
     var o = this.origin;
     var s = this.size;
     graphics.fillStyle = "black";
     graphics.fillRect(o.x, o.y, s.x, s.y);
}

UIElement.prototype.draw = function (graphics) {
     this.drawElement(graphics);
}

function UIPanel () {
     this.elements = [];
}

UIPanel.prototype = new UIElement();

UIPanel.prototype.add = function (element) {
     this.elements.push(element);
}

UIPanel.prototype.draw = function (graphics) {
     this.drawElement(graphics);
     var e = this.elements;
     for (var i = 0; i < e.length; i++) {
          e[i].draw(graphics);
     }
}

function InventoryPanel (controller, origin, size) {
     this.setup(controller, origin, size);
}

InventoryPanel.prototype = new UIPanel();

InventoryPanel.prototype.add = function (item) {
     // TODO: Implement this
}

function InventorySlot () {

}

InventorySlot.prototype = new UIElement();
