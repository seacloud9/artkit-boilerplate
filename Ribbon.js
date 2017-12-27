import * as THREE from 'three'; // 0.87.1
import {ribbonGroup} from './RibbonGroup'
import RibbonCurve from './RibbonCurve'
import ATUtil from './ATUtil'
export default Ribbon = function(hue) {

	//number of ribbonCurves per ribbon
	this.NUMCURVES = 30;
	this.RIBBONWIDTH = 2;
	//lower -> faster
	this.CURVERESOLUTION = 20;
	this.pts = [];
	this.curves = [];
	this.stepId = 0;
	this.colorPool = [0x45FF59, 0x23CC94, 0x41997C, 0xFF35DA, 0xAF23CC];

    function random_item(items)
    {
        return items[Math.floor(Math.random()*items.length)];
    }


	this.material = new THREE.MeshBasicMaterial({
		color : random_item(this.colorPool),
		opacity : .5,
		side: THREE.DoubleSide,
		//blending : THREE.AdditiveBlending,
		depthTest : false,
		transparent : true,
		needsUpdate: true,
		wireframe : false

	});
    this.material.colorPool = this.colorPool;
    this.material.random_item = random_item;

	
	this.material.color.setHSV(new THREE.Color(), hue, 1, 1);

	this.pts.push(this.getRandPt());
	this.pts.push(this.getRandPt());
	this.pts.push(this.getRandPt());

	this.addRibbonCurve();
};

Ribbon.prototype.toggleWireframe = function(){
	
	this.material.wireframe = !this.material.wireframe;
}

Ribbon.prototype.getRandPt = function() {
	return THREE.ribbonGroup.ribbonTarget.clone().add(ATUtil.getRandVec3D(-THREE.ribbonGroup.ribbonSeparation, THREE.ribbonGroup.ribbonSeparation));
}

Ribbon.prototype.update = function() {

	this.currentCurve.addSegment();

	if(this.curves.length > this.NUMCURVES - 1) {
		this.curves[0].removeSegment();
	}
	this.stepId++;

	if(this.stepId > this.CURVERESOLUTION) {
		this.addRibbonCurve();
	}

}

Ribbon.prototype.addRibbonCurve = function() {

	//add new point
	var p3d = this.getRandPt();
	this.pts.push(p3d);

	var nextPt = this.pts[this.pts.length - 1];
	var curPt = this.pts[this.pts.length - 2];
	var lastPt = this.pts[this.pts.length - 3];
	var lastMidPt = new THREE.Vector3((curPt.x + lastPt.x) / 2, (curPt.y + lastPt.y) / 2, (curPt.z + lastPt.z) / 2);
	var midPt = new THREE.Vector3((curPt.x + nextPt.x) / 2, (curPt.y + nextPt.y) / 2, (curPt.z + nextPt.z) / 2);

	this.currentCurve = new RibbonCurve(lastMidPt, midPt, curPt, this.RIBBONWIDTH, this.CURVERESOLUTION, this.material);
	this.curves.push(this.currentCurve);

	//remove old curves
	if(this.curves.length > this.NUMCURVES) {
		var c = this.curves.shift();
		c.remove();
	}

	this.stepId = 0;

}