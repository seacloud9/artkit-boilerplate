
import * as THREE from 'three'; // 0.87.1
export default Quad = function(p0, p1, p2, p3) {

	var scope = this;

	THREE.Geometry.call(this);
	//scope.verticesNeedUpdate = true
	scope.vertices.push(p0, p1, p2, p3);
	

    f3(0, 1, 2);
	f3(0, 3, 2);

    //this.computeCentroids();
    //this.computeFaceNormals();
    //this.sortFacesByMaterial();


	function f3(a, b, c) {
		scope.faces.push(new THREE.Face3(a, b, c));
	}

}

Quad.prototype = new THREE.Geometry();
Quad.prototype.constructor = Quad;
