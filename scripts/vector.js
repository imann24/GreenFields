/**
 * @author: Isaiah Mann
 * @desc: Code Related to 3D & 2D vectors
 */

var yKey = "y";
var xKey = "x";
var zKey = "z";

function Vector () {}

function Vector3 (x, y, z) {
     this.x = isNaN(x) ? 0 : x;
     this.y = isNaN(y) ? 0 : y;
     this.z = isNaN(z) ? 0 : z;
}

Vector3.prototype = new Vector();

Vector3.one = function () {
     return new Vector3(1, 1, 1);
}

Vector3.zero = function () {
     return new Vector3(0, 0, 0);
}

Vector3.scalar = function (scalar) {
     var vector = Vector3.one();
     vector.scale(scalar);
     return vector;
}

Vector3.prototype.scale = function (scalar) {
     this.x *= scalar;
     this.y *= scalar;
     this.z *= scalar;
}

/**
@return Converts Vector3 into the THREE.js equivalent class
*/
Vector3.prototype.toThree = function () {
     return new THREE.Vector3(this.x, this.y, this.z);
}

Vector3.add = function (vector1, vector2) {
     return new Vector3(
          vector1.x + vector2.x,
          vector1.y + vector2.y,
          vector1.z + vector2.z);
}

Vector3.prototype.copy = function () {
     return new Vector3(this.x, this.y, this.z);
}

Vector3.copy = function (vector) {
     return vector.copy();
}

function Vector2 (x, y) {
     this.x = isNaN(x) ? 0 : x;
     this.y = isNaN(y) ? 0 : y;
};

Vector2.prototype = new Vector();

Vector2.prototype.translate = function (x, y) {
     return new Vector2(this.x + x, this.y + y);
}

Vector2.prototype.add = function (otherPoint) {
     return new Vector2(this.x + otherPoint.x, this.y + otherPoint.y);
}

Vector2.prototype.scalar = function (scale) {
     return new Vector2(this.x * scale, this.y * scale);
}

Vector2.prototype.valueOf = function () {
     return "x" + Math.round(this.x / 2) * 2+ "y" + Math.round(this.y / 2) * 2;
}

Vector2.comparePointX = function (point1, point2) {
     if (point1.x > point2.x) {
          return 1;
     } else if (point1.x < point2.x) {
          return -1;
     } else {
          return 0;
     }
};

Vector2.comparePointY = function (point1, point2) {
     if (point1.y > point2.y) {
          return 1;
     } else if (point1.y < point2.y) {
          return -1;
     } else {
          return 0;
     }
};

Vector2.getXDifference = function (point1, point2) {
     return point1.x - point2.x;
}

Vector2.getYDifference = function (point1, point2) {
     return point1.y - point2.y;
}

Vector2.getCompareFunction = function (byVector) {
     if (byVector == xKey) {
          return comparePointX;
     } else if (byVector == yKey) {
          return comparePointY;
     }
}

Vector2.getDifferenceFunction = function (byVector) {
     if (byVector == xKey) {
          return getXDifference;
     } else if (byVector == yKey) {
          return getYDifference;
     }
}

Vector2.sortPointList = function (pointList, byVector) {
     var compareFunction = getCompareFunction(byVector);
     return pointList.sort(compareFunction);
}

Vector2.getMatchingPoints = function (point, pointList, byVector) {
     var compareFunction = getCompareFunction(byVector);
     var matchingPoints = [];
     for (var i = 0; i < pointList.length; i++) {
          if (compareFunction(point, pointList[i]) == 0) {
               matchingPoints.push(pointList[i]);
          }
     }
     return matchingPoints;
}

Vector2.getSimilarPoints = function (point, pointList, byVector, tolerance) {
     var differenceFunction = getDifferenceFunction(byVector);
     var similarPoints = [];
     for (var i = 0; i < pointList.length; i++) {
          if (differenceFunction(point, pointList[i]) <= tolerance) {
               similarPoints.push(pointList[i]);
          }
     }
     return similarPoints;
}

Vector2.getMaxPoint = function (pointList, byVector) {
     return sortPointList(pointList, byVector)[pointList.length - 1];
}

Vector2.getMinPoint = function (pointList, byVector) {
     return sortPointList(pointList, byVector)[0];
}
