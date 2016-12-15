/**
 * @author: Isaiah Mann
 * @desc: Used to draw 3D shapes in the world
 * @requires: THREE.js
 */

function WorldObject () {}

WorldObject.prototype = {
     get position  () {
          return this.mesh.position;
     },
     get rotation  () {
          return this.mesh.rotation;
     },
}

WorldObject.prototype.setReferences = function (scene, position) {
     this.scene = scene;
     this.position = position;
}

WorldObject.prototype.earlySetup = function (scene, origin, scale, material, uvCoordinates, uvOrders) {
     this.geometry = new THREE.Geometry();
     this.scene = scene;
     this.origin = origin;
     this.scale = scale;
     this.children = [];
     this.material = material;
     this.uvs = uvCoordinates;
     this.uvOrders = uvOrders;
     // Dictionary of transforms that children are childed to
     this.childrenTransforms = {};
}

WorldObject.prototype.lateSetup = function () {
     this.createMesh();
     this.addToScene();
     if (this.origin) {
          this.setPositionToOrigin();
     }
}

WorldObject.prototype.getWorldPosition = function () {
     if (parent && parent.getWorldPosition) {
          return Vector3.add(this.position, parent.getWorldPosition());
     } else {
          return this.position;
     }
}

WorldObject.prototype.setPosition = function (position) {
     this.mesh.position.x = position.x;
     this.mesh.position.y = position.y;
     this.mesh.position.z = position.z;
}

WorldObject.prototype.setRotation = function (rotation) {
     this.rotation.x = rotation.x;
     this.rotation.y = rotation.y;
     this.rotation.z = rotation.z;
}

WorldObject.prototype.setPositionToOrigin = function () {
     this.setPosition(this.origin);
}

WorldObject.prototype.createMesh = function () {
     this.mesh = new THREE.Mesh(this.geometry, this.material)
}

WorldObject.prototype.addToScene = function () {
     this.scene.add(this.mesh);
}

WorldObject.prototype.setOrigin = function () {
     var p = this.mesh.position;
     var o = this.origin;
     p.x = o.x;
     p.y = o.y;
     p.z = o.z;
}

WorldObject.prototype.addChild = function (child) {
     // Custom object logic:
     this.children.push(child);
     // Create a child object to hold the child:
     this.childrenTransforms[child] = new THREE.Object3D();
     child.parent = this;
     // THREE.js object logic:
     this.mesh.add(this.childrenTransforms[child]);
     // The child object is technically the grand child:
     this.childrenTransforms[child].add(child.mesh);
}

WorldObject.prototype.updateChildRotation = function (child, rotationVector) {
     var childTransform =  this.childrenTransforms[child];
     childTransform.rotation.x = rotationVector.x;
     childTransform.rotation.y = rotationVector.y;
     childTransform.rotation.z = rotationVector.z;
}

WorldObject.prototype.setParent = function (parent) {
     this.parent = parent;
     this.parent.addChild(this);
}

WorldObject.prototype.setRotation = function (rotationVector) {
     this.mesh.rotation.set (
          rotationVector.x,
          rotationVector.y,
          rotationVector.z
     );
     this.mesh.matrixWorldNeedsUpdate = true;
}

WorldObject.prototype.setMaterialFromTexture = function (texturePath) {
     this.material = this.loadMaterialFromTexture(texturePath);
}

WorldObject.prototype.loadMaterialFromTexture = function (texturePath) {
     var texture = THREE.ImageUtils.loadTexture(texturePath);
     return new THREE.MeshPhongMaterial({map:texture, side:THREE.DoubleSide});
}

WorldObject.prototype.setRepeatingMaterialFromTexture = function (texturePath, u, v) {
     this.material = this.loadRepeatingMaterialFromTexture(texturePath, u, v);
}

WorldObject.prototype.loadRepeatingMaterialFromTexture = function (texturePath, u, v) {
     var texture = THREE.ImageUtils.loadTexture(texturePath);
     texture.wrapS = THREE.RepeatWrapping;
     texture.wrapT = THREE.RepeatWrapping;
     texture.repeat.set(u, v);
     return new THREE.MeshPhongMaterial({map:texture, side:THREE.DoubleSide});
}

WorldObject.prototype.createUVs = function (uvs) {
     console.log("this.createUVs() should be overriden in subclass of WorldObject");
}

// Origin and scale should be Vector3 objects. Origin is the center of the base
function Pyramid (scene, origin, scale, material, uvCoordinates, uvOrders) {
     this.earlySetup(scene, origin, scale, material, uvCoordinates, uvOrders);
     this.createVertices();
     this.createFaces();
     this.createUVs(this.uvs, this.uvOrders);
     this.lateSetup();
}

