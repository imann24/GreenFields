/**
 * @author: Isaiah Mann
 * @desc: Data structure for inventory
 */

function Inventory (player, uiPanel) {
     this.player = player;
     this.items = {};
     this.uiPanel = uiPanel;
}

Inventory.prototype.add = function (item) {
     this.items[item.getId()] = item;
}

Inventory.prototype.contains = function (itemId) {
     return this.items[itemId] != null;
}
