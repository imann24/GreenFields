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

Inventory.prototype.get = function (index) {
     return this.items[toolKeys[index]];
}

Inventory.prototype.contains = function (itemId) {
     return this.items[itemId] != null;
}

Inventory.prototype.select = function (index) {
     this.deselect();
     this.uiPanel.select(index);
     this.selected = this.get(index);
     this.selected.setVisible(true);
}

Inventory.prototype.deselect = function () {
     if (this.selected) {
          this.selected.setVisible(false);
          this.selected = null;
     }
     this.uiPanel.deselect();
}

Inventory.prototype.getSelected = function () {
     return this.selected;
}
