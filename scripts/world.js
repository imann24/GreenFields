/**
 * @author: Isaiah Mann
 * @desc: Used to draw 3D shapes in the world
 * @requires: THREE.js
 */

var instanceCount = 0;
var idKey = "WorldObject";

function World (scene) {
     this.scene = scene;
     this.worldObjects = [];
}

World.prototype.add = function (worldObject) {
     this.scene.add(worldObject.mesh);
     this.worldObjects.push(worldObject);
}

World.prototype.getObjectsWithColliders = function () {
     var objectsWithColliders = [];
     for (var i = 0; i < this.worldObjects.length; i++) {
          var currentObject = this.worldObjects[i];
          if (currentObject.hasCollider()) {
               objectsWithColliders.push(currentObject);
          }
     }
     return objectsWithColliders;
}

World.prototype.getAllCollisions = function () {
     var objects = this.getObjectsWithColliders();
     var collisions = [];
     var collisionHash = {};
     for (var i = 0; i < objects.length; i++) {
          collisionHash[i] = [];
          for (var j = 0; j < objects.length; j++) {
               // Don't compare this object to itself
               if (i == j ||
                    (collisionHash[j] &&
                         collisionHash[j].includes(i))) {
                    continue;
               } else if (objects[i].isCollidingWith(objects[j])){
                    collisions.push(
                         new Collision(objects[i], objects[j]));
                    collisionHash[i].push(j);
               }
          }
     }
     return collisions;
}

World.prototype.getCollisionsWithObject = function (object) {
     var collisions = [];
     if (object.hasCollider()) {
          var allColliders = this.getObjectsWithColliders();
          for (var i = 0; i < allColliders.length; i++) {
               if (object === allColliders[i]) {
                    continue;
               } else if (object.isCollidingWith(allColliders[i])) {
                    collisions.push(allColliders[i]);
               }
          }
     }
     return collisions;
}

function WorldObject () {
     this.ownsCollider = false;
     this.id = idKey + (++instanceCount);
     this.children = [];
     this.childrenTransforms = {};
}

WorldObject.prototype = {
     get position  () {
          return this.mesh.position;
     },
     get rotation  () {
          return this.mesh.rotation;
     },
}

// Static constructor to create an object from an already created mesh
WorldObject.objectFromMesh = function (world, mesh) {
     var obj = new WorldObject();
     obj.mesh = mesh;
     world.add(obj);
     return obj;
}

WorldObject.prototype.getId = function () {
     return this.id;
}

WorldObject.prototype.setId = function (newId) {
     this.id = newId;
}

WorldObject.prototype.setReferences = function (world, position) {
     this.world = world;
     this.position = position;
}

