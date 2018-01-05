import Expo from 'expo';
import React from 'react';
import * as THREE from 'three'; // 0.87.1
import ExpoTHREE from 'expo-three'; // 2.0.2
import RibbonGroup from './RibbonGroup'
import './FresnelShader'
console.disableYellowBox = true;

export default class App extends React.Component {
  render() {
    return (
      <Expo.GLView
        ref={(ref) => this._glView = ref}
        style={{ flex: 1 }}
        onContextCreate={this._onGLContextCreate}
      />
    );
  }

  generateCube(arSession, renderer){
    const shader = THREE.FresnelShader;
		var uniforms = THREE.UniformsUtils.clone( shader.uniforms );
    uniforms[ "tCube" ].value = ExpoTHREE.createARBackgroundTexture(arSession, renderer);
		var material = new THREE.ShaderMaterial( {
					uniforms: uniforms,
					vertexShader: shader.vertexShader,
					fragmentShader: shader.fragmentShader
    } )
    material.needsUpdate = true
    return material
  }

  _onGLContextCreate = async (gl) => {
    const width = gl.drawingBufferWidth;
    const height = gl.drawingBufferHeight;

    const arSession = await this._glView.startARSessionAsync();

    const scene = new THREE.Scene();
    const camera = ExpoTHREE.createARCamera(arSession, width, height, 0.01, 1000);
    const renderer = ExpoTHREE.createRenderer({ gl });
    renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);

    scene.background = ExpoTHREE.createARBackgroundTexture(arSession, renderer);
    //scene.background  = THREE.RGBFormat
    THREE.ribbonGroup = new RibbonGroup(scene)
	  THREE.ribbonGroup.init();


    // Edit the box dimensions here and see changes immediately!
    const geometry = new THREE.BoxGeometry(0.07, 0.07, 0.07);
    //const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

	  
    //const mat = this.generateCube(arSession, renderer)
    //var cube = new THREE.Mesh(geometry, mat);
    //cube.position.z = -0.4;
    //scene.add(cube);

    const animate = () => {
      requestAnimationFrame(animate);
      THREE.ribbonGroup.update()
      renderer.render(scene, camera);
      gl.endFrameEXP();
    }
    animate();
  }
}

