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

function UIImage (controller, origin, size, img) {
     this.setup(controller, origin, size);
     this.img = img;
}

UIImage.prototype = new UIElement();

UIImage.prototype.drawElement = function (graphics) {
     var o = this.origin;
     var s = this.size;
     graphics.drawImage(this.img, o.x, o.y, s.x, s.y);
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

function InventoryPanel (controller, origin, size, imageLookup) {
     this.setup(controller, origin, size);
     this.imageLookup = imageLookup;
     for (var i = 0; i < toolKeys.length; i++) {
          this.add(new UIImage(controller, origin.add(new Vector2(i * 225, 0)),
           new Vector2(100, 100), imageLookup[toolKeys[i]]));
     }
}

InventoryPanel.prototype = new UIPanel();

function InventorySlot () {

}

InventorySlot.prototype = new UIElement();
