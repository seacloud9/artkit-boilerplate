import * as THREE from 'three'; // 0.87.1
import Ribbon from './Ribbon'
import ATUtil from './ATUtil'

THREE.Color.prototype.setHSV = function ( color, h, s, v ) {

		// https://gist.github.com/xpansive/1337890#file-index-js

		h = THREE.Math.euclideanModulo( h, 1 );
		s = THREE.Math.clamp( s, 0, 1 );
		v = THREE.Math.clamp( v, 0, 1 );

		return color.setHSL( h, ( s * v ) / ( ( h = ( 2 - s ) * v ) < 1 ? h : ( 2 - h ) ), h * 0.5 );

}


export default RibbonGroup = function(scene) {

	this.RIBBONCOUNT = 6;
	this.SPREAD = 300;
	this.MAXSEPARATION = 30;
	this.ribbons = [];
	this.ribbonTarget = ATUtil.getRandVec3D(-this.SPREAD, this.SPREAD);
	this.ribbonSeparation = 10;
	this.ribbonHolder = new THREE.Object3D();
	scene.add(this.ribbonHolder);
};

RibbonGroup.prototype.init = function() {

	for(var i = 0; i < this.RIBBONCOUNT; i++) {
		this.ribbons.push(new Ribbon(ATUtil.map(i, 0, this.RIBBONCOUNT, 0, 1), this));
	}
}

RibbonGroup.prototype.toggleWireframe = function() {

	for(var i = 0; i < this.RIBBONCOUNT; i++) {
		this.ribbons[i].toggleWireframe();
	}
}

RibbonGroup.prototype.update = function() {

	this.ribbonHolder.rotation.y += .01;
	this.ribbonTarget = ATUtil.getRandVec3D(-this.SPREAD, this.SPREAD);
	this.ribbonSeparation = ATUtil.getRand(0, this.MAXSEPARATION);

	for(var i = 0; i < this.RIBBONCOUNT; i++) {
		this.ribbons[i].update();
	}

}