Pyramid.prototype = new WorldObject();

// this.geometry.faceVertexUvs[0].push([uvs[0], uvs[0], uvs[0]]);
Pyramid.prototype.createUVs = function (uvs, uvSets) {
     this.geometry.faceVertexUvs[0] = [];
     for (var i = 0; i < uvSets.length; i++) {
          this.geometry.faceVertexUvs[0].push(
               [uvs[uvSets[i][0]],
               uvs[uvSets[i][1]],
               uvs[uvSets[i][2]]]);
     }
}

Pyramid.prototype.createVertices = function () {
     var s = this.scale;
     var o = this.origin;
     this.geometry.vertices = [
          new THREE.Vector3(o.x + s.x, o.y, o.z + s.z),    // vertex number 0
          new THREE.Vector3(o.x + s.x, o.y, o.z - s.z),   // vertex number 1
          new THREE.Vector3(o.x - s.x, o.y, o.z - s.z),  // vertex number 2
          new THREE.Vector3(o.x - s.x, o.y, o.z + s.z),   // vertex number 3
          new THREE.Vector3(o.x, o.y + s.y, o.z)     // vertex number 4
     ];
}

Pyramid.prototype.createFaces = function () {
     this.geometry.faces = [
          new THREE.Face3(3, 2, 1),  // one half of the bottom face
          new THREE.Face3(3, 1, 0),  // second half of the bottom face
          new THREE.Face3(3, 0, 4),  // remaining faces are the four sides
          new THREE.Face3(0, 1, 4),
          new THREE.Face3(1, 2, 4),
          new THREE.Face3(2, 3, 4)
     ];
     this.geometry.computeFaceNormals();
}

Pyramid.prototype.createMaterial = function () {
     var g = this.geometry;
     g.faces[0].materialIndex = 0;
     for (var i = 1; i <= 5; i++) {
        g.faces[i].materialIndex = i-1;
     }
     var c = this.colors;
     this.material =  new THREE.MeshFaceMaterial([
        new THREE.MeshLambertMaterial( { color: c[0], shading: THREE.FlatShading } ),
        new THREE.MeshLambertMaterial( { color: c[1], shading: THREE.FlatShading } ),
        new THREE.MeshLambertMaterial( { color: c[2], shading: THREE.FlatShading } ),
        new THREE.MeshLambertMaterial( { color: c[3], shading: THREE.FlatShading } ),
        new THREE.MeshLambertMaterial( { color: c[4], shading: THREE.FlatShading } )
     ]);
}

function Octahedron (scene, origin, scale, uvs, texturePath, topUVSets, bottomUVSets) {
     this.mesh = new THREE.Object3D();
     this.material = this.loadMaterialFromTexture(texturePath);
     var pyramidScale = scale.copy();
     pyramidScale.y /= 1.5;
     this.topPyramid = new Pyramid(scene, Vector3.zero(), pyramidScale, this.material, uvs, topUVSets);
     this.bottomPryamid = new Pyramid(scene, Vector3.zero(), pyramidScale, this.material, uvs, bottomUVSets);
     this.bottomPryamid.rotation.x = Math.PI;
     this.mesh.add(this.topPyramid.mesh);
     this.mesh.add(this.bottomPryamid.mesh);
     this.scene = scene;
     this.setPosition(origin);
     this.scene.add(this.mesh);
}

Octahedron.prototype = new WorldObject();

function Plane (scene, scale, texturePath, angle, u, v) {
     if (scene) {
          this.createPlaneInScene(scene, scale,
               texturePath, angle, u, v);
     }
}

Plane.prototype = new WorldObject();

Plane.prototype.createPlaneInScene = function (scene, scale,
     texturePath, angle, u, v) {
     this.scene = scene;
     this.scale = scale;
     this.setRepeatingMaterialFromTexture(texturePath, u, v);
     this.angle = angle;
     this.geometry = new THREE.PlaneGeometry(scale.x, scale.y);
     this.lateSetup();
     this.setRotation(angle);
}

Plane.createGridCellAtPosition = function (scene, scale, material, angle) {
     var plane = new Plane();
     plane.scene = scene;
     plane.scale = scale;
     plane.material = material;
     plane.angle = angle;
     plane.geometry = new THREE.PlaneGeometry(scale.x, scale.y);
     plane.createMesh();
     plane.setRotation(angle);
     return plane;
}

