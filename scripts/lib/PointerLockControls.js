/**
 * @author mrdoob / http://mrdoob.com/, Project-specific modifications by Isaiah Mann
 */

THREE.PointerLockControls = function ( target ) {
	var scope = this;
	this.xRotationEnabled = true;
	this.yRotationEnabled = true;
	target.rotation.set( 0, 0, 0 );

	var pitchObject = new THREE.Object3D();
	pitchObject.add( target );

	var yawObject = new THREE.Object3D();
	yawObject.position.y = 10;
	yawObject.add( pitchObject );

	var PI_2 = Math.PI / 2;

	var onMouseMove = function ( event ) {

		if ( scope.enabled === false ) return;

		var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
		var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;
		if (scope.yRotationEnabled) {
			yawObject.rotation.y -= movementX * 0.002;
		}
		if (scope.xRotationEnabled) {
			pitchObject.rotation.x -= movementY * 0.002;
		}
		if (scope.xRotationEnabled) {
			pitchObject.rotation.x = Math.max( - PI_2, Math.min( PI_2, pitchObject.rotation.x ) );
		}
	};

	this.dispose = function() {

		document.removeEventListener( 'mousemove', onMouseMove, false );

	};

	document.addEventListener( 'mousemove', onMouseMove, false );

	this.enabled = false;

	this.getObject = function () {

		return yawObject;

	};

	this.toggleXRotationEnabled = function () {
		this.xRotationEnabled = !this.xRotationEnabled;
	};

	this.toggleYRotationEnabled = function () {
		this.yRotationEnabled = !this.yRotationEnabled;
	};

	this.updateTarget = function (target) {
		this.target = target;
	}

	this.getDirection = function() {
		// assumes the target itself is not rotated
		var direction = new THREE.Vector3( 0, 0, - 1 );
		var rotation = new THREE.Euler( 0, 0, 0, "YXZ" );
		return function( v ) {
			rotation.set(pitchObject.rotation.x, pitchObject.rotation.y, 0 );
			v.copy( direction ).applyEuler( rotation );
			return v;
		};

	}();

};
