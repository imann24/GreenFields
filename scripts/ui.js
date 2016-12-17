/**
 * @author: Isaiah Mann
 * @desc: Manages the user interface of the game
 */

function UserInterface (canvas, graphics, color) {
     this.canvas = canvas;
     this.graphics = graphics;
     this.color = color;
     this.elements = [];
}

UserInterface.prototype.add = function (element) {
     this.elements.push(element);
}

UserInterface.prototype.draw = function () {
     var e = this.elements;
     for (var i = 0; i < e.length; i++) {
          e[i].draw(this.graphics, this.color);
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

UIElement.prototype.drawElement = function (graphics, color) {
     var o = this.origin;
     var s = this.size;
     graphics.fillStyle = color;
     graphics.fillRect(o.x, o.y, s.x, s.y);
}

UIElement.prototype.draw = function (graphics, color) {
     this.drawElement(graphics, color);
     this.drawExtras(graphics, color);
}

UIElement.prototype.drawExtras = function (graphics, color) {
     // Override in Subclass
}

function UIImage (controller, origin, size, img, drawBackground) {
     this.setup(controller, origin, size);
     this.img = img;
     this.drawBackground = drawBackground;
}

UIImage.prototype = new UIElement();

UIImage.prototype.drawElement = function (graphics, color) {
     var o = this.origin;
     var s = this.size;
     if (this.drawBackground) {
          graphics.fillStyle = color;
          graphics.fillRect(o.x, o.y, s.x, s.y);
     }
     graphics.drawImage(this.img, o.x, o.y, s.x, s.y);
}

function UIPanel () {
     this.elements = [];
     this.selectedIndex = NULL_INDEX;
     this.selectedColor = "lightgreen";
     this.unselectedColor = "gray";
}

UIPanel.prototype = new UIElement();

UIPanel.prototype.add = function (element) {
     this.elements.push(element);
}

UIPanel.prototype.draw = function (graphics, color) {
     this.drawElement(graphics, color);
     var e = this.elements;
     for (var i = 0; i < e.length; i++) {
          if (this.selectedIndex == i) {
               e[i].draw(graphics, this.selectedColor);
          } else {
               e[i].draw(graphics, this.unselectedColor);
          }
     }
     this.drawExtras(graphics, color);
}

UIPanel.prototype.select = function (selectIndex) {
     tihs.selectIndex = selectedIndex;
}

UIPanel.prototype.deselect = function () {
     this.selectedIndex = NULL_INDEX;
}

function InventoryPanel (controller, origin, size, imageLookup) {
     this.setup(controller, origin, size);
     this.imageLookup = imageLookup;
     var drawBackground = true;
     for (var i = 0; i < toolKeys.length; i++) {
          this.add(new UIImage(controller, origin.add(new Vector2(i * 234, 0)),
           new Vector2(100, 100), imageLookup[toolKeys[i]], drawBackground));
     }
}

InventoryPanel.prototype = new UIPanel();

InventoryPanel.prototype.drawExtras = function (graphics, color) {
     graphics.fillStyle = "white";
     graphics.font = "30px Arial";
     for (var i = 0; i < toolKeys.length; i++) {
          graphics.fillText(i+ 1, this.origin.x + i * 234 + 10, this.origin.y + 30);
     }
}
