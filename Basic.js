import Expo from 'expo';
import React from 'react';
import * as THREE from 'three'; // 0.87.1
import ExpoTHREE from 'expo-three'; // 2.0.2
import 'ar.js/three.js/build/ar';

THREEx.ArToolkitContext.baseURL = './'
console.disableYellowBox = true;

export default class Basic extends React.Component {
    render() {
        return ( <
            Expo.GLView ref = {
                (ref) => this._glView = ref
            }
            style = {
                {
                    flex: 1
                }
            }
            onContextCreate = {
                this._onGLContextCreate
            }
            />
        );
    }

    _onGLContextCreate = async(gl) => {
        const width = gl.drawingBufferWidth;
        const height = gl.drawingBufferHeight;

        const arSession = await this._glView.startARSessionAsync();

        const scene = new THREE.Scene();
        const camera = ExpoTHREE.createARCamera(arSession, width, height, 0.01, 1000);
        const renderer = ExpoTHREE.createRenderer({
            gl
        });
        renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);

        scene.background = ExpoTHREE.createARBackgroundTexture(arSession, renderer);

       
       
        const geometry2 = new THREE.BoxGeometry(0.07, 0.07, 0.07);
        const material2 = new THREE.MeshBasicMaterial({
            color: 0x00ff00
        });
        const cube = new THREE.Mesh(_geometry2, _material2);
        cube.position.z = -0.4;
        scene.add(cube);
        var nowMsec = 0
        var lastTimeMsec = null
        const animate = (nowMsec) => {
            requestAnimationFrame(animate);

            cube.rotation.x += 0.07;
            cube.rotation.y += 0.04;

            renderer.render(scene, camera);
            gl.endFrameEXP();

            lastTimeMsec	= lastTimeMsec || nowMsec-1000/60
            var deltaMsec	= Math.min(200, nowMsec - lastTimeMsec)
            lastTimeMsec	= nowMsec
         
           
            onRenderFcts.forEach(function(onRenderFct){
              onRenderFct(deltaMsec/1000, nowMsec/1000)
            })
           

        }
        animate(nowMsec);
    }
}