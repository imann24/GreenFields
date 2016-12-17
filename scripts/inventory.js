/**
 * @author: Isaiah Mann
 * @desc: Data structure for inventory
 */

function Inventory (player, uiPanel) {
     this.player = player;
     this.items = {};
     this.uiPanel = uiPanel;
     this.selected = null;
}

Inventory.prototype.add = function (item) {
     this.items[item.getId()] = item;
}

Inventory.prototype.contains = function (itemId) {
     return this.items[itemId] != null;
}

Inventory.prototype.select = function (index) {
     this.uiPanel.select(index);
}

Inventory.prototype.deselect = function () {
     this.uiPanel.deselect();
}
