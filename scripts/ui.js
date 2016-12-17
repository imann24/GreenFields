/**
 * @author: Isaiah Mann
 * @desc: Manages the user interface of the game
 */

function UserInterface (canvas) {
     this.canvas = canvas;
}

function UIElement () {}

UIElement.prototype.setup = function (controller) {
     this.controller = controller;
}

function UIPanel () {}

UIPanel.prototype = new UIPanel();

function InventoryPanel (controller) {
     this.setup(controller);
}

InventoryPanel.prototype = new UIPanel();

InventoryPanel.prototype.add (item) {
     // TODO: Implement this
}

function InventorySlot () {

}

InventorySlot.prototype = new UIElement();