Plane.createGrid = function (scene, gridPositions, scale, texturePath, angle) {
     var parent = new THREE.Object3D();
     var texture = THREE.ImageUtils.loadTexture(texturePath);
     var material = new THREE.MeshPhongMaterial({map:texture, side:THREE.DoubleSide});
     for (var x = 0; x < gridPositions.length; x++) {
          for (var z = 0; z < gridPositions[x].length; z++) {
               var plane = Plane.createGridCellAtPosition(
                    scene,
                    scale,
                    material,
                    angle);
               parent.add(plane.mesh);
               plane.setPosition(gridPositions[x][z]);
          }
     }
     return parent;
}

function Cube (scene, origin, scale, color) {
     this.scene = scene;
     this.origin = origin;
     this.scale = scale;
     this.color = color;
     this.geometry = new THREE.BoxGeometry(scale.x, scale.y, scale.z);
     this.material = new THREE.MeshBasicMaterial( {color: this.color} );
     this.lateSetup();
     this.setOrigin();
}

Cube.prototype = new WorldObject();

function ActiveFarmObject (scene, position) {
     this.farmObjectSetup(scene, position);
}

ActiveFarmObject.prototype = new WorldObject();

ActiveFarmObject.prototype.farmObjectSetup = function (type, scene, position) {
     this.type = type;
     this.defaultRespondsToValue = false;
     this.setReferences(scene, position);
}

// Override this method in the subclasses:
ActiveFarmObject.prototype.respondsTo = function (item) {
     return this.defaultRespondsToValue;
}

// Each farm object has a string that identifies its type
ActiveFarmObject.prototype.getType = function () {
     return this.type;
}

function PlantObject (scene, position, plantDescriptor) {
     this.farmObjectSetup(scene, position);
     this.plantDescriptor = plantDescriptor;
}

PlantObject.prototype = new ActiveFarmObject();

PlantObject.prototype.plant = function () {
     // TODO: Implement
}

PlantObject.prototype.pick = function () {
     // TODO: Implement
}

PlantObject.prototype.water = function () {
     // TODO: Implement
}

function FarmTile (scene, position) {
     this.farmObjectSetup(scene, position);
     this.isTilled = false;
     this.plant = null;
}

FarmTile.prototype = new ActiveFarmObject();

FarmTile.prototype.hasPlant = function () {
     return this.plant != null;
}

FarmTile.prototype.till = function () {
     this.isTilled = true;
     // TODO: Implement
}

FarmTile.prototype.plant = function (plantObject) {
     // TODO: Implement rest of functionality
     this.plant = plantObject;
     this.isTilled = false;
}

FarmTile.prototype.pickPlant = function () {
     var pickedPlant = this.plant;
     this.plant = null;
     // TODO: Implement rest of functionality

     return pickedPlant;
}

FarmTile.prototype.respondsTo = function (item) {
     var itemKey = item.getType();
     if (itemKey == hoeKey && !this.hasPlant()) {
          return true;
     }  else if (itemKey == seedsKey && this.isTilled) {
          return true;
     } else if (itemKey == wateringCanKey && this.hasPlant()) {
          return true;
     } else if (itemKey == basketKey && this.hasPlant()) {
          return true;
     } else {
          return defaultRespondsToValue;
     }
}

function Tool (scene, owner, toolDescriptor) {
     this.farmObjectSetup(scene, null);
     this.setupTool(scene, owner, toolDescriptor);
}

Tool.prototype = new ActiveFarmObject();

Tool.prototype.setupTool = function (scene, owner, toolDescriptor) {
     this.scene = scene;
     this.owner = owner;
     this.toolDescriptor = toolDescriptor;
}

Tool.prototype.use = function (target) {
     console.log("Override the USE method in subclasses of Tool");
}

Tool.prototype.till = function (farmTile) {
     // TODO: Implement
}

Tool.prototype.plant = function (farmTile) {
     // TODO: Implement
}

Tool.prototype.water = function (plantObject) {
     // TODO: Implement
}

Tool.prototype.pick = function (plantObject) {
     // TODO: Implement
}

function Hoe (scene, owner, hoeDescriptor) {
     setupTool(scene, owner, hoeDescriptor);
}

Hoe.prototype = new Tool();

Hoe.prototype.use = function (target) {
     this.till(target);
}

function Seeds (scene, owner, seedDescriptor) {
     setupTool(scene, owner, seedDescriptor);
}

Seeds.prototype = new Tool();

Seeds.prototype.use = function (target) {
     this.plant(target);
}

function WateringCan (scene, owner, wateringCanDescriptor) {
     setupTool(scene, owner, wateringCanDescriptor);
}

WateringCan.prototype = new Tool();

WateringCan.prototype.use = function (target) {
     this.water(target);
}

function Basket (scene, owner, basketDescriptor) {
     setupTool(scene, owern, basketDescriptor);
}

Basket.prototype = new Tool();

Basket.prototype.use = function (target) {
     this.pick(target);
}