WorldObject.prototype.earlySetup = function (world, origin, scale, material, uvCoordinates, uvOrders) {
     this.geometry = new THREE.Geometry();
     this.world = world;
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
     this.addToWorld();
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

WorldObject.prototype.addToWorld = function () {
     this.world.add(this);
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

WorldObject.prototype.hasCollider = function () {
     return this.ownsCollider;
}

WorldObject.prototype.addCollider = function () {
     this.ownsCollider = true;
     this.updateCollider();
}

WorldObject.prototype.updateCollider = function () {
     this.collider = new THREE.Box3().setFromObject(this.mesh);
}

WorldObject.prototype.isCollidingWith = function (worldObject) {
     return this.collider.intersectsBox(worldObject.collider);
}

// Origin and scale should be Vector3 objects. Origin is the center of the base
function Pyramid (world, origin, scale, material, uvCoordinates, uvOrders) {
     this.earlySetup(world, origin, scale, material, uvCoordinates, uvOrders);
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

function Octahedron (world, origin, scale, uvs, texturePath, topUVSets, bottomUVSets) {
     this.mesh = new THREE.Object3D();
     this.material = this.loadMaterialFromTexture(texturePath);
     var pyramidScale = scale.copy();
     pyramidScale.y /= 1.5;
     this.topPyramid = new Pyramid(world, Vector3.zero(), pyramidScale, this.material, uvs, topUVSets);
     this.bottomPryamid = new Pyramid(world, Vector3.zero(), pyramidScale, this.material, uvs, bottomUVSets);
     this.bottomPryamid.rotation.x = Math.PI;
     this.mesh.add(this.topPyramid.mesh);
     this.mesh.add(this.bottomPryamid.mesh);
     this.scene = scene;
     this.setPosition(origin);
     this.scene.add(this.mesh);
}

Octahedron.prototype = new WorldObject();

function Plane (world, scale, texturePath, angle, u, v) {
     if (world) {
          this.createPlaneInScene(world, scale,
               texturePath, angle, u, v);
     }
}

Plane.prototype = new WorldObject();

Plane.prototype.createPlaneInScene = function (world, scale,
     texturePath, angle, u, v) {
     this.scene = scene;
     this.scale = scale;
     this.setRepeatingMaterialFromTexture(texturePath, u, v);
     this.angle = angle;
     this.geometry = new THREE.PlaneGeometry(scale.x, scale.y);
     this.lateSetup();
     this.setRotation(angle);
}

Plane.createGridCellAtPosition = function (world, scale, material, angle) {
     var plane = new Plane();
     plane.world = world;
     plane.scale = scale;
     plane.material = material;
     plane.angle = angle;
     plane.geometry = new THREE.PlaneGeometry(scale.x, scale.y);
     plane.createMesh();
     plane.setRotation(angle);
     world.add(plane);
     return plane;
}

Plane.createGrid = function (world, gridPositions, scale, texturePath, angle) {
     var parent = new THREE.Object3D();
     var texture = THREE.ImageUtils.loadTexture(texturePath);
     for (var x = 0; x < gridPositions.length; x++) {
          for (var z = 0; z < gridPositions[x].length; z++) {
               var material = new THREE.MeshPhongMaterial({map:texture, side:THREE.DoubleSide});
               var plane = Plane.createGridCellAtPosition(
                    world,
                    scale,
                    material,
                    angle);
               parent.add(plane.mesh);
               plane.setPosition(gridPositions[x][z]);
               plane.addCollider();
               plane.setId("Tile: (" + x + ", " + z + ")");
          }
     }
     return parent;
}

function Cube (world, origin, scale, color) {
     this.world = world;
     this.origin = origin;
     this.scale = scale;
     this.color = color;
     this.geometry = new THREE.BoxGeometry(scale.x, scale.y, scale.z);
     this.material = new THREE.MeshBasicMaterial( {color: this.color} );
     this.lateSetup();
     this.setOrigin();
}

Cube.prototype = new WorldObject();

function ActiveFarmObject (world, position) {
     this.farmObjectSetup(world, position);
}

ActiveFarmObject.prototype = new WorldObject();

ActiveFarmObject.prototype.farmObjectSetup = function (type, world, position) {
     this.type = type;
     this.defaultRespondsToValue = false;
     this.setReferences(world, position);
}

// Override this method in the subclasses:
ActiveFarmObject.prototype.respondsTo = function (item) {
     return this.defaultRespondsToValue;
}

// Each farm object has a string that identifies its type
ActiveFarmObject.prototype.getType = function () {
     return this.type;
}

function PlantObject (world, position, plantDescriptor) {
     this.farmObjectSetup(world, position);
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

function FarmTile (world, position) {
     this.farmObjectSetup(world, position);
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

function Tool (world, owner, toolDescriptor) {
     this.farmObjectSetup(world, null);
     this.setupTool(world, owner, toolDescriptor);
}

Tool.prototype = new ActiveFarmObject();

Tool.prototype.setupTool = function (world, owner, toolDescriptor) {
     this.world = world;
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

function Hoe (world, owner, hoeDescriptor) {
     setupTool(world, owner, hoeDescriptor);
}

Hoe.prototype = new Tool();

Hoe.prototype.use = function (target) {
     this.till(target);
}

function Seeds (world, owner, seedDescriptor) {
     setupTool(world, owner, seedDescriptor);
}

Seeds.prototype = new Tool();

Seeds.prototype.use = function (target) {
     this.plant(target);
}

function WateringCan (world, owner, wateringCanDescriptor) {
     setupTool(world, owner, wateringCanDescriptor);
}

WateringCan.prototype = new Tool();

WateringCan.prototype.use = function (target) {
     this.water(target);
}

function Basket (world, owner, basketDescriptor) {
     setupTool(world, owern, basketDescriptor);
}

Basket.prototype = new Tool();

Basket.prototype.use = function (target) {
     this.pick(target);
}
